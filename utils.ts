
import { Product, Article, GalleryItem, Testimonial, JobOpening } from './types';

// --- RE-EXPORTS FROM MODULAR ARCHITECTURE ---
export { getEnv, CONFIG } from './config/env';
export { supabase } from './lib/supabase-client';
export { formatRupiah, formatNumberInput, cleanNumberInput, slugify, renameFile } from './lib/formatters';
export { ensureAPIKey, callGeminiWithRotation } from './services/ai-service';
export { uploadToSupabase, uploadToCloudinary, deleteFromSupabase, processBackgroundMigration, getSignedUrl } from './services/storage-service';

// --- TIMEZONE CONSTANTS & HELPERS ---
export const INDONESIA_TIMEZONES = [
  { label: 'WIB (Asia/Jakarta)', value: 'Asia/Jakarta', offset: 7 },
  { label: 'WITA (Asia/Makassar)', value: 'Asia/Makassar', offset: 8 },
  { label: 'WIT (Asia/Jayapura)', value: 'Asia/Jayapura', offset: 9 }
];

export const getTimezoneOffset = (timezoneValue: string): string => {
  const tz = INDONESIA_TIMEZONES.find(t => t.value === timezoneValue);
  const offset = tz ? tz.offset : 7; // Default to 7 (WIB)
  const sign = offset >= 0 ? "+" : "-";
  const pad = (num: number) => num.toString().padStart(2, '0');
  return `${sign}${pad(Math.abs(offset))}:00`;
};

// Convert "YYYY-MM-DDTHH:mm" (Wall Clock Time in selected TZ) to UTC ISO String
export const convertLocalToUTC = (localDateStr: string, timezoneValue: string) => {
  if (!localDateStr) return null;
  const offsetStr = getTimezoneOffset(timezoneValue);
  // Construct a fully qualified ISO string with offset: "2023-01-01T10:00:00+07:00"
  // The Date constructor handles the conversion to UTC automatically.
  const date = new Date(`${localDateStr}:00${offsetStr}`);
  return date.toISOString();
};

// Convert UTC ISO String to "YYYY-MM-DDTHH:mm" (Wall Clock Time in selected TZ) for Input Field
export const convertUTCToLocal = (utcDateStr: string, timezoneValue: string) => {
  if (!utcDateStr) return '';
  const date = new Date(utcDateStr);
  
  // Use Intl to format it to the specific timezone's parts
  const options: Intl.DateTimeFormatOptions = {
    timeZone: timezoneValue,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const formatter = new Intl.DateTimeFormat('en-CA', options); // en-CA gives YYYY-MM-DD format usually
  const parts = formatter.formatToParts(date);
  
  const getPart = (type: string) => parts.find(p => p.type === type)?.value || '00';
  
  // Reconstruct to YYYY-MM-DDTHH:mm
  return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}`;
};

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
