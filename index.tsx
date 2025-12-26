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
  AlertCircle
} from 'lucide-react';

// --- Environment & Client Setup ---

// Mengambil variabel environment sesuai screenshot Vercel (Vite Prefix)
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Clients
const supabase = (SUPABASE_URL && SUPABASE_KEY) 
  ? createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
      <nav className="fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => setPage('home')} 
            className="cursor-pointer flex items-center gap-2 group"
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
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  currentPage === item.id 
                    ? 'text-brand-orange drop-shadow-[0_0_5px_rgba(255,95,31,0.8)]' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.label.toUpperCase()}
              </button>
            ))}
            {/* LOGIN button removed for secret access via /master */}
          </div>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden text-brand-orange"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-dark border-b border-brand-orange/20 p-4 absolute w-full">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-lg font-medium ${
                    currentPage === item.id ? 'text-brand-orange' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              {/* Admin Area link removed */}
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
              <p className="text-gray-400 mb-6">Mitra terbaik digitalisasi usaha Anda. Menyediakan hardware dan software kasir terintegrasi.</p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Kontak Kami</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="text-brand-orange shrink-0 mt-1" size={18} />
                  <span>Perum Graha Tiara 2 No. B1. Gumpang 07/01, Kartasura Sukoharjo, Jawa Tengah</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-brand-orange shrink-0" size={18} />
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
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative">
        <div className="inline-block px-4 py-1 border border-brand-orange/50 rounded-full bg-brand-orange/10 mb-6 backdrop-blur-sm">
          <span className="text-brand-orange text-xs font-bold tracking-widest uppercase">Solusi Digital #1 Solo Raya</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
          {config.heroTitle}
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          {config.heroSubtitle}
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button 
            onClick={() => setPage('shop')}
            className="px-8 py-4 bg-brand-orange text-white font-bold rounded hover:bg-brand-glow transition-all shadow-neon hover:shadow-neon-strong flex items-center justify-center gap-2"
          >
            LIHAT PRODUK <ArrowRight size={20} />
          </button>
          <button 
            onClick={() => setPage('about')}
            className="px-8 py-4 border border-white/20 text-white font-bold rounded hover:bg-white/5 transition-all flex items-center justify-center"
          >
            HUBUNGI KAMI
          </button>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 bg-brand-card">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: "Proses Cepat", desc: "Sistem yang dioptimalkan untuk kecepatan transaksi kasir." },
            { icon: Monitor, title: "Offline & Online", desc: "Tetap jualan meski internet mati. Sinkronisasi otomatis." },
            { icon: BarChart3, title: "Analisa Bisnis", desc: "Pantau omzet dan stok dari mana saja lewat HP." }
          ].map((feature, idx) => (
            <div key={idx} className="p-8 border border-white/5 rounded-2xl bg-brand-dark/50 hover:border-brand-orange/50 transition-colors group">
              <feature.icon className="w-12 h-12 text-brand-orange mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(255,95,31,0.5)]" />
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
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
        <h2 className="text-4xl font-display font-bold text-white mb-2">Katalog <span className="text-brand-orange">Produk</span></h2>
        <p className="text-gray-400">Pilih paket yang sesuai dengan usaha Anda</p>
      </div>
      <div className="hidden md:block">
        <div className="relative">
          <input type="text" placeholder="Cari produk..." className="bg-brand-card border border-white/10 rounded-full py-2 px-5 pl-10 text-white focus:outline-none focus:border-brand-orange w-64" />
          <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product.id} className="group bg-brand-card rounded-xl overflow-hidden border border-white/5 hover:border-brand-orange transition-all duration-300 hover:shadow-neon flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute top-2 right-2 bg-brand-black/80 px-2 py-1 rounded text-xs font-bold text-brand-orange border border-brand-orange/20">
              {product.category}
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{product.description}</p>
            <div className="mt-auto">
              <div className="text-2xl font-display font-bold text-brand-orange mb-4">{formatRupiah(product.price)}</div>
              <a 
                href={`https://wa.me/6282325103336?text=Halo, saya tertarik dengan produk ${product.name}`}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center py-3 bg-white/10 hover:bg-brand-orange text-white rounded font-semibold transition-colors"
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
      <h2 className="text-4xl font-display font-bold text-white mb-2 text-center">Artikel & <span className="text-brand-orange">Edukasi</span></h2>
      <p className="text-gray-400 text-center mb-12">Wawasan bisnis untuk pertumbuhan usaha Anda</p>

      <div className="space-y-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-brand-card rounded-2xl overflow-hidden border border-white/5 flex flex-col md:flex-row hover:border-brand-orange/30 transition-colors">
            <div className="md:w-1/3 h-48 md:h-auto">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
              <div className="text-brand-orange text-xs font-bold tracking-wider mb-2 uppercase">{article.date}</div>
              <h3 className="text-2xl font-bold text-white mb-3 hover:text-brand-orange transition-colors cursor-pointer">{article.title}</h3>
              <p className="text-gray-400 mb-6">{article.excerpt}</p>
              <button className="text-white text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                BACA SELENGKAPNYA <ArrowRight size={16} className="text-brand-orange" />
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
    <div className="bg-brand-card py-20 border-b border-white/5">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Tentang <span className="text-brand-orange">Kami</span></h2>
        <div className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed">
          <p>
            PT MESIN KASIR SOLO berdedikasi untuk membantu UMKM dan perusahaan besar di Solo Raya dan sekitarnya 
            dalam mendigitalisasi sistem transaksi mereka. Kami percaya teknologi kasir yang tepat dapat 
            meningkatkan efisiensi dan keuntungan bisnis secara signifikan.
          </p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="bg-brand-dark p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MapPin className="text-brand-orange" /> Lokasi Kantor
            </h3>
            <p className="text-gray-300 mb-4">
              Perum Graha Tiara 2 No. B1.<br/>
              Gumpang 07/01, Kartasura<br/>
              Sukoharjo, Jawa Tengah, Indonesia
            </p>
            <div className="h-2 w-20 bg-brand-orange/50 rounded-full"></div>
          </div>

          <div className="bg-brand-dark p-8 rounded-2xl border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Phone className="text-brand-orange" /> Hubungi Kami
            </h3>
            <p className="text-gray-300 mb-6">
              Siap melayani konsultasi kebutuhan kasir Anda 24/7.
            </p>
            <a 
              href="https://wa.me/6282325103336" 
              className="inline-flex items-center gap-3 text-2xl font-bold text-brand-orange hover:text-white transition-colors"
            >
              0823 2510 3336
            </a>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className="h-[400px] bg-gray-800 rounded-2xl overflow-hidden relative border border-brand-orange/30 shadow-neon">
          {/* Using an image as a placeholder for the map */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" 
            alt="Map Location" 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-brand-black/80 p-6 rounded-xl border border-brand-orange text-center backdrop-blur-md">
               <MapPin className="text-brand-orange w-10 h-10 mx-auto mb-2 animate-bounce" />
               <p className="font-bold text-white">Peta Lokasi</p>
               <p className="text-xs text-gray-400">Kartasura, Sukoharjo</p>
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
      <div className="bg-brand-card p-8 rounded-xl border border-white/10 w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Admin Login</h2>
        <input 
          type="password" 
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="Masukkan Password"
          className="w-full bg-brand-dark border border-white/20 rounded p-3 text-white focus:border-brand-orange outline-none mb-4"
        />
        {err && <p className="text-red-500 text-sm mb-4">{err}</p>}
        <button 
          onClick={handleLogin}
          className="w-full bg-brand-orange text-white font-bold py-3 rounded hover:bg-brand-glow transition-all"
        >
          MASUK
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
      setNewProdDesc(response.text.trim());
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
          className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'products' ? 'bg-brand-orange text-white' : 'bg-brand-card text-gray-400'}`}
        >
          Kelola Produk
        </button>
        <button 
          onClick={() => setActiveTab('articles')}
          className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'articles' ? 'bg-brand-orange text-white' : 'bg-brand-card text-gray-400'}`}
        >
          Kelola Artikel
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeTab === 'settings' ? 'bg-brand-orange text-white' : 'bg-brand-card text-gray-400'}`}
        >
          Pengaturan Situs
        </button>
      </div>

      {/* Content */}
      <div className="bg-brand-card border border-white/10 rounded-2xl p-6 min-h-[400px]">
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Daftar Produk</h3>
            </div>
            
            {/* Add Form */}
            <div className="mb-8 bg-brand-dark p-6 rounded border border-white/5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input 
                  value={newProdName}
                  onChange={e => setNewProdName(e.target.value)}
                  placeholder="Nama Produk" 
                  className="bg-brand-card border border-white/10 rounded px-3 py-2 text-white w-full" 
                />
                <input 
                  value={newProdPrice}
                  onChange={e => setNewProdPrice(e.target.value)}
                  placeholder="Harga" 
                  type="number"
                  className="bg-brand-card border border-white/10 rounded px-3 py-2 text-white w-full" 
                />
              </div>
              <div className="flex gap-2">
                <textarea 
                  value={newProdDesc}
                  onChange={e => setNewProdDesc(e.target.value)}
                  placeholder="Deskripsi Produk..." 
                  className="bg-brand-card border border-white/10 rounded px-3 py-2 text-white w-full h-20"
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
                className="w-full bg-brand-orange/20 text-brand-orange hover:bg-brand-orange hover:text-white border border-brand-orange/50 rounded px-3 py-3 transition-all flex items-center justify-center gap-2 font-bold"
              >
                <Plus size={16} /> TAMBAH PRODUK
              </button>
            </div>

            {/* List */}
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-brand-dark p-4 rounded border border-white/5">
                  <div>
                    <div className="font-bold text-white">{p.name}</div>
                    <div className="text-brand-orange text-sm">{formatRupiah(p.price)}</div>
                    <div className="text-gray-500 text-xs truncate max-w-md">{p.description}</div>
                  </div>
                  <button 
                    onClick={() => deleteProduct(p.id)}
                    className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded"
                  >
                    <Trash2 size={18} />
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
          // Map supabase data to our interface
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

        // Fetch Config (Optional, assuming table site_config exists from previous prompt)
        const { data: configData } = await supabase
          .from('site_config')
          .select('*')
          .single();
        
        if (configData) {
          setConfig({
            heroTitle: configData.hero_title || config.heroTitle,
            heroSubtitle: configData.hero_subtitle || config.heroSubtitle
          });
        }

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