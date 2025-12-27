import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { Product, Article, GalleryItem } from './types';

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

// Safe init for AI to prevent white screen if key is missing
const apiKey = process.env.API_KEY || "dummy_key_to_prevent_crash";
export const ai = new GoogleGenAI({ apiKey });

// --- Formatters ---
export const formatRupiah = (number: number) => {
  if (typeof number !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// --- Mock Data ---
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Paket Kasir Android Lite",
    price: 2500000,
    category: "Android POS",
    description: "Solusi hemat untuk UMKM, Warkop, dan Coffee Shop. Tablet 8 inch + Printer Thermal High Speed + Stand Kokoh. Siap pakai.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Paket Resto Pro Windows",
    price: 7500000,
    category: "Windows POS",
    description: "Sistem kasir restoran lengkap. PC All-in-One Touchscreen, Printer Dapur & Kasir, Cash Drawer. Support manajemen meja & inventory.",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Kiosk Self-Service Touchscreen",
    price: 15000000,
    category: "Smart Kiosk",
    description: "Mesin pemesanan mandiri 24 inch untuk efisiensi antrian. Terintegrasi pembayaran QRIS & E-Wallet. Modern & Futuristik.",
    image: "https://images.unsplash.com/photo-1585646397275-84e625a4d46c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Paket Retail Minimarket Full",
    price: 5500000,
    category: "Retail POS",
    description: "Paket komputer kasir spek tinggi, Scanner Barcode Omnidirectional, Printer Struk. Mampu menangani 10.000+ SKU barang.",
    image: "https://images.unsplash.com/photo-1580569766020-21a48c66060c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Printer Thermal Bluetooth Portable",
    price: 350000,
    category: "Hardware",
    description: "Printer struk mini ukuran 58mm. Koneksi bluetooth ke HP Android/iOS. Cocok untuk kasir keliling atau food truck.",
    image: "https://images.unsplash.com/photo-1622675235450-482a59a72175?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Scanner Barcode Wireless 2D",
    price: 850000,
    category: "Hardware",
    description: "Scanner barcode tanpa kabel, jangkauan hingga 50 meter. Bisa scan QR Code (e-wallet) dan Barcode batang biasa.",
    image: "https://images.unsplash.com/photo-1579707248386-7a85df71665a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    name: "Cash Drawer Besi RJ11",
    price: 450000,
    category: "Hardware",
    description: "Laci uang bahan metal kokoh. Terbuka otomatis saat struk keluar. Kompatibel dengan semua jenis printer kasir.",
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "Paket Tablet Kasir Ekonomis",
    price: 1800000,
    category: "Android POS",
    description: "Paket starter kit untuk usaha kecil. Tablet 7 inch + Aplikasi Kasir Gratis + Printer Bluetooth. Mudah digunakan.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Battle Royale: Android POS vs Windows POS, Mana Raja Sebenarnya?",
    excerpt: "Analisis mendalam membedah kelebihan, kekurangan, dan biaya tersembunyi antara Kasir Android vs Windows PC untuk bisnis 2024.",
    content: `# Battle Royale: Android POS vs Windows POS

## Pendahuluan
Memilih mesin kasir bukan sekadar beli alat, tapi investasi jangka panjang. Salah pilih, operasional berantakan.

## 1. Android POS: Si Lincah yang Hemat Energi
Kelebihan utama Android POS adalah efisiensi. Hemat listrik, bentuk compact, dan harga software yang biasanya lebih terjangkau (SaaS).

**Cocok untuk:** Coffee Shop, Booth Makanan, Salon.

## 2. Windows POS: Si Pekerja Berat
Windows menang di kompatibilitas hardware. Printer dot matrix, timbangan digital, hingga scanner omnidirectional bekerja lebih stabil di Windows.

**Cocok untuk:** Minimarket, Grosir, Restoran Besar.

## Kesimpulan
Jika Anda butuh mobilitas dan estetika, pilih Android. Jika Anda butuh performa berat dan integrasi hardware kompleks, Windows jawabannya.`,
    date: "14 Feb 2024",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=1200",
    category: "Hardware Review",
    author: "Amin Maghfuri",
    readTime: "15 min read",
    tags: ["Perbandingan", "Investasi", "Teknologi"]
  },
  {
    id: 2,
    title: "5 Tanda Kasir Anda 'Mencuri' Tanpa Anda Sadari (Fraud Detection)",
    excerpt: "Kebocoran omzet seringkali bukan dari orang luar, tapi dari celah sistem yang dimanfaatkan karyawan nakal.",
    content: `# 5 Tanda Fraud di Kasir

## 1. Void Berlebihan
Perhatikan laporan void/cancel transaksi. Jika terlalu sering terjadi saat jam ramai, bisa jadi uang diterima tapi struk dibatalkan.

## 2. No Sale (Laci Terbuka Tanpa Transaksi)
Fitur 'Open Drawer' harus dipantau ketat. Kenapa laci terbuka jika tidak ada pembayaran?

## 3. Diskon Manual yang Mencurigakan
Pastikan hak akses pemberian diskon hanya dipegang oleh supervisor atau owner.

> "Sistem yang baik tidak hanya mencatat penjualan, tapi juga mengamankan aset."`,
    date: "10 Jan 2024",
    image: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200",
    category: "Bisnis Tips",
    author: "Amin Maghfuri",
    readTime: "10 min read",
    tags: ["Keamanan", "Manajemen", "Tips"]
  },
  {
    id: 3,
    title: "Membangun Loyalitas Pelanggan dengan Membership Digital",
    excerpt: "Kartu member fisik sudah kuno. Pelajari cara integrasi membership digital via WhatsApp untuk retensi pelanggan.",
    content: `# Membership Digital

Zaman sekarang orang malas bawa kartu fisik. Solusinya? Membership digital.

### Kenapa Efektif?
1. **Database Real:** Anda punya data kontak asli pelanggan.
2. **Hemat Biaya Cetak:** Tidak perlu cetak kartu PVC.
3. **Notifikasi Promo:** Bisa broadcast promo langsung ke WA.

Implementasi ini bisa menaikkan *Repeat Order* hingga 40%.`,
    date: "05 Mar 2024",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200",
    category: "Digital Marketing",
    author: "Team SIBOS",
    readTime: "7 min read",
    tags: ["Marketing", "Loyalty", "Software"]
  }
];

// --- UPDATED GALLERY DATA (HYBRID PORTFOLIO) ---
export const INITIAL_GALLERY: GalleryItem[] = [
  // 1. Digital Project: Website E-Commerce
  {
    id: 101,
    title: "Kopi Senja: E-Commerce & Membership",
    category_type: 'digital',
    platform: 'web',
    image_url: "https://cdn.dribbble.com/users/1615584/screenshots/15710288/media/6c7a695e5d4f0a94792a106d5bc0eb6d.jpg?resize=1200x900&vertical=center", // Mockup website coffee shop
    description: "Website pemesanan online terintegrasi dengan sistem poin membership.",
    client_url: "https://kopisenja.com",
    tech_stack: ["React", "Next.js", "Supabase", "Midtrans"],
    case_study: {
      challenge: "Kopi Senja mengalami kesulitan melacak data pelanggan setia. Antrian kasir sering menumpuk karena pelanggan mendaftar member secara manual.",
      solution: "Kami membangun Web App Progressive (PWA) yang memungkinkan pelanggan memesan dari meja (QR Order) dan otomatis mendapatkan poin loyalty.",
      result: "Antrian kasir berkurang 40%, dan database membership tumbuh 300% dalam 2 bulan pertama peluncuran."
    },
    type: 'image'
  },
  // 2. Physical Project: Cafe Installation
  { 
    id: 1, 
    title: "Instalasi Full-Set Cafe Solo Baru", 
    category_type: 'physical',
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    description: "Proses instalasi sistem POS full-set di salah satu klien kami, 'Kopi Senja'. Topologi jaringan LAN hybrid untuk memastikan koneksi tetap stabil meskipun wifi pengunjung penuh."
  },
  // 3. Digital Project: Company Profile
  {
    id: 102,
    title: "PT. Maju Logistik Indonesia",
    category_type: 'digital',
    platform: 'web',
    image_url: "https://cdn.dribbble.com/users/418188/screenshots/16361453/media/4c02931d68352b2c28c869ba0029b35e.png?resize=1200x900&vertical=center", // Mockup logistic web
    description: "Redesign website korporat dengan fokus pada SEO dan Lead Generation.",
    client_url: "https://majulogistik.co.id",
    tech_stack: ["Wordpress Custom", "Elementor", "Yoast SEO"],
    case_study: {
      challenge: "Website lama klien sangat lambat dan tidak muncul di halaman pertama Google untuk keyword 'jasa logistik solo'.",
      solution: "Revamp total UI/UX dengan nuansa modern, optimasi kecepatan server, dan implementasi struktur SEO on-page yang rigid.",
      result: "Traffic organik naik 150% dan konversi lead via WhatsApp meningkat signifikan."
    },
    type: 'image'
  },
  // 4. Physical Project: Minimarket
  { 
    id: 2, 
    title: "Setup Kasir Minimarket 'Mart Jaya'", 
    category_type: 'physical',
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800",
    description: "Sesi pelatihan intensif bagi staff kasir. Materi training mencakup input barang, retur, dan pembayaran QRIS."
  },
  // 5. Digital Project: Mobile App
  {
    id: 103,
    title: "QALAM: Manajemen Pendidikan TPA",
    category_type: 'digital',
    platform: 'mobile',
    image_url: "https://cdn.dribbble.com/userupload/12586737/file/original-b18361099e099684128540445d07c082.png?resize=1200x900", // Mockup mobile app education
    description: "Aplikasi Android & iOS untuk memantau hafalan santri secara real-time.",
    client_url: "https://qalam.id",
    tech_stack: ["Flutter", "Firebase", "Node.js"],
    case_study: {
      challenge: "Wali santri sulit memantau perkembangan hafalan anak karena masih menggunakan kartu setoran kertas yang sering hilang.",
      solution: "Mengembangkan aplikasi mobile cross-platform dimana Ustadz menginput nilai, dan notifikasi langsung masuk ke HP Orang Tua.",
      result: "Diadopsi oleh 50+ TPA di Solo Raya dalam 6 bulan pertama."
    },
    type: 'image'
  },
  { 
    id: 4, 
    title: "Pameran UMKM Solo Great Sale", 
    category_type: 'physical',
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    description: "Partisipasi PT Mesin Kasir Solo dalam ajang Solo Great Sale. Konsultasi digitalisasi bisnis untuk 500+ pengunjung."
  }
];