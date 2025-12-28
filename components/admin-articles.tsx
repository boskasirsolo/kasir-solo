
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Target, List, CheckCircle2, RefreshCw, Eye, Image as ImageIcon, Wand2, LayoutTemplate, TrendingUp, User, Calendar, Clock, Check } from 'lucide-react';
import { Article } from '../types';
import { Button, Input, TextArea, LoadingSpinner, Badge } from './ui';
import { supabase, CONFIG, ensureAPIKey, getEnv, getSmartApiKey } from '../utils';
import { GoogleGenAI } from "@google/genai";

const ITEMS_PER_PAGE = 10;

// --- CONSTANTS ---
const PRESET_TOPICS = [
    { id: 'fnb', label: 'Bisnis Kuliner (F&B)' },
    { id: 'retail', label: 'Retail & Minimarket' },
    { id: 'tech', label: 'Teknologi Kasir (POS)' },
    { id: 'finance', label: 'Keuangan & Pajak' },
    { id: 'marketing', label: 'Digital Marketing' },
    { id: 'hr', label: 'Manajemen Karyawan' },
    { id: 'franchise', label: 'Sistem Franchise' },
    { id: 'scam', label: 'Keamanan & Fraud' }
];

// --- INTERFACES FOR AI FLOW ---
interface KeywordData {
    keyword: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
    type: 'Trend' | 'Evergreen' | 'Niche';
}

interface GenConfig {
    autoImage: boolean;
    autoCategory: boolean;
    autoAuthor: boolean;
    imageStyle: 'cinematic' | 'cyberpunk' | 'corporate' | 'studio';
}

// --- HELPER: MARKDOWN RENDERER (SIMPLE) ---
const SimpleMarkdown = ({ content }: { content: string }) => {
    if (!content) return <div className="text-gray-600 italic">Preview konten akan muncul di sini...</div>;
    
    // Helper to parse bold text **text** -> <strong>text</strong>
    const renderInline = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="text-brand-orange font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className="prose prose-invert prose-sm max-w-none space-y-4">
            {content.split('\n').map((line, i) => {
                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-4 border-b border-brand-orange/30 pb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-brand-orange mt-8 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-gray-200 mt-6 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-300 pl-2">{renderInline(line.replace('- ', ''))}</li>;
                if (line.startsWith('1. ')) return <li key={i} className="ml-4 list-decimal text-gray-300 pl-2">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-brand-orange pl-4 italic text-gray-400 my-4 bg-white/5 py-2 pr-2 rounded-r">{renderInline(line.replace('> ', ''))}</blockquote>;
                if (line === '') return <div key={i} className="h-2"></div>;
                return <p key={i} className="text-gray-300 leading-relaxed text-justify">{renderInline(line)}</p>;
            })}
        </div>
    );
};

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
        readTime: '25 min read', 
        imagePreview: '',
        uploadFile: null as File | null,
        status: 'draft' as 'published' | 'draft' | 'scheduled',
        scheduled_for: ''
    });

    // AI Flow State
    const [aiStep, setAiStep] = useState<number>(0); 
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);
    const [titleOptions, setTitleOptions] = useState<string[]>([]);
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true,
        autoCategory: true,
        autoAuthor: true,
        imageStyle: 'cinematic'
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
            readTime: '25 min read',
            imagePreview: '',
            uploadFile: null,
            status: 'draft',
            scheduled_for: ''
        });
        setAiStep(0);
        setKeywords([]);
        setTitleOptions([]);
        setSelectedKeyword(null);
        setSelectedPresets([]);
    };

    const togglePreset = (label: string) => {
        setSelectedPresets(prev => 
            prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]
        );
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
        // No scroll needed in split view
        setAiStep(3); 
    };

    // --- UTILS: IMAGE GENERATOR (FIXED) ---
    const getAIImageUrl = (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 999999);
        
        // Sanitize and Shorten Prompt
        const safePrompt = prompt
            .replace(/[^a-zA-Z0-9\s]/g, '')
            .split(' ')
            .slice(0, 12)
            .join(' ');

        let styleKeywords = "";
        switch(style) {
            case 'cinematic': styleKeywords = "cinematic lighting dramatic 8k highly detailed"; break;
            case 'cyberpunk': styleKeywords = "cyberpunk neon futuristic purple orange tech"; break;
            case 'corporate': styleKeywords = "modern office professional bright clean corporate"; break;
            case 'studio': styleKeywords = "studio lighting product photography solid background minimal"; break;
            default: styleKeywords = "high quality professional";
        }

        const finalPrompt = `${safePrompt} ${styleKeywords}`;
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=576&model=flux&nologo=true&seed=${seed}`;
    };

    const regenerateCoverImage = () => {
        if (!form.title) return alert("Judul artikel kosong.");
        const prompt = `${form.title}`;
        setForm(prev => ({
            ...prev,
            imagePreview: getAIImageUrl(prompt, genConfig.imageStyle)
        }));
    };

    // --- AI: STEP 1 - KEYWORD RESEARCH ---
    const researchKeywords = async () => {
        setLoading(prev => ({ ...prev, researching: true }));
        try {
            await ensureAPIKey();
            const apiKey = getSmartApiKey();
            if (!apiKey) throw new Error("API Key habis atau tidak ditemukan.");

            const ai = new GoogleGenAI({ apiKey });
            
            // Context from presets
            const contextTopics = selectedPresets.length > 0 
                ? selectedPresets.join(', ') 
                : "Bisnis UMKM, Mesin Kasir, dan Manajemen Toko";

            const prompt = `
            Act as an Expert Business Consultant & SEO Strategist for Indonesia Market.
            
            FOCUS TOPICS: ${contextTopics}
            
            Task: Generate 8 potential article topics/keywords.
            Mix between:
            1. Trending Issues (Viral now)
            2. Evergreen Content (Always needed)
            3. Niche/Specific Problems (High intent)
            
            RETURN JSON ARRAY ONLY:
            [
              { "keyword": "Topik spesifik...", "volume": "High/Med", "competition": "Low/Med", "type": "Trend" }
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
            const apiKey = getSmartApiKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const prompt = `
            Based on keyword: "${keywordData.keyword}"
            Target Audience: Business Owners (UMKM) in Indonesia.
            
            Generate 5 High-CTR Article Titles with distinct angles:
            1. "The Guide" (Panduan Lengkap...)
            2. "The Mistake/Warning" (Jangan Lakukan ini...)
            3. "The Listicle" (7 Cara/Alat Terbaik...)
            4. "The Case Study" (Bagaimana Toko X naik omzet...)
            5. "The Question" (Kenapa bisnis anda...)

            RETURN JSON ARRAY OF STRINGS ONLY:
            ["Title 1...", "Title 2...", "Title 3...", "Title 4...", "Title 5..."]
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

    // --- AI: STEP 3 - PILLAR CONTENT GENERATION (SPLIT STRATEGY) ---
    const generatePillarContent = async () => {
        if (!form.title) return alert("Pilih judul terlebih dahulu.");
        
        setLoading(prev => ({ ...prev, generatingContent: true }));
        try {
            await ensureAPIKey();
            const apiKey = getSmartApiKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            // --- 1. METADATA GENERATION ---
            const metaPrompt = `
            Role: Editor.
            Task: Generate metadata for article: "${form.title}".
            Context: ${selectedKeyword?.keyword || ''}.
            Language: Indonesian.
            Output JSON: { "excerpt": "Compelling summary (150 chars)", "category": "Based on title", "author": "Amin Maghfuri", "image_search_query": "English visual description for cover image, detailed, relevant" }
            `;
            
            const metaResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview', 
                contents: metaPrompt,
                config: { responseMimeType: "application/json" }
            });
            
            let metaData = { excerpt: "", category: "Business", author: "Admin", image_search_query: "business technology" };
            try { 
                const metaText = metaResponse.text?.replace(/```json|```/g, '').trim() || '{}';
                metaData = JSON.parse(metaText); 
            } catch(e) { console.warn("Meta parse failed, using defaults"); }

            // --- 2. CONTENT GENERATION ---
            const contentPrompt = `
            Role: Expert Business Consultant & Senior Copywriter (Amin Maghfuri).
            Task: Write a COMPREHENSIVE ARTICLE (Deep Dive).
            Title: "${form.title}"
            Keyword: "${selectedKeyword?.keyword || form.title}"
            
            INSTRUCTIONS:
            1. **Tone**: Authoritative, Empathetic, Actionable (Indonesian Business Context).
            2. **Structure**: 
               - Start directly with "# ${form.title}"
               - Introduction (Hook the reader immediately)
               - Core Concepts (Explain 'Why' & 'What')
               - Practical Steps (The 'How To' - use bullet points)
               - Real World Examples (Hypothetical or generic case studies)
               - Conclusion (Call to Action)
            3. **Formatting**: Use proper Markdown (H2, H3, Bold, Lists).
            4. **Length**: Substantial depth, but no fluff.
            `;

            const contentResponse = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: contentPrompt,
                config: { maxOutputTokens: 8192 }
            });
            
            const contentText = contentResponse.text || '# Gagal Generate Konten. Silakan coba lagi.';

            // --- COMBINE RESULTS ---
            setForm(prev => ({
                ...prev,
                content: contentText,
                excerpt: metaData.excerpt || prev.excerpt,
                category: genConfig.autoCategory ? metaData.category : prev.category,
                author: genConfig.autoAuthor ? metaData.author : prev.author,
                readTime: "10 min read",
                imagePreview: genConfig.autoImage 
                    ? getAIImageUrl(metaData.image_search_query || `${form.title}`, genConfig.imageStyle) 
                    : prev.imagePreview,
                status: 'draft' 
            }));

            setAiStep(3); // Done
        } catch (e: any) {
            console.error(e);
            let msg = e.message || "Unknown error";
            if (msg.includes("429") || msg.includes("Quota")) {
                msg = "Kuota Harian AI Habis (Limit 429). Sistem mencoba switch API Key, silakan coba klik lagi.";
            } else if (msg.includes("API key")) {
                msg = "API Key tidak valid atau belum diset.";
            }
            alert(`Gagal generate konten: ${msg}`);
        } finally {
            setLoading(prev => ({ ...prev, generatingContent: false }));
        }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        
        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200';

            if (form.uploadFile) {
                if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Konfigurasi Cloudinary belum diset.");
                
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
                else throw new Error("Gagal upload gambar.");
            }

            const dbData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                read_time: form.readTime,
                image_url: finalImageUrl,
                status: form.status,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null
            };

            const localUpdateData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                readTime: form.readTime,
                image: finalImageUrl,
                status: form.status,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : undefined,
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
            };

            if (form.id) {
                const existing = articles.find(a => a.id === form.id);
                if (existing) {
                    const updatedItem: Article = { ...existing, ...localUpdateData, id: form.id };
                    setArticles(articles.map(a => a.id === form.id ? updatedItem : a));
                }
                if (supabase) {
                    const { error } = await supabase.from('articles').update(dbData).eq('id', form.id);
                    if (error) throw error;
                }
            } else {
                const newId = Date.now();
                const newItem: Article = { ...localUpdateData, id: newId, tags: [] };
                setArticles([newItem, ...articles]);
                if (supabase) {
                     const { error } = await supabase.from('articles').insert([dbData]);
                    if (error) throw error;
                }
            }
            resetForm();
            alert(`Artikel berhasil disimpan sebagai ${form.status.toUpperCase()}!`);
        } catch (e: any) { 
            console.error(e); 
            let msg = e.message || JSON.stringify(e);
            alert(`Gagal menyimpan:\n${msg}`); 
        } finally { 
            setLoading(prev => ({ ...prev, uploading: false })); 
        }
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
        aiState: { step: aiStep, setStep: setAiStep, keywords, selectedKeyword, titleOptions, genConfig, setGenConfig, selectedPresets, togglePreset },
        actions: { researchKeywords, generateTitles, generatePillarContent, handleSubmit, handleEditClick, resetForm, deleteItem, regenerateCoverImage },
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm }
    };
};

export const AdminArticles = ({ 
  articles, 
  setArticles 
}: { 
  articles: Article[], 
  setArticles: (a: Article[]) => void 
}) => {
  const { form, setForm, loading, aiState, actions, listData } = useArticleManager(articles, setArticles);

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b">
      
      {/* 1. LEFT COLUMN: LIST (20%) */}
      <div className="w-[20%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[250px]">
         <div className="p-4 border-b border-white/5">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <List size={12}/> Arsip Artikel
            </h4>
            <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
                <input 
                    type="text" 
                    value={listData.searchTerm}
                    onChange={(e) => listData.setSearchTerm(e.target.value)}
                    placeholder="Cari..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-brand-orange"
                />
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
            <button 
                onClick={actions.resetForm}
                className="w-full py-2 border border-dashed border-white/10 rounded text-gray-400 text-[10px] font-bold hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all flex items-center justify-center gap-1"
            >
                <Plus size={12} /> ARTIKEL BARU
            </button>

            {listData.paginated.map((item: Article) => (
                <div 
                    key={item.id}
                    onClick={() => actions.handleEditClick(item)}
                    className={`p-2 rounded border cursor-pointer transition-all group relative ${
                        form.id === item.id 
                        ? 'bg-brand-orange/10 border-brand-orange' 
                        : 'bg-transparent border-white/5 hover:bg-white/5'
                    }`}
                >
                    <div className="flex gap-2">
                        <img src={item.image} className="w-8 h-8 rounded object-cover bg-black" />
                        <div className="min-w-0 flex-1">
                            <h5 className="text-[10px] font-bold text-white truncate leading-tight mb-0.5">{item.title}</h5>
                            <span className={`text-[8px] px-1 rounded ${
                                item.status === 'published' ? 'text-green-400 bg-green-900/30' : 'text-yellow-400 bg-yellow-900/30'
                            }`}>{item.status || 'draft'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); actions.deleteItem(item.id); }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500"
                    >
                        <Trash2 size={12} />
                    </button>
                </div>
            ))}
         </div>
      </div>

      {/* 2. CENTER COLUMN: EDITOR / AI STUDIO (30%) */}
      <div className="w-[30%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[350px]">
         <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={14} className="text-brand-orange"/> : <Sparkles size={14} className="text-brand-orange"/>}
                {form.id ? "Editor" : "AI Studio"}
            </h3>
            {form.id || aiState.step > 0 ? (
                <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1">
                    <RefreshCw size={10} /> Reset
                </button>
            ) : null}
         </div>

         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {/* AI WIZARD */}
            {!form.id && aiState.step < 3 && (
                <div className="space-y-6">
                    {/* STEP 0: PRESET CATEGORIES (NEW) */}
                    <div className={`transition-all ${aiState.step > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-3">Step 1: Pilih Fokus Topik (Bisa &gt; 1)</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {PRESET_TOPICS.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => aiState.togglePreset(topic.label)}
                                    className={`text-[10px] py-2 px-2 rounded border transition-all flex items-center justify-between ${
                                        aiState.selectedPresets.includes(topic.label)
                                        ? 'bg-brand-orange text-white border-brand-orange'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                    }`}
                                >
                                    {topic.label}
                                    {aiState.selectedPresets.includes(topic.label) && <Check size={12} />}
                                </button>
                            ))}
                        </div>
                        <Button 
                            onClick={actions.researchKeywords} 
                            disabled={loading.researching} 
                            className={`w-full py-3 text-xs ${aiState.selectedPresets.length === 0 ? 'opacity-50' : ''}`}
                        >
                            {loading.researching ? <LoadingSpinner size={14} /> : <><TrendingUp size={14}/> GENERATE IDE TOPIK</>}
                        </Button>
                    </div>

                    {/* STEP 1: KEYWORDS */}
                    {aiState.step >= 1 && (
                        <div className={`transition-all ${aiState.step > 1 ? 'opacity-50 pointer-events-none' : 'animate-fade-in'}`}>
                            <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2">Step 2: Pilih Keyword</label>
                            <div className="grid grid-cols-1 gap-1.5">
                                {aiState.keywords.map((k: KeywordData, i: number) => (
                                    <button key={i} onClick={() => actions.generateTitles(k)} className="text-left p-2.5 rounded border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 transition-all flex justify-between items-center group">
                                        <div>
                                            <span className="font-bold text-xs text-gray-200 group-hover:text-white block">{k.keyword}</span>
                                            <span className="text-[9px] text-gray-500 uppercase tracking-wide">{k.type} • Vol: {k.volume}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-orange"/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TITLES */}
                    {aiState.step >= 1 && aiState.titleOptions.length > 0 && (
                        <div className={`transition-all ${aiState.step > 2 ? 'opacity-50' : 'animate-fade-in'}`}>
                            <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2">Step 3: Pilih Judul</label>
                            {loading.titling ? <LoadingSpinner /> : (
                                <div className="space-y-1.5">
                                    {aiState.titleOptions.map((t: string, i: number) => (
                                        <button key={i} onClick={() => { setForm((p:any) => ({...p, title: t})); aiState.setStep(2); }} className={`w-full text-left p-2 text-xs border rounded transition-all leading-relaxed ${form.title === t ? 'bg-brand-orange text-white border-brand-orange' : 'bg-black/20 border-white/10 hover:border-white/30 text-gray-300'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: CONFIG */}
                    {aiState.step >= 2 && form.title && (
                        <div className="animate-fade-in border-t border-white/5 pt-4">
                            <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2">Step 4: Generate Content</label>
                            
                            <div className="mb-3">
                                <label className="text-[10px] text-gray-500 mb-1 block">Image Style</label>
                                <div className="grid grid-cols-2 gap-1">
                                    {(['cinematic', 'cyberpunk', 'corporate', 'studio'] as const).map((style) => (
                                        <button 
                                            key={style}
                                            onClick={() => aiState.setGenConfig({...aiState.genConfig, imageStyle: style})}
                                            className={`py-1 text-[9px] uppercase border rounded ${aiState.genConfig.imageStyle === style ? 'bg-brand-orange text-white border-brand-orange' : 'bg-transparent text-gray-500 border-white/10'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Button onClick={actions.generatePillarContent} disabled={loading.generatingContent} className="w-full py-3 text-xs bg-gradient-to-r from-brand-orange to-red-500 hover:from-brand-glow hover:to-red-400 shadow-action">
                                {loading.generatingContent ? <LoadingSpinner size={14} /> : <><Sparkles size={14}/> GENERATE FULL ARTICLE</>}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* MANUAL EDITOR */}
            {(form.id || aiState.step === 3) && (
                <div className="space-y-4 animate-fade-in pb-10">
                    
                    {/* Image */}
                    <div className="relative w-full h-32 bg-black rounded-lg border border-white/10 overflow-hidden group">
                        {form.imagePreview ? (
                            <img src={form.imagePreview} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={24}/></div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button onClick={actions.regenerateCoverImage} className="px-2 py-1 bg-brand-orange text-white text-[10px] rounded flex items-center gap-1 shadow-lg hover:bg-brand-glow">
                                <Wand2 size={10} /> Re-Imagine
                            </button>
                            <label className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded cursor-pointer border border-white/20">
                                Upload
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    if(file) setForm((p:any) => ({...p, uploadFile: file, imagePreview: URL.createObjectURL(file)}));
                                }} />
                            </label>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel" className="text-xs font-bold py-2"/>
                        <div className="grid grid-cols-2 gap-2">
                            <Input value={form.category} onChange={e => setForm((p:any) => ({...p, category: e.target.value}))} placeholder="Kategori" className="text-[10px] py-1.5"/>
                            <Input value={form.author} onChange={e => setForm((p:any) => ({...p, author: e.target.value}))} placeholder="Penulis" className="text-[10px] py-1.5"/>
                        </div>
                        <TextArea value={form.excerpt} onChange={e => setForm((p:any) => ({...p, excerpt: e.target.value}))} placeholder="Ringkasan..." className="text-[10px] h-16"/>
                        <TextArea value={form.content} onChange={e => setForm((p:any) => ({...p, content: e.target.value}))} placeholder="# Konten Markdown..." className="text-[10px] h-96 font-mono custom-scrollbar"/>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 sticky bottom-0 bg-brand-dark pb-2">
                        <select 
                            value={form.status} 
                            onChange={(e) => setForm((p:any) => ({...p, status: e.target.value}))}
                            className="bg-black/20 text-white text-[10px] rounded border border-white/10 px-2 outline-none focus:border-brand-orange"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                        <Button onClick={actions.handleSubmit} disabled={loading.uploading} className="py-2 text-[10px]">
                            {loading.uploading ? <LoadingSpinner size={12}/> : <><Save size={12}/> SIMPAN</>}
                        </Button>
                    </div>
                </div>
            )}
         </div>
      </div>

      {/* 3. RIGHT COLUMN: LIVE PREVIEW (50%) */}
      <div className="w-[50%] bg-black flex flex-col relative overflow-hidden">
         <div className="p-4 border-b border-white/10 bg-brand-dark/50 flex justify-between items-center backdrop-blur-sm z-10 sticky top-0">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Eye size={12} /> Live Preview (Desktop)
            </h4>
            <div className="flex gap-2">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{form.content.split(' ').length} Kata</Badge>
            </div>
         </div>

         <div className="flex-grow overflow-y-auto custom-scrollbar p-8 relative">
            {/* Background Grain */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none fixed"></div>
            
            <div className="max-w-3xl mx-auto relative z-10">
                {/* Header Preview */}
                <div className="mb-8">
                    {form.category && <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-2 block">{form.category}</span>}
                    <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">{form.title || "Judul Artikel..."}</h1>
                    <div className="flex items-center gap-3 text-gray-500 text-xs mb-6 border-b border-white/10 pb-6">
                        <span className="flex items-center gap-1"><User size={12}/> {form.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {form.readTime}</span>
                    </div>
                    {form.imagePreview && (
                        <div className="w-full h-64 rounded-xl overflow-hidden mb-8 shadow-2xl border border-white/10">
                            <img src={form.imagePreview} className="w-full h-full object-cover" alt="Cover" />
                        </div>
                    )}
                    {form.excerpt && (
                        <p className="text-lg text-gray-300 italic border-l-4 border-brand-orange pl-4 py-1 mb-8">{form.excerpt}</p>
                    )}
                </div>

                {/* Content Preview */}
                <SimpleMarkdown content={form.content} />
            </div>
         </div>
      </div>

    </div>
  );
};
