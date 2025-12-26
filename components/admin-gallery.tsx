
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon } from 'lucide-react';
import { GalleryItem } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, ai, CONFIG } from '../utils';

const ITEMS_PER_PAGE = 8;

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
