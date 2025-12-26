
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
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val;
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
  { id: 1, title: "Instalasi Cafe Solo Baru", image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Training Staff Minimarket", image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Pameran UMKM 2023", image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800" },
];
