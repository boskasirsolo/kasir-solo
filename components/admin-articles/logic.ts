
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { supabase, CONFIG, callGeminiWithRotation, uploadToSupabase, processBackgroundMigration } from '../../utils';
import { KeywordData, GenConfig, ArticleFormState, FilterType, AuthorPersona, AUTHOR_PRESETS, NARRATIVE_TONES } from './types';

// --- BRAND CONTEXT KNOWLEDGE BASE ---
const BRAND_CONTEXT = `
[IDENTITAS PERUSAHAAN]
Nama: PT Mesin Kasir Solo.
Sejarah: Berdiri 2015, sempat "mati suri" & kehilangan aset digital pada 2022 akibat pandemi, kini bangkit kembali (Reborn 2025).
Karakter: Resilien (Tahan Banting), Jujur, Solutif, dan Berorientasi Komunitas.
Halaman About Reference: Kisah kegagalan adalah kekuatan kami. Kami mengerti perjuangan UMKM karena kami pernah di posisi terendah.

[PRODUK 1: SIBOS - Smart Integrated Back Office System]
- Definisi: Platform ekosistem ERP komplit, bukan sekadar POS biasa.
- Modul Utama: POS, CRM, IRM, HRM, Accounting, Omnichannel, dan AI.
- Platform: Android, iOS, Windows, Linux, dan Web-base.
- Target Bisnis: 
  1. Kuliner (Resto, F&B, Cafe).
  2. Ritel (Supermarket, Minimarket, Swalayan, Distributor, Grosir).
  3. Jasa, Bengkel, Fashion, Elektronik, Apotek/Farmasi.
  4. Industri Berat (Pabrik, Konstruksi, Pertambangan).
- Fitur "Killer" (Keunggulan Mutlak):
  1. **Multi Bisnis dalam 1 Akun**: Satu akun bisa handle bisnis Kuliner DAN Ritel sekaligus dengan flow berbeda.
  2. **Multi Outlet**: Mengelola banyak cabang tanpa batas.
  3. **Fleksibilitas Produk**: Multi varian, multi harga, multi satuan, multi ukuran, dan supports Transaksi Desimal.
  4. **Manufaktur/Produksi**: Hitung bahan baku (recipe/ingredients) dan penggabungan produk (bundling).
  5. **Database Server**: User bisa impor data produk pabrikan langsung dari server (tidak perlu input manual satu-satu).
  6. **Hardware Support**: Timbangan Digital, Printer Barcode, KDS (Kitchen Display System), Layar Pelanggan (CDS), Layar Dapur, Sistem Antrian.
  7. **Integrasi**: Website Usaha, WhatsApp API, Payment Gateway.
  8. **Omnichannel**: Terhubung ke Medsos, Marketplace, dan Website.
  9. **Google Business Profile Integration**: Sinkronisasi produk dan jam operasional langsung ke Profil Bisnis Google (GMB/Maps).
  10. **Hybrid Mode**: Bisa jalan Offline dan Online.
- **STATUS SAAT INI: WAITING LIST SUDAH DIBUKA**.
- **Akses**: Calon pengguna dapat mendaftar waiting list di website resmi (sibos.id) yang bisa diakses melalui halaman "Innovation" di website ini.
- Model Bisnis: Freemium (Standar Premium Gratis), Premium, Enterprise, Dedicated.
- Konsep Komunitas: Saham dibatasi max 5%, sistem Partner Piramida Terbalik (pemerataan income).

[PRODUK 2: QALAM]
- Definisi: Aplikasi Manajemen TPA/Pendidikan Islam Standar Premium.
- Biaya: GRATIS untuk lembaga <200 santri (Konsep Donasi & Subsidi Silang dari versi Enterprise).
- Fitur Unggulan: 
  1. Integrasi Civitas (Guru, Kyai, Staf), Wali, dan Donatur.
  2. Transparansi Keuangan.
  3. Integrasi AI (Laporan perkembangan santri otomatis, Konsultasi psikologis wali dengan Asisten Qalam).
  4. Payment Gateway & Whatsapp API.
- **STATUS SAAT INI: WAITING LIST SUDAH DIBUKA**.
- **Akses**: Calon pengguna dapat mendaftar waiting list di website resmi (qalam.id) yang bisa diakses melalui halaman "Innovation" di website ini.

[STRATEGI KONTEN]
Setiap artikel harus melakukan "Soft Selling" yang elegan. Posisikan SIBOS atau QALAM sebagai solusi masa depan. 
**Call To Action (CTA):** Arahkan pembaca untuk bergabung dalam Waiting List sekarang juga melalui halaman Innovation agar tidak ketinggalan akses Freemium.
`;

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

            if (filterType === 'all') return true; 
            if (filterType === 'pillar') return a.type === 'pillar';
            if (filterType === 'cluster') return a.type === 'cluster';
            if (filterType === 'orphan') return !a.pillar_id && a.type !== 'pillar';
            if (filterType === 'draft') return a.status === 'draft' || !a.status; 
            if (filterType === 'scheduled') return a.status === 'scheduled';
            return false;
        });
    }, [articles, searchTerm, filterType]);

    // Sorting: Newest First based on created_at
    const sortedList = useMemo(() => {
        return [...filteredList].sort((a, b) => {
            const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
            const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
            return dateB - dateA; // Descending
        });
    }, [filteredList]);

    const totalPages = Math.ceil(sortedList.length / itemsPerPage);
    const paginatedList = sortedList.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
            Act as a Senior SEO Strategist for the Indonesian Market working for PT Mesin Kasir Solo.
            Context: We sell POS Hardware, Website Services, and develop SIBOS (ERP) & QALAM (Edu App).
            Selected Topics: ${topics.join(', ')}.
            Task: Generate 10 high-potential article titles/keywords based on our products.
            Strict Output Format: JSON Array ONLY.
            Example: [{"keyword": "Judul", "volume": "High", "competition": "Low", "type": "Evergreen"}]
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

    const generateContent = async (title: string, tones: string[], type: string, authorName: string) => {
        setLoading(p => ({ ...p, generatingText: true }));
        try {
            // --- DETECT POV BASED ON AUTHOR ---
            const authorPreset = AUTHOR_PRESETS.find(p => p.name === authorName);
            const pov = authorPreset?.mode === 'personal' ? 'First Person (POV: "Gue" or "Saya"). Use Storytelling, sharing personal struggles/success as a Founder.' : 'Professional (POV: "Kami"). Trustworthy, Expert, Corporate Tone.';
            
            // --- COMPILE TONE DESCRIPTION ---
            const toneDescriptions = tones.map(t => {
                const def = NARRATIVE_TONES.find(nt => nt.id === t);
                return def ? `${def.label} (${def.desc})` : t;
            }).join(', ');

            // --- LOGIKA PANJANG ARTIKEL ---
            const isPillar = type === 'pillar';
            const lengthInstruction = isPillar 
                ? "EXTREME LENGTH REQUIREMENT: 4000 - 5000 WORDS. This is a Pillar Page. Must be exhaustive, covering every angle, history, future trends, and detailed guides."
                : "LENGTH REQUIREMENT: 700 - 1000 WORDS. This is a Cluster Article. Be specific, focused, and concise.";

            const structureInstruction = isPillar
                ? "Structure: Table of Contents, Deep Dive Introduction, Multiple H2 & H3 Chapters, Case Studies, FAQ Section, Conclusion."
                : "Structure: Direct Intro, 3-4 Key Points (H2), Conclusion.";

            const contentPrompt = `
            You are a Senior Content Writer for **PT Mesin Kasir Solo**.
            
            [BRAND KNOWLEDGE BASE]
            ${BRAND_CONTEXT}

            [TASK]
            Write an SEO Article about: "${title}".
            
            [REQUIREMENTS]
            1. Language: Indonesian (Fluent, Engaging, Human-like).
            2. **NARRATIVE & TONE:**
               - POV: ${pov}
               - Tone Mix: ${toneDescriptions}.
               - Instruction: Blend these tones naturally. If 'Storytelling' is selected, start with a hook/story. If 'Opinion' is selected, be bold.
            3. Article Type: ${type.toUpperCase()}.
            4. ${lengthInstruction}
            5. ${structureInstruction}
            6. **CRITICAL:** Integrate mentions of SIBOS or QALAM naturally where relevant. 
               - If topic is Business/Retail -> Mention SIBOS features (Anti-fraud, Multi-business, Google Business Profile Integration).
               - If topic is Education/Social -> Mention QALAM features.
               - If topic is Hardware -> Mention our resilience and after-sales support.
            
            Start writing the content directly in Markdown format.
            `;
            
            const contentRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            
            const metaPrompt = `
            Generate JSON Metadata for article "${title}". 
            1. "excerpt": Meta Description (max 160 chars). Persuasive.
            2. "category": Best fitting category based on title.
            3. "readTime": Estimate reading time based on ${isPillar ? '4000' : '800'} words (e.g. "${isPillar ? '20 min read' : '5 min read'}").
            Format: {"excerpt": "...", "category": "...", "readTime": "..."}
            `;
            const metaRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
            const metaData = JSON.parse(metaRes.text || '{}');

            return { content: contentRes.text || '', meta: metaData };
        } finally {
            setLoading(p => ({ ...p, generatingText: false }));
        }
    };

    const getAIImageUrl = async (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        const enhancedPrompt = `editorial photography of ${prompt}, ${style} style, modern tech office context, indonesia, 8k, detailed, no text`;
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
        
        // Fetch as blob to upload
        const res = await fetch(pollUrl);
        const blob = await res.blob();
        
        // Use Supabase for temporary hosting (Hybrid Strategy)
        // If not connected, return the pollUrl directly
        if (!supabase) return pollUrl;

        try {
            // Convert blob to File object
            const file = new File([blob], `ai_gen_${seed}.jpg`, { type: "image/jpeg" });
            const { url } = await uploadToSupabase(file, 'ai-temp');
            return url;
        } catch(e) {
            console.error("Supabase upload failed, using direct link", e);
            return pollUrl;
        }
    };

    return { loading, setLoading, keywords, genConfig, setGenConfig, researchKeywords, generateContent, getAIImageUrl };
};

// --- MAIN HOOK: ARTICLE MANAGER ---
export const useArticleManager = (articles: Article[], setArticles: any) => {
    const filterLogic = useArticleFilter(articles, 7);
    const aiLogic = useAIGenerator();

    const [authorPersona, setAuthorPersona] = useState<AuthorPersona>(() => {
        try {
            const saved = localStorage.getItem('mks_author_pref');
            return saved ? JSON.parse(saved) : AUTHOR_PRESETS[0];
        } catch (e) { return AUTHOR_PRESETS[0]; }
    });

    useEffect(() => {
        try { localStorage.setItem('mks_author_pref', JSON.stringify(authorPersona)); } catch (e) {}
    }, [authorPersona]);

    // Added selectedTones state
    const [selectedTones, setSelectedTones] = useState<string[]>(['story']); // Default

    const [form, setForm] = useState<ArticleFormState>({
        id: null, title: '', excerpt: '', content: '', category: '',
        readTime: '5 min read', imagePreview: '', uploadFile: null, 
        author: authorPersona.name,
        authorAvatar: authorPersona.avatar || '',
        uploadAuthorFile: null, 
        status: 'draft', scheduled_for: '',
        type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
    });

    const [aiStep, setAiStep] = useState(0);
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);

    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: '',
            author: authorPersona.name,
            authorAvatar: authorPersona.avatar || '', 
            uploadAuthorFile: null, 
            readTime: '5 min read', imagePreview: '', uploadFile: null, 
            status: 'draft', scheduled_for: '',
            type: 'cluster', pillar_id: 0, cluster_ideas: [], scheduleStart: ''
        });
        setAiStep(0);
        setSelectedPresets([]);
        setSelectedTones(['story']);
    };

    const handleEditClick = (item: Article) => {
        setForm({
            id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
            category: item.category, 
            author: item.author,
            authorAvatar: item.author_avatar || '', 
            uploadAuthorFile: null,
            readTime: item.readTime, imagePreview: item.image, uploadFile: null,
            status: item.status || 'draft', 
            scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.pillar_id || 0,
            cluster_ideas: item.cluster_ideas || [], scheduleStart: ''
        });
        setAiStep(3); 
    };

    // UPDATE: Handle Avatar Upload from PersonaSwitcher
    const updatePersonaAvatar = async (file: File) => {
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        try {
            let avatarUrl = '';
            
            // 1. Upload logic
            if (supabase) {
                const { url } = await uploadToSupabase(file, 'avatars');
                avatarUrl = url;
            } else {
                avatarUrl = URL.createObjectURL(file); // Fallback for local demo
            }

            // 2. Update Persona State
            setAuthorPersona(prev => ({ ...prev, avatar: avatarUrl }));

            // 3. Update current form if active author matches
            if (form.author === authorPersona.name) {
                setForm(prev => ({ ...prev, authorAvatar: avatarUrl }));
            }

        } catch (e) {
            console.error("Avatar Upload Failed", e);
            alert("Gagal upload foto profil.");
        } finally {
            aiLogic.setLoading(p => ({ ...p, uploading: false }));
        }
    };

    const saveArticle = async () => {
        if (!form.title) return alert("Judul wajib diisi.");
        aiLogic.setLoading(p => ({ ...p, uploading: true }));
        
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            let supabasePath = '';
            let fileToMigrate: File | null = form.uploadFile;

            // --- HYBRID UPLOAD STRATEGY ---
            if (form.uploadFile && supabase) {
                // 1. Upload to Supabase (Fast)
                const { url, path } = await uploadToSupabase(form.uploadFile);
                finalImageUrl = url;
                supabasePath = path;
            }

            const now = new Date().toISOString();
            const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            // Common Data for both Insert and Update (Including 'date')
            // UPDATE: Save author_avatar from Form or Active Persona
            const finalAuthorAvatar = form.authorAvatar || authorPersona.avatar;

            const commonData = {
                title: form.title, 
                excerpt: form.excerpt || '', 
                content: form.content || '', 
                category: form.category || 'General',
                author: form.author, 
                author_avatar: finalAuthorAvatar, // Save the avatar URL
                read_time: form.readTime, 
                image_url: finalImageUrl,
                status: form.status || 'draft',
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type, 
                pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas,
                date: dateStr // Restore date field for backward compatibility
            };

            let savedId = form.id;

            if (form.id) {
                // UPDATE MODE
                // Update Local State Optimistically
                setArticles((prev: Article[]) => prev.map(a => a.id === form.id ? { ...a, ...commonData, image: finalImageUrl } : a));
                
                if (supabase) {
                    const { error } = await supabase.from('articles').update(commonData).eq('id', form.id);
                    if (error) {
                        console.error("Supabase Update Error:", error);
                        throw new Error("Gagal update ke database: " + error.message);
                    }
                }
            } else {
                // INSERT MODE
                const insertData = { ...commonData, created_at: now };
                const tempId = Date.now();
                
                // Add to Local State Optimistically
                setArticles((prev: Article[]) => [{ ...insertData, id: tempId, image: finalImageUrl } as any, ...prev]);
                
                if (supabase) {
                    const { data, error } = await supabase.from('articles').insert([insertData]).select().single();
                    if (error) throw new Error("Gagal insert ke database: " + error.message);
                    if (data) savedId = data.id;
                }
            }

            // --- BACKGROUND MIGRATION ---
            if (supabasePath && fileToMigrate && savedId) {
                processBackgroundMigration(fileToMigrate, supabasePath, 'articles', savedId, 'image_url')
                    .then((cloudUrl) => {
                        if (cloudUrl) {
                            setArticles((prev: any[]) => prev.map(a => a.id === savedId ? { ...a, image: cloudUrl } : a));
                        }
                    });
            }

            resetForm();
            console.log("Artikel tersimpan:", form.status);
        } catch(e: any) {
            alert("Error: " + e.message);
        } finally {
            aiLogic.setLoading(p => ({ ...p, uploading: false }));
        }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel ini?")) return;
        setArticles((prev: Article[]) => prev.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    const runResearch = async () => {
        try { await aiLogic.researchKeywords(selectedPresets); setAiStep(1); } catch(e: any) { alert(e.message); }
    };
    const selectTopic = (k: any) => { setForm(p => ({ ...p, title: k.keyword })); setAiStep(2); };
    
    const runWrite = async () => {
        try {
            // Pass the selected Tones to the generator
            const { content, meta } = await aiLogic.generateContent(form.title, selectedTones, form.type, form.author);
            setForm(p => ({ ...p, content, excerpt: meta.excerpt, category: meta.category, readTime: meta.readTime }));
            setAiStep(3); 
        } catch(e: any) { alert(e.message); }
    };
    
    const runImage = async () => {
        aiLogic.setLoading(p => ({ ...p, generatingImage: true }));
        try {
            const selectedPreset = AUTHOR_PRESETS.find(p => p.name === form.author) || authorPersona;
            const style = selectedPreset.mode === 'personal' ? 'cinematic' : 'corporate';
            const url = await aiLogic.getAIImageUrl(form.title, style);
            setForm(p => ({ ...p, imagePreview: url }));
        } catch(e) { console.error(e); }
        finally { aiLogic.setLoading(p => ({ ...p, generatingImage: false })); }
    };

    return {
        form, setForm,
        filterLogic,
        aiLogic,
        authorPersona, setAuthorPersona, updatePersonaAvatar,
        aiState: { step: aiStep, setStep: setAiStep, selectedPresets, setSelectedPresets, keywords: aiLogic.keywords, selectedTones, setSelectedTones },
        actions: { resetForm, handleEditClick, saveArticle, deleteItem, runResearch, selectTopic, runWrite, runImage }
    };
};
