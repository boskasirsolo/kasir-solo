
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';
import { autoCompressImage } from '../lib/image-processing';

// --- STORAGE CONSTANTS ---
const MAX_FILE_SIZE = 25 * 1024 * 1024; // Naik ke 25MB biar bebas upload file 4K mentah

// --- HELPER: VALIDATOR ---
const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Waduh, ini file apa gajah? Maksimal 25MB Bos!`);
    }
};

// --- HYBRID UPLOAD SYSTEM ---

// 1. Upload ke Supabase (Temporary/Fast Storage)
export const uploadToSupabase = async (file: File, folder: string = 'temp', bucketName: string = 'images') => {
    if (!supabase) throw new Error("Supabase Offline");
    
    validateFile(file);

    // Paksa konversi ke WebP untuk semua jenis gambar
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
        fileToUpload = await autoCompressImage(file);
    }

    // Pastikan ekstensi file di storage selalu .webp jika itu gambar
    let fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    if (fileToUpload.type === 'image/webp') {
        fileName += '.webp';
    } else {
        const ext = fileToUpload.name.split('.').pop();
        fileName += `.${ext}`;
    }
    
    const { error: uploadError } = await supabase.storage
        .from(bucketName) 
        .upload(fileName, fileToUpload, { cacheControl: '3600' });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return { url: data.publicUrl, path: fileName };
};

// 2. Upload ke Cloudinary (Permanent Optimized Storage)
export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Missing");
    
    let finalFile = fileOrBlob;
    // Paksa konversi ke WebP jika mentahannya bukan blob ringan
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
    return data.secure_url; 
};

// Get Signed URL
export const getSignedUrl = async (bucketName: string, path: string, expiresIn: number = 60) => {
    if (!supabase) throw new Error("Supabase Offline");
    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, expiresIn); 
    if (error) throw error;
    return data.signedUrl;
};

// Delete from Supabase
export const deleteFromSupabase = async (path: string, bucketName: string = 'images') => {
    if (supabase) await supabase.storage.from(bucketName).remove([path]);
};

// Background Migration
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
