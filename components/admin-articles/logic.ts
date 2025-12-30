
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, uploadToSupabase, processBackgroundMigration } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS } from './types';

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
            if (filterType === 'draft') return a.status === 'draft' || !a.status; // Robust check
            if (filterType === 'scheduled') return a.status === 'scheduled';
            return false;
        });
    }, [articles, searchTerm, filterType]);

    // Sorting: Newest First
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
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true, autoCategory: true, autoAuthor: true,
        imageStyle: 'cinematic', narrative: 'narsis'
    });

    const researchKeywords = async (topics: string[]) => {
        if (topics.length === 0) throw new Error("Pilih minimal 1 topik.");
        setLoading(p => ({ ...p, researching: true }));
        try {
            const prompt = `
            Act as a Senior SEO Strategist for the Indonesian Market.
            Context: Point of Sale (POS) System & Business Management Software.
            Selected Topics: ${topics.join(', ')}.
            Task: Generate 5 high-potential article titles/keywords.
            Strict Output Format: JSON Array ONLY.
            Example: [{"keyword": "Judul", "volume": "High", "competition": "Low", "type": "Evergreen"}]
            `;
            
            const result = await callGeminiWithRotation({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt, 
                config: { responseMimeType: "application/json" } 
            });
            
            const text = result.text || '[]';
            const data = JSON.parse(text);
            
            if (Array.isArray(data) && data.length > 0) {
                setKeywords(data);
            } else {
                throw new Error("AI tidak menghasilkan data valid.");
            }
        } catch (e) {
            console.error("Research Error", e);
            throw e; 
        } finally {
            setLoading(p => ({ ...p, researching: false }));
        }
    };

    const generateContent = async (title: string, narrative: string, type: string) => {
        setLoading(p => ({ ...p, generatingText: true }));
        try {
            const contentPrompt = `
            You are a Modern SEO Content Expert. Write an article about: "${title}".
            Language: Indonesian.
            Format: Markdown.
            Narrative Style: ${narrative === 'narsis' ? 'Personal (POV: Gue/Saya). Casual but expert.' : 'Professional (POV: Kami). Objective.'}
            Article Type: ${type}.
            Length: 800-1200 words.
            No preamble. Start content directly.
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            
            const metaPrompt = `
            Generate JSON Metadata for article "${title}". 
            1. "excerpt": Meta Description (max 160 chars).
            2. "category": Best fitting category.
            3. "readTime": Estimated reading time.
            Format: {"excerpt": "...", "category": "...", "readTime": "..."}
            `;
            const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
            const metaData = JSON.parse(metaRes.text || '{}');

            return { content: contentRes.text || '', meta: metaData };
        } finally {
            setLoading(p => ({ ...p, generatingText: false }));
        }
    };

    const getAIImageUrl = async (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        const enhancedPrompt = `editorial photography of ${prompt}, ${style} style, modern tech context, 8k, detailed, no text`;
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
        
        // Fetch as blob to upload
        const res = await fetch(pollUrl);
        const blob = await res.blob();
        
        // Use Supabase for temporary hosting (Hybrid Strategy)
        // If not connected, return the pollUrl directly
        if (!supabase) return pollUrl;

        try {
            // Convert blob to File object
            const file = new File([blob], `ai_gen_${seed}.jpg`, { type: "image/jpeg" });
            const { url } = await uploadToSupabase(file, 'ai-temp');
            return url;
        } catch(e) {
            console.error("Supabase upload failed, using direct link", e);
            return pollUrl;
        }
    };

    return { loading, setLoading, keywords, genConfig, setGenConfig, researchKeywords, generateContent, getAIImageUrl };
};

// --- MAIN HOOK: ARTICLE MANAGER ---
export const useArticleManager = (articles: Article[], setArticles: any) => {
    const filterLogic = useArticleFilter(articles, 7);
    const aiLogic = useAIGenerator();

    const [authorPersona, setAuthorPersona] = useState<AuthorPersona>(() => {
        try {
            const saved = localStorage.getItem('mks_author_pref');
            return saved ? JSON.parse(saved) : AUTHOR_PRESETS[0];
        } catch (e) { return AUTHOR_PRESETS[0]; }
    });

    useEffect(() => {
        try { localStorage.setItem('mks_author_pref', JSON.stringify(authorPersona)); } catch (e) {}
    }, [authorPersona]);

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: authorPersona.name,
        authorAvatar: '', uploadAuthorFile: null, 
        status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
    });

    const [aiStep, setAiStep] = useState(0);
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: '',
            author: authorPersona.name,
            authorAvatar: '', uploadAuthorFile: null, 
            readTime: '5 min read', imagePreview: '', uploadFile: null, 
            status: 'draft', scheduled_for: '',
            type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
        });
        setAiStep(0);
        setSelectedPresets([]);
    };

    const handleEditClick = (item: Article) => {
        setForm({
            id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
            category: item.category, 
            author: item.author,
            authorAvatar: '', uploadAuthorFile: null,
            readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'draft', // FORCE DEFAULT TO DRAFT IF NULL
            scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0,
            cluster_ideas: item.cluster_ideas || [], scheduleStart: ''
        });
        setAiStep(3); 
    };

    const updatePersonaAvatar = async (file: File) => {
        // ... (Avatar logic can use simple upload for now)
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            let supabasePath = '';
            let fileToMigrate: File | null = form.uploadFile;

            // --- HYBRID UPLOAD STRATEGY ---
            if (form.uploadFile && supabase) {
                // 1. Upload to Supabase (Fast)
                const { url, path } = await uploadToSupabase(form.uploadFile);
                finalImageUrl = url;
                supabasePath = path;
            }

            const now = new Date().toISOString();
            const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            const dbData = {
                title: form.title, 
                excerpt: form.excerpt || '', 
                content: form.content || '', 
                category: form.category || 'General',
                author: form.author, 
                read_time: form.readTime, 
                image_url: finalImageUrl,
                status: form.status || 'draft', // ENSURE STATUS IS SET
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type, 
                pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas,
                date: dateStr,
                created_at: now // CRITICAL FOR SORTING
            };

            let savedId = form.id;

            if (form.id) {
                // Update Local State Optimistically
                setArticles(articles.map(a => a.id === form.id ? { ...a, ...dbData, image: finalImageUrl } as any : a));
                
                if (supabase) {
                    await supabase.from('articles').update(dbData).eq('id', form.id);
                }
            } else {
                savedId = Date.now();
                // Add to Local State Optimistically
                setArticles([{ ...dbData, id: savedId, image: finalImageUrl } as any, ...articles]);
                
                if (supabase) {
                    const { data } = await supabase.from('articles').insert([dbData]).select().single();
                    if (data) savedId = data.id;
                }
            }

            // --- BACKGROUND MIGRATION ---
            // If we uploaded a file to Supabase, trigger the Cloudinary migration in background
            if (supabasePath && fileToMigrate && savedId) {
                // We don't await this, let it run in background
                processBackgroundMigration(fileToMigrate, supabasePath, 'articles', savedId, 'image_url')
                    .then((cloudUrl) => {
                        if (cloudUrl) {
                            // Update local state with new URL silently
                            setArticles((prev: any[]) => prev.map(a => a.id === savedId ? { ...a, image: cloudUrl } : a));
                        }
                    });
            }

            resetForm();
            // Don't alert blocking, just toast or console
            console.log("Artikel tersimpan!");
        } catch(e: any) {
            alert("Error: " + e.message);
        } finally {
            aiLogic.setLoading(p => ({ ...p, uploading: false }));
        }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel ini?")) return;
        setArticles(articles.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    // ... (rest of AI functions: runResearch, selectTopic, runWrite, runImage) -> pass through from aiLogic
    
    const runResearch = async () => {
        try { await aiLogic.researchKeywords(selectedPresets); setAiStep(1); } catch(e: any) { alert(e.message); }
    };
    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    const runWrite = async () => {
        try {
            const selectedPreset = AUTHOR_PRESETS.find(p => p.name === form.author) || authorPersona;
            const narrativeMode = selectedPreset.mode === 'personal' ? 'narsis' : 'umum';
            const { content, meta } = await aiLogic.generateContent(form.title, narrativeMode, form.type);
            setForm(p => ({ ...p, content, excerpt: meta.excerpt, category: meta.category, readTime: meta.readTime }));
            setAiStep(3); 
        } catch(e: any) { alert(e.message); }
    };
    const runImage = async () => {
        aiLogic.setLoading(p => ({ ...p, generatingImage: true }));
        try {
            const selectedPreset = AUTHOR_PRESETS.find(p => p.name === form.author) || authorPersona;
            const style = selectedPreset.mode === 'personal' ? 'cinematic' : 'corporate';
            const url = await aiLogic.getAIImageUrl(form.title, style);
            setForm(p => ({ ...p, imagePreview: url }));
        } catch(e) { console.error(e); }
        finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false })); }
    };

    return {
        form, setForm,
        filterLogic,
        aiLogic,
        authorPersona, setAuthorPersona, updatePersonaAvatar,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, keywords: aiLogic.keywords },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage }
    };
};
