
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Image as ImageIcon, Monitor, Hammer, Quote, Star, User, Smartphone, Globe, PlayCircle } from 'lucide-react';
import { GalleryItem, Testimonial } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, ensureAPIKey, getEnv } from '../utils';
import { GoogleGenAI } from "@google/genai";

const ITEMS_PER_PAGE = 8; 

// --- LOGIC: Custom Hook with Integrated Testimonial ---
const useIntegratedGalleryManager = (
    gallery: GalleryItem[], 
    setGallery: (g: GalleryItem[]) => void,
    testimonials: Testimonial[],
    setTestimonials: (t: Testimonial[]) => void
) => {
    // GALLERY STATE
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        category_type: 'physical' as 'physical' | 'digital',
        platform: 'web' as 'web' | 'mobile' | 'desktop',
        client_url: '',
        tech_stack_str: '',
        shortDesc: '', 
        longDesc: '',
        cs_challenge: '',
        cs_solution: '',
        cs_result: '',
        imagePreview: '',
        uploadFile: null as File | null
    });

    // TESTIMONIAL STATE (Linked)
    const [testiForm, setTestiForm] = useState({
        id: null as number | null,
        client_name: '',
        content: '',
        rating: 5,
        imagePreview: '',
        uploadFile: null as File | null,
        hasTestimonial: false
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
        setTestiForm({
            id: null,
            client_name: '',
            content: '',
            rating: 5,
            imagePreview: '',
            uploadFile: null,
            hasTestimonial: false
        });
    };

    const handleEditClick = (item: GalleryItem) => {
        // 1. Populate Gallery Form
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

        // 2. Find Linked Testimonial (By matching Business Name == Project Title)
        const linkedTestimonial = testimonials.find(t => 
            t.business_name.toLowerCase() === item.title.toLowerCase() ||
            item.title.toLowerCase().includes(t.business_name.toLowerCase())
        );

        if (linkedTestimonial) {
            setTestiForm({
                id: linkedTestimonial.id,
                client_name: linkedTestimonial.client_name,
                content: linkedTestimonial.content,
                rating: linkedTestimonial.rating,
                imagePreview: linkedTestimonial.image_url || '',
                uploadFile: null,
                hasTestimonial: true
            });
        } else {
            setTestiForm({
                id: null,
                client_name: '',
                content: '',
                rating: 5,
                imagePreview: '',
                uploadFile: null,
                hasTestimonial: false
            });
        }
    };

    const generateAINarrative = async () => {
        if (!form.title || !form.shortDesc) return alert("Isi Judul & Context dulu.");
        setLoadingState(prev => ({ ...prev, generatingAI: true }));
        try {
            // Attempt to ensure key is available (IDX flow)
            await ensureAPIKey(); 
            
            // Get Key from standard process or fallback to VITE/NEXT env vars
            const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
            
            if (!apiKey) {
                console.warn("API Key not found. Trying IDX injection.");
            }

            const ai = new GoogleGenAI({ apiKey: apiKey || '' });
            
            // Generate Project Description
            if (form.category_type === 'digital') {
                 const prompt = `Role: Tech Copywriter. Project: ${form.title}. Context: ${form.shortDesc}. Output JSON: { "challenge": "...", "solution": "...", "result": "..." }. Bahasa Indonesia.`;
                 const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
                 const rawText = response.text?.trim() || '{}';
                 try {
                     const jsonStr = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
                     const parsed = JSON.parse(jsonStr);
                     setForm(prev => ({ ...prev, cs_challenge: parsed.challenge || '', cs_solution: parsed.solution || '', cs_result: parsed.result || '' }));
                 } catch (e) { setForm(prev => ({...prev, longDesc: rawText})); }
            } else {
                 const prompt = `Role: Copywriter. Project: ${form.title}. Context: ${form.shortDesc}. Write description (2 paragraphs). Bahasa Indonesia.`;
                 const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
                 setForm(prev => ({ ...prev, longDesc: response.text?.trim() || '' }));
            }

            // Also Generate Testimonial Draft if empty
            if (!testiForm.content && testiForm.hasTestimonial) {
                 const testiPrompt = `Buat testimoni singkat (1 kalimat positif) dari klien pemilik bisnis "${form.title}" yang puas dengan layanan "${form.shortDesc}".`;
                 const testiResponse = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: testiPrompt });
                 setTestiForm(prev => ({...prev, content: testiResponse.text?.trim() || ''}));
            }

        } catch (e: any) { 
            console.error(e); 
            const msg = e.message || "Gagal menghubungi AI.";
            if (msg.includes("API key")) {
                alert("API Key bermasalah. Pastikan VITE_GEMINI_API_KEY diset di Environment Variables Vercel.");
            } else {
                alert(`AI Error: ${msg}`);
            }
        } 
        finally { setLoadingState(prev => ({ ...prev, generatingAI: false })); }
    };

    const handleSubmit = async () => {
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing");
        if (!form.title) return alert("Judul Project wajib diisi");

        setLoadingState(prev => ({ ...prev, uploading: true }));
        try {
            // 1. Handle Gallery Image Upload
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
                image_url: finalImageUrl || 'https://via.placeholder.com/800x600',
                type: 'image',
                category_type: form.category_type,
                description: form.longDesc, 
            };

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

            // Save Gallery Item
            if (form.id) {
                const updatedItem = { ...gallery.find(g => g.id === form.id)!, ...dbData };
                setGallery(gallery.map(g => g.id === form.id ? updatedItem : g));
                if (supabase) await supabase.from('gallery').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                const newItem = { ...dbData, id: newId } as GalleryItem;
                setGallery([newItem, ...gallery]);
                if (supabase) await supabase.from('gallery').insert([dbData]);
            }

            // 2. Handle Testimonial Save (If enabled)
            if (testiForm.hasTestimonial && testiForm.client_name) {
                let finalTestiImage = testiForm.imagePreview;
                if (testiForm.uploadFile) {
                    const formData = new FormData();
                    formData.append('file', testiForm.uploadFile);
                    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                    const data = await res.json();
                    if (data.secure_url) finalTestiImage = data.secure_url;
                }

                const testiData = {
                    client_name: testiForm.client_name,
                    business_name: form.title, // LINK BY NAME
                    content: testiForm.content,
                    rating: testiForm.rating,
                    image_url: finalTestiImage,
                    is_featured: true
                };

                if (testiForm.id) {
                     const updatedTesti = { ...testimonials.find(t => t.id === testiForm.id)!, ...testiData };
                     setTestimonials(testimonials.map(t => t.id === testiForm.id ? updatedTesti : t));
                     if (supabase) await supabase.from('testimonials').update(testiData).eq('id', testiForm.id);
                } else {
                     const newTestiId = Date.now() + 1;
                     const newTesti = { ...testiData, id: newTestiId };
                     setTestimonials([newTesti, ...testimonials]);
                     if (supabase) await supabase.from('testimonials').insert([testiData]);
                }
            }

            resetForm();
            alert("Project & Testimoni berhasil disimpan!");
        } catch (e) { console.error(e); alert("Gagal menyimpan."); }
        finally { setLoadingState(prev => ({ ...prev, uploading: false })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus galeri ini?")) return;
        setGallery(gallery.filter(g => g.id !== id));
        if (supabase) await supabase.from('gallery').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const filtered = gallery.filter(g => g.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        testiForm, setTestiForm,
        loadingState,
        handleSubmit,
        handleEditClick,
        resetForm,
        deleteItem,
        generateAINarrative,
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

export const AdminGallery = ({ 
  gallery, setGallery, testimonials, setTestimonials
}: { 
  gallery: GalleryItem[], setGallery: (g: GalleryItem[]) => void,
  testimonials: Testimonial[], setTestimonials: (t: Testimonial[]) => void
}) => {
  const { 
    form, setForm, 
    testiForm, setTestiForm,
    loadingState, handleSubmit, handleEditClick, resetForm, deleteItem, generateAINarrative, listData 
  } = useIntegratedGalleryManager(gallery, setGallery, testimonials, setTestimonials);

  return (
    <div className="flex h-[800px] border-t border-white/5">
      
      {/* COLUMN 1: LIST (30%) */}
      <div className="w-[30%] border-r border-white/5 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/5">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input 
                    type="text" 
                    value={listData.searchTerm}
                    onChange={(e) => listData.setSearchTerm(e.target.value)}
                    placeholder="Cari project..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
             </div>
          </div>
          <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
             <button 
                onClick={resetForm}
                className="w-full py-3 mb-2 border border-dashed border-white/10 rounded-lg text-gray-400 text-xs font-bold hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all flex items-center justify-center gap-2"
             >
                <Plus size={14} /> TAMBAH PROJECT BARU
             </button>
             
             {listData.paginated.map(item => (
                 <div 
                    key={item.id} 
                    onClick={() => handleEditClick(item)}
                    className={`flex gap-3 p-3 rounded-lg cursor-pointer border transition-all group ${
                        form.id === item.id 
                        ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' 
                        : 'bg-brand-card border-white/5 hover:border-white/20'
                    }`}
                 >
                    <img src={item.image_url} className="w-12 h-12 bg-black rounded object-cover" />
                    <div className="flex-1 min-w-0">
                       <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                       <span className={`text-[9px] px-1 rounded ${item.category_type === 'digital' ? 'text-blue-400 bg-blue-400/10' : 'text-green-400 bg-green-400/10'}`}>
                          {item.category_type === 'digital' ? 'DIGITAL' : 'HARDWARE'}
                       </span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); deleteItem(item.id); }} className="text-gray-600 hover:text-red-500">
                       <Trash2 size={14} />
                    </button>
                 </div>
             ))}
          </div>
          {/* Pagination Simple */}
          {listData.totalPages > 1 && (
             <div className="p-3 border-t border-white/5 flex justify-between items-center bg-brand-dark">
                <button onClick={() => listData.setPage(p => Math.max(1, p-1))} disabled={listData.page===1} className="text-gray-400 disabled:opacity-30"><ChevronLeft size={16}/></button>
                <span className="text-xs text-brand-orange font-bold">{listData.page}/{listData.totalPages}</span>
                <button onClick={() => listData.setPage(p => Math.min(listData.totalPages, p+1))} disabled={listData.page===listData.totalPages} className="text-gray-400 disabled:opacity-30"><ChevronRight size={16}/></button>
             </div>
          )}
      </div>

      {/* COLUMN 2: EDITORS (30%) */}
      <div className="w-[30%] border-r border-white/5 flex flex-col bg-brand-dark">
         
         {/* Top Half: Project Editor (65% Height) */}
         <div className="h-[65%] overflow-y-auto p-4 border-b border-white/10 custom-scrollbar">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Edit size={12}/> Project Details</h4>
             
             <div className="space-y-3">
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setForm(p => ({...p, category_type: 'physical'}))} className={`py-1.5 text-[10px] font-bold rounded border ${form.category_type === 'physical' ? 'bg-brand-action text-white border-brand-action' : 'border-white/10 text-gray-500'}`}>HARDWARE</button>
                    <button onClick={() => setForm(p => ({...p, category_type: 'digital'}))} className={`py-1.5 text-[10px] font-bold rounded border ${form.category_type === 'digital' ? 'bg-brand-action text-white border-brand-action' : 'border-white/10 text-gray-500'}`}>DIGITAL</button>
                 </div>
                 
                 <div className="flex gap-2 items-center bg-black/20 p-2 rounded border border-white/5">
                    <div className="w-10 h-10 bg-black rounded overflow-hidden shrink-0 border border-white/10 relative group">
                        {form.imagePreview && <img src={form.imagePreview} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                           <UploadCloud size={14} className="text-white"/>
                           <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setForm(p => ({...p, uploadFile: e.target.files![0], imagePreview: URL.createObjectURL(e.target.files![0])}))} />
                        </div>
                    </div>
                    <Input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Judul Project" className="text-xs py-1.5 h-8" />
                 </div>

                 {/* AI Trigger */}
                 <div className="p-2 bg-brand-orange/5 rounded border border-brand-orange/20">
                    <div className="flex gap-1 mb-1">
                        <Input value={form.shortDesc} onChange={e => setForm(p => ({...p, shortDesc: e.target.value}))} placeholder="AI Trigger: konteks project..." className="text-xs py-1 h-7 bg-transparent border-none focus:ring-0 px-0" />
                        <button onClick={generateAINarrative} disabled={loadingState.generatingAI} className="bg-brand-orange text-white px-2 rounded text-[9px] font-bold hover:bg-brand-glow">{loadingState.generatingAI ? '...' : 'AI'}</button>
                    </div>
                 </div>

                 <TextArea value={form.longDesc} onChange={e => setForm(p => ({...p, longDesc: e.target.value}))} placeholder="Deskripsi..." className="text-xs h-20" />

                 {/* Digital Specifics */}
                 {form.category_type === 'digital' && (
                     <div className="space-y-2 bg-white/5 p-2 rounded">
                         <select value={form.platform} onChange={e => setForm(p => ({...p, platform: e.target.value as any}))} className="w-full bg-black text-white text-xs p-1 rounded border border-white/10">
                             <option value="web">Website</option><option value="mobile">Mobile App</option>
                         </select>
                         <Input value={form.client_url} onChange={e => setForm(p => ({...p, client_url: e.target.value}))} placeholder="URL" className="text-xs py-1 h-7" />
                         <div className="grid grid-cols-3 gap-1">
                             <input value={form.cs_challenge} onChange={e => setForm(p => ({...p, cs_challenge: e.target.value}))} placeholder="Challenge" className="bg-black text-white text-[9px] p-1 rounded border border-white/10" />
                             <input value={form.cs_solution} onChange={e => setForm(p => ({...p, cs_solution: e.target.value}))} placeholder="Solution" className="bg-black text-white text-[9px] p-1 rounded border border-white/10" />
                             <input value={form.cs_result} onChange={e => setForm(p => ({...p, cs_result: e.target.value}))} placeholder="Result" className="bg-black text-white text-[9px] p-1 rounded border border-white/10" />
                         </div>
                     </div>
                 )}
             </div>
         </div>

         {/* Bottom Half: Testimonial Editor (35% Height) */}
         <div className="h-[35%] overflow-y-auto p-4 bg-black/40 custom-scrollbar flex flex-col border-t border-white/5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
             <div className="flex justify-between items-center mb-2">
                 <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Quote size={12}/> Testimoni</h4>
                 <label className="flex items-center gap-2 cursor-pointer">
                     <span className="text-[10px] text-gray-400">Include?</span>
                     <input type="checkbox" checked={testiForm.hasTestimonial} onChange={e => setTestiForm(p => ({...p, hasTestimonial: e.target.checked}))} className="accent-brand-orange" />
                 </label>
             </div>
             
             {testiForm.hasTestimonial ? (
                 <div className="space-y-2 flex-grow">
                     <div className="flex gap-2 items-center">
                        <div className="w-8 h-8 rounded-full bg-brand-card border border-white/10 overflow-hidden relative group shrink-0">
                            {testiForm.imagePreview ? <img src={testiForm.imagePreview} className="w-full h-full object-cover"/> : <User size={16} className="text-gray-500 m-auto mt-2"/>}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setTestiForm(p => ({...p, uploadFile: e.target.files![0], imagePreview: URL.createObjectURL(e.target.files![0])}))} />
                        </div>
                        <Input value={testiForm.client_name} onChange={e => setTestiForm(p => ({...p, client_name: e.target.value}))} placeholder="Nama Klien" className="text-xs py-1 h-7" />
                     </div>
                     <div className="flex gap-1">
                         {[1,2,3,4,5].map(s => (
                             <Star key={s} size={10} className={`cursor-pointer ${s <= testiForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} onClick={() => setTestiForm(p => ({...p, rating: s}))} />
                         ))}
                     </div>
                     <TextArea value={testiForm.content} onChange={e => setTestiForm(p => ({...p, content: e.target.value}))} placeholder="Isi testimoni..." className="text-xs h-16 bg-brand-card" />
                 </div>
             ) : (
                 <div className="flex-grow flex items-center justify-center text-gray-600 text-xs italic bg-white/5 rounded border border-white/5 border-dashed">
                     Tanpa testimoni khusus (Default Verified)
                 </div>
             )}

             <div className="mt-2 pt-2 border-t border-white/10">
                 <Button onClick={handleSubmit} disabled={loadingState.uploading} className="w-full py-2 text-xs">
                    {loadingState.uploading ? <LoadingSpinner /> : <><Save size={14} /> SIMPAN SEMUA</>}
                 </Button>
             </div>
         </div>
      </div>

      {/* COLUMN 3: PREVIEW (40%) */}
      <div className="w-[40%] bg-black flex items-center justify-center p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          {/* Mockup Card */}
          <div className="w-full max-w-sm">
             <div className="text-center mb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Live Preview Card</span>
             </div>

             {/* PREVIEW COMPONENT LOGIC */}
             {form.category_type === 'digital' ? (
                 <div className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-auto">
                    <div className="relative bg-gray-900 pt-4 px-4 pb-0 border-b border-white/5">
                        <div className="relative rounded-t-xl bg-black border-[4px] border-gray-800 border-b-0 overflow-hidden aspect-[16/10]">
                            {form.imagePreview ? <img src={form.imagePreview} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">No Image</div>}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                <div className="bg-black/60 p-2 rounded-full border border-white/10">
                                   {form.platform === 'mobile' ? <Smartphone size={16} className="text-white"/> : <Globe size={16} className="text-white"/>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex flex-col">
                        <div className="flex flex-wrap gap-1 mb-2">
                           {form.tech_stack_str.split(',').slice(0,3).map((t,i) => t && <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">{t}</span>)}
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">{form.title || 'Judul Project'}</h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-3">{form.longDesc || 'Deskripsi project akan muncul di sini...'}</p>
                        <div className="flex items-center text-brand-orange text-[10px] font-bold uppercase tracking-widest gap-1 mt-auto">Lihat Case Study <ChevronRight size={12}/></div>
                    </div>
                 </div>
             ) : (
                 <div className="group relative rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                    <div className="aspect-[4/3] bg-black relative">
                         {form.imagePreview ? <img src={form.imagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">No Image</div>}
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold text-lg">{form.title || 'Judul Project'}</h3>
                            <div className="w-8 h-1 bg-brand-orange mt-2 rounded-full"></div>
                         </div>
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <PlayCircle size={32} className="text-white/20"/> 
                         </div>
                    </div>
                 </div>
             )}

             {/* PREVIEW TESTIMONIAL FOOTER */}
             <div className="mt-4 bg-brand-dark border border-white/10 rounded-xl p-3 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full border border-brand-orange/30 p-0.5 shrink-0">
                    <img src={testiForm.hasTestimonial && testiForm.imagePreview ? testiForm.imagePreview : "https://via.placeholder.com/100"} className="w-full h-full rounded-full object-cover bg-black" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                       <h5 className="text-xs font-bold text-white">{testiForm.hasTestimonial && testiForm.client_name ? testiForm.client_name : "Tim Teknis"}</h5>
                       <div className="flex text-yellow-500 gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} size={8} fill={i < testiForm.rating ? "currentColor":"none"}/>)}</div>
                    </div>
                    <p className="text-[9px] text-gray-400 italic line-clamp-1">"{testiForm.hasTestimonial && testiForm.content ? testiForm.content : "Verified Installation"}"</p>
                 </div>
             </div>

          </div>
      </div>
    </div>
  );
};
