
import { supabase } from '../lib/supabase-client';
import { CONFIG } from '../config/env';

// --- STORAGE HELPERS (HYBRID STRATEGY) ---

// 1. Upload to Supabase (Fast, Temporary)
export const uploadToSupabase = async (file: File, folder: string = 'temp') => {
    if (!supabase) throw new Error("Supabase not connected");
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
        .from('images') // Assumes bucket 'images' exists
        .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('images').getPublicUrl(fileName);
    return { url: data.publicUrl, path: fileName };
};

// 2. Upload to Cloudinary (Permanent, Optimized)
export const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Config Missing");
    const formData = new FormData();
    formData.append('file', fileOrBlob);
    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error("Cloudinary Upload Failed");
    const data = await res.json();
    return data.secure_url;
};

// 3. Delete from Supabase
export const deleteFromSupabase = async (path: string) => {
    if (!supabase) return;
    await supabase.storage.from('images').remove([path]);
};

// 4. Background Migration Process
export const processBackgroundMigration = async (
    file: File, 
    sbPath: string, 
    tableName: string, 
    recordId: number,
    columnName: string = 'image_url' // 'image' or 'image_url'
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
        await deleteFromSupabase(sbPath);
        
        console.log(`[Background] Migration Complete for ${tableName} #${recordId}`);
        return cloudUrl;
    } catch (e) {
        console.error("[Background] Migration Failed:", e);
        return null;
    }
};
