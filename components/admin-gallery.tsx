
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, ai, CONFIG } from '../utils';

const ITEMS_PER_PAGE = 6; // Menampilkan 6 kartu per halaman (Grid 2x3)

// --- LOGIC: Custom Hook ---
const useGalleryManager = (
    gallery: GalleryItem[], 
    setGallery: (g: GalleryItem[]) => void
) => {
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        shortDesc: '', // For AI Trigger
        longDesc: '',
        imagePreview: '',
        uploadFile: null as File | null
    });

    const [loadingState, setLoadingState] = useState({
        generatingAI: false,
        uploading: false
    });

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null,
            title: '',
            shortDesc: '',
            longDesc: '',
            imagePreview: '',
            uploadFile: null
        });
    };

    const handleEditClick = (item: GalleryItem) => {
        setForm({
            id: item.id,
            title: item.title,
            shortDesc: '',
            longDesc: item.description || '',
            imagePreview: item.image_url,
            uploadFile: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top for sticky form
    };

    const generateAINarrative = async () => {
        if (!ai) return alert("API Key Gemini belum ditemukan!");
        if (!form.title || !form.shortDesc) return alert("Isi Judul dan Keyword Fitur dulu.");
        
        setLoadingState(prev => ({ ...prev, generatingAI: true }));
        try {
            const prompt = `
            Bertindaklah sebagai Copywriter Portofolio Profesional.
            Tugas: Buat deskripsi proyek (Case Study) yang menarik.
            Proyek: ${form.title}
            Konteks/Keyword: ${form.shortDesc}
            Output: HANYA teks narasi (2 paragraf). Bahasa Indonesia.
            `;
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, longDesc: response.text?.trim() || '' }));
        } catch (e) { alert("AI Error"); } 
        finally { setLoadingState(prev => ({ ...prev, generatingAI: false })); }
    };

    const handleSubmit = async () => {
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Cloudinary Config Missing");
        
        // Validasi simpel: kalau edit gak wajib upload, kalau baru wajib upload/ada preview
        if (!form.id && !form.uploadFile && !form.imagePreview) return alert("Pilih gambar dulu!");

        setLoadingState(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview;

            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            const dbData = {
                title: form.title,
                description: form.longDesc,
                image_url: finalImageUrl,
                type: 'image' as const
            };

            if (form.id) {
                // Update
                setGallery(gallery.map(g => g.id === form.id ? { ...g, ...dbData } : g));
                if (supabase) await supabase.from('gallery').update(dbData).eq('id', form.id);
            } else {
                // Create
                const newId = Date.now();
                setGallery([{ ...dbData, id: newId }, ...gallery]);
                if (supabase) await supabase.from('gallery').insert([dbData]);
            }
            resetForm();
            alert("Galeri berhasil disimpan!");
        } catch (e) { console.error(e); alert("Gagal menyimpan."); }
        finally { setLoadingState(prev => ({ ...prev, uploading: false })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus galeri ini?")) return;
        setGallery(gallery.filter(g => g.id !== id));
        if (supabase) await supabase.from('gallery').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    // Filter & Pagination Logic
    const filtered = gallery.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loadingState,
        handleSubmit,
        handleEditClick,
        resetForm,
        deleteItem,
        generateAINarrative,
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

// --- ATOMIC COMPONENT: Gallery Form (Right Side) ---
const GalleryForm = ({ 
    form, setForm, loading, onSubmit, onReset, onGenerateAI 
}: {
    form: any, setForm: any, loading: any, onSubmit: any, onReset: any, onGenerateAI: any
}) => (
    <div className="bg-brand-dark p-6 rounded-xl border border-white/5 h-fit sticky top-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={18} className="text-brand-orange"/> : <ImageIcon size={18} className="text-brand-orange"/>}
                {form.id ? "Edit Galeri" : "Upload Baru"}
            </h3>
            {form.id && (
                <button onClick={onReset} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                    <XIcon size={12} /> Batal
                </button>
            )}
        </div>

        {/* Image Upload Area */}
        <div className="mb-4">
             {form.imagePreview && (
               <div className="mb-3 relative w-full h-40 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={form.imagePreview} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-xs font-bold">Ganti Gambar</p>
                    </div>
               </div>
             )}
             <div className="border border-dashed border-white/20 rounded-lg p-4 text-center hover:border-brand-orange/50 transition-colors bg-brand-card/30">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) setForm((prev:any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
              }} className="hidden" id="gallery-upload" />
              <label htmlFor="gallery-upload" className="cursor-pointer flex flex-col items-center gap-2">
                {!form.imagePreview && <UploadCloud size={24} className="text-gray-400" />}
                <span className="text-gray-400 text-xs font-bold">{form.uploadFile ? form.uploadFile.name : (form.id ? "Klik untuk ganti" : "Pilih Foto Project")}</span>
              </label>
            </div>
        </div>

        <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Judul Project</label>
              <Input value={form.title} onChange={e => setForm((prev:any) => ({...prev, title: e.target.value}))} placeholder="Contoh: Instalasi Cafe..." className="py-2 text-sm"/>
            </div>

            {/* AI Section */}
            <div className="p-3 bg-brand-orange/5 rounded-lg border border-brand-orange/20">
               <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] text-brand-orange uppercase font-bold tracking-wider flex items-center gap-1"><Sparkles size={12} /> AI Storyteller</label>
               </div>
               <div className="flex gap-2">
                  <input 
                        value={form.shortDesc} 
                        onChange={e => setForm((prev:any) => ({...prev, shortDesc: e.target.value}))} 
                        placeholder="Keyword: outdoor, wifi kencang..." 
                        className="bg-brand-card border border-white/10 rounded px-3 text-xs w-full focus:outline-none focus:border-brand-orange"
                    />
                  <button onClick={onGenerateAI} disabled={loading.generatingAI} className="bg-brand-orange text-white rounded px-3 py-1 flex items-center justify-center hover:bg-brand-glow disabled:opacity-50">
                    {loading.generatingAI ? <LoadingSpinner /> : <Sparkles size={16} />}
                  </button>
               </div>
            </div>

            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Deskripsi (Story)</label>
              <TextArea value={form.longDesc} onChange={e => setForm((prev:any) => ({...prev, longDesc: e.target.value}))} placeholder="Ceritakan project ini..." className="h-32 text-sm leading-relaxed" />
            </div>
            
            <Button onClick={onSubmit} disabled={loading.uploading} className="w-full py-2.5 text-sm">
              {loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={16}/> Simpan Perubahan</> : <><Plus size={16}/> Upload Galeri</>)}
            </Button>
        </div>
    </div>
);

// --- ATOMIC COMPONENT: Gallery List (Left Side - Grid View) ---
const GalleryList = ({ 
    data, onEdit, onDelete 
}: { 
    data: any, onEdit: any, onDelete: any 
}) => (
    <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden">
        {/* Header & Search */}
        <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
            <div className="relative flex-grow">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input 
                    type="text" 
                    value={data.searchTerm}
                    onChange={(e) => data.setSearchTerm(e.target.value)}
                    placeholder="Cari project..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {data.paginated.length}</span>
        </div>
        
        {/* Grid Items */}
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar min-h-[500px]">
            {data.paginated.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-xs">Data galeri tidak ditemukan.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.paginated.map((item: GalleryItem) => (
                        <div key={item.id} className="group relative bg-brand-card border border-white/5 rounded-lg overflow-hidden hover:border-brand-orange transition-all hover:shadow-neon-text/20">
                            {/* Image Aspect Ratio Container */}
                            <div className="relative aspect-video bg-black overflow-hidden">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => onEdit(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="p-3">
                                <h5 className="text-sm font-bold text-white truncate mb-1" title={item.title}>{item.title}</h5>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                    {item.description || "Belum ada deskripsi."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Pagination */}
        {data.totalPages > 1 && (
            <div className="p-3 border-t border-white/10 bg-black/20 flex justify-center items-center gap-4">
                <button onClick={() => data.setPage((p:number) => Math.max(1, p - 1))} disabled={data.page === 1} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft size={16} /></button>
                <span className="text-xs font-bold text-brand-orange">{data.page} / {data.totalPages}</span>
                <button onClick={() => data.setPage((p:number) => Math.min(data.totalPages, p + 1))} disabled={data.page === data.totalPages} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
        )}
    </div>
);

// --- MAIN COMPONENT ---
export const AdminGallery = ({ 
  gallery, 
  setGallery 
}: { 
  gallery: GalleryItem[], 
  setGallery: (g: GalleryItem[]) => void 
}) => {
  const { form, setForm, loadingState, handleSubmit, handleEditClick, resetForm, deleteItem, generateAINarrative, listData } = useGalleryManager(gallery, setGallery);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* 60% Width for List (Left) */}
      <div className="lg:col-span-7">
        <GalleryList data={listData} onEdit={handleEditClick} onDelete={deleteItem} />
      </div>
      {/* 40% Width for Form (Right) */}
      <div className="lg:col-span-5">
        <GalleryForm 
            form={form} 
            setForm={setForm} 
            loading={loadingState} 
            onSubmit={handleSubmit} 
            onReset={resetForm} 
            onGenerateAI={generateAINarrative}
        />
      </div>
    </div>
  );
};
