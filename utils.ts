
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { Product, Article, GalleryItem } from './types';

// --- Environment Helpers ---
export const getEnv = (key: string) => {
  // 1. Try Vite / Modern ESM (Preferred)
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
  } catch (e) {}

  // 2. Safe Global Fallback (avoiding direct 'process' reference which crashes browsers)
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
  GEMINI_API_KEY: getEnv('VITE_GEMINI_API_KEY'),
  CLOUDINARY_CLOUD_NAME: getEnv('VITE_CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_PRESET: getEnv('VITE_CLOUDINARY_UPLOAD_PRESET'),
};

// --- Clients ---
export const supabase = (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY) 
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY) 
  : null;

export const ai = CONFIG.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY }) 
  : null;

// --- Formatters ---
export const formatRupiah = (number: number) => {
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
    title: "Pentingnya Laporan Keuangan Real-time untuk UMKM",
    excerpt: "Hindari kebocoran kas dengan sistem POS berbasis cloud. Pelajari bagaimana data real-time menyelamatkan bisnis Anda dari kebangkrutan.",
    content: "Laporan keuangan bukan hanya soal pajak...",
    date: "10 Okt 2023",
    image: "https://images.unsplash.com/photo-1554224155-9727b5394012?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Panduan Memilih Mesin Kasir untuk Coffee Shop",
    excerpt: "Bingung memilih antara Android atau Windows? Simak tips memilih hardware POS yang tahan cipratan air dan mendukung operasional barista.",
    content: "Kecepatan dan ketahanan terhadap cipratan air...",
    date: "15 Nov 2023",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { 
    id: 1, 
    title: "Instalasi Cafe Solo Baru", 
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    description: "Proses instalasi sistem POS full-set di salah satu klien kami, 'Kopi Senja', yang berlokasi di kawasan bisnis Solo Baru. Tantangan utama dalam proyek ini adalah integrasi sistem pesanan dapur (Kitchen Display System) dengan kasir depan agar meminimalisir kesalahan pesanan saat jam sibuk. Kami menggunakan topologi jaringan LAN hybrid untuk memastikan koneksi tetap stabil meskipun wifi pengunjung sedang penuh. Pengerjaan selesai dalam waktu 4 jam termasuk training karyawan."
  },
  { 
    id: 2, 
    title: "Training Staff Minimarket", 
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800",
    description: "Sesi pelatihan intensif bagi staff kasir 'Mart Jaya' di Kartasura. Kami percaya bahwa teknologi canggih harus didukung oleh SDM yang kompeten. Materi training mencakup cara input barang, penanganan retur, pembayaran via QRIS, dan troubleshooting dasar jika printer macet. Antusiasme peserta sangat tinggi, dan mereka bisa langsung mengoperasikan mesin kasir mandiri dalam waktu kurang dari 30 menit."
  },
  { 
    id: 3, 
    title: "Demo Mesin Kiosk Mandiri", 
    type: 'video', 
    image_url: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d1f?auto=format&fit=crop&q=80&w=800", 
    video_url: "https://www.youtube.com/embed/lxT1B-XhF7k?si=123", 
    description: "Video demonstrasi penggunaan Mesin Kiosk Self-Service terbaru kami. Fitur ini memungkinkan pelanggan untuk memilih menu, melakukan kustomisasi pesanan (misal: less sugar, extra shot), dan melakukan pembayaran non-tunai secara mandiri tanpa perlu antri di kasir. Cocok untuk restoran cepat saji yang mengutamakan kecepatan pelayanan."
  },
  { 
    id: 4, 
    title: "Pameran UMKM 2023", 
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    description: "Partisipasi PT Mesin Kasir Solo dalam ajang Solo Great Sale & Expo UMKM. Booth kami dikunjungi oleh lebih dari 500 pelaku usaha yang berkonsultasi mengenai digitalisasi bisnis. Kami mendemokan bagaimana sebuah warung kelontong kecil bisa memiliki manajemen stok setara minimarket modern hanya dengan menggunakan aplikasi kasir Android kami."
  },
  {
    id: 5,
    title: "Setup Toko Baju Distro",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    description: "Implementasi sistem kasir barcode untuk distro clothing di area Manahan. Sistem ini membantu owner memantau stok size dan warna baju secara real-time. Dilengkapi dengan scanner barcode 2D untuk mempercepat proses checkout saat event diskon besar-besaran."
  },
  {
    id: 6,
    title: "Pemasangan Resto Seafood",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description: "Instalasi 3 titik kasir dan 2 printer dapur untuk restoran seafood keluarga yang luas. Sistem mendukung split bill, open bill, dan manajemen reservasi meja. Hardware menggunakan PC All-in-One yang tahan cipratan air dan minyak."
  },
  {
    id: 7,
    title: "Training Staff Apotek",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800",
    description: "Pelatihan khusus untuk staff apotek dalam mengelola masa kadaluarsa (expired date) obat dan stok opname obat-obatan keras. Sistem kami memiliki fitur notifikasi otomatis jika ada obat yang hampir kadaluarsa, sangat membantu manajemen inventory apotek."
  },
  {
    id: 8,
    title: "Maintenance Rutin Klien",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    description: "Tim teknis kami melakukan kunjungan rutin untuk pengecekan hardware dan update software di salah satu klien korporat. Layanan after-sales adalah prioritas utama kami untuk memastikan bisnis klien berjalan tanpa hambatan teknis."
  }
];
