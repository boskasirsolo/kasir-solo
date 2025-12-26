import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Monitor, 
  Zap, 
  BarChart3, 
  Settings,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  ChevronRight,
  Search,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Palette,
  Code,
  Globe
} from 'lucide-react';

// --- Environment & Client Setup ---

// Helper untuk membaca env variable dengan aman di berbagai environment
// Mencegah crash jika import.meta.env atau process.env tidak terdefinisi
const getEnv = (key: string) => {
  try {
    // Coba baca dari import.meta.env (Vite)
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
  } catch (e) {
    // Ignore error
  }

  try {
    // Coba baca dari process.env (Fallback untuk Webpack/Node/Lainnya)
    if (typeof process !== 'undefined' && process.env) {
      const val = process.env[key];
      if (val) return val;
    }
  } catch (e) {
    // Ignore error
  }

  return '';
};

const SUPABASE_URL = getEnv('VITE_SUPABASE_URL');
const SUPABASE_KEY = getEnv('VITE_SUPABASE_ANON_KEY');
const GEMINI_API_KEY = getEnv('VITE_GEMINI_API_KEY');

// Initialize Clients
const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

// Initialize Gemini hanya jika API Key tersedia
const ai = GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) 
  : null;

// --- Types ---

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
}

interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
}

// --- Mock Data (Fallback) ---

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Paket Kasir Android Lite",
    price: 2500000,
    category: "Android",
    description: "Cocok untuk warkop, kedai kopi kecil. Termasuk Tablet 8 inch + Printer Thermal + Stand.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Paket Resto Pro Windows",
    price: 7500000,
    category: "Windows",
    description: "PC All-in-One Touchscreen, Printer Dapur, Printer Kasir, Laci Uang. Software Resto Full Fitur.",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Mesin Kasir Self-Service Kiosk",
    price: 15000000,
    category: "Kiosk",
    description: "Mesin mandiri layar sentuh 24 inch. Pembayaran QRIS terintegrasi.",
    image: "https://images.unsplash.com/photo-1585646397275-84e625a4d46c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Paket Retail Minimarket",
    price: 5500000,
    category: "Retail",
    description: "PC, Scanner Barcode, Printer, Laci Uang. Support manajemen stok ribuan item.",
    image: "https://images.unsplash.com/photo-1580569766020-21a48c66060c?auto=format&fit=crop&q=80&w=800"
  }
];

const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Mengapa Bisnis Anda Butuh Laporan Keuangan Real-time?",
    excerpt: "Kehilangan jejak arus kas adalah penyebab utama kebangkrutan UMKM.",
    content: "Laporan keuangan bukan hanya soal pajak...",
    date: "10 Okt 2023",
    image: "https://images.unsplash.com/photo-1554224155-9727b5394012?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    title: "Tips Memilih Mesin Kasir untuk Coffee Shop",
    excerpt: "Jangan salah pilih spesifikasi. Simak panduan lengkap memilih POS untuk kedai kopi.",
    content: "Kecepatan dan ketahanan terhadap cipratan air...",
    date: "15 Nov 2023",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=800"
  }
];

// --- Components ---

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// 1. Layout Component
const Layout = ({ children, setPage, currentPage }: { children?: React.ReactNode, setPage: (p: string) => void, currentPage: string }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'shop', label: 'Toko' },
    { id: 'articles', label: 'Artikel' },
    { id: 'about', label: 'Tentang' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-brand-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => setPage('home')} 
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 border-2 border-brand-orange rounded bg-brand-dark flex items-center justify-center shadow-neon group-hover:shadow-neon-strong transition-all duration-300">
              <Monitor className="text-brand-orange w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-wider text-white">MESIN KASIR <span className="text-brand-orange">SOLO</span></h1>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Pt. Mesin Kasir Solo</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`text-sm font-bold tracking-wide transition-all duration-300 ${
                  currentPage === item.id 
                    ? 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,95,31,0.8)] scale-105' 
                    : 'text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'
                }`}
              >
                {item.label.toUpperCase()}
              </button>
            ))}
            {/* Login button hidden for public */}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-brand-orange drop-shadow-neon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-dark border-b border-brand-orange/20 p-4 absolute w-full shadow-2xl animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-lg font-bold p-2 rounded hover:bg-white/5 transition-all ${
                    currentPage === item.id ? 'text-brand-orange pl-4 border-l-2 border-brand-orange' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-white/5 py-12 mt-20 relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-brand-orange shadow-neon opacity-50"></div>
        
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">PT MESIN KASIR SOLO</h3>
              <p className="text-gray-400 mb-6">Mitra terbaik digitalisasi usaha Anda. Menyediakan hardware dan software kasir terintegrasi serta layanan pengembangan digital.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Kontak Kami</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="text-brand-orange shrink-0 mt-1 drop-shadow-neon" size={18} />
                  <span>Perum Graha Tiara 2 No. B1. Gumpang 07/01, Kartasura Sukoharjo, Jawa Tengah</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-brand-orange shrink-0 drop-shadow-neon" size={18} />
                  <span>0823 2510 3336</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Navigasi</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => setPage('shop')} className="hover:text-brand-orange transition-colors">Produk Kami</button></li>
                <li><button onClick={() => setPage('articles')} className="hover:text-brand-orange transition-colors">Artikel & Tips</button></li>
                <li><button onClick={() => setPage('about')} className="hover:text-brand-orange transition-colors">Tentang Perusahaan</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-10 pt-6 text-center text-gray-600 text-xs">
            © {new Date().getFullYear()} PT Mesin Kasir Solo. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// 2. Page Components

const HomePage = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => (
  <div className="animate-fade-in">
    {/* Hero Section */}
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Effect - INTENSIFIED */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative">
        <div className="inline-block px-6 py-2 border border-brand-orange rounded-full bg-brand-orange/10 mb-8 backdrop-blur-md shadow-neon">
          <span className="text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase">Solusi Digital #1 Solo Raya</span>
        </div>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">
          {config.heroTitle}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          {config.heroSubtitle}
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button 
            onClick={() => setPage('shop')}
            className="px-10 py-4 bg-brand-orange text-white font-bold rounded-lg hover:bg-brand-glow transition-all shadow-neon hover:shadow-neon-strong flex items-center justify-center gap-3 transform hover:-translate-y-1"
          >
            LIHAT PRODUK <ArrowRight size={22} />
          </button>
          <button 
            onClick={() => setPage('about')}
            className="px-10 py-4 border-2 border-white/10 text-white font-bold rounded-lg hover:bg-white/5 hover:border-brand-orange/50 transition-all flex items-center justify-center hover:shadow-neon"
          >
            HUBUNGI KAMI
          </button>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 bg-brand-card border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Fitur <span className="text-brand-orange">Unggulan</span></h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Keunggulan hardware dan sistem kasir kami untuk mendukung operasional bisnis Anda.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Proses Cepat", desc: "Sistem yang dioptimalkan untuk kecepatan transaksi kasir." },
            { icon: Monitor, title: "Offline & Online", desc: "Tetap jualan meski internet mati. Sinkronisasi otomatis." },
            { icon: BarChart3, title: "Analisa Bisnis", desc: "Pantau omzet dan stok dari mana saja lewat HP." }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 border border-white/5 rounded-2xl bg-brand-dark/80 hover:border-brand-orange transition-all duration-300 group hover:shadow-neon hover:-translate-y-2">
              <feature.icon className="w-14 h-14 text-brand-orange mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-neon" />
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Digital Services Section (New) */}
    <section className="py-20 bg-brand-dark border-t border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-brand-orange/5 rounded-full blur-[100px] -translate-y-1/2"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase mb-2 block">Software House & Digital Agency</span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Layanan <span className="text-brand-orange">Digital</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Selain hardware kasir, kami melayani pembuatan sistem digital untuk mengakselerasi pertumbuhan bisnis Anda secara menyeluruh.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              icon: Palette, 
              title: "Pembuatan Website", 
              desc: "Pembuatan website company profile, toko online, dan landing page dengan desain modern, responsif, dan elegan." 
            },
            { 
              icon: Code, 
              title: "Web App Development", 
              desc: "Pembuatan aplikasi berbasis web (Web App) custom untuk manajemen internal, SaaS, atau sistem informasi khusus." 
            },
            { 
              icon: Search, 
              title: "Optimasi SEO", 
              desc: "Jasa optimasi mesin pencari agar website bisnis Anda tampil di halaman pertama Google dan mudah ditemukan pelanggan." 
            },
            { 
              icon: Settings, 
              title: "Perawatan Website", 
              desc: "Layanan maintenance berkala, update konten, pengelolaan server, dan keamanan website agar performa tetap prima." 
            }
          ].map((service, idx) => (
            <div key={idx} className="bg-brand-card border border-white/5 p-8 rounded-2xl hover:border-brand-orange/50 transition-all hover:-translate-y-2 hover:shadow-neon group flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-neon">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

const ShopPage = ({ products }: { products: Product[] }) => (
  <div className="container mx-auto px-4 py-10 animate-fade-in">
    <div className="flex justify-between items-end mb-12">
      <div>
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">Katalog <span className="text-brand-orange">Produk</span></h2>
        <p className="text-gray-400 text-lg">Pilih paket yang sesuai dengan usaha Anda</p>
      </div>
      <div className="hidden md:block">
        <div className="relative group">
          <input type="text" placeholder="Cari produk..." className="bg-brand-card border border-white/10 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:border-brand-orange focus:shadow-neon w-80 transition-all" />
          <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group bg-brand-card rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange transition-all duration-300 hover:shadow-neon flex flex-col hover:-translate-y-2">
          <div className="relative h-56 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-orange border border-brand-orange/30">
              {product.category}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow relative">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="text-2xl font-display font-bold text-brand-orange mb-4">{formatRupiah(product.price)}</div>
              <a 
                href={`https://wa.me/6282325103336?text=Halo, saya tertarik dengan produk ${product.name}`}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center py-3 bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange text-white rounded-lg font-bold transition-all hover:shadow-neon"
              >
                Pesan Sekarang
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ArticlesPage = ({ articles }: { articles: Article[] }) => (
  <div className="container mx-auto px-4 py-10 animate-fade-in">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 text-center">Artikel & <span className="text-brand-orange">Edukasi</span></h2>
      <p className="text-gray-400 text-center mb-16 text-lg">Wawasan bisnis untuk pertumbuhan usaha Anda</p>

      <div className="space-y-10">
        {articles.map((article) => (
          <div key={article.id} className="bg-brand-card rounded-3xl overflow-hidden border border-white/5 flex flex-col md:flex-row hover:border-brand-orange/50 transition-all hover:shadow-neon group">
            <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-brand-orange/10 mix-blend-overlay group-hover:bg-transparent transition-colors"></div>
            </div>
            <div className="p-10 md:w-3/5 flex flex-col justify-center">
              <div className="text-brand-orange text-xs font-bold tracking-widest mb-3 uppercase flex items-center gap-2">
                 <div className="w-8 h-[2px] bg-brand-orange"></div> {article.date}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4 hover:text-brand-orange transition-colors cursor-pointer leading-tight">{article.title}</h3>
              <p className="text-gray-400 mb-8 leading-relaxed">{article.excerpt}</p>
              <button className="text-white text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-wider group/btn">
                BACA SELENGKAPNYA <ArrowRight size={18} className="text-brand-orange group-hover/btn:drop-shadow-neon" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AboutPage = () => (
  <div className="animate-fade-in">
    {/* Header */}
    <div className="bg-brand-card py-24 border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-8">Tentang <span className="text-brand-orange">Kami</span></h2>
        <div className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed">
          <p>
            PT MESIN KASIR SOLO berdedikasi untuk membantu UMKM dan perusahaan besar di Solo Raya dan sekitarnya 
            dalam mendigitalisasi sistem transaksi mereka. Kami percaya teknologi kasir yang tepat dapat 
            meningkatkan efisiensi dan keuntungan bisnis secara signifikan.
          </p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Contact Info */}
        <div className="space-y-10">
          <div className="bg-brand-dark p-10 rounded-3xl border border-white/10 hover:border-brand-orange/30 transition-all hover:shadow-neon group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <MapPin />
              </div> 
              Lokasi Kantor
            </h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              Perum Graha Tiara 2 No. B1.<br/>
              Gumpang 07/01, Kartasura<br/>
              Sukoharjo, Jawa Tengah, Indonesia
            </p>
            <div className="h-1 w-20 bg-brand-orange rounded-full shadow-neon"></div>
          </div>

          <div className="bg-brand-dark p-10 rounded-3xl border border-white/10 hover:border-brand-orange/30 transition-all hover:shadow-neon group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
               <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <Phone />
              </div> 
              Hubungi Kami
            </h3>
            <p className="text-gray-300 mb-8 text-lg">
              Siap melayani konsultasi kebutuhan kasir Anda 24/7.
            </p>
            <a 
              href="https://wa.me/6282325103336" 
              className="inline-flex items-center gap-4 text-3xl font-bold text-brand-orange hover:text-white transition-colors drop-shadow-neon"
            >
              0823 2510 3336
            </a>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-[500px] bg-gray-800 rounded-3xl overflow-hidden relative border border-brand-orange/30 shadow-neon-strong group">
          {/* Using an image as a placeholder for the map */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
            alt="Map Location" 
            className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-brand-black/90 p-8 rounded-2xl border border-brand-orange text-center backdrop-blur-md shadow-neon transform group-hover:-translate-y-2 transition-transform">
               <MapPin className="text-brand-orange w-12 h-12 mx-auto mb-4 animate-bounce drop-shadow-neon" />
               <p className="font-bold text-white text-xl">Peta Lokasi</p>
               <p className="text-sm text-gray-400 mt-2 uppercase tracking-widest">Kartasura, Sukoharjo</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --- Admin Dashboard ---

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = () => {
    if (pass === 'admin123') { // Simple mock auth
      onLogin();
    } else {
      setErr('Password salah!');
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-brand-card p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-neon">
        <h2 className="text-3xl font-bold text-white mb-8 text-center font-display">Admin Login</h2>
        <input 
          type="password" 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Masukkan Password"
          className="w-full bg-brand-dark border border-white/20 rounded-lg p-4 text-white focus:border-brand-orange outline-none mb-6 transition-colors"
        />
        {err && <p className="text-red-500 text-sm mb-4 bg-red-500/10 p-2 rounded border border-red-500/20 text-center">{err}</p>}
        <button 
          onClick={handleLogin}
          className="w-full bg-brand-orange text-white font-bold py-4 rounded-lg hover:bg-brand-glow transition-all shadow-neon hover:shadow-neon-strong"
        >
          MASUK DASHBOARD
        </button>
      </div>
    </div>
  );
};

const AdminDashboard = ({ 
  products, setProducts, 
  articles, setArticles,
  config, setConfig 
}: { 
  products: Product[], setProducts: any,
  articles: Article[], setArticles: any,
  config: SiteConfig, setConfig: any
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'articles' | 'settings'>('products');
  
  // States for forms
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const addProduct = async () => {
    const newProduct = {
      name: newProdName || 'Produk Baru',
      price: parseInt(newProdPrice) || 0,
      category: 'Uncategorized',
      description: newProdDesc || 'Deskripsi produk baru...',
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800'
    };

    // Optimistic Update
    const tempId = Date.now();
    setProducts([...products, { ...newProduct, id: tempId, image: newProduct.image_url }]);

    if (supabase) {
      const { error } = await supabase.from('products').insert([newProduct]);
      if (error) {
        alert('Gagal simpan ke database: ' + error.message);
      } else {
        // Refresh local data to get real ID if needed, simplified here
        setNewProdName('');
        setNewProdPrice('');
        setNewProdDesc('');
      }
    }
  };

  const deleteProduct = async (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    if (supabase) {
      await supabase.from('products').delete().eq('id', id);
    }
  };

  const generateDescription = async () => {
    if (!ai) {
      alert("API Key Gemini belum ditemukan! Cek Environment Variables di Vercel.");
      return;
    }
    if (!newProdName) {
      alert("Isi nama produk dulu!");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Buatkan deskripsi penjualan singkat, menarik, dan persuasif (maksimal 2 kalimat) untuk mesin kasir tipe: ${newProdName}. Bahasa Indonesia.`,
      });
      setNewProdDesc(response.text?.trim() || '');
    } catch (e) {
      console.error(e);
      alert("Gagal generate AI. Cek console untuk detail.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Dashboard Admin</h2>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-brand-orange text-white shadow-neon' : 'bg-brand-card text-gray-400 hover:text-white'}`}
        >
          Kelola Produk
        </button>
        <button 
          onClick={() => setActiveTab('articles')}
          className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'articles' ? 'bg-brand-orange text-white shadow-neon' : 'bg-brand-card text-gray-400 hover:text-white'}`}
        >
          Kelola Artikel
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-orange text-white shadow-neon' : 'bg-brand-card text-gray-400 hover:text-white'}`}
        >
          Pengaturan Situs
        </button>
      </div>

      {/* Content */}
      <div className="bg-brand-card border border-white/10 rounded-2xl p-8 min-h-[400px]">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Daftar Produk</h3>
            </div>
            
            {/* Add Form */}
            <div className="mb-8 bg-brand-dark p-6 rounded-xl border border-white/5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="Nama Produk" 
                  className="bg-brand-card border border-white/10 rounded px-4 py-3 text-white w-full focus:border-brand-orange outline-none" 
                />
                <input 
                  value={newProdPrice}
                  onChange={e => setNewProdPrice(e.target.value)}
                  placeholder="Harga" 
                  type="number"
                  className="bg-brand-card border border-white/10 rounded px-4 py-3 text-white w-full focus:border-brand-orange outline-none" 
                />
              </div>
              <div className="flex gap-2">
                <textarea 
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Deskripsi Produk..." 
                  className="bg-brand-card border border-white/10 rounded px-4 py-3 text-white w-full h-24 focus:border-brand-orange outline-none"
                />
                <button 
                  onClick={generateDescription}
                  disabled={isGeneratingAI}
                  className="bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600 hover:text-white px-4 rounded transition-all flex flex-col items-center justify-center gap-1 w-32 shrink-0 text-xs font-bold"
                >
                  {isGeneratingAI ? <Loader2 className="animate-spin" /> : <Sparkles />}
                  {isGeneratingAI ? '...' : 'BANTU AI'}
                </button>
              </div>
              
              <button 
                onClick={addProduct}
                className="w-full bg-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white border border-brand-orange/50 rounded px-3 py-3 transition-all flex items-center justify-center gap-2 font-bold shadow-neon hover:shadow-neon-strong"
              >
                <Plus size={16} /> TAMBAH PRODUK
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-brand-dark p-4 rounded-lg border border-white/5 hover:border-brand-orange/30 transition-colors">
                  <div>
                    <div className="font-bold text-white text-lg">{p.name}</div>
                    <div className="text-brand-orange text-sm font-bold">{formatRupiah(p.price)}</div>
                    <div className="text-gray-500 text-xs truncate max-w-md">{p.description}</div>
                  </div>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 hover:text-red-400 p-3 hover:bg-red-500/10 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl">
             <h3 className="text-xl font-bold text-white mb-6">Status Sistem & Koneksi</h3>
             <div className="grid gap-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-brand-dark border border-white/10 rounded-lg">
                  <span className="text-white font-medium">Supabase Database</span>
                  {supabase ? (
                    <span className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-full"><CheckCircle2 size={16} /> Connected</span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 px-3 py-1 rounded-full"><AlertCircle size={16} /> Disconnected</span>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 bg-brand-dark border border-white/10 rounded-lg">
                  <span className="text-white font-medium">Gemini AI (Vite Key)</span>
                  {ai ? (
                    <span className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 px-3 py-1 rounded-full"><CheckCircle2 size={16} /> Key Detected</span>
                  ) : (
                    <span className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 px-3 py-1 rounded-full"><AlertCircle size={16} /> Missing Key</span>
                  )}
                </div>
             </div>

             <h3 className="text-xl font-bold text-white mb-6">Tampilan Website</h3>
             <p className="text-sm text-gray-500 mb-6 bg-yellow-500/10 border border-yellow-500/20 p-3 rounded">
               Catatan: Ubah teks di sini jika ingin mengganti tampilan halaman utama. Saat ini menggunakan pengaturan default yang telah disesuaikan.
             </p>
             <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Judul Hero Utama</label>
                  <input 
                    value={config.heroTitle}
                    onChange={(e) => setConfig({...config, heroTitle: e.target.value})}
                    className="w-full bg-brand-dark border border-white/20 rounded p-3 text-white focus:border-brand-orange outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Sub-Judul Hero</label>
                  <textarea 
                    value={config.heroSubtitle}
                    onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})}
                    className="w-full bg-brand-dark border border-white/20 rounded p-3 text-white focus:border-brand-orange outline-none h-32"
                  />
                </div>
             </div>
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="text-center py-20 text-gray-500">
            <Edit className="mx-auto w-12 h-12 mb-4 opacity-20" />
            <p>Fitur Manajemen Artikel serupa dengan Produk.</p>
            <p className="text-xs mt-2">(Tersedia di versi full database)</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 3. Main App Container

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR MODERN TERLENGKAP",
    heroSubtitle: "Tingkatkan efisiensi dan profit bisnis Anda dengan solusi POS digital dari PT Mesin Kasir Solo. Layanan purna jual terbaik di Jawa Tengah."
  });

  // Handle URL path for admin access
  useEffect(() => {
    if (window.location.pathname === '/master') {
      setCurrentPage('admin');
    }
  }, []);

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;

      try {
        // Fetch Products
        const { data: prodData, error: prodError } = await supabase
          .from('products')
          .select('*')
          .order('id', { ascending: false });
        
        if (!prodError && prodData && prodData.length > 0) {
          const mappedProducts = prodData.map(p => ({
            ...p,
            image: p.image_url || 'https://via.placeholder.com/400'
          }));
          setProducts(mappedProducts);
        }

        // Fetch Articles
        const { data: artData, error: artError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!artError && artData && artData.length > 0) {
          const mappedArticles = artData.map(a => ({
            ...a,
            date: new Date(a.created_at).toLocaleDateString('id-ID'),
            image: a.image_url || 'https://via.placeholder.com/400'
          }));
          setArticles(mappedArticles);
        }

        // NOTE: Sengaja menonaktifkan fetch Config otomatis di awal 
        // agar tampilan tetap "Keren" (Default) dan tidak tertimpa data lama di DB 
        // yang mungkin teksnya kurang pas (Solusi Kasir Masa Depan vs MESIN KASIR MODERN TERLENGKAP).
        // Jika user ingin ubah, bisa lewat dashboard admin.
        /* 
        const { data: configData } = await supabase.from('site_config').select('*').single();
        if (configData) {
          setConfig({
            heroTitle: configData.hero_title || config.heroTitle,
            heroSubtitle: configData.hero_subtitle || config.heroSubtitle
          });
        }
        */

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} config={config} />;
      case 'shop': return <ShopPage products={products} />;
      case 'articles': return <ArticlesPage articles={articles} />;
      case 'about': return <AboutPage />;
      case 'admin': 
        return isAdminLoggedIn 
          ? <AdminDashboard 
              products={products} setProducts={setProducts}
              articles={articles} setArticles={setArticles}
              config={config} setConfig={setConfig}
            /> 
          : <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
      default: return <HomePage setPage={setCurrentPage} config={config} />;
    }
  };

  return (
    <Layout setPage={setCurrentPage} currentPage={currentPage}>
      {renderPage()}
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);