
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, uploadToSupabase, processBackgroundMigration, slugify } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS, NARRATIVE_TONES } from './types';

// --- FOUNDER STORY VARIATIONS (ANEKDOT DATABASE) ---
// Database cerita yang lebih luas: Sedih, Marah, Teknis, Lucu, Inspiratif.
const FOUNDER_ANECDOTES = [
    // THE FALL (2022) - Vulnerable
    `"Jujur aja, 2022 itu tahun neraka buat gue. Domain kantor 'expired' dan diambil orang. Rasanya kayak rumah lo digusur padahal sertifikatnya lengkap. Dari situ gue belajar: detail kecil itu mematikan."`,
    `"Pas gue liat notifikasi server down dan aset digital hilang, dengkul gue lemes. Itu momen gue sadar, bisnis tanpa backup system itu sama aja bunuh diri pelan-pelan."`,
    
    // THE HUSTLE (2015) - Grit
    `"Jangan pikir gue langsung duduk enak di kursi CEO. 2015 gue jalan kaki, door-to-door nawarin mesin kasir, diusir satpam, diketawain owner toko. Mental gue ditempa di aspal panas."`,
    `"Klien pertama gue itu warung kelontong kecil. Dia bayar pake uang receh hasil dagang seharian. Gue terima duit itu sambil gemeter, gue janji software ini gak boleh ngecewain dia."`,

    // THE TECH (Nerd/Obsessive)
    `"Gue pernah gak tidur 48 jam cuma gara-gara selisih 50 perak di laporan closing. Orang bilang lebay, gue bilang itu integritas. Kalau 50 perak aja lolos, gimana 50 juta?"`,
    `"Bikin software itu gampang. Bikin software yang bisa dipake sama Ibu-ibu pasar yang gak ngerti gadget? Itu baru tantangan. SIBOS lahir dari situ."`,

    // THE CONTRARIAN (Opinionated/Spicy)
    `"Banyak motivator bisnis bilang 'Fokus Omzet!', tai kucing lah. Fokus itu di Profit dan Data. Omzet gede kalau bocor di operasional buat apa? Capek doang."`,
    `"Stop dewa-dewain teknologi mahal. POS 50 juta gak guna kalau kasir lo masih bisa nyatet manual di buku utang. Sistem itu soal habit, bukan cuma alat."`,

    // THE EMPATHY (Friend/Mentor)
    `"Gue sering banget denger curhatan owner yang duitnya dicolong karyawan kepercayaan. Sakitnya bukan di duitnya, tapi di khianatnya. Gue bangun sistem ini biar lo gak ngerasain sakit itu."`,
    `"Gue ngerti rasanya pusing ngurus stok opname tiap akhir bulan. Mata sepet, fisik capek, data gak klop. Gue pernah di posisi lo, Makanya gue bikin fitur auto-stock."`
];

// --- OPENING HOOK STRATEGIES ---
// Cara memulai artikel agar tidak selalu "Halo" atau "Jujur..."
const OPENING_HOOKS = [
    "THE PUNCH: Mulai dengan satu kalimat pendek yang menohok/keras.",
    "THE QUESTION: Mulai dengan pertanyaan retoris yang relate dengan masalah pembaca.",
    "THE STAT: Mulai dengan fakta atau data statistik yang mengejutkan.",
    "THE STORY: Mulai langsung di tengah cerita (In Media Res) tanpa basa-basi.",
    "THE CONTRAST: Mulai dengan 'Banyak orang pikir X, padahal aslinya Y'."
];

// --- BRAND CONTEXT KNOWLEDGE BASE ---
const BRAND_CONTEXT = `
[IDENTITAS]
Nama: PT Mesin Kasir Solo.
DNA: Resilien, Jujur, Street-Smart, Anti-Ribet.
Produk: SIBOS (App Kasir), QALAM (App Sekolah), Hardware POS.

[GAYA BAHASA - STRICT]
- JANGAN PERNAH gunakan kalimat pembuka standar AI seperti "Di era digital yang semakin pesat..." atau "Pada artikel kali ini...".
- HINDARI kata-kata kaku/baku berlebihan. Gunakan bahasa lisan yang cerdas.
- Gunakan analogi 'jalanan' atau 'warung kopi' yang mudah dimengerti.
- Variasikan panjang kalimat. Kadang satu kata. Kadang satu paragraf.
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
        setKeywords([]); // Clear old keywords first
        try {
            const prompt = `
            Act as SEO Specialist.
            Context: We have a Pillar Page titled "${pillar.title}".
            Task: Generate 10 Specific Cluster Content Ideas (Sub-topics) that link back to this pillar.
            
            STRICT JSON Output Format: Array of objects with keys: "keyword", "volume", "competition", "type".
            
            Example: 
            [
              {"keyword": "Detail sub topic related to pillar", "volume": "300/mo", "competition": "Low", "type": "Cluster"},
              {"keyword": "Another specific angle", "volume": "1.2k/mo", "competition": "Medium", "type": "Cluster"}
            ]
            `;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            if (Array.isArray(data)) setKeywords(data);
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false })); }
    };

    const generateContent = async (title: string, tones: string[], type: string, authorName: string, pillarContext?: { title: string, slug: string }) => {
        setLoading(p => ({ ...p, generatingText: true }));
        try {
            const isAmin = authorName === 'Amin Maghfuri';
            
            // 1. Select Random Anecdote (Flavor)
            const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
            
            // 2. Select Random Opening Strategy (Structure)
            const selectedHook = OPENING_HOOKS[Math.floor(Math.random() * OPENING_HOOKS.length)];

            // 3. Determine Probability of Story Injection (80% chance for Amin, 20% for Team)
            const shouldInjectStory = isAmin ? (Math.random() > 0.2) : (Math.random() > 0.8);
            
            const storyInstruction = shouldInjectStory 
                ? `Story Element to Weave In: ${selectedAnecdote} (Make it flow naturally, don't force it if it doesn't fit).`
                : `Story Element: SKIP personal story this time. Focus purely on technical/tactical advice.`;

            const pov = isAmin 
                ? `First Person Casual ('Gue'). You are Amin Maghfuri (Founder). Use 'Gue/Lo'. Be gritty, street-smart, opinionated. ${storyInstruction}` 
                : "Professional ('Kami'). Trustworthy, Expert, Corporate Tone but not boring.";
            
            const toneDescriptions = tones.map(t => {
                const def = NARRATIVE_TONES.find(nt => nt.id === t);
                return def ? `${def.label} (${def.desc})` : t;
            }).join(', ');

            // --- CLUSTER STRATEGY INJECTION ---
            let clusterInstruction = "";
            if (type === 'cluster' && pillarContext) {
                clusterInstruction = `
                [SEO STRATEGY: CLUSTER CONTENT]
                This article is a "Cluster" supporting topic for the Pillar Page: "${pillarContext.title}".
                
                **MANDATORY INTERNAL LINKING:**
                1. You MUST explicitly mention and link back to the Pillar Page within the **first 3 paragraphs**.
                2. Use this exact Markdown Link format: [${pillarContext.title}](/articles/${pillarContext.slug})
                3. Narrative Example: "Topik ini sebenarnya adalah bagian mendalam dari panduan utama kami di [${pillarContext.title}](/articles/${pillarContext.slug}), tapi kali ini gue mau fokus ke..."
                4. Ensure the connection feels natural and adds value (Contextual Linking).
                `;
            }

            const contentPrompt = `
            Role: Expert Copywriter for PT Mesin Kasir Solo.
            Task: Write an Article about "${title}".
            Brand Context: ${BRAND_CONTEXT}
            
            [STYLE GUIDE & CONFIG]
            POV: ${pov}
            Tone Mix: ${toneDescriptions}.
            Opening Strategy: ${selectedHook}
            Type: ${type.toUpperCase()}.
            Length: ${type === 'pillar' ? '2500+ words (Deep Dive)' : '800-1200 words (Focused)'}.
            Format: Markdown (Use Headers #, ##, ###, Lists, Bold).
            
            ${clusterInstruction}
            
            **CRITICAL INSTRUCTIONS:**
            1. Start IMMEDIATELY with the ${selectedHook}. NO "Halo", NO "Selamat datang", NO "Di artikel ini".
            2. Write like a human speaking, not an AI writing. Use rhetorical questions, short sentences, and emotional hooks.
            3. If using 'Gue', be consistent. Don't switch to 'Saya'.
            ${type === 'cluster' && pillarContext ? '4. DO NOT FORGET THE PILLAR LINK IN THE INTRO.' : ''}
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
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']); 

    useEffect(() => { try { localStorage.setItem('mks_personas', JSON.stringify(personas)); } catch (e) {} }, [personas]);

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: activePersona.name, authorAvatar: activePersona.avatar || '',
        uploadAuthorFile: null, status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) // Default date
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
            status: 'draft', scheduled_for: '', type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '',
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0, cluster_ideas: item.cluster_ideas || [], scheduleStart: '',
            date: item.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
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
        // VALIDATION FOR CLUSTER
        if (form.type === 'cluster' && (!form.pillar_id || form.pillar_id === 0)) {
            return alert("Peringatan: Artikel tipe 'Cluster' WAJIB memilih Pillar Page induknya! Silakan set di panel Konfigurasi.");
        }

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
            const dateStr = form.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const finalAuthorAvatar = form.authorAvatar || activePersona.avatar;
            const statusNormalized = (form.status || 'draft').toLowerCase().trim();

            const commonData = {
                title: form.title, excerpt: form.excerpt || '', content: form.content || '', 
                category: form.category || 'General', author: form.author, author_avatar: finalAuthorAvatar, 
                read_time: form.readTime, image_url: finalImageUrl, status: statusNormalized as any,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type, pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas, 
                date: dateStr // Use date from form
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
        try { 
            // Manual Reset + Set Initial State for Cluster
            setForm({
                id: null, 
                title: '', 
                excerpt: '', 
                content: '', 
                category: pillar.category, // Inherit Category
                author: activePersona.name, 
                authorAvatar: activePersona.avatar || '', 
                uploadAuthorFile: null, 
                readTime: '5 min read', 
                imagePreview: '', 
                uploadFile: null, 
                status: 'draft', 
                scheduled_for: '', 
                type: 'cluster', 
                pillar_id: pillar.id, // Explicitly Set Pillar Link
                cluster_ideas: [], 
                scheduleStart: '',
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            });
            
            // Set AI Step to Keywords Selection
            setAiStep(1); 
            
            // Generate Ideas
            await aiLogic.generateClusterIdeas(pillar); 
        } catch(e: any) { alert(e.message); } 
    };

    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    const runWrite = async () => { 
        try { 
            // Lookup Pillar Context if Cluster
            let pillarContext = undefined;
            if (form.type === 'cluster' && form.pillar_id) {
                const pillar = articles.find(a => a.id === form.pillar_id);
                if (pillar) {
                    pillarContext = {
                        title: pillar.title,
                        slug: slugify(pillar.title)
                    };
                }
            }

            const { content, meta } = await aiLogic.generateContent(form.title, selectedTones, form.type, form.author, pillarContext); 
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
