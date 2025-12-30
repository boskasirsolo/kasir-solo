
import { Product, Article, GalleryItem, Testimonial, JobOpening } from './types';

// --- RE-EXPORTS FROM MODULAR ARCHITECTURE ---
export { getEnv, CONFIG } from './config/env';
export { supabase } from './lib/supabase-client';
export { formatRupiah, formatNumberInput, cleanNumberInput, slugify } from './lib/formatters';
export { ensureAPIKey, callGeminiWithRotation } from './services/ai-service';
export { uploadToSupabase, uploadToCloudinary, deleteFromSupabase, processBackgroundMigration } from './services/storage-service';

// --- DOM UTILITIES (Kept here as they manipulate DOM directly) ---
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

// --- MOCK DATA (Static Content) ---
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
