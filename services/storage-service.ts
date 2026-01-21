
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';
import { autoCompressImage } from '../lib/image-processing';

// --- SECURITY CONSTANTS ---
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // Naik ke 10MB karena nanti kita kompres otomatis
const MAX_DOC_SIZE = 5 * 1024 * 1024;   // 5MB (CV Pelamar)
const MAX_DRIVER_SIZE = 100 * 1024 * 1024; // 100MB (Driver/Software)

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
const ALLOWED_CV_MIMES = ['application/pdf'];

// --- HELPER: VALIDATOR ---
const validateFile = (file: File, context: 'image' | 'career' | 'download') => {
    // 1. Image Validation
    if (context === 'image') {
        if (!ALLOWED_IMAGE_MIMES.includes(file.type)) {
            throw new Error(`Format file haram! Gunakan JPG, PNG, atau WEBP.`);
        }
        // Limit fisik tetap ada di 10MB buat jaga-jaga file monster
        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error(`File kegedean parah, Bos! Maksimal 10MB buat diproses auto-compress.`);
        }
    }
    // 2. Career/CV Validation
    else if (context === 'career') {
        if (!ALLOWED_CV_MIMES.includes(file.type)) {
            throw new Error(`CV wajib format PDF biar rapi.`);
        }
        if (file.size > MAX_DOC_SIZE) {
            throw new Error(`CV maksimal 5MB. Kecilin dulu PDF-nya.`);
        }
    }
    // 3. Download/Driver Validation
    else if (context === 'download') {
        if (file.size > MAX_DRIVER_SIZE) {
            throw new Error(`File driver maksimal 100MB via sistem ini. Gunakan G-Drive untuk file raksasa.`);
        }
        if (file.name.endsWith('.php') || file.name.endsWith('.html') || file.name.endsWith('.sh')) {
             throw new Error(`Format file berbahaya ditolak.`);
        }
    }
};

// --- STORAGE HELPERS (HYBRID STRATEGY) ---

// 1. Upload to Supabase (Fast, Temporary or Private)
export const uploadToSupabase = async (file: File, folder: string = 'temp', bucketName: string = 'images') => {
    if (!supabase) throw new Error("Supabase not connected");
    
    // SECURITY CHECK
    let context: 'image' | 'career' | 'download' = 'image';
    if (bucketName === 'careers') context = 'career';
    else if (bucketName === 'downloads') context = 'download';
    
    validateFile(file, context);

    // AUTO-FIX: Jika ini gambar dan masih kegedean (>2MB), kita sikat pake compressor
    let fileToUpload = file;
    if (context === 'image') {
        fileToUpload = await autoCompressImage(file, 2);
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const cleanName = fileToUpload.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50); 
    const fileName = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
        .from(bucketName) 
        .upload(fileName, fileToUpload, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return { url: data.publicUrl, path: fileName };
};

// Get Signed URL
export const getSignedUrl = async (bucketName: string, path: string, expiresIn: number = 60) => {
    if (!supabase) throw new Error("Supabase not connected");
    const { data, error } = await supabase.storage.from(bucketName).createSignedUrl(path, expiresIn); 
    if (error) throw error;
    return data.signedUrl;
};

// 2. Upload to Cloudinary (Permanent, Optimized)
export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Config Missing");
    
    let processedFile = fileOrBlob;
    if (fileOrBlob instanceof File) {
        validateFile(fileOrBlob, 'image');
        // Auto compress sebelum kirim ke Cloudinary biar hemat bandwidth
        processedFile = await autoCompressImage(fileOrBlob, 2);
    }

    const formData = new FormData();
    formData.append('file', processedFile);
    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/auto/upload`, { 
        method: 'POST', 
        body: formData 
    });
    
    if (!res.ok) throw new Error("Cloudinary Upload Failed");
    const data = await res.json();
    return data.secure_url; 
};

// 3. Delete from Supabase
export const deleteFromSupabase = async (path: string, bucketName: string = 'images') => {
    if (!supabase) return;
    await supabase.storage.from(bucketName).remove([path]);
};

// 4. Background Migration Process
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
