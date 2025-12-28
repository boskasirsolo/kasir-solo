
// ... keep imports ...
import React, { useState } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, FileText, Calendar, User, Clock, TrendingUp, Target, List, CheckCircle2, RefreshCw } from 'lucide-react';
import { Article } from '../types';
import { Button, Input, TextArea, LoadingSpinner, Badge } from './ui';
import { supabase, CONFIG, ensureAPIKey, getEnv } from '../utils';
import { GoogleGenAI } from "@google/genai";

const ITEMS_PER_PAGE = 6;

// --- INTERFACES FOR AI FLOW ---
interface KeywordData {
    keyword: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
}

interface GenConfig {
    autoImage: boolean;
    autoCategory: boolean;
    autoAuthor: boolean;
}

// --- LOGIC: Custom Hook ---
const useArticleManager = (
    articles: Article[], 
    setArticles: (a: Article[]) => void
) => {
    // Basic Form State
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: 'Admin',
        readTime: '10 min read',
        imagePreview: '',
        uploadFile: null as File | null,
        status: 'draft' as 'published' | 'draft' | 'scheduled',
        scheduled_for: ''
    });

    // AI Flow State
    const [aiStep, setAiStep] = useState<number>(0); // 0: Idle, 1: Keywords, 2: Titles, 3: Ready
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);
    const [titleOptions, setTitleOptions] = useState<string[]>([]);
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true,
        autoCategory: true,
        autoAuthor: true
    });

    const [loading, setLoading] = useState({
        uploading: false,
        researching: false,
        titling: false,
        generatingContent: false
    });

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const resetForm = () => {
        setForm({
            id: null,
            title: '',
            excerpt: '',
            content: '',
            category: '',
            author: 'Admin',
            readTime: '10 min read',
            imagePreview: '',
            uploadFile: null,
            status: 'draft',
            scheduled_for: ''
        });
        setAiStep(0);
        setKeywords([]);
        setTitleOptions([]);
        setSelectedKeyword(null);
    };

    const handleEditClick = (item: Article) => {
        setForm({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            author: item.author,
            readTime: item.readTime,
            imagePreview: item.image,
            uploadFile: null,
            status: item.status || 'published',
            scheduled_for: item.scheduled_for || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setAiStep(3); // Skip to editor mode
    };

    // --- AI: STEP 1 - KEYWORD RESEARCH ---
    const researchKeywords = async () => {
        setLoading(prev => ({ ...prev, researching: true }));
        try {
            await ensureAPIKey();
            const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });
            
            const prompt = `
            Act as an SEO Expert for "Mesin Kasir" and "UMKM Indonesia".
            List 5 trending keywords related to: "Mesin Kasir", "Strategi Ritel", "Pembukuan UMKM", "Teknologi Toko", "Franchise".
            Focus on keywords with HIGH VOLUME but LOW/MEDIUM COMPETITION.
            
            RETURN JSON ARRAY ONLY:
            [
              { "keyword": "...", "volume": "10k-100k", "competition": "Low" }
            ]
            `;
            
            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            const rawText = response.text?.replace(/```json|```/g, '').trim() || '[]';
            const data = JSON.parse(rawText);
            
            setKeywords(data);
            setAiStep(1);
        } catch (e: any) {
            alert("Gagal riset keyword: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, researching: false }));
        }
    };

    // --- AI: STEP 2 - TITLE GENERATION ---
    const generateTitles = async (keywordData: KeywordData) => {
        setSelectedKeyword(keywordData);
        setLoading(prev => ({ ...prev, titling: true }));
        try {
            await ensureAPIKey();
            const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const prompt = `
            Based on keyword: "${keywordData.keyword}"
            Generate 3 viral, click-worthy, SEO-optimized Article Titles (Long-tail).
            Target Audience: Business Owners (UMKM) in Indonesia.
            Language: Indonesian.
            
            RETURN JSON ARRAY OF STRINGS ONLY:
            ["Title 1...", "Title 2...", "Title 3..."]
            `;

            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            const rawText = response.text?.replace(/```json|```/g, '').trim() || '[]';
            const data = JSON.parse(rawText);

            setTitleOptions(data);
            setAiStep(2);
        } catch (e: any) {
            alert("Gagal generate judul: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, titling: false }));
        }
    };

    // --- AI: STEP 3 - PILLAR CONTENT GENERATION ---
    const generatePillarContent = async () => {
        if (!form.title) return alert("Pilih judul terlebih dahulu.");
        
        setLoading(prev => ({ ...prev, generatingContent: true }));
        try {
            await ensureAPIKey();
            const apiKey = process.env.API_KEY || getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY');
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const prompt = `
            Role: Expert Business Consultant & Tech Reviewer (Persona: "SIBOS Expert").
            Task: Write a PILLAR ARTICLE (Comprehensive, Long-form).
            Title: "${form.title}"
            Keyword: "${selectedKeyword?.keyword || form.title}"
            
            CONFIG:
            - Auto Category: ${genConfig.autoCategory}
            - Auto Author: ${genConfig.autoAuthor}
            
            STRUCTURE:
            1. **Hook (Intro)**: Empathize with owner problems.
            2. **Deep Dive (Body)**: Use H2 (##) and H3 (###). Min 4-5 sections.
            3. **Actionable Tips**: Bullet points.
            4. **Conclusion**: Strong Call to Action.
            
            STYLE:
            - Language: Indonesian (Professional but flowing).
            - Formatting: Markdown.
            - Length: Minimum 800 words (Pillar Content).
            
            OUTPUT JSON ONLY:
            {
               "content": "# Title... (markdown body)",
               "excerpt": "Short summary (max 150 chars)",
               "category": "Suggested Category",
               "author": "Suggested Author Name (e.g., Amin Maghfuri / Tim SIBOS)",
               "image_search_query": "English keyword for Unsplash image search"
            }
            `;

            const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
            const rawText = response.text?.replace(/```json|```/g, '').trim() || '{}';
            const data = JSON.parse(rawText);

            // Update Form
            setForm(prev => ({
                ...prev,
                content: data.content,
                excerpt: data.excerpt,
                category: genConfig.autoCategory ? data.category : prev.category,
                author: genConfig.autoAuthor ? data.author : prev.author,
                imagePreview: genConfig.autoImage 
                    ? `https://source.unsplash.com/1200x600/?${encodeURIComponent(data.image_search_query || 'technology,business')}` 
                    : prev.imagePreview,
                status: 'draft' // Default to draft per request
            }));

            setAiStep(3); // Done, ready to edit/publish
        } catch (e: any) {
            console.error(e);
            alert("Gagal generate konten: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, generatingContent: false }));
        }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        if (!CONFIG.CLOUDINARY_CLOUD_NAME) return alert("Config Cloudinary Missing");

        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200';

            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            // Data structure for Database (Snake Case)
            const dbData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                read_time: form.readTime,
                image_url: finalImageUrl,
                status: form.status,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                date: form.id ? undefined : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            // Remove undefined fields
            if (!dbData.date) delete dbData.date;

            // Prepare object for Local State (Camel Case matching Article interface)
            const localUpdateData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                readTime: form.readTime,
                image: finalImageUrl,
                status: form.status,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : undefined
            };

            if (form.id) {
                // Update Local
                const existing = articles.find(a => a.id === form.id);
                if (existing) {
                    const updatedItem: Article = { 
                        ...existing, 
                        ...localUpdateData,
                        id: form.id
                    };
                    setArticles(articles.map(a => a.id === form.id ? updatedItem : a));
                }
                
                // Update DB
                if (supabase) {
                    const { error } = await supabase.from('articles').update(dbData).eq('id', form.id);
                    if (error) throw error;
                }
            } else {
                // Insert Local
                const newId = Date.now();
                const newItem: Article = { 
                    ...localUpdateData, 
                    id: newId, 
                    date: dbData.date || 'Today',
                    tags: [] 
                };
                setArticles([newItem, ...articles]);
                
                // Insert DB
                if (supabase) {
                     const { error } = await supabase.from('articles').insert([dbData]);
                    if (error) throw error;
                }
            }
            resetForm();
            alert(`Artikel berhasil disimpan sebagai ${form.status.toUpperCase()}!`);
        } catch (e) { console.error(e); alert("Gagal menyimpan."); }
        finally { setLoading(prev => ({ ...prev, uploading: false })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel ini?")) return;
        setArticles(articles.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const filtered = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loading,
        aiState: { step: aiStep, setStep: setAiStep, keywords, selectedKeyword, titleOptions, genConfig, setGenConfig },
        actions: { researchKeywords, generateTitles, generatePillarContent, handleSubmit, handleEditClick, resetForm, deleteItem },
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

// ... (Rest of the file remains unchanged, i.e., ArticleForm, ArticleList, AdminArticles)
const ArticleForm = ({ 
    form, setForm, loading, aiState, actions
}: {
    form: any, setForm: any, loading: any, aiState: any, actions: any
}) => (
    <div className="bg-brand-dark p-6 rounded-xl border border-white/5 h-fit sticky top-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={18} className="text-brand-orange"/> : <Sparkles size={18} className="text-brand-orange"/>}
                {form.id ? "Edit Artikel" : "AI Content Studio"}
            </h3>
            {form.id || aiState.step > 0 ? (
                <button onClick={actions.resetForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                    <RefreshCw size={12} /> Reset
                </button>
            ) : null}
        </div>

        {/* --- AI WIZARD SECTION (Only for New Articles or when step < 3) --- */}
        {!form.id && aiState.step < 3 && (
            <div className="mb-8 space-y-6">
                
                {/* STEP 1: KEYWORD RESEARCH */}
                <div className={`transition-all duration-300 ${aiState.step > 1 ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs text-brand-orange font-bold uppercase tracking-wider flex items-center gap-2">
                            <Target size={14} /> Step 1: Riset Topik
                        </label>
                    </div>
                    {aiState.keywords.length === 0 ? (
                         <button 
                            onClick={actions.researchKeywords} 
                            disabled={loading.researching}
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                        >
                            {loading.researching ? <LoadingSpinner size={16} /> : <><TrendingUp size={18}/> RISET KEYWORD POPULER (MAGIC)</>}
                        </button>
                    ) : (
                        <div className="bg-brand-card border border-white/10 rounded-lg p-2 max-h-40 overflow-y-auto custom-scrollbar">
                            {aiState.keywords.map((k: KeywordData, i: number) => (
                                <button 
                                    key={i}
                                    onClick={() => actions.generateTitles(k)}
                                    className="w-full text-left p-2 hover:bg-white/5 rounded flex justify-between items-center group"
                                >
                                    <span className="text-sm text-white font-bold">{k.keyword}</span>
                                    <div className="flex gap-2">
                                        <Badge className="bg-green-500/10 text-green-400 text-[9px]">{k.volume}</Badge>
                                        <Badge className="bg-yellow-500/10 text-yellow-400 text-[9px]">{k.competition}</Badge>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* STEP 2: TITLE SELECTION */}
                {aiState.step >= 1 && (
                    <div className={`transition-all duration-300 ${aiState.step > 2 ? 'opacity-50' : 'opacity-100 animate-fade-in'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs text-brand-orange font-bold uppercase tracking-wider flex items-center gap-2">
                                <List size={14} /> Step 2: Pilih Judul ({aiState.selectedKeyword?.keyword})
                            </label>
                        </div>
                        {loading.titling ? (
                            <div className="p-4 text-center text-gray-400 text-xs"><LoadingSpinner /> Menganalisa long-tail keywords...</div>
                        ) : (
                            <div className="space-y-2">
                                {aiState.titleOptions.map((title: string, i: number) => (
                                    <button 
                                        key={i}
                                        onClick={() => {
                                            setForm((prev: any) => ({ ...prev, title }));
                                            aiState.setStep(2); // Ready for config
                                        }}
                                        className={`w-full text-left p-3 rounded-lg border transition-all text-sm font-bold ${
                                            form.title === title 
                                            ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
                                            : 'bg-brand-card border-white/10 text-gray-300 hover:border-brand-orange/50'
                                        }`}
                                    >
                                        {title}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 3: CONFIG & GENERATE */}
                {aiState.step >= 2 && form.title && (
                    <div className="animate-fade-in border-t border-white/10 pt-4">
                         <label className="text-xs text-brand-orange font-bold uppercase tracking-wider flex items-center gap-2 mb-3">
                                <Sparkles size={14} /> Step 3: Setup & Generate Pillar Content
                         </label>
                         
                         <div className="flex gap-4 mb-4">
                            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                <input type="checkbox" checked={aiState.genConfig.autoImage} onChange={e => aiState.setGenConfig({...aiState.genConfig, autoImage: e.target.checked})} className="accent-brand-orange"/> Auto Image
                            </label>
                            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                <input type="checkbox" checked={aiState.genConfig.autoCategory} onChange={e => aiState.setGenConfig({...aiState.genConfig, autoCategory: e.target.checked})} className="accent-brand-orange"/> Auto Category
                            </label>
                             <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                                <input type="checkbox" checked={aiState.genConfig.autoAuthor} onChange={e => aiState.setGenConfig({...aiState.genConfig, autoAuthor: e.target.checked})} className="accent-brand-orange"/> Auto Author
                            </label>
                         </div>

                         <button 
                            onClick={actions.generatePillarContent}
                            disabled={loading.generatingContent}
                            className="w-full py-3 bg-brand-orange hover:bg-brand-glow text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-action transition-all"
                         >
                            {loading.generatingContent ? <LoadingSpinner size={16} /> : <><Sparkles size={18}/> GENERATE PILLAR CONTENT</>}
                         </button>
                         <p className="text-[10px] text-gray-500 text-center mt-2">Mode: Expert Persona • SEO Optimized • Long Form</p>
                    </div>
                )}
            </div>
        )}

        {/* --- EDITOR SECTION (Visible if ID exists OR Step == 3) --- */}
        {(form.id || aiState.step === 3) && (
            <div className="space-y-4 animate-fade-in">
                
                {/* Image Upload/Preview */}
                <div className="mb-4">
                    {form.imagePreview && (
                    <div className="mb-3 relative w-full h-40 bg-black/40 rounded-lg overflow-hidden border border-white/10 group">
                        <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <p className="text-white text-xs font-bold">Ganti Cover</p>
                            </div>
                    </div>
                    )}
                    <div className="border border-dashed border-white/20 rounded-lg p-3 text-center hover:border-brand-orange/50 transition-colors bg-brand-card/30">
                    <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files ? e.target.files[0] : null;
                        if (file) setForm((prev:any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
                    }} className="hidden" id="article-upload" />
                    <label htmlFor="article-upload" className="cursor-pointer flex flex-col items-center gap-2">
                        {!form.imagePreview && <UploadCloud size={20} className="text-gray-400" />}
                        <span className="text-gray-400 text-xs font-bold">{form.uploadFile ? form.uploadFile.name : (form.id ? "Klik ganti gambar" : "Upload Cover Artikel")}</span>
                    </label>
                    </div>
                </div>

                {/* Main Fields */}
                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Judul Artikel</label>
                    <Input value={form.title} onChange={e => setForm((prev:any) => ({...prev, title: e.target.value}))} placeholder="Judul menarik..." className="py-2 text-sm font-bold"/>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Kategori</label>
                        <Input value={form.category} onChange={e => setForm((prev:any) => ({...prev, category: e.target.value}))} placeholder="Misal: Tips Bisnis" className="py-2 text-xs"/>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Penulis</label>
                        <Input value={form.author} onChange={e => setForm((prev:any) => ({...prev, author: e.target.value}))} placeholder="Admin" className="py-2 text-xs"/>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Excerpt (Ringkasan)</label>
                    <TextArea value={form.excerpt} onChange={e => setForm((prev:any) => ({...prev, excerpt: e.target.value}))} placeholder="Ringkasan singkat..." className="h-20 text-xs leading-relaxed" />
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider mb-1 block">Konten (Markdown)</label>
                    <TextArea value={form.content} onChange={e => setForm((prev:any) => ({...prev, content: e.target.value}))} placeholder="# Heading 1..." className="h-64 text-sm font-mono leading-relaxed custom-scrollbar" />
                </div>

                {/* PUBLISHING OPTIONS */}
                <div className="bg-black/30 p-3 rounded-lg border border-white/10">
                     <label className="text-[10px] text-brand-orange uppercase font-bold tracking-wider mb-2 block flex items-center gap-1"><CheckCircle2 size={12}/> Status Publikasi</label>
                     <div className="grid grid-cols-3 gap-2 mb-3">
                         {['draft', 'published', 'scheduled'].map((s) => (
                             <button
                                key={s}
                                onClick={() => setForm((prev:any) => ({...prev, status: s}))}
                                className={`py-1.5 text-xs font-bold rounded capitalize border ${
                                    form.status === s 
                                    ? 'bg-brand-orange text-white border-brand-orange' 
                                    : 'bg-transparent text-gray-500 border-white/10 hover:text-white'
                                }`}
                             >
                                {s}
                             </button>
                         ))}
                     </div>
                     
                     {form.status === 'scheduled' && (
                         <div className="animate-fade-in">
                             <label className="text-[10px] text-gray-500 uppercase font-bold mb-1 block">Tanggal Publish</label>
                             <Input 
                                type="datetime-local" 
                                value={form.scheduled_for} 
                                onChange={e => setForm((prev:any) => ({...prev, scheduled_for: e.target.value}))} 
                                className="py-1 text-xs"
                             />
                         </div>
                     )}
                </div>
                
                <Button onClick={actions.handleSubmit} disabled={loading.uploading} className="w-full py-3 text-sm">
                    {loading.uploading ? <LoadingSpinner /> : <><Save size={16}/> {form.status === 'published' ? 'PUBLISH SEKARANG' : 'SIMPAN ARTIKEL'}</>}
                </Button>
            </div>
        )}
    </div>
);

const ArticleList = ({ 
    data, onEdit, onDelete 
}: { 
    data: any, onEdit: any, onDelete: any 
}) => (
    <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
            <div className="relative flex-grow">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input 
                    type="text" 
                    value={data.searchTerm}
                    onChange={(e) => data.setSearchTerm(e.target.value)}
                    placeholder="Cari artikel..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                />
             </div>
             <span className="text-[10px] font-bold text-gray-500 uppercase">Total: {data.paginated.length}</span>
        </div>
        
        <div className="flex-grow overflow-y-auto p-4 custom-scrollbar min-h-[400px]">
            {data.paginated.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">Belum ada artikel.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {data.paginated.map((item: Article) => (
                        <div key={item.id} className="relative bg-brand-card border border-white/5 rounded-lg p-3 flex gap-4 hover:border-brand-orange transition-all group">
                            <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                {item.status && (
                                    <div className={`absolute bottom-0 left-0 w-full py-0.5 text-[8px] font-bold text-center uppercase text-white ${
                                        item.status === 'published' ? 'bg-green-500/80' : 
                                        item.status === 'scheduled' ? 'bg-blue-500/80' : 'bg-gray-500/80'
                                    }`}>
                                        {item.status}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="px-1.5 py-0.5 rounded bg-brand-orange/10 text-brand-orange text-[9px] font-bold uppercase border border-brand-orange/20">{item.category}</span>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEdit(item)} className="text-blue-400 hover:text-white"><Edit size={14} /></button>
                                        <button onClick={() => onDelete(item.id)} className="text-red-400 hover:text-white"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <h5 className="text-sm font-bold text-white leading-tight line-clamp-2 mb-2">{item.title}</h5>
                                <div className="mt-auto flex items-center gap-3 text-[10px] text-gray-500">
                                    <span className="flex items-center gap-1"><Calendar size={10}/> {item.date}</span>
                                    <span className="flex items-center gap-1"><User size={10}/> {item.author}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {data.totalPages > 1 && (
            <div className="p-3 border-t border-white/10 bg-black/20 flex justify-center items-center gap-4">
                <button onClick={() => data.setPage((p:number) => Math.max(1, p - 1))} disabled={data.page === 1} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft size={16} /></button>
                <span className="text-xs font-bold text-brand-orange">{data.page} / {data.totalPages}</span>
                <button onClick={() => data.setPage((p:number) => Math.min(data.totalPages, p + 1))} disabled={data.page === data.totalPages} className="text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
        )}
    </div>
);

export const AdminArticles = ({ 
  articles, 
  setArticles 
}: { 
  articles: Article[], 
  setArticles: (a: Article[]) => void 
}) => {
  const { form, setForm, loading, aiState, actions, listData } = useArticleManager(articles, setArticles);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      <div className="lg:col-span-7">
        <ArticleList data={listData} onEdit={actions.handleEditClick} onDelete={actions.deleteItem} />
      </div>
      <div className="lg:col-span-5">
        <ArticleForm 
            form={form} 
            setForm={setForm} 
            loading={loading} 
            aiState={aiState}
            actions={actions}
        />
      </div>
    </div>
  );
};
