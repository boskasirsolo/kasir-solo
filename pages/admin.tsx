
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, LayoutGrid, Image, Settings, Layers, LogOut, Mail, Lock, Zap, Quote, FileText, Home, ArrowLeft, Briefcase } from 'lucide-react';
import { Product, GalleryItem, SiteConfig, Testimonial, Article, JobOpening } from '../types';
import { Button, Input, LoadingSpinner } from '../components/ui';
import { AdminProducts } from '../components/admin-products';
import { AdminGallery } from '../components/admin-gallery';
import { AdminSettings } from '../components/admin-settings';
import { AdminOrders } from '../components/admin-orders';
import { AdminArticles } from '../components/admin-articles';
import { AdminCareer } from '../components/admin-career'; // ADDED
import { supabase } from '../utils';
import { useNavigate } from 'react-router-dom';

// --- Login Component (SECURED) ---
export const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setErr("Koneksi Supabase belum dikonfigurasi.");
      return;
    }

    setLoading(true);
    setErr('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }
    } catch (error: any) {
      setErr(error.message || "Gagal login. Periksa email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in bg-brand-dark relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      
      {/* Back to Home Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-500 hover:text-brand-orange transition-colors group"
      >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 border border-white/5 group-hover:border-brand-orange/30 transition-all">
            <ArrowLeft size={18} />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest hidden md:inline">Kembali ke Beranda</span>
      </button>

      <form 
        onSubmit={handleLogin}
        className="bg-brand-card p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-neon z-10"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center font-display">Admin Portal</h2>
        
        <div className="space-y-4 mb-6">
          <div className="relative">
             <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
             <Input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email Administrator" 
                className="pl-12"
              />
          </div>
          <div className="relative">
             <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
             <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                className="pl-12"
              />
          </div>
        </div>

        {err && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm mb-6 text-center">{err}</div>}
        
        <Button type="submit" className="w-full py-4" disabled={loading}>
          {loading ? <LoadingSpinner /> : "MASUK DASHBOARD"}
        </Button>
      </form>
    </div>
  );
};

// --- Dashboard Component (Main Shell) ---
export const AdminDashboard = ({ 
  products, setProducts, 
  gallery, setGallery,
  testimonials, setTestimonials,
  articles, setArticles,
  jobs, setJobs, // ADDED
  config, setConfig,
  onLogout 
}: { 
  products: Product[], setProducts: any,
  gallery: GalleryItem[], setGallery: any,
  testimonials: Testimonial[], setTestimonials: any,
  articles: Article[], setArticles: any,
  jobs: JobOpening[], setJobs: any, // ADDED
  config: SiteConfig, setConfig: any,
  onLogout: () => void
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'store' | 'gallery' | 'articles' | 'career' | 'settings'>('store');
  const [storeSubTab, setStoreSubTab] = useState<'orders' | 'catalog'>('orders');
  const [showConnectAI, setShowConnectAI] = useState(false);

  useEffect(() => {
    // Only show 'Connect AI' if in Google IDX environment
    // @ts-ignore
    if (typeof window !== 'undefined' && window.aistudio) {
        setShowConnectAI(true);
    }
  }, []);

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all border ${
        activeTab === id 
          ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text translate-y-[-1px]' 
          : 'bg-brand-card text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const connectAI = async () => {
      // @ts-ignore
      if (window.aistudio) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
          alert("Koneksi API Key diperbarui.");
      }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 pb-6 border-b border-white/10 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Dashboard Admin</h2>
          <p className="text-gray-400 text-xs mt-1">Kelola konten dan operasional bisnis.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <TabButton id="store" label="PRODUK & ORDER" icon={ShoppingBag} />
            <TabButton id="gallery" label="GALERI" icon={Image} />
            <TabButton id="articles" label="ARTIKEL" icon={FileText} />
            <TabButton id="career" label="KARIR" icon={Briefcase} /> 
            <TabButton id="settings" label="PENGATURAN" icon={Settings} />
          </div>
          
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>
          
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30 transition-colors"
            title="Lihat Website"
          >
            <Home size={16} />
            <span className="hidden md:inline">Lihat Web</span>
          </button>

          {showConnectAI && (
            <button 
               onClick={connectAI}
               className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500 hover:text-white transition-colors"
               title="Hubungkan ulang API Key Gemini (IDX Only)"
            >
               <Zap size={16} /> <span className="hidden md:inline">Connect AI</span>
            </button>
          )}

          <button 
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
            title="Keluar Dashboard"
          >
            <LogOut size={16} />
            <span className="hidden md:inline">Keluar</span>
          </button>
        </div>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl min-h-[600px] shadow-2xl relative overflow-hidden">
        
        {activeTab === 'store' && (
          <div className="animate-fade-in relative z-10 p-4 md:p-6">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                <div className="bg-brand-dark p-1 rounded-lg inline-flex border border-white/10">
                   <button 
                     onClick={() => setStoreSubTab('orders')}
                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                        storeSubTab === 'orders'
                        ? 'bg-brand-orange text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                     }`}
                   >
                      <Package size={14} /> Pesanan Masuk
                   </button>
                   <button 
                     onClick={() => setStoreSubTab('catalog')}
                     className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
                        storeSubTab === 'catalog'
                        ? 'bg-brand-orange text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                     }`}
                   >
                      <LayoutGrid size={14} /> Katalog Produk
                   </button>
                </div>
                
                <div className="text-gray-500 text-xs flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                   <Layers size={12} className="text-brand-orange"/>
                   Mode Aktif: <span className="text-gray-300 font-bold">{storeSubTab === 'orders' ? 'Manajemen Pesanan' : 'Editor Produk'}</span>
                </div>
             </div>

             {storeSubTab === 'orders' ? (
                <AdminOrders />
             ) : (
                <AdminProducts products={products} setProducts={setProducts} />
             )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-fade-in relative z-10 h-full">
             <AdminGallery 
                gallery={gallery} setGallery={setGallery} 
                testimonials={testimonials} setTestimonials={setTestimonials}
             />
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="animate-fade-in relative z-10 p-4 md:p-6">
             <AdminArticles articles={articles} setArticles={setArticles} />
          </div>
        )}

        {/* ADDED CAREER TAB */}
        {activeTab === 'career' && (
          <div className="animate-fade-in relative z-10 p-4 md:p-6">
             <AdminCareer jobs={jobs} setJobs={setJobs} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in relative z-10 p-4 md:p-6">
             <AdminSettings config={config} setConfig={setConfig} />
          </div>
        )}
      </div>
    </div>
  );
};
