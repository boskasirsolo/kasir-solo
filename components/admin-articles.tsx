
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Target, List, CheckCircle2, RefreshCw, Eye, Image as ImageIcon, Wand2, LayoutTemplate, TrendingUp, User, Calendar, Clock, Check, Loader2, FileText, Palette, Link as LinkIcon, Crown, Network, CalendarClock, Zap, ChevronDown, ChevronUp, MoreVertical, ArrowLeft, Mic, Camera, Users } from 'lucide-react';
import { Article } from '../types';
import { Button, Input, TextArea, LoadingSpinner, Badge } from './ui';
import { supabase, CONFIG, ensureAPIKey, getEnv, slugify, callGeminiWithRotation } from '../utils';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

// --- CONSTANTS ---
const PRESET_TOPICS = [
    { id: 'fnb', label: 'Bisnis Kuliner (F&B)' },
    { id: 'retail', label: 'Retail & Minimarket' },
    { id: 'tech', label: 'Teknologi Kasir (POS)' },
    { id: 'finance', label: 'Keuangan & Pajak' },
    { id: 'marketing', label: 'Digital Marketing' },
    { id: 'hr', label: 'Manajemen Karyawan' },
    { id: 'franchise', label: 'Sistem Franchise' },
    { id: 'scam', label: 'Keamanan & Fraud' }
];

// --- INTERFACES ---
interface KeywordData {
    keyword: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
    type: 'Trend' | 'Evergreen' | 'Niche';
}

interface GenConfig {
    autoImage: boolean;
    autoCategory: boolean;
    autoAuthor: boolean;
    imageStyle: 'cinematic' | 'cyberpunk' | 'corporate' | 'studio' | 'minimalist';
    narrative: 'narsis' | 'umum'; // New field for Narrative Style
}

// --- HELPER: TEXT RENDERER (Shared - Supports Bold & Links) ---
const renderInline = (text: string) => {
    // 1. Split by Links [text](url) - Allow optional whitespace \s* between ] and (
    const linkParts = text.split(/(\[.*?\]\s*\(.*?\))/g);
    
    return linkParts.map((part, i) => {
        // Handle Link - Regex also allows optional whitespace
        const linkMatch = part.match(/^\[(.*?)\]\s*\((.*?)\)$/);
        if (linkMatch) {
            return (
                <Link key={i} to={linkMatch[2]} className="text-brand-orange hover:text-white underline decoration-brand-orange/50 hover:decoration-white transition-all font-medium">
                    {linkMatch[1]}
                </Link>
            );
        }

        // 2. Split non-link parts by Bold **text**
        const boldParts = part.split(/(\*\*.*?\*\*)/g);
        return (
            <span key={i}>
                {boldParts.map((subPart, j) => {
                    if (subPart.startsWith('**') && subPart.endsWith('**')) {
                        return <strong key={j} className="text-white font-bold">{subPart.slice(2, -2)}</strong>;
                    }
                    return subPart;
                })}
            </span>
        );
    });
};

// --- HELPER: MARKDOWN TABLE ---
const MarkdownTable = ({ content }: { content: string }) => {
    const rows = content.trim().split('\n');
    if (rows.length < 2) return <pre className="text-xs">{content}</pre>;

    const headers = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const bodyRows = rows.slice(2); // Skip separator row

    return (
        <div className="overflow-x-auto my-4 rounded-lg border border-white/10 bg-black/20">
            <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-white/5 text-brand-orange uppercase text-[10px] font-bold tracking-wider">
                    <tr>
                        {headers.map((h, i) => (
                            <th key={i} className="px-4 py-3 border-b border-white/10">{renderInline(h)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {bodyRows.map((row, idx) => {
                        const cells = row.split('|').filter((c, i, arr) => {
                             if (i === 0 && c === '') return false;
                             if (i === arr.length - 1 && c === '') return false;
                             return true;
                        });
                        return (
                            <tr key={idx} className="hover:bg-white/5 transition-colors">
                                {cells.map((c, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3 border-r border-white/5 last:border-0 text-gray-300 align-top">
                                        {renderInline(c.trim())}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// --- HELPER: MARKDOWN RENDERER ---
const SimpleMarkdown = ({ content }: { content: string }) => {
    if (!content) return <div className="text-gray-600 italic">Preview konten akan muncul di sini...</div>;
    
    // Split content but group tables
    const lines = content.split('\n');
    const blocks: { type: string, content: string }[] = [];
    let tableBuffer: string[] = [];

    lines.forEach(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('|')) {
            tableBuffer.push(line);
        } else {
            if (tableBuffer.length > 0) {
                blocks.push({ type: 'table', content: tableBuffer.join('\n') });
                tableBuffer = [];
            }
            if (trimmed !== '') {
                blocks.push({ type: 'text', content: line });
            } else {
                blocks.push({ type: 'break', content: '' });
            }
        }
    });
    // Flush remaining table
    if (tableBuffer.length > 0) {
        blocks.push({ type: 'table', content: tableBuffer.join('\n') });
    }

    return (
        <div className="prose prose-invert prose-sm max-w-none space-y-2">
            {blocks.map((block, i) => {
                if (block.type === 'table') {
                    return <MarkdownTable key={i} content={block.content} />;
                }
                
                const line = block.content;
                if (block.type === 'break') return <div key={i} className="h-2"></div>;

                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-white mt-6 mb-4 border-b border-brand-orange/30 pb-2">{line.replace('# ', '')}</h1>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-brand-orange mt-8 mb-3">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-gray-200 mt-6 mb-2">{line.replace('### ', '')}</h3>;
                if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-gray-300 pl-2">{renderInline(line.replace('- ', ''))}</li>;
                if (line.startsWith('1. ')) return <li key={i} className="ml-4 list-decimal text-gray-300 pl-2">{renderInline(line.replace(/^\d+\.\s/, ''))}</li>;
                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-brand-orange pl-4 italic text-gray-400 my-4 bg-white/5 py-2 pr-2 rounded-r">{renderInline(line.replace('> ', ''))}</blockquote>;
                
                return <p key={i} className="text-gray-300 leading-relaxed text-justify">{renderInline(line)}</p>;
            })}
        </div>
    );
};

// --- COMPONENT: PROGRESS BAR ---
const GenerationProgress = ({ percent, message, color = 'orange' }: { percent: number, message: string, color?: 'orange' | 'blue' | 'green' }) => (
    <div className={`w-full bg-brand-dark border rounded-lg p-3 relative overflow-hidden animate-fade-in ${color === 'orange' ? 'border-brand-orange/30' : color === 'blue' ? 'border-blue-500/30' : 'border-green-500/30'}`}>
        <div className="flex justify-between items-center mb-2 relative z-10">
            <span className={`text-xs font-bold animate-pulse ${color === 'orange' ? 'text-brand-orange' : color === 'blue' ? 'text-blue-400' : 'text-green-400'}`}>{message}</span>
            <span className="text-xs font-mono text-gray-400">{percent}%</span>
        </div>
        <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 relative z-10">
            <div 
                className={`h-full transition-all duration-500 ease-out ${color === 'orange' ? 'bg-gradient-to-r from-brand-orange to-brand-action' : color === 'blue' ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gradient-to-r from-green-600 to-green-400'}`}
                style={{ width: `${percent}%` }}
            ></div>
        </div>
        <div className={`absolute inset-0 z-0 opacity-10 ${color === 'orange' ? 'bg-brand-orange' : color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}></div>
    </div>
);

// --- LOGIC: Custom Hook ---
const useArticleManager = (
    articles: Article[], 
    setArticles: (a: Article[]) => void
) => {
    // GLOBAL AUTHOR SETTINGS (UPDATED: Dual Profile)
    const [authorProfiles, setAuthorProfiles] = useState({
        personal: {
            name: 'Amin Maghfuri',
            avatar: '', // URL
            file: null as File | null
        },
        team: {
            name: 'Redaksi KasirSolo',
            avatar: '', // URL
            file: null as File | null
        }
    });

    // AI Flow State
    const [aiStep, setAiStep] = useState<number>(0); 
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true,
        autoCategory: true,
        autoAuthor: true,
        imageStyle: 'cinematic',
        narrative: 'narsis' 
    });

    // Basic Form State
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: authorProfiles.personal.name,
        authorAvatar: authorProfiles.personal.avatar, 
        uploadAuthorFile: null as File | null,
        readTime: '10 min read', 
        imagePreview: '',
        uploadFile: null as File | null,
        status: 'draft' as 'published' | 'draft' | 'scheduled',
        scheduled_for: '',
        // STRATEGY FIELDS
        type: 'cluster' as 'pillar' | 'cluster',
        pillar_id: 0 as number,
        cluster_ideas: [] as string[],
        scheduleStart: '' 
    });

    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);

    // Sync form with global author profile when narrative changes or profile updates
    useEffect(() => {
        if (!form.id) {
            const target = genConfig.narrative === 'narsis' ? authorProfiles.personal : authorProfiles.team;
            setForm(p => ({
                ...p,
                author: target.name,
                authorAvatar: target.avatar,
                uploadAuthorFile: target.file // Inherit file if exists for upload
            }));
        }
    }, [authorProfiles, genConfig.narrative, form.id]);

    const handleProfileChange = (type: 'personal' | 'team', file: File | undefined) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAuthorProfiles(prev => ({
            ...prev,
            [type]: { ...prev[type], avatar: url, file: file }
        }));
    };

    // Loading & Progress States (Split)
    const [loading, setLoading] = useState({
        uploading: false,
        researching: false,
        generatingText: false,
        generatingImage: false,
        generatingClusters: false,
        scheduling: false
    });
    
    const [textProgress, setTextProgress] = useState({ percent: 0, message: '' });
    const [imageProgress, setImageProgress] = useState({ percent: 0, message: '' });

    // UI States
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedPillarId, setExpandedPillarId] = useState<number | null>(null);

    // Filter Logic for List (Shows Pillars OR Standalone articles)
    const filteredPillars = articles.filter(a => {
        const isPillar = a.type === 'pillar' || !a.type; 
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        return isPillar && matchesSearch;
    });

    const totalPages = Math.ceil(filteredPillars.length / ITEMS_PER_PAGE);
    const paginatedPillars = filteredPillars.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const availablePillars = articles.filter(a => a.type === 'pillar');

    const resetForm = () => {
        const defaultProfile = authorProfiles.personal;
        setForm({
            id: null,
            title: '',
            excerpt: '',
            content: '',
            category: '',
            author: defaultProfile.name,
            authorAvatar: defaultProfile.avatar,
            uploadAuthorFile: defaultProfile.file,
            readTime: '10 min read',
            imagePreview: '',
            uploadFile: null,
            status: 'draft',
            scheduled_for: '',
            type: 'cluster',
            pillar_id: 0,
            cluster_ideas: [],
            scheduleStart: ''
        });
        setAiStep(0);
        setKeywords([]);
        setSelectedKeyword(null);
        setSelectedPresets([]);
        setTextProgress({ percent: 0, message: '' });
        setImageProgress({ percent: 0, message: '' });
        // Reset config default
        setGenConfig(p => ({...p, narrative: 'narsis'}));
    };

    const togglePreset = (label: string) => {
        setSelectedPresets(prev => 
            prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]
        );
    };

    const handleEditClick = (item: Article) => {
        const itemAny = item as any;
        
        setForm({
            id: item.id,
            title: item.title,
            excerpt: item.excerpt,
            content: item.content,
            category: item.category,
            author: item.author,
            authorAvatar: itemAny.author_avatar || '',
            uploadAuthorFile: null,
            readTime: item.readTime,
            imagePreview: item.image,
            uploadFile: null,
            status: item.status || 'published',
            scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster',
            pillar_id: item.type === 'pillar' ? item.id : (item.pillar_id || 0),
            cluster_ideas: item.cluster_ideas || [],
            scheduleStart: ''
        });
        setAiStep(3); 
    };

    const researchKeywords = async () => {
        if (selectedPresets.length === 0) return alert("Pilih minimal 1 topik.");
        
        setLoading(prev => ({ ...prev, researching: true }));
        setKeywords([]); 

        try {
            const prompt = `
            Role: SEO Strategist for Indonesian Market.
            Context: POS System (Kasir) & Business Management.
            Topics: ${selectedPresets.join(', ')}.
            Task: Generate 5 high-potential article titles/keywords.
            Format: JSON Array of objects with keys: "keyword", "volume" (estimate), "competition" (Low/Medium/High), "type" (Trend/Evergreen).
            Strict JSON only.
            `;

            // USE CENTRALIZED ROTATION CALLER
            const result = await callGeminiWithRotation({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const text = result.text || '[]';
            let data = [];
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("JSON parse error", e);
            }
            
            if (Array.isArray(data)) {
                setKeywords(data);
                setAiStep(1);
            } else {
                throw new Error("Invalid format from AI");
            }

        } catch (e: any) {
            console.error(e);
            alert("Gagal riset keyword: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, researching: false }));
        }
    };

    const selectTopic = (k: KeywordData) => {
        setSelectedKeyword(k);
        setForm(prev => ({ ...prev, title: k.keyword }));
        setAiStep(2);
    };

    // --- UTILS: IMAGE GENERATOR ---
    const getAIImageUrl = (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        
        // 1. Clean Prompt Aggressively for Pollinations URL
        // Take max 80 chars, remove special characters except spaces to prevent URL breakage
        let cleanPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, '');
        cleanPrompt = cleanPrompt.substring(0, 80).trim();

        let styleKeywords = "";
        switch(style) {
            case 'cinematic': styleKeywords = "cinematic lighting realistic 8k"; break;
            case 'cyberpunk': styleKeywords = "cyberpunk neon futuristic"; break;
            case 'corporate': styleKeywords = "modern office professional"; break;
            case 'studio': styleKeywords = "studio lighting minimal product"; break;
            case 'minimalist': styleKeywords = "minimalist flat design"; break;
            default: styleKeywords = "high quality";
        }
        
        // 2. Construct Safe URL
        const finalPrompt = `${cleanPrompt} ${styleKeywords}`;
        
        // Using Flux model with explicit encoding and nologo
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
    };

    const generateTextContent = async () => {
        if (!form.title) return alert("Pilih judul terlebih dahulu.");
        
        setLoading(prev => ({ ...prev, generatingText: true }));
        setTextProgress({ percent: 5, message: 'Menyiapkan strategi konten...' });

        try {
            // Narrative Logic
            let narrativeInstruction = "";
            let authorName = "Redaksi KasirSolo";

            if (genConfig.narrative === 'narsis') {
                authorName = authorProfiles.personal.name || "Amin Maghfuri (CEO)";
                narrativeInstruction = `
                **NARRATIVE STYLE: PERSONAL & AUTHORITATIVE (Narsis/CEO POV)**
                - Role: Write as **${authorName}**, the CEO of PT Mesin Kasir Solo.
                - Tone: Experienced, inspiring, confident, using "Saya" or "Aku".
                `;
            } else {
                authorName = authorProfiles.team.name || "Redaksi KasirSolo";
                narrativeInstruction = `
                **NARRATIVE STYLE: GENERAL / EDITORIAL**
                - Role: Editorial Team (${authorName}).
                - Tone: Objective, journalistic, using "Kami" or third person.
                `;
            }

            let strategyContext = "";
            let lengthReq = "Minimum 1000 words";
            let clusterInstruction = "";
            let structureInstruction = "Create 5-7 Major Subheadings (H2).";

            if (form.type === 'pillar') {
                strategyContext = `STRATEGY: This is a **PILLAR PAGE**. MEGA GUIDE.`;
                lengthReq = "Aim for 3000-4000 words.";
                structureInstruction = "Create 8-12 Major Subheadings (H2).";
                clusterInstruction = `BONUS TASK: Provide JSON block of 10 Cluster Titles at end. Format: ---CLUSTER_JSON_START--- ["Title 1", ...] ---CLUSTER_JSON_END---`;
            } else {
                const parentPillar = availablePillars.find(p => p.id === form.pillar_id);
                const pillarTitle = parentPillar ? parentPillar.title : "Panduan Lengkap Bisnis";
                const pillarLink = `/articles/${slugify(pillarTitle)}`;
                strategyContext = `STRATEGY: CLUSTER CONTENT. Parent: "${pillarTitle}". Link back to parent as [${pillarTitle}](${pillarLink}).`;
                lengthReq = "Maximum 800 words.";
            }

            setTextProgress({ percent: 20, message: `Menulis Artikel...` });
            
            const contentPrompt = `
            Task: Write Article "${form.title}"
            ${narrativeInstruction}
            ${strategyContext}
            
            MANDATORY PROMOTION (Soft Selling):
            - Must mention that "PT Mesin Kasir Solo" is developing 2 major platforms releasing in **2026**.
            - 1. **SIBOS** (Smart Integrated Back Office System) for business management.
            - 2. **QALAM** for education management (TPA/Pesantren).
            - Call to Action: Join Waiting List at **sibos.my.id** and **qalam.id**.
            - Placement: Insert naturally in "Future Solutions" section or "Conclusion".

            STRUCTURE: # Headline, Intro, ${structureInstruction}, FAQ, Conclusion (with Promo).
            LENGTH: ${lengthReq}
            LANG: Indonesian.
            ${clusterInstruction}
            `;

            // USE CENTRALIZED ROTATION CALLER
            const contentResponse = await callGeminiWithRotation({ 
                model: 'gemini-3-flash-preview', 
                contents: contentPrompt,
                config: { maxOutputTokens: 8192 } 
            });
            
            let generatedContent = contentResponse.text || '# Error generating text.';
            let extractedClusters: string[] = [];

            if (form.type === 'pillar') {
                const jsonStart = generatedContent.indexOf('---CLUSTER_JSON_START---');
                const jsonEnd = generatedContent.indexOf('---CLUSTER_JSON_END---');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonStr = generatedContent.substring(jsonStart + 24, jsonEnd);
                    try { extractedClusters = JSON.parse(jsonStr); } catch (e) {}
                    generatedContent = generatedContent.substring(0, jsonStart).trim();
                }
            }
            
            setTextProgress({ percent: 80, message: 'Metadata...' });
            
            const metaPrompt = `Based on: "${generatedContent.substring(0, 1000)}..." Generate JSON: { "excerpt": "...", "category": "...", "readTime": "..." }`;
            const metaResponse = await callGeminiWithRotation({ 
                model: 'gemini-3-flash-preview', 
                contents: metaPrompt, 
                config: { responseMimeType: "application/json" } 
            });
            
            let metaData = { excerpt: "", category: "Business", readTime: "5 min read" };
            try { metaData = JSON.parse(metaResponse.text || '{}'); } catch(e) {}

            setTextProgress({ percent: 100, message: 'Selesai!' });
            setForm(prev => ({
                ...prev,
                content: generatedContent,
                excerpt: metaData.excerpt || prev.excerpt,
                category: genConfig.autoCategory ? metaData.category : prev.category,
                author: authorName, 
                readTime: metaData.readTime || "10 min read",
                cluster_ideas: extractedClusters
            }));

        } catch (e: any) {
            alert("Gagal: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, generatingText: false }));
        }
    };

    const generateImageContent = async () => {
        if (!form.title) return alert("Judul artikel diperlukan untuk konteks gambar.");
        setLoading(prev => ({ ...prev, generatingImage: true }));
        setImageProgress({ percent: 20, message: 'Merancang visual...' });

        try {
             // More specific prompt for prompt generation to avoid complex characters
             const prompt = `Create a short, simple English image description (max 10 words) for an article titled: "${form.title}". Style: ${genConfig.imageStyle}. Avoid quotes or special chars.`;
             
             // USE CENTRALIZED ROTATION CALLER
             const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
             // Clean result from potential quotes Gemini might add
             const imagePrompt = (result.text || form.title).replace(/['"]/g, '');

             setImageProgress({ percent: 60, message: 'Rendering...' });
             const url = getAIImageUrl(imagePrompt, genConfig.imageStyle);
             
             setForm(prev => ({ ...prev, imagePreview: url }));
             setImageProgress({ percent: 100, message: 'Selesai!' });
        } catch(e) {
             console.error("AI Image Prompt Generation Failed, using title fallback", e);
             const url = getAIImageUrl(form.title, genConfig.imageStyle);
             setForm(prev => ({ ...prev, imagePreview: url }));
        } finally { 
             setLoading(prev => ({ ...prev, generatingImage: false })); 
        }
    };
    
    const scheduleClusters = async () => { 
        alert("Fitur penjadwalan otomatis akan segera hadir.");
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            let finalAuthorAvatar = form.authorAvatar || authorProfiles.personal.avatar;

            // 1. Upload Cover
            if (form.uploadFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                finalImageUrl = data.secure_url;
            }

            // 2. Upload Author Avatar (If new file selected in settings OR editor)
            if (form.uploadAuthorFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                 const formData = new FormData();
                 formData.append('file', form.uploadAuthorFile);
                 formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                 const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                 const data = await res.json();
                 finalAuthorAvatar = data.secure_url;
                 // Note: We don't necessarily update the global state here to avoid confusion, 
                 // but in a real app, you might want to save this to user settings.
            }

            const dbData = {
                title: form.title,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                read_time: form.readTime,
                image_url: finalImageUrl,
                status: form.status,
                scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type,
                pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas,
                author_avatar: finalAuthorAvatar
            };

            if (form.id) {
                const existing = articles.find(a => a.id === form.id);
                setArticles(articles.map(a => a.id === form.id ? { ...existing, ...dbData, image: finalImageUrl } as any : a));
                if (supabase) await supabase.from('articles').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setArticles([{ ...dbData, id: newId, image: finalImageUrl } as any, ...articles]);
                if (supabase) await supabase.from('articles').insert([dbData]);
                resetForm();
            }
            alert(`Artikel berhasil disimpan!`);
        } catch (e: any) { 
            alert(`Gagal menyimpan: ${e.message}`); 
        } finally { 
            setLoading(prev => ({ ...prev, uploading: false })); 
        }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel ini?")) return;
        setArticles(articles.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    return {
        form, setForm,
        authorProfiles, setAuthorProfiles, handleProfileChange, // Exported
        loading,
        progress: { text: textProgress, image: imageProgress },
        aiState: { step: aiStep, setStep: setAiStep, keywords, selectedKeyword, genConfig, setGenConfig, selectedPresets, togglePreset },
        actions: { researchKeywords, selectTopic, generateTextContent, generateImageContent, handleSubmit, handleEditClick, resetForm, deleteItem, scheduleClusters },
        listData: { 
            paginated: paginatedPillars, 
            totalPages, 
            page, 
            setPage, 
            searchTerm, 
            setSearchTerm,
            expandedPillarId,
            setExpandedPillarId
        },
        availablePillars
    };
};

export const AdminArticles = ({ 
  articles, 
  setArticles 
}: { 
  articles: Article[], 
  setArticles: (a: Article[]) => void 
}) => {
  const { form, setForm, authorProfiles, setAuthorProfiles, handleProfileChange, loading, progress, aiState, actions, listData, availablePillars } = useArticleManager(articles, setArticles);

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b">
      
      {/* 1. LEFT COLUMN: PILLAR LIST & AUTHOR SETTINGS */}
      <div className="w-[30%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[300px]">
         
         {/* AUTHOR PROFILE SETTINGS (NEW PLACEMENT: TOP OF LEFT COLUMN) */}
         <div className="p-4 border-b border-white/5 bg-brand-card/50">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
               <User size={12}/> Identitas Penulis (Default)
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
                {/* 1. PERSONAL */}
                <div className="bg-black/20 p-2 rounded border border-white/5 hover:border-brand-orange/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative group w-8 h-8 rounded-full border border-white/10 bg-black overflow-hidden shrink-0 cursor-pointer hover:border-brand-orange transition-colors">
                            <img src={authorProfiles.personal.avatar || "https://via.placeholder.com/100"} className="w-full h-full object-cover" />
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => handleProfileChange('personal', e.target.files?.[0])}
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={10} className="text-white"/>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Personal</span>
                    </div>
                    <input 
                        type="text" 
                        value={authorProfiles.personal.name}
                        onChange={(e) => setAuthorProfiles(p => ({...p, personal: {...p.personal, name: e.target.value}}))}
                        className="w-full bg-transparent border-b border-white/10 text-[10px] font-bold text-white focus:outline-none focus:border-brand-orange pb-1 placeholder-gray-600"
                        placeholder="Nama CEO..."
                    />
                </div>

                {/* 2. TEAM */}
                <div className="bg-black/20 p-2 rounded border border-white/5 hover:border-blue-500/30 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="relative group w-8 h-8 rounded-full border border-white/10 bg-black overflow-hidden shrink-0 cursor-pointer hover:border-blue-500 transition-colors">
                            <img src={authorProfiles.team.avatar || "https://via.placeholder.com/100"} className="w-full h-full object-cover" />
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={(e) => handleProfileChange('team', e.target.files?.[0])}
                            />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Users size={10} className="text-white"/>
                            </div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase">Redaksi</span>
                    </div>
                    <input 
                        type="text" 
                        value={authorProfiles.team.name}
                        onChange={(e) => setAuthorProfiles(p => ({...p, team: {...p.team, name: e.target.value}}))}
                        className="w-full bg-transparent border-b border-white/10 text-[10px] font-bold text-white focus:outline-none focus:border-blue-500 pb-1 placeholder-gray-600"
                        placeholder="Nama Tim..."
                    />
                </div>
            </div>
         </div>

         {/* ARSIP HEADER */}
         <div className="p-4 border-b border-white/5">
            <div className="flex justify-between items-center mb-3">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <List size={12}/> Arsip Artikel
                </h4>
                <button 
                    onClick={actions.resetForm}
                    className="text-[10px] font-bold text-brand-orange hover:text-white transition-colors flex items-center gap-1 border border-brand-orange/30 px-2 py-1 rounded hover:bg-brand-orange/10"
                >
                    <Plus size={10} /> BARU
                </button>
            </div>
            <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
                <input 
                    type="text" 
                    value={listData.searchTerm}
                    onChange={(e) => listData.setSearchTerm(e.target.value)}
                    placeholder="Cari artikel pilar..." 
                    className="w-full bg-brand-card border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-brand-orange"
                />
            </div>
         </div>
         
         {/* LIST */}
         <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {listData.paginated.map((pillar: Article) => {
                const isExpanded = listData.expandedPillarId === pillar.id;
                const linkedClusters = articles.filter(a => a.pillar_id === pillar.id);
                
                return (
                    <div 
                        key={pillar.id}
                        className={`rounded-lg border transition-all overflow-hidden ${
                            isExpanded ? 'border-brand-orange/50 bg-white/5' : 'border-white/5 hover:border-white/20 bg-brand-card'
                        }`}
                    >
                        <div 
                            className="p-3 cursor-pointer flex gap-3 items-center"
                            onClick={() => {
                                listData.setExpandedPillarId(isExpanded ? null : pillar.id);
                                if (!isExpanded) {
                                    setForm(prev => ({...prev, pillar_id: pillar.id}));
                                }
                            }}
                        >
                            <img src={pillar.image} className="w-10 h-10 rounded object-cover bg-black" />
                            <div className="flex-1 min-w-0">
                                <h5 className={`text-[11px] font-bold truncate leading-tight ${isExpanded ? 'text-brand-orange' : 'text-white'}`}>
                                    {pillar.title}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[9px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1.5 rounded-full flex items-center gap-1">
                                        <Crown size={8}/> PILAR
                                    </span>
                                    <span className="text-[9px] text-gray-500">
                                        {linkedClusters.length} Cluster
                                    </span>
                                </div>
                            </div>
                            {isExpanded ? <ChevronUp size={14} className="text-gray-500"/> : <ChevronDown size={14} className="text-gray-500"/>}
                        </div>

                        {isExpanded && (
                            <div className="bg-black/20 border-t border-white/5 p-3 animate-fade-in">
                                <div className="flex gap-2 mb-3">
                                    <button 
                                        onClick={() => actions.handleEditClick(pillar)}
                                        className="flex-1 py-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center gap-1"
                                    >
                                        <Edit size={10} /> Edit Pilar
                                    </button>
                                    <button 
                                        onClick={() => actions.deleteItem(pillar.id)}
                                        className="py-1.5 px-3 text-[10px] font-bold text-red-400 bg-red-900/20 hover:bg-red-900/40 rounded border border-red-900/30"
                                    >
                                        <Trash2 size={10} />
                                    </button>
                                </div>
                                <h6 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Network size={10}/> Artikel Cluster ({linkedClusters.length})
                                </h6>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                    {linkedClusters.length > 0 ? (
                                        linkedClusters.map(cluster => (
                                            <div 
                                                key={cluster.id}
                                                onClick={() => actions.handleEditClick(cluster)}
                                                className={`p-2 rounded border border-white/5 hover:border-brand-orange/30 cursor-pointer flex gap-2 items-center group transition-colors ${form.id === cluster.id ? 'bg-brand-orange/10 border-brand-orange' : 'bg-white/5'}`}
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-gray-300 truncate group-hover:text-brand-orange transition-colors">{cluster.title}</p>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); actions.deleteItem(cluster.id); }}
                                                    className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-3 border border-dashed border-white/10 rounded">
                                            <p className="text-[9px] text-gray-500 mb-1">Belum ada cluster.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
         </div>

         {/* Pagination Footer */}
         {listData.totalPages > 1 && (
            <div className="p-3 border-t border-white/5 bg-brand-dark flex justify-between items-center">
                <button onClick={() => listData.setPage(p => Math.max(1, p - 1))} disabled={listData.page === 1} className="p-1.5 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30"><ChevronLeft size={16} /></button>
                <span className="text-[10px] font-bold text-gray-400">Hal {listData.page} / {listData.totalPages}</span>
                <button onClick={() => listData.setPage(p => Math.min(listData.totalPages, p + 1))} disabled={listData.page === listData.totalPages} className="p-1.5 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
         )}
      </div>

      {/* 2. CENTER COLUMN: EDITOR / AI STUDIO */}
      <div className="w-[30%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[350px]">
         <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {form.id ? <Edit size={14} className="text-brand-orange"/> : <Sparkles size={14} className="text-brand-orange"/>}
                {form.id ? "Editor" : "AI Studio"}
            </h3>
            {form.id || aiState.step > 0 ? (
                <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 border border-red-500/20 px-2 py-1 rounded bg-red-500/10">
                    {form.id ? <ArrowLeft size={10} /> : <RefreshCw size={10} />}
                    {form.id ? "Kembali" : "Reset"}
                </button>
            ) : null}
         </div>

         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {/* STRATEGY TOGGLE (Always Visible at Step 0) */}
            {!form.id && aiState.step === 0 && (
                <div className="mb-6 bg-white/5 p-3 rounded-lg border border-white/10">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Pilih Strategi Konten</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setForm(p => ({...p, type: 'cluster'}))}
                            className={`p-3 rounded-lg border transition-all text-left relative ${
                                form.type === 'cluster' 
                                ? 'bg-blue-500/10 border-blue-500 text-white' 
                                : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'
                            }`}
                        >
                            <Network size={16} className="mb-2"/>
                            <div className="font-bold text-xs">Cluster</div>
                            <div className="text-[9px] opacity-70">Artikel Pendukung</div>
                            {form.type === 'cluster' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-blue-500"/>}
                        </button>
                        <button 
                            onClick={() => setForm(p => ({...p, type: 'pillar'}))}
                            className={`p-3 rounded-lg border transition-all text-left relative ${
                                form.type === 'pillar' 
                                ? 'bg-yellow-500/10 border-yellow-500 text-white' 
                                : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'
                            }`}
                        >
                            <Crown size={16} className="mb-2"/>
                            <div className="font-bold text-xs">Pillar Page</div>
                            <div className="text-[9px] opacity-70">Konten Utama</div>
                            {form.type === 'pillar' && <CheckCircle2 size={14} className="absolute top-2 right-2 text-yellow-500"/>}
                        </button>
                    </div>

                    {/* Show Dropdown if Cluster */}
                    {form.type === 'cluster' && (
                        <div className="mt-3 animate-fade-in">
                            <label className="text-[9px] text-gray-500 mb-1 block">Induk Artikel (Pillar)</label>
                            <select 
                                value={form.pillar_id || 0}
                                onChange={(e) => setForm(p => ({...p, pillar_id: parseInt(e.target.value)}))}
                                className="w-full bg-black text-white text-xs border border-white/10 rounded px-2 py-2 focus:border-brand-orange outline-none"
                            >
                                <option value={0}>-- Pilih Pillar Page --</option>
                                {/* CHANGED: Map from listData.paginated instead of availablePillars */}
                                {listData.paginated.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            {availablePillars.length === 0 && (
                                <p className="text-[9px] text-red-400 mt-1">Belum ada Artikel Pilar. Buat Pillar dulu!</p>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* AI WIZARD */}
            {!form.id && aiState.step < 3 && (
                <div className="space-y-6">
                    {/* STEP 1: PRESET CATEGORIES & NARRATIVE STYLE */}
                    <div className={`transition-all ${aiState.step > 0 ? 'opacity-50 pointer-events-none' : ''}`}>
                        
                        {/* Narrative Style Selection */}
                        <div className="mb-4 bg-white/5 p-3 rounded-lg border border-white/10">
                            <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2">Gaya Narasi & Penulis</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => aiState.setGenConfig(prev => ({...prev, narrative: 'narsis'}))}
                                    className={`text-[10px] py-2 px-2 rounded border transition-all flex flex-col items-center gap-1 ${
                                        aiState.genConfig.narrative === 'narsis'
                                        ? 'bg-brand-orange text-white border-brand-orange'
                                        : 'bg-black/20 text-gray-400 border-white/10'
                                    }`}
                                >
                                    <span className="font-bold flex items-center gap-1"><Mic size={10} /> Personal (CEO)</span>
                                    <span className="text-[8px] opacity-70">{authorProfiles.personal.name}</span>
                                </button>
                                <button 
                                    onClick={() => aiState.setGenConfig(prev => ({...prev, narrative: 'umum'}))}
                                    className={`text-[10px] py-2 px-2 rounded border transition-all flex flex-col items-center gap-1 ${
                                        aiState.genConfig.narrative === 'umum'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-black/20 text-gray-400 border-white/10'
                                    }`}
                                >
                                    <span className="font-bold flex items-center gap-1"><FileText size={10} /> Umum (Redaksi)</span>
                                    <span className="text-[8px] opacity-70">{authorProfiles.team.name}</span>
                                </button>
                            </div>
                        </div>

                        <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-3">Step 1: Pilih Fokus Topik</label>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {PRESET_TOPICS.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => aiState.togglePreset(topic.label)}
                                    className={`text-[10px] py-2 px-2 rounded border transition-all flex items-center justify-between ${
                                        aiState.selectedPresets.includes(topic.label)
                                        ? 'bg-brand-orange text-white border-brand-orange'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'
                                    }`}
                                >
                                    {topic.label}
                                    {aiState.selectedPresets.includes(topic.label) && <Check size={12} />}
                                </button>
                            ))}
                        </div>
                        <Button 
                            onClick={actions.researchKeywords} 
                            disabled={loading.researching} 
                            className={`w-full py-3 text-xs ${aiState.selectedPresets.length === 0 ? 'opacity-50' : ''}`}
                        >
                            {loading.researching ? <LoadingSpinner size={14} /> : <><TrendingUp size={14}/> GENERATE IDE TOPIK (UNIK)</>}
                        </Button>
                    </div>

                    {/* STEP 2: SELECT TOPIC/TITLE */}
                    {aiState.step >= 1 && (
                        <div className={`transition-all ${aiState.step > 1 ? 'opacity-50 pointer-events-none' : 'animate-fade-in'}`}>
                            <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2">Step 2: Pilih Judul/Topik</label>
                            <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                                {aiState.keywords.map((k: KeywordData, i: number) => (
                                    <button key={i} onClick={() => actions.selectTopic(k)} className="text-left p-2.5 rounded border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 transition-all flex justify-between items-center group">
                                        <div>
                                            <span className="font-bold text-xs text-gray-200 group-hover:text-white block">{k.keyword}</span>
                                            <span className="text-[9px] text-gray-500 uppercase tracking-wide">{k.type} • Vol: {k.volume}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-600 group-hover:text-brand-orange"/>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 3 & 4 SPLIT CONTAINER */}
                    {aiState.step >= 2 && form.title && (
                        <div className="animate-fade-in border-t border-white/5 pt-4 space-y-6">
                            
                            {/* BLOCK A: GENERATE TEXT */}
                            <div>
                                <label className="text-[10px] text-brand-orange font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                                    <FileText size={12}/> Step 3: Tulis Konten ({form.type === 'pillar' ? 'Pillar' : 'Cluster'})
                                </label>
                                {loading.generatingText ? (
                                    <GenerationProgress percent={progress.text.percent} message={progress.text.message} color="orange" />
                                ) : (
                                    <Button onClick={actions.generateTextContent} disabled={loading.generatingText || !!form.content} className={`w-full py-3 text-xs ${form.content ? 'bg-green-600 hover:bg-green-500 opacity-50' : 'bg-brand-orange hover:bg-brand-glow'}`}>
                                        {form.content ? <><Check size={14}/> ARTIKEL SELESAI</> : <><Sparkles size={14}/> GENERATE TEXT DRAFT</>}
                                    </Button>
                                )}
                            </div>

                            {/* BLOCK B: GENERATE IMAGE */}
                            <div className={`transition-all ${!form.content ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                                <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                                    <Palette size={12}/> Step 4: Desain Visual
                                </label>
                                
                                <div className="mb-3">
                                    <label className="text-[9px] text-gray-500 mb-1 block">Style Gambar</label>
                                    <div className="grid grid-cols-2 gap-1">
                                        {(['cinematic', 'cyberpunk', 'corporate', 'studio', 'minimalist'] as const).map((style) => (
                                            <button 
                                                key={style}
                                                onClick={() => aiState.setGenConfig({...aiState.genConfig, imageStyle: style})}
                                                className={`py-1 text-[9px] uppercase border rounded ${aiState.genConfig.imageStyle === style ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent text-gray-500 border-white/10'}`}
                                            >
                                                {style}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {loading.generatingImage ? (
                                    <GenerationProgress percent={progress.image.percent} message={progress.image.message} color="blue" />
                                ) : (
                                    <Button onClick={actions.generateImageContent} disabled={loading.generatingImage} className="w-full py-3 text-xs bg-blue-600 hover:bg-blue-500 border-none shadow-lg">
                                        <ImageIcon size={14}/> GENERATE CONTEXTUAL IMAGE
                                    </Button>
                                )}
                            </div>

                            {/* FINISH BUTTON */}
                            {form.content && form.imagePreview && (
                                <div className="pt-2 animate-fade-in">
                                    <Button onClick={() => actions.handleEditClick({...form, date: '', readTime: '', image: form.imagePreview} as any)} className="w-full py-2 bg-white/10 hover:bg-white/20 text-xs border border-white/20">
                                        <Edit size={12}/> Edit Manual & Finalisasi
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* MANUAL EDITOR */}
            {(form.id || aiState.step === 3) && (
                <div className="space-y-4 animate-fade-in pb-10">
                    
                    {/* Strategy Info in Editor */}
                    <div className="flex gap-2 items-center mb-2">
                        <span className={`text-[9px] px-2 py-1 rounded border font-bold ${form.type === 'pillar' ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500' : 'bg-blue-500/10 border-blue-500 text-blue-500'}`}>
                            {form.type.toUpperCase()}
                        </span>
                        {form.type === 'cluster' && (
                            <div className="flex-1 bg-black/30 border border-white/10 rounded px-2 py-1 text-[9px] text-gray-400 truncate">
                                Parent: {availablePillars.find(p => p.id === form.pillar_id)?.title || 'Tidak ada'}
                            </div>
                        )}
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-32 bg-black rounded-lg border border-white/10 overflow-hidden group">
                        {form.imagePreview ? (
                            <img 
                                src={form.imagePreview} 
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Image+Load+Error";
                                }}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-600"><ImageIcon size={24}/></div>
                        )}
                        
                        {/* Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                            {loading.generatingImage ? (
                                <div className="w-full">
                                    <GenerationProgress percent={progress.image.percent} message={progress.image.message} color="blue" />
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={actions.generateImageContent} className="px-2 py-1 bg-blue-500 text-white text-[10px] rounded flex items-center gap-1 shadow-lg hover:bg-blue-400">
                                        <Wand2 size={10} /> Re-Imagine
                                    </button>
                                    <label className="px-2 py-1 bg-white/10 hover:bg-white/20 text-white text-[10px] rounded cursor-pointer border border-white/20">
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if(file) setForm((p:any) => ({...p, uploadFile: file, imagePreview: URL.createObjectURL(file)}));
                                        }} />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel" className="text-xs font-bold py-2"/>
                        
                        {/* Category & Author Row - SIMPLIFIED */}
                        <div className="flex gap-2">
                            <Input value={form.category} onChange={e => setForm((p:any) => ({...p, category: e.target.value}))} placeholder="Kategori" className="text-[10px] py-1.5 w-1/3"/>
                            
                            <div className="flex-1">
                                <Input value={form.author} onChange={e => setForm((p:any) => ({...p, author: e.target.value}))} placeholder="Penulis" className="text-[10px] py-1.5 w-full"/>
                            </div>
                        </div>

                        <TextArea value={form.excerpt} onChange={e => setForm((p:any) => ({...p, excerpt: e.target.value}))} placeholder="Ringkasan..." className="text-[10px] h-16"/>
                        <TextArea value={form.content} onChange={e => setForm((p:any) => ({...p, content: e.target.value}))} placeholder="# Konten Markdown..." className="text-[10px] h-96 font-mono custom-scrollbar"/>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 sticky bottom-0 bg-brand-dark pb-2">
                        <select 
                            value={form.status} 
                            onChange={(e) => setForm((p:any) => ({...p, status: e.target.value}))}
                            className="bg-black/20 text-white text-[10px] rounded border border-white/10 px-2 outline-none focus:border-brand-orange"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="scheduled">Scheduled</option>
                        </select>
                        <Button onClick={actions.handleSubmit} disabled={loading.uploading} className="py-2 text-[10px]">
                            {loading.uploading ? <LoadingSpinner size={12}/> : <><Save size={12}/> SIMPAN</>}
                        </Button>
                    </div>

                    {/* MANUAL DATE PICKER (Conditional) */}
                    {form.status === 'scheduled' && (
                        <div className="mt-2 animate-fade-in bg-white/5 p-2 rounded border border-white/10">
                            <label className="text-[9px] text-gray-400 block mb-1">Jadwal Tayang:</label>
                            <input 
                                type="datetime-local" 
                                value={form.scheduled_for || ''}
                                onChange={(e) => setForm(p => ({...p, scheduled_for: e.target.value}))}
                                className="w-full bg-black text-white text-xs border border-white/10 rounded px-2 py-1 focus:border-brand-orange outline-none"
                            />
                        </div>
                    )}
                </div>
            )}
         </div>
      </div>

      {/* 3. RIGHT COLUMN: LIVE PREVIEW */}
      <div className="w-[50%] bg-black flex flex-col relative overflow-hidden">
         <div className="p-4 border-b border-white/10 bg-brand-dark/50 flex justify-between items-center backdrop-blur-sm z-10 sticky top-0">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Eye size={12} /> Live Preview (Desktop)
            </h4>
            <div className="flex gap-2">
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{form.content.split(' ').length} Kata</Badge>
            </div>
         </div>

         <div className="flex-grow overflow-y-auto custom-scrollbar p-8 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none fixed"></div>
            
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-2">
                        {form.category && <span className="text-brand-orange text-[10px] font-bold uppercase tracking-widest block">{form.category}</span>}
                        {form.type === 'pillar' && <span className="text-yellow-500 text-[9px] border border-yellow-500/30 px-1 rounded">CORNERSTONE CONTENT</span>}
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">{form.title || "Judul Artikel..."}</h1>
                    <div className="flex items-center gap-3 text-gray-500 text-xs mb-6 border-b border-white/10 pb-6">
                        <span className="flex items-center gap-1"><User size={12}/> {form.author}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Calendar size={12}/> {new Date().toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={12}/> {form.readTime}</span>
                    </div>
                    {form.imagePreview && (
                        <div className="w-full h-64 rounded-xl overflow-hidden mb-8 shadow-2xl border border-white/10">
                            <img 
                                src={form.imagePreview} 
                                className="w-full h-full object-cover" 
                                alt="Cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x600?text=Image+Load+Error";
                                }}
                            />
                        </div>
                    )}
                    {form.excerpt && (
                        <p className="text-lg text-gray-300 italic border-l-4 border-brand-orange pl-4 py-1 mb-8">{form.excerpt}</p>
                    )}
                </div>

                <SimpleMarkdown content={form.content} />
            </div>
         </div>
      </div>

    </div>
  );
};
