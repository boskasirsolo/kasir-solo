
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona } from './types';

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

            if (filterType === 'all') {
                const isPillar = a.type === 'pillar';
                const isOrphan = !a.pillar_id && a.type !== 'pillar'; 
                return isPillar || isOrphan;
            }
            if (filterType === 'pillar') return a.type === 'pillar';
            if (filterType === 'cluster') return a.type === 'cluster';
            if (filterType === 'orphan') return !a.pillar_id && a.type !== 'pillar';
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
            Criteria:
            1. Search Volume: High / Trending.
            2. Competition: Low to Medium (Easy to rank).
            3. Intent: Transactional or Informational.
            4. Language: Indonesian.
            
            Strict Output Format: JSON Array ONLY. No markdown, no explanation.
            Example:
            [
              {"keyword": "Cara Mengelola Karyawan Shift Malam", "volume": "High", "competition": "Low", "type": "Evergreen"},
              {"keyword": "Aplikasi Kasir Gratis vs Berbayar", "volume": "Very High", "competition": "Medium", "type": "Comparison"}
            ]
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
            Write a complete SEO Article.
            Title: "${title}"
            Language: Indonesian.
            Format: Markdown.
            Structure:
            - H1 Title
            - Introduction (Hook the reader)
            - H2 Subheadings (Use LSI Keywords)
            - Bullet points for readability
            - Conclusion & Call to Action (Soft sell POS System).
            
            Narrative Style: ${narrative === 'narsis' ? 'Personal (POV: Gue/Saya), opinionated, storytelling from a business owner perspective.' : 'Professional (POV: Kami/Kita), objective, educational, corporate tone.'}
            Article Type: ${type} (Pillar or Cluster).
            Length: 800-1000 words.
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            
            const metaPrompt = `Generate JSON Metadata for an article with title "${title}". Format: {"excerpt": "...", "category": "...", "readTime": "..."}`;
            const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
            const metaData = JSON.parse(metaRes.text || '{}');

            return { content: contentRes.text || '', meta: metaData };
        } finally {
            setLoading(p => ({ ...p, generatingText: false }));
        }
    };

    const getAIImageUrl = (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        let cleanPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 80).trim();
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt + ' ' + style)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
    };

    return { loading, setLoading, keywords, genConfig, setGenConfig, researchKeywords, generateContent, getAIImageUrl };
};

// --- MAIN HOOK: ARTICLE MANAGER ---
export const useArticleManager = (articles: Article[], setArticles: (a: Article[]) => void) => {
    // 1. Logic Integration
    const filterLogic = useArticleFilter(articles, 7); // 7 Items per page
    const aiLogic = useAIGenerator();

    // 2. Global Author State (Lifted Up)
    const [authorPersona, setAuthorPersona] = useState<AuthorPersona>({
        name: 'Amin Maghfuri',
        role: 'Founder, CEO',
        mode: 'personal'
    });

    // 3. Form State
    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: '', authorAvatar: '', uploadAuthorFile: null, // Legacy fields kept for TS, but controlled by Persona
        status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
    });

    const [aiStep, setAiStep] = useState(0);
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

    // 4. Actions
    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: '',
            author: '', authorAvatar: '', uploadAuthorFile: null, 
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
            author: item.author, authorAvatar: '', uploadAuthorFile: null,
            readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'published', scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0,
            cluster_ideas: item.cluster_ideas || [], scheduleStart: ''
        });
        setAiStep(3); // Go directly to editor
    };

    const saveArticle = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            
            // Upload Logic (Simplified)
            if (form.uploadFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                finalImageUrl = data.secure_url;
            }

            const dbData = {
                title: form.title, 
                excerpt: form.excerpt, 
                content: form.content, 
                category: form.category,
                author: authorPersona.name, // Use Global Persona
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
            // Use Global Persona Narrative Mode
            const narrativeMode = authorPersona.mode === 'personal' ? 'narsis' : 'umum';
            const { content, meta } = await aiLogic.generateContent(form.title, narrativeMode, form.type);
            setForm(p => ({ ...p, content, excerpt: meta.excerpt, category: meta.category, readTime: meta.readTime }));
            setAiStep(3); 
        } catch(e: any) { alert(e.message); }
    };

    const runImage = async () => {
        aiLogic.setLoading(p => ({ ...p, generatingImage: true }));
        try {
            const style = authorPersona.mode === 'personal' ? 'cinematic' : 'corporate';
            const url = aiLogic.getAIImageUrl(form.title, style);
            setForm(p => ({ ...p, imagePreview: url }));
        } catch(e) { console.error(e); }
        finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false })); }
    };

    return {
        form, setForm,
        filterLogic,
        aiLogic,
        // Expose Persona State
        authorPersona, setAuthorPersona,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, keywords: aiLogic.keywords },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage }
    };
};
