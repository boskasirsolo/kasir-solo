
import { useState, useEffect, useMemo } from 'react';
import { supabase, callGeminiWithRotation, slugify, uploadToCloudinary } from '../../utils';
import { Product, Article, GalleryItem } from '../../types';
import { SocialContentItem, PlatformState, CaptionState, ActiveTab, SOCIAL_TONES } from './types';
import { SERVICE_CATALOG } from './data';

const ITEMS_PER_PAGE = 7;

export const useSocialStudio = (
    products: Product[],
    articles: Article[],
    gallery: GalleryItem[]
) => {
    // --- STATE ---
    const [selectedSourceType, setSelectedSourceType] = useState<'all' | 'product' | 'service' | 'article' | 'gallery'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sourcePage, setSourcePage] = useState(1); // Pagination State
    
    // Selection State
    const [selectedItem, setSelectedItem] = useState<SocialContentItem | null>(null);
    
    // Composer State
    const [platforms, setPlatforms] = useState<PlatformState>({ instagram: true, facebook: true, linkedin: false });
    const [captions, setCaptions] = useState<CaptionState>({ master: '', instagram: '', facebook: '', linkedin: '' });
    const [activeTab, setActiveTab] = useState<ActiveTab>('master');
    const [customImage, setCustomImage] = useState<string | null>(null);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    
    // NEW: Multi-Tone State (Array)
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']);

    // Loading State
    const [isLoading, setIsLoading] = useState({ ai: false, posting: false });

    // --- DATA AGGREGATION (DYNAMIC DOMAIN) ---
    const allItems = useMemo(() => {
        // Get dynamic origin (browser only)
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kasirsolo.com';

        const mappedProducts: SocialContentItem[] = products.map(p => ({
            id: p.id, type: 'product', title: p.name, description: p.description, 
            image: p.image, url: `${origin}/shop/${slugify(p.name)}`, originalData: p
        }));

        // FILTER: Only show PUBLISHED articles
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

        // Map static services to dynamic URL if needed, or keep external
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

    // Reset page on filter change
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
        setCustomImage(null); // Reset custom image on new selection
        setUploadFile(null);
        // Reset captions with basic info
        const baseCaption = `${item.title}\n\n${item.description}\n\nInfo selengkapnya: ${item.url}`;
        setCaptions({
            master: baseCaption,
            instagram: baseCaption,
            facebook: baseCaption,
            linkedin: baseCaption
        });
        setActiveTab('master');
    };

    const toggleTone = (toneId: string) => {
        setSelectedTones(prev => {
            if (prev.includes(toneId)) {
                // Prevent unselecting if it's the last one (optional, keeping at least 1 is safer)
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

    const generateAICaption = async (platform: 'master' | 'instagram' | 'facebook' | 'linkedin') => {
        if (!selectedItem) return alert("Pilih konten dulu.");
        setIsLoading(p => ({...p, ai: true}));

        try {
            // Get Multiple Tone Descriptions
            const toneDescriptions = selectedTones.map(id => {
                const t = SOCIAL_TONES.find(x => x.id === id);
                return t ? `${t.label} (${t.desc})` : '';
            }).join(' + ');

            let platformContext = "";
            if (platform === 'instagram') {
                platformContext = `
                PLATFORM: INSTAGRAM
                - Strategy: Visual-first, Engaging, Save-able content.
                - Hashtag Rules: Research 20-25 high-traffic & niche hashtags. Place them in a block at the bottom.
                - Formatting: Clean line breaks. Use relevant emojis.
                `;
            } else if (platform === 'facebook') {
                platformContext = `
                PLATFORM: FACEBOOK
                - Strategy: Community building, Share-able, Conversational.
                - Keyword Rules: Weave 3-5 keywords naturally into sentences (e.g. "Solusi #KasirOnline terbaik...").
                - Hashtags: Max 3-5 tags at the bottom. Focus on groups/community tags.
                `;
            } else if (platform === 'linkedin') {
                platformContext = `
                PLATFORM: LINKEDIN
                - Strategy: Professional Insight, B2B Value, Thought Leadership.
                - Keyword Rules: Use industry standard terms (ERP, ROI, Efficiency).
                - Hashtags: Strictly 3-5 professional tags (e.g., #RetailTech #BusinessGrowth).
                - Tone Adjustment: Make it slightly more formal/smart but keep the 'Gritty' edge.
                `;
            } else {
                platformContext = "PLATFORM: GENERAL SOCIAL MEDIA. Balanced approach.";
            }

            const prompt = `
            Role: Social Media Strategist & Trend Analyst for "PT Mesin Kasir Solo".
            Target Audience: Indonesian SME Owners (UMKM), Retail Managers, F&B Owners.
            
            [CONTENT SOURCE]
            Title: ${selectedItem.title}
            Type: ${selectedItem.type}
            Key Info: ${selectedItem.description}
            Link: ${selectedItem.url}

            [USER SELECTED TONE MIX]
            ${toneDescriptions}

            [STRICT PERSONA RULE: USE "GUE"]
            - You are the Founder/Owner speaking directly to fellow business owners.
            - **FORBIDDEN WORDS:** "Saya", "Kami", "Kita", "Anda".
            - **MANDATORY WORDS:** Use **"Gue"** (for I/Me/We) and **"Lo"** or "Kalian" (for You/Audience).
            - **VIBE:** Street-smart, experienced, "teman nongkrong", honest, no corporate bullshit.
            - Exception: Only use formal language if the selected tone is STRICTLY 'Formal Professional'. Otherwise, default to "Gue/Lo".

            [INSTRUCTION: RESEARCH & WRITE]
            1. **RESEARCH PHASE (Internal):** 
               - Analyze the topic "${selectedItem.title}".
               - Identify High-Volume Keywords & Trending Hashtags relevant to ${platform} in Indonesia.
               - Identify "Pain Points" of the audience related to this item.

            2. **DRAFTING PHASE:**
               - Write a caption that hooks the reader immediately (No "Halo Kak" intro).
               - **WEAVING TECHNIQUE:** Do NOT just list keywords. Weave the researched keywords naturally into the narrative sentences.
                 (Example: Instead of "Beli mesin kasir.", write "Gue kasih tau ya, investasi #MesinKasir itu kunci biar duit lo gak bocor.")
               - Inject the selected Tones naturally.
               - Include a clear Call to Action (CTA) pointing to the Link/Bio/DM.

            3. **PLATFORM SPECIFIC RULES:**
               ${platformContext}

            Output: JUST the final caption text ready to post. No "Here is the caption" prologues.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text?.trim() || "";
            
            setCaptions(prev => ({
                ...prev,
                [platform]: text // Only update the requested platform
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
            // 1. Determine Image URL (Upload if local)
            let finalImageUrl = customImage || selectedItem.image;
            if (uploadFile) {
                // Upload to Cloudinary directly for broadcast
                finalImageUrl = await uploadToCloudinary(uploadFile);
            }

            // 2. Prepare Payloads
            const activePlatforms = Object.entries(platforms).filter(([k, v]) => v).map(([k]) => k);
            
            if (activePlatforms.length === 0) throw new Error("Pilih minimal 1 platform.");

            const promises = activePlatforms.map(async (plat) => {
                const caption = captions[plat as keyof CaptionState] || captions.master; // Fallback to master
                
                // Call API Route
                return fetch('/api/ayrshare', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        caption: caption,
                        image_url: finalImageUrl,
                        platforms: [plat], // Send one by one to ensure custom caption
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
            // Pagination exports
            paginatedItems, totalSourcePages, sourcePage
        },
        setters: {
            setSelectedSourceType, setSearchTerm, setPlatforms, 
            setCaptions, setActiveTab, setCustomImage, toggleTone,
            setSourcePage // Export setter
        },
        actions: {
            selectItem,
            handleImageUpload,
            generateAICaption,
            broadcastPost
        }
    };
};
