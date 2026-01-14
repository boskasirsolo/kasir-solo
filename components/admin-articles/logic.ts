
import { useState, useMemo, useEffect } from 'react';
import { Article, GalleryItem, SiteConfig } from '../../types';
import { supabase, uploadToSupabase, processBackgroundMigration, slugify, renameFile, convertLocalToUTC, convertUTCToLocal, callGeminiWithRotation } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS } from './types';
import { VisionAI } from '../../services/ai/vision';
import { EditorAI } from '../../services/ai/editor';
import { CityTarget } from '../admin-seo/types';

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
    const [cities, setCities] = useState<CityTarget[]>([]);
    
    // NEW: State untuk navigasi mobile
    const [activeMobilePane, setActiveMobilePane] = useState<'LIST' | 'CONFIG' | 'WRITE'>('LIST');

    useEffect(() => {
        const fetchCities = async () => {
            if (!supabase) return;
            const { data } = await supabase.from('target_cities').select('*').order('name', { ascending: true });
            if (data) setCities(data);
        };
        fetchCities();
    }, []);

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
        generationContext: '',
        targetCityId: 0
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
            generationContext: '',
            targetCityId: 0
        });
        setSocialCaption(''); 
        setAiStep(0); setSelectedPresets([]); setSelectedTones(['gritty']);
        setActiveMobilePane('CONFIG'); // Langsung ke setting pas buat baru
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
            generationContext: (item as any).generation_context || '',
            targetCityId: (item as any).target_city_id || 0
        });
        setSocialCaption(''); 
        setAiStep(2);
        setActiveMobilePane('WRITE'); // Langsung ke editor pas edit
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Uploading Avatar...' }));
        try {
            let avatarUrl = URL.createObjectURL(file);
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
        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Saving Article...' }));
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            let supabasePath = '';
            let fileToMigrate: File | null = form.uploadFile;

            if (form.uploadFile) {
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
            let finalScheduledFor = null;
            if (form.status === 'scheduled' && form.scheduled_for) {
                finalScheduledFor = config?.timezone ? convertLocalToUTC(form.scheduled_for, config.timezone) : new Date(form.scheduled_for).toISOString();
            }

            const commonData = {
                title: form.title, excerpt: form.excerpt || '', content: form.content || '', 
                category: form.category || 'General', author: form.author, author_avatar: form.authorAvatar || activePersona.avatar, 
                read_time: form.readTime, image_url: finalImageUrl, status: (form.status || 'draft') as any,
                scheduled_for: finalScheduledFor, type: form.type, pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas, date: dateStr, related_pillars: form.related_pillars,
                generation_context: form.generationContext,
                target_city_id: form.targetCityId !== 0 ? form.targetCityId : null
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
            setActiveMobilePane('LIST'); // Balik ke list abis save
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
                        if (!uniqueCats.some(existing => existing.toLowerCase() === newC.toLowerCase())) uniqueCats.push(newC);
                    });
                    return { ...prev, category: uniqueCats.join(', ') };
                });
            }
        } catch (e: any) { alert("Gagal generate kategori."); } 
        finally { aiLogic.setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };
    
    const runClusterResearch = async (pillar: Article) => { 
        try { 
            setForm(prev => ({ ...prev, id: null, title: '', excerpt: '', content: '', category: pillar.category, pillar_id: pillar.id, type: 'cluster' }));
            setAiStep(1); 
            await aiLogic.generateClusterIdeas(pillar); 
        } catch(e: any) { alert(e.message); } 
    };

    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    
    const runWrite = async () => { 
        try { 
            aiLogic.setLoading(p => ({ ...p, generatingText: true, progressMessage: 'Writing Article...' }));
            const pillarContext = form.pillar_id ? articles.find(a => a.id === form.pillar_id) : undefined;
            const cityContext = form.targetCityId ? cities.find(c => c.id === form.targetCityId) : undefined;

            const content = await EditorAI.writeArticle(
                form.title, selectedTones, form.type, form.author, form.targetWordCount,
                pillarContext ? { title: pillarContext.title, slug: slugify(pillarContext.title) } : undefined,
                undefined, undefined, form.generationContext,
                cityContext ? { name: cityContext.name, type: cityContext.type } : undefined
            );
            
            const meta = await EditorAI.generateMeta(form.title, content);
            const wordCount = content.split(/\s+/).length;

            setForm(p => ({ ...p, content, excerpt: meta.excerpt, category: p.category.length > 2 ? p.category : meta.category, readTime: `${Math.ceil(wordCount / 200)} min read` })); 
            setAiStep(2); 
            setActiveMobilePane('WRITE'); // Auto pindah ke editor abis AI nulis
        } catch(e: any) { alert(e.message); }
        finally { aiLogic.setLoading(p => ({ ...p, generatingText: false, progressMessage: '' })); }
    };
    
    const runImage = async () => { 
        aiLogic.setLoading(p => ({ ...p, generatingImage: true, progressMessage: 'Generating AI Image...' })); 
        try { 
            const style = activePersona.mode === 'personal' ? 'cinematic' : 'corporate'; 
            const { url, file } = await VisionAI.generate(form.title, form.category, style); 
            setForm(p => ({ ...p, imagePreview: url, uploadFile: file })); 
        } catch(e) { console.error(e); } 
        finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false, progressMessage: '' })); } 
    };

    return {
        form, setForm, filterLogic, aiLogic, personas, activePersonaId, setActivePersonaId, updatePersonaAvatar,
        activeMobilePane, setActiveMobilePane, // EXPORT BARU
        socialState: { socialCaption, setSocialCaption, selectedPlatforms, setSelectedPlatforms, socialLoading },
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, trendingTopics: aiLogic.trendingTopics, keywords: aiLogic.keywords, selectedTones, setSelectedTones, cities },
        actions: { 
            resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage, runClusterResearch, runGenerateCategory,
            generateSocialCaption: async () => {}, broadcastArticle: async () => {} 
        }
    };
};
