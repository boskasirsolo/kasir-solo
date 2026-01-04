
import { Product, Article, GalleryItem, Testimonial, JobOpening, DownloadItem, Tutorial, FAQ } from './types';

// --- RE-EXPORTS FROM MODULAR ARCHITECTURE ---
export { getEnv, CONFIG } from './config/env';
export { supabase } from './lib/supabase-client';
export { formatRupiah, formatNumberInput, cleanNumberInput, slugify, renameFile, normalizePhone } from './lib/formatters';
export { ensureAPIKey, callGeminiWithRotation } from './services/ai-service';
export { uploadToSupabase, uploadToCloudinary, deleteFromSupabase, processBackgroundMigration, getSignedUrl } from './services/storage-service';

// --- WATERMARK ENGINE (SECURITY) ---
export const addWatermarkToFile = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            resolve(file); // Fallback if canvas fails
            return;
        }

        // Set dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Watermark Configuration
        const text = "PT MESIN KASIR SOLO";
        const fontSize = Math.floor(canvas.width / 15); // Responsive font size
        ctx.font = `900 ${fontSize}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Style 1: Center Diagonal (The Fortress)
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-Math.PI / 6); // -30 degrees
        
        // Shadow/Outline for visibility on any background
        ctx.shadowColor = "rgba(0,0,0,0.8)";
        ctx.shadowBlur = 10;
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0,0,0,0.3)";
        ctx.strokeText(text, 0, 0);

        // Main Text
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)"; // White semi-transparent
        ctx.fillText(text, 0, 0);
        ctx.restore();

        // Style 2: Bottom Right Copyright (Subtle)
        ctx.save();
        const smallSize = Math.floor(canvas.width / 35);
        ctx.font = `bold ${smallSize}px sans-serif`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.shadowColor = "black";
        ctx.shadowBlur = 4;
        ctx.textAlign = 'right';
        ctx.fillText("© Original Asset by MesinKasirSolo.com", canvas.width - 20, canvas.height - 20);
        ctx.restore();

        // Convert back to File
        canvas.toBlob((blob) => {
            if (blob) {
                const watermarkedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                resolve(watermarkedFile);
            } else {
                resolve(file);
            }
        }, file.type, 0.9); // 0.9 quality
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

// --- SEO TARGET CITIES (PROGRAMMATIC DATA) ---
export const TARGET_CITIES = [
  { slug: 'solo', name: 'Solo (Surakarta)', type: 'Kandang' },
  { slug: 'sukoharjo', name: 'Sukoharjo', type: 'Kandang' },
  { slug: 'klaten', name: 'Klaten', type: 'Kandang' },
  { slug: 'boyolali', name: 'Boyolali', type: 'Kandang' },
  { slug: 'sragen', name: 'Sragen', type: 'Kandang' },
  { slug: 'karanganyar', name: 'Karanganyar', type: 'Kandang' },
  { slug: 'wonogiri', name: 'Wonogiri', type: 'Kandang' },
  { slug: 'semarang', name: 'Semarang', type: 'Ekspansi' },
  { slug: 'jogja', name: 'Yogyakarta', type: 'Ekspansi' },
  { slug: 'surabaya', name: 'Surabaya', type: 'Ekspansi' },
  { slug: 'madiun', name: 'Madiun', type: 'Ekspansi' },
  { slug: 'ngawi', name: 'Ngawi', type: 'Ekspansi' },
];

export const getCityData = (slug: string) => {
  return TARGET_CITIES.find(c => c.slug === slug);
};

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
  { 
    id: 1, 
    name: "Paket Kasir Android Lite", 
    price: 2500000, 
    category: "Android POS", 
    description: "Solusi hemat untuk UMKM.", 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
    specs: {
        "OS": "Android 11 Go",
        "RAM": "2GB",
        "Storage": "16GB",
        "Printer": "Thermal 58mm (Built-in)",
        "Layar": "5.5 Inch IPS",
        "Koneksi": "WiFi, 4G, Bluetooth"
    }
  },
  { 
    id: 2, 
    name: "Paket Resto Pro Windows", 
    price: 7500000, 
    category: "Windows POS", 
    description: "Sistem kasir restoran lengkap.", 
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800",
    specs: {
        "OS": "Windows 10 IoT",
        "RAM": "4GB",
        "Storage": "128GB SSD",
        "Printer": "Thermal 80mm Auto-Cutter",
        "Layar": "15.6 Inch Touchscreen",
        "Koneksi": "LAN, WiFi, USB x4"
    }
  }
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

// --- DOWNLOADS MOCK DATA ---
export const INITIAL_DOWNLOADS: DownloadItem[] = [
  {
    id: "drv-001",
    title: "Driver Printer Thermal 58mm (XPrinter/Iware)",
    category: "driver",
    description: "Driver universal untuk printer kasir thermal ukuran 58mm.",
    file_url: "#",
    file_size: "15 MB",
    version: "v2.4.1",
    os_support: "Windows",
    updated_at: "2024-01-10"
  },
  {
    id: "drv-002",
    title: "Driver Printer Thermal 80mm Auto-Cutter",
    category: "driver",
    description: "Driver untuk printer dapur/kasir 80mm dengan fitur auto-cutter.",
    file_url: "#",
    file_size: "18 MB",
    version: "v3.0.5",
    os_support: "Windows",
    updated_at: "2024-02-15"
  },
  {
    id: "man-001",
    title: "Panduan Setting Laci Kasir (Cash Drawer)",
    category: "manual",
    description: "Cara setting agar laci kasir terbuka otomatis saat cetak struk.",
    file_url: "#",
    file_size: "2 MB",
    version: "PDF",
    os_support: "All",
    updated_at: "2023-11-20"
  }
];

export const INITIAL_TUTORIALS: Tutorial[] = [
    { id: 1, title: "Cara Install Driver Printer 58mm", video_url: "https://youtube.com/" },
    { id: 2, title: "Setting Laci Kasir Otomatis", video_url: "https://youtube.com/" },
    { id: 3, title: "Tutorial Input Stok Awal SIBOS", video_url: "https://youtube.com/" }
];

export const INITIAL_FAQS: FAQ[] = [
    { id: 1, question: "Printer tidak terdeteksi?", answer: "Pastikan kabel USB terpasang rapat dan driver sudah diinstall sesuai versi Windows." },
    { id: 2, question: "Laci kasir tidak terbuka?", answer: "Cek kabel RJ11 ke printer. Pastikan settingan printer di Device Settings sudah enable Cash Drawer." }
];
