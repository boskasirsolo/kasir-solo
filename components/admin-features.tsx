
import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Tag, DollarSign } from 'lucide-react';
import { Product, GalleryItem, SiteConfig } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, ai, CONFIG, formatRupiah } from '../utils';

const ITEMS_PER_PAGE = 8;

// --- MODULE: PRODUCTS ---
export const AdminProducts = ({ 
  products, 
  setProducts 
}: { 
  products: Product[], 
  setProducts: (p: Product[]) => void 
}) => {
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodUploadFile, setProdUploadFile] = useState<File | null>(null);
  const [prodImagePreview, setProdImagePreview] = useState('');
  const [editingProdId, setEditingProdId] = useState<number | null>(null);
  const [isGeneratingProdAI, setIsGeneratingProdAI] = useState(false);
  const [isUploadingProd, setIsUploadingProd] = useState(false);
  const [prodPage, setProdPage] = useState(1);

  const resetProdForm = () => {
    setNewProdName('');
    setNewProdPrice('');
    setNewProdDesc('');
    setProdShortDesc('');
    setProdUploadFile(null);
    setProdImagePreview('');
    setEditingProdId(null);
  };

  const generateProductDescription = async () => {
    if (!ai) return alert("API Key Gemini belum ditemukan!");
    if (!newProdName || !prodShortDesc) return alert("Isi Nama Produk dan Keyword Fitur sebagai trigger.");
    setIsGeneratingProdAI(true);
    try {
      const prompt = `
        Bertindaklah sebagai Senior Copywriter untuk produk teknologi kasir (POS).
        Tugas: Buat deskripsi penjualan (Sales Copy) yang persuasif.
        Produk: ${newProdName}
        Fitur/Keyword: ${prodShortDesc}
        Instruksi: Fokus solusi, manfaat, gaya profesional. Output: HANYA teks deskripsi (2-3 paragraf). Bahasa Indonesia.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setNewProdDesc(response.text?.trim() || '');
    } catch (e) { alert("Gagal generate AI"); } 
    finally { setIsGeneratingProdAI(false); }
  };

  const handleProductSubmit = async () => {
    if (!newProdName || !newProdPrice) return alert("Nama dan Harga wajib diisi!");
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing!");

    setIsUploadingProd(true);
    try {
      let finalImageUrl = prodImagePreview || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800';

      if (prodUploadFile) {
        const formData = new FormData();
        formData.append('file', prodUploadFile);
        formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) finalImageUrl = data.secure_url;
      }

      const dbData = {
        name: newProdName,
        price: parseInt(newProdPrice),
        category: 'POS System', 
        description: newProdDesc,
        image_url: finalImageUrl
      };

      if (editingProdId) {
        setProducts(products.map(p => p.id === editingProdId ? { ...p, ...dbData, image: finalImageUrl } : p));
        if (supabase) await supabase.from('products').update(dbData).eq('id', editingProdId);
        alert("Produk berhasil diupdate!");
      } else {
        const tempId = Date.now();
        setProducts([{ ...dbData, id: tempId, image: finalImageUrl }, ...products]);
        if (supabase) await supabase.from('products').insert([dbData]);
        alert("Produk berhasil ditambahkan!");
      }
      resetProdForm();
    } catch (e) { console.error(e); alert("Gagal menyimpan produk."); } 
    finally { setIsUploadingProd(false); }
  };

  const handleProdEditClick = (p: Product) => {
    setEditingProdId(p.id);
    setNewProdName(p.name);
    setNewProdPrice(p.price.toString());
    setNewProdDesc(p.description);
    setProdImagePreview(p.image);
    setProdShortDesc('');
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const deleteProduct = async (id: number) => {
    if(!confirm("Yakin hapus produk ini?")) return;
    setProducts(products.filter(p => p.id !== id));
    if (supabase) await supabase.from('products').delete().eq('id', id);
    if (editingProdId === id) resetProdForm();
  };

  const prodTotalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice((prodPage - 1) * ITEMS_PER_PAGE, prodPage * ITEMS_PER_PAGE);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Column */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-brand-dark p-6 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {editingProdId ? <Edit size={20} className="text-brand-orange"/> : <Tag size={20} className="text-brand-orange"/>}
              {editingProdId ? "Edit Produk" : "Tambah Produk Baru"}
            </h3>
            {editingProdId && (
              <button onClick={resetProdForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                <XIcon size={14} /> Batal Edit
              </button>
            )}
          </div>

          <div className="mb-4">
            {prodImagePreview && (
              <div className="mb-4 relative w-full h-48 bg-black/50 rounded-lg overflow-hidden border border-white/10">
                 <img src={prodImagePreview} alt="Preview" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-brand-orange/50 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setProdUploadFile(file);
                if (file) setProdImagePreview(URL.createObjectURL(file));
              }} className="hidden" id="prod-upload" />
              <label htmlFor="prod-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud size={32} className="text-gray-400" />
                <span className="text-gray-300 font-bold text-sm">{prodUploadFile ? prodUploadFile.name : (editingProdId ? "Ganti Foto (Opsional)" : "Pilih Foto Produk")}</span>
              </label>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Nama Produk</label>
              <Input value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="Contoh: Paket Kasir Android Lite" />
            </div>
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Harga (IDR)</label>
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-4 text-gray-500"/>
                <Input value={newProdPrice} onChange={e => setNewProdPrice(e.target.value)} placeholder="0" type="number" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-brand-card/50 rounded-lg border border-brand-orange/20 relative overflow-hidden mt-4">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={100} className="text-brand-orange" /></div>
               <label className="text-xs text-brand-orange uppercase font-bold tracking-wider mb-2 block flex items-center gap-2"><Sparkles size={14} /> AI Sales Copy Generator</label>
               <div className="flex gap-2">
                  <TextArea value={prodShortDesc} onChange={e => setProdShortDesc(e.target.value)} placeholder="Trigger AI: printer cepat, garansi 1 tahun..." className="h-20 text-sm" />
                  <button onClick={generateProductDescription} disabled={isGeneratingProdAI} className="w-32 bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold rounded-lg flex flex-col items-center justify-center gap-1 hover:brightness-110 shadow-lg">
                    {isGeneratingProdAI ? <LoadingSpinner /> : <><Sparkles size={20} /> <span className="text-[10px]">MAGIC COPY</span></>}
                  </button>
               </div>
          </div>

          <div className="mt-4">
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Deskripsi Produk (Sales Copy)</label>
              <TextArea value={newProdDesc} onChange={e => setNewProdDesc(e.target.value)} placeholder="Deskripsi lengkap produk..." className="h-40" />
          </div>

          <Button onClick={handleProductSubmit} disabled={isUploadingProd} className="w-full py-3 mt-4">
              {isUploadingProd ? <LoadingSpinner /> : (editingProdId ? <><Save size={18}/> UPDATE PRODUK</> : <><Plus size={18}/> SIMPAN PRODUK</>)}
          </Button>
        </div>
      </div>

      {/* List Column */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Katalog Produk</h4>
            <p className="text-xs text-gray-500">Total: {products.length} Item</p>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {paginatedProducts.map(p => (
              <div key={p.id} onClick={() => handleProdEditClick(p)} className={`relative flex gap-3 p-3 rounded-lg border cursor-pointer transition-all group ${editingProdId === p.id ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text' : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                 <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded bg-black" />
                 <div className="flex-1 min-w-0">
                   <h5 className="text-sm font-bold text-white truncate group-hover:text-brand-orange transition-colors">{p.name}</h5>
                   <p className="text-brand-orange text-xs font-bold mt-1">{formatRupiah(p.price)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }} className="self-start text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
              </div>
            ))}
            {products.length === 0 && <p className="text-center text-gray-500 text-sm py-4">Belum ada produk.</p>}
          </div>

          {prodTotalPages > 1 && (
            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between items-center">
              <button onClick={() => setProdPage(p => Math.max(1, p - 1))} disabled={prodPage === 1} className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"><ChevronLeft size={16} /></button>
              <span className="text-xs font-bold text-brand-orange">Page {prodPage} of {prodTotalPages}</span>
              <button onClick={() => setProdPage(p => Math.min(prodTotalPages, p + 1))} disabled={prodPage === prodTotalPages} className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MODULE: GALLERY ---
export const AdminGallery = ({ 
  gallery, 
  setGallery 
}: { 
  gallery: GalleryItem[], 
  setGallery: (g: GalleryItem[]) => void 
}) => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryShortDesc, setGalleryShortDesc] = useState('');
  const [galleryLongDesc, setGalleryLongDesc] = useState('');
  const [galleryImagePreview, setGalleryImagePreview] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingGalleryAI, setIsGeneratingGalleryAI] = useState(false);
  const [galleryPage, setGalleryPage] = useState(1);

  const resetGalleryForm = () => {
    setUploadFile(null);
    setGalleryTitle('');
    setGalleryShortDesc('');
    setGalleryLongDesc('');
    setGalleryImagePreview('');
    setEditingId(null);
  };

  const generateGalleryNarrative = async () => {
    if (!ai) return alert("API Key Gemini belum ditemukan!");
    if (!galleryTitle || !galleryShortDesc) return alert("Mohon isi Judul dan Deskripsi Singkat sebagai trigger AI.");
    setIsGeneratingGalleryAI(true);
    try {
      const prompt = `
        Bertindaklah sebagai spesialis SEO dan Copywriter Senior.
        Tugas: Buat narasi deskripsi panjang (storytelling) untuk portofolio/galeri.
        Project: ${galleryTitle}
        Keyword: ${galleryShortDesc}
        Instruksi: Storytelling natural, SEO friendly. Output: HANYA teks narasi.
      `;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });
      setGalleryLongDesc(response.text?.trim() || '');
    } catch (e) { alert("Gagal generate Narasi AI"); } 
    finally { setIsGeneratingGalleryAI(false); }
  };

  const handleGallerySubmit = async () => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing!");
    setIsUploading(true);
    try {
      let finalImageUrl = galleryImagePreview;
      if (uploadFile) {
        const formData = new FormData();
        formData.append('file', uploadFile);
        formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) finalImageUrl = data.secure_url;
      } else if (!editingId && !uploadFile) {
         alert("Pilih gambar dulu!"); setIsUploading(false); return;
      }
      const itemData = { title: galleryTitle, image_url: finalImageUrl, description: galleryLongDesc, type: 'image' as const };
      if (editingId) {
        setGallery(gallery.map(g => g.id === editingId ? { ...g, ...itemData } : g));
        if (supabase) await supabase.from('gallery').update(itemData).eq('id', editingId);
        alert("Galeri diupdate!");
      } else {
        const newItem = { ...itemData, id: Date.now() };
        setGallery([newItem, ...gallery]);
        if (supabase) await supabase.from('gallery').insert([itemData]);
        alert("Galeri ditambahkan!");
      }
      resetGalleryForm();
    } catch (error) { console.error(error); alert("Proses gagal."); } 
    finally { setIsUploading(false); }
  };

  const handleEditClick = (item: GalleryItem) => {
    setEditingId(item.id);
    setGalleryTitle(item.title);
    setGalleryLongDesc(item.description || '');
    setGalleryImagePreview(item.image_url);
    setGalleryShortDesc(''); 
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const deleteGalleryItem = async (id: number) => {
    if(!confirm("Yakin hapus?")) return;
    setGallery(gallery.filter(g => g.id !== id));
    if (supabase) await supabase.from('gallery').delete().eq('id', id);
    if (editingId === id) resetGalleryForm();
  };

  const totalPages = Math.ceil(gallery.length / ITEMS_PER_PAGE);
  const paginatedGallery = gallery.slice((galleryPage - 1) * ITEMS_PER_PAGE, galleryPage * ITEMS_PER_PAGE);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Column */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-brand-dark p-6 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {editingId ? <Edit size={20} className="text-brand-orange"/> : <UploadCloud size={20} className="text-brand-orange"/>}
              {editingId ? "Edit Galeri" : "Upload Baru"}
            </h3>
            {editingId && (
              <button onClick={resetGalleryForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                <XIcon size={14} /> Batal Edit
              </button>
            )}
          </div>

          <div className="mb-4">
             {galleryImagePreview && (
               <div className="mb-4 relative w-full h-48 bg-black/50 rounded-lg overflow-hidden border border-white/10">
                  <img src={galleryImagePreview} alt="Preview" className="w-full h-full object-contain" />
               </div>
             )}
             <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-brand-orange/50 transition-colors">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                setUploadFile(file);
                if (file) setGalleryImagePreview(URL.createObjectURL(file));
              }} className="hidden" id="gallery-upload" />
              <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud size={32} className="text-gray-400" />
                <span className="text-gray-300 font-bold text-sm">{uploadFile ? uploadFile.name : (editingId ? "Ganti Gambar (Opsional)" : "Pilih Gambar")}</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Judul Project</label>
              <Input value={galleryTitle} onChange={e => setGalleryTitle(e.target.value)} placeholder="Contoh: Instalasi Cafe Kopi Senja" />
            </div>

            <div className="p-4 bg-brand-card/50 rounded-lg border border-brand-orange/20 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10"><Sparkles size={100} className="text-brand-orange" /></div>
               <label className="text-xs text-brand-orange uppercase font-bold tracking-wider mb-2 block flex items-center gap-2"><Sparkles size={14} /> AI Magic Trigger</label>
               <div className="flex gap-2">
                  <TextArea value={galleryShortDesc} onChange={e => setGalleryShortDesc(e.target.value)} placeholder="Trigger AI: kafe outdoor, wifi kencang..." className="h-20 text-sm" />
                  <button onClick={generateGalleryNarrative} disabled={isGeneratingGalleryAI} className="w-32 bg-gradient-to-br from-purple-600 to-blue-600 text-white font-bold rounded-lg flex flex-col items-center justify-center gap-1 hover:brightness-110 shadow-lg">
                    {isGeneratingGalleryAI ? <LoadingSpinner /> : <><Sparkles size={20} /> <span className="text-[10px]">GENERATE</span></>}
                  </button>
               </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Deskripsi Lengkap (SEO Optimized)</label>
              <TextArea value={galleryLongDesc} onChange={e => setGalleryLongDesc(e.target.value)} placeholder="Hasil generate AI akan muncul di sini." className="h-48 text-base leading-relaxed" />
            </div>
            
            <Button onClick={handleGallerySubmit} disabled={isUploading} className="w-full py-3">
              {isUploading ? <LoadingSpinner /> : (editingId ? <><Save size={18}/> SIMPAN PERUBAHAN</> : <><Plus size={18}/> UPLOAD GALERI</>)}
            </Button>
          </div>
        </div>
      </div>

      {/* List Column */}
      <div className="lg:col-span-4 flex flex-col h-full">
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-black/20">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Daftar Galeri</h4>
            <p className="text-xs text-gray-500">Total: {gallery.length} Item</p>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {paginatedGallery.map(item => (
              <div key={item.id} onClick={() => handleEditClick(item)} className={`relative flex gap-3 p-3 rounded-lg border cursor-pointer transition-all group ${editingId === item.id ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text' : 'bg-black/40 border-white/5 hover:bg-white/5 hover:border-white/20'}`}>
                <img src={item.image_url} alt={item.title} className="w-16 h-16 object-cover rounded bg-black" />
                <div className="flex-1 min-w-0">
                   <h5 className="text-sm font-bold text-white truncate group-hover:text-brand-orange transition-colors">{item.title}</h5>
                   <p className="text-xs text-gray-500 line-clamp-2 mt-1">{item.description || "Tanpa deskripsi"}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteGalleryItem(item.id); }} className="self-start text-gray-600 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
              </div>
            ))}
            {gallery.length === 0 && <p className="text-center text-gray-500 text-sm py-4">Belum ada data.</p>}
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t border-white/10 bg-black/20 flex justify-between items-center">
              <button onClick={() => setGalleryPage(p => Math.max(1, p - 1))} disabled={galleryPage === 1} className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"><ChevronLeft size={16} /></button>
              <span className="text-xs font-bold text-brand-orange">Page {galleryPage} of {totalPages}</span>
              <button onClick={() => setGalleryPage(p => Math.min(totalPages, p + 1))} disabled={galleryPage === totalPages} className="p-2 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white"><ChevronRight size={16} /></button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MODULE: SETTINGS ---
export const AdminSettings = ({
  config,
  setConfig
}: {
  config: SiteConfig,
  setConfig: (c: SiteConfig) => void
}) => {
  return (
    <div className="max-w-xl space-y-4">
       <h3 className="text-white font-bold">SEO & Config</h3>
       <div>
         <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Title</label>
         <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
       </div>
       <div>
         <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Subtitle</label>
         <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-32" />
       </div>
       <div className="p-4 bg-brand-dark rounded border border-white/10 flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle2 size={16} /> System Operational
       </div>
    </div>
  );
};
