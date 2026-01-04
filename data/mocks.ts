
import { Product, Article, GalleryItem, Testimonial, JobOpening, DownloadItem, Tutorial, FAQ } from '../types';

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
