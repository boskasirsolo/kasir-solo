
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation } from '../../utils';
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
            if (filterType === 'draft') return a.status === 'draft';
            if (filterType === 'scheduled') return a.status === 'scheduled';
            return false;
        });
    }, [articles, searchTerm, filterType]);

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);
    const paginatedList = filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return {
        searchTerm, setSearchTerm,
        filterType, setFilterType,
        page, setPage,
        totalPages,
        paginatedList,
        expandedPillarId, setExpandedPillarId
    };
};

// --- HELPER: Cloudinary Upload ---
const uploadToCloudinary = async (fileOrBlob: File | Blob) => {
    if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Cloudinary Config Missing");
    const formData = new FormData();
    formData.append('file', fileOrBlob);
    formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
    if (!res.ok) throw new Error("Upload Failed");
    const data = await res.json();
    return data.secure_url;
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
            
            CRITICAL "NO-FLUFF" RULES:
            1. **NO INTRODUCTIONS**: Do NOT start with "Pada artikel ini...", "Selamat datang...", "Tahukah Anda...". Start DIRECTLY with the core definition or answer.
            2. **NO CONCLUSIONS**: Do NOT end with "Kesimpulannya...", "Semoga bermanfaat...". End with a strong Call to Action (CTA) or a final punchline.
            3. **Google Snippet Optimized**: The first paragraph must be a direct, concise answer (40-60 words) defining the main topic.
            4. **Structure**: Use H2 and H3 for subheadings. Use bullet points for readability.
            5. **Experience (E-E-A-T)**: Include specific examples, data, or technical details about POS systems/Business.
            
            Narrative Style: ${narrative === 'narsis' ? 'Personal (POV: Gue/Saya as Business Owner). Honest, direct, slightly opinionated.' : 'Professional (POV: Kami). Objective, authoritative, data-driven.'}
            Article Type: ${type} (Structure for ${type === 'pillar' ? 'Broad coverage & Definitions' : 'Specific depth & actionable steps'}).
            Length: 800-1200 words.
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            
            // Meta Prompt also updated for SEO focus
            const metaPrompt = `
            Generate JSON Metadata for article "${title}". 
            1. "excerpt": A compelling Meta Description (max 160 chars). Must include the main keyword. No clickbait, just value.
            2. "category": Best fitting category (Business/Tech/Marketing).
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
        // 1. Generate URL from Pollinations with Modern SEO Prompt Engineering
        const seed = Math.floor(Math.random() * 9999999);
        
        // Clean the prompt to be visual-focused
        let visualPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 100).trim();
        
        // Modern SEO Image Prompt: Clean, High Contrast, Contextual, No Text
        const enhancedPrompt = `editorial photography of ${visualPrompt}, ${style} style, modern office context or point of sale technology, shallow depth of field, 8k resolution, highly detailed, professional lighting, NO TEXT, NO WORDS, minimalist composition`;
        
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
        
        // 2. Fetch the image as Blob
        const res = await fetch(pollUrl);
        const blob = await res.blob();

        // 3. Upload to Cloudinary
        const cloudUrl = await uploadToCloudinary(blob);
        return cloudUrl;
    };

    return { loading, setLoading, keywords, genConfig, setGenConfig, researchKeywords, generateContent, getAIImageUrl, uploadToCloudinary };
};

// --- MAIN HOOK: ARTICLE MANAGER ---
export const useArticleManager = (articles: Article[], setArticles: (a: Article[]) => void) => {
    // 1. Logic Integration
    const filterLogic = useArticleFilter(articles, 7); // 7 Items per page
    const aiLogic = useAIGenerator();

    // 2. Global Author State (Lifted Up & Persistent)
    const [authorPersona, setAuthorPersona] = useState<AuthorPersona>(() => {
        // Init from LocalStorage or Default to Personal
        try {
            const saved = localStorage.getItem('mks_author_pref');
            return saved ? JSON.parse(saved) : AUTHOR_PRESETS[0];
        } catch (e) {
            return AUTHOR_PRESETS[0];
        }
    });

    // Save to LocalStorage whenever persona changes
    useEffect(() => {
        try {
            localStorage.setItem('mks_author_pref', JSON.stringify(authorPersona));
        } catch (e) { console.error("LS Error", e); }
    }, [authorPersona]);

    // 3. Form State
    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: authorPersona.name, // Init with current global persona
        authorAvatar: '', uploadAuthorFile: null, 
        status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
    });

    const [aiStep, setAiStep] = useState(0);
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

    // 4. Actions
    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: '',
            author: authorPersona.name, // Reset uses CURRENT active persona
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
            author: item.author, // Use saved author from DB
            authorAvatar: '', uploadAuthorFile: null,
            readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'published', scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0,
            cluster_ideas: item.cluster_ideas || [], scheduleStart: ''
        });
        setAiStep(3); // Go directly to editor
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({...p, uploading: true}));
        try {
            const url = await aiLogic.uploadToCloudinary(file);
            // Update global persona state (which updates LS via useEffect)
            setAuthorPersona(prev => ({ ...prev, avatar: url }));
        } catch(e: any) {
            alert("Gagal upload avatar: " + e.message);
        } finally {
            aiLogic.setLoading(p => ({...p, uploading: false}));
        }
    };

    const saveArticle = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            
            // Manual Image Upload
            if (form.uploadFile) {
                finalImageUrl = await aiLogic.uploadToCloudinary(form.uploadFile);
            }

            const dbData = {
                title: form.title, 
                excerpt: form.excerpt, 
                content: form.content, 
                category: form.category,
                // CRITICAL: Use the form's author field, which might be different from global persona
                author: form.author, 
                read_time: form.readTime, 
                image_url: finalImageUrl,
                status: form.status, 
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type, 
                pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas
            };

            if (form.id) {
                setArticles(articles.map(a => a.id === form.id ? { ...a, ...dbData, image: finalImageUrl } as any : a));
                if (supabase) await supabase.from('articles').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setArticles([{ ...dbData, id: newId, image: finalImageUrl } as any, ...articles]);
                if (supabase) await supabase.from('articles').insert([dbData]);
            }
            resetForm();
            alert("Berhasil disimpan!");
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

    const runResearch = async () => {
        try {
            await aiLogic.researchKeywords(selectedPresets);
            setAiStep(1); 
        } catch(e: any) { alert(e.message); }
    };

    const selectTopic = (k: any) => {
        setForm(p => ({ ...p, title: k.keyword }));
        setAiStep(2); 
    };

    const runWrite = async () => {
        try {
            // Determine narrative based on SELECTED form author, matching it back to presets
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
            // Style based on selected author
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
        // Expose Persona State & Actions
        authorPersona, setAuthorPersona, updatePersonaAvatar,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, keywords: aiLogic.keywords },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage }
    };
};
