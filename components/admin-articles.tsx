
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, UploadCloud, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, Target, List, CheckCircle2, RefreshCw, Eye, Image as ImageIcon, Wand2, LayoutTemplate, TrendingUp, User, Calendar, Clock, Check, Loader2, FileText, Palette, Link as LinkIcon, Crown, Network, CalendarClock, Zap, ChevronDown, ChevronUp, MoreVertical, ArrowLeft, Mic } from 'lucide-react';
import { Article } from '../types';
import { Button, Input, TextArea, LoadingSpinner, Badge } from './ui';
import { supabase, CONFIG, ensureAPIKey, getEnv, getSmartApiKey, slugify, markKeyAsExhausted } from '../utils';
import { GoogleGenAI } from "@google/genai";
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
    // Basic Form State
    const [form, setForm] = useState({
        id: null as number | null,
        title: '',
        excerpt: '',
        content: '',
        category: '',
        author: 'Redaksi KasirSolo',
        authorAvatar: '', // New Avatar Field
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
        scheduleStart: '' // NEW: Date picker state
    });

    // AI Flow State
    const [aiStep, setAiStep] = useState<number>(0); 
    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true,
        autoCategory: true,
        autoAuthor: true,
        imageStyle: 'cinematic',
        narrative: 'umum' // Default General
    });

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
    // We prioritize showing Pillars at the root level. Clusters are hidden inside pillars.
    const filteredPillars = articles.filter(a => {
        const isPillar = a.type === 'pillar' || !a.type; // Default to pillar if type undefined
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        return isPillar && matchesSearch;
    });

    const totalPages = Math.ceil(filteredPillars.length / ITEMS_PER_PAGE);
    const paginatedPillars = filteredPillars.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const availablePillars = articles.filter(a => a.type === 'pillar');

    const resetForm = () => {
        setForm({
            id: null,
            title: '',
            excerpt: '',
            content: '',
            category: '',
            author: 'Redaksi KasirSolo',
            authorAvatar: '',
            uploadAuthorFile: null,
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
    };

    const togglePreset = (label: string) => {
        setSelectedPresets(prev => 
            prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]
        );
    };

    const handleEditClick = (item: Article) => {
        // Safe access for author_avatar (if not in interface, assume it might come from DB as any)
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
            pillar_id: item.pillar_id || 0,
            cluster_ideas: item.cluster_ideas || [],
            scheduleStart: ''
        });
        setAiStep(3); 
    };

    // --- UTILS: IMAGE GENERATOR ---
    const getAIImageUrl = (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 999999);
        const safePrompt = prompt.replace(/[^a-zA-Z0-9\s,]/g, '').trim();
        let styleKeywords = "";
        switch(style) {
            case 'cinematic': styleKeywords = "cinematic lighting, dramatic, 8k, highly detailed, photorealistic, movie scene"; break;
            case 'cyberpunk': styleKeywords = "cyberpunk city, neon lights, futuristic, purple and orange, high tech, blade runner style"; break;
            case 'corporate': styleKeywords = "modern office, professional, bright, clean, corporate photography, success, business meeting"; break;
            case 'studio': styleKeywords = "studio lighting, product photography, solid background, minimal, sharp focus, 4k"; break;
            case 'minimalist': styleKeywords = "minimalist, flat design, vector art, simple shapes, pastel colors, clean lines"; break;
            default: styleKeywords = "high quality, professional, award winning";
        }
        const finalPrompt = `${safePrompt}, ${styleKeywords}`;
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(finalPrompt)}?width=1024&height=576&model=flux&nologo=true&seed=${seed}`;
    };

    // --- ACTION: GENERATE TEXT WITH STRATEGY CONTEXT ---
    const generateTextContent = async () => {
        if (!form.title) return alert("Pilih judul terlebih dahulu.");
        
        setLoading(prev => ({ ...prev, generatingText: true }));
        setTextProgress({ percent: 5, message: 'Menyiapkan strategi konten...' });

        // Retrieve key for potential blacklisting
        const apiKey = getSmartApiKey();

        try {
            await ensureAPIKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            // 1. Build Context Prompt based on Strategy & Narrative
            let strategyContext = "";
            let lengthReq = "Minimum 1000 words";
            let clusterInstruction = "";
            let structureInstruction = "Create 5-7 Major Subheadings (H2).";
            
            // Narrative Logic
            let narrativeInstruction = "";
            let authorName = "Redaksi KasirSolo";

            if (genConfig.narrative === 'narsis') {
                authorName = "Amin Maghfuri (CEO)";
                narrativeInstruction = `
                **NARRATIVE STYLE: PERSONAL & AUTHORITATIVE (Narsis/CEO POV)**
                - Role: Write as **Amin Maghfuri**, the CEO of PT Mesin Kasir Solo.
                - Tone: Experienced, inspiring, confident, slightly opinionated but professional.
                - Perspective: Use "Saya", "Aku", or "Kami di KasirSolo". Share "personal" insights or anecdotes about the industry.
                - Goal: Build personal branding and trust.
                `;
            } else {
                narrativeInstruction = `
                **NARRATIVE STYLE: GENERAL / EDITORIAL**
                - Role: Editorial Team (Redaksi KasirSolo).
                - Tone: Objective, journalistic, informative, neutral.
                - Perspective: Use Third Person or "Kita" (inclusive).
                - Goal: Provide clear information without personal bias.
                `;
            }

            if (form.type === 'pillar') {
                strategyContext = `
                STRATEGY: This is a **PILLAR PAGE** (Cornerstone Content). 
                - It must be COMPREHENSIVE but concise (Mega-Guide).
                - Cover definitions, benefits, strategies, comparisons, technical details, case studies, and future trends.
                - It serves as the ultimate authority resource for this topic.
                `;
                lengthReq = "Maximum 4000 words. Aim for 3000-4000 words.";
                structureInstruction = "Create 8-12 Major Subheadings (H2) to satisfy the word requirement.";
                
                // Instruction to generate clusters IN THE SAME CALL to save time/tokens context
                clusterInstruction = `
                BONUS TASK: At the very end of your response, after the conclusion, please provide a JSON block (and ONLY the JSON block) containing 10 specific, high-potential 'Cluster Article Titles' that should link back to this Pillar Page. 
                Format: ---CLUSTER_JSON_START--- ["Title 1", "Title 2", ...] ---CLUSTER_JSON_END---
                `;
            } else {
                const parentPillar = availablePillars.find(p => p.id === form.pillar_id);
                const pillarTitle = parentPillar ? parentPillar.title : "Panduan Lengkap Bisnis";
                // Generate URL Link
                const pillarLink = `/articles/${slugify(pillarTitle)}`;
                
                strategyContext = `
                STRATEGY: This is a **CLUSTER CONTENT** (Supporting Article).
                - Topic: "${form.title}"
                - Parent Topic (Pillar): "${pillarTitle}"
                - Focus: Deep dive into this specific sub-topic. Be specific and concise.
                - **MANDATORY INTERNAL LINKING**: You MUST include a Markdown link to the Pillar Page in the Introduction or first section. 
                  **Format MUST be exactly**: [${pillarTitle}](${pillarLink})
                  **IMPORTANT**: Do NOT put spaces between the bracket ] and parenthesis (. It must be ](url).
                `;
                lengthReq = "Maximum 800 words. Keep it focused and actionable.";
                structureInstruction = "Create 3-5 Detailed Subheadings (H2) focused on answering the user intent.";
            }

            setTextProgress({ percent: 20, message: `Menulis Artikel ${genConfig.narrative === 'narsis' ? 'Gaya CEO' : 'Gaya Redaksi'}...` });
            
            const contentPrompt = `
            Role: Senior SEO Content Strategist (Indonesian Market).
            Task: Write a High-Quality Article based on title: "${form.title}"
            
            ${narrativeInstruction}
            ${strategyContext}
            
            STRUCTURE:
            1. **Headline**: # ${form.title}
            2. **Introduction**: Hook & Context (Pain Points). Include the Internal Link here.
            3. **Deep Dive**: ${structureInstruction}
               - Use detailed paragraphs, bullet points, data tables (Markdown), and real-world examples (Case Studies).
            4. **FAQ**: 5-8 Q&A (Schema ready).
            5. **Conclusion**: Summary & CTA (Call to Action).
            
            REQUIREMENTS:
            - **LENGTH**: ${lengthReq}.
            - **FORMAT**: Clean Markdown. Use Bold for emphasis.
            - **LINKS**: Ensure links are formatted as [Text](URL) with NO spaces between parts.
            - **LANGUAGE**: Indonesian (Casual-Professional).
            
            ${clusterInstruction}
            `;

            const contentResponse = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: contentPrompt,
                config: { maxOutputTokens: 8192 } 
            });
            
            let generatedContent = contentResponse.text || '# Error generating text.';
            let extractedClusters: string[] = [];

            // 2. Extract Clusters if Pillar
            if (form.type === 'pillar') {
                const jsonStart = generatedContent.indexOf('---CLUSTER_JSON_START---');
                const jsonEnd = generatedContent.indexOf('---CLUSTER_JSON_END---');
                
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonStr = generatedContent.substring(jsonStart + 24, jsonEnd);
                    try {
                        extractedClusters = JSON.parse(jsonStr);
                    } catch (e) { console.error("Failed to parse clusters", e); }
                    
                    // Remove JSON from content display
                    generatedContent = generatedContent.substring(0, jsonStart).trim();
                }
            }
            
            console.log(`Generated Length: ${generatedContent.length} chars`);

            // 3. Generate Metadata
            setTextProgress({ percent: 80, message: 'Menganalisa metadata...' });
            const contextForMeta = generatedContent.substring(0, 3000); 
            
            const metaPrompt = `
            Based on this text: "${contextForMeta}..."
            Generate JSON: { 
                "excerpt": "Compelling 2-sentence summary (max 160 chars)", 
                "category": "One specific business category", 
                "readTime": "Estimate read time (e.g. '15 min read')"
            }
            `;
            
            const metaResponse = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: metaPrompt,
                config: { responseMimeType: "application/json" }
            });
            
            let metaData = { excerpt: "", category: "Business", readTime: "5 min read" };
            try { metaData = JSON.parse(metaResponse.text || '{}'); } catch(e) {}

            setTextProgress({ percent: 100, message: 'Selesai!' });
            await new Promise(r => setTimeout(r, 500));

            setForm(prev => ({
                ...prev,
                content: generatedContent,
                excerpt: metaData.excerpt || prev.excerpt,
                category: genConfig.autoCategory ? metaData.category : prev.category,
                author: authorName, // AUTO-SET AUTHOR BASED ON NARRATIVE
                readTime: metaData.readTime || "10 min read",
                cluster_ideas: extractedClusters
            }));

        } catch (e: any) {
            // Check for Quota Exceeded / Rate Limit errors
            if (e.message?.includes('429') || e.message?.includes('400') || e.message?.toLowerCase().includes('quota') || e.message?.toLowerCase().includes('resource')) {
                markKeyAsExhausted(apiKey);
                alert("API Key limit tercapai. Silakan coba tekan tombol lagi (Sistem akan otomatis ganti key).");
            } else {
                alert("Gagal generate teks: " + e.message);
            }
            setTextProgress({ percent: 0, message: 'Error' });
        } finally {
            setLoading(prev => ({ ...prev, generatingText: false }));
        }
    };

    // --- ACTION: AUTO-SCHEDULE CLUSTERS ---
    const scheduleClusters = async () => {
        if (!form.cluster_ideas || form.cluster_ideas.length === 0) return alert("Tidak ada ide cluster untuk dijadwalkan.");
        
        // Start date logic
        let scheduleDate = new Date();
        if (form.scheduleStart) {
            scheduleDate = new Date(form.scheduleStart);
        } else {
            // Default to tomorrow if not selected
            scheduleDate.setDate(scheduleDate.getDate() + 1);
            scheduleDate.setHours(9, 0, 0, 0); // Default 9 AM
        }

        if (isNaN(scheduleDate.getTime())) return alert("Tanggal tidak valid.");

        setLoading(prev => ({ ...prev, scheduling: true }));
        try {
            const newArticles: Article[] = [];
            const parentPillar = availablePillars.find(p => p.id === form.id);
            const parentSlug = parentPillar ? `/articles/${slugify(parentPillar.title)}` : '#';
            const parentTitle = parentPillar ? parentPillar.title : 'Pillar Page';

            let currentCursor = new Date(scheduleDate);

            form.cluster_ideas.forEach((title, index) => {
                
                const scheduledTimeStr = currentCursor.toLocaleString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                });

                // Unique Seed for Image based on Title
                const imageSeed = Math.floor(Math.random() * 999999);
                const uniqueImage = `https://image.pollinations.ai/prompt/${encodeURIComponent(title + " business professional photography")}?width=1024&height=576&model=flux&nologo=true&seed=${imageSeed}`;

                // Create Draft Article Object
                const newArticle: Article = {
                    id: Date.now() + index, // Unique ID
                    title: title,
                    excerpt: `Artikel pendukung untuk pilar: ${form.title}. (Klik Edit untuk Generate Konten Lengkap).`,
                    content: `<!-- PLACEHOLDER -->\n# ${title}\n\n*Artikel ini telah dijadwalkan tayang pada ${scheduledTimeStr}.*\n\nKlik tombol **'GENERATE TEXT DRAFT'** di panel kanan untuk membuat konten lengkap (1000 kata) menggunakan AI.\n\n> **Topik Induk:** [${parentTitle}](${parentSlug})`,
                    date: currentCursor.toLocaleDateString('id-ID'),
                    image: uniqueImage, 
                    category: form.category || 'Bisnis',
                    author: form.author, // Inherit Author
                    readTime: '10 min read',
                    status: 'scheduled',
                    scheduled_for: scheduledTimeStr,
                    type: 'cluster',
                    pillar_id: form.id || 0 
                };

                newArticles.push(newArticle);
                currentCursor.setHours(currentCursor.getHours() + 12);
            });

            // Update State & DB
            setArticles([...newArticles, ...articles]);
            
            if (supabase) {
                // Bulk insert to Supabase
                const dbInserts = newArticles.map(a => ({
                    title: a.title,
                    excerpt: a.excerpt,
                    content: a.content,
                    category: a.category,
                    author: a.author,
                    read_time: a.readTime,
                    image_url: a.image,
                    status: a.status,
                    scheduled_for: a.scheduled_for,
                    type: a.type,
                    pillar_id: a.pillar_id
                }));
                await supabase.from('articles').insert(dbInserts);
            }

            alert(`Berhasil menjadwalkan ${newArticles.length} artikel cluster!\nDimulai: ${scheduleDate.toLocaleString()}`);
            
            // Clear ideas after scheduling to prevent dupes
            setForm(prev => ({...prev, cluster_ideas: []}));

        } catch (e: any) {
            alert("Gagal menjadwalkan: " + e.message);
        } finally {
            setLoading(prev => ({ ...prev, scheduling: false }));
        }
    };

    // --- ACTION: GENERATE IMAGE ONLY (CONTEXT AWARE) ---
    const generateImageContent = async () => {
        if (!form.content && !form.title) return alert("Konten artikel belum ada.");

        setLoading(prev => ({ ...prev, generatingImage: true }));
        setImageProgress({ percent: 20, message: 'Menganalisa konteks artikel...' });

        // Retrieve key for potential blacklisting
        const apiKey = getSmartApiKey();

        try {
            await ensureAPIKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const analysisPrompt = `
            Context: "${form.content.substring(0, 800)}..."
            Task: Create a highly detailed English image prompt for a cover image.
            Focus: Professional, Business, Technology.
            Output: JUST THE PROMPT TEXT.
            `;

            const promptResponse = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: analysisPrompt });
            const visualPrompt = promptResponse.text || form.title;

            setImageProgress({ percent: 60, message: 'Rendering visual...' });
            const imageUrl = getAIImageUrl(visualPrompt, genConfig.imageStyle);

            await new Promise(r => setTimeout(r, 800)); 
            setImageProgress({ percent: 100, message: 'Gambar siap!' });
            await new Promise(r => setTimeout(r, 300));

            setForm(prev => ({ ...prev, imagePreview: imageUrl }));

        } catch (e: any) {
            // Check for Quota Exceeded / Rate Limit errors
            if (e.message?.includes('429') || e.message?.includes('400') || e.message?.toLowerCase().includes('quota') || e.message?.toLowerCase().includes('resource')) {
                markKeyAsExhausted(apiKey);
                alert("API Key limit tercapai. Silakan coba tekan tombol lagi (Sistem akan otomatis ganti key).");
            } else {
                alert("Gagal generate gambar: " + e.message);
            }
            setImageProgress({ percent: 0, message: 'Error' });
        } finally {
            setLoading(prev => ({ ...prev, generatingImage: false }));
        }
    };

    const handleSubmit = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        
        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200';
            let finalAuthorAvatar = form.authorAvatar;

            if (!CONFIG.CLOUDINARY_CLOUD_NAME) throw new Error("Konfigurasi Cloudinary belum diset.");

            // 1. Upload Cover Image
            if (form.uploadFile) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalImageUrl = data.secure_url;
            }

            // 2. Upload Author Avatar (If New File Present)
            if (form.uploadAuthorFile) {
                const formData = new FormData();
                formData.append('file', form.uploadAuthorFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                if (data.secure_url) finalAuthorAvatar = data.secure_url;
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
                author_avatar: finalAuthorAvatar // Save to DB
            };

            const localUpdateData = {
                ...dbData,
                image: finalImageUrl,
                readTime: form.readTime,
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            if (form.id) {
                const existing = articles.find(a => a.id === form.id);
                if (existing) {
                    setArticles(articles.map(a => a.id === form.id ? { ...existing, ...localUpdateData, id: form.id } : a));
                }
                if (supabase) await supabase.from('articles').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setArticles([{ ...localUpdateData, id: newId, tags: [] } as any, ...articles]);
                // Return ID for immediate scheduling reference
                if (supabase) {
                    const { data } = await supabase.from('articles').insert([dbData]).select();
                    if(data && data[0]) setForm(p => ({...p, id: data[0].id}));
                } else {
                    setForm(p => ({...p, id: newId}));
                }
            }
            alert(`Artikel berhasil disimpan!`);
        } catch (e: any) { 
            console.error(e); 
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

    // --- ACTION: RESEARCH KEYWORDS ---
    const researchKeywords = async () => {
        if (selectedPresets.length === 0) return alert("Pilih minimal satu topik.");
        
        setLoading(prev => ({ ...prev, researching: true }));
        const apiKey = getSmartApiKey();

        // 1. Gather Existing Titles for Exclusion Logic
        const existingTitles = articles.map(a => `"${a.title}"`).join(', ');

        try {
            await ensureAPIKey();
            const ai = new GoogleGenAI({ apiKey: apiKey || '' });

            const prompt = `
            Role: SEO Content Strategist (Indonesian Market).
            Context: We sell POS Systems (Kasir) & Software.
            Task: Generate 5 high-potential article titles/keywords based on topics: ${selectedPresets.join(', ')}.
            
            CRITICAL CONSTRAINT: 
            You MUST NOT suggest titles that are similar to these existing articles: [${existingTitles}].
            Provide FRESH angles, new trends, or specific case studies instead.
            
            Target Audience: UMKM Owners, Business Starters.
            Format: JSON Array of objects: [{ "keyword": "Title Idea", "volume": "Search Volume (e.g. 10k/mo)", "competition": "Low/Medium/High", "type": "Trend/Evergreen" }]
            STRICT: Return ONLY JSON.
            `;

            const response = await ai.models.generateContent({ 
                model: 'gemini-3-flash-preview', 
                contents: prompt,
                config: { responseMimeType: "application/json" }
            });

            const text = response.text || '[]';
            let data: KeywordData[] = [];
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error("Failed to parse JSON", text);
                data = [
                    { keyword: `Strategi ${selectedPresets[0]} untuk Pemula (Manual Fallback)`, volume: "Unknown", competition: "Low", type: "Evergreen" }
                ];
            }
            
            setKeywords(data);
            setAiStep(1); 
        } catch (e: any) {
            if (e.message?.includes('429') || e.message?.includes('400') || e.message?.toLowerCase().includes('quota') || e.message?.toLowerCase().includes('resource')) {
                markKeyAsExhausted(apiKey);
                alert("API Key limit tercapai. Silakan coba tekan tombol lagi.");
            } else {
                alert("Gagal research keyword: " + e.message);
            }
        } finally {
            setLoading(prev => ({ ...prev, researching: false }));
        }
    };

    const selectTopic = (k: KeywordData) => {
        setSelectedKeyword(k);
        setForm(prev => ({ ...prev, title: k.keyword }));
        setAiStep(2); 
    };

    return {
        form, setForm,
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
  const { form, setForm, loading, progress, aiState, actions, listData, availablePillars } = useArticleManager(articles, setArticles);

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b">
      
      {/* 1. LEFT COLUMN: PILLAR LIST (ACCORDION) */}
      <div className="w-[30%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[300px]">
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
         
         <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {listData.paginated.map((pillar: Article) => {
                const isExpanded = listData.expandedPillarId === pillar.id;
                // Get Linked Clusters
                const linkedClusters = articles.filter(a => a.pillar_id === pillar.id);
                
                return (
                    <div 
                        key={pillar.id}
                        className={`rounded-lg border transition-all overflow-hidden ${
                            isExpanded ? 'border-brand-orange/50 bg-white/5' : 'border-white/5 hover:border-white/20 bg-brand-card'
                        }`}
                    >
                        {/* Accordion Header */}
                        <div 
                            className="p-3 cursor-pointer flex gap-3 items-center"
                            onClick={() => listData.setExpandedPillarId(isExpanded ? null : pillar.id)}
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

                        {/* Accordion Body */}
                        {isExpanded && (
                            <div className="bg-black/20 border-t border-white/5 p-3 animate-fade-in">
                                {/* Actions Row */}
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

                                {/* Cluster List */}
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
                                                <img src={cluster.image} className="w-8 h-8 rounded object-cover bg-black" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-gray-300 truncate group-hover:text-brand-orange transition-colors">{cluster.title}</p>
                                                    <div className="flex justify-between items-center mt-0.5">
                                                        <span className={`text-[8px] px-1 rounded ${cluster.status === 'published' ? 'text-green-400 bg-green-900/30' : cluster.status === 'scheduled' ? 'text-purple-400 bg-purple-900/30' : 'text-gray-500 bg-gray-800'}`}>
                                                            {cluster.status}
                                                        </span>
                                                        {cluster.scheduled_for && (
                                                            <span className="text-[8px] text-purple-400 flex items-center gap-0.5">
                                                                <Clock size={8}/> {cluster.scheduled_for.split(' ')[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* NEW DELETE BUTTON FOR CLUSTER */}
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        actions.deleteItem(cluster.id);
                                                    }}
                                                    className="p-1.5 rounded hover:bg-red-500/20 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Hapus Cluster"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-3 border border-dashed border-white/10 rounded">
                                            <p className="text-[9px] text-gray-500 mb-1">Belum ada artikel cluster.</p>
                                            <p className="text-[8px] text-gray-600">Gunakan "Auto-Cluster Strategy" di editor Pilar.</p>
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
                <button 
                    onClick={() => listData.setPage(p => Math.max(1, p - 1))} 
                    disabled={listData.page === 1}
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30"
                >
                    <ChevronLeft size={16} />
                </button>
                <span className="text-[10px] font-bold text-gray-400">
                    Hal {listData.page} / {listData.totalPages}
                </span>
                <button 
                    onClick={() => listData.setPage(p => Math.min(listData.totalPages, p + 1))} 
                    disabled={listData.page === listData.totalPages}
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400 disabled:opacity-30"
                >
                    <ChevronRight size={16} />
                </button>
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
                    {form.id ? "Kembali ke Daftar" : "Reset"}
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
                                {availablePillars.map(p => (
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
                                    <span className="text-[8px] opacity-70">Amin Maghfuri</span>
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
                                    <span className="text-[8px] opacity-70">Tim Redaksi</span>
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
                            <img src={form.imagePreview} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
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

                    {/* QUICK ACTION: GENERATE FULL TEXT (For Scheduled Clusters) */}
                    {form.content && form.content.includes("<!-- PLACEHOLDER -->") && (
                        <div className="p-3 bg-brand-orange/10 border border-brand-orange/30 rounded-lg animate-pulse-slow">
                            <p className="text-[10px] text-brand-orange mb-2 font-bold">Artikel ini masih berupa Draft Placeholder.</p>
                            <Button 
                                onClick={actions.generateTextContent} 
                                disabled={loading.generatingText}
                                className="w-full py-2 bg-brand-orange hover:bg-brand-glow text-white text-xs shadow-lg"
                            >
                                {loading.generatingText ? <LoadingSpinner size={14}/> : <><Sparkles size={14}/> GENERATE FULL CONTENT (1000+ Words)</>}
                            </Button>
                        </div>
                    )}

                    {/* Inputs */}
                    <div className="space-y-3">
                        <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel" className="text-xs font-bold py-2"/>
                        
                        {/* Category & Author Row with Avatar */}
                        <div className="flex gap-2">
                            <Input value={form.category} onChange={e => setForm((p:any) => ({...p, category: e.target.value}))} placeholder="Kategori" className="text-[10px] py-1.5 w-1/3"/>
                            
                            <div className="flex-1 flex gap-2">
                                {/* Author Avatar Trigger */}
                                <div className="relative group w-8 h-8 rounded-full border border-white/20 bg-black overflow-hidden shrink-0 cursor-pointer">
                                    <img 
                                        src={form.authorAvatar || "https://via.placeholder.com/100"} 
                                        alt="Author" 
                                        className="w-full h-full object-cover"
                                    />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if(file) setForm((p:any) => ({...p, uploadAuthorFile: file, authorAvatar: URL.createObjectURL(file)}));
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Edit size={10} className="text-white"/>
                                    </div>
                                </div>
                                <Input value={form.author} onChange={e => setForm((p:any) => ({...p, author: e.target.value}))} placeholder="Penulis" className="text-[10px] py-1.5 flex-1"/>
                            </div>
                        </div>

                        <TextArea value={form.excerpt} onChange={e => setForm((p:any) => ({...p, excerpt: e.target.value}))} placeholder="Ringkasan..." className="text-[10px] h-16"/>
                        <TextArea value={form.content} onChange={e => setForm((p:any) => ({...p, content: e.target.value}))} placeholder="# Konten Markdown..." className="text-[10px] h-96 font-mono custom-scrollbar"/>
                    </div>

                    {/* AUTO-CLUSTER SCHEDULER PANEL (For Pillar Only) */}
                    {form.type === 'pillar' && form.cluster_ideas && form.cluster_ideas.length > 0 && (
                        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 rounded-lg p-3 space-y-3 animate-fade-in">
                            <div className="flex justify-between items-center">
                                <h4 className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={12}/> Auto-Cluster Strategy
                                </h4>
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">{form.cluster_ideas.length} Ide</Badge>
                            </div>
                            
                            <div className="max-h-32 overflow-y-auto custom-scrollbar border border-white/5 rounded bg-black/20 p-2">
                                <ul className="space-y-1">
                                    {form.cluster_ideas.map((idea, idx) => (
                                        <li key={idx} className="text-[9px] text-gray-400 flex items-start gap-2">
                                            <span className="text-purple-500">•</span> {idea}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* DATE TIME PICKER */}
                            <div className="bg-white/5 p-2 rounded border border-white/10">
                                <label className="text-[9px] text-gray-400 block mb-1">Mulai Terbitkan Pada:</label>
                                <input 
                                    type="datetime-local" 
                                    value={form.scheduleStart}
                                    onChange={(e) => setForm(p => ({...p, scheduleStart: e.target.value}))}
                                    className="w-full bg-black text-white text-xs border border-white/10 rounded px-2 py-1 focus:border-purple-500 outline-none"
                                />
                            </div>

                            <Button 
                                onClick={actions.scheduleClusters} 
                                disabled={loading.scheduling}
                                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold border-none shadow-lg"
                            >
                                {loading.scheduling ? <LoadingSpinner size={12}/> : <><CalendarClock size={12}/> AUTO-SCHEDULE (2x SEHARI)</>}
                            </Button>
                            <p className="text-[8px] text-gray-500 text-center">
                                Akan membuat {form.cluster_ideas.length} draft artikel dengan jadwal tayang otomatis.
                            </p>
                        </div>
                    )}

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
                            <img src={form.imagePreview} className="w-full h-full object-cover" alt="Cover" />
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
