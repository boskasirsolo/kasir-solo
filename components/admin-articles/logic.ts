
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, uploadToSupabase, processBackgroundMigration } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS, NARRATIVE_TONES } from './types';

// --- FOUNDER STORY VARIATIONS (ANEKDOT) ---
// AI akan memilih salah satu dari ini secara acak untuk disuntikkan ke artikel
const FOUNDER_ANECDOTES = [
    `ANGLE 1 (THE SHOCK): "Pagi itu di 2022, gue bangun dan cek HP. Notif masuk: domain kantor 'expired' dan sudah dibeli orang lain seharga puluhan juta. Gue lemes. Itu bukan cuma alamat web, itu identitas kami selama 7 tahun. Hilang dalam sekejap karena keteledoran administrasi."`,
    `ANGLE 2 (THE RESTART): "Lo pernah main game, udah level 99, terus save file-nya corrupt? Itu rasanya PT Mesin Kasir Solo di tahun 2022. Kami harus mulai lagi dari Level 1. Tapi bedanya, kali ini kami punya 'Cheat Code': Pengalaman."`,
    `ANGLE 3 (THE EMPATHY): "Kenapa gue ngotot bikin SIBOS? Karena gue tau rasanya bangkrut gara-gara data berantakan. Gue nggak mau klien gue ngerasain hal yang sama. Gue jualan sistem ini bukan cuma cari untung, tapi cari temen seperjuangan biar nggak jatuh di lubang yang sama."`,
    `ANGLE 4 (THE GRIT): "Orang bilang bisnis teknologi itu glamor. Bullsh*t. 2015 gue jalan kaki door-to-door nawarin kasir ditolak satpam. 2022 gue kehilangan aset digital. Tapi gue masih di sini. Kenapa? Karena visi gue belum kelar."`,
    `ANGLE 5 (THE TECHNICAL FAILURE): "Server down, data klien sempat freeze, dan gue dimaki-maki customer. Itu momen paling memalukan sebagai vendor IT. Tapi dari situ SIBOS lahir dengan arsitektur Hybrid. Kami belajar dari darah dan keringat sendiri."`
];

// --- BRAND CONTEXT KNOWLEDGE BASE ---
const BRAND_CONTEXT = `
[IDENTITAS PERUSAHAAN]
Nama: PT Mesin Kasir Solo.
Sejarah: Berdiri 2015, sempat "mati suri" & kehilangan aset digital pada 2022, kini bangkit kembali (Reborn 2025).
Karakter: Resilien (Tahan Banting), Jujur, Solutif, dan Berorientasi Komunitas.

[PRODUK]
1. SIBOS (ERP System): Multi-bisnis, Hybrid, Waiting List Open.
2. QALAM (Edu App): Manajemen TPA, Subsidi Silang, Waiting List Open.
3. Hardware: POS, Printer, Kiosk.

[GAYA PENULISAN - "ANTI-TEMPLATE"]
- JANGAN gunakan kalimat pembuka klise seperti "Di era digital ini..." atau "Pada kesempatan kali ini...". Langsung masuk ke masalah (Hook).
- Gunakan analogi sehari-hari yang relatable.
- Variasikan panjang kalimat. Ada yang pendek tegas. Ada yang panjang menjelaskan.
- Jika menggunakan POV Founder (Amin Maghfuri), gunakan kata ganti "Gue/Saya" yang konsisten, bahasa agak 'street-smart', berani, dan emosional.
`;

// --- SUB-HOOK: FILTER & PAGINATION ---
export const useArticleFilter = (articles: Article[], itemsPerPage: number) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [expandedPillarId, setExpandedPillarId] = useState<number | null>(null);

    useEffect(() => {
        setPage(1);
        setExpandedPillarId(null);
    }, [searchTerm, filterType]);

    const filteredList = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;

            if (filterType === 'all') return true; 
            if (filterType === 'pillar') return a.type === 'pillar';
            if (filterType === 'cluster') return a.type === 'cluster';
            if (filterType === 'orphan') return !a.pillar_id && a.type !== 'pillar';
            if (filterType === 'draft') return a.status === 'draft' || !a.status; 
            if (filterType === 'scheduled') return a.status === 'scheduled';
            return false;
        });
    }, [articles, searchTerm, filterType]);

    const sortedList = useMemo(() => {
        return [...filteredList].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA; // Descending
        });
    }, [filteredList]);

    const totalPages = Math.ceil(sortedList.length / itemsPerPage);
    const paginatedList = sortedList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return {
        searchTerm, setSearchTerm,
        filterType, setFilterType,
        page, setPage,
        totalPages,
        paginatedList,
        expandedPillarId, setExpandedPillarId
    };
};

// --- SUB-HOOK: AI GENERATOR ---
export const useAIGenerator = () => {
    const [loading, setLoading] = useState({ researching: false, generatingText: false, generatingImage: false, uploading: false });
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true, autoCategory: true, autoAuthor: true,
        imageStyle: 'cinematic', narrative: 'narsis'
    });

    const analyzeMarket = async () => {
        setLoading(p => ({ ...p, researching: true }));
        try {
            const prompt = `
            Act as a Senior SEO Strategist for the Indonesian Market.
            Industry: Retail Technology, Point of Sale (POS), UMKM Business.
            Task: Identify 15 high-potential **Specific Long-tail Article Titles** (Keywords) for 2025.
            Strict Output Format: JSON Array of Objects.
            Example: [{"keyword": "Cara Mencegah Kasir Curang", "volume": "5.400/mo", "competition": "Low", "type": "Problem Solving"}]
            `;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            if (Array.isArray(data)) setKeywords(data);
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false })); }
    };

    const generateClusterIdeas = async (pillar: Article) => {
        setLoading(p => ({ ...p, researching: true }));
        try {
            const prompt = `Context: Pillar "${pillar.title}". Task: Generate 10 Cluster Titles. Format: JSON Array.`;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            if (Array.isArray(data)) setKeywords(data);
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false })); }
    };

    const generateContent = async (title: string, tones: string[], type: string, authorName: string) => {
        setLoading(p => ({ ...p, generatingText: true }));
        try {
            const isAmin = authorName === 'Amin Maghfuri';
            // Pick a random anecdote to inject flavor
            const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
            
            const pov = isAmin 
                ? `First Person Casual ('Gue'). You are Amin Maghfuri. Use 'Gue'. Be gritty, raw. Include this specific story element naturally if relevant: ${selectedAnecdote}` 
                : "Professional ('Kami'). Trustworthy, Expert, Corporate Tone.";
            
            const toneDescriptions = tones.map(t => {
                const def = NARRATIVE_TONES.find(nt => nt.id === t);
                return def ? `${def.label} (${def.desc})` : t;
            }).join(', ');

            const contentPrompt = `
            Role: Expert Copywriter for PT Mesin Kasir Solo.
            Task: Write an Article about "${title}".
            Brand Context: ${BRAND_CONTEXT}
            
            [STYLE GUIDE]
            POV: ${pov}
            Tone Mix: ${toneDescriptions}.
            Type: ${type.toUpperCase()}.
            Length: ${type === 'pillar' ? '3000+ words (Comprehensive)' : '800-1200 words (Focused)'}.
            Format: Markdown.
            
            **CRITICAL:** Write like a human. Avoid repetitive AI patterns. Use short sentences for impact.
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            
            const metaPrompt = `Generate JSON Metadata for "${title}". Format: {"excerpt": "...", "category": "...", "readTime": "..."}`;
            const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
            const metaData = JSON.parse(metaRes.text || '{}');

            return { content: contentRes.text || '', meta: metaData };
        } finally {
            setLoading(p => ({ ...p, generatingText: false }));
        }
    };

    const getAIImageUrl = async (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        const enhancedPrompt = `editorial photography of ${prompt}, ${style} style, modern tech context, indonesia, 8k, detailed, no text`;
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
        
        if (!supabase) return pollUrl;
        try {
            const res = await fetch(pollUrl);
            const blob = await res.blob();
            const file = new File([blob], `ai_gen_${seed}.jpg`, { type: "image/jpeg" });
            const { url } = await uploadToSupabase(file, 'ai-temp');
            return url;
        } catch(e) { return pollUrl; }
    };

    return { loading, setLoading, trendingTopics, keywords, genConfig, setGenConfig, analyzeMarket, generateContent, getAIImageUrl, generateClusterIdeas };
};

// --- MAIN HOOK ---
export const useArticleManager = (articles: Article[], setArticles: any) => {
    const filterLogic = useArticleFilter(articles, 7);
    const aiLogic = useAIGenerator();

    const [personas, setPersonas] = useState<AuthorPersona[]>(() => {
        try { return JSON.parse(localStorage.getItem('mks_personas') || '') || AUTHOR_PRESETS; } catch (e) { return AUTHOR_PRESETS; }
    });
    const [activePersonaId, setActivePersonaId] = useState<string>('personal');
    const activePersona = personas.find(p => p.id === activePersonaId) || personas[0];
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']); // Default tone changed to Gritty

    useEffect(() => { try { localStorage.setItem('mks_personas', JSON.stringify(personas)); } catch (e) {} }, [personas]);

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: activePersona.name, authorAvatar: activePersona.avatar || '',
        uploadAuthorFile: null, status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
    });

    const [aiStep, setAiStep] = useState(0);
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

    useEffect(() => {
        setForm(prev => ({ ...prev, author: activePersona.name, authorAvatar: activePersona.avatar || '' }));
    }, [activePersonaId, personas]);

    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: '',
            author: activePersona.name, authorAvatar: activePersona.avatar || '', 
            uploadAuthorFile: null, readTime: '5 min read', imagePreview: '', uploadFile: null, 
            status: 'draft', scheduled_for: '', type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
        });
        setAiStep(0); setSelectedPresets([]); setSelectedTones(['gritty']);
    };

    const handleEditClick = (item: Article) => {
        const matchedPersona = personas.find(p => item.author.includes(p.name));
        if (matchedPersona) setActivePersonaId(matchedPersona.id);
        setForm({
            id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
            category: item.category, author: item.author, authorAvatar: item.author_avatar || activePersona.avatar || '', 
            uploadAuthorFile: null, readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'draft', scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0, cluster_ideas: item.cluster_ideas || [], scheduleStart: ''
        });
        setAiStep(2);
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        try {
            let avatarUrl = URL.createObjectURL(file);
            if (supabase) {
                const { url } = await uploadToSupabase(file, 'avatars');
                avatarUrl = url;
            }
            setPersonas(prev => prev.map(p => p.id === activePersonaId ? { ...p, avatar: avatarUrl } : p));
            setForm(prev => ({ ...prev, authorAvatar: avatarUrl }));
        } catch (e) { alert("Gagal upload avatar"); } 
        finally { aiLogic.setLoading(p => ({ ...p, uploading: false })); }
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            let supabasePath = '';
            let fileToMigrate: File | null = form.uploadFile;

            if (form.uploadFile && supabase) {
                const { url, path } = await uploadToSupabase(form.uploadFile);
                finalImageUrl = url;
                supabasePath = path;
            }

            const now = new Date().toISOString();
            const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const finalAuthorAvatar = form.authorAvatar || activePersona.avatar;
            const statusNormalized = (form.status || 'draft').toLowerCase().trim();

            const commonData = {
                title: form.title, excerpt: form.excerpt || '', content: form.content || '', 
                category: form.category || 'General', author: form.author, author_avatar: finalAuthorAvatar, 
                read_time: form.readTime, image_url: finalImageUrl, status: statusNormalized as any,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type, pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas, date: dateStr 
            };

            let savedId = form.id;
            if (form.id) {
                setArticles((prev: Article[]) => prev.map(a => a.id === form.id ? { ...a, ...commonData, image: finalImageUrl } : a));
                if (supabase) await supabase.from('articles').update(commonData).eq('id', form.id);
            } else {
                const insertData = { ...commonData, created_at: now };
                const tempId = Date.now();
                setArticles((prev: Article[]) => [{ ...insertData, id: tempId, image: finalImageUrl } as any, ...prev]);
                if (supabase) {
                    const { data } = await supabase.from('articles').insert([insertData]).select().single();
                    if (data) savedId = data.id;
                }
            }

            if (supabasePath && fileToMigrate && savedId) {
                processBackgroundMigration(fileToMigrate, supabasePath, 'articles', savedId, 'image_url')
                    .then((cloudUrl) => {
                        if (cloudUrl) setArticles((prev: any[]) => prev.map(a => a.id === savedId ? { ...a, image: cloudUrl } : a));
                    });
            }
            resetForm();
        } catch(e: any) { alert("Error: " + e.message); } 
        finally { aiLogic.setLoading(p => ({ ...p, uploading: false })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel?")) return;
        setArticles((prev: Article[]) => prev.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const runResearch = async () => { try { await aiLogic.analyzeMarket(); setAiStep(1); } catch(e: any) { alert(e.message); } };
    const runClusterResearch = async (pillar: Article) => { 
        try { resetForm(); setForm(p => ({...p, type: 'cluster', pillar_id: pillar.id, category: pillar.category})); await aiLogic.generateClusterIdeas(pillar); setAiStep(1); } catch(e: any) { alert(e.message); } 
    };
    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    const runWrite = async () => { 
        try { 
            const { content, meta } = await aiLogic.generateContent(form.title, selectedTones, form.type, form.author); 
            setForm(p => ({ ...p, content, excerpt: meta.excerpt, category: meta.category, readTime: meta.readTime })); setAiStep(2); 
        } catch(e: any) { alert(e.message); } 
    };
    const runImage = async () => { 
        aiLogic.setLoading(p => ({ ...p, generatingImage: true })); 
        try { const style = activePersona.mode === 'personal' ? 'cinematic' : 'corporate'; const url = await aiLogic.getAIImageUrl(form.title, style); setForm(p => ({ ...p, imagePreview: url })); } catch(e) {} finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false })); } 
    };

    return {
        form, setForm, filterLogic, aiLogic, personas, activePersonaId, setActivePersonaId, updatePersonaAvatar,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, trendingTopics: aiLogic.trendingTopics, keywords: aiLogic.keywords, selectedTones, setSelectedTones },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage, runClusterResearch }
    };
};
