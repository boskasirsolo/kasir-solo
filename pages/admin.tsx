
import React, { useState } from 'react';
import { ShoppingBag, Package, LayoutGrid, Image, Settings, Layers } from 'lucide-react';
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
    <div className="min-h-[60vh] flex items-center justify-center animate-fade-in">
      <form 
        onSubmit={handleLogin}
        className="bg-brand-card p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-neon"
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
  config, setConfig 
}: { 
  products: Product[], setProducts: any,
  gallery: GalleryItem[], setGallery: any,
  config: SiteConfig, setConfig: any
}) => {
  // Main Tabs: Produk (Store), Gallery, Settings
  const [activeTab, setActiveTab] = useState<'store' | 'gallery' | 'settings'>('store');
  
  // Sub Tabs for Store: Orders vs Catalog
  const [storeSubTab, setStoreSubTab] = useState<'orders' | 'catalog'>('orders');

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white font-display">Dashboard Admin</h2>
          <p className="text-gray-400 text-sm mt-1">Kelola pesanan, produk, dan konten website.</p>
        </div>
      </div>
      
      {/* Top Level Navigation */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button 
           onClick={() => setActiveTab('store')} 
           className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border ${
             activeTab === 'store' 
               ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
               : 'bg-brand-card text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
           }`}
        >
           <ShoppingBag size={18} />
           PRODUK & PESANAN
        </button>

        <button 
           onClick={() => setActiveTab('gallery')} 
           className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border ${
             activeTab === 'gallery' 
               ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
               : 'bg-brand-card text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
           }`}
        >
           <Image size={18} />
           GALERI
        </button>

        <button 
           onClick={() => setActiveTab('settings')} 
           className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap border ${
             activeTab === 'settings' 
               ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
               : 'bg-brand-card text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
           }`}
        >
           <Settings size={18} />
           PENGATURAN
        </button>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl p-4 md:p-8 min-h-[600px] shadow-2xl relative overflow-hidden">
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>

        {activeTab === 'store' && (
          <div className="animate-fade-in">
             {/* Sub-Tab Navigation for Store */}
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/5">
                <div className="bg-brand-dark p-1 rounded-lg inline-flex border border-white/10">
                   <button 
                     onClick={() => setStoreSubTab('orders')}
                     className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                        storeSubTab === 'orders'
                        ? 'bg-brand-orange text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                     }`}
                   >
                      <Package size={16} /> Pesanan Masuk
                   </button>
                   <button 
                     onClick={() => setStoreSubTab('catalog')}
                     className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold transition-all ${
                        storeSubTab === 'catalog'
                        ? 'bg-brand-orange text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                     }`}
                   >
                      <LayoutGrid size={16} /> Katalog Produk
                   </button>
                </div>
                
                <div className="text-gray-400 text-sm flex items-center gap-2">
                   <Layers size={14} className="text-brand-orange"/>
                   Mode: <span className="text-white font-bold">{storeSubTab === 'orders' ? 'Manajemen Order' : 'Editor Produk'}</span>
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
          <div className="animate-fade-in">
             <AdminGallery gallery={gallery} setGallery={setGallery} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in">
             <AdminSettings config={config} setConfig={setConfig} />
          </div>
        )}
      </div>
    </div>
  );
};
