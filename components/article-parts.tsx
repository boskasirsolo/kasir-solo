
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowRight, Clock, Calendar, User, Tag, 
  X, ChevronRight, Share2, MessageCircle, Link as LinkIcon, 
  Facebook, Twitter, Linkedin, Hash, ShoppingCart, TrendingUp,
  ChevronLeft, Send, ThumbsUp
} from 'lucide-react';
import { Article, Product } from '../types';
import { Button, Input, TextArea } from './ui';
import { formatRupiah } from '../utils';
import { useCart } from '../context/cart-context';

// ==========================================
// 1. LOGIC & HOOKS (Controller Layer for UI)
// ==========================================

export const useReadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [scrollPos, setScrollPos] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const currentScroll = containerRef.current.scrollTop;
      const scrollHeight = containerRef.current.scrollHeight;
      const clientHeight = containerRef.current.clientHeight;
      
      const height = scrollHeight - clientHeight;
      setScrollPos(currentScroll);
      setProgress(height > 0 ? (currentScroll / height) * 100 : 100);
    }
  };

  return { progress, scrollPos, containerRef, handleScroll };
};

// Ubah default itemsPerPage jadi 30 agar halaman tidak terlalu banyak (Max 3-4 halaman)
export const useArticlePagination = (content: string, itemsPerPage: number = 30) => {
  const [currentPage, setCurrentPage] = useState(1);

  const allBlocks = useMemo(() => {
    return content.split('\n').filter(line => line.trim() !== '');
  }, [content]);

  const totalPages = Math.ceil(allBlocks.length / itemsPerPage);
  
  const currentBlocks = allBlocks.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  return { currentPage, setCurrentPage, totalPages, currentBlocks, allBlocks };
};

// ==========================================
// 2. HELPERS & UTILS
// ==========================================

export const renderFormattedText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-bold bg-brand-orange/10 px-1 rounded">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="text-gray-400">{part.slice(1, -1)}</em>;
    }
    return part;
  });
};

// Updated: Now returns original index to help with pagination jumps
const extractHeadings = (content: string) => {
  const allLines = content.split('\n');
  // Filter empty lines to match pagination logic indices, but keep track of content
  const nonEmptyLines = allLines.filter(line => line.trim() !== '');
  
  return nonEmptyLines.reduce((acc, line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      acc.push({ 
        id: trimmed.replace('# ', '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), 
        text: trimmed.replace('# ', ''), 
        level: 1,
        originalIndex: index 
      });
    } else if (trimmed.startsWith('## ')) {
      acc.push({ 
        id: trimmed.replace('## ', '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), 
        text: trimmed.replace('## ', ''), 
        level: 2,
        originalIndex: index
      });
    }
    return acc;
  }, [] as { id: string, text: string, level: number, originalIndex: number }[]);
};

// ==========================================
// 3. ATOMS & MOLECULES (Visual Layer)
// ==========================================

export const CategoryTab = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
      active 
        ? 'bg-brand-orange text-white shadow-neon' 
        : 'bg-brand-card text-gray-400 border border-white/5 hover:border-brand-orange/50 hover:text-white'
    }`}
  >
    {label}
  </button>
);

export const ArticleGridCard = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-300 hover:shadow-neon hover:-translate-y-2 cursor-pointer flex flex-col group h-full"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={article.image} 
        alt={article.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      />
      <div className="absolute top-4 left-4">
         <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded border border-white/10">
           {article.category}
         </span>
      </div>
    </div>
    
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
         <span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span>
         <span>•</span>
         <span className="text-brand-orange font-bold">{article.readTime || '3 min'}</span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">
        {article.title}
      </h3>
      
      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
        {article.excerpt}
      </p>
      
      <div className="flex items-center gap-2 text-sm font-bold text-white mt-auto pt-4 border-t border-white/5">
        Baca <ChevronRight size={16} className="text-brand-orange group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </div>
);

export const FeaturedArticleHero = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-orange/50 transition-all shadow-2xl mb-16"
  >
    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full uppercase tracking-wider">{article.category || "Featured"}</span>
        <span className="flex items-center gap-1 text-gray-300 text-xs font-bold"><Clock size={12} /> {article.readTime || "3 min read"}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-brand-orange transition-colors">{article.title}</h2>
      <p className="text-gray-300 text-lg line-clamp-2 mb-6 opacity-90">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">Baca Selengkapnya <ArrowRight size={16} className="text-brand-orange" /></div>
    </div>
  </div>
);

// --- Sub-Components for Reader Modal ---

const ReaderHeader = ({ article, progress, currentHeight, maxHeight, minHeight, onClose, onWheelProxy }: any) => {
  // Hitung opacity berdasarkan tinggi saat ini
  const expandRatio = Math.max(0, (currentHeight - minHeight) / (maxHeight - minHeight));
  const collapseRatio = 1 - expandRatio;

  return (
    <div 
      className="fixed top-0 left-0 w-full z-50 overflow-hidden border-b border-white/10 shadow-2xl will-change-[height]" 
      style={{ height: `${currentHeight}px`, transition: 'none' }}
      onWheel={onWheelProxy} // PROXY SCROLL KE CONTAINER UTAMA
    >
        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
            <div className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,95,31,0.8)]" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
        </div>

        {/* Close Button */}
        <button onClick={onClose} className="absolute top-6 right-6 z-[60] p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg group">
          <X size={24} className="group-hover:rotate-90 transition-transform" />
        </button>

        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover" 
              style={{ filter: `brightness(${0.4 + (expandRatio * 0.4)})` }} // Gelap saat shrink
            />
            {/* Overlay Gradient untuk compact mode */}
            <div className="absolute inset-0 bg-brand-black" style={{ opacity: collapseRatio * 0.9 }}></div>
            {/* Gradient untuk expanded mode */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" style={{ opacity: expandRatio }}></div>
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 h-full relative z-10 max-w-7xl pointer-events-none">
            
            {/* Compact State Title (Muncul saat discroll ke bawah) */}
            <div 
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 flex items-center"
              style={{ opacity: collapseRatio, pointerEvents: collapseRatio > 0.5 ? 'auto' : 'none' }}
            >
               <h2 className="text-lg md:text-xl font-bold text-white line-clamp-1 max-w-xl drop-shadow-md">{article.title}</h2>
            </div>

            {/* Expanded State Content (Hilang saat discroll ke bawah) */}
            <div 
              className="absolute bottom-10 left-4 md:left-8 origin-bottom-left"
              style={{ 
                opacity: expandRatio, 
                transform: `scale(${0.9 + (expandRatio * 0.1)}) translateY(${collapseRatio * 20}px)`,
                pointerEvents: expandRatio > 0.5 ? 'auto' : 'none'
              }}
            >
                <div className="flex flex-wrap gap-3 mb-4">
                    <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-neon">{article.category}</span>
                    <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Calendar size={12} /> {article.date}</span>
                    <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10"><Clock size={12} /> {article.readTime}</span>
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight drop-shadow-lg max-w-4xl">{article.title}</h1>
            </div>
        </div>
    </div>
  );
};

const ReaderContent = ({ blocks, currentPage, totalPages, onPageChange, article }: any) => (
  <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
      {blocks.map((paragraph: string, idx: number) => {
          const p = paragraph.trim();
          if (!p) return null;
          
          const cleanId = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
          
          if (p.startsWith('# ')) {
            const text = p.replace('# ', '');
            return <h1 id={cleanId(text)} key={idx} className="scroll-mt-32 text-3xl font-bold text-white mt-12 mb-6 pb-4 border-b border-white/10 heading-observer">{text}</h1>;
          }
          if (p.startsWith('## ')) {
            const text = p.replace('## ', '');
            return <h2 id={cleanId(text)} key={idx} className="scroll-mt-32 text-2xl font-bold text-white mt-10 mb-4 border-l-4 border-brand-orange pl-4 heading-observer">{text}</h2>;
          }
          if (p.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold text-brand-orange mt-8 mb-3">{p.replace('### ', '')}</h3>;
          
          if (p.startsWith('> ')) return <blockquote key={idx} className="border-l-4 border-gray-600 bg-white/5 p-6 italic text-gray-300 my-8 rounded-r-xl">{renderFormattedText(p.replace('> ', ''))}</blockquote>;
          
          if (p.startsWith('* ') || p.startsWith('- ')) return <div key={idx} className="flex gap-3 ml-2 mb-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2.5 shrink-0"></div><span>{renderFormattedText(p.substring(2))}</span></div>;

          if (/^\d+\.\s/.test(p)) {
              const number = p.split('.')[0];
              return <div key={idx} className="flex gap-3 ml-2 mb-3"><span className="text-brand-orange font-bold font-mono text-lg">{number}.</span><span className="mt-1">{renderFormattedText(p.substring(p.indexOf('.') + 1).trim())}</span></div>;
          }

          if (p === '---') return <div key={idx} className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />;

          return <p key={idx} className="text-lg leading-8 text-gray-300">{renderFormattedText(p)}</p>;
      })}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
            <Button variant="outline" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-4 py-2"><ChevronLeft size={16} /> Sebelumnya</Button>
            <span className="text-sm font-bold text-gray-400">Halaman <span className="text-brand-orange">{currentPage}</span> dari {totalPages}</span>
            <Button variant="primary" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className="px-4 py-2">Selanjutnya <ChevronRight size={16} /></Button>
        </div>
      )}

      {/* Author Box (Last Page) */}
      {currentPage === totalPages && (
        <div className="mt-20 p-8 bg-brand-card rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left animate-fade-in">
              <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange border border-brand-orange/30 shrink-0"><User size={40} /></div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Tentang Penulis</p>
                <h4 className="text-2xl font-bold text-white mb-2">{article.author || "Tim Redaksi"}</h4>
                <p className="text-sm text-gray-400 leading-relaxed">Expert Consultant di PT Mesin Kasir Solo. Berpengalaman lebih dari 10 tahun membantu digitalisasi ribuan UMKM di Indonesia.</p>
              </div>
        </div>
      )}
  </div>
);

// --- SIDEBAR LEFT: Table of Contents & Socials & Comments ---
// Added activeId prop for highlight logic
const ArticleSidebarLeft = ({ 
  article, 
  onHeadingClick, 
  activeId 
}: { 
  article: Article, 
  onHeadingClick: (h: any) => void,
  activeId: string 
}) => {
  const headings = useMemo(() => extractHeadings(article.content), [article.content]);
  const [comments, setComments] = useState<{name: string, text: string, time: string}[]>([
      { name: 'Budi Santoso', text: 'Sangat menginspirasi! Saya juga pake Android POS, memang lebih hemat.', time: '2 jam lalu' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleShare = (platform: 'fb' | 'twitter' | 'linkedin' | 'copy') => {
    const url = window.location.href;
    const text = `Baca artikel menarik ini: ${article.title}`;
    
    switch(platform) {
        case 'fb': window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank'); break;
        case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank'); break;
        case 'linkedin': window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'); break;
        case 'copy': 
            navigator.clipboard.writeText(url);
            alert('Link artikel berhasil disalin!');
            break;
    }
  };

  const submitComment = () => {
      if(!newComment.trim()) return;
      setComments([{ name: 'Pengunjung', text: newComment, time: 'Baru saja' }, ...comments]);
      setNewComment('');
      setShowCommentForm(false);
  };

  return (
    <>
      <div className="border-l border-white/10 pl-5 py-2 mb-10">
            <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2"><Hash size={14}/> Daftar Isi</h4>
            <ul className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
              {headings.map((h: any, idx: number) => (
                  <li key={idx}>
                      <button 
                        onClick={() => onHeadingClick(h)} 
                        className={`text-left text-sm transition-all duration-300 block w-full relative ${
                          h.id === activeId 
                            ? 'text-brand-orange font-bold translate-x-2' 
                            : 'text-gray-500 hover:text-gray-300 hover:translate-x-1'
                        } ${h.level > 1 ? 'pl-4' : ''}`}
                      >
                        {/* Indicator dot for active state */}
                        {h.id === activeId && (
                          <span className="absolute -left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-neon"></span>
                        )}
                        {h.text}
                      </button>
                  </li>
              ))}
            </ul>
      </div>

      <div className="border-l border-white/5 pl-5 pt-2 mb-10">
            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Share2 size={12}/> Bagikan & Diskusi</h5>
            <div className="grid grid-cols-4 gap-2 mb-6">
                <button onClick={() => handleShare('fb')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all"><Facebook size={16} /></button>
                <button onClick={() => handleShare('twitter')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all"><Twitter size={16} /></button>
                <button onClick={() => handleShare('linkedin')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-all"><Linkedin size={16} /></button>
                <button onClick={() => handleShare('copy')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><LinkIcon size={16} /></button>
            </div>
            
            {/* Comment Section */}
            {!showCommentForm ? (
                <button 
                    onClick={() => setShowCommentForm(true)}
                    className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 text-gray-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group mb-6"
                >
                    <MessageCircle size={14} className="group-hover:text-brand-orange"/> 
                    <span>Tulis Komentar ({comments.length})</span>
                </button>
            ) : (
                <div className="bg-brand-card border border-white/10 rounded-lg p-3 mb-6 animate-fade-in">
                    <TextArea 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Tulis pendapat Anda..." 
                        className="text-xs min-h-[80px] mb-2"
                    />
                    <div className="flex gap-2">
                        <Button onClick={() => setShowCommentForm(false)} variant="outline" className="flex-1 py-1 text-xs">Batal</Button>
                        <Button onClick={submitComment} className="flex-1 py-1 text-xs"><Send size={12}/> Kirim</Button>
                    </div>
                </div>
            )}

            {/* Comment List (Preview) */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                {comments.map((c, i) => (
                    <div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-brand-orange font-bold text-xs">{c.name}</span>
                            <span className="text-[10px] text-gray-600">{c.time}</span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">{c.text}</p>
                    </div>
                ))}
            </div>
      </div>
    </>
  );
};

// --- SIDEBAR RIGHT: Product Recommendations ---
const ArticleSidebarRight = ({ article, products }: { article: Article, products: Product[] }) => {
  const { addToCart } = useCart();
  
  // Logic: Product Recommendation
  let recommendedProducts = products.filter((p: Product) => 
    article.category && p.category.toLowerCase().includes(article.category.split(' ')[0].toLowerCase())
  );
  
  let recTitle = "Produk Relevan";
  let RecIcon = Tag;
  
  if (recommendedProducts.length === 0) {
    recommendedProducts = products.slice(0, 3);
    recTitle = "Produk Paling Laris";
    RecIcon = TrendingUp;
  } else {
    recommendedProducts = recommendedProducts.slice(0, 3);
  }

  return (
      <div className="space-y-6 sticky top-28">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
              <RecIcon size={16} className="text-brand-orange" />
              <h5 className="text-xs font-bold text-white uppercase tracking-widest">{recTitle}</h5>
            </div>
            
            {/* Product Cards */}
            <div className="space-y-4">
              {recommendedProducts.map((p: Product) => (
                  <div key={p.id} className="group bg-brand-card border border-white/10 rounded-2xl overflow-hidden hover:border-brand-orange transition-all shadow-lg hover:shadow-neon flex flex-col">
                      <div className="relative h-32 w-full bg-black border-b border-white/5">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute top-2 right-2"><span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">{p.category}</span></div>
                      </div>
                      <div className="p-4 flex flex-col flex-grow">
                          <h6 className="font-bold text-white text-xs line-clamp-2 mb-2 min-h-[2.5rem]">{p.name}</h6>
                          <p className="text-brand-orange font-bold text-sm mb-4">{formatRupiah(p.price)}</p>
                          <button 
                            onClick={() => addToCart(p)}
                            className="mt-auto w-full py-2.5 rounded-lg bg-white/5 hover:bg-brand-orange text-gray-300 hover:text-white text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-2 group-btn"
                          >
                            <ShoppingCart size={14} /> Beli Sekarang
                          </button>
                      </div>
                  </div>
              ))}
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-brand-orange/10 to-brand-dark border border-brand-orange/20 p-4 rounded-xl text-center mt-6">
                <p className="text-xs text-gray-300 mb-3 font-bold">Butuh konsultasi lebih lanjut?</p>
                <a href="https://wa.me/6282325103336" target="_blank" rel="noreferrer" className="block w-full py-2 bg-brand-orange text-white text-xs font-bold rounded hover:bg-brand-glow transition-all">
                    Chat Tim Ahli
                </a>
             </div>
      </div>
  );
};

// ==========================================
// 4. ORGANISMS (Complex Components)
// ==========================================

export const ArticleReaderModal = ({ article, onClose, products }: { article: Article, onClose: () => void, products: Product[] }) => {
  const { progress, scrollPos, containerRef, handleScroll } = useReadingProgress();
  const ITEMS_PER_PAGE = 30; // Defined here to share with ToC logic
  const { currentPage, setCurrentPage, totalPages, currentBlocks } = useArticlePagination(article.content, ITEMS_PER_PAGE);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  
  const MAX_HEIGHT = 500;
  const MIN_HEIGHT = 80; 

  // Hitung tinggi header secara dinamis berdasarkan scrollPos
  const currentHeaderHeight = Math.max(MIN_HEIGHT, MAX_HEIGHT - scrollPos);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  // --- Scroll Spy Logic (Intersection Observer) ---
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Wait for content to render
    const timeout = setTimeout(() => {
      const headings = container.querySelectorAll('h1, h2');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHeadingId(entry.target.id);
            }
          });
        },
        {
          root: container,
          // Offset penting: Trigger saat elemen melewati bawah header (sekitar 120px dari atas container)
          // rootMargin: 'top right bottom left'
          rootMargin: '-120px 0px -80% 0px', 
          threshold: 0
        }
      );

      headings.forEach((h) => observer.observe(h));

      return () => observer.disconnect();
    }, 500); // Delay to ensure DOM is ready

    return () => clearTimeout(timeout);
  }, [currentBlocks, currentPage]); // Re-run when page/content changes


  // --- Smart Navigation Logic ---
  const handleToCClick = (heading: { id: string, originalIndex: number }) => {
    // 1. Hitung heading ini ada di halaman berapa
    const targetPage = Math.floor(heading.originalIndex / ITEMS_PER_PAGE) + 1;

    // 2. Jika beda halaman, pindah halaman dulu
    if (targetPage !== currentPage) {
      setCurrentPage(targetPage);
      // Tunggu render, baru scroll
      setTimeout(() => {
        scrollToId(heading.id);
      }, 300); // Delay agar DOM sempat render konten halaman baru
    } else {
      // Jika halaman sama, langsung scroll
      scrollToId(heading.id);
    }
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element && containerRef.current) {
        // Karena header sticky, kita perlu offset
        // Offset = Tinggi header saat ini (atau minimalnya) + sedikit buffer
        const headerOffset = 120; 
        
        // Use offsetTop relative to the scroll container
        // Note: element.offsetTop might be relative to a positioned parent. 
        // For prose content, usually relative to the container content div.
        // Safer way: Get bounding rect relative to container
        
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        
        // Calculate position inside the scrollable container
        // Current Scroll Top + (Element Top relative to Viewport - Container Top relative to Viewport)
        const relativeTop = containerRef.current.scrollTop + (elementRect.top - containerRect.top);
        
        const offsetPosition = relativeTop - headerOffset;

        containerRef.current.scrollTo({ top: offsetPosition, behavior: "smooth" });
        
        // Manually set active ID for immediate feedback
        setActiveHeadingId(id);
    }
  };

  const handlePageChange = (page: number) => {
     setCurrentPage(page);
     // Scroll ke titik tepat di bawah header
     if(containerRef.current) containerRef.current.scrollTo({ top: MAX_HEIGHT - MIN_HEIGHT, behavior: 'smooth' });
  }

  // Handle Wheel Event from Header Proxy
  const handleHeaderWheelProxy = (e: React.WheelEvent) => {
    if (containerRef.current) {
        containerRef.current.scrollTop += e.deltaY;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-brand-black" aria-modal="true" role="dialog">
      
      {/* Header Statis yang ukurannya berubah via prop */}
      {/* Added onWheelProxy to handle scroll when mouse is over fixed header */}
      <ReaderHeader 
        article={article} 
        progress={progress} 
        currentHeight={currentHeaderHeight}
        maxHeight={MAX_HEIGHT}
        minHeight={MIN_HEIGHT}
        onClose={onClose} 
        onWheelProxy={handleHeaderWheelProxy}
      />

      {/* Main Scroll Container */}
      {/* Container ini 'full height' tapi kontennya di-push ke bawah menggunakan spacer div */}
      <div 
        ref={containerRef} 
        onScroll={handleScroll} 
        className="h-full w-full overflow-y-auto custom-scrollbar relative bg-brand-black"
      >
        {/* Spacer Div: Memastikan konten mulai DI BAWAH header yang besar */}
        <div style={{ height: `${MAX_HEIGHT}px` }} className="w-full bg-transparent pointer-events-none"></div>

        {/* Content Area */}
        <div className="bg-brand-black relative z-10 border-t border-white/5 min-h-[100vh]">
            <div className="container mx-auto px-4 pb-20 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 relative">
                    
                    {/* Left Sidebar (Desktop Only) */}
                    <div className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-28 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                          <ArticleSidebarLeft 
                            article={article} 
                            onHeadingClick={handleToCClick} // Pass new smart handler
                            activeId={activeHeadingId} // Pass active state
                          />
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-6 min-h-screen">
                        <ReaderContent 
                          blocks={currentBlocks} 
                          currentPage={currentPage} 
                          totalPages={totalPages} 
                          onPageChange={handlePageChange} 
                          article={article}
                        />
                    </div>

                    {/* Right Sidebar (Product Recommendations) */}
                    <div className="hidden lg:block lg:col-span-3">
                         <div className="sticky top-28 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            <ArticleSidebarRight article={article} products={products} />
                         </div>
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
