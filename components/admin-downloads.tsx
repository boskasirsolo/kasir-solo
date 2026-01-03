
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X as XIcon, Search, UploadCloud, FileText, Link as LinkIcon, HardDrive, PlayCircle, HelpCircle, ChevronRight, ChevronLeft, Sparkles, Loader2, CheckCircle2, Wand2 } from 'lucide-react';
import { DownloadItem, Tutorial, FAQ } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, uploadToSupabase, renameFile, slugify, callGeminiWithRotation } from '../utils';

// --- LOGIC: Custom Hook for DOWNLOADS ---
const useDownloadManager = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    
    // Form State
    const [form, setForm] = useState<Partial<DownloadItem>>({
        id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows'
    });
    
    // Magic Feature State
    const [contextInput, setContextInput] = useState('');
    const [generatedTitles, setGeneratedTitles] = useState<string[]>([]);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    
    // Loading States
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState({ research: false, desc: false });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => { fetchDownloads(); }, []);

    const fetchDownloads = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('downloads').select('*').order('created_at', { ascending: false });
        if (data) setDownloads(data);
    };

    const resetForm = () => {
        setForm({ id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows' });
        setUploadFile(null);
        setContextInput('');
        setGeneratedTitles([]);
    };

    const handleEditClick = (item: DownloadItem) => { 
        setForm(item); 
        setContextInput(item.title); // Pre-fill context with title
        setGeneratedTitles([]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- MAGIC ACTION 1: RESEARCH TITLES ---
    const researchTitles = async () => {
        if (!contextInput) return alert("Isi 'Konteks Produk' dulu (misal: driver eppos rpp02).");
        setAiLoading(p => ({...p, research: true}));
        setGeneratedTitles([]);

        try {
            const prompt = `
            Role: SEO Specialist for Printer/POS Drivers & Software.
            Context: User wants to upload a file for "${contextInput}".
            Task: Generate 5 Long-tail Keyword Titles (High Volume, Low/Medium Competition).
            Target Audience: Indonesian users looking for drivers/manuals.
            Format: JSON Array of strings.
            Example: ["Driver Printer Eppos RPP02 (Windows 10/11)", "Download Driver Eppos RPP02 Terbaru", ...]
            
            Output: JUST the JSON Array.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const titles = JSON.parse(res.text || '[]');
            setGeneratedTitles(titles);
        } catch (e) { 
            alert("Gagal riset judul."); 
        } finally { 
            setAiLoading(p => ({...p, research: false})); 
        }
    };

    const selectTitle = (title: string) => {
        setForm(p => ({ ...p, title }));
    };

    // --- MAGIC ACTION 2: GENERATE DESC ---
    const generateDescription = async () => {
        const trigger = form.title || contextInput;
        if (!trigger) return alert("Pilih Judul atau isi Konteks dulu.");
        
        setAiLoading(p => ({...p, desc: true}));
        try {
            const prompt = `
            Role: Technical Support Specialist.
            Task: Write a short, helpful description (Indonesian) for a downloadable file.
            File Title: "${trigger}"
            Category: ${form.category}
            Context: POS System (Cashier) Support.
            Constraint: Max 2 sentences. Be direct. Explain what this file is for.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, description: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate deskripsi."); } 
        finally { setAiLoading(p => ({...p, desc: false})); }
    };

    // --- SUBMIT LOGIC (FIXED) ---
    const handleSubmit = async () => {
        if (!form.title || !form.category) return alert("Judul dan Kategori wajib diisi.");
        
        setLoading(true);
        try {
            let finalFileUrl = form.file_url;
            let finalFileSize = form.file_size;

            // Handle File Upload
            if (uploadFile && supabase) {
                // Generate safe filename based on Title
                const safeName = slugify(form.title || 'download-file');
                const fileToUpload = renameFile(uploadFile, safeName);
                
                // Upload
                const { url } = await uploadToSupabase(fileToUpload, 'files', 'downloads');
                finalFileUrl = url;
                
                // Auto calc size
                const sizeInMB = (uploadFile.size / (1024 * 1024)).toFixed(1);
                finalFileSize = `${sizeInMB} MB`;
            }

            // Prepare Clean DB Payload
            const dbData: any = {
                title: form.title,
                category: form.category,
                description: form.description,
                file_url: finalFileUrl,
                file_size: finalFileSize,
                version: form.version || 'v1.0',
                os_support: form.os_support || 'Windows',
                updated_at: new Date().toISOString()
            };

            if (form.id) {
                // Update Existing
                if (supabase) await supabase.from('downloads').update(dbData).eq('id', form.id);
                setDownloads(prev => prev.map(item => item.id === form.id ? { ...item, ...dbData, id: form.id } as DownloadItem : item));
            } else {
                // Insert New
                if (supabase) {
                    const { data, error } = await supabase.from('downloads').insert([dbData]).select().single();
                    if (error) throw error;
                    if (data) setDownloads(prev => [data, ...prev]);
                }
            }
            
            resetForm();
            alert("File berhasil disimpan!");
        } catch (e: any) { 
            console.error(e);
            alert(`Error: ${e.message}`); 
        } finally { 
            setLoading(false); 
        }
    };

    const deleteItem = async (id: string) => {
        if(!confirm("Hapus file?")) return;
        if (supabase) await supabase.from('downloads').delete().eq('id', id);
        setDownloads(prev => prev.filter(item => item.id !== id));
        if (form.id === id) resetForm();
    };

    const filtered = downloads.filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return { 
        form, setForm, 
        contextInput, setContextInput,
        generatedTitles, 
        uploadFile, setUploadFile, 
        loading, aiLoading,
        researchTitles, selectTitle, generateDescription, 
        handleSubmit, handleEditClick, resetForm, deleteItem, 
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm, totalItems: filtered.length } 
    };
};

// --- LOGIC: Custom Hook for TUTORIALS ---
const useTutorialManager = () => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [form, setForm] = useState<Partial<Tutorial>>({ id: 0, title: '', video_url: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchTutorials(); }, []);

    const fetchTutorials = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('tutorials').select('*').order('created_at', { ascending: false });
        if (data) setTutorials(data);
    };

    const handleSubmit = async () => {
        if (!form.title || !form.video_url) return alert("Isi Judul dan Link Video.");
        setLoading(true);
        try {
            if (form.id) {
                if (supabase) await supabase.from('tutorials').update(form).eq('id', form.id);
                setTutorials(prev => prev.map(t => t.id === form.id ? { ...t, ...form } as Tutorial : t));
            } else {
                if (supabase) {
                    const { data } = await supabase.from('tutorials').insert([{ title: form.title, video_url: form.video_url }]).select().single();
                    if (data) setTutorials(prev => [data, ...prev]);
                }
            }
            setForm({ id: 0, title: '', video_url: '' });
        } catch (e: any) { alert(`Error: ${e.message}`); } finally { setLoading(false); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus video?")) return;
        if (supabase) await supabase.from('tutorials').delete().eq('id', id);
        setTutorials(prev => prev.filter(t => t.id !== id));
    };

    return { tutorials, form, setForm, loading, handleSubmit, deleteItem };
};

// --- LOGIC: Custom Hook for FAQS ---
const useFaqManager = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [form, setForm] = useState<Partial<FAQ>>({ id: 0, question: '', answer: '' });
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => { fetchFaqs(); }, []);

    const fetchFaqs = async () => {
        if (!supabase) return;
        const { data } = await supabase.from('faqs').select('*').order('created_at', { ascending: false });
        if (data) setFaqs(data);
    };

    const generateAnswer = async () => {
        if (!form.question) return alert("Isi 'Pertanyaan' terlebih dahulu.");
        setIsGenerating(true);
        try {
            const prompt = `
            Role: Friendly Customer Support for POS System.
            Task: Provide a clear, concise answer (Indonesian) to this FAQ question.
            Question: "${form.question}"
            Context: Technical support for Cashier Machine/Software/Printer.
            Constraint: Max 2-3 sentences.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, answer: res.text?.trim() || '' }));
        } catch (e) { alert("Gagal generate jawaban."); } 
        finally { setIsGenerating(false); }
    };

    const handleSubmit = async () => {
        if (!form.question || !form.answer) return alert("Isi Pertanyaan dan Jawaban.");
        setLoading(true);
        try {
            if (form.id) {
                if (supabase) await supabase.from('faqs').update(form).eq('id', form.id);
                setFaqs(prev => prev.map(f => f.id === form.id ? { ...f, ...form } as FAQ : f));
            } else {
                if (supabase) {
                    const { data } = await supabase.from('faqs').insert([{ question: form.question, answer: form.answer }]).select().single();
                    if (data) setFaqs(prev => [data, ...prev]);
                }
            }
            setForm({ id: 0, question: '', answer: '' });
        } catch (e: any) { alert(`Error: ${e.message}`); } finally { setLoading(false); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus FAQ?")) return;
        if (supabase) await supabase.from('faqs').delete().eq('id', id);
        setFaqs(prev => prev.filter(f => f.id !== id));
    };

    return { faqs, form, setForm, loading, isGenerating, generateAnswer, handleSubmit, deleteItem };
};

// --- MAIN COMPONENT ---
export const AdminDownloads = () => {
    const [activeTab, setActiveTab] = useState<'files' | 'tutorials' | 'faq'>('files');
    const dlManager = useDownloadManager();
    const tutManager = useTutorialManager();
    const faqManager = useFaqManager();

    return (
        <div className="h-[600px] flex flex-col">
            {/* TAB NAV */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
                {[
                    { id: 'files', label: 'File Download', icon: HardDrive },
                    { id: 'tutorials', label: 'Video Tutorial', icon: PlayCircle },
                    { id: 'faq', label: 'FAQ Manager', icon: HelpCircle }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-lg transition-colors ${activeTab === tab.id ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon size={14} /> {tab.label}
                    </button>
                ))}
            </div>

            {/* TAB CONTENT */}
            <div className="flex-grow overflow-hidden">
                
                {/* 1. FILE MANAGER */}
                {activeTab === 'files' && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                        {/* LEFT: LIST */}
                        <div className="lg:col-span-7 bg-brand-dark rounded-xl border border-white/5 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                                <div className="relative flex-grow">
                                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                                    <input type="text" value={dlManager.listData.searchTerm} onChange={(e) => dlManager.listData.setSearchTerm(e.target.value)} placeholder="Cari file..." className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange" />
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-2">
                                {dlManager.listData.paginated.map((item) => (
                                    <div key={item.id} className="bg-brand-card border border-white/5 rounded-lg p-3 flex gap-3 items-center group hover:border-brand-orange/30">
                                        <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0"><HardDrive size={16} className="text-gray-400"/></div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                                            <p className="text-[10px] text-gray-500">{item.category} • {item.file_size}</p>
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => dlManager.handleEditClick(item)} className="p-1 hover:bg-blue-500/20 text-blue-400 rounded"><Edit size={14}/></button>
                                            <button onClick={() => dlManager.deleteItem(item.id)} className="p-1 hover:bg-red-500/20 text-red-400 rounded"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {dlManager.listData.totalPages > 1 && <div className="p-2 border-t border-white/10 flex justify-center gap-2"><button onClick={() => dlManager.listData.setPage(p => Math.max(1, p-1))}><ChevronLeft size={16}/></button><span className="text-xs">{dlManager.listData.page}</span><button onClick={() => dlManager.listData.setPage(p => Math.min(dlManager.listData.totalPages, p+1))}><ChevronRight size={16}/></button></div>}
                        </div>

                        {/* RIGHT: EDITOR */}
                        <div className="lg:col-span-5 bg-brand-dark p-6 rounded-xl border border-white/5 overflow-y-auto custom-scrollbar">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">{dlManager.form.id ? <Edit size={16}/> : <Plus size={16}/>} {dlManager.form.id ? 'Edit File' : 'Upload File'}</h3>
                            
                            <div className="space-y-4">
                                {/* Step 1: Type & Context */}
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">1. Jenis & Konteks</label>
                                    <select value={dlManager.form.category} onChange={e => dlManager.setForm(p => ({...p, category: e.target.value as any}))} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-xs text-white mb-2"><option value="driver">Driver</option><option value="manual">Manual / Panduan</option><option value="software">Software / App</option><option value="tools">Tools / Utility</option></select>
                                    
                                    <div className="relative">
                                        <Input value={dlManager.contextInput} onChange={e => dlManager.setContextInput(e.target.value)} placeholder="Konteks: Driver Eppos RPP02..." className="text-xs pr-10"/>
                                        <button onClick={dlManager.researchTitles} disabled={dlManager.aiLoading.research} className="absolute right-1 top-1 p-1.5 bg-brand-orange text-white rounded text-[10px] font-bold hover:bg-brand-action transition-all disabled:opacity-50" title="Riset Judul (Magic)">
                                            {dlManager.aiLoading.research ? <LoadingSpinner size={12}/> : <Sparkles size={12}/>}
                                        </button>
                                    </div>
                                </div>

                                {/* Step 2: Magic Titles (Optional) */}
                                {dlManager.generatedTitles.length > 0 && (
                                    <div className="p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-lg animate-fade-in">
                                        <label className="text-[10px] text-brand-orange font-bold uppercase mb-2 block flex items-center gap-2"><Sparkles size={10}/> Hasil Riset Judul</label>
                                        <div className="space-y-1">
                                            {dlManager.generatedTitles.map((t, idx) => (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => dlManager.selectTitle(t)}
                                                    className={`w-full text-left text-[10px] p-2 rounded border transition-all ${dlManager.form.title === t ? 'bg-brand-orange text-white border-brand-orange shadow-sm' : 'bg-black/20 text-gray-300 border-transparent hover:bg-white/5'}`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: File Upload */}
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">2. File Sumber</label>
                                    <div className="border border-dashed border-white/20 p-3 rounded text-center mb-2 hover:border-brand-orange/30 transition-colors cursor-pointer relative">
                                        <input type="file" onChange={e => e.target.files?.[0] && dlManager.setUploadFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer"/>
                                        <div className="flex flex-col items-center gap-1 pointer-events-none">
                                            <UploadCloud size={16} className={dlManager.uploadFile ? "text-brand-orange" : "text-gray-500"}/>
                                            <span className="text-[10px] text-gray-400">{dlManager.uploadFile ? dlManager.uploadFile.name : "Klik Upload File Local"}</span>
                                        </div>
                                    </div>
                                    <Input value={dlManager.form.file_url || ''} onChange={e => dlManager.setForm(p => ({...p, file_url: e.target.value}))} placeholder="Atau paste URL Eksternal..." className="text-[10px]"/>
                                </div>

                                {/* Step 4: Final Info */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">3. Detail Final</label>
                                    </div>
                                    <Input value={dlManager.form.title || ''} onChange={e => dlManager.setForm(p => ({...p, title: e.target.value}))} placeholder="Judul Final..." className="text-xs mb-2 font-bold"/>
                                    
                                    <div className="relative">
                                        <TextArea value={dlManager.form.description || ''} onChange={e => dlManager.setForm(p => ({...p, description: e.target.value}))} placeholder="Deskripsi file..." className="h-20 text-xs"/>
                                        <button 
                                            onClick={dlManager.generateDescription} 
                                            disabled={dlManager.aiLoading.desc} 
                                            className="absolute bottom-2 right-2 text-[10px] text-blue-400 hover:text-white flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30"
                                        >
                                            {dlManager.aiLoading.desc ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Desc</>}
                                        </button>
                                    </div>
                                </div>

                                <Button onClick={dlManager.handleSubmit} disabled={dlManager.loading} className="w-full text-xs py-3 shadow-neon">
                                    {dlManager.loading ? <><LoadingSpinner size={14}/> Menyimpan...</> : <><Save size={14}/> SIMPAN FILE</>}
                                </Button>
                                {dlManager.form.id && <button onClick={dlManager.resetForm} className="w-full text-xs text-gray-500 mt-2 hover:text-white">Batal Edit</button>}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. TUTORIAL MANAGER */}
                {activeTab === 'tutorials' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Daftar Video</h4>
                            <div className="space-y-2">
                                {tutManager.tutorials.map(t => (
                                    <div key={t.id} className="p-3 bg-brand-card rounded border border-white/5 flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <PlayCircle size={16} className="text-red-500"/>
                                            <div>
                                                <p className="text-xs font-bold text-white">{t.title}</p>
                                                <a href={t.video_url} target="_blank" className="text-[10px] text-blue-400 hover:underline">{t.video_url}</a>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => tutManager.setForm(t)} className="text-blue-400"><Edit size={14}/></button>
                                            <button onClick={() => tutManager.deleteItem(t.id)} className="text-red-400"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-6 h-fit">
                            <h3 className="text-sm font-bold text-white mb-4">{tutManager.form.id ? 'Edit Video' : 'Tambah Video'}</h3>
                            <div className="space-y-3">
                                <Input value={tutManager.form.title || ''} onChange={e => tutManager.setForm(p => ({...p, title: e.target.value}))} placeholder="Judul Video" className="text-xs"/>
                                <Input value={tutManager.form.video_url || ''} onChange={e => tutManager.setForm(p => ({...p, video_url: e.target.value}))} placeholder="https://youtube.com/..." className="text-xs"/>
                                <Button onClick={tutManager.handleSubmit} disabled={tutManager.loading} className="w-full text-xs py-2">{tutManager.loading ? <LoadingSpinner/> : 'Simpan Video'}</Button>
                                {tutManager.form.id ? <button onClick={() => tutManager.setForm({id:0, title:'', video_url:''})} className="w-full text-xs text-gray-500">Batal</button> : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. FAQ MANAGER */}
                {activeTab === 'faq' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-4 overflow-y-auto custom-scrollbar">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">Daftar FAQ</h4>
                            <div className="space-y-2">
                                {faqManager.faqs.map(f => (
                                    <div key={f.id} className="p-3 bg-brand-card rounded border border-white/5 group">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-xs font-bold text-white w-full">{f.question}</p>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                <button onClick={() => faqManager.setForm(f)} className="text-blue-400"><Edit size={14}/></button>
                                                <button onClick={() => faqManager.deleteItem(f.id)} className="text-red-400"><Trash2 size={14}/></button>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 line-clamp-2">{f.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="bg-brand-dark rounded-xl border border-white/5 p-6 h-fit">
                            <h3 className="text-sm font-bold text-white mb-4">{faqManager.form.id ? 'Edit FAQ' : 'Tambah FAQ'}</h3>
                            <div className="space-y-3">
                                <Input value={faqManager.form.question || ''} onChange={e => faqManager.setForm(p => ({...p, question: e.target.value}))} placeholder="Pertanyaan (Q)" className="text-xs"/>
                                
                                {/* ANSWER WITH AI BUTTON */}
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">Jawaban (A)</label>
                                        <button 
                                            onClick={faqManager.generateAnswer} 
                                            disabled={faqManager.isGenerating} 
                                            className="text-[10px] text-blue-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                                        >
                                            {faqManager.isGenerating ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI Answer</>}
                                        </button>
                                    </div>
                                    <TextArea value={faqManager.form.answer || ''} onChange={e => faqManager.setForm(p => ({...p, answer: e.target.value}))} placeholder="Jawaban (A)" className="h-24 text-xs"/>
                                </div>

                                <Button onClick={faqManager.handleSubmit} disabled={faqManager.loading} className="w-full text-xs py-2">{faqManager.loading ? <LoadingSpinner/> : 'Simpan FAQ'}</Button>
                                {faqManager.form.id ? <button onClick={() => faqManager.setForm({id:0, question:'', answer:''})} className="w-full text-xs text-gray-500">Batal</button> : null}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
