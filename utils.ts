
import { createClient } from '@supabase/supabase-js';
import { Product, Article, GalleryItem, Testimonial, JobOpening } from './types';
import { GoogleGenAI } from "@google/genai";

// --- Environment Helpers ---
export const getEnv = (key: string) => {
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
  } catch (e) {}

  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && (window as any).process && (window as any).process.env) {
      // @ts-ignore
      return (window as any).process.env[key] || '';
    }
  } catch (e) {}

  return '';
};

// --- API KEY MANAGEMENT ---
export const ensureAPIKey = async () => {
  try {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
         // @ts-ignore
         await window.aistudio.openSelectKey();
      }
      return true;
    }
  } catch (e) {
    console.warn("AIStudio check failed", e);
  }
  return false;
};

// --- CENTRALIZED API CALLER ---
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}) => {
  let selectedKey = '';
  // @ts-ignore
  const isAIStudio = typeof window !== 'undefined' && window.aistudio;

  if (isAIStudio) {
      await ensureAPIKey();
      selectedKey = process.env.API_KEY || '';
  } else {
      const keys: string[] = [];
      for (let i = 1; i <= 10; i++) {
          const k = getEnv(`VITE_GEMINI_API_KEY_${i}`) || getEnv(`VITE_API_KEY_${i}`);
          if (k && k.length > 10) keys.push(k);
      }
      const kSingle = getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY') || getEnv('API_KEY');
      if (kSingle && kSingle.length > 10) keys.push(kSingle);

      const uniqueKeys = [...new Set(keys)];
      if (uniqueKeys.length > 0) {
          selectedKey = uniqueKeys[Math.floor(Math.random() * uniqueKeys.length)];
      }
  }

  if (selectedKey) {
      // @ts-ignore
      if (typeof window !== 'undefined') {
          // @ts-ignore
          window.process = window.process || { env: {} };
          // @ts-ignore
          window.process.env = window.process.env || {};
          // @ts-ignore
          window.process.env.API_KEY = selectedKey;
      }
      try { process.env.API_KEY = selectedKey; } catch(e) {}
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const result = await ai.models.generateContent({
      model: params.model,
      contents: params.contents,
      config: params.config
    });
    return result;
  } catch (error: any) {
    console.error("Gemini API Call Failed:", error);
    throw error;
  }
};

// --- Configuration ---
export const CONFIG = {
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL'),
  SUPABASE_KEY: getEnv('VITE_SUPABASE_ANON_KEY'),
  CLOUDINARY_CLOUD_NAME: getEnv('VITE_CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_PRESET: getEnv('VITE_CLOUDINARY_UPLOAD_PRESET'),
};

// --- Clients ---
export const supabase = (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY) 
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY) 
  : null;

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


// --- Formatters ---
export const formatRupiah = (number: number) => {
  if (typeof number !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

export const formatNumberInput = (value: string | number) => {
  const valStr = String(value);
  const raw = valStr.replace(/\D/g, '');
  if (!raw) return '';
  return new Intl.NumberFormat('id-ID').format(parseInt(raw));
};

export const cleanNumberInput = (value: string) => {
  return parseInt(value.replace(/\./g, '') || '0');
};

export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     
    .replace(/[^\w\-]+/g, '') 
    .replace(/\-\-+/g, '-');  
};

// --- SEO INJECTION HELPERS ---
export const injectGoogleTags = (gaId?: string, gscCode?: string) => {
  if (typeof window === 'undefined') return;

  if (gaId && !document.getElementById('ga-script')) {
    const script = document.createElement('script');
    script.id = 'ga-script';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    const inlineScript = document.createElement('script');
    inlineScript.id = 'ga-inline';
    inlineScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}');
    `;
    document.head.appendChild(inlineScript);
  }

  if (gscCode && !document.querySelector('meta[name="google-site-verification"]')) {
    const meta = document.createElement('meta');
    meta.name = "google-site-verification";
    meta.content = gscCode;
    document.head.appendChild(meta);
  }
};

// --- Mock Data ---
export const INITIAL_PRODUCTS: Product[] = [
  { id: 1, name: "Paket Kasir Android Lite", price: 2500000, category: "Android POS", description: "Solusi hemat untuk UMKM.", image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800" },
  { id: 2, name: "Paket Resto Pro Windows", price: 7500000, category: "Windows POS", description: "Sistem kasir restoran lengkap.", image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800" }
];

export const INITIAL_ARTICLES: Article[] = [
  { id: 1, title: "Android POS vs Windows POS", excerpt: "Analisis mendalam...", content: "Content...", date: "14 Feb 2024", image: "https://images.unsplash.com/photo-1556742111-a301076d9d18", category: "Hardware Review", author: "Amin", readTime: "5 min", status: 'published' }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { id: 101, title: "Kopi Senja", category_type: 'digital', platform: 'web', image_url: "https://cdn.dribbble.com/users/1615584/screenshots/15710288/media/6c7a695e5d4f0a94792a106d5bc0eb6d.jpg", description: "Web App.", client_url: "#" }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  { id: 1, client_name: "Pak Budi", business_name: "Kopi Senja", content: "Bagus.", rating: 5, image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d", is_featured: true }
];

export const INITIAL_JOBS: JobOpening[] = [
  { id: 1, title: "Marketing", division: "Sales", type: "Full-time", location: "Solo", description: "Jualan.", requirements: "Semangat.", is_active: true }
];
