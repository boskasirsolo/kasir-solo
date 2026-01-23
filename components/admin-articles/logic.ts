
import { useState, useMemo, useEffect } from 'react';
import { Article, GalleryItem, SiteConfig, Product } from '../../types';
import { supabase, uploadToSupabase, processBackgroundMigration, slugify, renameFile, convertLocalToUTC, convertUTCToLocal } from '../../utils';
import { KeywordData, ArticleFormState, FilterType } from './types';
import { VisionAI } from '../../services/ai/vision';
import { EditorAI } from '../../services/ai/editor';

export const useArticleFilter = (articles: Article[], itemsPerPage: number) => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [expandedPillarId, setExpandedPillarId] = useState<number | null>(null);

    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterType]);

    const filteredList = useMemo(() => {
        return articles.filter(a => {
            const matchesSearch = (a.title || '').toLowerCase().includes(searchTerm.toLowerCase());
            if (!matchesSearch) return false;
            if (filterType === 'all') return true; 
            if (filterType === 'pillar') return a.type === 'pillar';
            if (filterType === 'cluster') return a.type === 'cluster';
            return true;
        });
    }, [articles, searchTerm, filterType]);

    return { searchTerm, setSearchTerm, filterType, setFilterType, page, setPage, totalPages: Math.ceil(filteredList.length / itemsPerPage), paginatedList: filteredList.slice((page - 1) * itemsPerPage, page * itemsPerPage), expandedPillarId, setExpandedPillarId };
};

export const useArticleManager = (articles: Article[], setArticles: any, gallery: GalleryItem[] = [], config?: SiteConfig, products: Product[] = []) => {
    const filterLogic = useArticleFilter(articles, 10);
    const [loading, setLoading] = useState({ researching: false, generatingText: false, generatingImage: false, uploading: false, progressMessage: '' });
    const [activeMobilePane, setActiveMobilePane] = useState<'LIST' | 'CONFIG' | 'WRITE'>('LIST');

    // --- FIX: Added actual state for showMediaLib to resolve 0-argument setter error in index.tsx ---
    const [showMediaLib, setShowMediaLib] = useState(false);

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: "Amin Maghfuri", authorAvatar: config?.founder_portrait || "",
        uploadAuthorFile: null, status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '',
        date: new Date().toLocaleDateString('id-ID'),
        targetWordCount: 1000, related_pillars: [], generationContext: '', targetCityId: 0
    });

    const resetForm = () => {
        setForm({ id: null, title: '', excerpt: '', content: '', category: '', author: "Amin Maghfuri", authorAvatar: config?.founder_portrait || '', uploadAuthorFile: null, readTime: '5 min read', imagePreview: '', uploadFile: null, status: 'draft', scheduled_for: '', type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: '', date: new Date().toLocaleDateString('id-ID'), targetWordCount: 1000, related_pillars: [], generationContext: '', targetCityId: 0 });
    };

    const handleEditClick = (item: Article) => {
        // Taktik: Ambil image_url, kalau kosong ambil image (biar data lama Cloudinary aman)
        const currentImage = item.image_url || item.image || '';
        setForm({ ...item, id: item.id, imagePreview: currentImage } as any);
        setActiveMobilePane('WRITE');
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        setLoading(p => ({ ...p, uploading: true, progressMessage: 'Menyimpan Artikel...' }));
        
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';

            const dbData = {
                title: form.title, 
                excerpt: form.excerpt || '', 
                content: form.content || '', 
                category: form.category || 'General', 
                image_url: finalImageUrl, 
                status: (form.status || 'draft').toLowerCase()
            };

            if (form.id) {
                const { error } = await supabase!.from('articles').update(dbData).eq('id', form.id);
                if (error) throw error;
            } else {
                const { error } = await supabase!.from('articles').insert([dbData]);
                if (error) throw error;
            }

            alert("Artikel Berhasil Disimpan!"); 
            resetForm(); 
            setActiveMobilePane('LIST');
            // Refresh list artikel
            window.location.reload();
        } catch(e: any) { 
            console.error("Save Error:", e);
            alert("Gagal Simpan: " + (e.message || "Pastikan korelasi tabel Supabase bener, Bos.")); 
        } 
        finally { setLoading(p => ({ ...p, uploading: false })); }
    };

    return {
        form, setForm, filterLogic, activeMobilePane, setActiveMobilePane, 
        aiLogic: { loading, keywords: [] },
        // --- FIX: Use stateful showMediaLib and setShowMediaLib ---
        uiState: { showMediaLib, setShowMediaLib },
        aiState: { step: 2, setStep: () => {}, keywords: [], selectedTones: [], setSelectedTones: () => {}, cities: [] },
        actions: { 
            resetForm, handleEditClick, saveArticle, 
            handleCoverUpload: (f: File) => setForm(p => ({...p, uploadFile: f, imagePreview: URL.createObjectURL(f)})),
            handleMediaSelect: (u: string) => { 
                setForm(p => ({...p, imagePreview: u}));
                setShowMediaLib(false);
            },
            deleteItem: async (id: number) => { if(confirm("Hapus?")) { await supabase!.from('articles').delete().eq('id', id); window.location.reload(); } },
            // --- FIX: Updated signatures to accept parameters used in consuming components ---
            runResearch: async (topic?: string) => {}, 
            runWrite: async () => {}, 
            runImage: async () => {}, 
            selectTopic: (k: any) => {}, 
            runClusterResearch: (article: Article) => {}
        }
    };
};
