
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Image as ImageIcon, Monitor, Hammer } from 'lucide-react';
import { GalleryItem } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, ai, CONFIG } from '../utils';

const ITEMS_PER_PAGE = 6; 

// --- LOGIC: Custom Hook ---
const useGalleryManager = (
    gallery: GalleryItem[], 
    setGallery: (g: GalleryItem[]) => void
) => {
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        category_type: 'physical' as 'physical' | 'digital', // NEW
        platform: 'web' as 'web' | 'mobile' | 'desktop', // NEW
        client_url: '', // NEW
        tech_stack_str: '', // NEW (String input, converted to array)
        shortDesc: '', 
        longDesc: '', // Normal description
        // Case Study Fields
        cs_challenge: '',
        cs_solution: '',
        cs_result: '',
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
            category_type: 'physical',
            platform: 'web',
            client_url: '',
            tech_stack_str: '',
            shortDesc: '',
            longDesc: '',
            cs_challenge: '',
            cs_solution: '',
            cs_result: '',
            imagePreview: '',
            uploadFile: null
        });
    };

    const handleEditClick = (item: GalleryItem) => {
        setForm({
            id: item.id,
            title: item.title,
            category_type: item.category_type || 'physical',
            platform: item.platform || 'web',
            client_url: item.client_url || '',
            tech_stack_str: item.tech_stack ? item.tech_stack.join(', ') : '',
            shortDesc: '',
            longDesc: item.description || '',
            cs_challenge: item.case_study?.challenge || '',
            cs_solution: item.case_study?.solution || '',
            cs_result: item.case_study?.result || '',
            imagePreview: item.image_url,
            uploadFile: null
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generateAINarrative = async () => {
        if (!ai) return alert("API Key Gemini belum ditemukan!");
        if (!form.title || !form.shortDesc) return alert("Isi Judul dan Keyword Fitur dulu.");
        
        setLoadingState(prev => ({ ...prev, generatingAI: true }));
        try {
            if (form.category_type === 'digital') {
                 // Generate STAR Case Study
                 const prompt = `
                 Role: Tech Copywriter. Project: ${form.title}. Context: ${form.shortDesc}.
                 Task: Create a mini case study (STAR method).
                 Output JSON format: { "challenge": "...", "solution": "...", "result": "..." }
                 Bahasa Indonesia. No markdown.
                 `;
                 const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
                 const rawText = response.text?.trim() || '{}';
                 // Try parsing JSON (Simple regex fallback if not pure JSON)
                 try {
                     const jsonStart = rawText.indexOf('{');
                     const jsonEnd = rawText.lastIndexOf('}') + 1;
                     const jsonStr = rawText.substring(jsonStart, jsonEnd);
                     const parsed = JSON.parse(jsonStr);
                     setForm(prev => ({
                        ...prev,
                        cs_challenge: parsed.challenge || '',
                        cs_solution: parsed.solution || '',
                        cs_result: parsed.result || ''
                     }));
                 } catch (e) {
                     setForm(prev => ({...prev, longDesc: rawText})); // Fallback to long desc
                 }

            } else {
                 // Generate Normal Description
                 const prompt = `
                 Role: Copywriter. Project: ${form.title}. Context: ${form.shortDesc}.
                 Task: Write a compelling description (2 paragraphs). Bahasa Indonesia.
                 `;
                 const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
                 setForm(prev => ({ ...prev, longDesc: response.text?.trim() || '' }));
            }
        } catch (e) { alert("AI Error"); } 
        finally { setLoadingState(prev => ({ ...prev, generatingAI: false })); }
    };

    const handleSubmit = async () => {
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Cloudinary Config Missing");
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

            const dbData: Partial<GalleryItem> = {
                title: form.title,
                image_url: finalImageUrl,
                type: 'image',
                category_type: form.category_type,
                description: form.longDesc, // Used for physical
            };

            // Add Digital Specifics
            if (form.category_type === 'digital') {
                dbData.platform = form.platform;
                dbData.client_url = form.client_url;
                dbData.tech_stack = form.tech_stack_str.split(',').map(s => s.trim()).filter(s => s);
                dbData.case_study = {
                    challenge: form.cs_challenge,
                    solution: form.cs_solution,
                    result: form.cs_result
                };
            }

            if (form.id) {
                // Update
                const updatedItem = { ...gallery.find(g => g.id === form.id)!, ...dbData };
                setGallery(gallery.map(g => g.id === form.id ? updatedItem : g));
                if (supabase) await supabase.from('gallery').update(dbData).eq('id', form.id);
            } else {
                // Create
                const newId = Date.now();
                const newItem = { ...dbData, id: newId } as GalleryItem;
                setGallery([newItem, ...gallery]);
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

        {/* TYPE SELECTOR */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-black/40 rounded-lg border border-white/5">
            <button 
                onClick={() => setForm((prev:any) => ({...prev, category_type: 'physical'}))}
                className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${
                    form.category_type === 'physical' ? 'bg-brand-orange text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
            >
                <Hammer size={14} /> Fisik / Hardware
            </button>
            <button 
                onClick={() => setForm((prev:any) => ({...prev, category_type: 'digital'}))}
                className={`py-2 text-xs font-bold rounded flex items-center justify-center gap-2 transition-all ${
                    form.category_type === 'digital' ? 'bg-brand-orange text-white shadow-lg' : 'text-gray-500 hover:text-white'
                }`}
            >
                <Monitor size={14} /> Digital / Web
            </button>
        </div>

        {/* Image Upload Area */}
        <div className="mb-4">
             {form.imagePreview && (
               <div className="mb-3 relative w-full h-40 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
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
            {form.category_type === 'digital' && <p className="text-[10px] text-gray-500 mt-1 text-center">*Gunakan screenshot full page untuk efek scroll</p>}
        </div>

        <div className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Judul Project</label>
              <Input value={form.title} onChange={e => setForm((prev:any) => ({...prev, title: e.target.value}))} placeholder="Contoh: Instalasi Cafe..." className="py-2 text-sm"/>
            </div>

            {/* DIGITAL SPECIFIC FIELDS */}
            {form.category_type === 'digital' && (
                <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/5">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Platform</label>
                            <select 
                                value={form.platform} 
                                onChange={(e) => setForm((prev:any) => ({...prev, platform: e.target.value}))}
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-brand-orange"
                            >
                                <option value="web">Website</option>
                                <option value="mobile">Mobile App</option>
                                <option value="desktop">Desktop App</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Client URL</label>
                            <Input value={form.client_url} onChange={e => setForm((prev:any) => ({...prev, client_url: e.target.value}))} placeholder="https://..." className="py-2 text-sm"/>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Tech Stack (Comma Separated)</label>
                        <Input value={form.tech_stack_str} onChange={e => setForm((prev:any) => ({...prev, tech_stack_str: e.target.value}))} placeholder="React, Supabase, Tailwind" className="py-2 text-sm"/>
                    </div>
                </div>
            )}

            {/* AI TRIGGER */}
            <div className="p-3 bg-brand-orange/5 rounded-lg border border-brand-orange/20">
               <div className="flex justify-between items-center mb-2">
                  <label className="text-[10px] text-brand-orange uppercase font-bold tracking-wider flex items-center gap-1"><Sparkles size={12} /> AI Generator</label>
                  <span className="text-[9px] text-brand-orange">{form.category_type === 'digital' ? 'Generates Case Study' : 'Generates Description'}</span>
               </div>
               <div className="flex gap-2">
                  <input 
                        value={form.shortDesc} 
                        onChange={e => setForm((prev:any) => ({...prev, shortDesc: e.target.value}))} 
                        placeholder={form.category_type === 'digital' ? "Context: website lambat, butuh SEO..." : "Context: kafe outdoor, wifi kencang..."}
                        className="bg-brand-card border border-white/10 rounded px-3 text-xs w-full focus:outline-none focus:border-brand-orange"
                    />
                  <button onClick={onGenerateAI} disabled={loading.generatingAI} className="bg-brand-orange text-white rounded px-3 py-1 flex items-center justify-center hover:bg-brand-glow disabled:opacity-50">
                    {loading.generatingAI ? <LoadingSpinner /> : <Sparkles size={16} />}
                  </button>
               </div>
            </div>

            {/* DESCRIPTION AREAS */}
            {form.category_type === 'digital' ? (
                <div className="space-y-3">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Challenge</label>
                        <TextArea value={form.cs_challenge} onChange={e => setForm((prev:any) => ({...prev, cs_challenge: e.target.value}))} className="h-20 text-xs"/>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Solution</label>
                        <TextArea value={form.cs_solution} onChange={e => setForm((prev:any) => ({...prev, cs_solution: e.target.value}))} className="h-20 text-xs"/>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Result</label>
                        <TextArea value={form.cs_result} onChange={e => setForm((prev:any) => ({...prev, cs_result: e.target.value}))} className="h-20 text-xs"/>
                    </div>
                </div>
            ) : (
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Deskripsi</label>
                  <TextArea value={form.longDesc} onChange={e => setForm((prev:any) => ({...prev, longDesc: e.target.value}))} placeholder="Ceritakan project ini..." className="h-32 text-sm leading-relaxed" />
                </div>
            )}
            
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
                            <div className="relative aspect-video bg-black overflow-hidden border-b border-white/5">
                                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => onEdit(item)} className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-colors"><Edit size={16} /></button>
                                    <button onClick={() => onDelete(item.id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                </div>
                                {/* Badge Type */}
                                <div className="absolute top-2 right-2">
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${item.category_type === 'digital' ? 'bg-blue-500 text-white' : 'bg-green-500 text-white'}`}>
                                        {item.category_type === 'digital' ? 'DIGITAL' : 'FISIK'}
                                    </span>
                                </div>
                            </div>
                            {/* Info */}
                            <div className="p-3">
                                <h5 className="text-sm font-bold text-white truncate mb-1" title={item.title}>{item.title}</h5>
                                <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">
                                    {item.category_type === 'digital' ? `Tech: ${item.tech_stack?.join(', ')}` : (item.description || "Belum ada deskripsi.")}
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
