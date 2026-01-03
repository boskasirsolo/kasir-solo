
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, Search, UploadCloud, FileText, HardDrive, PlayCircle, HelpCircle, ChevronRight, ChevronLeft, Sparkles, Loader2, Wand2, Smartphone, Wrench, BarChart2, Monitor } from 'lucide-react';
import { DownloadItem, Tutorial, FAQ } from '../types';
import { Button, Input, TextArea, LoadingSpinner } from './ui';
import { supabase, uploadToSupabase, renameFile, slugify, callGeminiWithRotation } from '../utils';

// Local interface for research results
interface ResearchResult {
    title: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
}

// --- LOGIC: Custom Hook for DOWNLOADS ---
const useDownloadManager = () => {
    const [downloads, setDownloads] = useState<DownloadItem[]>([]);
    
    // Form State
    const [form, setForm] = useState<Partial<DownloadItem>>({
        id: '', title: '', category: 'driver', description: '', file_url: '', version: '', file_size: '', os_support: 'Windows'
    });
    
    // Magic Feature State
    const [contextInput, setContextInput] = useState('');
    const [generatedTitles, setGeneratedTitles] = useState<ResearchResult[]>([]);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    
    // Loading States
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState({ research: false, desc: false });
    
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const itemsPerPage = 6; // Increased for Grid

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
        // Scroll to editor on mobile only
        if (window.innerWidth < 1024) {
             window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // --- MAGIC ACTION 1: RESEARCH TITLES (WITH METRICS) ---
    const researchTitles = async () => {
        if (!contextInput) return alert("Isi 'Konteks Produk' dulu (misal: driver eppos rpp02).");
        setAiLoading(p => ({...p, research: true}));
        setGeneratedTitles([]);

        try {
            const prompt = `
            Role: SEO Specialist for Technical Support (Drivers, Manuals, Software).
            Context: User wants to upload a file regarding "${contextInput}".
            Category: ${form.category}.
            
            Task: Generate 5 High-Potential Long-tail Keyword Titles suitable for a download page.
            
            Metrics Requirement:
            - Estimate Monthly Search Volume (Indonesia).
            - Estimate Competition Level (Low/Medium/High).
            
            Format: JSON Array of Objects.
            Example:
            [
              {"title": "Driver Printer Thermal Eppos RPP02 Windows 10/11 (Terbaru)", "volume": "1.2k/mo", "competition": "Low"},
              {"title": "Download Setting IP Address Eppos RPP02", "volume": "480/mo", "competition": "Medium"}
            ]
            
            Output: JUST the JSON Array.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const titles = JSON.parse(res.text || '[]');
            setGeneratedTitles(titles);
        } catch (e) { 
            console.error(e);
            alert("Gagal riset judul. Coba lagi."); 
        } finally { 
            setAiLoading(p => ({...p, research: false})); 
        }
    };

    const selectTitle = (title: string) => {
        setForm(p => ({ ...p, title }));
    };

    // --- MAGIC ACTION 2: MODERN SEO DESCRIPTION (CLEAN OUTPUT) ---
    const generateDescription = async () => {
        const trigger = form.title || contextInput;
        if (!trigger) return alert("Pilih Judul atau isi Konteks dulu.");
        
        setAiLoading(p => ({...p, desc: true}));
        try {
            const prompt = `
            Role: UX Writer & Technical Support Specialist.
            Task: Write a meta-description / file description for: "${trigger}".
            Category: ${form.category}.
            
            Guidelines (Modern SEO):
            1. Focus on User Intent: What problem does this file solve?
            2. Be Technical but Clear: Mention OS compatibility or specific versions if implied.
            3. Natural Language: Do NOT keyword stuff. Write for humans.
            4. Length: 2-3 concise sentences. Indonesian Language.
            
            STRICT OUTPUT RULE: Return ONLY the description text. Do NOT add intro like "Berikut adalah deskripsi..." or "Here is...".
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            
            // Post-processing to clean any accidental AI chat intro
            let cleanText = res.text?.trim() || '';
            cleanText = cleanText.replace(/^(Berikut|Here|Ini|Deskripsi|Meta).*?:/i, '').trim(); // Remove "Berikut adalah:"
            cleanText = cleanText.replace(/^"|"$/g, ''); // Remove surrounding quotes
            
            setForm(prev => ({ ...prev, description: cleanText }));
        } catch (e) { alert("Gagal generate deskripsi."); } 
        finally { setAiLoading(p => ({...p, desc: false})); }
    };

    // --- SUBMIT LOGIC ---
    const handleSubmit = async () => {
        if (!form.title || !form.category) return alert("Judul dan Kategori wajib diisi.");
        
        setLoading(true);
        try {
            let finalFileUrl = form.file_url;
            let finalFileSize = form.file_size;

            // Handle File Upload
            if (uploadFile && supabase) {
                // Generate safe filename based on Title
                const safeName = slugify(form.title || 'download-file').substring(0, 50);
                const fileToUpload = renameFile(uploadFile, safeName);
                
                // Upload
                const { url } = await uploadToSupabase(fileToUpload, 'files', 'downloads');
                finalFileUrl = url;
                
                // Auto calc size
                const sizeInMB = (uploadFile.size / (1024 * 1024)).toFixed(1);
                finalFileSize = `${sizeInMB} MB`;
            }

            // Prepare Clean DB Payload (omit ID if empty string)
            const dbData: any = {
                title: form.title,
                category: form.category,
                description: form.description,
                file_url: finalFileUrl,
                file_size: finalFileSize || 'Unknown',
                version: form.version || 'Latest',
                os_support: form.os_support || 'Windows',
                updated_at: new Date().toISOString()
            };

            if (form.id) {
                // UPDATE
                if (supabase) {
                    const { error } = await supabase.from('downloads').update(dbData).eq('id', form.id);
                    if (error) throw error;
                }
                setDownloads(prev => prev.map(item => item.id === form.id ? { ...item, ...dbData, id: form.id } as DownloadItem : item));
            } else {
                // INSERT
                if (supabase) {
                    const { data, error } = await supabase.from('downloads').insert([dbData]).select().single();
                    if (error) throw error;
                    if (data) setDownloads(prev => [data, ...prev]);
                } else {
                    // Mock for demo
                    setDownloads(prev => [{...dbData, id: Date.now().toString()} as DownloadItem, ...prev]);
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

// ... (Tutorial and FAQ hooks remain unchanged)
const useTutorialManager = () => {
    const [tutorials, setTutorials] = useState<Tutorial[]>([]);
    const [form, setForm] = useState<Partial<Tutorial>>({ id: 0, title: '', video_url: '' });
    const [loading, setLoading] = useState(false);
    useEffect(() => { 
        if(supabase) supabase.from('tutorials').select('*').order('created_at', {ascending: false}).then(({data}) => { if(data) setTutorials(data); });
    }, []);
    const handleSubmit = async () => {
        if(!form.title) return alert("Isi Judul");
        setLoading(true);
        if(form.id) {
            if(supabase) await supabase.from('tutorials').update(form).eq('id', form.id);
            setTutorials(p => p.map(x => x.id === form.id ? {...x, ...form} as Tutorial : x));
        } else {
            if(supabase) {
                const {data} = await supabase.from('tutorials').insert([form]).select().single();
                if(data) setTutorials(p => [data, ...p]);
            }
        }
        setLoading(false); setForm({id:0, title:'', video_url:''});
    };
    const deleteItem = async (id: number) => {
        if(!confirm("Hapus?")) return;
        if(supabase) await supabase.from('tutorials').delete().eq('id', id);
        setTutorials(p => p.filter(x => x.id !== id));
    }
    return { tutorials, form, setForm, loading, handleSubmit, deleteItem };
};

const useFaqManager = () => {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [form, setForm] = useState<Partial<FAQ>>({ id: 0, question: '', answer: '' });
    const [loading, setLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => { 
        if(supabase) supabase.from('faqs').select('*').order('created_at', {ascending: false}).then(({data}) => { if(data) setFaqs(data); });
    }, []);

    const handleSubmit = async () => {
        if(!form.question) return alert("Isi Pertanyaan");
        setLoading(true);
        try {
            if(form.id) {
                if(supabase) await supabase.from('faqs').update(form).eq('id', form.id);
                setFaqs(p => p.map(x => x.id === form.id ? {...x, ...form} as FAQ : x));
            } else {
                if(supabase) {
                    const {data} = await supabase.from('faqs').insert([form]).select().single();
                    if(data) setFaqs(p => [data, ...p]);
                }
            }
            setForm({id:0, question:'', answer:''});
        } catch (e) {
            console.error(e);
            alert("Error saving FAQ");
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus?")) return;
        if(supabase) await supabase.from('faqs').delete().eq('id', id);
        setFaqs(p => p.filter(x => x.id !== id));
    }

    const generateAnswer = async () => {
        if (!form.question) return alert("Isi Pertanyaan (Q) dulu sebagai konteks.");
        setIsGenerating(true);
        try {
            const prompt = `
            Role: Customer Support Specialist for Technical Product (POS System).
            Task: Answer this FAQ Question clearly and briefly.
            Question: "${form.question}"
            Context: Product is PT Mesin Kasir Solo (Hardware & Software POS).
            Language: Indonesian.
            Tone: Helpful, Professional, Straightforward.
            Length: 2-3 sentences max.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setForm(prev => ({ ...prev, answer: res.text?.trim() || '' }));
        } catch (e) { 
            console.error(e);
            alert("Gagal generate jawaban."); 
        } finally { 
            setIsGenerating(false); 
        }
    };

    return { faqs, form, setForm, loading, handleSubmit, deleteItem, generateAnswer, isGenerating };
};


// --- MAIN COMPONENT ---
export const AdminDownloads = () => {
    const [activeTab, setActiveTab] = useState<'files' | 'tutorials' | 'faq'>('files');
    const dlManager = useDownloadManager();
    const tutManager = useTutorialManager();
    const faqManager = useFaqManager();

    // Helper to get icon for category
    const getFileIcon = (cat: string) => {
        switch(cat) {
            case 'driver': return HardDrive;
            case 'manual': return FileText;
            case 'software': return Smartphone;
            case 'tools': return Wrench;
            default: return FileText;
        }
    }

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
                        {/* LEFT: LIST (Cards Grid) */}
                        <div className="lg:col-span-7 bg-brand-dark rounded-xl border border-white/5 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                                <div className="relative flex-grow">
                                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                                    <input type="text" value={dlManager.listData.searchTerm} onChange={(e) => dlManager.listData.setSearchTerm(e.target.value)} placeholder="Cari file..." className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange" />
                                </div>
                                <button onClick={dlManager.resetForm} className="bg-brand-orange text-white p-2 rounded-lg hover:bg-brand-action"><Plus size={16}/></button>
                            </div>
                            
                            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-3">
                                    {dlManager.listData.paginated.map((item) => {
                                        const Icon = getFileIcon(item.category);
                                        return (
                                            <div 
                                                key={item.id} 
                                                onClick={() => dlManager.handleEditClick(item)}
                                                className={`bg-brand-card border rounded-lg p-3 cursor-pointer group transition-all flex flex-col h-full relative ${dlManager.form.id === item.id ? 'border-brand-orange shadow-neon-text' : 'border-white/5 hover:border-brand-orange/50'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 text-gray-400 group-hover:text-brand-orange group-hover:bg-brand-orange/10 transition-colors">
                                                        <Icon size={16}/>
                                                    </div>
                                                    <span className="text-[9px] font-bold uppercase bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-gray-500">{item.category}</span>
                                                </div>
                                                <h5 className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1 group-hover:text-brand-orange transition-colors">{item.title}</h5>
                                                <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500">
                                                    <span className="flex items-center gap-1"><Monitor size={8}/> {item.os_support}</span>
                                                    <span>{item.file_size}</span>
                                                </div>
                                                
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); dlManager.deleteItem(item.id); }} 
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                                                >
                                                    <Trash2 size={12}/>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {dlManager.listData.totalPages > 1 && <div className="p-2 border-t border-white/10 flex justify-center gap-2"><button onClick={() => dlManager.listData.setPage(p => Math.max(1, p-1))}><ChevronLeft size={16}/></button><span className="text-xs">{dlManager.listData.page}</span><button onClick={() => dlManager.listData.setPage(p => Math.min(dlManager.listData.totalPages, p+1))}><ChevronRight size={16}/></button></div>}
                        </div>

                        {/* RIGHT: EDITOR */}
                        <div className="lg:col-span-5 bg-brand-dark p-6 rounded-xl border border-white/5 overflow-y-auto custom-scrollbar">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">{dlManager.form.id ? <Edit size={16}/> : <Plus size={16}/>} {dlManager.form.id ? 'Edit File' : 'Upload File'}</h3>
                            
                            <div className="space-y-4">
                                {/* Step 1: Type & Context */}
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    {/* FLAT CATEGORY SELECTOR */}
                                    <div className="mb-4">
                                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">1. Jenis File</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                { id: 'driver', label: 'Driver', icon: HardDrive },
                                                { id: 'manual', label: 'Manual', icon: FileText },
                                                { id: 'software', label: 'Software', icon: Smartphone },
                                                { id: 'tools', label: 'Tools', icon: Wrench }
                                            ].map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => dlManager.setForm(p => ({...p, category: cat.id as any}))}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] font-bold transition-all ${
                                                        dlManager.form.category === cat.id
                                                        ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text'
                                                        : 'bg-black/40 text-gray-400 border-white/10 hover:bg-white/5 hover:text-white'
                                                    }`}
                                                >
                                                    <cat.icon size={12} />
                                                    {cat.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* SEPARATED CONTEXT INPUT & BUTTON */}
                                    <div>
                                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex justify-between">
                                            <span>2. Konteks Produk</span>
                                            <span className="text-brand-orange flex items-center gap-1 opacity-80"><Sparkles size={8}/> AI Assist</span>
                                        </label>
                                        <div className="flex gap-2">
                                            <Input 
                                                value={dlManager.contextInput} 
                                                onChange={e => dlManager.setContextInput(e.target.value)} 
                                                placeholder="Contoh: Driver Eppos RPP02..." 
                                                className="text-xs h-10 flex-1"
                                            />
                                            <button 
                                                onClick={dlManager.researchTitles} 
                                                disabled={dlManager.aiLoading.research} 
                                                className="shrink-0 h-10 w-10 bg-brand-orange text-white rounded-lg font-bold hover:bg-brand-action transition-all disabled:opacity-50 flex items-center justify-center shadow-neon border border-white/10" 
                                                title="Riset Judul Otomatis"
                                            >
                                                {dlManager.aiLoading.research ? <LoadingSpinner size={16}/> : <Sparkles size={18}/>}
                                            </button>
                                        </div>
                                        <p className="text-[9px] text-gray-500 mt-1.5 italic">
                                            *Klik tombol magic untuk riset judul SEO friendly.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2: Magic Titles (Optional) - WITH METRICS */}
                                {dlManager.generatedTitles.length > 0 && (
                                    <div className="p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-lg animate-fade-in">
                                        <label className="text-[10px] text-brand-orange font-bold uppercase mb-2 block flex items-center gap-2"><Sparkles size={10}/> Hasil Riset Judul</label>
                                        <div className="space-y-1">
                                            {dlManager.generatedTitles.map((t, idx) => (
                                                <button 
                                                    key={idx} 
                                                    onClick={() => dlManager.selectTitle(t.title)}
                                                    className={`w-full text-left p-2 rounded border transition-all flex flex-col gap-1 group ${dlManager.form.title === t.title ? 'bg-brand-orange text-white border-brand-orange shadow-sm' : 'bg-black/20 text-gray-300 border-transparent hover:bg-white/5'}`}
                                                >
                                                    <span className="text-[10px] font-medium leading-snug">{t.title}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[8px] px-1.5 py-0.5 rounded border ${t.competition === 'Low' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'}`}>
                                                            {t.competition} Comp
                                                        </span>
                                                        <span className="text-[8px] text-gray-500 font-mono flex items-center gap-1">
                                                            <BarChart2 size={8}/> {t.volume}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Step 3: File Upload */}
                                <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">3. File Sumber</label>
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
                                        <label className="text-[10px] text-gray-500 font-bold uppercase">4. Detail Final</label>
                                    </div>
                                    <Input value={dlManager.form.title || ''} onChange={e => dlManager.setForm(p => ({...p, title: e.target.value}))} placeholder="Judul Final..." className="text-xs mb-2 font-bold"/>
                                    
                                    <div className="relative">
                                        <TextArea value={dlManager.form.description || ''} onChange={e => dlManager.setForm(p => ({...p, description: e.target.value}))} placeholder="Deskripsi file..." className="h-20 text-xs leading-relaxed"/>
                                        <button 
                                            onClick={dlManager.generateDescription} 
                                            disabled={dlManager.aiLoading.desc} 
                                            className="absolute bottom-2 right-2 text-[10px] text-blue-400 hover:text-white flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30 shadow-lg"
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
