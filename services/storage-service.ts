
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';
import { autoCompressImage } from '../lib/image-processing';

const MAX_FILE_SIZE = 25 * 1024 * 1024;

const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Waduh, ini file apa gajah? Maksimal 25MB Bos!`);
    }
};

// Log ke Database Registry (Asset Inventory)
const logAssetToDb = async (asset: { url: string, path: string, name: string, size: number, type: string }) => {
    if (!supabase) return;
    try {
        // Pake upsert berdasarkan URL biar gak duplikat
        await supabase.from('media_assets').upsert([{
            url: asset.url,
            storage_path: asset.path,
            file_name: asset.name,
            file_size: `${(asset.size / (1024 * 1024)).toFixed(2)} MB`,
            mime_type: asset.type
        }], { onConflict: 'url' });
    } catch (e) {
        console.warn("Gagal mencatat asset ke registry:", e);
    }
};

export const uploadToSupabase = async (file: File, folder: string = 'temp', bucketName: string = 'images') => {
    if (!supabase) throw new Error("Supabase Offline");
    
    validateFile(file);

    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
        fileToUpload = await autoCompressImage(file);
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
        .from(bucketName) 
        .upload(fileName, fileToUpload, { cacheControl: '3600', upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    
    // LOG KE REGISTRY (Non-blocking)
    logAssetToDb({
        url: data.publicUrl,
        path: fileName,
        name: file.name,
        size: file.size,
        type: file.type
    });

    return { url: data.publicUrl, path: fileName };
};

export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Config Cloudinary Belum Diset di Vercel");
    
    let finalFile = fileOrBlob;
    if (fileOrBlob instanceof File && fileOrBlob.type.startsWith('image/')) {
        finalFile = await autoCompressImage(fileOrBlob);
    }

    const formData = new FormData();
    formData.append('file', finalFile);
    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/auto/upload`, { 
        method: 'POST', 
        body: formData 
    });
    
    if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || "Cloudinary Error");
    }
    
    const data = await res.json();

    // LOG KE REGISTRY (Cloudinary version)
    if (fileOrBlob instanceof File) {
        logAssetToDb({
            url: data.secure_url,
            path: data.public_id,
            name: fileOrBlob.name,
            size: fileOrBlob.size,
            type: fileOrBlob.type
        });
    }

    return data.secure_url; 
};

export const processBackgroundMigration = async (
    file: File, 
    sbPath: string, 
    tableName: string, 
    recordId: number,
    columnName: string = 'image_url' 
) => {
    try {
        const cloudUrl = await uploadToCloudinary(file);
        if (supabase && cloudUrl) {
            const { error } = await supabase.from(tableName).update({ [columnName]: cloudUrl }).eq('id', recordId);
            if (error) throw error;
            // Hapus dari Supabase Storage cuma kalau udah sukses pindah ke Cloudinary
            await supabase.storage.from('images').remove([sbPath]);
        }
        return cloudUrl;
    } catch (e) {
        console.error("Background Migration Failed:", e);
        return null;
    }
};

export const deleteFromSupabase = async (path: string, bucketName: string = 'images') => {
    if (supabase) {
        await supabase.storage.from(bucketName).remove([path]);
        await supabase.from('media_assets').delete().eq('storage_path', path);
    }
};

export const getSignedUrl = async (bucketName: string, path: string, expiresIn: number = 60) => {
    if (!supabase) throw new Error("Supabase Offline");
    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, expiresIn); 
    if (error) throw error;
    return data.signedUrl;
};
