
import { useState, useMemo, useEffect } from 'react';
import { Article, GalleryItem, SiteConfig } from '../../types';
import { supabase, uploadToSupabase, processBackgroundMigration, slugify, renameFile, convertLocalToUTC, convertUTCToLocal, callGeminiWithRotation } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS } from './types';
import { VisionAI } from '../../services/ai/vision';
import { EditorAI } from '../../services/ai/editor';

// PARSE VOLUME UTILS
const parseVolume = (volStr: string): number => {
    if (!volStr) return 0;
    try {
        let clean = volStr.toLowerCase().replace(/\/mo/g, '').replace(/vol/g, '').trim();
        if (clean.includes('k')) {
            clean = clean.replace('k', '').trim().replace(',', '.');
            const numPart = parseFloat(clean);
            return isNaN(numPart) ? 0 : Math.round(numPart * 1000);
        }
        clean = clean.replace(/[\.,]/g, '');
        const num = parseInt(clean);
        return isNaN(num) ? 0 : num;
    } catch (e) { return 0; }
};

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

export const useAIGenerator = () => {
    const [loading, setLoading] = useState({ 
        researching: false, 
        generatingText: false, 
        generatingImage: false, 
        uploading: false, 
        progressMessage: '' 
    });
    const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    
    // REFACTORED: Using EditorAI Service
    const analyzeMarket = async (articleType: 'pillar' | 'cluster', specificTopic?: string) => {
        setLoading(p => ({ ...p, researching: true, progressMessage: 'Scanning Market...' }));
        try {
            const rawData = await EditorAI.researchTopics(articleType, specificTopic);
            if (Array.isArray(rawData)) {
                const filteredData = rawData.filter((item: any) => {
                    const comp = (item.competition || '').toLowerCase();
                    return comp !== 'high' && !comp.includes('high'); 
                });
                setKeywords(filteredData.sort((a: any, b: any) => parseVolume(b.volume) - parseVolume(a.volume)));
            }
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };

    const generateClusterIdeas = async (pillar: Article) => {
        setLoading(p => ({ ...p, researching: true, progressMessage: 'Generating Cluster Topics...' }));
        setKeywords([]);
        try {
            const rawData = await EditorAI.generateClusters(pillar.title);
            if (Array.isArray(rawData)) {
                setKeywords(rawData.sort((a: any, b: any) => parseVolume(b.volume) - parseVolume(a.volume)));
            }
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };

    return { loading, setLoading, trendingTopics, keywords, analyzeMarket, generateClusterIdeas };
};

export const useArticleManager = (articles: Article[], setArticles: any, gallery: GalleryItem[] = [], config?: SiteConfig) => {
    const filterLogic = useArticleFilter(articles, 7);
    const aiLogic = useAIGenerator();

    const [personas, setPersonas] = useState<AuthorPersona[]>(() => {
        try { return JSON.parse(localStorage.getItem('mks_personas') || '') || AUTHOR_PRESETS; } catch (e) { return AUTHOR_PRESETS; }
    });
    const [activePersonaId, setActivePersonaId] = useState<string>('personal');
    const activePersona = personas.find(p => p.id === activePersonaId) || personas[0];
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']); 

    const [socialCaption, setSocialCaption] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState({ instagram: true, facebook: true, linkedin: false });
    const [socialLoading, setSocialLoading] = useState({ generating: false, posting: false });

    useEffect(() => { try { localStorage.setItem('mks_personas', JSON.stringify(personas)); } catch (e) {} }, [personas]);

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: activePersona.name, authorAvatar: activePersona.avatar || '',
        uploadAuthorFile: null, status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        targetWordCount: 1000,
        related_pillars: [],
        generationContext: ''
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
            related_pillars: [],
            generationContext: ''
        });
        setSocialCaption(''); 
        setAiStep(0); setSelectedPresets([]); setSelectedTones(['gritty']);
    };

    const handleEditClick = (item: Article) => {
        const matchedPersona = personas.find(p => item.author.includes(p.name));
        if (matchedPersona) setActivePersonaId(matchedPersona.id);
        const estimatedCount = item.content ? item.content.split(/\s+/).length : 1000;

        let formattedSchedule = '';
        if (item.scheduled_for && config?.timezone) {
            formattedSchedule = convertUTCToLocal(item.scheduled_for, config.timezone);
        } else if (item.scheduled_for) {
            formattedSchedule = item.scheduled_for.slice(0, 16); 
        }

        setForm({
            id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
            category: item.category, author: item.author, authorAvatar: item.author_avatar || activePersona.avatar || '', 
            uploadAuthorFile: null, readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'draft', 
            scheduled_for: formattedSchedule, 
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0, cluster_ideas: item.cluster_ideas || [], scheduleStart: '',
            date: item.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            targetWordCount: estimatedCount,
            related_pillars: item.related_pillars || [],
            generationContext: (item as any).generation_context || ''
        });
        setSocialCaption(''); 
        setAiStep(2);
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Uploading Avatar...' }));
        try {
            let avatarUrl = URL.createObjectURL(file);
            // SEO INJECTION
            const seoName = `${slugify(activePersona.name)}-author-avatar-mesin-kasir-solo`;
            const fileToUpload = renameFile(file, seoName);

            if (supabase) {
                const { url } = await uploadToSupabase(fileToUpload, 'avatars');
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

            if (form.uploadFile) {
                // SEO INJECTION
                const seoName = `${slugify(form.title)}-artikel-cover-mesin-kasir-solo`;
                fileToMigrate = renameFile(form.uploadFile, seoName);

                if (supabase) {
                    const { url, path } = await uploadToSupabase(fileToMigrate);
                    finalImageUrl = url;
                    supabasePath = path;
                }
            }

            const now = new Date().toISOString();
            const dateStr = form.date || new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
            const finalAuthorAvatar = form.authorAvatar || activePersona.avatar;
            const statusNormalized = (form.status || 'draft').toLowerCase().trim();

            let finalScheduledFor = null;
            if (form.status === 'scheduled' && form.scheduled_for) {
                if (config?.timezone) {
                    finalScheduledFor = convertLocalToUTC(form.scheduled_for, config.timezone);
                } else {
                    const localDate = new Date(form.scheduled_for); 
                    finalScheduledFor = localDate.toISOString(); 
                }
            }

            const commonData = {
                title: form.title, excerpt: form.excerpt || '', content: form.content || '', 
                category: form.category || 'General', author: form.author, author_avatar: finalAuthorAvatar, 
                read_time: form.readTime, image_url: finalImageUrl, status: statusNormalized as any,
                scheduled_for: finalScheduledFor, 
                type: form.type, pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas, 
                date: dateStr, 
                related_pillars: form.related_pillars,
                generation_context: form.generationContext
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

    const runResearch = async (specificTopic?: string) => { 
        try { 
            await aiLogic.analyzeMarket(form.type as 'pillar' | 'cluster', specificTopic); 
            setAiStep(1); 
        } catch(e: any) { alert(e.message); } 
    };

    const runGenerateCategory = async () => {
        if (!form.title && !form.content) return alert("Mohon isi Judul atau Konten terlebih dahulu sebagai konteks.");
        aiLogic.setLoading(p => ({ ...p, researching: true, progressMessage: 'Brainstorming Categories...' }));
        try {
            const contextText = form.content.length > 50 ? form.content.substring(0, 500) : form.title;
            const newCatsString = await EditorAI.suggestCategories(contextText);
            if (newCatsString) {
                setForm((prev: any) => {
                    const currentCats = prev.category ? prev.category.split(',').map((s: any) => s.trim()).filter(Boolean) : [];
                    const newCats = newCatsString.split(',').map(s => s.trim());
                    const uniqueCats = [...currentCats];
                    newCats.forEach(newC => {
                        const exists = uniqueCats.some(existing => existing.toLowerCase() === newC.toLowerCase());
                        if (!exists) uniqueCats.push(newC);
                    });
                    return { ...prev, category: uniqueCats.join(', ') };
                });
            }
        } catch (e: any) { console.error(e); alert("Gagal generate kategori."); } 
        finally { aiLogic.setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
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
                related_pillars: [],
                generationContext: ''
            });
            setAiStep(1); 
            await aiLogic.generateClusterIdeas(pillar); 
        } catch(e: any) { alert(e.message); } 
    };

    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    
    const runWrite = async () => { 
        try { 
            aiLogic.setLoading(p => ({ ...p, generatingText: true, progressMessage: 'Writing Article...' }));
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

            let galleryContextString = "";
            if (gallery && gallery.length > 0) {
                const validProjects = gallery.filter(g => 
                    g.image_url && g.image_url.length > 10 && !g.image_url.includes('placeholder')
                );
                galleryContextString = validProjects.map(g => 
                    `- ${g.title} | ${g.category_type} | ImageURL: ${g.image_url} | /gallery/${slugify(g.title)}`
                ).join('\n');
            }

            const content = await EditorAI.writeArticle(
                form.title, selectedTones, form.type, form.author, form.targetWordCount,
                pillarContext, relatedPillarsData, galleryContextString, form.generationContext
            );
            
            const meta = await EditorAI.generateMeta(form.title, content);
            const generatedWordCount = content.split(/\s+/).length;
            const readTimeMin = Math.ceil(generatedWordCount / 200);

            setForm(p => ({ 
                ...p, content, excerpt: meta.excerpt, 
                category: p.category && p.category.length > 2 ? p.category : meta.category, 
                readTime: `${readTimeMin} min read` 
            })); 
            setAiStep(2); 
        } catch(e: any) { alert(e.message); }
        finally { aiLogic.setLoading(p => ({ ...p, generatingText: false, progressMessage: '' })); }
    };
    
    // REFACTORED: Using VisionAI Service
    const runImage = async () => { 
        aiLogic.setLoading(p => ({ ...p, generatingImage: true, progressMessage: 'Generating AI Image...' })); 
        try { 
            const style = activePersona.mode === 'personal' ? 'cinematic' : 'corporate'; 
            const { url, file } = await VisionAI.generate(form.title, form.category, style); 
            setForm(p => ({ ...p, imagePreview: url, uploadFile: file })); 
        } catch(e) { console.error(e); } 
        finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false, progressMessage: '' })); } 
    };

    const generateSocialCaption = async () => {
        if (!form.title) return alert("Judul artikel wajib diisi.");
        setSocialLoading(p => ({ ...p, generating: true }));
        try {
            const context = form.excerpt || form.content.substring(0, 300) || form.title;
            const prompt = `Role: Social Media Manager. Task: Write a viral caption to promote this article: "${form.title}". Context: ${context}. Style: Professional but engaging. Call to Action: "Baca selengkapnya". Hashtags: #Bisnis #UMKM #KasirSolo. Output: JUST the caption.`;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setSocialCaption(res.text?.trim() || '');
        } catch(e) { alert("Gagal generate caption."); }
        finally { setSocialLoading(p => ({ ...p, generating: false })); }
    };

    const broadcastArticle = async () => {
        if (!form.title) return alert("Simpan artikel terlebih dahulu untuk broadcast.");
        if (!socialCaption) return alert("Caption tidak boleh kosong.");
        if (form.imagePreview.startsWith('blob:')) return alert("Gambar cover masih lokal. Simpan artikel dulu.");
        if (!form.imagePreview) return alert("Artikel harus punya cover image.");

        const activePlatforms = Object.entries(selectedPlatforms).filter(([_, isActive]) => isActive).map(([key]) => key);
        if (activePlatforms.length === 0) return alert("Pilih minimal 1 platform.");

        setSocialLoading(p => ({ ...p, posting: true }));
        try {
            const response = await fetch('/api/ayrshare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ caption: socialCaption, image_url: form.imagePreview, platforms: activePlatforms })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Gagal broadcast");
            alert(`Sukses! Broadcast terkirim ke: ${activePlatforms.join(', ')}.`);
        } catch(e: any) { console.error("Broadcast Error:", e); alert(`Gagal broadcast: ${e.message}`); } 
        finally { setSocialLoading(p => ({ ...p, posting: false })); }
    };

    return {
        form, setForm, filterLogic, aiLogic, personas, activePersonaId, setActivePersonaId, updatePersonaAvatar,
        socialState: { socialCaption, setSocialCaption, selectedPlatforms, setSelectedPlatforms, socialLoading },
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, trendingTopics: aiLogic.trendingTopics, keywords: aiLogic.keywords, selectedTones, setSelectedTones },
        actions: { 
            resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage, runClusterResearch, runGenerateCategory,
            generateSocialCaption, broadcastArticle 
        }
    };
};
