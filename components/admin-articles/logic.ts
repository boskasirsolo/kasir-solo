
import { useState, useMemo, useEffect } from 'react';
import { Article, GalleryItem, SiteConfig, Product } from '../../types';
import { supabase, uploadToSupabase, processBackgroundMigration, slugify, renameFile, convertLocalToUTC, convertUTCToLocal } from '../../utils';
import { KeywordData, ArticleFormState, FilterType } from './types';
import { VisionAI } from '../../services/ai/vision';
import { EditorAI } from '../../services/ai/editor';
import { CityTarget } from '../admin-seo/types';

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
            return dateB - dateA;
        });
    }, [filteredList]);

    return { searchTerm, setSearchTerm, filterType, setFilterType, page, setPage, totalPages: Math.ceil(sortedList.length / itemsPerPage), paginatedList: sortedList.slice((page - 1) * itemsPerPage, page * itemsPerPage), expandedPillarId, setExpandedPillarId };
};

export const useArticleManager = (articles: Article[], setArticles: any, gallery: GalleryItem[] = [], config?: SiteConfig, products: Product[] = []) => {
    const filterLogic = useArticleFilter(articles, 7);
    const [loading, setLoading] = useState({ researching: false, generatingText: false, generatingImage: false, uploading: false, progressMessage: '' });
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [cities, setCities] = useState<CityTarget[]>([]);
    const [activeMobilePane, setActiveMobilePane] = useState<'LIST' | 'CONFIG' | 'WRITE'>('LIST');
    const [aiStep, setAiStep] = useState(0);
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']);

    useEffect(() => {
        if (supabase) supabase.from('target_cities').select('*').order('name', { ascending: true }).then(({data}) => data && setCities(data));
    }, []);

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: "Amin Maghfuri", authorAvatar: config?.founderPortrait || "",
        uploadAuthorFile: null, status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '',
        date: new Date().toLocaleDateString('id-ID'),
        targetWordCount: 1000, related_pillars: [], generationContext: '', targetCityId: 0
    });

    const resetForm = () => {
        setForm({ id: null, title: '', excerpt: '', content: '', category: '', author: "Amin Maghfuri", authorAvatar: config?.founderPortrait || '', uploadAuthorFile: null, readTime: '5 min read', imagePreview: '', uploadFile: null, status: 'draft', scheduled_for: '', type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '', date: new Date().toLocaleDateString('id-ID'), targetWordCount: 1000, related_pillars: [], generationContext: '', targetCityId: 0 });
        setAiStep(0); setSelectedTones(['gritty']); setActiveMobilePane('CONFIG');
    };

    const handleEditClick = (item: Article) => {
        setForm({ ...item, id: item.id, authorAvatar: item.author_avatar || config?.founderPortrait || '', imagePreview: item.image, targetWordCount: item.content ? item.content.split(/\s+/).length : 1000, scheduled_for: item.scheduled_for ? (config?.timezone ? convertUTCToLocal(item.scheduled_for, config.timezone) : item.scheduled_for.slice(0, 16)) : '' } as any);
        setAiStep(2); setActiveMobilePane('WRITE');
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        setLoading(p => ({ ...p, uploading: true, progressMessage: 'Saving Article...' }));
        
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            let supabasePath = '';
            let fileToMigrate: File | null = form.uploadFile;

            if (form.uploadFile) {
                fileToMigrate = renameFile(form.uploadFile, `${slugify(form.title)}-artikel-cover-mesin-kasir-solo`);
                const { url, path } = await uploadToSupabase(fileToMigrate);
                finalImageUrl = url; supabasePath = path;
            }

            const finalScheduledFor = (form.status === 'scheduled' && form.scheduled_for) 
                ? (config?.timezone ? convertLocalToUTC(form.scheduled_for, config.timezone) : new Date(form.scheduled_for).toISOString()) 
                : null;

            const dbData = {
                title: form.title, excerpt: form.excerpt || '', content: form.content || '', category: form.category || 'General', 
                author: "Amin Maghfuri", author_avatar: config?.founderPortrait || null, read_time: form.readTime, 
                image_url: finalImageUrl, status: (form.status || 'draft').toLowerCase() as any,
                scheduled_for: finalScheduledFor, type: form.type, 
                pillar_id: (form.type === 'cluster' && form.pillar_id && form.pillar_id > 0) ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas, date: form.date, related_pillars: form.related_pillars,
                generation_context: form.generationContext, target_city_id: form.targetCityId !== 0 ? form.targetCityId : null
            };

            let savedId: number | null = form.id;
            if (form.id) {
                const { data, error } = await supabase!.from('articles').update(dbData).eq('id', form.id).select().single();
                if (error) throw error;
                if (data) setArticles((prev: Article[]) => prev.map(a => a.id === form.id ? { ...a, ...data, image: data.image_url } : a));
            } else {
                const { data, error } = await supabase!.from('articles').insert([{ ...dbData, created_at: new Date().toISOString() }]).select().single();
                if (error) throw error;
                if (data) { savedId = data.id; setArticles((prev: Article[]) => [{ ...data, image: data.image_url } as Article, ...prev]); }
            }

            if (supabasePath && fileToMigrate && savedId) {
                processBackgroundMigration(fileToMigrate, supabasePath, 'articles', savedId, 'image_url').then((cloudUrl) => {
                    if (cloudUrl) setArticles((prev: any[]) => prev.map(a => a.id === savedId ? { ...a, image: cloudUrl } : a));
                });
            }
            alert(`Artikel berhasil disimpan!`); resetForm(); setActiveMobilePane('LIST');
        } catch(e: any) { alert("Error: " + e.message); } 
        finally { setLoading(p => ({ ...p, uploading: false })); }
    };

    return {
        form, setForm, filterLogic, activeMobilePane, setActiveMobilePane, 
        aiLogic: { loading, keywords },
        aiState: { step: aiStep, setStep: setAiStep, keywords, selectedTones, setSelectedTones, cities },
        actions: { 
            resetForm, handleEditClick, saveArticle, 
            deleteItem: async (id: number) => { if(confirm("Hapus?")) { await supabase!.from('articles').delete().eq('id', id); setArticles((p: Article[]) => p.filter(a => a.id !== id)); } },
            runResearch: async (topic?: string) => { setLoading(p => ({...p, researching: true})); try { const raw = await EditorAI.researchTopics(form.type as any, topic); setKeywords(raw); setAiStep(1); } finally { setLoading(p => ({...p, researching: false})); } },
            runWrite: async () => { 
                // Validation for Cluster
                if (form.type === 'cluster' && (!form.pillar_id || form.pillar_id === 0)) {
                    alert("⚠️ ARTIKEL CLUSTER WAJIB PILIH PILLAR INDUK!\nSilakan pilih 'Mode Cluster' di menu Konfigurasi, lalu cari dan klik salah satu judul Pillar.");
                    setActiveMobilePane('CONFIG');
                    return;
                }

                setLoading(p => ({ ...p, generatingText: true, progressMessage: 'AI sedang meracik konten...' })); 
                try { 
                    // Prepare Context for AI
                    const galleryCtx = gallery.map(g => `[PROYEK: ${g.title} | SLUG: ${slugify(g.title)} | IMAGE: ${g.image_url} | DESC: ${g.description || ''}]`).join('\n');
                    const productCtx = products.map(p => `[PRODUK: ${p.name} | HARGA: ${p.price} | IMAGE: ${p.image} | DESC: ${p.description}]`).join('\n');
                    
                    // PREPARE DATA FOR ENGINE
                    const parentPillar = form.pillar_id ? articles.find(a => a.id === form.pillar_id) : undefined;
                    const pillarContext = parentPillar ? { title: parentPillar.title, slug: slugify(parentPillar.title) } : undefined;

                    // PREPARE RELATED PILLARS (CROSS-LINKING)
                    const relatedPillarsData = form.related_pillars
                        .map(id => articles.find(a => a.id === id))
                        .filter(Boolean)
                        .map(a => ({ title: a!.title, slug: slugify(a!.title) }));

                    // Execute Writer
                    const content = await EditorAI.writeArticle(
                        form.title, 
                        selectedTones, 
                        form.type, 
                        form.author, 
                        form.targetWordCount, 
                        pillarContext, // Specific Parent Pillar Data (For Cluster)
                        relatedPillarsData, // Related pillars (For Cross Linking in Pillar mode)
                        galleryCtx, 
                        form.generationContext, 
                        form.targetCityId ? cities.find(c => c.id === form.targetCityId) : undefined as any,
                        productCtx
                    ); 
                    
                    const meta = await EditorAI.generateMeta(form.title, content); 
                    setForm(p => ({ 
                        ...p, 
                        content, 
                        excerpt: meta.excerpt, 
                        category: p.category.length > 2 ? p.category : meta.category, 
                        readTime: `${Math.ceil(content.split(/\s+/).length / 200)} min` 
                    })); 
                    
                    setActiveMobilePane('WRITE'); 
                } catch(e: any) {
                    alert("AI Error: " + e.message);
                } finally { 
                    setLoading(p => ({ ...p, generatingText: false })); 
                } 
            },
            runImage: async () => { setLoading(p => ({ ...p, generatingImage: true })); try { const { url, file } = await VisionAI.generate(form.title, form.category, 'corporate'); setForm(p => ({ ...p, imagePreview: url, uploadFile: file })); } finally { setLoading(p => ({ ...p, generatingImage: false })); } },
            selectTopic: (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); },
            runClusterResearch: async (pillar: Article) => {
                setForm(p => ({ ...p, id: null, title: '', content: '', type: 'cluster', pillar_id: pillar.id }));
                setAiStep(0);
                setActiveMobilePane('CONFIG');
            }
        }
    };
};
