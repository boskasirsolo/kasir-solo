
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';
import { autoCompressImage } from '../lib/image-processing';

// --- STORAGE CONSTANTS ---
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
        await supabase.from('media_assets').upsert([{
            url: asset.url,
            storage_path: asset.path,
            file_name: asset.name,
            file_size: `${(asset.size / 1024).toFixed(1)} KB`,
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

    let fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    fileName += fileToUpload.type === 'image/webp' ? '.webp' : `.${fileToUpload.name.split('.').pop()}`;
    
    const { error: uploadError } = await supabase.storage
        .from(bucketName) 
        .upload(fileName, fileToUpload, { cacheControl: '3600' });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    
    // LOG KE REGISTRY
    await logAssetToDb({
        url: data.publicUrl,
        path: fileName,
        name: file.name,
        size: file.size,
        type: file.type
    });

    return { url: data.publicUrl, path: fileName };
};

export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Missing");
    
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
    
    if (!res.ok) throw new Error("Cloudinary Error");
    const data = await res.json();

    // LOG KE REGISTRY (Cloudinary version)
    if (fileOrBlob instanceof File) {
        await logAssetToDb({
            url: data.secure_url,
            path: data.public_id,
            name: fileOrBlob.name,
            size: fileOrBlob.size,
            type: fileOrBlob.type
        });
    }

    return data.secure_url; 
};

export const getSignedUrl = async (bucketName: string, path: string, expiresIn: number = 60) => {
    if (!supabase) throw new Error("Supabase Offline");
    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, expiresIn); 
    if (error) throw error;
    return data.signedUrl;
};

export const deleteFromSupabase = async (path: string, bucketName: string = 'images') => {
    if (supabase) {
        await supabase.storage.from(bucketName).remove([path]);
        await supabase.from('media_assets').delete().eq('storage_path', path);
    }
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
        if (supabase) {
            await supabase.from(tableName).update({ [columnName]: cloudUrl }).eq('id', recordId);
        }
        await deleteFromSupabase(sbPath, 'images');
        return cloudUrl;
    } catch (e) {
        return null;
    }
};
