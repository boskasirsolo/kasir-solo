
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, uploadToSupabase, processBackgroundMigration, slugify } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS, NARRATIVE_TONES } from './types';

// --- FOUNDER STORY VARIATIONS (ANEKDOT DATABASE) ---
const FOUNDER_ANECDOTES = [
    `"Jujur aja, 2022 itu tahun neraka buat gue. Domain kantor 'expired' dan diambil orang. Rasanya kayak rumah lo digusur padahal sertifikatnya lengkap. Dari situ gue belajar: detail kecil itu mematikan."`,
    `"Pas gue liat notifikasi server down dan aset digital hilang, dengkul gue lemes. Itu momen gue sadar, bisnis tanpa backup system itu sama aja bunuh diri pelan-pelan."`,
    `"Jangan pikir gue langsung duduk enak di kursi CEO. 2015 gue jalan kaki, door-to-door nawarin mesin kasir, diusir satpam, diketawain owner toko. Mental gue ditempa di aspal panas."`,
    `"Klien pertama gue itu warung kelontong kecil. Dia bayar pake uang receh hasil dagang seharian. Gue terima duit itu sambil gemeter, gue janji software ini gak boleh ngecewain dia."`,
    `"Gue pernah gak tidur 48 jam cuma gara-gara selisih 50 perak di laporan closing. Orang bilang lebay, gue bilang itu integritas. Kalau 50 perak aja lolos, gimana 50 juta?"`,
    `"Bikin software itu gampang. Bikin software yang bisa dipake sama Ibu-ibu pasar yang gak ngerti gadget? Itu baru tantangan. SIBOS lahir dari situ."`,
    `"Banyak motivator bisnis bilang 'Fokus Omzet!', tai kucing lah. Fokus itu di Profit dan Data. Omzet gede kalau bocor di operasional buat apa? Capek doang."`,
    `"Stop dewa-dewain teknologi mahal. POS 50 juta gak guna kalau kasir lo masih bisa nyatet manual di buku utang. Sistem itu soal habit, bukan cuma alat."`,
    `"Gue sering banget denger curhatan owner yang duitnya dicolong karyawan kepercayaan. Sakitnya bukan di duitnya, tapi di khianatnya. Gue bangun sistem ini biar lo gak ngerasain sakit itu."`,
    `"Gue ngerti rasanya pusing ngurus stok opname tiap akhir bulan. Mata sepet, fisik capek, data gak klop. Gue pernah di posisi lo, Makanya gue bikin fitur auto-stock."`
];

const OPENING_HOOKS = [
    "THE PUNCH: Mulai dengan satu kalimat pendek yang menohok/keras.",
    "THE QUESTION: Mulai dengan pertanyaan retoris yang relate dengan masalah pembaca.",
    "THE STAT: Mulai dengan fakta atau data statistik yang mengejutkan.",
    "THE STORY: Mulai langsung di tengah cerita (In Media Res) tanpa basa-basi.",
    "THE CONTRAST: Mulai dengan 'Banyak orang pikir X, padahal aslinya Y'."
];

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

    return { searchTerm, setSearchTerm, filterType, setFilterType, page, setPage, totalPages, paginatedList, expandedPillarId, setExpandedPillarId };
};

const parseVolume = (volStr: string): number => {
    try {
        const lower = volStr.toLowerCase().replace(/\/mo/g, '').trim();
        if (lower.includes('k')) {
            const numPart = parseFloat(lower.replace('k', ''));
            return isNaN(numPart) ? 0 : numPart * 1000;
        }
        const clean = lower.replace(/\./g, '').replace(/,/g, '');
        const num = parseInt(clean);
        return isNaN(num) ? 0 : num;
    } catch (e) { return 0; }
};

export const useAIGenerator = () => {
    // UPDATED: Loading state now includes detailed progress message
    const [loading, setLoading] = useState({ 
        researching: false, 
        generatingText: false, 
        generatingImage: false, 
        uploading: false,
        progressMessage: '' // NEW: To show "Writing Section 1/5..."
    });
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true, autoCategory: true, autoAuthor: true,
        imageStyle: 'cinematic', narrative: 'narsis'
    });

    const analyzeMarket = async (articleType: 'pillar' | 'cluster') => {
        setLoading(p => ({ ...p, researching: true, progressMessage: 'Analyzing Market Data...' }));
        try {
            let prompt = "";
            if (articleType === 'pillar') {
                prompt = `
                Act as a Senior SEO Strategist for the Indonesian Market.
                Industry: Retail Technology, Point of Sale (POS), Business Management.
                Task: Identify 10 **Broad, High-Volume "Ultimate Guide" Article Titles** (Pillar Content) for 2025.
                These should be comprehensive topics that can be broken down into many sub-topics later.
                **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition. Do NOT include 'High' competition keywords.
                Strict Output Format: JSON Array of Objects.
                Example: [{"keyword": "Panduan Lengkap Bisnis Ritel", "volume": "12k/mo", "competition": "Medium", "type": "Pillar"}]
                `;
            } else {
                prompt = `
                Act as a Senior SEO Strategist for the Indonesian Market.
                Industry: Retail Technology, Point of Sale (POS), UMKM Business.
                Task: Identify 15 **Specific, Long-tail, Problem-Solving Article Titles** (Cluster Content) for 2025.
                **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition. Do NOT include 'High' competition keywords.
                Strict Output Format: JSON Array of Objects.
                Example: [{"keyword": "Cara Mencegah Kasir Curang", "volume": "5.400/mo", "competition": "Low", "type": "Cluster"}]
                `;
            }

            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            
            if (Array.isArray(data)) {
                const filteredData = data.filter((item: any) => {
                    const comp = (item.competition || '').toLowerCase();
                    return comp !== 'high' && !comp.includes('high'); 
                });
                const sortedData = filteredData.sort((a: any, b: any) => parseVolume(b.volume) - parseVolume(a.volume));
                setKeywords(sortedData);
            }
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };

    const generateClusterIdeas = async (pillar: Article) => {
        setLoading(p => ({ ...p, researching: true, progressMessage: 'Generating Cluster Topics...' }));
        setKeywords([]);
        try {
            const prompt = `
            Act as SEO Specialist. Context: We have a Pillar Page titled "${pillar.title}".
            Task: Generate 10 Specific Cluster Content Ideas (Sub-topics) that link back to this pillar.
            **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition.
            STRICT JSON Output Format: Array of objects with keys: "keyword", "volume", "competition", "type".
            `;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            if (Array.isArray(data)) {
                const filteredData = data.filter((item: any) => {
                    const comp = (item.competition || '').toLowerCase();
                    return comp !== 'high' && !comp.includes('high'); 
                });
                const sortedData = filteredData.sort((a: any, b: any) => parseVolume(b.volume) - parseVolume(a.volume));
                setKeywords(sortedData);
            }
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };

    // --- MAIN GENERATION LOGIC ---
    const generateContent = async (
        title: string, 
        tones: string[], 
        type: string, 
        authorName: string, 
        wordCount: number, 
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[] 
    ) => {
        setLoading(p => ({ ...p, generatingText: true }));
        
        try {
            // IF WORD COUNT > 2000, USE MULTI-STEP GENERATION
            if (wordCount >= 2000) {
                return await generateLongFormContent(title, tones, type, authorName, wordCount, pillarContext, relatedPillarsData);
            }

            // --- STANDARD GENERATION (< 2000 words) ---
            setLoading(p => ({ ...p, progressMessage: 'Writing Standard Article...' }));
            const isAmin = authorName === 'Amin Maghfuri';
            const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
            const selectedHook = OPENING_HOOKS[Math.floor(Math.random() * OPENING_HOOKS.length)];
            const shouldInjectStory = isAmin ? (Math.random() > 0.2) : (Math.random() > 0.8);
            
            const storyInstruction = shouldInjectStory 
                ? `Story Element to Weave In: ${selectedAnecdote} (Make it flow naturally).`
                : `Story Element: SKIP personal story this time. Focus purely on technical advice.`;

            const pov = isAmin 
                ? `First Person Casual ('Gue'). You are Amin Maghfuri (Founder). Use 'Gue/Lo'. Be gritty, street-smart. ${storyInstruction}` 
                : "Professional ('Kami'). Trustworthy, Expert, Corporate Tone.";
            
            const toneDescriptions = tones.map(t => {
                const def = NARRATIVE_TONES.find(nt => nt.id === t);
                return def ? `${def.label}` : t;
            }).join(', ');

            let clusterInstruction = "";
            if (type === 'cluster' && pillarContext) {
                clusterInstruction = `[SEO]: Link back to [${pillarContext.title}](/articles/${pillarContext.slug}) in first 3 paragraphs.`;
            }

            let relatedPillarInstruction = "";
            if (relatedPillarsData && relatedPillarsData.length > 0) {
                const linksList = relatedPillarsData.map(p => `- [${p.title}](/articles/${p.slug})`).join('\n');
                relatedPillarInstruction = `[SEO]: Weave links to these related pillars naturally:\n${linksList}`;
            }

            const contentPrompt = `
            Role: Expert Copywriter PT Mesin Kasir Solo.
            Task: Write Article "${title}".
            Length: Approx ${wordCount} words.
            POV: ${pov}
            Tone: ${toneDescriptions}.
            Opening: ${selectedHook}
            Structure: Use Headers #, ##, ###, Lists, Bold.
            ${clusterInstruction}
            ${relatedPillarInstruction}
            Brand Context: ${BRAND_CONTEXT}
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            const content = contentRes.text || '';
            const meta = await generateMeta(title, content);

            return { content, meta };

        } catch (e: any) { 
            throw e; 
        } finally {
            setLoading(p => ({ ...p, generatingText: false, progressMessage: '' }));
        }
    };

    // --- NEW: LONG FORM GENERATOR (MULTI-STEP) ---
    const generateLongFormContent = async (
        title: string, 
        tones: string[], 
        type: string, 
        authorName: string, 
        wordCount: number,
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[] 
    ) => {
        // 1. SETUP PHASE
        const isAmin = authorName === 'Amin Maghfuri';
        const pov = isAmin ? "First Person 'Gue' (Amin Maghfuri)" : "Professional 'Kami'";
        const sectionsCount = Math.ceil(wordCount / 1000); // 1000 words per section
        
        // 2. BLUEPRINT PHASE (Generate Outline)
        setLoading(p => ({ ...p, progressMessage: `Designing Outline for ${wordCount} words...` }));
        
        const outlinePrompt = `
        Act as a Content Architect.
        Task: Create a detailed Table of Contents (Outline) for a **${wordCount}-word Ultimate Guide** titled "${title}".
        Target: Break this into exactly **${sectionsCount} Distinct Major Sections** (Chapters).
        
        Structure Requirements:
        - Section 1: Introduction (Hook + Problem Agitation + Thesis).
        - Middle Sections: Deep dive into technical details, strategies, comparisons, or case studies.
        - Last Section: Conclusion & Call to Action.
        
        Output Format: JSON Array of Strings (Section Titles Only).
        Example: ["Introduction: Why X Matters", "Chapter 1: The Basics", "Chapter 2: Advanced Strategy", ...]
        `;

        const outlineRes = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: outlinePrompt, 
            config: { responseMimeType: "application/json" } 
        });
        
        const sections = JSON.parse(outlineRes.text || '[]');
        let fullContent = "";
        let previousContext = "";

        // 3. ASSEMBLY PHASE (Looping)
        for (let i = 0; i < sections.length; i++) {
            const sectionTitle = sections[i];
            const isFirst = i === 0;
            const isLast = i === sections.length - 1;
            
            setLoading(p => ({ ...p, progressMessage: `Writing Section ${i + 1}/${sections.length}: ${sectionTitle}...` }));

            // Smart Context for Continuity
            let connectionInstruction = "";
            if (!isFirst) {
                connectionInstruction = `
                [CRITICAL CONTINUITY INSTRUCTION]
                This is Part ${i + 1} of the article.
                The PREVIOUS PART ended with these sentences: "...${previousContext.slice(-300)}..."
                
                **YOUR TASK:**
                1. Do NOT write a new introduction like "Welcome back" or "In this section".
                2. Start IMMEDIATELY by connecting to the previous thought.
                3. Maintain the flow as if it is one continuous text.
                `;
            } else {
                connectionInstruction = `Start with a strong Hook.`;
            }

            // SEO Linking Logic (Distribute links across sections)
            let linkInstruction = "";
            if (relatedPillarsData && relatedPillarsData.length > 0) {
                // Only ask to link 1 related pillar per section to avoid spamming
                const linkTarget = relatedPillarsData[i % relatedPillarsData.length]; 
                linkInstruction = `Try to naturally mention and link to: [${linkTarget.title}](/articles/${linkTarget.slug}) in this section.`;
            }

            const sectionPrompt = `
            Role: Expert Writer for PT Mesin Kasir Solo.
            Task: Write **Section ${i + 1}: ${sectionTitle}** for the article "${title}".
            Target Length for THIS section: **1000 words**.
            POV: ${pov}.
            Style: Detailed, Deep, Actionable. Use Subheaders (##, ###), Lists, and Bold text.
            Brand Context: ${BRAND_CONTEXT}
            
            ${connectionInstruction}
            
            ${linkInstruction}
            
            OUTPUT: Markdown content for this section only.
            `;

            const sectionRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: sectionPrompt });
            const sectionText = sectionRes.text || "";
            
            fullContent += sectionText + "\n\n";
            previousContext = sectionText; // Update context for next loop
        }

        const meta = await generateMeta(title, fullContent);
        return { content: fullContent, meta };
    };

    const generateMeta = async (title: string, content: string) => {
        const generatedWordCount = content.split(/\s+/).length;
        const readTimeMin = Math.ceil(generatedWordCount / 200);
        
        const metaPrompt = `Generate JSON Metadata for "${title}". Format: {"excerpt": "...", "category": "..."}. Base it on this content: ${content.substring(0, 500)}...`;
        const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
        const metaData = JSON.parse(metaRes.text || '{}');
        
        return { ...metaData, readTime: `${readTimeMin} min read` };
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
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        targetWordCount: 1000,
        related_pillars: []
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
            date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            targetWordCount: 1000,
            related_pillars: []
        });
        setAiStep(0); setSelectedPresets([]); setSelectedTones(['gritty']);
    };

    const handleEditClick = (item: Article) => {
        const matchedPersona = personas.find(p => item.author.includes(p.name));
        if (matchedPersona) setActivePersonaId(matchedPersona.id);
        const estimatedCount = item.content ? item.content.split(/\s+/).length : 1000;

        setForm({
            id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
            category: item.category, author: item.author, authorAvatar: item.author_avatar || activePersona.avatar || '', 
            uploadAuthorFile: null, readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'draft', scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0, cluster_ideas: item.cluster_ideas || [], scheduleStart: '',
            date: item.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            targetWordCount: estimatedCount,
            related_pillars: item.related_pillars || []
        });
        setAiStep(2);
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Uploading Avatar...' }));
        try {
            let avatarUrl = URL.createObjectURL(file);
            if (supabase) {
                const { url } = await uploadToSupabase(file, 'avatars');
                avatarUrl = url;
            }
            setPersonas(prev => prev.map(p => p.id === activePersonaId ? { ...p, avatar: avatarUrl } : p));
            setForm(prev => ({ ...prev, authorAvatar: avatarUrl }));
        } catch (e) { alert("Gagal upload avatar"); } 
        finally { aiLogic.setLoading(p => ({ ...p, uploading: false, progressMessage: '' })); }
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        if (form.type === 'cluster' && (!form.pillar_id || form.pillar_id === 0)) {
            return alert("Peringatan: Artikel 'Cluster' WAJIB memilih Pillar Page induknya!");
        }

        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Saving Article...' }));
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
                date: dateStr, 
                related_pillars: form.related_pillars 
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
        finally { aiLogic.setLoading(p => ({ ...p, uploading: false, progressMessage: '' })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel?")) return;
        setArticles((prev: Article[]) => prev.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const runResearch = async () => { 
        try { 
            await aiLogic.analyzeMarket(form.type as 'pillar' | 'cluster'); 
            setAiStep(1); 
        } catch(e: any) { alert(e.message); } 
    };
    
    const runClusterResearch = async (pillar: Article) => { 
        try { 
            setForm({
                id: null, title: '', excerpt: '', content: '', category: pillar.category,
                author: activePersona.name, authorAvatar: activePersona.avatar || '', 
                uploadAuthorFile: null, readTime: '5 min read', imagePreview: '', uploadFile: null, 
                status: 'draft', scheduled_for: '', type: 'cluster', pillar_id: pillar.id, 
                cluster_ideas: [], scheduleStart: '',
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                targetWordCount: 1000,
                related_pillars: []
            });
            setAiStep(1); 
            await aiLogic.generateClusterIdeas(pillar); 
        } catch(e: any) { alert(e.message); } 
    };

    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    
    const runWrite = async () => { 
        try { 
            let pillarContext = undefined;
            if (form.type === 'cluster' && form.pillar_id) {
                const pillar = articles.find(a => a.id === form.pillar_id);
                if (pillar) {
                    pillarContext = { title: pillar.title, slug: slugify(pillar.title) };
                }
            }

            let relatedPillarsData: {title: string, slug: string}[] = [];
            if (form.type === 'pillar' && form.related_pillars && form.related_pillars.length > 0) {
                relatedPillarsData = form.related_pillars
                    .map((id) => {
                        const related = articles.find(a => a.id === id);
                        return related ? { title: related.title, slug: slugify(related.title) } : null;
                    })
                    .filter(Boolean) as {title: string, slug: string}[];
            }

            const { content, meta } = await aiLogic.generateContent(
                form.title, selectedTones, form.type, form.author, form.targetWordCount, 
                pillarContext, relatedPillarsData
            ); 
            
            setForm(p => ({ 
                ...p, content, excerpt: meta.excerpt, 
                category: p.category && p.category.length > 2 ? p.category : meta.category, 
                readTime: meta.readTime 
            })); 
            setAiStep(2); 
        } catch(e: any) { alert(e.message); } 
    };
    
    const runImage = async () => { 
        aiLogic.setLoading(p => ({ ...p, generatingImage: true, progressMessage: 'Generating AI Image...' })); 
        try { 
            const style = activePersona.mode === 'personal' ? 'cinematic' : 'corporate'; 
            const url = await aiLogic.getAIImageUrl(form.title, style); 
            setForm(p => ({ ...p, imagePreview: url })); 
        } catch(e) {} finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false, progressMessage: '' })); } 
    };

    return {
        form, setForm, filterLogic, aiLogic, personas, activePersonaId, setActivePersonaId, updatePersonaAvatar,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, trendingTopics: aiLogic.trendingTopics, keywords: aiLogic.keywords, selectedTones, setSelectedTones },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage, runClusterResearch }
    };
};
