
import React, { useState } from 'react';
import { ShoppingBag, Package, LayoutGrid, Image, Settings, Layers, LogOut } from 'lucide-react';
import { Product, GalleryItem, SiteConfig } from '../types';
import { Button, Input } from '../components/ui';
import { AdminProducts } from '../components/admin-products';
import { AdminGallery } from '../components/admin-gallery';
import { AdminSettings } from '../components/admin-settings';
import { AdminOrders } from '../components/admin-orders';

// --- Login Component ---
export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === 'admin123') onLogin();
    else setErr('Password salah!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center animate-fade-in bg-brand-dark relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-[150px] animate-pulse-slow"></div>
      
      <form 
        onSubmit={handleLogin}
        className="bg-brand-card p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-neon z-10"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center font-display">Admin Login</h2>
        <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Masukkan Password" className="mb-6" />
        {err && <p className="text-red-500 text-sm mb-4 text-center">{err}</p>}
        <Button type="submit" className="w-full py-4">MASUK DASHBOARD</Button>
      </form>
    </div>
  );
};

// --- Dashboard Component (Main Shell) ---
export const AdminDashboard = ({ 
  products, setProducts, 
  gallery, setGallery,
  config, setConfig,
  onLogout 
}: { 
  products: Product[], setProducts: any,
  gallery: GalleryItem[], setGallery: any,
  config: SiteConfig, setConfig: any,
  onLogout: () => void
}) => {
  // Main Tabs: Produk (Store), Gallery, Settings
  const [activeTab, setActiveTab] = useState<'store' | 'gallery' | 'settings'>('store');
  
  // Sub Tabs for Store: Orders vs Catalog
  const [storeSubTab, setStoreSubTab] = useState<'orders' | 'catalog'>('orders');

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

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between mb-6 pb-6 border-b border-white/10 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white font-display">Dashboard Admin</h2>
          <p className="text-gray-400 text-xs mt-1">Kelola konten dan operasional bisnis.</p>
        </div>
        
        {/* Top Level Navigation & Logout */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            <TabButton id="store" label="PRODUK & PESANAN" icon={ShoppingBag} />
            <TabButton id="gallery" label="GALERI" icon={Image} />
            <TabButton id="settings" label="PENGATURAN" icon={Settings} />
          </div>
          
          <div className="w-px h-8 bg-white/10 hidden md:block"></div>
          
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

      <div className="bg-brand-card border border-white/10 rounded-2xl p-4 md:p-6 min-h-[600px] shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>

        {activeTab === 'store' && (
          <div className="animate-fade-in relative z-10">
             {/* Sub-Tab Navigation for Store */}
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

             {/* Render Content Based on Sub-Tab */}
             {storeSubTab === 'orders' ? (
                <AdminOrders />
             ) : (
                <AdminProducts products={products} setProducts={setProducts} />
             )}
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="animate-fade-in relative z-10">
             <AdminGallery gallery={gallery} setGallery={setGallery} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in relative z-10">
             <AdminSettings config={config} setConfig={setConfig} />
          </div>
        )}
      </div>
    </div>
  );
};
