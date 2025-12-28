
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Target, List, CheckCircle2, RefreshCw, Eye, Image as ImageIcon, Wand2, LayoutTemplate, TrendingUp, User, Calendar, Clock, Check, Loader2, FileText, Palette, Link as LinkIcon, Crown, Network, CalendarClock, Zap } from 'lucide-react';
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

// --- INTERFACES ---
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
    imageStyle: 'cinematic' | 'cyberpunk' | 'corporate' | 'studio' | 'minimalist';
}

// --- HELPER: MARKDOWN RENDERER ---
const SimpleMarkdown = ({ content }: { content: string }) => {
    if (!content) return <div className="text-gray-600 italic">Preview konten akan muncul di sini...</div>;
    
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

// --- COMPONENT: PROGRESS BAR ---
const GenerationProgress = ({ percent, message, color = 'orange' }: { percent: number, message: string, color?: 'orange' | 'blue' | 'green' }) => (
    <div className={`w-full bg-brand-dark border rounded-lg p-3 relative overflow-hidden animate-fade-in ${color === 'orange' ? 'border-brand-orange/30' : color === 'blue' ? 'border-blue-500/30' : 'border-green-500/30'}`}>
        <div className="flex justify-between items-center mb-2 relative z-10">
            <span className={`text-xs font-bold animate-pulse ${color === 'orange' ? 'text-brand-orange' : color === 'blue' ? 'text-blue-400' : 'text-green-400'}`}>{message}</span>
            <span className="text-xs font-mono text-gray-400">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 relative z-10">
            <div 
                className={`h-full transition-all duration-500 ease-out ${color === 'orange' ? 'bg-gradient-to-r from-brand-orange to-brand-action' : color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`}
                style={{ width: `${percent}%` }}
            ></div>
        </div>
        <div className={`absolute inset-0 z-0 opacity-10 ${color === 'orange' ? 'bg-brand-orange' : color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
    </div>
);

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
        scheduled_for: '',
        // STRATEGY FIELDS
        type: 'cluster' as 'pillar' | 'cluster',
        pillar_id: 0 as number,
        cluster_ideas: [] as string[]
    });

    // AI Flow State
    const [aiStep, setAiStep] = useState<number>(0); 
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true,
        autoCategory: true,
        autoAuthor: true,
        imageStyle: 'cinematic'
    });

    // Loading & Progress States (Split)
    const [loading, setLoading] = useState({
        uploading: false,
        researching: false,
        generatingText: false,
        generatingImage: false,
        generatingClusters: false,
        scheduling: false
    });
    
    const [textProgress, setTextProgress] = useState({ percent: 0, message: '' });
    const [imageProgress, setImageProgress] = useState({ percent: 0, message: '' });

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Available Pillars for Dropdown
    const availablePillars = articles.filter(a => a.type === 'pillar');

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
            scheduled_for: '',
            type: 'cluster',
            pillar_id: 0,
            cluster_ideas: []
        });
        setAiStep(0);
        setKeywords([]);
        setSelectedKeyword(null);
        setSelectedPresets([]);
        setTextProgress({ percent: 0, message: '' });
        setImageProgress({ percent: 0, message: '' });
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
            scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster',
            pillar_id: item.pillar_id || 0,
            cluster_ideas: item.cluster_ideas || []
        });
        setAiStep(3); 
    };

    // --- UTILS: IMAGE GENERATOR ---
    const getAIImageUrl = (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 999999);
        const safePrompt = prompt.replace(/[^a-zA-Z0-9\s,]/g, '').trim();
        let styleKeywords = "";
        switch(style) {
            case 'cinematic': styleKeywords = "cinematic lighting, dramatic, 8k, highly detailed, photorealistic, movie scene"; break;
            case 'cyberpunk': styleKeywords = "cyberpunk city, neon lights, futuristic, purple and orange, high tech, blade runner style"; break;
            case 'corporate': styleKeywords = "modern office, professional, bright, clean, corporate photography, success, business meeting"; break;
            case 'studio': styleKeywords = "studio lighting, product photography, solid background, minimal, sharp focus, 4k"; break;
            case 'minimalist': styleKeywords = "minimalist, flat design, vector art, simple shapes, pastel colors, clean lines"; break;
            default: styleKeywords = "high quality, professional, award winning";
        }
        const finalPrompt = `${safePrompt}, ${styleKeywords}`;
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=576&model=flux&nologo=true&seed=${seed}`;
    };

    // --- ACTION: GENERATE TEXT WITH STRATEGY CONTEXT ---
    const generateTextContent = async () => {
        if (!form.title) return alert("Pilih judul terlebih dahulu.");
        
        setLoading(prev => ({ ...prev, generatingText: true }));
        setTextProgress({ percent: 5, message: 'Menyiapkan strategi konten...' });

        try {
            await ensureAPIKey();
            const apiKey = getSmartApiKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            // 1. Build Context Prompt based on Strategy
            let strategyContext = "";
            let lengthReq = "Minimum 1000 words";
            let clusterInstruction = "";
            
            if (form.type === 'pillar') {
                strategyContext = `
                STRATEGY: This is a **PILLAR PAGE** (Cornerstone Content). 
                - It must be extremely comprehensive, covering "What", "Why", and "How" extensively.
                - It serves as the ultimate guide for this topic.
                `;
                lengthReq = "Minimum 2000-3000 words";
                // Instruction to generate clusters IN THE SAME CALL to save time/tokens context
                clusterInstruction = `
                BONUS TASK: At the very end of your response, after the conclusion, please provide a JSON block (and ONLY the JSON block) containing 10 specific, high-potential 'Cluster Article Titles' that should link back to this Pillar Page. 
                Format: ---CLUSTER_JSON_START--- ["Title 1", "Title 2", ...] ---CLUSTER_JSON_END---
                `;
            } else {
                const parentPillar = availablePillars.find(p => p.id === form.pillar_id);
                const pillarTitle = parentPillar ? parentPillar.title : "Panduan Lengkap Bisnis";
                strategyContext = `
                STRATEGY: This is a **CLUSTER CONTENT** (Supporting Article).
                - Focus deeply on the specific sub-topic.
                - **MANDATORY**: Include a natural link/reference to the Pillar Page: "${pillarTitle}".
                `;
                lengthReq = "Minimum 800-1200 words";
            }

            setTextProgress({ percent: 20, message: `Menulis Artikel ${form.type === 'pillar' ? 'Pilar (3000+ Kata)' : 'Cluster'}...` });
            
            const contentPrompt = `
            Role: Senior SEO Content Strategist (Indonesian Market).
            Task: Write a Deep-Dive Article based on title: "${form.title}"
            
            ${strategyContext}
            
            STRUCTURE:
            1. **Headline**: # ${form.title}
            2. **Introduction**: Hook & Context.
            3. **Deep Dive**: 5-7 H2 Subheadings with detailed paragraphs.
            4. **FAQ**: 3-5 Q&A.
            5. **Conclusion**: Summary & CTA.
            
            REQUIREMENTS:
            - **LENGTH**: ${lengthReq}.
            - **FORMAT**: Clean Markdown.
            
            ${clusterInstruction}
            `;

            const contentResponse = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: contentPrompt,
                config: { maxOutputTokens: 8192 } 
            });
            
            let generatedContent = contentResponse.text || '# Error generating text.';
            let extractedClusters: string[] = [];

            // 2. Extract Clusters if Pillar
            if (form.type === 'pillar') {
                const jsonStart = generatedContent.indexOf('---CLUSTER_JSON_START---');
                const jsonEnd = generatedContent.indexOf('---CLUSTER_JSON_END---');
                
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonStr = generatedContent.substring(jsonStart + 24, jsonEnd);
                    try {
                        extractedClusters = JSON.parse(jsonStr);
                    } catch (e) { console.error("Failed to parse clusters", e); }
                    
                    // Remove JSON from content display
                    generatedContent = generatedContent.substring(0, jsonStart).trim();
                }
            }
            
            console.log(`Generated Length: ${generatedContent.length} chars`);

            // 3. Generate Metadata
            setTextProgress({ percent: 80, message: 'Menganalisa metadata...' });
            const contextForMeta = generatedContent.substring(0, 3000); 
            
            const metaPrompt = `
            Based on this text: "${contextForMeta}..."
            Generate JSON: { 
                "excerpt": "Compelling 2-sentence summary (max 160 chars)", 
                "category": "One specific business category", 
                "readTime": "Estimate read time (e.g. '15 min read')"
            }
            `;
            
            const metaResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: metaPrompt,
                config: { responseMimeType: "application/json" }
            });
            
            let metaData = { excerpt: "", category: "Business", readTime: "5 min read" };
            try { metaData = JSON.parse(metaResponse.text || '{}'); } catch(e) {}

            setTextProgress({ percent: 100, message: 'Selesai!' });
            await new Promise(r => setTimeout(r, 500));

            setForm(prev => ({
                ...prev,
                content: generatedContent,
                excerpt: metaData.excerpt || prev.excerpt,
                category: genConfig.autoCategory ? metaData.category : prev.category,
                author: "Tim Ahli MKS", 
                readTime: metaData.readTime || "10 min read",
                cluster_ideas: extractedClusters
            }));

        } catch (e: any) {
            alert("Gagal generate teks: " + e.message);
            setTextProgress({ percent: 0, message: 'Error' });
        } finally {
            setLoading(prev => ({ ...prev, generatingText: false }));
        }
    };

    // --- ACTION: AUTO-SCHEDULE CLUSTERS ---
    const scheduleClusters = async () => {
        if (!form.cluster_ideas || form.cluster_ideas.length === 0) return alert("Tidak ada ide cluster untuk dijadwalkan.");
        
        setLoading(prev => ({ ...prev, scheduling: true }));
        try {
            const newArticles: Article[] = [];
            const now = new Date();
            
            // Logic: 2 articles per day (9am and 4pm)
            // Start scheduling from TOMORROW
            let scheduleDate = new Date(now);
            scheduleDate.setDate(scheduleDate.getDate() + 1); 
            
            form.cluster_ideas.forEach((title, index) => {
                const isMorning = index % 2 === 0;
                
                // Set time
                scheduleDate.setHours(isMorning ? 9 : 16, 0, 0, 0);
                
                const scheduledTimeStr = scheduleDate.toLocaleString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                // Create Draft Article Object
                const newArticle: Article = {
                    id: Date.now() + index, // Unique ID
                    title: title,
                    excerpt: `Artikel pendukung untuk pilar: ${form.title}. (Auto-generated draft).`,
                    content: `<!-- AUTO-GENERATED PLACEHOLDER -->\n# ${title}\n\n*Artikel ini dijadwalkan otomatis oleh SIBOS AI. Silakan generate konten lengkapnya nanti.*\n\n> Menginduk ke Pillar: ${form.title}`,
                    date: scheduleDate.toLocaleDateString('id-ID'),
                    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800', // Placeholder
                    category: form.category || 'Bisnis',
                    author: 'SIBOS Bot',
                    readTime: '5 min read',
                    status: 'scheduled',
                    scheduled_for: scheduledTimeStr,
                    type: 'cluster',
                    pillar_id: form.id || 0 // Use current Pillar ID (assuming it's saved/will be saved)
                };

                newArticles.push(newArticle);

                // Increment day every 2 articles
                if (!isMorning) {
                    scheduleDate.setDate(scheduleDate.getDate() + 1);
                }
            });

            // Update State & DB
            setArticles([...newArticles, ...articles]);
            
            if (supabase) {
                // Bulk insert to Supabase
                const dbInserts = newArticles.map(a => ({
                    title: a.title,
                    excerpt: a.excerpt,
                    content: a.content,
                    category: a.category,
                    author: a.author,
                    read_time: a.readTime,
                    image_url: a.image,
                    status: a.status,
                    scheduled_for: a.scheduled_for,
                    type: a.type,
                    pillar_id: a.pillar_id
                }));
                await supabase.from('articles').insert(dbInserts);
            }

            alert(`Berhasil menjadwalkan ${newArticles.length} artikel cluster!\nCek di daftar artikel dengan status 'Scheduled'.`);
            
            // Clear ideas after scheduling to prevent dupes
            setForm(prev => ({...prev, cluster_ideas: []}));

        } catch (e: any) {
            alert("Gagal menjadwalkan: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, scheduling: false }));
        }
    };

    // --- ACTION: GENERATE IMAGE ONLY (CONTEXT AWARE) ---
    const generateImageContent = async () => {
        if (!form.content && !form.title) return alert("Konten artikel belum ada.");

        setLoading(prev => ({ ...prev, generatingImage: true }));
        setImageProgress({ percent: 20, message: 'Menganalisa konteks artikel...' });

        try {
            await ensureAPIKey();
            const apiKey = getSmartApiKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const analysisPrompt = `
            Context: "${form.content.substring(0, 800)}..."
            Task: Create a highly detailed English image prompt for a cover image.
            Focus: Professional, Business, Technology.
            Output: JUST THE PROMPT TEXT.
            `;

            const promptResponse = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: analysisPrompt });
            const visualPrompt = promptResponse.text || form.title;

            setImageProgress({ percent: 60, message: 'Rendering visual...' });
            const imageUrl = getAIImageUrl(visualPrompt, genConfig.imageStyle);

            await new Promise(r => setTimeout(r, 800)); 
            setImageProgress({ percent: 100, message: 'Gambar siap!' });
            await new Promise(r => setTimeout(r, 300));

            setForm(prev => ({ ...prev, imagePreview: imageUrl }));

        } catch (e: any) {
            alert("Gagal generate gambar: " + e.message);
            setImageProgress({ percent: 0, message: 'Error' });
        } finally {
            setLoading(prev => ({ ...prev, generatingImage: false }));
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
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type,
                pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas
            };

            const localUpdateData = {
                ...dbData,
                image: finalImageUrl,
                readTime: form.readTime,
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            if (form.id) {
                const existing = articles.find(a => a.id === form.id);
                if (existing) {
                    setArticles(articles.map(a => a.id === form.id ? { ...existing, ...localUpdateData, id: form.id } : a));
                }
                if (supabase) await supabase.from('articles').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setArticles([{ ...localUpdateData, id: newId, tags: [] }, ...articles]);
                // Return ID for immediate scheduling reference
                if (supabase) {
                    const { data } = await supabase.from('articles').insert([dbData]).select();
                    if(data && data[0]) setForm(p => ({...p, id: data[0].id}));
                } else {
                    setForm(p => ({...p, id: newId}));
                }
            }
            alert(`Artikel berhasil disimpan!`);
        } catch (e: any) { 
            console.error(e); 
            alert(`Gagal menyimpan: ${e.message}`); 
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

    // --- ACTION: RESEARCH KEYWORDS ---
    const researchKeywords = async () => {
        if (selectedPresets.length === 0) return alert("Pilih minimal satu topik.");
        
        setLoading(prev => ({ ...prev, researching: true }));
        try {
            await ensureAPIKey();
            const apiKey = getSmartApiKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const prompt = `
            Role: SEO Content Strategist (Indonesian Market).
            Context: We sell POS Systems (Kasir) & Software.
            Task: Generate 5 high-potential article titles/keywords based on topics: ${selectedPresets.join(', ')}.
            Target Audience: UMKM Owners, Business Starters.
            Format: JSON Array of objects: [{ "keyword": "Title Idea", "volume": "Search Volume (e.g. 10k/mo)", "competition": "Low/Medium/High", "type": "Trend/Evergreen" }]
            STRICT: Return ONLY JSON.
            `;

            const response = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const text = response.text || '[]';
            let data: KeywordData[] = [];
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON", text);
                data = [
                    { keyword: `Strategi ${selectedPresets[0]} untuk Pemula`, volume: "Unknown", competition: "Low", type: "Evergreen" }
                ];
            }
            
            setKeywords(data);
            setAiStep(1); 
        } catch (e: any) {
            alert("Gagal research keyword: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, researching: false }));
        }
    };

    const selectTopic = (k: KeywordData) => {
        setSelectedKeyword(k);
        setForm(prev => ({ ...prev, title: k.keyword }));
        setAiStep(2); 
    };

    const filtered = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    return {
        form, setForm,
        loading,
        progress: { text: textProgress, image: imageProgress },
        aiState: { step: aiStep, setStep: setAiStep, keywords, selectedKeyword, genConfig, setGenConfig, selectedPresets, togglePreset },
        actions: { researchKeywords, selectTopic, generateTextContent, generateImageContent, handleSubmit, handleEditClick, resetForm, deleteItem, scheduleClusters },
        listData: { paginated, totalPages, page, setPage, searchTerm, setSearchTerm },
        availablePillars
    };
};

export const AdminArticles = ({ 
  articles, 
  setArticles 
}: { 
  articles: Article[], 
  setArticles: (a: Article[]) => void 
}) => {
  const { form, setForm, loading, progress, aiState, actions, listData, availablePillars } = useArticleManager(articles, setArticles);

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b">
      
      {/* 1. LEFT COLUMN: LIST */}
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

            {listData.paginated.map((item: Article) => {
                const isPillar = item.type === 'pillar';
                // Find parent pillar title if connected
                const parent = item.pillar_id ? articles.find(a => a.id === item.pillar_id) : null;

                return (
                    <div 
                        key={item.id}
                        onClick={() => actions.handleEditClick(item)}
                        className={`p-2 rounded border cursor-pointer transition-all group relative ${
                            form.id === item.id 
                            ? 'bg-brand-orange/10 border-brand-orange' 
                            : 'bg-transparent border-white/5 hover:bg-white/5'
                        }`}
                    >
                        <div className="flex gap-2 mb-1">
                            <img src={item.image} className="w-8 h-8 rounded object-cover bg-black" />
                            <div className="min-w-0 flex-1">
                                <h5 className="text-[10px] font-bold text-white truncate leading-tight mb-0.5">{item.title}</h5>
                                <div className="flex items-center gap-1">
                                    <span className={`text-[8px] px-1.5 rounded-full border ${
                                        isPillar 
                                        ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' 
                                        : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
                                    }`}>
                                        {isPillar ? '👑 PILAR' : '🔗 CLUSTER'}
                                    </span>
                                    <span className={`text-[8px] px-1 rounded ${
                                        item.status === 'published' ? 'text-green-400 bg-green-900/30' : item.status === 'scheduled' ? 'text-purple-400 bg-purple-900/30' : 'text-gray-400 bg-gray-800'
                                    }`}>{item.status || 'draft'}</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Linkage Info */}
                        {!isPillar && parent && (
                            <div className="text-[9px] text-gray-500 flex items-center gap-1 pl-10">
                                <LinkIcon size={8}/> Menginduk ke: <span className="text-gray-400 truncate max-w-[100px]">{parent.title}</span>
                            </div>
                        )}
                        {/* Scheduled Info */}
                        {item.status === 'scheduled' && (
                            <div className="text-[9px] text-purple-400 flex items-center gap-1 pl-10">
                                <CalendarClock size={8}/> {item.scheduled_for}
                            </div>
                        )}

                        <button 
                            onClick={(e) => { e.stopPropagation(); actions.deleteItem(item.id); }}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500"
                        >
                            <Trash2 size={12} />
                        </button>
                    </div>
                );
            })}
         </div>
      </div>

      {/* 2. CENTER COLUMN: EDITOR / AI STUDIO */}
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
            {/* STRATEGY TOGGLE (Always Visible at Step 0) */}
            {!form.id && aiState.step === 0 && (
                <div className="mb-6 bg-white/5 p-3 rounded-lg border border-white/10">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Pilih Strategi Konten</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setForm(p => ({...p, type: 'cluster'}))}
                            className={`p-3 rounded-lg border transition-all text-left relative ${
                                form.type === 'cluster' 
                                ? 'bg-blue-500/10 border-blue-500 text-white' 
                                : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'
                            }`}
                        >
                            <Network size={16} className="mb-2"/>
                            <div className="font-bold text-xs">Cluster</div>
                            <div className="text-[9px] opacity-70">Artikel Pendukung</div>
                            {form.type === 'cluster' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-blue-500"/>}
                        </button>
                        <button 
                            onClick={() => setForm(p => ({...p, type: 'pillar'}))}
                            className={`p-3 rounded-lg border transition-all text-left relative ${
                                form.type === 'pillar' 
                                ? 'bg-yellow-500/10 border-yellow-500 text-white' 
                                : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'
                            }`}
                        >
                            <Crown size={16} className="mb-2"/>
                            <div className="font-bold text-xs">Pillar Page</div>
                            <div className="text-[9px] opacity-70">Konten Utama</div>
                            {form.type === 'pillar' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-yellow-500"/>}
                        </button>
                    </div>

                    {/* Show Dropdown if Cluster */}
                    {form.type === 'cluster' && (
                        <div className="mt-3 animate-fade-in">
                            <label className="text-[9px] text-gray-500 mb-1 block">Induk Artikel (Pillar)</label>
                            <select 
                                value={form.pillar_id || 0}
                                onChange={(e) => setForm(p => ({...p, pillar_id: parseInt(e.target.value)}))}
                                className="w-full bg-black text-white text-xs border border-white/10 rounded px-2 py-2 focus:border-brand-orange outline-none"
                            >
                                <option value={0}>-- Pilih Pillar Page --</option>
                                {availablePillars.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            {availablePillars.length === 0 && (
                                <p className="text-[9px] text-red-400 mt-1">Belum ada Artikel Pilar. Buat Pillar dulu!</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* AI WIZARD */}
            {!form.id && aiState.step < 3 && (
                <div className="space-y-6">
                    {/* STEP 1: PRESET CATEGORIES */}
                    <div className={`transition-all ${aiState.step > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                        <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-3">Step 1: Pilih Fokus Topik</label>
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

                    {/* STEP 2: SELECT TOPIC/TITLE */}
                    {aiState.step >= 1 && (
                        <div className={`transition-all ${aiState.step > 1 ? 'opacity-50 pointer-events-none' : 'animate-fade-in'}`}>
                            <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2">Step 2: Pilih Judul/Topik</label>
                            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                                {aiState.keywords.map((k: KeywordData, i: number) => (
                                    <button key={i} onClick={() => actions.selectTopic(k)} className="text-left p-2.5 rounded border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 transition-all flex justify-between items-center group">
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

                    {/* STEP 3 & 4 SPLIT CONTAINER */}
                    {aiState.step >= 2 && form.title && (
                        <div className="animate-fade-in border-t border-white/5 pt-4 space-y-6">
                            
                            {/* BLOCK A: GENERATE TEXT */}
                            <div>
                                <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                                    <FileText size={12}/> Step 3: Tulis Konten ({form.type === 'pillar' ? 'Pillar' : 'Cluster'})
                                </label>
                                {loading.generatingText ? (
                                    <GenerationProgress percent={progress.text.percent} message={progress.text.message} color="orange" />
                                ) : (
                                    <Button onClick={actions.generateTextContent} disabled={loading.generatingText || !!form.content} className={`w-full py-3 text-xs ${form.content ? 'bg-green-600 hover:bg-green-500 opacity-50' : 'bg-brand-orange hover:bg-brand-glow'}`}>
                                        {form.content ? <><Check size={14}/> ARTIKEL SELESAI</> : <><Sparkles size={14}/> GENERATE TEXT DRAFT</>}
                                    </Button>
                                )}
                            </div>

                            {/* BLOCK B: GENERATE IMAGE */}
                            <div className={`transition-all ${!form.content ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                                <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                                    <Palette size={12}/> Step 4: Desain Visual
                                </label>
                                
                                <div className="mb-3">
                                    <label className="text-[9px] text-gray-500 mb-1 block">Style Gambar</label>
                                    <div className="grid grid-cols-2 gap-1">
                                        {(['cinematic', 'cyberpunk', 'corporate', 'studio', 'minimalist'] as const).map((style) => (
                                            <button 
                                                key={style}
                                                onClick={() => aiState.setGenConfig({...aiState.genConfig, imageStyle: style})}
                                                className={`py-1 text-[9px] uppercase border rounded ${aiState.genConfig.imageStyle === style ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-gray-500 border-white/10'}`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {loading.generatingImage ? (
                                    <GenerationProgress percent={progress.image.percent} message={progress.image.message} color="blue" />
                                ) : (
                                    <Button onClick={actions.generateImageContent} disabled={loading.generatingImage} className="w-full py-3 text-xs bg-blue-600 hover:bg-blue-500 border-none shadow-lg">
                                        <ImageIcon size={14}/> GENERATE CONTEXTUAL IMAGE
                                    </Button>
                                )}
                            </div>

                            {/* FINISH BUTTON */}
                            {form.content && form.imagePreview && (
                                <div className="pt-2 animate-fade-in">
                                    <Button onClick={() => actions.handleEditClick({...form, date: '', readTime: '', image: form.imagePreview} as any)} className="w-full py-2 bg-white/10 hover:bg-white/20 text-xs border border-white/20">
                                        <Edit size={12}/> Edit Manual & Finalisasi
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* MANUAL EDITOR */}
            {(form.id || aiState.step === 3) && (
                <div className="space-y-4 animate-fade-in pb-10">
                    
                    {/* Strategy Info in Editor */}
                    <div className="flex gap-2 items-center mb-2">
                        <span className={`text-[9px] px-2 py-1 rounded border font-bold ${form.type === 'pillar' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-blue-500/10 border-blue-500 text-blue-500'}`}>
                            {form.type.toUpperCase()}
                        </span>
                        {form.type === 'cluster' && (
                            <div className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-[9px] text-gray-400 truncate">
                                Parent: {availablePillars.find(p => p.id === form.pillar_id)?.title || 'Tidak ada'}
                            </div>
                        )}
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-32 bg-black rounded-lg border border-white/10 overflow-hidden group">
                        {form.imagePreview ? (
                            <img src={form.imagePreview} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={24}/></div>
                        )}
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                            {loading.generatingImage ? (
                                <div className="w-full">
                                    <GenerationProgress percent={progress.image.percent} message={progress.image.message} color="blue" />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={actions.generateImageContent} className="px-2 py-1 bg-blue-500 text-white text-[10px] rounded flex items-center gap-1 shadow-lg hover:bg-blue-400">
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
                            )}
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

                    {/* AUTO-CLUSTER SCHEDULER PANEL (For Pillar Only) */}
                    {form.type === 'pillar' && form.cluster_ideas && form.cluster_ideas.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-lg p-3 space-y-3 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={12}/> Auto-Cluster Strategy
                                </h4>
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">{form.cluster_ideas.length} Ide</Badge>
                            </div>
                            
                            <div className="max-h-32 overflow-y-auto custom-scrollbar border border-white/5 rounded bg-black/20 p-2">
                                <ul className="space-y-1">
                                    {form.cluster_ideas.map((idea, idx) => (
                                        <li key={idx} className="text-[9px] text-gray-400 flex items-start gap-2">
                                            <span className="text-purple-500">•</span> {idea}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button 
                                onClick={actions.scheduleClusters} 
                                disabled={loading.scheduling}
                                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold border-none shadow-lg"
                            >
                                {loading.scheduling ? <LoadingSpinner size={12}/> : <><CalendarClock size={12}/> AUTO-SCHEDULE (2x SEHARI)</>}
                            </Button>
                            <p className="text-[8px] text-gray-500 text-center">
                                Akan membuat {form.cluster_ideas.length} draft artikel dengan jadwal tayang otomatis mulai besok.
                            </p>
                        </div>
                    )}

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

      {/* 3. RIGHT COLUMN: LIVE PREVIEW */}
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
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none fixed"></div>
            
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        {form.category && <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest block">{form.category}</span>}
                        {form.type === 'pillar' && <span className="text-yellow-500 text-[9px] border border-yellow-500/30 px-1 rounded">CORNERSTONE CONTENT</span>}
                    </div>
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

                <SimpleMarkdown content={form.content} />
            </div>
         </div>
      </div>

    </div>
  );
};
