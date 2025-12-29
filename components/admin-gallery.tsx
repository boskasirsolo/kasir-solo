
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Image as ImageIcon, Monitor, Hammer, Quote, Star, User, Smartphone, Globe, Link as LinkIcon } from 'lucide-react';
import { GalleryItem, Testimonial } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, CONFIG, callGeminiWithRotation } from '../utils';

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
        shortDesc: '', // Used as AI Context internally
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
            setForm(p => ({ ...p, category_type: 'physical', platform: 'desktop' })); 
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
        // Validasi input minimal untuk konteks AI
        if (!form.title) return alert("Isi Judul Proyek dulu agar AI mengerti konteksnya.");
        
        // Buat konteks dari field yang sudah diisi manual
        const contextString = `
            Project: ${form.title}
            Type: ${form.category_type}
            Challenge: ${form.cs_challenge}
            Solution: ${form.cs_solution}
            Result: ${form.cs_result}
        `;

        setLoadingState(prev => ({ ...prev, generatingAI: true }));

        try {
            // 1. Generate Main Description using CENTRALIZED ROTATION
            const mainPrompt = `
            Role: Senior Portfolio Copywriter.
            Task: Write a compelling project description (Case Study Summary).
            Context Data: ${contextString}
            
            STRICT RULES:
            1. Language: Indonesian (Professional, Result-Oriented).
            2. Format: Plain text, 2 paragraphs max.
            3. Content: Blend the challenge, solution, and result into a narrative.
            4. NO INTRO like "Here is the text". Just the text.
            `;
            
            const mainResponse = await callGeminiWithRotation({ 
                model: 'gemini-3-flash-preview', 
                contents: mainPrompt 
            });
            setForm(prev => ({ ...prev, longDesc: mainResponse.text?.trim() || '' }));

            // 2. Generate Testimonial (Only if checkbox is checked)
            if (testiForm.hasTestimonial) {
                 const testiPrompt = `
                 Role: A satisfied client owner.
                 Task: Write a short testimonial (1-2 sentences) about the project "${form.title}".
                 Context: We are happy because ${form.cs_result || "the service was excellent"}.
                 Language: Indonesian (Casual/Semi-formal).
                 STRICT: Output ONLY the testimonial text. No quotes, no intro.
                 `;
                 
                 const testiResponse = await callGeminiWithRotation({ 
                     model: 'gemini-3-flash-preview', 
                     contents: testiPrompt 
                 });
                 
                 setTestiForm(prev => ({
                     ...prev, 
                     content: testiResponse.text?.trim() || '',
                     client_name: prev.client_name || "Nama Klien (Edit)", // Placeholder if empty
                 }));
            }

        } catch (e: any) { 
            console.error(e); 
            alert(`AI Error: ${e.message || "Gagal menghubungi AI."}`);
        } 
        finally { setLoadingState(prev => ({ ...prev, generatingAI: false })); }
    };

    const handleSubmit = async () => {
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing");
        if (!form.title) return alert("Judul Project wajib diisi");

        setLoadingState(prev => ({ ...prev, uploading: true }));
        try {
            // 1. Upload Project Image
            let finalImageUrl = form.imagePreview;
            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            // 2. Prepare Gallery Data
            const dbData: Partial<GalleryItem> = {
                title: form.title,
                image_url: finalImageUrl || 'https://via.placeholder.com/800x600',
                type: 'image',
                category_type: form.category_type,
                description: form.longDesc || form.cs_solution, 
                platform: form.platform,
                client_url: form.client_url,
                // Default stack if empty, split by comma if string
                tech_stack: form.tech_stack_str ? form.tech_stack_str.split(',').map(s => s.trim()) : ['Solusi Bisnis'],
                case_study: {
                    challenge: form.cs_challenge,
                    solution: form.cs_solution,
                    result: form.cs_result
                }
            };

            // 3. Save Gallery Item
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

            // 4. Handle Testimonial Save
            if (testiForm.hasTestimonial) {
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
                    client_name: testiForm.client_name || "Pelanggan Puas",
                    business_name: form.title, // LINKED BY PROJECT TITLE
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
    <div className="flex h-[850px] border-t border-white/5">
      
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
          {listData.totalPages > 1 && (
             <div className="p-3 border-t border-white/5 flex justify-between items-center bg-brand-dark">
                <button onClick={() => listData.setPage(p => Math.max(1, p-1))} disabled={listData.page===1} className="text-gray-400 disabled:opacity-30"><ChevronLeft size={16}/></button>
                <span className="text-xs text-brand-orange font-bold">{listData.page}/{listData.totalPages}</span>
                <button onClick={() => listData.setPage(p => Math.min(listData.totalPages, p+1))} disabled={listData.page===listData.totalPages} className="text-gray-400 disabled:opacity-30"><ChevronRight size={16}/></button>
             </div>
          )}
      </div>

      {/* COLUMN 2: EDITOR FORM (30%) - REDESIGNED VERTICAL */}
      <div className="w-[30%] border-r border-white/5 flex flex-col bg-brand-dark">
         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
             <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-white/10 pb-2">
                <Edit size={12}/> Project Details
             </h4>
             
             <div className="space-y-3">
                 {/* 1. Image Upload */}
                 <div className="w-full h-32 bg-black rounded-lg border border-white/10 relative group overflow-hidden">
                    {form.imagePreview ? (
                        <img src={form.imagePreview} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                            <UploadCloud size={24} />
                            <span className="text-[10px]">Upload Foto Proyek</span>
                        </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setForm(p => ({...p, uploadFile: e.target.files![0], imagePreview: URL.createObjectURL(e.target.files![0])}))} />
                 </div>

                 {/* 2. Type & URL */}
                 <div className="grid grid-cols-2 gap-2">
                     <select 
                        value={getCurrentType()} 
                        onChange={e => handleTypeChange(e.target.value)} 
                        className="bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none"
                     >
                         <option value="hardware">Hardware / Fisik</option>
                         <option value="web">Website</option>
                         <option value="mobile">Mobile App</option>
                         <option value="desktop">Desktop App</option>
                     </select>
                     <div className="relative">
                        <LinkIcon size={12} className="absolute left-2 top-2.5 text-gray-500" />
                        <input value={form.client_url} onChange={e => setForm(p => ({...p, client_url: e.target.value}))} placeholder="Link URL" className="w-full bg-black text-white text-[10px] py-2 pl-6 pr-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                     </div>
                 </div>

                 {/* 3. Title */}
                 <input value={form.title} onChange={e => setForm(p => ({...p, title: e.target.value}))} placeholder="Judul Proyek" className="w-full bg-black text-white text-xs font-bold py-2 px-3 rounded border border-white/10 focus:border-brand-orange outline-none" />

                 {/* 4. Case Study Fields */}
                 <div className="space-y-2">
                     <input value={form.cs_challenge} onChange={e => setForm(p => ({...p, cs_challenge: e.target.value}))} placeholder="Tantangan (Challenge)" className="w-full bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                     <input value={form.cs_solution} onChange={e => setForm(p => ({...p, cs_solution: e.target.value}))} placeholder="Solusi (Solution)" className="w-full bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                     <input value={form.cs_result} onChange={e => setForm(p => ({...p, cs_result: e.target.value}))} placeholder="Hasil (Result)" className="w-full bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                 </div>

                 {/* 5. Separator & Testimonial Toggle */}
                 <div className="py-2 flex items-center justify-between">
                     <label className="flex items-center gap-2 cursor-pointer select-none">
                         <input type="checkbox" checked={testiForm.hasTestimonial} onChange={e => setTestiForm(p => ({...p, hasTestimonial: e.target.checked}))} className="accent-brand-orange w-3 h-3" />
                         <span className="text-[10px] font-bold text-white uppercase tracking-wider">Include Testimoni?</span>
                     </label>
                 </div>

                 {/* 6. AI & Stars Row */}
                 <div className="flex gap-2">
                    <button 
                        onClick={generateAINarrative} 
                        disabled={loadingState.generatingAI}
                        className="flex-1 bg-brand-orange text-white py-2 rounded text-[10px] font-bold hover:bg-brand-glow flex items-center justify-center gap-2 transition-all shadow-action"
                    >
                        {loadingState.generatingAI ? <LoadingSpinner size={14}/> : <><Sparkles size={14}/> MAGIC AI</>}
                    </button>
                    {testiForm.hasTestimonial && (
                        <div className="flex bg-black/40 border border-white/10 rounded px-2 items-center gap-1">
                            {[1,2,3,4,5].map(s => (
                                <Star key={s} size={10} className={`cursor-pointer ${s <= testiForm.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} onClick={() => setTestiForm(p => ({...p, rating: s}))} />
                            ))}
                        </div>
                    )}
                 </div>

                 {/* 7. Narrative Area */}
                 <textarea 
                    value={form.longDesc} 
                    onChange={e => setForm(p => ({...p, longDesc: e.target.value}))} 
                    placeholder="Narasi Proyek (Deskripsi Lengkap)..." 
                    className="w-full h-24 bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none leading-relaxed custom-scrollbar resize-none" 
                 />

                 {/* 8. Testimonial Box (Orange Border Concept) */}
                 {testiForm.hasTestimonial && (
                     <div className="border border-brand-orange/30 bg-brand-orange/5 rounded-lg p-3 space-y-2 animate-fade-in">
                         <div className="flex gap-2">
                             {/* Client Photo */}
                             <div className="w-10 h-10 rounded bg-black border border-brand-orange/20 overflow-hidden shrink-0 relative group">
                                {testiForm.imagePreview ? <img src={testiForm.imagePreview} className="w-full h-full object-cover" /> : <User size={16} className="text-brand-orange m-auto mt-2"/>}
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setTestiForm(p => ({...p, uploadFile: e.target.files![0], imagePreview: URL.createObjectURL(e.target.files![0])}))} />
                             </div>
                             {/* Client Info */}
                             <div className="flex-1 space-y-1">
                                 {/* Contextual Tag */}
                                 <div className="bg-black/50 border border-white/10 text-[9px] text-gray-400 px-2 py-1 rounded truncate">
                                     {form.title || "Project Context"}
                                 </div>
                                 <input 
                                    value={testiForm.client_name} 
                                    onChange={e => setTestiForm(p => ({...p, client_name: e.target.value}))} 
                                    placeholder="Nama Klien" 
                                    className="w-full bg-transparent border-b border-brand-orange/30 text-[10px] text-white focus:outline-none placeholder-white/30" 
                                 />
                             </div>
                         </div>
                         <textarea 
                            value={testiForm.content} 
                            onChange={e => setTestiForm(p => ({...p, content: e.target.value}))} 
                            placeholder="Isi testimoni..." 
                            className="w-full h-16 bg-black/30 text-white text-[10px] p-2 rounded border border-brand-orange/10 focus:border-brand-orange outline-none resize-none" 
                         />
                     </div>
                 )}

                 <Button onClick={handleSubmit} disabled={loadingState.uploading} className="w-full py-3 mt-2 text-xs">
                    {loadingState.uploading ? <LoadingSpinner /> : <><Save size={14} /> SIMPAN DATA</>}
                 </Button>
             </div>
         </div>
      </div>

      {/* COLUMN 3: PREVIEW (40%) */}
      <div className="w-[40%] bg-black flex items-center justify-center p-8 overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          
          <div className="w-full max-w-sm">
             <div className="text-center mb-4">
                <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-2 py-1 rounded">Live Preview</span>
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
             {testiForm.hasTestimonial && (
                 <div className="mt-4 bg-brand-dark border border-white/10 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
                     <div className="w-10 h-10 rounded-full border border-brand-orange/30 p-0.5 shrink-0">
                        <img src={testiForm.imagePreview ? testiForm.imagePreview : "https://via.placeholder.com/100"} className="w-full h-full rounded-full object-cover bg-black" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <h5 className="text-xs font-bold text-white">{testiForm.client_name || "Nama Klien"}</h5>
                           <div className="flex text-yellow-500 gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} size={8} fill={i < testiForm.rating ? "currentColor":"none"}/>)}</div>
                        </div>
                        <p className="text-[9px] text-gray-400 italic line-clamp-1">"{testiForm.content || "Isi testimoni..."}"</p>
                     </div>
                 </div>
             )}

          </div>
      </div>
    </div>
  );
};
