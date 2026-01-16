
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';

// --- SECURITY CONSTANTS ---
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB (Biar hemat storage & bandwidth)
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
        if (file.size > MAX_IMAGE_SIZE) {
            throw new Error(`File kegedean, Bos! Maksimal 2MB. Kompres dulu di tinypng.com`);
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
        // Block dangerous executables from direct upload unless wrapped
        if (file.name.endsWith('.php') || file.name.endsWith('.html') || file.name.endsWith('.sh')) {
             throw new Error(`Format file berbahaya ditolak.`);
        }
    }
};

// --- STORAGE HELPERS (HYBRID STRATEGY) ---

// 1. Upload to Supabase (Fast, Temporary or Private)
export const uploadToSupabase = async (file: File, folder: string = 'temp', bucketName: string = 'images') => {
    if (!supabase) throw new Error("Supabase not connected");
    
    // SECURITY CHECK: Validate before upload
    let context: 'image' | 'career' | 'download' = 'image';
    if (bucketName === 'careers') context = 'career';
    else if (bucketName === 'downloads') context = 'download';
    
    validateFile(file, context);

    // Sanitize filename (Hapus karakter aneh biar aman di URL)
    const fileExt = file.name.split('.').pop();
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50); 
    const fileName = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
        .from(bucketName) 
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (uploadError) throw uploadError;

    // Return structure
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return { url: data.publicUrl, path: fileName };
};

// NEW: Get Signed URL for Private Access (Secure Download)
export const getSignedUrl = async (bucketName: string, path: string, expiresIn: number = 60) => {
    if (!supabase) throw new Error("Supabase not connected");
    
    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(path, expiresIn); 

    if (error) throw error;
    return data.signedUrl;
};

// 2. Upload to Cloudinary (Permanent, Optimized)
export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Config Missing");
    
    // SECURITY CHECK
    if (fileOrBlob instanceof File) {
        validateFile(fileOrBlob, 'image');
    }

    const formData = new FormData();
    formData.append('file', fileOrBlob);
    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
    
    // USE 'auto' instead of 'image' to let Cloudinary decide
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
        console.log(`[Background] Migrating ${tableName} #${recordId} to Cloudinary...`);
        // A. Upload to Cloudinary
        const cloudUrl = await uploadToCloudinary(file);
        
        // B. Update Database
        if (supabase) {
            await supabase.from(tableName).update({ [columnName]: cloudUrl }).eq('id', recordId);
        }

        // C. Delete Temp File from Supabase (Cleanup)
        await deleteFromSupabase(sbPath, 'images');
        
        console.log(`[Background] Migration Complete for ${tableName} #${recordId}`);
        return cloudUrl;
    } catch (e) {
        console.error("[Background] Migration Failed:", e);
        // Kalau gagal, biarin aja pake URL Supabase (Fail-safe)
        return null;
    }
};
