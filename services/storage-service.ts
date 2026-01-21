
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';
import { autoCompressImage } from '../lib/image-processing';

// --- STORAGE CONSTANTS ---
const MAX_FILE_SIZE = 15 * 1024 * 1024; // Naik ke 15MB limit buat upload mentah

// --- HELPER: VALIDATOR ---
const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`Waduh kegedean Bos! Maksimal 15MB biar server gak pingsan.`);
    }
};

// --- HYBRID UPLOAD SYSTEM ---

// 1. Upload ke Supabase (Temporary/Fast Storage)
export const uploadToSupabase = async (file: File, folder: string = 'temp', bucketName: string = 'images') => {
    if (!supabase) throw new Error("Supabase Offline");
    
    validateFile(file);

    // Otomatis kompres jika ini gambar dan ukurannya > 3MB (Naik dari 1.5MB)
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
        fileToUpload = await autoCompressImage(file, 3);
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substr(2, 5)}.${fileExt}`;
    
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
    // Jika file mentah raksasa (>3MB), sikat pake mode High Quality (0.95)
    if (fileOrBlob instanceof File && fileOrBlob.size > 3 * 1024 * 1024) {
        finalFile = await autoCompressImage(fileOrBlob, 3);
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
