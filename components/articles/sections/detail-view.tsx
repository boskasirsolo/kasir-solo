
import React from 'react';
import { X, Calendar, Clock, Quote, Briefcase, ChevronLeft, ChevronRight, Hash, Share2, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Network, Target, TrendingUp, Send, Globe, Loader2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article, Product, SiteConfig } from '../../types';
import { ArticleDetailProps } from '../types';
import { optimizeImage, formatRupiah, slugify, supabase } from '../../../utils';
import { useArticleReader } from '../hooks/use-article-reader';
import { cleanId, renderFormattedText, extractHeadings } from '../utils';
import { MarkdownTable, FileDownloadCard, ProjectEmbedCard } from '../ui/content-renderers';
import { SidebarProductCard } from '../ui/cards';
import { Button, Input, TextArea } from '../../ui';
import { SEOHelmet } from '../../seo';

const getPureCategory = (category: string) => {
  if (!category) return "General";
  return category.split(',').map(c => c.split('>').pop()?.trim()).filter(Boolean).join(', ');
};

const ReaderHeader = ({ article, progress, currentHeight, maxHeight, minHeight, onClose, onWheelProxy, adminStats }: any) => {
    const expandRatio = Math.max(0, (currentHeight - minHeight) / (maxHeight - minHeight));
    const collapseRatio = 1 - expandRatio;
    return (
      <div className="fixed top-0 left-0 w-full z-50 overflow-hidden border-b border-white/10 shadow-2xl will-change-[height]" style={{ height: `${currentHeight}px`, transition: 'none' }} onWheel={onWheelProxy}>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50"><div className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,95,31,0.8)]" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div></div>
          <button onClick={onClose} className="absolute top-6 right-6 z-[60] p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg group"><X size={24} className="group-hover:rotate-90 transition-transform" /></button>
          <div className="absolute inset-0 w-full h-full"><img src={optimizeImage(article.image, 1200)} alt={article.title} className="w-full h-full object-cover" style={{ filter: `brightness(${0.4 + (expandRatio * 0.4)})` }} /><div className="absolute inset-0 bg-brand-black" style={{ opacity: collapseRatio * 0.9 }}></div><div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" style={{ opacity: expandRatio }}></div></div>
          <div className="container mx-auto px-4 h-full relative z-10 max-w-7xl pointer-events-none">
              <div className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center" style={{ opacity: collapseRatio, pointerEvents: collapseRatio > 0.5 ? 'auto' : 'none' }}><h2 className="text-lg md:text-xl font-bold text-white line-clamp-1 max-w-xl drop-shadow-md">{article.title}</h2></div>
              <div className="absolute bottom-10 left-4 md:left-8 origin-bottom-left" style={{ opacity: expandRatio, transform: `scale(${0.9 + (expandRatio * 0.1)}) translateY(${collapseRatio * 20}px)`, pointerEvents: expandRatio > 0.5 ? 'auto' : 'none' }}>
                  <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-neon">{getPureCategory(article.category)}</span>
                      <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Calendar size={12} /> {article.date}</span>
                      <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Clock size={12} /> {article.readTime}</span>
                      
                      {/* GOD MODE BADGE (ONLY VISIBLE TO ADMIN) */}
                      {adminStats !== null && (
                          <span className="flex items-center gap-2 text-purple-300 text-xs font-bold bg-purple-900/60 px-3 py-1 rounded-full backdrop-blur-md border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-pulse">
                              <Eye size={12} className="text-purple-300" /> {adminStats} Views
                          </span>
                      )}
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight drop-shadow-lg max-w-4xl">{article.title}</h1>
              </div>
          </div>
      </div>
    );
};

const ReaderContent = ({ blocks, currentPage, totalPages, onPageChange, article }: any) => {
    return (
      <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
          {currentPage === 1 && article.excerpt && (<div className="mb-10 relative"><div className="absolute -top-4 -left-2 text-brand-orange opacity-20"><Quote size={40} fill="currentColor" /></div><blockquote className="relative z-10 border-l-4 border-brand-orange bg-gradient-to-r from-brand-orange/10 to-transparent p-6 rounded-r-xl shadow-lg my-8"><p className="text-xl text-white font-medium italic leading-relaxed m-0">"{article.excerpt}"</p></blockquote></div>)}
          {blocks.map((paragraph: string, idx: number) => {
              const p = paragraph.trim();
              if (!p) return null;
              if (p.startsWith('|') && p.includes('|')) { return <MarkdownTable key={idx} content={p} />; }
              const fileMatch = p.match(/^\[FILE: (.*?)\]\((.*?)\)$/); if (fileMatch) { return <FileDownloadCard key={idx} label={fileMatch[1]} url={fileMatch[2]} />; }
              const projectMatch = p.match(/^\[PROJECT: (.*?) \| (.*?) \| (.*?) \| (.*?)\]$/); if (projectMatch) { return <ProjectEmbedCard key={idx} title={projectMatch[1]} url={projectMatch[2]} image={projectMatch[3]} desc={projectMatch[4]} />; }
              
              // --- IMAGE HANDLING ---
              const imgMatch = p.match(/^!\[(.*?)\]\((.*?)\)$/);
              if (imgMatch) {
                  return (
                      <div key={idx} className="my-8 rounded-xl overflow-hidden border border-white/10 bg-black/20">
                          <img 
                              src={optimizeImage(imgMatch[2], 800)} 
                              alt={imgMatch[1]} 
                              className="w-full h-auto object-cover"
                              loading="lazy" 
                          />
                          {imgMatch[1] && imgMatch[1] !== 'image' && (
                              <p className="text-center text-sm text-gray-500 py-2 italic bg-black/40 m-0">{imgMatch[1]}</p>
                          )}
                      </div>
                  );
              }

              // --- VIDEO HANDLING (IFRAME) ---
              if (p.startsWith('<iframe') && p.endsWith('></iframe>')) {
                  return (
                      <div key={idx} className="my-8 aspect-video rounded-xl overflow-hidden border border-white/10 bg-black" dangerouslySetInnerHTML={{ __html: p }} />
                  );
              }

              // --- HEADINGS (VISUAL UPGRADE H1-H10) ---
              
              // Helper to clean content
              const getCleanContent = (prefix: string) => {
                  const content = p.replace(new RegExp(`^${prefix}\\s+`), '');
                  const cleanText = content.replace(/\*\*/g, '');
                  return { content, cleanText, id: cleanId(cleanText) };
              };

              // H10: Tech Spec Mono
              if (p.startsWith('########## ')) {
                  const { content, id } = getCleanContent('##########');
                  return <div id={id} key={idx} className="deep-heading scroll-mt-32 text-xs font-mono font-bold text-gray-600 bg-black/20 p-2 rounded border border-white/5 mt-4 mb-2 heading-observer">{renderFormattedText(content)}</div>;
              }

              // H9: Dotted Underline
              if (p.startsWith('######### ')) {
                  const { content, id } = getCleanContent('#########');
                  return <div id={id} key={idx} className="deep-heading scroll-mt-32 text-xs font-bold text-gray-500 underline decoration-dotted underline-offset-4 mt-4 mb-2 heading-observer">{renderFormattedText(content)}</div>;
              }

              // H8: Left Border Thin
              if (p.startsWith('######## ')) {
                  const { content, id } = getCleanContent('########');
                  return <div id={id} key={idx} className="deep-heading scroll-mt-32 text-sm font-bold text-gray-400 border-l-2 border-gray-700 pl-3 italic mt-5 mb-2 heading-observer">{renderFormattedText(content)}</div>;
              }

              // H7: Mini Label (Micro Heading)
              if (p.startsWith('####### ')) {
                  const { content, id } = getCleanContent('#######');
                  return <div id={id} key={idx} className="deep-heading scroll-mt-32 text-[10px] font-bold text-brand-orange uppercase tracking-[0.2em] border border-brand-orange/30 px-2 py-1 rounded-md w-fit mt-6 mb-2 heading-observer">{renderFormattedText(content)}</div>;
              }

              // H6: Caption Style (Small, Gray, Italic)
              if (p.startsWith('###### ')) {
                  const { content, id } = getCleanContent('######');
                  return <h6 id={id} key={idx} className="scroll-mt-32 text-sm font-bold text-gray-500 italic border-b border-white/5 pb-1 inline-block mt-6 mb-2 heading-observer">{renderFormattedText(content)}</h6>;
              }

              // H5: Label Style (Uppercase, Orange, Tracking)
              if (p.startsWith('##### ')) {
                  const { content, id } = getCleanContent('#####');
                  return <h5 id={id} key={idx} className="scroll-mt-32 text-sm font-bold text-brand-orange uppercase tracking-widest mt-8 mb-3 heading-observer flex items-center gap-2"><span className="w-1 h-3 bg-brand-orange rounded-full"></span>{renderFormattedText(content)}</h5>;
              }

              // H4: Sub-section (White, Bold, Simple)
              if (p.startsWith('#### ')) {
                  const { content, id } = getCleanContent('####');
                  return <h4 id={id} key={idx} className="scroll-mt-32 text-lg font-bold text-gray-200 mt-8 mb-2 heading-observer">{renderFormattedText(content)}</h4>;
              }

              // H3: Point (Bullet Dot, Medium Size)
              if (p.startsWith('### ')) { 
                  const { content, id } = getCleanContent('###');
                  return <h3 id={id} key={idx} className="scroll-mt-32 text-xl font-bold text-white mt-10 mb-3 heading-observer flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-brand-orange shrink-0"></span>{renderFormattedText(content)}</h3>; 
              }

              // H2: Major Section (Border Left, Large)
              if (p.startsWith('## ')) { 
                  const { content, id } = getCleanContent('##');
                  return <h2 id={id} key={idx} className="scroll-mt-32 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600 mt-12 mb-6 border-l-4 border-brand-orange pl-4 heading-observer">{renderFormattedText(content)}</h2>; 
              }

              // H1: Main Title (Bottom Border, Very Large)
              if (p.startsWith('# ')) { 
                  const { content, id } = getCleanContent('#');
                  return <h1 id={id} key={idx} className="scroll-mt-32 text-3xl md:text-4xl font-display font-bold text-white mt-16 mb-8 pb-4 border-b border-white/10 heading-observer">{renderFormattedText(content)}</h1>; 
              }
              
              if (p.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-gray-600 bg-white/5 p-6 italic text-gray-300 my-8 rounded-r-xl">{renderFormattedText(p.replace('> ', ''))}</blockquote>;
              if (p.startsWith('* ') || p.startsWith('- ')) return <div key={idx} className="flex gap-3 ml-2 mb-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2.5 shrink-0"></div><span>{renderFormattedText(p.substring(2))}</span></div>;
              if (/^\d+\.\s/.test(p)) { const number = p.split('.')[0]; return <div key={idx} className="flex gap-3 ml-2 mb-3"><span className="text-brand-orange font-bold font-mono text-lg">{number}.</span><span className="mt-1">{renderFormattedText(p.substring(p.indexOf('.') + 1).trim())}</span></div>; }
              if (p === '---') return <div key={idx} className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />;
              return <p key={idx} className="text-lg leading-8 text-gray-300">{renderFormattedText(p)}</p>;
          })}
          {totalPages > 1 && (<div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between"><Button variant="outline" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2"><ChevronLeft size={16} /> Sebelumnya</Button><span className="text-sm font-bold text-gray-400">Halaman <span className="text-brand-orange">{currentPage}</span> dari {totalPages}</span><Button variant="primary" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2">Selanjutnya <ChevronRight size={16} /></Button></div>)}
      </div>
    );
};

const CommentSection = ({ articleId }: { articleId: number }) => {
    const [comments, setComments] = React.useState<any[]>([]);
    const [form, setForm] = React.useState({ name: '', website: '', text: '' });
    const [loading, setLoading] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    // Fetch comments from Supabase
    React.useEffect(() => {
        const fetchComments = async () => {
            if (!supabase) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('article_comments')
                    .select('*')
                    .eq('article_id', articleId)
                    .order('created_at', { ascending: false });
                
                if (error) console.error("Error fetching comments:", error);
                else setComments(data || []);
            } catch (e) {
                console.error("Fetch error:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchComments();
    }, [articleId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.text) return alert("Isi nama dan komentar dulu bos.");
        
        let websiteUrl = form.website.trim();
        // Auto-fix URL scheme
        if (websiteUrl && !/^https?:\/\//i.test(websiteUrl)) {
            websiteUrl = 'https://' + websiteUrl;
        }

        if (!supabase) return alert("Koneksi database tidak tersedia.");

        setIsSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('article_comments')
                .insert([{
                    article_id: articleId,
                    name: form.name,
                    website: websiteUrl,
                    content: form.text
                }])
                .select()
                .single();

            if (error) throw error;

            // Optimistic update
            setComments([data, ...comments]);
            setForm({ name: '', website: '', text: '' });
        } catch(e: any) {
            alert(`Gagal kirim komentar: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper: Simple Time Ago
    const timeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " tahun lalu";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " bulan lalu";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " hari lalu";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " jam lalu";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " menit lalu";
        return "Baru saja";
    };

    return (
        <div className="mt-16 pt-10 border-t border-white/10 animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                <MessageCircle size={20} className="text-brand-orange"/> Diskusi Juragan ({comments.length})
            </h3>

            <div className="space-y-6 mb-10 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                {loading && <div className="text-center text-gray-500 py-4"><Loader2 className="animate-spin mx-auto"/> Loading komentar...</div>}
                
                {!loading && comments.length === 0 && (
                    <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-gray-500 text-sm">Belum ada komentar. Jadilah yang pertama!</p>
                    </div>
                )}

                {comments.map(c => (
                    <div key={c.id} className="flex gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-gray-500 font-bold shrink-0 group-hover:border-brand-orange/50 group-hover:text-brand-orange transition-colors">
                            {c.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {c.website ? (
                                    <a 
                                        href={c.website} 
                                        target="_blank" 
                                        rel="nofollow noreferrer" 
                                        className="text-sm font-bold text-brand-orange hover:underline hover:text-white transition-colors flex items-center gap-1"
                                    >
                                        {c.name} <Globe size={10} />
                                    </a>
                                ) : (
                                    <h5 className="text-sm font-bold text-white">{c.name}</h5>
                                )}
                                <span className="text-[10px] text-gray-500">• {timeAgo(c.created_at)}</span>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{c.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                    <Send size={14} className="text-gray-500"/> Tinggalkan Jejak
                </h4>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                            value={form.name} 
                            onChange={(e: any) => setForm({...form, name: e.target.value})} 
                            placeholder="Nama Panggilan" 
                            className="bg-black/40 text-sm"
                        />
                        <Input 
                            value={form.website} 
                            onChange={(e: any) => setForm({...form, website: e.target.value})} 
                            placeholder="Website (Opsional - Backlink)" 
                            className="bg-black/40 text-sm"
                        />
                    </div>
                    <TextArea 
                        value={form.text} 
                        onChange={(e: any) => setForm({...form, text: e.target.value})} 
                        placeholder="Tulis pendapat lo..." 
                        className="bg-black/40 text-sm h-24"
                    />
                    <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-sm font-bold shadow-neon hover:shadow-neon-strong">
                        {isSubmitting ? <Loader2 className="animate-spin"/> : 'KIRIM KOMENTAR'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

interface ExtendedDetailProps extends ArticleDetailProps {
    config?: SiteConfig;
}

export const ArticleReaderView = ({ article, onClose, products, allArticles, config }: ExtendedDetailProps) => {
  const { progress, scrollPos, containerRef, currentBlocks, currentReaderPage, totalReaderPages, handlePageChange, activeHeadingId, handleToCClick } = useArticleReader(article.content);
  const waNumber = config?.whatsappNumber || "6282325103336";
  const [adminStats, setAdminStats] = React.useState<number | null>(null);
  
  // GOD MODE LOGIC: Check session and fetch stats
  React.useEffect(() => {
      const checkStats = async () => {
          // 1. Check Auth (Is Admin?)
          if (!supabase) return;
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
              // Admin Detected, Fetch Stats
              const slugPath = `/articles/${slugify(article.title)}`;
              // Note: Using ILIKE to match variations like /articles/slug?param=1
              const { count } = await supabase
                  .from('analytics_logs')
                  .select('*', { count: 'exact', head: true })
                  .ilike('page_path', `%${slugPath}%`)
                  .eq('event_type', 'page_view');
              
              setAdminStats(count || 0);
          }
      };
      checkStats();
  }, [article.title]);

  const MAX_HEIGHT = 500; const MIN_HEIGHT = 80; 
  const currentHeaderHeight = Math.max(MIN_HEIGHT, MAX_HEIGHT - scrollPos);
  
  const headings = React.useMemo(() => extractHeadings(article.content), [article.content]);

  // Sidebar Elements
  let recommendedProducts = products.filter((p: Product) => article.category && p.category.toLowerCase().includes(article.category.split(' ')[0].toLowerCase()));
  let recTitle = "Alat Tempur Relevan"; let RecIcon = Target;
  if (recommendedProducts.length === 0) { recommendedProducts = products.slice(0, 3); recTitle = "Senjata Andalan"; RecIcon = TrendingUp; } else { recommendedProducts = recommendedProducts.slice(0, 3); }
  let relatedArticles: Article[] = []; let relatedTitle = "Baca Juga";
  if (article.type === 'pillar' && article.related_pillars && article.related_pillars.length > 0) { relatedArticles = allArticles.filter(a => article.related_pillars?.includes(a.id)); relatedTitle = "Topik Utama Terkait"; } else { relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 4); }

  return (
    <>
      <SEOHelmet 
        title={article.title}
        description={article.excerpt || article.content.substring(0, 150)}
        image={article.image}
        type="article"
      />
      <div className="fixed inset-0 z-[9999] bg-brand-black" aria-modal="true" role="dialog">
        {/* Pass adminStats to Header */}
        <ReaderHeader 
            article={article} 
            progress={progress} 
            currentHeight={currentHeaderHeight} 
            maxHeight={MAX_HEIGHT} 
            minHeight={MIN_HEIGHT} 
            onClose={onClose} 
            onWheelProxy={(e:any) => { if(containerRef.current) containerRef.current.scrollTop += e.deltaY; }} 
            adminStats={adminStats}
        />
        {/* Removed direct onScroll prop, handled by ref inside hook */}
        <div ref={containerRef} className="h-full w-full overflow-y-auto custom-scrollbar relative bg-brand-black">
          <div style={{ height: `${MAX_HEIGHT}px` }} className="w-full bg-transparent pointer-events-none"></div>
          <div className="bg-brand-black relative z-10 border-t border-white/5 min-h-[100vh]">
              <div className="container mx-auto px-4 pb-20 max-w-7xl">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 relative">
                      
                      {/* LEFT SIDEBAR: TOC & SHARE */}
                      <div className="hidden lg:block lg:col-span-3">
                          <div className="sticky top-28 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                              <div className="border-l border-white/10 pl-5 py-2 mb-10">
                                <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2"><Hash size={14}/> Daftar Isi</h4>
                                <ul className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                    {headings.length === 0 && <li className="text-xs text-gray-500 italic">Tidak ada sub-judul.</li>}
                                    {headings.map((h: any, idx: number) => {
                                        // Dynamic padding based on level (1-10)
                                        // Cap at level 6 visual indent to prevent breaking layout
                                        const visualLevel = Math.min(h.level, 6);
                                        const paddingLeft = (visualLevel - 1) * 12; 
                                        
                                        return (
                                            <li key={idx} style={{ paddingLeft: `${paddingLeft}px` }}>
                                                <button 
                                                    onClick={() => handleToCClick(h)} 
                                                    className={`text-left text-sm transition-all duration-300 block w-full relative ${h.id === activeHeadingId ? 'text-brand-orange font-bold translate-x-2' : 'text-gray-500 hover:text-gray-300 hover:translate-x-1'}`}
                                                >
                                                    {h.id === activeHeadingId && (<span className="absolute -left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-neon"></span>)}
                                                    {h.text}
                                                </button>
                                            </li>
                                        );
                                    })}
                                </ul>
                              </div>
                              <div className="border-l border-white/5 pl-5 pt-2 mb-10"><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Share2 size={12}/> Bagikan</h5><div className="grid grid-cols-4 gap-2 mb-6"><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all"><Facebook size={16} /></button><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all"><Twitter size={16} /></button><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-all"><Linkedin size={16} /></button><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><LinkIcon size={16} /></button></div></div>
                          </div>
                      </div>

                      {/* MAIN CONTENT */}
                      <div className="lg:col-span-6 min-h-screen">
                          <ReaderContent blocks={currentBlocks} currentPage={currentReaderPage} totalPages={totalReaderPages} onPageChange={handlePageChange} article={article} />
                          {/* COMMENT SECTION */}
                          <CommentSection articleId={article.id} />
                      </div>

                      {/* RIGHT SIDEBAR: PRODUCTS & RELATED */}
                      <div className="hidden lg:block lg:col-span-3">
                          <div className="sticky top-28 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                              {relatedArticles.length > 0 && (
                                  <div className="bg-brand-card border border-white/5 rounded-xl p-5 shadow-lg">
                                      <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4"><Network size={16} className="text-brand-orange" /><h5 className="text-xs font-bold text-white uppercase tracking-widest">{relatedTitle}</h5></div>
                                      <div className="space-y-4">{relatedArticles.map(a => (<Link to={`/articles/${slugify(a.title)}`} key={a.id} className="block group"><h6 className="text-xs font-bold text-gray-300 group-hover:text-brand-orange transition-colors line-clamp-2 mb-1">{a.title}</h6><div className="flex items-center gap-2 text-[10px] text-gray-600"><span>{a.date}</span><span>•</span><span>{a.readTime}</span></div></Link>))}</div>
                                  </div>
                              )}
                              <div>
                                  <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4"><RecIcon size={16} className="text-brand-orange" /><h5 className="text-xs font-bold text-white uppercase tracking-widest">{recTitle}</h5></div>
                                  <div className="space-y-4">{recommendedProducts.map((p: Product) => (<React.Fragment key={p.id}><SidebarProductCard product={p} onDetail={() => window.open(`https://wa.me/${waNumber}?text=Tanya produk ${p.name}`, '_blank')} waNumber={waNumber} /></React.Fragment>))}</div>
                              </div>
                          </div>
                      </div>

                  </div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};
