
import { useState, useMemo, useEffect } from 'react';
import { Article, GalleryItem } from '../../types';
import { supabase, callGeminiWithRotation, slugify, renameFile, uploadToSupabase } from '../../utils';
import { AUTHOR_PRESETS, AuthorPersona, RESEARCH_TOPICS, ARTICLE_CATEGORIES, FilterType, KeywordData } from './types';

const ITEMS_PER_PAGE = 8;

export const useAiLogic = () => {
    const [loading, setLoading] = useState({
        researching: false,
        generatingText: false,
        generatingImage: false,
        uploading: false,
        progressMessage: ''
    });
    const [trendingTopics, setTrendingTopics] = useState<string[]>(RESEARCH_TOPICS);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);

    const analyzeMarket = async (type: 'pillar' | 'cluster', specificTopic?: string) => {
        setLoading(p => ({...p, researching: true, progressMessage: 'Analyzing Market Trends...'}));
        try {
            const prompt = `
            Role: SEO Strategist for 'Mesin Kasir Solo'.
            Task: Analyze current trends for POS/Kasir Systems & UMKM Business in Indonesia.
            Focus: ${type === 'pillar' ? 'Broad, evergreen topics (High Volume)' : 'Specific, long-tail problems (Low Competition)'}.
            Context: ${specificTopic || 'General Market'}.
            
            Output: JSON Array of 5 Keyword Objects.
            Format: [{"keyword": "...", "volume": "High/Med/Low", "competition": "High/Med/Low", "type": "Trend/Evergreen"}]
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(res.text || '[]');
            setKeywords(data);
        } catch (e) {
            console.error(e);
            // Fallback data
            setKeywords([
                { keyword: "Aplikasi Kasir Android Gratis", volume: "High", competition: "High", type: "Evergreen" },
                { keyword: "Cara Mengelola Stok Barang", volume: "Med", competition: "Med", type: "Evergreen" }
            ]);
        } finally {
            setLoading(p => ({...p, researching: false, progressMessage: ''}));
        }
    };

    const generateClusterIdeas = async (pillar: Article) => {
        setLoading(p => ({...p, researching: true, progressMessage: 'Brainstorming Clusters...'}));
        try {
            const prompt = `
            Pillar Content: "${pillar.title}"
            Task: Generate 5 specific "Cluster Content" ideas that support this pillar.
            Target: Internal Linking strategy.
            Output: JSON Array of strings (Titles only).
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(res.text || '[]');
            setKeywords(data.map((k: string) => ({ keyword: k, volume: 'N/A', competition: 'Low', type: 'Niche' })));
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({...p, researching: false, progressMessage: ''})); }
    };

    const generateContent = async (
        topic: string, 
        tones: string[], 
        type: string, 
        author: string, 
        wordCount: number,
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[],
        galleryContext?: string
    ) => {
        setLoading(p => ({...p, generatingText: true, progressMessage: 'Writing Article...'}));
        try {
            const toneStr = tones.join(', ');
            let contextPrompt = `Topic: "${topic}"\nType: ${type}\nAuthor Persona: ${author}\nTone: ${toneStr}\nTarget Length: ${wordCount} words.\nLanguage: Indonesian (Natural, Engaging).`;
            
            if (pillarContext) {
                contextPrompt += `\nSEO Context: This is a Cluster page for Pillar "${pillarContext.title}". You MUST include an internal link to /articles/${pillarContext.slug} in the intro or conclusion.`;
            }

            if (relatedPillarsData && relatedPillarsData.length > 0) {
                contextPrompt += `\nInter-linking: This is a Pillar page. Mention and recommend these related topics: ${relatedPillarsData.map(r => `${r.title} (/articles/${r.slug})`).join(', ')}.`;
            }

            if (galleryContext) {
                contextPrompt += `\nCase Study Reference (Use 1-2 if relevant): \n${galleryContext}`;
            }

            const prompt = `
            ${contextPrompt}
            
            Structure:
            1. H1 Title (Catchy, SEO optimized).
            2. Introduction (Hook the reader, state the problem).
            3. Body Paragraphs (Use H2, H3, Bullet points). Deep dive into the topic.
            4. Conclusion (Summary + Call to Action).
            
            STRICT RULES:
            - Output valid Markdown.
            - Use **bold** for key phrases.
            - No "Here is the article" preamble. Start with content.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-pro-preview', contents: prompt }); // Use Pro for writing
            const content = res.text || '';

            // Extract Meta
            const metaPrompt = `Extract meta from this content:\n${content.substring(0, 500)}...\nOutput JSON: { "excerpt": "2 sentences max", "category": "1-2 words", "readTime": "X min read" }`;
            const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
            const meta = JSON.parse(metaRes.text || '{}');

            return { content, meta };
        } catch (e) {
            throw e;
        } finally {
            setLoading(p => ({...p, generatingText: false, progressMessage: ''}));
        }
    };

    const getAIImageUrl = async (title: string, category: string, style: string) => {
        // Pollinations AI logic
        const seed = Math.floor(Math.random() * 999999);
        const prompt = `${title}, ${category}, ${style} style, professional photography, high quality, 4k, trending on unsplash`;
        const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1200&height=630&model=flux&nologo=true&seed=${seed}`;
        
        // Fetch blob to creating a File object for potential upload
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], `${slugify(title)}.jpg`, { type: 'image/jpeg' });
        
        return { url, file };
    };

    return { loading, setLoading, trendingTopics, keywords, analyzeMarket, generateClusterIdeas, generateContent, getAIImageUrl };
};

export const useArticleManager = (
    articles: Article[], 
    setArticles: (a: Article[]) => void,
    gallery: GalleryItem[]
) => {
    // 1. STATE
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        excerpt: '',
        content: '',
        category: 'Bisnis Tips',
        author: AUTHOR_PRESETS[0].name,
        authorAvatar: AUTHOR_PRESETS[0].avatar,
        uploadAuthorFile: null as File | null,
        readTime: '3 min read',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        imagePreview: '',
        uploadFile: null as File | null,
        status: 'draft' as 'draft' | 'published' | 'scheduled',
        scheduled_for: '',
        type: 'cluster' as 'pillar' | 'cluster',
        pillar_id: 0 as number,
        cluster_ideas: [] as string[],
        related_pillars: [] as number[],
        scheduleStart: '',
        targetWordCount: 800
    });

    const [activePersonaId, setActivePersonaId] = useState(AUTHOR_PRESETS[0].id);
    const [personas, setPersonas] = useState<AuthorPersona[]>(AUTHOR_PRESETS);
    const activePersona = personas.find(p => p.id === activePersonaId) || personas[0];

    // Sync form author when persona changes
    useEffect(() => {
        setForm(prev => ({
            ...prev,
            author: activePersona.name,
            authorAvatar: activePersona.avatar
        }));
    }, [activePersonaId, personas]);

    const updatePersonaAvatar = (file: File) => {
        const url = URL.createObjectURL(file);
        setPersonas(prev => prev.map(p => p.id === activePersonaId ? { ...p, avatar: url } : p));
        // Also update current form if it uses this persona
        if (form.author === activePersona.name) {
            setForm(prev => ({ ...prev, authorAvatar: url, uploadAuthorFile: file }));
        }
    };

    const [aiStep, setAiStep] = useState(0); // 0: Research, 1: Outline/Setup, 2: Done
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [selectedTones, setSelectedTones] = useState<string[]>(['Tutorial']);
    
    // Filter State
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [expandedPillarId, setExpandedPillarId] = useState<number | null>(null);

    // AI Logic Hook
    const aiLogic = useAiLogic();

    // 2. ACTIONS
    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: 'Bisnis Tips',
            author: activePersona.name, authorAvatar: activePersona.avatar, uploadAuthorFile: null,
            readTime: '3 min read', date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            imagePreview: '', uploadFile: null, status: 'draft', scheduled_for: '',
            type: 'cluster', pillar_id: 0, cluster_ideas: [], related_pillars: [],
            scheduleStart: '', targetWordCount: 800
        });
        setAiStep(0);
    };

    const handleEditClick = (article: Article) => {
        setForm({
            id: article.id,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            author: article.author,
            authorAvatar: article.author_avatar || '',
            uploadAuthorFile: null,
            readTime: article.readTime,
            date: article.date,
            imagePreview: article.image,
            uploadFile: null,
            status: (article.status as any) || 'draft',
            scheduled_for: article.scheduled_for || '',
            type: article.type || 'cluster',
            pillar_id: article.pillar_id || 0,
            cluster_ideas: article.cluster_ideas || [],
            related_pillars: article.related_pillars || [],
            scheduleStart: '',
            targetWordCount: article.content.split(' ').length || 800
        });
        setAiStep(2); // Jump to editor
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        aiLogic.setLoading(p => ({...p, uploading: true}));

        try {
            let finalImage = form.imagePreview;
            if (form.uploadFile) {
                // SEO Rename
                const seoName = `${slugify(form.title)}-cover`;
                const fileToUpload = renameFile(form.uploadFile, seoName);
                // Assume uploadToSupabase handles Cloudinary inside or we use it directly. 
                // Using the util we defined (which might handle SB or Cloudinary based on config)
                // For this component, we use the storage-service util:
                const { url } = await uploadToSupabase(fileToUpload, 'articles');
                finalImage = url;
            } else if (form.imagePreview && form.imagePreview.startsWith('blob:')) {
                 // If it's a blob from AI but no file object (shouldn't happen with current logic, but safe check)
                 // You might need to fetch blob and upload if file is missing
            }

            let finalAvatar = form.authorAvatar;
            if (form.uploadAuthorFile) {
                const seoName = `${slugify(form.author)}-avatar`;
                const fileToUpload = renameFile(form.uploadAuthorFile, seoName);
                const { url } = await uploadToSupabase(fileToUpload, 'avatars');
                finalAvatar = url;
            }

            const dbData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                author_avatar: finalAvatar,
                read_time: form.readTime,
                date: form.date,
                image_url: finalImage,
                status: form.status,
                scheduled_for: form.scheduled_for,
                type: form.type,
                pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas,
                related_pillars: form.related_pillars
            };

            if (form.id) {
                const updated = { ...articles.find(a => a.id === form.id)!, ...dbData, image: finalImage, id: form.id };
                setArticles(articles.map(a => a.id === form.id ? updated : a));
                if (supabase) await supabase.from('articles').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                const newItem = { ...dbData, id: newId, image: finalImage } as Article;
                setArticles([newItem, ...articles]);
                if (supabase) await supabase.from('articles').insert([dbData]);
            }
            alert("Artikel tersimpan!");
        } catch (e: any) {
            console.error(e);
            alert("Gagal menyimpan: " + e.message);
        } finally {
            aiLogic.setLoading(p => ({...p, uploading: false}));
        }
    };

    const deleteItem = async (id: number) => {
        if (!confirm("Hapus artikel ini?")) return;
        setArticles(articles.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    // --- AI RUNNERS ---
    const runResearch = async (specificTopic?: string) => { 
        try { 
            await aiLogic.analyzeMarket(form.type as 'pillar' | 'cluster', specificTopic); 
            setAiStep(1); 
        } catch(e: any) { alert(e.message); } 
    };

    const runGenerateCategory = async () => {
        if (!form.title && !form.content) return alert("Mohon isi Judul atau Konten terlebih dahulu sebagai konteks.");
        
        aiLogic.setLoading(p => ({ ...p, researching: true, progressMessage: 'Analyzing Category...' }));
        
        try {
            const contextText = form.content.length > 50 ? form.content.substring(0, 500) : form.title;
            const prompt = `
            Role: SEO Specialist for "Kasir Solo".
            Task: Suggest 1 highly relevant Article Category based on this context.
            Context: "${contextText}"
            
            Constraint:
            - Short (2-3 words).
            - Indonesian.
            - Title Case.
            - Examples: "Manajemen Stok", "Tips Bisnis", "Tutorial POS".
            
            Output: JUST the Category Name string.
            `;
            
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const newCat = result.text?.trim().replace(/['"]/g, '') || "";
            
            if (newCat) {
                setForm((prev: any) => {
                    const currentCats = prev.category ? prev.category.split(',').map((s: any) => s.trim()).filter(Boolean) : [];
                    if (!currentCats.includes(newCat)) {
                        return { ...prev, category: [...currentCats, newCat].join(', ') };
                    }
                    return prev;
                });
            }
        } catch (e: any) {
            console.error(e);
            alert("Gagal generate kategori.");
        } finally {
            aiLogic.setLoading(p => ({ ...p, researching: false, progressMessage: '' }));
        }
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

            // NEW: Prepare Gallery Context with IMAGE FILTER
            let galleryContextString = "";
            if (gallery && gallery.length > 0) {
                // Filter: Only include projects that have a valid image URL
                // We exclude items with no image or default placeholders to ensure visual quality
                const validProjects = gallery.filter(g => 
                    g.image_url && 
                    g.image_url.length > 10 &&
                    !g.image_url.includes('placeholder')
                );

                galleryContextString = validProjects.map(g => 
                    `- ${g.title} | ${g.category_type} | ImageURL: ${g.image_url} | /gallery/${slugify(g.title)}`
                ).join('\n');
            }

            const { content, meta } = await aiLogic.generateContent(
                form.title, selectedTones, form.type, form.author, form.targetWordCount, 
                pillarContext, relatedPillarsData, galleryContextString // PASS CONTEXT
            ); 
            
            setForm(p => ({ 
                ...p, content, excerpt: meta.excerpt, 
                category: p.category && p.category.length > 2 ? p.category : meta.category, 
                readTime: meta.readTime 
            })); 
            setAiStep(2); 
        } catch(e: any) { alert(e.message); } 
    };
    
    // UPDATED RUN IMAGE HANDLER TO ACCEPT FILE
    const runImage = async () => { 
        aiLogic.setLoading(p => ({ ...p, generatingImage: true, progressMessage: 'Generating AI Image...' })); 
        try { 
            const style = activePersona.mode === 'personal' ? 'cinematic' : 'corporate'; 
            // Pass Category for better context
            const { url, file } = await aiLogic.getAIImageUrl(form.title, form.category, style); 
            
            // Set both Preview URL and Upload File (for SEO filename upload later)
            setForm(p => ({ ...p, imagePreview: url, uploadFile: file })); 
        } catch(e) {
            console.error(e);
        } finally { 
            aiLogic.setLoading(p => ({ ...p, generatingImage: false, progressMessage: '' })); 
        } 
    };

    // 3. FILTERING
    const filteredList = useMemo(() => {
        let list = articles;
        if (filterType === 'pillar') list = list.filter(a => a.type === 'pillar');
        else if (filterType === 'cluster') list = list.filter(a => a.type === 'cluster');
        else if (filterType === 'orphan') list = list.filter(a => a.type !== 'pillar' && !a.pillar_id);
        else if (filterType === 'draft') list = list.filter(a => a.status === 'draft');
        else if (filterType === 'scheduled') list = list.filter(a => a.status === 'scheduled');

        if (searchTerm) {
            list = list.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return list;
    }, [articles, filterType, searchTerm]);

    const paginatedList = useMemo(() => {
        return filteredList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    }, [filteredList, page]);

    return {
        form, setForm, 
        filterLogic: { filterType, setFilterType, searchTerm, setSearchTerm, paginatedList, page, setPage, expandedPillarId, setExpandedPillarId, actions: { handleEditClick, deleteItem, runClusterResearch } },
        aiLogic, // Expose aiLogic fully
        personas, activePersonaId, setActivePersonaId, updatePersonaAvatar,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, trendingTopics: aiLogic.trendingTopics, keywords: aiLogic.keywords, selectedTones, setSelectedTones },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage, runClusterResearch, runGenerateCategory }
    };
};
