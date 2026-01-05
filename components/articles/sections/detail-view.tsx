
import React from 'react';
import { X, Calendar, Clock, Quote, Briefcase, ChevronLeft, ChevronRight, Hash, Share2, Facebook, Twitter, Linkedin, MessageCircle, Link as LinkIcon, Network, Target, TrendingUp, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Article, Product, SiteConfig } from '../../types';
import { ArticleDetailProps } from '../types';
import { optimizeImage, formatRupiah, slugify } from '../../../utils';
import { useArticleReader } from '../hooks/use-article-reader';
import { cleanId, renderFormattedText, extractHeadings } from '../utils';
import { MarkdownTable, FileDownloadCard, ProjectEmbedCard } from '../ui/content-renderers';
import { SidebarProductCard } from '../ui/cards';
import { Button, Input, TextArea } from '../../ui';

const ReaderHeader = ({ article, progress, currentHeight, maxHeight, minHeight, onClose, onWheelProxy }: any) => {
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
                  <div className="flex flex-wrap gap-3 mb-4"><span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-neon">{article.category}</span><span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Calendar size={12} /> {article.date}</span><span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Clock size={12} /> {article.readTime}</span></div>
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
              if (p.startsWith('# ')) { const text = p.replace('# ', ''); return <h1 id={cleanId(text)} key={idx} className="scroll-mt-32 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600 mt-12 mb-6 pb-4 border-b border-white/10 heading-observer">{text}</h1>; }
              if (p.startsWith('## ')) { const text = p.replace('## ', ''); return <h2 id={cleanId(text)} key={idx} className="scroll-mt-32 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600 mt-10 mb-4 border-l-4 border-brand-orange pl-4 heading-observer">{text}</h2>; }
              if (p.startsWith('### ')) { return <h3 key={idx} className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-500 mt-8 mb-3">{p.replace('### ', '')}</h3>; }
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

interface ExtendedDetailProps extends ArticleDetailProps {
    config?: SiteConfig;
}

export const ArticleReaderView = ({ article, onClose, products, allArticles, config }: ExtendedDetailProps) => {
  const { progress, scrollPos, containerRef, currentBlocks, currentReaderPage, totalReaderPages, handlePageChange, activeHeadingId, handleToCClick } = useArticleReader(article.content);
  const waNumber = config?.whatsappNumber || "6282325103336";
  
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
    <div className="fixed inset-0 z-[9999] bg-brand-black" aria-modal="true" role="dialog">
      <ReaderHeader article={article} progress={progress} currentHeight={currentHeaderHeight} maxHeight={MAX_HEIGHT} minHeight={MIN_HEIGHT} onClose={onClose} onWheelProxy={(e:any) => { if(containerRef.current) containerRef.current.scrollTop += e.deltaY; }} />
      {/* Removed direct onScroll prop, handled by ref inside hook */}
      <div ref={containerRef} className="h-full w-full overflow-y-auto custom-scrollbar relative bg-brand-black">
        <div style={{ height: `${MAX_HEIGHT}px` }} className="w-full bg-transparent pointer-events-none"></div>
        <div className="bg-brand-black relative z-10 border-t border-white/5 min-h-[100vh]">
            <div className="container mx-auto px-4 pb-20 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 relative">
                    
                    {/* LEFT SIDEBAR: TOC & SHARE */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-28 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                            <div className="border-l border-white/10 pl-5 py-2 mb-10"><h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2"><Hash size={14}/> Daftar Isi</h4><ul className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">{headings.length === 0 && <li className="text-xs text-gray-500 italic">Tidak ada sub-judul.</li>}{headings.map((h: any, idx: number) => (<li key={idx}><button onClick={() => handleToCClick(h)} className={`text-left text-sm transition-all duration-300 block w-full relative ${h.id === activeHeadingId ? 'text-brand-orange font-bold translate-x-2' : 'text-gray-500 hover:text-gray-300 hover:translate-x-1'} ${h.level > 1 ? 'pl-4' : ''}`}>{h.id === activeHeadingId && (<span className="absolute -left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-neon"></span>)}{h.text}</button></li>))}</ul></div>
                            <div className="border-l border-white/5 pl-5 pt-2 mb-10"><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Share2 size={12}/> Bagikan</h5><div className="grid grid-cols-4 gap-2 mb-6"><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all"><Facebook size={16} /></button><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all"><Twitter size={16} /></button><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-all"><Linkedin size={16} /></button><button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><LinkIcon size={16} /></button></div></div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-6 min-h-screen">
                        <ReaderContent blocks={currentBlocks} currentPage={currentReaderPage} totalPages={totalReaderPages} onPageChange={handlePageChange} article={article} />
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
  );
};
