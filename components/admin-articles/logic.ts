
import { useState, useMemo, useEffect } from 'react';
import { Article, GalleryItem, SiteConfig } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, uploadToSupabase, processBackgroundMigration, slugify, renameFile, convertLocalToUTC, convertUTCToLocal } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS, NARRATIVE_TONES, ARTICLE_CATEGORIES } from './types';

// --- FOUNDER STORY VARIATIONS (ANEKDOT DATABASE) ---
const FOUNDER_ANECDOTES = [
    `"Jujur aja, 2022 itu tahun neraka buat gue. Domain kantor 'expired' dan diambil orang. Rasanya kayak rumah lo digusur padahal sertifikatnya lengkap. Dari situ gue belajar: detail kecil itu mematikan."`,
    `"Pas gue liat notifikasi server down dan aset digital hilang, dengkul gue lemes. Itu momen gue sadar, bisnis tanpa backup system itu sama aja bunuh diri pelan-pelan."`,
    `"Jangan pikir gue langsung duduk enak di kursi CEO. 2015 gue jalan kaki, door-to-door nawarin mesin kasir, diusir satpam, diketawain owner toko. Mental gue ditempa di aspal panas."`,
    `"Klien pertama gue itu warung kelontong kecil. Dia bayar pake uang receh hasil dagang seharian. Gue terima duit itu sambil gemeter, gue janji software ini gak boleh ngecewain dia."`,
    `"Gue pernah gak tidur 48 jam cuma gara-gara selisih 50 perak di laporan closing. Orang bilang lebay, gue bilang itu integritas. Kalau 50 perak aja lolos, gimana 50 juta?"`,
    `"Bikin software itu gampang. Bikin software yang bisa dipake sama Ibu-ibu pasar yang gak ngerti gadget? Itu baru tantangan. SIBOS lahir dari situ."`,
    `"Banyak motivator bisnis bilang 'Fokus Omzet!', tai kucing lah. Fokus itu di Profit dan Data. Omzet gede kalau bocor di operasional buat apa? Capek doang."`,
    `"Stop dewa-dewain teknologi mahal. POS 50 juta gak guna kalau kasir lo masih bisa nyatet manual di buku utang. Sistem itu soal habit, bukan cuma alat."`,
    `"Gue sering banget denger curhatan owner yang duitnya dicolong karyawan kepercayaan. Sakitnya bukan di duitnya, tapi di khianatnya. Gue bangun sistem ini biar lo gak ngerasain sakit itu."`,
    `"Gue ngerti rasanya pusing ngurus stok opname tiap akhir bulan. Mata sepet, fisik capek, data gak klop. Gue pernah di posisi lo, Makanya gue bikin fitur auto-stock."`
];

const OPENING_HOOKS = [
    "THE PUNCH: Mulai dengan satu kalimat pendek yang menohok/keras.",
    "THE QUESTION: Mulai dengan pertanyaan retoris yang relate dengan masalah pembaca.",
    "THE STAT: Mulai dengan fakta atau data statistik yang mengejutkan.",
    "THE STORY: Mulai langsung di tengah cerita (In Media Res) tanpa basa-basi.",
    "THE CONTRAST: Mulai dengan 'Banyak orang pikir X, padahal aslinya Y'."
];

const BRAND_CONTEXT = `
[IDENTITAS]
Nama: PT Mesin Kasir Solo.
DNA: Resilien, Jujur, Street-Smart, Anti-Ribet.
Produk: SIBOS (App Kasir), QALAM (App Sekolah), Hardware POS.

[STATUS PRODUK - CRITICAL / WAJIB PATUH]
1. SIBOS & QALAM (Software): Masih tahap PROTOTYPING / DEVELOPMENT (Belum Rilis).
   - HARAM HUKUMNYA menyuruh pembaca "Download Sekarang", "Beli Aplikasi", atau "Langganan Sekarang".
   - SIBOS belum ada di Playstore/Appstore.
   - GANTI Call-to-Action (CTA) dengan: "Daftar Waiting List", "Amankan Slot Early Access", atau "Konsultasi Kebutuhan Sistem".
   - Narasi harus bersifat "Visionary": "Kami sedang membangun...", "Bayangkan jika lo punya...", "Sistem ini nantinya bakal...".
2. Hardware POS (Alat Kasir Fisik): READY STOCK. Ini boleh dijual langsung/hard sell.

[GAYA BAHASA - STRICT]
- JANGAN PERNAH gunakan kalimat pembuka standar AI seperti "Di era digital yang semakin pesat..." atau "Pada artikel kali ini...".
- HINDARI kata-kata kaku/baku berlebihan. Gunakan bahasa lisan yang cerdas.
- Gunakan analogi 'jalanan' atau 'warung kopi' yang mudah dimengerti.
- Variasikan panjang kalimat. Kadang satu kata. Kadang satu paragraf.
`;

// --- NEW: GOVERNMENT CRITIQUE RULE (TIPIS-TIPIS) ---
const GOV_CRITIQUE_RULE = `
[ATURAN KHUSUS: SENTILAN KEBIJAKAN (KRITIK TIPIS)]
JIKA topik artikel berkaitan dengan Kebijakan Pemerintah, Aturan Baru, Pajak (PPN), Sertifikasi Halal, Izin Usaha (OSS), Pembatasan Impor, atau Birokrasi:
1.  **WAJIB** selipkan kritik "tipis-tipis" (sindiran halus) di dalam narasi.
2.  **Sudut Pandang:** Suarakan keluhan "Wong Cilik" / UMKM yang merasa terbebani birokrasi yang ribet, aturan yang berubah-ubah, atau pajak yang mencekik.
3.  **Nada:** Bukan pemberontak anarkis, tapi "Pedagang yang capek di-prank aturan". Realistis dan membumi.
4.  **Contoh Vibe:** 
    - "Kita disuruh taat pajak, giliran butuh bantuan prosedurnya minta ampun."
    - "Niatnya mau legal urus izin, eh malah dilempar sana-sini kayak bola bekel."
    - "Peraturan ganti menteri ganti kebijakan, kita pedagang kecil yang bengek ngikutinnya."
5.  **Closing:** Tetap arahkan bahwa karena "Negara kadang gak bisa diandelin", maka kita (pebisnis) harus mandiri pakai Sistem/Teknologi sendiri untuk survive.
`;

// --- INTERNAL LINKING STRATEGY (SPIDER WEB) ---
const INTERNAL_LINKING_RULES = `
[STRATEGI INTERNAL LINK - WAJIB DIIMPLEMENTASIKAN]
Gunakan format Markdown: [Anchor Text](/path).

ATURAN LINKING (Gunakan jika konteks kalimat relevan):
1. Jika membahas **Hardware, Alat Kasir, Printer, Scanner**: -> Link ke: [Katalog Hardware](/shop)
2. Jika membahas **Pembuatan Website, SEO, Toko Online**: -> Link ke: [Jasa Pembuatan Website](/services/website)
3. Jika membahas **Aplikasi Custom, Software Gudang, ERP Custom**: -> Link ke: [Layanan Web App](/services/webapp)
4. Jika membahas **SIBOS, Sistem Kasir Pintar, Manajemen Stok**: -> Link ke: [Daftar Waiting List SIBOS](/innovation)
5. Jika membahas **QALAM, Aplikasi Sekolah, Pesantren**: -> Link ke: [Antrian QALAM](/innovation)
6. Jika membahas **Bukti, Klien, Portfolio**: -> Link ke: [Lihat Portfolio Kami](/gallery)
7. Jika membahas **Call to Action (CTA), Konsultasi**: -> Link ke: [Hubungi Founder](/contact)
`;

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

// IMPROVED VOLUME PARSER
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
    
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true, autoCategory: true, autoAuthor: true,
        imageStyle: 'cinematic', narrative: 'narsis'
    });

    const analyzeMarket = async (articleType: 'pillar' | 'cluster', specificTopic?: string) => {
        const loadingMsg = specificTopic 
            ? `Scanning Market for Topic: "${specificTopic}"...` 
            : 'Analyzing General Market Trends...';
            
        setLoading(p => ({ ...p, researching: true, progressMessage: loadingMsg }));
        
        try {
            let prompt = "";
            const industryContext = "Retail Technology, Point of Sale (POS), Business Management, UMKM Indonesia";
            const topicContext = specificTopic 
                ? `FOCUS TOPIC: "${specificTopic}". Find keywords specifically related to this topic within the context of ${industryContext}.`
                : `BROAD SCOPE: Find general trending topics in ${industryContext}.`;

            if (articleType === 'pillar') {
                prompt = `
                Act as a Senior SEO Strategist for the Indonesian Market.
                ${topicContext}
                Task: Identify 10 **Broad, High-Volume "Ultimate Guide" Article Titles** (Pillar Content) for 2025.
                These should be comprehensive topics that can be broken down into many sub-topics later.
                **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition. Do NOT include 'High' competition keywords.
                Strict Output Format: JSON Array of Objects.
                Example: [{"keyword": "Panduan Lengkap Bisnis Ritel", "volume": "12k/mo", "competition": "Medium", "type": "Pillar"}]
                `;
            } else {
                prompt = `
                Act as a Senior SEO Strategist for the Indonesian Market.
                ${topicContext}
                Task: Identify 15 **Specific, Long-tail, Problem-Solving Article Titles** (Cluster Content) for 2025.
                **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition. Do NOT include 'High' competition keywords.
                Strict Output Format: JSON Array of Objects.
                Example: [{"keyword": "Cara Mencegah Kasir Curang", "volume": "5.400/mo", "competition": "Low", "type": "Cluster"}]
                `;
            }

            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            
            if (Array.isArray(data)) {
                const filteredData = data.filter((item: any) => {
                    const comp = (item.competition || '').toLowerCase();
                    return comp !== 'high' && !comp.includes('high'); 
                });
                const sortedData = filteredData.sort((a: any, b: any) => parseVolume(b.volume) - parseVolume(a.volume));
                setKeywords(sortedData);
            }
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };

    const generateClusterIdeas = async (pillar: Article) => {
        setLoading(p => ({ ...p, researching: true, progressMessage: 'Generating Cluster Topics...' }));
        setKeywords([]);
        try {
            const prompt = `
            Act as SEO Specialist. Context: We have a Pillar Page titled "${pillar.title}".
            Task: Generate 15 Specific Cluster Content Ideas (Sub-topics) that link back to this pillar.
            **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition.
            STRICT JSON Output Format: Array of objects with keys: "keyword", "volume", "competition", "type".
            Example: [{"keyword": "Strategi X", "volume": "2.5k", "competition": "Low", "type": "Cluster"}]
            `;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            if (Array.isArray(data)) {
                const filteredData = data.filter((item: any) => {
                    const comp = (item.competition || '').toLowerCase();
                    return comp !== 'high' && !comp.includes('high'); 
                });
                const sortedData = filteredData.sort((a: any, b: any) => parseVolume(b.volume) - parseVolume(a.volume));
                setKeywords(sortedData);
            }
        } catch (e) { console.error(e); } 
        finally { setLoading(p => ({ ...p, researching: false, progressMessage: '' })); }
    };

    // --- MAIN GENERATION LOGIC ---
    const generateContent = async (
        title: string, 
        tones: string[], 
        type: string, 
        authorName: string, 
        wordCount: number, 
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[],
        galleryContextString?: string
    ) => {
        setLoading(p => ({ ...p, generatingText: true }));
        
        try {
            if (wordCount >= 2000) {
                return await generateLongFormContent(title, tones, type, authorName, wordCount, pillarContext, relatedPillarsData, galleryContextString);
            }

            setLoading(p => ({ ...p, progressMessage: 'Writing Standard Article...' }));
            const isAmin = authorName === 'Amin Maghfuri';
            const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
            const selectedHook = OPENING_HOOKS[Math.floor(Math.random() * OPENING_HOOKS.length)];
            const shouldInjectStory = isAmin ? (Math.random() > 0.2) : (Math.random() > 0.8);
            
            const storyInstruction = shouldInjectStory 
                ? `Story Element to Weave In: ${selectedAnecdote} (Make it flow naturally).`
                : `Story Element: SKIP personal story this time. Focus purely on technical advice.`;

            const pov = isAmin 
                ? `First Person Casual ('Gue'). You are Amin Maghfuri (Founder). Use 'Gue/Lo'. Be gritty, street-smart. ${storyInstruction}` 
                : "Professional ('Kami'). Trustworthy, Expert, Corporate Tone.";
            
            const toneDescriptions = tones.map(t => {
                const def = NARRATIVE_TONES.find(nt => nt.id === t);
                return def ? `${def.label}` : t;
            }).join(', ');

            let clusterInstruction = "";
            if (type === 'cluster' && pillarContext) {
                clusterInstruction = `[SEO]: Link back to [${pillarContext.title}](/articles/${pillarContext.slug}) in first 3 paragraphs.`;
            }

            let relatedPillarInstruction = "";
            if (relatedPillarsData && relatedPillarsData.length > 0) {
                const linksList = relatedPillarsData.map(p => `- [${p.title}](/articles/${p.slug})`).join('\n');
                relatedPillarInstruction = `[SEO]: Weave links to these related pillars naturally:\n${linksList}`;
            }

            let galleryInstruction = "";
            if (galleryContextString) {
                galleryInstruction = `
                [PORTFOLIO SHOWCASE STRATEGY]
                Available Projects:
                ${galleryContextString}
                IF MATCH FOUND: Insert a "Project Card" in the middle of the article using THIS EXACT SHORTCODE FORMAT:
                [PROJECT: Project Name | /gallery/slug-title | INSERT_EXACT_IMAGE_URL_FROM_DATA | A short 1-sentence description of the implementation]
                `;
            }

            const contentPrompt = `
            Role: Expert Copywriter PT Mesin Kasir Solo.
            Task: Write Article "${title}".
            Length: Approx ${wordCount} words.
            POV: ${pov}
            Tone: ${toneDescriptions}.
            Opening: ${selectedHook}
            Structure: Use Headers #, ##, ###, Lists, Bold.
            ${clusterInstruction}
            ${relatedPillarInstruction}
            ${galleryInstruction}
            Brand Context: ${BRAND_CONTEXT}
            ${GOV_CRITIQUE_RULE}
            ${INTERNAL_LINKING_RULES}
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            const content = contentRes.text || '';
            const meta = await generateMeta(title, content);

            return { content, meta };

        } catch (e: any) { 
            throw e; 
        } finally {
            setLoading(p => ({ ...p, generatingText: false, progressMessage: '' }));
        }
    };

    // --- LONG FORM GENERATOR (MULTI-STEP) ---
    const generateLongFormContent = async (
        title: string, 
        tones: string[], 
        type: string, 
        authorName: string, 
        wordCount: number, 
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[],
        galleryContextString?: string
    ) => {
        const isAmin = authorName === 'Amin Maghfuri';
        const pov = isAmin ? "First Person 'Gue' (Amin Maghfuri)" : "Professional 'Kami'";
        const sectionsCount = Math.ceil(wordCount / 1000); 
        
        setLoading(p => ({ ...p, progressMessage: `Designing Outline for ${wordCount} words...` }));
        
        const outlinePrompt = `
        Act as a Content Architect.
        Task: Create a detailed Table of Contents (Outline) for a **${wordCount}-word Ultimate Guide** titled "${title}".
        Target: Break this into exactly **${sectionsCount} Distinct Major Sections** (Chapters).
        Output Format: JSON Array of Strings (Section Titles Only).
        `;

        let sections: string[] = [];
        try {
            const outlineRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: outlinePrompt, config: { responseMimeType: "application/json" } });
            sections = JSON.parse(outlineRes.text || '[]');
        } catch (error) {
            await new Promise(r => setTimeout(r, 1000));
            const outlineResRetry = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: outlinePrompt, config: { responseMimeType: "application/json" } });
            sections = JSON.parse(outlineResRetry.text || '[]');
        }
        
        let fullContent = "";
        let previousContext = "";

        for (let i = 0; i < sections.length; i++) {
            const sectionTitle = sections[i];
            const isFirst = i === 0;
            
            setLoading(p => ({ ...p, progressMessage: `Writing Section ${i + 1}/${sections.length}: ${sectionTitle}...` }));

            let connectionInstruction = isFirst ? `Start with a strong Hook.` : `
                [CRITICAL CONTINUITY] This is Part ${i + 1}. PREVIOUS ENDING: "...${previousContext.slice(-300)}...".
                Start IMMEDIATELY by connecting to the previous thought. No new intros.
            `;

            let linkInstruction = "";
            if (relatedPillarsData && relatedPillarsData.length > 0) {
                const linkTarget = relatedPillarsData[i % relatedPillarsData.length]; 
                linkInstruction = `Try to naturally mention and link to: [${linkTarget.title}](/articles/${linkTarget.slug}) in this section.`;
            }

            let galleryInstruction = "";
            if (galleryContextString && i === Math.floor(sections.length / 2)) {
                 galleryInstruction = `
                [PORTFOLIO SHOWCASE]
                Projects: ${galleryContextString}
                INSTRUCTION: If applicable, insert a "Project Card" shortcode here: [PROJECT: Title | /gallery/slug | ImageURL | Short Description]
                `;
            }

            const sectionPrompt = `
            Role: Expert Writer for PT Mesin Kasir Solo.
            Task: Write **Section ${i + 1}: ${sectionTitle}** for the article "${title}".
            Target Length for THIS section: **1000 words**.
            POV: ${pov}.
            Style: Detailed, Deep, Actionable.
            Brand Context: ${BRAND_CONTEXT}
            ${GOV_CRITIQUE_RULE}
            ${INTERNAL_LINKING_RULES}
            ${connectionInstruction}
            ${linkInstruction}
            ${galleryInstruction}
            OUTPUT: Markdown content for this section only.
            `;

            const sectionRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: sectionPrompt });
            const sectionText = sectionRes.text || "";
            
            fullContent += sectionText + "\n\n";
            previousContext = sectionText; 
        }

        const meta = await generateMeta(title, fullContent);
        return { content: fullContent, meta };
    };

    const generateMeta = async (title: string, content: string) => {
        const generatedWordCount = content.split(/\s+/).length;
        const readTimeMin = Math.ceil(generatedWordCount / 200);
        
        const existingCategories = [
            "Bisnis Tips", "Manajemen", "Keuangan", "HR", "Franchise", 
            "Hardware Review", "Android POS", "Windows POS", "Teknologi", "Tutorial",
            "Digital Marketing", "Branding", "Loyalty Program", "Promosi"
        ].join(', ');

        const metaPrompt = `
        Role: Senior SEO Strategist for PT Mesin Kasir Solo.
        Task: Generate metadata for the article "${title}".
        Context Snippet: "${content.substring(0, 1000)}..."

        1. EXCERPT: Write a persuasive meta description (max 150 chars).
        2. CATEGORY STRATEGY: Analyze content for Niche Keywords. Select from [${existingCategories}] OR create a better specific one (2-3 words, Title Case).

        Output JSON: { "excerpt": "...", "category": "..." }
        `;
        
        const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
        const metaData = JSON.parse(metaRes.text || '{}');
        
        return { ...metaData, readTime: `${readTimeMin} min read` };
    };

    const getAIImageUrl = async (title: string, category: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50);
        
        let visualContext = "professional business environment";
        const lowerCat = (category || "").toLowerCase();
        
        if (lowerCat.includes('hardware') || lowerCat.includes('pos') || lowerCat.includes('kasir')) {
            visualContext = "close up product shot of a sleek modern white point of sale cashier machine on a wooden coffee shop counter, shallow depth of field, high tech equipment";
        } else if (lowerCat.includes('software') || lowerCat.includes('app') || lowerCat.includes('digital') || lowerCat.includes('toko online')) {
            visualContext = "close up over shoulder shot of person utilizing a tablet displaying a colorful sophisticated business analytics dashboard, modern bright office, data visualization on screen";
        } else if (lowerCat.includes('tips') || lowerCat.includes('bisnis') || lowerCat.includes('manajemen') || lowerCat.includes('keuangan')) {
            visualContext = "portrait of a successful indonesian small business owner in a modern retail store, confident expression, warm lighting, cinematic composition";
        } else if (lowerCat.includes('franchise') || lowerCat.includes('kuliner')) {
            visualContext = "busy modern coffee shop counter scene, barista serving customer, point of sale machine in foreground, warm ambient lighting, bustling atmosphere";
        } else if (lowerCat.includes('marketing') || lowerCat.includes('branding')) {
            visualContext = "creative modern workspace, team brainstorming on whiteboard, bright natural light, energetic atmosphere, startups";
        }

        const qualityBoosters = "masterpiece, best quality, ultra realistic, 8k uhd, sharp focus, professional photography, perfect lighting, rule of thirds, cinematic look";
        const enhancedPrompt = `${qualityBoosters}, ${style} photography of ${cleanTitle}, ${visualContext}, highly detailed, authentic, --no text, --no watermark`;
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}&enhance=true`;
        
        if (!supabase) return { url: pollUrl, file: null };
        
        try {
            const res = await fetch(pollUrl);
            const blob = await res.blob();
            const cleanFileName = `${slugify(title)}-${slugify(category)}-2025.jpg`;
            const file = new File([blob], cleanFileName, { type: "image/jpeg" });
            const localUrl = URL.createObjectURL(blob);
            
            return { url: localUrl, file: file };
        } catch(e) { 
            console.error("AI Image Gen Error", e);
            return { url: pollUrl, file: null }; 
        }
    };

    return { loading, setLoading, trendingTopics, keywords, genConfig, setGenConfig, analyzeMarket, generateContent, getAIImageUrl, generateClusterIdeas };
};

// ... (Rest of file unchanged, useArticleManager exports)
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
        related_pillars: []
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
            related_pillars: []
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
            related_pillars: item.related_pillars || []
        });
        setSocialCaption(''); 
        setAiStep(2);
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Uploading Avatar...' }));
        try {
            let avatarUrl = URL.createObjectURL(file);
            const seoName = `${slugify(activePersona.name)}-author-avatar`;
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
                const seoName = `${slugify(form.title)}-artikel-cover`;
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
                related_pillars: form.related_pillars 
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
        aiLogic.setLoading(p => ({ ...p, researching: true, progressMessage: 'Brainstorming 5 Categories...' }));
        try {
            const contextText = form.content.length > 50 ? form.content.substring(0, 500) : form.title;
            const prompt = `
            Role: SEO Specialist for "Kasir Solo".
            Task: Analyze the context below and generate Article Categories/Tags.
            Context: "${contextText}"
            Constraint: Generate EXACTLY 5 categories. Mix broad topics with specific niche tags. Format: Comma-separated string.
            Output: JUST the comma-separated text.
            `;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const newCatsString = result.text?.trim().replace(/['"]/g, '') || "";
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

            let galleryContextString = "";
            if (gallery && gallery.length > 0) {
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
                pillarContext, relatedPillarsData, galleryContextString
            ); 
            
            setForm(p => ({ 
                ...p, content, excerpt: meta.excerpt, 
                category: p.category && p.category.length > 2 ? p.category : meta.category, 
                readTime: meta.readTime 
            })); 
            setAiStep(2); 
        } catch(e: any) { alert(e.message); } 
    };
    
    const runImage = async () => { 
        aiLogic.setLoading(p => ({ ...p, generatingImage: true, progressMessage: 'Generating AI Image...' })); 
        try { 
            const style = activePersona.mode === 'personal' ? 'cinematic' : 'corporate'; 
            const { url, file } = await aiLogic.getAIImageUrl(form.title, form.category, style); 
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
