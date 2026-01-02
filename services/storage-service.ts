
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';

// --- STORAGE HELPERS (HYBRID STRATEGY) ---

// 1. Upload to Supabase (Fast, Temporary or Private)
export const uploadToSupabase = async (file: File, folder: string = 'temp', bucketName: string = 'images') => {
    if (!supabase) throw new Error("Supabase not connected");
    
    // Sanitize filename
    const fileExt = file.name.split('.').pop();
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 30);
    const fileName = `${folder}/${Date.now()}_${cleanName}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
        .from(bucketName) // Use dynamic bucket
        .upload(fileName, file);

    if (uploadError) throw uploadError;

    // For public buckets, we return the public URL.
    // For private buckets (like 'careers'), this URL won't work publicly, 
    // but we still return it structure-wise. 
    // IMPORTANT: Caller must use `path` for private buckets.
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return { url: data.publicUrl, path: fileName };
};

// NEW: Get Signed URL for Private Access (Secure Download)
export const getSignedUrl = async (bucketName: string, path: string, expiresIn: number = 60) => {
    if (!supabase) throw new Error("Supabase not connected");
    
    const { data, error } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(path, expiresIn); // URL valid for 60 seconds by default

    if (error) throw error;
    return data.signedUrl;
};

// 2. Upload to Cloudinary (Permanent, Optimized)
export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Config Missing");
    
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

        // C. Delete Temp File from Supabase
        await deleteFromSupabase(sbPath, 'images');
        
        console.log(`[Background] Migration Complete for ${tableName} #${recordId}`);
        return cloudUrl;
    } catch (e) {
        console.error("[Background] Migration Failed:", e);
        return null;
    }
};
