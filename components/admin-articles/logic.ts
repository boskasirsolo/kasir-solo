
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

[GAYA BAHASA - STRICT]
- JANGAN PERNAH gunakan kalimat pembuka standar AI seperti "Di era digital yang semakin pesat..." atau "Pada artikel kali ini...".
- HINDARI kata-kata kaku/baku berlebihan. Gunakan bahasa lisan yang cerdas.
- Gunakan analogi 'jalanan' atau 'warung kopi' yang mudah dimengerti.
- Variasikan panjang kalimat. Kadang satu kata. Kadang satu paragraf.
`;

// --- NEW: INTERNAL LINKING STRATEGY (SPIDER WEB) ---
const INTERNAL_LINKING_RULES = `
[STRATEGI INTERNAL LINK - WAJIB DIIMPLEMENTASIKAN]
Kamu harus secara cerdas menyisipkan link ke halaman lain di website KasirSolo.com agar struktur SEO menjadi kuat (Spider Web Structure).
Gunakan format Markdown: [Anchor Text](/path).

ATURAN LINKING (Gunakan jika konteks kalimat relevan):
1. Jika membahas **Hardware, Alat Kasir, Printer, Scanner**:
   -> Link ke: [Katalog Hardware](/shop) atau [Paket Kasir](/shop)
2. Jika membahas **Pembuatan Website, SEO, Toko Online**:
   -> Link ke: [Jasa Pembuatan Website](/services/website)
3. Jika membahas **Aplikasi Custom, Software Gudang, ERP Custom**:
   -> Link ke: [Layanan Web App](/services/webapp)
4. Jika membahas **SIBOS, Sistem Kasir Pintar, Manajemen Stok, Franchise**:
   -> Link ke: [Inovasi SIBOS](/innovation)
5. Jika membahas **QALAM, Aplikasi Sekolah, Pesantren**:
   -> Link ke: [Aplikasi Pendidikan QALAM](/innovation)
6. Jika membahas **Bukti, Klien, Portfolio, Hasil Kerja**:
   -> Link ke: [Lihat Portfolio Kami](/gallery)
7. Jika kalimat bersifat **Call to Action (CTA), Konsultasi, Tanya Harga**:
   -> Link ke: [Hubungi Tim Kami](/contact)

CONTOH INTEGRASI NATURAL:
"Banyak pengusaha gagal karena meremehkan pembukuan. Padahal dengan [Sistem SIBOS](/innovation), semua bisa otomatis. Kalau kamu butuh alat tempurnya juga, cek [Katalog Hardware](/shop) yang kami sediakan."
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
        
        // Handle 'k' (thousands) e.g., 5.4k, 5,4k
        if (clean.includes('k')) {
            clean = clean.replace('k', '').trim();
            clean = clean.replace(',', '.'); // Ensure decimal format
            const numPart = parseFloat(clean);
            return isNaN(numPart) ? 0 : Math.round(numPart * 1000);
        }

        // Handle standard numbers (remove dots and commas as thousands separators)
        // Assumption: If no 'k', it's an integer. 1.200 = 1200.
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
        galleryContextString?: string // NEW: Receive Gallery Projects Data
    ) => {
        setLoading(p => ({ ...p, generatingText: true }));
        
        try {
            // IF WORD COUNT > 2000, USE MULTI-STEP GENERATION
            if (wordCount >= 2000) {
                return await generateLongFormContent(title, tones, type, authorName, wordCount, pillarContext, relatedPillarsData, galleryContextString);
            }

            // --- STANDARD GENERATION (< 2000 words) ---
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

            // NEW: PROJECT SHOWCASE INSTRUCTION WITH ROBUST SHORTCODE
            let galleryInstruction = "";
            if (galleryContextString) {
                galleryInstruction = `
                [PORTFOLIO SHOWCASE STRATEGY - IMPORTANT]
                You have access to our Gallery/Portfolio database.
                Available Projects:
                ${galleryContextString}

                **INSTRUCTION:** 
                Check if the article topic matches any of the projects above.
                IF MATCH FOUND: Insert a "Project Card" in the middle of the article using THIS EXACT SHORTCODE FORMAT:
                
                [PROJECT: Project Name | /gallery/slug-title | INSERT_EXACT_IMAGE_URL_FROM_DATA | A short 1-sentence description of the implementation]
                
                Example:
                [PROJECT: Kopi Senja | /gallery/kopi-senja | https://image.com/1.jpg | Implementasi 5 tablet POS untuk mempercepat pesanan di jam sibuk.]

                DO NOT use Markdown Images or Blockquotes for this. Use the [PROJECT: ...] shortcode on its own line.
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

    // --- NEW: LONG FORM GENERATOR (MULTI-STEP) ---
    const generateLongFormContent = async (
        title: string, 
        tones: string[], 
        type: string, 
        authorName: string, 
        wordCount: number, 
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[],
        galleryContextString?: string // NEW
    ) => {
        // 1. SETUP PHASE
        const isAmin = authorName === 'Amin Maghfuri';
        const pov = isAmin ? "First Person 'Gue' (Amin Maghfuri)" : "Professional 'Kami'";
        const sectionsCount = Math.ceil(wordCount / 1000); // 1000 words per section
        
        // 2. BLUEPRINT PHASE (Generate Outline)
        setLoading(p => ({ ...p, progressMessage: `Designing Outline for ${wordCount} words...` }));
        
        const outlinePrompt = `
        Act as a Content Architect.
        Task: Create a detailed Table of Contents (Outline) for a **${wordCount}-word Ultimate Guide** titled "${title}".
        Target: Break this into exactly **${sectionsCount} Distinct Major Sections** (Chapters).
        
        Structure Requirements:
        - Section 1: Introduction (Hook + Problem Agitation + Thesis).
        - Middle Sections: Deep dive into technical details, strategies, comparisons, or case studies.
        - Last Section: Conclusion & Call to Action.
        
        Output Format: JSON Array of Strings (Section Titles Only).
        Example: ["Introduction: Why X Matters", "Chapter 1: The Basics", "Chapter 2: Advanced Strategy", ...]
        `;

        let sections: string[] = [];
        try {
            const outlineRes = await callGeminiWithRotation({ 
                model: 'gemini-3-flash-preview', 
                contents: outlinePrompt, 
                config: { responseMimeType: "application/json" } 
            });
            sections = JSON.parse(outlineRes.text || '[]');
        } catch (error) {
            console.warn("Outline Gen failed, retrying once...", error);
            await new Promise(r => setTimeout(r, 1000));
            const outlineResRetry = await callGeminiWithRotation({ 
                model: 'gemini-3-flash-preview', 
                contents: outlinePrompt, 
                config: { responseMimeType: "application/json" } 
            });
            sections = JSON.parse(outlineResRetry.text || '[]');
        }
        
        let fullContent = "";
        let previousContext = "";

        // 3. ASSEMBLY PHASE (Looping)
        for (let i = 0; i < sections.length; i++) {
            const sectionTitle = sections[i];
            const isFirst = i === 0;
            
            setLoading(p => ({ ...p, progressMessage: `Writing Section ${i + 1}/${sections.length}: ${sectionTitle}...` }));

            // Smart Context for Continuity
            let connectionInstruction = "";
            if (!isFirst) {
                connectionInstruction = `
                [CRITICAL CONTINUITY INSTRUCTION]
                This is Part ${i + 1} of the article.
                The PREVIOUS PART ended with these sentences: "...${previousContext.slice(-300)}..."
                
                **YOUR TASK:**
                1. Do NOT write a new introduction like "Welcome back" or "In this section".
                2. Start IMMEDIATELY by connecting to the previous thought.
                3. Maintain the flow as if it is one continuous text.
                `;
            } else {
                connectionInstruction = `Start with a strong Hook.`;
            }

            // SEO Linking Logic (Distribute links across sections)
            let linkInstruction = "";
            if (relatedPillarsData && relatedPillarsData.length > 0) {
                const linkTarget = relatedPillarsData[i % relatedPillarsData.length]; 
                linkInstruction = `Try to naturally mention and link to: [${linkTarget.title}](/articles/${linkTarget.slug}) in this section.`;
            }

            // NEW: PROJECT SHOWCASE INSTRUCTION (Inject randomly in middle sections)
            let galleryInstruction = "";
            if (galleryContextString && i === Math.floor(sections.length / 2)) {
                 galleryInstruction = `
                [PORTFOLIO SHOWCASE]
                Projects:
                ${galleryContextString}
                INSTRUCTION: If applicable, insert a "Project Card" shortcode here.
                Format: 
                [PROJECT: Title | /gallery/slug | ImageURL | Short Description]
                `;
            }

            const sectionPrompt = `
            Role: Expert Writer for PT Mesin Kasir Solo.
            Task: Write **Section ${i + 1}: ${sectionTitle}** for the article "${title}".
            Target Length for THIS section: **1000 words**.
            POV: ${pov}.
            Style: Detailed, Deep, Actionable. Use Subheaders (##, ###), Lists, and Bold text.
            Brand Context: ${BRAND_CONTEXT}
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

    // --- ENHANCED METADATA GENERATOR (SEO CATEGORY EXPANSION) ---
    const generateMeta = async (title: string, content: string) => {
        const generatedWordCount = content.split(/\s+/).length;
        const readTimeMin = Math.ceil(generatedWordCount / 200);
        
        // List existing base categories for context, but allow expansion
        const existingCategories = [
            "Bisnis Tips", "Manajemen", "Keuangan", "HR", "Franchise", 
            "Hardware Review", "Android POS", "Windows POS", "Teknologi", "Tutorial",
            "Digital Marketing", "Branding", "Loyalty Program", "Promosi"
        ].join(', ');

        const metaPrompt = `
        Role: Senior SEO Strategist for PT Mesin Kasir Solo.
        Task: Generate metadata for the article "${title}".
        Context Snippet: "${content.substring(0, 1000)}..."

        1. EXCERPT: Write a persuasive meta description (max 150 chars) containing the focus keyword.
        
        2. CATEGORY STRATEGY (CRITICAL):
           - Don't just use generic categories if a specific one is better for SEO.
           - Analyze the content for **Niche Keywords** with high traffic potential in Indonesia.
           - You can select from our standard list: [${existingCategories}].
           - **BETTER OPTION:** If a specific long-tail keyword represents the category better, USE IT. 
           - Examples of Expanded Categories: "Manajemen Stok", "Pajak UMKM", "Strategi Diskon", "Kasir Coffee Shop", "Pembukuan Digital".
           - The category must be short (2-3 words), Title Case, and sound like a professional blog section.

        Output JSON:
        { "excerpt": "...", "category": "..." }
        `;
        
        const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
        const metaData = JSON.parse(metaRes.text || '{}');
        
        return { ...metaData, readTime: `${readTimeMin} min read` };
    };

    // --- REVISED AI IMAGE GENERATOR WITH SEO OPTIMIZATION ---
    const getAIImageUrl = async (title: string, category: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 50); // Remove special chars for image prompt
        
        // 1. TIGHT CONTEXTUAL PROMPT ENGINEERING
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

        // Add quality boosters and negatives to avoid defects
        const qualityBoosters = "masterpiece, best quality, ultra realistic, 8k uhd, sharp focus, professional photography, perfect lighting, rule of thirds, cinematic look";
        const negativePrompt = ""; // Pollinations handles this via prompt engineering mostly, but we can try to be specific in the positive prompt to exclude things.

        const enhancedPrompt = `${qualityBoosters}, ${style} photography of ${cleanTitle}, ${visualContext}, highly detailed, authentic, --no text, --no watermark`;
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}&enhance=true`;
        
        if (!supabase) return { url: pollUrl, file: null };
        
        try {
            const res = await fetch(pollUrl);
            const blob = await res.blob();
            
            // 2. SEO FILENAME OPTIMIZATION (Before Cloudinary)
            // Create a file object with a slugified, keyword-rich filename
            const cleanFileName = `${slugify(title)}-${slugify(category)}-2025.jpg`;
            const file = new File([blob], cleanFileName, { type: "image/jpeg" });
            
            // Return Local Object URL for instant preview + The File for uploading
            const localUrl = URL.createObjectURL(blob);
            
            return { url: localUrl, file: file };
        } catch(e) { 
            console.error("AI Image Gen Error", e);
            return { url: pollUrl, file: null }; 
        }
    };

    return { loading, setLoading, trendingTopics, keywords, genConfig, setGenConfig, analyzeMarket, generateContent, getAIImageUrl, generateClusterIdeas };
};

// UPDATED: useArticleManager to accept GALLERY data and CONFIG
export const useArticleManager = (articles: Article[], setArticles: any, gallery: GalleryItem[] = [], config?: SiteConfig) => {
    const filterLogic = useArticleFilter(articles, 7);
    const aiLogic = useAIGenerator();

    const [personas, setPersonas] = useState<AuthorPersona[]>(() => {
        try { return JSON.parse(localStorage.getItem('mks_personas') || '') || AUTHOR_PRESETS; } catch (e) { return AUTHOR_PRESETS; }
    });
    const [activePersonaId, setActivePersonaId] = useState<string>('personal');
    const activePersona = personas.find(p => p.id === activePersonaId) || personas[0];
    const [selectedTones, setSelectedTones] = useState<string[]>(['gritty']); 

    // --- SOCIAL BROADCAST STATE (NEW) ---
    const [socialCaption, setSocialCaption] = useState('');
    const [selectedPlatforms, setSelectedPlatforms] = useState({ instagram: true, facebook: true, gmb: false });
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
        setSocialCaption(''); // Reset caption
        setAiStep(0); setSelectedPresets([]); setSelectedTones(['gritty']);
    };

    const handleEditClick = (item: Article) => {
        const matchedPersona = personas.find(p => item.author.includes(p.name));
        if (matchedPersona) setActivePersonaId(matchedPersona.id);
        const estimatedCount = item.content ? item.content.split(/\s+/).length : 1000;

        // FIXED: Handle incoming UTC ISO string properly using configured Timezone
        let formattedSchedule = '';
        if (item.scheduled_for && config?.timezone) {
            // Convert UTC DB time to Admin's configured Local Time for Input
            formattedSchedule = convertUTCToLocal(item.scheduled_for, config.timezone);
        } else if (item.scheduled_for) {
            // Fallback if no timezone configured (should not happen with default)
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
        setSocialCaption(''); // Clear previous caption
        setAiStep(2);
    };

    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true, progressMessage: 'Uploading Avatar...' }));
        try {
            let avatarUrl = URL.createObjectURL(file);
            
            // SEO OPTIMIZATION: Rename avatar file
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

            // UPLOAD LOGIC: If a file exists (Manual or AI Generated with SEO Filename)
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

            // --- FIXED: TIMEZONE HANDLING FOR SCHEDULED_FOR ---
            // We convert the Local Input Time (e.g. 07:00 WIB) to UTC ISO String
            // using the Admin's configured Timezone.
            let finalScheduledFor = null;
            if (form.status === 'scheduled' && form.scheduled_for) {
                if (config?.timezone) {
                    finalScheduledFor = convertLocalToUTC(form.scheduled_for, config.timezone);
                } else {
                    // Fallback to previous logic if no timezone set
                    const localDate = new Date(form.scheduled_for); 
                    finalScheduledFor = localDate.toISOString(); 
                }
            }

            const commonData = {
                title: form.title, excerpt: form.excerpt || '', content: form.content || '', 
                category: form.category || 'General', author: form.author, author_avatar: finalAuthorAvatar, 
                read_time: form.readTime, image_url: finalImageUrl, status: statusNormalized as any,
                scheduled_for: finalScheduledFor, // USE THE FIXED TIME
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

    // NEW: GENERATE CATEGORY FROM CONTEXT
    const runGenerateCategory = async () => {
        if (!form.title && !form.content) return alert("Mohon isi Judul atau Konten terlebih dahulu sebagai konteks.");
        
        aiLogic.setLoading(p => ({ ...p, researching: true, progressMessage: 'Brainstorming 5 Categories...' }));
        
        try {
            const contextText = form.content.length > 50 ? form.content.substring(0, 500) : form.title;
            const prompt = `
            Role: SEO Specialist for "Kasir Solo".
            Task: Analyze the context below and generate Article Categories/Tags.
            Context: "${contextText}"
            
            Constraint:
            - Generate EXACTLY 5 categories.
            - Strategy: Mix broad topics (e.g., "Bisnis Tips") with specific niche tags (e.g., "Manajemen Stok Gudang").
            - You CAN create NEW categories not in the list if they are relevant.
            - Format: Comma-separated string (e.g., "Bisnis, Keuangan, Tips, Kasir, UMKM").
            - Language: Indonesian.
            - Short (1-3 words per category).
            - Use Title Case.
            
            Output: JUST the comma-separated text.
            `;
            
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const newCatsString = result.text?.trim().replace(/['"]/g, '') || "";
            
            if (newCatsString) {
                setForm((prev: any) => {
                    const currentCats = prev.category ? prev.category.split(',').map((s: any) => s.trim()).filter(Boolean) : [];
                    const newCats = newCatsString.split(',').map(s => s.trim());
                    
                    // Merge and unique (Case insensitive check, preserve original casing)
                    const uniqueCats = [...currentCats];
                    newCats.forEach(newC => {
                        const exists = uniqueCats.some(existing => existing.toLowerCase() === newC.toLowerCase());
                        if (!exists) uniqueCats.push(newC);
                    });
                    
                    return { ...prev, category: uniqueCats.join(', ') };
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

    // --- NEW: SOCIAL BROADCAST ACTIONS ---
    const generateSocialCaption = async () => {
        if (!form.title) return alert("Judul artikel wajib diisi.");
        setSocialLoading(p => ({ ...p, generating: true }));
        try {
            const context = form.excerpt || form.content.substring(0, 300) || form.title;
            const prompt = `
            Role: Social Media Manager for "PT Mesin Kasir Solo".
            Task: Write a viral Instagram/Facebook caption to promote this article: "${form.title}".
            Context: ${context}.
            
            Style:
            - Professional but engaging (Edutainment).
            - Hook at the beginning.
            - Summarize key value.
            - Call to Action: "Baca selengkapnya di link bio" or similar.
            - Hashtags: #Bisnis #UMKM #KasirSolo #EdukasiBisnis.
            
            Output: JUST the caption text.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setSocialCaption(res.text?.trim() || '');
        } catch(e) { alert("Gagal generate caption."); }
        finally { setSocialLoading(p => ({ ...p, generating: false })); }
    };

    const broadcastArticle = async () => {
        if (!form.title) return alert("Simpan artikel terlebih dahulu untuk broadcast.");
        if (!socialCaption) return alert("Caption tidak boleh kosong.");
        
        // Safety Check for Local Blob URL
        if (form.imagePreview.startsWith('blob:')) {
            return alert("Gambar cover masih bersifat lokal. Mohon SIMPAN ARTIKEL dulu untuk upload gambar ke server, baru lakukan broadcast.");
        }
        if (!form.imagePreview) return alert("Artikel harus punya cover image untuk broadcast.");

        const activePlatforms = Object.entries(selectedPlatforms)
            .filter(([_, isActive]) => isActive)
            .map(([key]) => key);

        if (activePlatforms.length === 0) return alert("Pilih minimal 1 platform tujuan.");

        setSocialLoading(p => ({ ...p, posting: true }));

        try {
            const response = await fetch('/api/ayrshare', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caption: socialCaption,
                    image_url: form.imagePreview,
                    platforms: activePlatforms
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || "Gagal broadcast");

            alert(`Sukses! Broadcast artikel terkirim ke: ${activePlatforms.join(', ')}.`);
        } catch(e: any) {
            console.error("Broadcast Error:", e);
            alert(`Gagal broadcast: ${e.message}`);
        } finally {
            setSocialLoading(p => ({ ...p, posting: false }));
        }
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
