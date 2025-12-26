
import React, { useState } from 'react';
import { Product, GalleryItem, SiteConfig } from '../types';
import { Button, Input } from '../components/ui';
import { AdminProducts } from '../components/admin-products';
import { AdminGallery } from '../components/admin-gallery';
import { AdminSettings } from '../components/admin-settings';

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
    <div className="min-h-[60vh] flex items-center justify-center">
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
  const [activeTab, setActiveTab] = useState<'products' | 'gallery' | 'settings'>('products');

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Dashboard Admin</h2>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['products', 'gallery', 'settings'].map(tab => (
           <button 
             key={tab} 
             onClick={() => setActiveTab(tab as any)} 
             className={`px-6 py-2 rounded-full font-medium capitalize transition-all ${
               activeTab === tab 
                 ? 'bg-brand-orange text-white shadow-neon-text' 
                 : 'bg-brand-card text-gray-400 hover:text-white hover:bg-white/5'
             }`}
           >
             {tab}
           </button>
        ))}
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl p-8 min-h-[600px]">
        {activeTab === 'products' && (
          <AdminProducts products={products} setProducts={setProducts} />
        )}

        {activeTab === 'gallery' && (
          <AdminGallery gallery={gallery} setGallery={setGallery} />
        )}

        {activeTab === 'settings' && (
          <AdminSettings config={config} setConfig={setConfig} />
        )}
      </div>
    </div>
  );
};
