
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, AlertCircle, Sparkles, UploadCloud, Loader2 } from 'lucide-react';
import { Product, Article, GalleryItem, SiteConfig } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from '../components/ui';
import { supabase, ai, CONFIG, formatRupiah } from '../utils';

// --- Login Component ---
export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const handleLogin = () => {
    if (pass === 'admin123') onLogin();
    else setErr('Password salah!');
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-brand-card p-10 rounded-2xl border border-white/10 w-full max-w-md shadow-neon">
        <h2 className="text-3xl font-bold text-white mb-8 text-center font-display">Admin Login</h2>
        <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Masukkan Password" className="mb-6" />
        {err && <p className="text-red-500 text-sm mb-4 text-center">{err}</p>}
        <Button onClick={handleLogin} className="w-full py-4">MASUK DASHBOARD</Button>
      </div>
    </div>
  );
};

// --- Dashboard Component ---
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
  
  // Product State
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Gallery State
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // --- Logic: Product ---
  const addProduct = async () => {
    const newProduct = {
      name: newProdName || 'Produk Baru',
      price: parseInt(newProdPrice) || 0,
      category: 'Uncategorized',
      description: newProdDesc || 'Deskripsi produk baru...',
      image_url: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800'
    };
    const tempId = Date.now();
    setProducts([...products, { ...newProduct, id: tempId, image: newProduct.image_url }]);
    if (supabase) {
      await supabase.from('products').insert([newProduct]);
      setNewProdName(''); setNewProdPrice(''); setNewProdDesc('');
    }
  };

  const deleteProduct = async (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    if (supabase) await supabase.from('products').delete().eq('id', id);
  };

  const generateDescription = async () => {
    if (!ai) return alert("API Key Gemini belum ditemukan!");
    if (!newProdName) return alert("Isi nama produk dulu!");
    setIsGeneratingAI(true);
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Buatkan deskripsi penjualan singkat (maks 2 kalimat) untuk mesin kasir tipe: ${newProdName}, dengan gaya bahasa marketing yang profesional. Bahasa Indonesia.`,
      });
      setNewProdDesc(response.text?.trim() || '');
    } catch (e) { alert("Gagal generate AI"); } 
    finally { setIsGeneratingAI(false); }
  };

  // --- Logic: Gallery ---
  const handleImageUpload = async () => {
    if (!uploadFile || !CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Cek File / Config!");
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        const newItem = { title: galleryTitle || "Dokumentasi", image_url: data.secure_url };
        const tempId = Date.now();
        setGallery([{...newItem, id: tempId}, ...gallery]);
        if (supabase) await supabase.from('gallery').insert([newItem]);
        setUploadFile(null); setGalleryTitle(''); alert("Upload Berhasil!");
      }
    } catch (error) { alert("Upload gagal."); } 
    finally { setIsUploading(false); }
  };

  const deleteGalleryItem = async (id: number) => {
    setGallery(gallery.filter(g => g.id !== id));
    if (supabase) await supabase.from('gallery').delete().eq('id', id);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-white mb-8 border-b border-white/10 pb-4">Dashboard Admin</h2>
      
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {['products', 'gallery', 'settings'].map(tab => (
           <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-2 rounded-full font-medium capitalize ${activeTab === tab ? 'bg-brand-orange text-white' : 'bg-brand-card text-gray-400'}`}>
             {tab}
           </button>
        ))}
      </div>

      <div className="bg-brand-card border border-white/10 rounded-2xl p-8 min-h-[400px]">
        {activeTab === 'products' && (
          <div>
            <div className="mb-8 bg-brand-dark p-6 rounded-xl border border-white/5 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="Nama Produk" />
                <Input value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} placeholder="Harga" type="number" />
              </div>
              <div className="flex gap-2">
                <TextArea value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} placeholder="Deskripsi..." className="h-24" />
                <button onClick={generateDescription} disabled={isGeneratingAI} className="bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600 hover:text-white px-4 rounded w-32 flex flex-col items-center justify-center text-xs font-bold">
                  {isGeneratingAI ? <LoadingSpinner /> : <Sparkles />} SEO AI
                </button>
              </div>
              <Button onClick={addProduct} className="w-full"><Plus size={16} /> TAMBAH PRODUK</Button>
            </div>
            <div className="space-y-4">
              {products.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-brand-dark p-4 rounded-lg border border-white/5">
                  <div>
                    <div className="font-bold text-white text-lg">{p.name}</div>
                    <div className="text-brand-orange text-sm font-bold">{formatRupiah(p.price)}</div>
                  </div>
                  <button onClick={() => deleteProduct(p.id)} className="text-red-500 hover:bg-red-500/10 p-2 rounded"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div>
            <div className="mb-8 bg-brand-dark p-6 rounded-xl border border-white/5 space-y-4">
               <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <input type="file" accept="image/*" onChange={(e) => setUploadFile(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <UploadCloud size={40} className="text-gray-400" />
                  <span className="text-gray-300 font-bold">{uploadFile ? uploadFile.name : "Klik untuk pilih foto"}</span>
                </label>
              </div>
              <Input value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} placeholder="Judul Foto" />
              <Button onClick={handleImageUpload} disabled={isUploading} className="w-full">
                {isUploading ? <LoadingSpinner /> : <Plus size={16} />} UPLOAD
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {gallery.map(g => (
                 <div key={g.id} className="relative group rounded-lg overflow-hidden border border-white/10">
                   <img src={g.image_url} alt={g.title} className="w-full h-32 object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => deleteGalleryItem(g.id)} className="p-2 bg-red-500 rounded-full text-white"><Trash2 size={16} /></button>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-xl space-y-4">
             <h3 className="text-white font-bold">SEO & Config</h3>
             <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
             <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-32" />
             <div className="p-4 bg-brand-dark rounded border border-white/10 flex items-center gap-2 text-green-400 text-sm">
                <CheckCircle2 size={16} /> System Operational
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
