
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Sparkles, Edit, ChevronLeft, ChevronRight, Save, X as XIcon, Search, List, CheckCircle2, RefreshCw, Eye, Image as ImageIcon, TrendingUp, User, Calendar, Clock, Check, Loader2, FileText, Palette, Crown, Network, Zap, ChevronDown, ChevronUp, ArrowLeft, Mic, Camera, Users, HelpCircle, Wand2, Filter } from 'lucide-react';
import { Article } from '../types';
import { Button, Input, TextArea, LoadingSpinner, Badge } from './ui';
import { supabase, CONFIG, ensureAPIKey, slugify, callGeminiWithRotation } from '../utils';
import { Link } from 'react-router-dom';

const ITEMS_PER_PAGE = 7;

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
    narrative: 'narsis' | 'umum'; 
}

// --- HELPER: Parse Links only ---
const parseLinks = (text: string) => {
  const linkRegex = /(\[.*?\]\s*\(.*?\))/g;
  const parts = text.split(linkRegex);

  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\s*\((.*?)\)$/);
    if (linkMatch) {
      return (
        <Link key={`link-${i}`} to={linkMatch[2]} className="text-brand-orange hover:text-white underline decoration-brand-orange/50 hover:decoration-white transition-all font-medium">
            {linkMatch[1]}
        </Link>
      );
    }
    
    // Handle Italics
    const italicParts = part.split(/(\*.*?\*)/g);
    return (
        <span key={`text-${i}`}>
            {italicParts.map((sub, j) => {
                if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2 && !sub.startsWith('**')) {
                    return <em key={`italic-${j}`} className="text-gray-400 italic">{sub.slice(1, -1)}</em>;
                }
                return sub;
            })}
        </span>
    );
  });
};

// --- HELPER: Main Formatter (Bold First, Then Links) ---
const renderInline = (text: string) => {
  const boldRegex = /(\*\*.*?\*\*)/g;
  const parts = text.split(boldRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const content = part.slice(2, -2);
          return <strong key={i} className="text-white font-bold">{parseLinks(content)}</strong>;
        }
        return <span key={i}>{parseLinks(part)}</span>;
      })}
    </>
  );
};

const MarkdownTable: React.FC<{ content: string }> = ({ content }) => {
    const rows = content.trim().split('\n');
    if (rows.length < 2) return <pre className="text-xs">{content}</pre>;

    const headers = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const bodyRows = rows.slice(2); 

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

const SimpleMarkdown = ({ content }: { content: string }) => {
    if (!content) return <div className="text-gray-600 italic">Preview konten akan muncul di sini...</div>;
    
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
    </div>
);

const useArticleManager = (
    articles: Article[], 
    setArticles: (a: Article[]) => void
) => {
    const [authorProfiles, setAuthorProfiles] = useState({
        personal: { name: 'Amin Maghfuri', avatar: '', file: null as File | null },
        team: { name: 'Redaksi KasirSolo', avatar: '', file: null as File | null }
    });

    const [aiStep, setAiStep] = useState<number>(0); 
    const [genConfig, setGenConfig] = useState<GenConfig>({
        autoImage: true, autoCategory: true, autoAuthor: true,
        imageStyle: 'cinematic', narrative: 'narsis' 
    });

    const [form, setForm] = useState({
        id: null as number | null,
        title: '', excerpt: '', content: '', category: '',
        author: authorProfiles.personal.name, authorAvatar: authorProfiles.personal.avatar, 
        uploadAuthorFile: null as File | null, readTime: '10 min read', imagePreview: '',
        uploadFile: null as File | null, status: 'draft' as 'published' | 'draft' | 'scheduled',
        scheduled_for: '', type: 'cluster' as 'pillar' | 'cluster',
        pillar_id: 0 as number, cluster_ideas: [] as string[], scheduleStart: '' 
    });

    const [selectedPresets, setSelectedPresets] = useState<string[]>([]);
    const [keywords, setKeywords] = useState<KeywordData[]>([]);
    const [selectedKeyword, setSelectedKeyword] = useState<KeywordData | null>(null);

    useEffect(() => {
        if (!form.id) {
            const target = genConfig.narrative === 'narsis' ? authorProfiles.personal : authorProfiles.team;
            setForm(p => ({ ...p, author: target.name, authorAvatar: target.avatar, uploadAuthorFile: target.file }));
        }
    }, [authorProfiles, genConfig.narrative, form.id]);

    const handleProfileChange = (type: 'personal' | 'team', file: File | undefined) => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setAuthorProfiles(prev => ({ ...prev, [type]: { ...prev[type], avatar: url, file: file } }));
    };

    const [loading, setLoading] = useState({ uploading: false, researching: false, generatingText: false, generatingImage: false, generatingClusters: false, scheduling: false });
    const [progress, setProgress] = useState({ text: { percent: 0, message: '' }, image: { percent: 0, message: '' } });

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedPillarId, setExpandedPillarId] = useState<number | null>(null);
    
    // NEW: Filter State
    const [filterType, setFilterType] = useState<'all' | 'pillar' | 'cluster' | 'orphan'>('all');

    // Updated Filter Logic
    const filteredList = articles.filter(a => {
        const matchesSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (!matchesSearch) return false;

        // ALL: Show Pillars + Orphans (Standard View)
        if (filterType === 'all') {
            const isPillar = a.type === 'pillar';
            const isOrphan = !a.pillar_id && a.type !== 'pillar'; 
            return isPillar || isOrphan;
        }
        
        // Specific Filters
        if (filterType === 'pillar') return a.type === 'pillar';
        if (filterType === 'cluster') return a.type === 'cluster';
        if (filterType === 'orphan') return !a.pillar_id && a.type !== 'pillar'; // Strict Orphan

        return false;
    });

    // Reset pagination when filter/search changes
    useEffect(() => {
        setPage(1);
    }, [searchTerm, filterType]);

    const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE);
    const paginatedList = filteredList.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    
    const availablePillars = articles.filter(a => a.type === 'pillar');

    const resetForm = () => {
        setForm({
            id: null, title: '', excerpt: '', content: '', category: '',
            author: authorProfiles.personal.name, authorAvatar: authorProfiles.personal.avatar,
            uploadAuthorFile: authorProfiles.personal.file, readTime: '10 min read', imagePreview: '',
            uploadFile: null, status: 'draft', scheduled_for: '', type: 'cluster',
            pillar_id: 0, cluster_ideas: [], scheduleStart: ''
        });
        setAiStep(0); setKeywords([]); setSelectedKeyword(null); setSelectedPresets([]);
        setProgress({ text: { percent: 0, message: '' }, image: { percent: 0, message: '' } });
    };

    const togglePreset = (label: string) => {
        setSelectedPresets(prev => prev.includes(label) ? prev.filter(p => p !== label) : [...prev, label]);
    };

    const handleEditClick = (item: Article) => {
        const itemAny = item as any;
        setForm({
            id: item.id, title: item.title, excerpt: item.excerpt, content: item.content,
            category: item.category, author: item.author, authorAvatar: itemAny.author_avatar || '',
            uploadAuthorFile: null, readTime: item.readTime, imagePreview: item.image,
            uploadFile: null, status: item.status || 'published', scheduled_for: item.scheduled_for || '',
            type: item.type || 'cluster', pillar_id: item.type === 'pillar' ? item.id : (item.pillar_id || 0),
            cluster_ideas: item.cluster_ideas || [], scheduleStart: ''
        });
        setAiStep(3); 
    };

    const researchKeywords = async () => {
        if (selectedPresets.length === 0) return alert("Pilih minimal 1 topik.");
        setLoading(prev => ({ ...prev, researching: true }));
        try {
            const prompt = `Role: SEO Strategist. Context: POS System. Topics: ${selectedPresets.join(', ')}. Task: Generate 5 article titles. Format: JSON Array [{"keyword": "...", "volume": "...", "competition": "...", "type": "..."}].`;
            const result = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
            const data = JSON.parse(result.text || '[]');
            if (Array.isArray(data)) { setKeywords(data); setAiStep(1); }
        } catch (e: any) { alert("Gagal riset: " + e.message); } 
        finally { setLoading(prev => ({ ...prev, researching: false })); }
    };

    const selectTopic = (k: KeywordData) => { setSelectedKeyword(k); setForm(prev => ({ ...prev, title: k.keyword })); setAiStep(2); };

    const getAIImageUrl = (prompt: string, style: string) => {
        const seed = Math.floor(Math.random() * 9999999);
        let cleanPrompt = prompt.replace(/[^a-zA-Z0-9 ]/g, '').substring(0, 80).trim();
        return `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt)}?width=1280&height=720&model=flux&nologo=true&seed=${seed}`;
    };

    const generateTextContent = async () => {
        if (!form.title) return alert("Pilih judul terlebih dahulu.");
        setLoading(prev => ({ ...prev, generatingText: true }));
        setProgress(p => ({...p, text: { percent: 10, message: 'Menulis...' }}));
        try {
            const contentPrompt = `Write Article: "${form.title}". Language: Indonesian. Format: Markdown. Use H2, H3, Bullet points. Length: 1000 words. Narrative: ${genConfig.narrative}. Type: ${form.type}. Include links to relevant sources or products if applicable.`;
            const contentResponse = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: contentPrompt });
            const generatedContent = contentResponse.text || '# Error';
            
            const metaPrompt = `Generate JSON Metadata for this article content: {"excerpt": "...", "category": "...", "readTime": "..."}`;
            const metaResponse = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: metaPrompt, config: { responseMimeType: "application/json" } });
            const metaData = JSON.parse(metaResponse.text || '{}');

            setForm(prev => ({
                ...prev, content: generatedContent, excerpt: metaData.excerpt || prev.excerpt,
                category: metaData.category || "General", readTime: metaData.readTime || "5 min read"
            }));
            setProgress(p => ({...p, text: { percent: 100, message: 'Selesai!' }}));
        } catch (e: any) { alert("Gagal generate: " + e.message); } 
        finally { setLoading(prev => ({ ...prev, generatingText: false })); }
    };

    const generateImageContent = async () => {
        if (!form.title) return alert("Judul diperlukan.");
        setLoading(prev => ({ ...prev, generatingImage: true }));
        setProgress(p => ({...p, image: { percent: 50, message: 'Rendering...' }}));
        try {
             const url = getAIImageUrl(form.title, genConfig.imageStyle);
             setForm(prev => ({ ...prev, imagePreview: url }));
             setProgress(p => ({...p, image: { percent: 100, message: 'Selesai!' }}));
        } catch(e) { console.error(e); } 
        finally { setLoading(prev => ({ ...prev, generatingImage: false })); }
    };
    
    const handleSubmit = async () => {
        if (!form.title || !form.content) return alert("Judul dan Konten wajib diisi.");
        setLoading(prev => ({ ...prev, uploading: true }));
        try {
            let finalImageUrl = form.imagePreview || 'https://via.placeholder.com/800';
            if (form.uploadFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
                const formData = new FormData();
                formData.append('file', form.uploadFile);
                formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
                const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
                const data = await res.json();
                finalImageUrl = data.secure_url;
            }
            const dbData = {
                title: form.title, excerpt: form.excerpt, content: form.content, category: form.category,
                author: form.author, read_time: form.readTime, image_url: finalImageUrl,
                status: form.status, scheduled_for: form.status === 'scheduled' ? form.scheduled_for : null,
                type: form.type, pillar_id: form.type === 'cluster' ? form.pillar_id : null,
                cluster_ideas: form.cluster_ideas, author_avatar: form.authorAvatar
            };
            if (form.id) {
                setArticles(articles.map(a => a.id === form.id ? { ...a, ...dbData, image: finalImageUrl } as any : a));
                if (supabase) await supabase.from('articles').update(dbData).eq('id', form.id);
            } else {
                const newId = Date.now();
                setArticles([{ ...dbData, id: newId, image: finalImageUrl } as any, ...articles]);
                if (supabase) await supabase.from('articles').insert([dbData]);
            }
            resetForm();
            alert(`Artikel berhasil disimpan!`);
        } catch (e: any) { alert(`Gagal menyimpan: ${e.message}`); } 
        finally { setLoading(prev => ({ ...prev, uploading: false })); }
    };

    const deleteItem = async (id: number) => {
        if(!confirm("Hapus artikel ini?")) return;
        setArticles(articles.filter(a => a.id !== id));
        if (supabase) await supabase.from('articles').delete().eq('id', id);
        if (form.id === id) resetForm();
    };

    return {
        form, setForm, authorProfiles, setAuthorProfiles, handleProfileChange, loading, progress,
        aiState: { step: aiStep, setStep: setAiStep, keywords, selectedKeyword, genConfig, setGenConfig, selectedPresets, togglePreset },
        actions: { researchKeywords, selectTopic, generateTextContent, generateImageContent, handleSubmit, handleEditClick, resetForm, deleteItem },
        listData: { 
            paginated: paginatedList, totalPages, page, setPage, 
            searchTerm, setSearchTerm, expandedPillarId, setExpandedPillarId,
            filterType, setFilterType 
        },
        availablePillars
    };
};

export const AdminArticles = ({ articles, setArticles }: { articles: Article[], setArticles: (a: Article[]) => void }) => {
  const { form, setForm, authorProfiles, setAuthorProfiles, handleProfileChange, loading, progress, aiState, actions, listData, availablePillars } = useArticleManager(articles, setArticles);

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b">
      <div className="w-[30%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[300px]">
         <div className="p-4 border-b border-white/5 bg-brand-card/50">
            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2"><User size={12}/> Identitas Penulis</h4>
            <div className="grid grid-cols-2 gap-2">
                {/* Profile Controls Omitted for brevity, logic remains in hook */}
            </div>
         </div>
         <div className="p-4 border-b border-white/5 space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><List size={12}/> Arsip Artikel</h4>
                <button onClick={actions.resetForm} className="text-[10px] font-bold text-brand-orange border border-brand-orange/30 px-2 py-1 rounded"><Plus size={10} /> BARU</button>
            </div>
            
            {/* NEW: Filter Tabs */}
            <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto custom-scrollbar">
                {['all', 'pillar', 'cluster', 'orphan'].map(type => (
                    <button
                        key={type}
                        onClick={() => listData.setFilterType(type as any)}
                        className={`flex-1 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap ${
                            listData.filterType === type 
                            ? 'bg-brand-orange text-white shadow-md' 
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {type === 'all' ? 'Semua' : type}
                    </button>
                ))}
            </div>

            <div className="relative">
                <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
                <input type="text" value={listData.searchTerm} onChange={(e) => listData.setSearchTerm(e.target.value)} placeholder="Cari artikel..." className="w-full bg-brand-card border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-brand-orange"/>
            </div>
         </div>
         <div className="flex-grow overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {listData.paginated.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-[10px] opacity-60">
                    <Filter size={24} className="mx-auto mb-2"/>
                    <p>Tidak ada artikel di kategori ini.</p>
                </div>
            ) : listData.paginated.map((article: Article) => {
                const isPillar = article.type === 'pillar';
                const isCluster = article.type === 'cluster' && article.pillar_id;
                // Strict orphan check: Not pillar AND (Not cluster OR Cluster without Parent)
                const isOrphan = !isPillar && (!isCluster || !article.pillar_id); 
                
                // Allow expand ONLY if it's a pillar AND we are in 'all' view (to show hierarchy)
                const canExpand = isPillar && listData.filterType === 'all';
                const isExpanded = listData.expandedPillarId === article.id;
                const linkedClusters = articles.filter(a => a.pillar_id === article.id);

                return (
                    <div key={article.id} className={`rounded-lg border transition-all overflow-hidden ${isExpanded ? 'border-brand-orange/50 bg-white/5' : 'border-white/5 bg-brand-card'}`}>
                        <div className="p-3 cursor-pointer flex gap-3 items-center" onClick={() => { 
                            if (canExpand) listData.setExpandedPillarId(isExpanded ? null : article.id); 
                            else actions.handleEditClick(article); 
                        }}>
                            <img src={article.image} className="w-10 h-10 rounded object-cover bg-black" />
                            <div className="flex-1 min-w-0">
                                <h5 className={`text-[11px] font-bold truncate leading-tight ${isExpanded || form.id === article.id ? 'text-brand-orange' : 'text-white'}`}>{article.title}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                    {isPillar && (
                                        <span className="text-[9px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1.5 rounded-full flex items-center gap-1"><Crown size={8}/> PILAR</span>
                                    )}
                                    {isCluster && (
                                        <span className="text-[9px] text-blue-400 border border-blue-400/30 bg-blue-400/10 px-1.5 rounded-full flex items-center gap-1"><Network size={8}/> CLUSTER</span>
                                    )}
                                    {isOrphan && (
                                        <span className="text-[9px] text-gray-400 border border-white/10 bg-white/5 px-1.5 rounded-full flex items-center gap-1"><HelpCircle size={8}/> ORPHAN</span>
                                    )}
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            {canExpand ? (
                                isExpanded ? <ChevronUp size={14} className="text-gray-500"/> : <ChevronDown size={14} className="text-gray-500"/>
                            ) : (
                                <button onClick={(e) => { e.stopPropagation(); actions.deleteItem(article.id); }} className="p-1.5 text-gray-500 hover:text-red-500"><Trash2 size={12}/></button>
                            )}
                        </div>
                        
                        {/* Expanded Pillar Content */}
                        {canExpand && isExpanded && (
                            <div className="bg-black/20 border-t border-white/5 p-3 animate-fade-in">
                                <div className="flex gap-2 mb-3">
                                    <button onClick={() => actions.handleEditClick(article)} className="flex-1 py-1.5 text-[10px] font-bold text-white bg-blue-600 rounded flex items-center justify-center gap-1"><Edit size={10} /> Edit Pilar</button>
                                    <button onClick={() => actions.deleteItem(article.id)} className="py-1.5 px-3 text-[10px] font-bold text-red-400 bg-red-900/20 rounded border border-red-900/30"><Trash2 size={10} /></button>
                                </div>
                                <h6 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Network size={10}/> Cluster ({linkedClusters.length})</h6>
                                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                                    {linkedClusters.map(cluster => (
                                        <div key={cluster.id} onClick={() => actions.handleEditClick(cluster)} className={`p-2 rounded border border-white/5 cursor-pointer flex gap-2 items-center group ${form.id === cluster.id ? 'bg-brand-orange/10 border-brand-orange' : ''}`}>
                                            <p className="text-[10px] text-gray-300 truncate flex-1">{cluster.title}</p>
                                            <button onClick={(e) => { e.stopPropagation(); actions.deleteItem(cluster.id); }} className="p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
         </div>
      </div>
      <div className="w-[30%] border-r border-white/5 bg-brand-dark flex flex-col min-w-[350px]">
         <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">{form.id ? <Edit size={14}/> : <Sparkles size={14}/>} {form.id ? "Editor" : "AI Studio"}</h3>
            {form.id || aiState.step > 0 ? <button onClick={actions.resetForm} className="text-[10px] text-red-400 flex items-center gap-1 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /> Reset</button> : null}
         </div>
         <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
            {/* EDITOR UI */}
            {(form.id || aiState.step === 3) ? (
                <div className="space-y-4">
                    <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel"/>
                    
                    {/* Strategy Switcher for existing articles */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Strategi Konten</label>
                        <div className="flex gap-2 mb-2">
                            <button 
                                onClick={() => setForm((p:any) => ({...p, type: 'pillar', pillar_id: 0}))}
                                className={`flex-1 py-1.5 text-[10px] rounded border ${form.type === 'pillar' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-black/20 border-white/10 text-gray-500'}`}
                            >
                                Pillar Page
                            </button>
                            <button 
                                onClick={() => setForm((p:any) => ({...p, type: 'cluster'}))}
                                className={`flex-1 py-1.5 text-[10px] rounded border ${form.type === 'cluster' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-black/20 border-white/10 text-gray-500'}`}
                            >
                                Cluster
                            </button>
                        </div>
                        {form.type === 'cluster' && (
                            <select 
                                value={form.pillar_id || 0}
                                onChange={(e) => setForm((p:any) => ({...p, pillar_id: parseInt(e.target.value)}))}
                                className="w-full bg-black text-white text-[10px] border border-white/10 rounded px-2 py-2 focus:border-brand-orange outline-none"
                            >
                                <option value={0}>-- Pilih Induk (Pillar) --</option>
                                {availablePillars.filter(p => p.id !== form.id).map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div className="relative">
                        <TextArea value={form.content} onChange={e => setForm((p:any) => ({...p, content: e.target.value}))} placeholder="# Konten..." className="h-96 text-[10px] font-mono pb-12"/>
                        
                        {/* Regenerate Button Overlay */}
                        <div className="absolute bottom-2 right-2 flex gap-2">
                             <button 
                                onClick={actions.generateTextContent}
                                disabled={loading.generatingText}
                                className="bg-brand-orange/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg hover:bg-brand-orange flex items-center gap-1 border border-white/20 transition-all"
                             >
                                {loading.generatingText ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>}
                                Regenerate AI
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 sticky bottom-0 bg-brand-dark pb-2">
                        <select value={form.status} onChange={(e) => setForm((p:any) => ({...p, status: e.target.value}))} className="bg-black/20 text-white text-[10px] rounded border border-white/10 px-2"><option value="draft">Draft</option><option value="published">Published</option></select>
                        <Button onClick={actions.handleSubmit} disabled={loading.uploading} className="py-2 text-[10px]">{loading.uploading ? <LoadingSpinner size={12}/> : <><Save size={12}/> SIMPAN</>}</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <Button onClick={actions.researchKeywords} disabled={loading.researching} className="w-full py-3 text-xs">{loading.researching ? <LoadingSpinner size={14}/> : "GENERATE TOPICS"}</Button>
                    {aiState.keywords.length > 0 && (
                        <div className="grid gap-2">{aiState.keywords.map((k, i) => <button key={i} onClick={() => actions.selectTopic(k)} className="text-left p-2 rounded border border-white/10 hover:border-brand-orange text-xs text-white">{k.keyword}</button>)}</div>
                    )}
                </div>
            )}
         </div>
      </div>
      <div className="w-[40%] bg-black flex flex-col relative overflow-hidden">
         <div className="p-4 border-b border-white/10 bg-brand-dark/50 flex justify-between items-center backdrop-blur-sm z-10 sticky top-0"><h4 className="text-[10px] font-bold text-gray-400 uppercase"><Eye size={12} /> Live Preview</h4></div>
         <div className="flex-grow overflow-y-auto custom-scrollbar p-8 relative">
            <SimpleMarkdown content={form.content} />
         </div>
      </div>
    </div>
  );
};
