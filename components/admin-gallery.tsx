
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Image as ImageIcon, Monitor, Hammer, Quote, Star, User, Smartphone, Globe, PlayCircle, Laptop } from 'lucide-react';
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
        platform: 'web' as 'web' | 'mobile' | 'desktop', // Default fallback
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

    // Helper to handle Dropdown Change (Updates both Category and Platform)
    const handleTypeChange = (val: string) => {
        if (val === 'hardware') {
            setForm(p => ({ ...p, category_type: 'physical', platform: 'desktop' })); // Default platform for hardware irrelevant but kept clean
        } else {
            setForm(p => ({ ...p, category_type: 'digital', platform: val as any }));
        }
    };

    // Helper to get current dropdown value based on state
    const getCurrentType = () => {
        if (form.category_type === 'physical') return 'hardware';
        return form.platform; // web, mobile, desktop
    };

    const generateAINarrative = async () => {
        if (!form.title || !form.shortDesc) return alert("Isi Judul & Context dulu.");
        setLoadingState(prev => ({ ...prev, generatingAI: true }));
        try {
            await ensureAPIKey(); 
            const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
            
            if (!apiKey) console.warn("API Key not found. Trying IDX injection.");

            const ai = new GoogleGenAI({ apiKey: apiKey || '' });
            
            // Unified Prompt for both Hardware and Digital (Since user wants Digital format for all)
            const prompt = `
            Role: Senior Tech Copywriter & SEO Specialist.
            Task: Create a Case Study breakdown for a portfolio item.
            Project Name: ${form.title}
            Type: ${form.category_type === 'physical' ? 'Hardware Installation' : 'Software Development'}
            Context/Keywords: ${form.shortDesc}
            
            Instructions:
            1. Language: Indonesian (Professional, Insightful).
            2. Output Format: STRICT JSON ONLY. No markdown, no intro text.
            3. Structure: { "challenge": "...", "solution": "...", "result": "..." }
            4. SEO Focus: Use problem-solution keywords.
            `;
            
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            const rawText = response.text?.trim() || '{}';
            try {
                const jsonStr = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
                const parsed = JSON.parse(jsonStr);
                setForm(prev => ({ ...prev, cs_challenge: parsed.challenge || '', cs_solution: parsed.solution || '', cs_result: parsed.result || '' }));
            } catch (e) { 
                // Fallback if JSON fails
                setForm(prev => ({...prev, longDesc: rawText})); 
            }

            // Testimonial Draft
            if (!testiForm.content && testiForm.hasTestimonial) {
                 const testiPrompt = `
                 Role: Happy Customer.
                 Task: Write a short, natural testimonial (1-2 sentences).
                 Business: ${form.title}
                 Service: ${form.shortDesc}
                 Language: Indonesian (Casual/Semi-formal).
                 STRICT: Output ONLY the testimonial text. No quotes.
                 `;
                 const testiResponse = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: testiPrompt });
                 setTestiForm(prev => ({...prev, content: testiResponse.text?.trim() || ''}));
            }

        } catch (e: any) { 
            console.error(e); 
            const msg = e.message || "Gagal menghubungi AI.";
            if (msg.includes("API key")) {
                alert("API Key bermasalah. Pastikan VITE_GEMINI_API_KEY diset.");
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
            let finalImageUrl = form.imagePreview;
            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            // Always save extensive data (Digital Format)
            const dbData: Partial<GalleryItem> = {
                title: form.title,
                image_url: finalImageUrl || 'https://via.placeholder.com/800x600',
                type: 'image',
                category_type: form.category_type,
                description: form.longDesc || form.cs_solution, // Fallback desc
                platform: form.platform,
                client_url: form.client_url,
                tech_stack: form.tech_stack_str.split(',').map(s => s.trim()).filter(s => s),
                case_study: {
                    challenge: form.cs_challenge,
                    solution: form.cs_solution,
                    result: form.cs_result
                }
            };

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

            // Handle Testimonial Save
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
                    business_name: form.title,
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
            alert("Berhasil disimpan!");
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
        handleTypeChange,
        getCurrentType,
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
    loadingState, handleSubmit, handleEditClick, resetForm, deleteItem, generateAINarrative, handleTypeChange, getCurrentType, listData 
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
                          {item.category_type === 'digital' ? 'SOFTWARE' : 'HARDWARE'}
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
             <div className="flex justify-between items-center mb-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><Edit size={12}/> Project Details</h4>
             </div>
             
             <div className="space-y-3">
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

                 {/* Digital Format Inputs (Available for ALL types now) */}
                 <div className="space-y-2 bg-white/5 p-2 rounded">
                     {/* Unified Category & Platform Selector */}
                     <select 
                        value={getCurrentType()} 
                        onChange={e => handleTypeChange(e.target.value)} 
                        className="w-full bg-black text-white text-xs p-1.5 rounded border border-white/10 mb-1 focus:border-brand-orange outline-none"
                     >
                         <option value="hardware">Hardware / Instalasi Fisik</option>
                         <option value="web">Software - Website / Web App</option>
                         <option value="mobile">Software - Mobile App (Android/iOS)</option>
                         <option value="desktop">Software - Desktop System</option>
                     </select>

                     <Input value={form.client_url} onChange={e => setForm(p => ({...p, client_url: e.target.value}))} placeholder="URL Project / Live Link" className="text-xs py-1 h-7" />
                     
                     <div className="grid grid-cols-1 gap-2 mt-2">
                         <input value={form.cs_challenge} onChange={e => setForm(p => ({...p, cs_challenge: e.target.value}))} placeholder="Challenge (Tantangan Klien)" className="bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                         <input value={form.cs_solution} onChange={e => setForm(p => ({...p, cs_solution: e.target.value}))} placeholder="Solution (Solusi Kami)" className="bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                         <input value={form.cs_result} onChange={e => setForm(p => ({...p, cs_result: e.target.value}))} placeholder="Result (Hasil Akhir)" className="bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                     </div>
                 </div>
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
          
          {/* Mockup Card - Unified Style (Digital Style for All) */}
          <div className="w-full max-w-sm">
             <div className="text-center mb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Live Preview (Unified)</span>
             </div>

             <div className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-auto">
                <div className="relative bg-gray-900 pt-4 px-4 pb-0 border-b border-white/5">
                    <div className="relative rounded-t-xl bg-black border-[4px] border-gray-800 border-b-0 overflow-hidden aspect-[16/10]">
                        {form.imagePreview ? <img src={form.imagePreview} className="w-full h-full object-cover object-top" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">No Image</div>}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                            <div className="bg-black/60 p-2 rounded-full border border-white/10">
                               {form.category_type === 'physical' ? <Hammer size={16} className="text-white"/> : form.platform === 'mobile' ? <Smartphone size={16} className="text-white"/> : <Globe size={16} className="text-white"/>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col">
                    <div className="flex flex-wrap gap-1 mb-2">
                       {/* Show Category Chip */}
                       <span className={`text-[9px] px-1.5 py-0.5 rounded border border-white/5 ${form.category_type === 'physical' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                           {form.category_type === 'physical' ? 'HARDWARE' : 'SOFTWARE'}
                       </span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{form.title || 'Judul Project'}</h3>
                    <div className="space-y-1 mt-2">
                        {form.cs_challenge && (
                            <p className="text-[10px] text-gray-400 line-clamp-1"><span className="text-red-400 font-bold">Challenge:</span> {form.cs_challenge}</p>
                        )}
                        {form.cs_solution && (
                            <p className="text-[10px] text-gray-400 line-clamp-1"><span className="text-blue-400 font-bold">Solution:</span> {form.cs_solution}</p>
                        )}
                    </div>
                    <div className="flex items-center text-brand-orange text-[10px] font-bold uppercase tracking-widest gap-1 mt-3 pt-3 border-t border-white/5">Lihat Case Study <ChevronRight size={12}/></div>
                </div>
             </div>

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
