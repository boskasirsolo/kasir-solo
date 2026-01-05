
import { useState, useEffect, useMemo } from 'react';
import { slugify, uploadToCloudinary } from '../../utils';
import { Product, Article, GalleryItem } from '../../types';
import { SocialContentItem, PlatformState, CaptionState, ActiveTab, SOCIAL_TONES } from './types';
import { SERVICE_CATALOG } from './data';
import { SocialAI } from '../../services/ai/social';

const ITEMS_PER_PAGE = 7;

export const useSocialStudio = (
    products: Product[],
    articles: Article[],
    gallery: GalleryItem[]
) => {
    // --- STATE ---
    const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'product' | 'service' | 'article' | 'gallery'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sourcePage, setSourcePage] = useState(1); 
    
    // Selection State
    const [selectedItem, setSelectedItem] = useState<SocialContentItem | null>(null);
    
    // Composer State
    const [platforms, setPlatforms] = useState<PlatformState>({ 
        instagram: true, facebook: true, linkedin: false,
        tiktok: false, twitter: false, gmb: false,
        pinterest: false, telegram: false, youtube: false, threads: false
    });
    
    const [captions, setCaptions] = useState<CaptionState>({ 
        master: '', instagram: '', facebook: '', linkedin: '',
        tiktok: '', twitter: '', gmb: '', pinterest: '', telegram: '', youtube: '', threads: ''
    });

    const [activeTab, setActiveTab] = useState<ActiveTab>('master');
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']);

    // Loading State
    const [isLoading, setIsLoading] = useState({ ai: false, posting: false });

    // --- DATA AGGREGATION (DYNAMIC DOMAIN) ---
    const allItems = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kasirsolo.com';

        const mappedProducts: SocialContentItem[] = products.map(p => ({
            id: p.id, type: 'product', title: p.name, description: p.description, 
            image: p.image, url: `${origin}/shop/${slugify(p.name)}`, originalData: p
        }));

        const mappedArticles: SocialContentItem[] = articles
            .filter(a => a.status === 'published') 
            .map(a => ({
                id: a.id, type: 'article', title: a.title, description: a.excerpt, 
                image: a.image, url: `${origin}/articles/${slugify(a.title)}`, originalData: a
            }));

        const mappedGallery: SocialContentItem[] = gallery.map(g => ({
            id: g.id, type: 'gallery', title: g.title, description: g.description || 'Project Portfolio', 
            image: g.image_url, url: `${origin}/gallery/${slugify(g.title)}`, originalData: g
        }));

        const mappedServices: SocialContentItem[] = SERVICE_CATALOG.map(s => ({
            ...s,
            url: s.url.startsWith('http') ? s.url : `${origin}${s.url}`
        }));

        return [...mappedServices, ...mappedProducts, ...mappedArticles, ...mappedGallery];
    }, [products, articles, gallery]);

    // --- FILTERING & PAGINATION ---
    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const matchesType = selectedSourceType === 'all' || item.type === selectedSourceType;
            const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesType && matchesSearch;
        });
    }, [allItems, selectedSourceType, searchTerm]);

    useEffect(() => {
        setSourcePage(1);
    }, [selectedSourceType, searchTerm]);

    const totalSourcePages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = useMemo(() => {
        const start = (sourcePage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, sourcePage]);

    // --- ACTIONS ---

    const selectItem = (item: SocialContentItem) => {
        setSelectedItem(item);
        setCustomImage(null); 
        setUploadFile(null);
        // Reset captions with basic info
        const baseCaption = `${item.title}\n\n${item.description}\n\nInfo selengkapnya: ${item.url}`;
        setCaptions({
            master: baseCaption, instagram: baseCaption, facebook: baseCaption, linkedin: baseCaption,
            tiktok: baseCaption, twitter: baseCaption, gmb: baseCaption, pinterest: baseCaption, telegram: baseCaption, youtube: baseCaption, threads: baseCaption
        });
        setActiveTab('master');
    };

    const toggleTone = (toneId: string) => {
        setSelectedTones(prev => {
            if (prev.includes(toneId)) {
                if (prev.length === 1) return prev; 
                return prev.filter(t => t !== toneId);
            } else {
                if (prev.length >= 3) {
                    alert("Maksimal 3 kombinasi tone.");
                    return prev;
                }
                return [...prev, toneId];
            }
        });
    };

    const handleImageUpload = (file: File) => {
        setUploadFile(file);
        setCustomImage(URL.createObjectURL(file));
    };

    // REFACTORED: Using SocialAI
    const generateAICaption = async (platform: ActiveTab) => {
        if (!selectedItem) return alert("Pilih konten dulu.");
        setIsLoading(p => ({...p, ai: true}));

        try {
            const caption = await SocialAI.generateCaption(
                platform,
                selectedItem.title,
                selectedItem.description,
                selectedItem.url,
                selectedTones
            );
            
            setCaptions(prev => ({
                ...prev,
                [platform]: caption
            }));

        } catch (e: any) {
            alert("Gagal generate AI: " + e.message);
        } finally {
            setIsLoading(p => ({...p, ai: false}));
        }
    };

    const broadcastPost = async () => {
        if (!selectedItem) return;
        setIsLoading(p => ({...p, posting: true}));

        try {
            let finalImageUrl = customImage || selectedItem.image;
            if (uploadFile) {
                finalImageUrl = await uploadToCloudinary(uploadFile);
            }

            const activePlatforms = Object.entries(platforms).filter(([k, v]) => v).map(([k]) => k);
            
            if (activePlatforms.length === 0) throw new Error("Pilih minimal 1 platform.");

            const promises = activePlatforms.map(async (plat) => {
                const caption = captions[plat as keyof CaptionState] || captions.master;
                
                return fetch('/api/ayrshare', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        caption: caption,
                        image_url: finalImageUrl,
                        platforms: [plat],
                        title: selectedItem.title
                    })
                });
            });

            await Promise.all(promises);
            alert("Broadcast Berhasil Terkirim!");

        } catch (e: any) {
            console.error(e);
            alert("Gagal Broadcast: " + e.message);
        } finally {
            setIsLoading(p => ({...p, posting: false}));
        }
    };

    return {
        state: { 
            selectedSourceType, searchTerm, selectedItem, 
            platforms, captions, activeTab, customImage, isLoading,
            allItems, filteredItems, selectedTones,
            paginatedItems, totalSourcePages, sourcePage
        },
        setters: {
            setSelectedSourceType, setSearchTerm, setPlatforms, 
            setCaptions, setActiveTab, setCustomImage, toggleTone,
            setSourcePage
        },
        actions: {
            selectItem,
            handleImageUpload,
            generateAICaption,
            broadcastPost
        }
    };
};
