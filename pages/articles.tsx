
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  ArrowRight, Search, Clock, Calendar, User, Tag, 
  X, ChevronRight, Share2, MessageCircle, Link as LinkIcon, 
  Facebook, Twitter, Linkedin, Hash, ShoppingCart, TrendingUp,
  ChevronLeft
} from 'lucide-react';
import { Article, Product } from '../types';
import { SectionHeader, Input, Button } from '../components/ui';
import { formatRupiah } from '../utils';

// --- HELPER: TEXT FORMATTER (Bold & Italic Parser) ---
// Memisahkan logic parsing supaya bisa dipakai di Paragraph, List, dll
const renderFormattedText = (text: string) => {
  // Regex: Split by **bold** OR *italic*
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

// --- ATOM: CATEGORY TAB ---
const CategoryTab = ({ 
  label, 
  active, 
  onClick 
}: { 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
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

// --- COMPONENT: FEATURED HERO ---
const FeaturedArticle = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="group relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-orange/50 transition-all shadow-2xl mb-16"
  >
    <img 
      src={article.image} 
      alt={article.title} 
      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
    
    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full uppercase tracking-wider">
          {article.category || "Featured"}
        </span>
        <span className="flex items-center gap-1 text-gray-300 text-xs font-bold">
          <Clock size={12} /> {article.readTime || "3 min read"}
        </span>
      </div>
      
      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-brand-orange transition-colors">
        {article.title}
      </h2>
      
      <p className="text-gray-300 text-lg line-clamp-2 mb-6 opacity-90">
        {article.excerpt}
      </p>
      
      <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all">
        Baca Selengkapnya <ArrowRight size={16} className="text-brand-orange" />
      </div>
    </div>
  </div>
);

// --- HELPER: Headings Extractor for ToC ---
const extractHeadings = (content: string) => {
  const lines = content.split('\n');
  const headings: { id: string, text: string, level: number }[] = [];
  
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('# ')) {
      const text = trimmed.replace('# ', '');
      headings.push({ id: text.toLowerCase().replace(/\s+/g, '-'), text, level: 1 });
    } else if (trimmed.startsWith('## ')) {
      const text = trimmed.replace('## ', '');
      headings.push({ id: text.toLowerCase().replace(/\s+/g, '-'), text, level: 2 });
    }
  });
  return headings;
};

// --- CONSTANTS ---
const BLOCKS_PER_PAGE = 12; // Jumlah paragraf/blok per halaman

// --- COMPONENT: ARTICLE MODAL ---
const ArticleDetailModal = ({ 
  article, 
  onClose,
  products 
}: { 
  article: Article, 
  onClose: () => void,
  products: Product[]
}) => {
  const [scrollPos, setScrollPos] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  
  // Split content into blocks (paragraphs) once
  const allBlocks = React.useMemo(() => {
    return article.content.split('\n').filter(line => line.trim() !== '');
  }, [article.content]);

  const totalPages = Math.ceil(allBlocks.length / BLOCKS_PER_PAGE);
  
  // Get current page blocks
  const currentBlocks = allBlocks.slice(
    (currentPage - 1) * BLOCKS_PER_PAGE, 
    currentPage * BLOCKS_PER_PAGE
  );

  // --- LOGIC: PRODUCT RECOMMENDATION ---
  let recommendedProducts = products.filter(p => 
    article.category && p.category.toLowerCase().includes(article.category.split(' ')[0].toLowerCase())
  );
  
  let recommendationTitle = "Produk Relevan";
  let RecommendationIcon = Tag;

  if (recommendedProducts.length === 0) {
    recommendedProducts = products.slice(0, 3);
    recommendationTitle = "Produk Paling Laris";
    RecommendationIcon = TrendingUp;
  } else {
    recommendedProducts = recommendedProducts.slice(0, 3);
  }

  // --- LOGIC: SCROLL & PROGRESS ---
  const MAX_HEIGHT = 450;
  const MIN_HEIGHT = 90; 
  const headerHeight = Math.max(MIN_HEIGHT, MAX_HEIGHT - scrollPos);
  const isCompact = headerHeight <= MIN_HEIGHT + 10; 
  
  // Extract headings from FULL content for ToC (not just paginated)
  const headings = extractHeadings(article.content);

  const handleScroll = () => {
    if (containerRef.current) {
      const currentScroll = containerRef.current.scrollTop;
      setScrollPos(currentScroll);

      // Calculate Progress Percentage
      const scrollHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      // If scrollHeight is 0 (content fits), progress is 100
      const progress = scrollHeight > 0 ? (currentScroll / scrollHeight) * 100 : 100;
      setReadingProgress(progress);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    // Scroll to top of content area (not header)
    if (containerRef.current) {
       // Smooth scroll slightly below header
       containerRef.current.scrollTo({ top: MAX_HEIGHT - 60, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const scrollToId = (id: string) => {
    // Note: If paginated, the element might not be in DOM. 
    // For simplicity in this version, ToC jumps to element if visible, 
    // or does nothing if on another page (Enhancement: could auto-switch page).
    const element = document.getElementById(id);
    if (element && containerRef.current) {
        const offset = 120;
        const elementTop = element.getBoundingClientRect().top;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        const relativePos = elementTop - containerTop;
        containerRef.current.scrollTo({
            top: containerRef.current.scrollTop + relativePos - offset,
            behavior: "smooth"
        });
    } else {
        // Fallback: If target not found (maybe on other page), just alert or ignore
        // Or implement logic to find which page the heading belongs to.
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-brand-black" aria-modal="true" role="dialog">
      
      {/* 1. FIXED HEADER */}
      <div 
        className="fixed top-0 left-0 w-full z-50 overflow-hidden border-b border-white/10 shadow-2xl transition-[height] duration-0 ease-linear"
        style={{ height: `${headerHeight}px` }}
      >
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50">
             <div 
                className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,95,31,0.8)] transition-all duration-150 ease-out"
                style={{ width: `${readingProgress}%` }}
             ></div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-[60] p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>

          <div className="absolute inset-0 w-full h-full">
              <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-brand-dark/95 transition-opacity duration-300 ${isCompact ? 'opacity-100' : 'opacity-30'}`}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 h-full relative z-10 flex flex-col justify-end pb-6 md:pb-10 max-w-7xl">
              {/* COMPACT TITLE */}
              <div 
                className={`absolute left-4 md:left-8 top-1/2 -translate-y-1/2 transition-all duration-300 ${isCompact ? 'opacity-100 translate-y-[-50%]' : 'opacity-0 translate-y-10 pointer-events-none'}`}
              >
                   <h2 className="text-lg md:text-xl font-bold text-white line-clamp-1 max-w-xl">{article.title}</h2>
              </div>

              {/* EXPANDED HERO */}
              <div 
                className={`transition-all duration-300 origin-bottom-left ${isCompact ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}
              >
                  <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-neon">
                          {article.category || "General"}
                      </span>
                      <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                          <Calendar size={12} /> {article.date}
                      </span>
                      <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                          <Clock size={12} /> {article.readTime || "5 min read"}
                      </span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight drop-shadow-lg max-w-4xl">
                      {article.title}
                  </h1>
              </div>
          </div>
      </div>

      {/* 2. SCROLL CONTAINER */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="h-full w-full overflow-y-auto custom-scrollbar relative bg-brand-black"
      >
        <div 
            className="container mx-auto px-4 pb-20 max-w-7xl"
            style={{ marginTop: `${MAX_HEIGHT}px` }}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 relative">
                
                {/* --- (1) KOLOM KIRI: DAFTAR ISI + SHARE/KOMENTAR --- */}
                <div className="hidden lg:block lg:col-span-3">
                    <div className="sticky top-28 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        
                        {/* Table of Contents */}
                        <div className="border-l border-white/10 pl-5 py-2">
                             <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Hash size={14}/> Daftar Isi
                             </h4>
                             <ul className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                                {headings.map((h, idx) => (
                                    <li key={idx}>
                                        <button 
                                            onClick={() => scrollToId(h.id)}
                                            className={`text-left text-sm transition-all hover:translate-x-1 ${
                                                h.level === 1 
                                                ? 'text-white font-bold hover:text-brand-orange' 
                                                : 'text-gray-500 pl-4 hover:text-gray-300'
                                            }`}
                                        >
                                            {h.text}
                                        </button>
                                    </li>
                                ))}
                             </ul>
                        </div>

                        {/* Share & Comments */}
                        <div className="border-l border-white/5 pl-5 pt-2">
                             <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Share2 size={12}/> Bagikan & Diskusi
                             </h5>
                             
                             {/* Social Icons Grid */}
                             <div className="grid grid-cols-4 gap-2 mb-6">
                                 <button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] hover:border-[#1877F2] transition-all" title="Share Facebook">
                                    <Facebook size={16} />
                                 </button>
                                 <button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] hover:border-[#1DA1F2] transition-all" title="Share Twitter">
                                    <Twitter size={16} />
                                 </button>
                                 <button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all" title="Share LinkedIn">
                                    <Linkedin size={16} />
                                 </button>
                                 <button className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-brand-orange hover:border-brand-orange transition-all" title="Copy Link">
                                    <LinkIcon size={16} />
                                 </button>
                             </div>

                             {/* Comments Button Placeholder */}
                             <button className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 text-gray-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group">
                                <MessageCircle size={14} className="group-hover:text-brand-orange"/> 
                                <span>Tulis Komentar</span>
                             </button>
                        </div>

                    </div>
                </div>

                {/* --- KOLOM TENGAH: KONTEN PAGINATED --- */}
                <div className="lg:col-span-6 min-h-screen">
                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
                        {currentBlocks.map((paragraph, idx) => {
                            // Using idx + offset to keep keys consistent across pages if needed, 
                            // though simple idx is fine for display
                            const p = paragraph.trim();
                            if (!p) return null;
                            
                            // Headings
                            if (p.startsWith('# ')) {
                                const text = p.replace('# ', '');
                                const id = text.toLowerCase().replace(/\s+/g, '-');
                                return <h1 id={id} key={idx} className="scroll-mt-32 text-3xl font-bold text-white mt-12 mb-6 pb-4 border-b border-white/10">{text}</h1>;
                            }
                            if (p.startsWith('## ')) {
                                const text = p.replace('## ', '');
                                const id = text.toLowerCase().replace(/\s+/g, '-');
                                return <h2 id={id} key={idx} className="scroll-mt-32 text-2xl font-bold text-white mt-10 mb-4 border-l-4 border-brand-orange pl-4">{text}</h2>;
                            }
                            if (p.startsWith('### ')) return <h3 key={idx} className="text-xl font-bold text-brand-orange mt-8 mb-3">{p.replace('### ', '')}</h3>;
                            
                            // Blockquote
                            if (p.startsWith('> ')) {
                                return (
                                    <blockquote key={idx} className="border-l-4 border-gray-600 bg-white/5 p-6 italic text-gray-300 my-8 rounded-r-xl">
                                        {renderFormattedText(p.replace('> ', ''))}
                                    </blockquote>
                                );
                            }
                            
                            // List Items
                            if (p.startsWith('* ') || p.startsWith('- ')) {
                                return (
                                    <div key={idx} className="flex gap-3 ml-2 mb-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-brand-orange mt-2.5 shrink-0"></div>
                                        <span>{renderFormattedText(p.substring(2))}</span>
                                    </div>
                                );
                            }

                            // Numbered List
                            if (/^\d+\.\s/.test(p)) {
                                const number = p.split('.')[0];
                                const text = p.substring(p.indexOf('.') + 1).trim();
                                return (
                                    <div key={idx} className="flex gap-3 ml-2 mb-3">
                                        <span className="text-brand-orange font-bold font-mono text-lg">{number}.</span>
                                        <span className="mt-1">{renderFormattedText(text)}</span>
                                    </div>
                                );
                            }

                            // Divider
                            if (p === '---') return <div key={idx} className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-12" />;

                            // Standard Paragraph
                            return (
                                <p key={idx} className="text-lg leading-8 text-gray-300">
                                    {renderFormattedText(p)}
                                </p>
                            );
                        })}
                    </div>
                    
                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                      <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
                         <Button 
                            variant="outline" 
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2"
                         >
                            <ChevronLeft size={16} /> Sebelumnya
                         </Button>
                         
                         <span className="text-sm font-bold text-gray-400">
                            Halaman <span className="text-brand-orange">{currentPage}</span> dari {totalPages}
                         </span>

                         <Button 
                            variant="primary" 
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2"
                         >
                            Selanjutnya <ChevronRight size={16} />
                         </Button>
                      </div>
                    )}

                    {/* Author Box (Shown only on last page) */}
                    {currentPage === totalPages && (
                      <div className="mt-20 p-8 bg-brand-card rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left animate-fade-in">
                           <div className="w-20 h-20 bg-brand-orange/20 rounded-full flex items-center justify-center text-brand-orange border border-brand-orange/30 shrink-0">
                              <User size={40} />
                           </div>
                           <div>
                              <p className="text-xs text-gray-500 uppercase font-bold mb-2">Tentang Penulis</p>
                              <h4 className="text-2xl font-bold text-white mb-2">{article.author || "Tim Redaksi"}</h4>
                              <p className="text-sm text-gray-400 leading-relaxed">
                                  Expert Consultant di PT Mesin Kasir Solo. Berpengalaman lebih dari 10 tahun membantu digitalisasi ribuan UMKM di Indonesia.
                              </p>
                           </div>
                      </div>
                    )}
                </div>

                {/* --- (2) KOLOM KANAN: FULL PRODUCT DISPLAY (Sticky) --- */}
                <div className="hidden lg:block lg:col-span-3">
                     <div className="sticky top-28 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                         
                         {/* Product Header */}
                         <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                            <RecommendationIcon size={16} className="text-brand-orange" />
                            <h5 className="text-xs font-bold text-white uppercase tracking-widest">{recommendationTitle}</h5>
                         </div>

                         {/* Vertical Product List */}
                         <div className="space-y-6">
                            {recommendedProducts.map(p => (
                                <div key={p.id} className="group bg-brand-card border border-white/10 rounded-2xl overflow-hidden hover:border-brand-orange transition-all shadow-lg hover:shadow-neon flex flex-col">
                                    <div className="relative h-40 w-full bg-black border-b border-white/5">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-brand-orange text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">{p.category}</span>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h6 className="font-bold text-white text-sm line-clamp-2 mb-2 min-h-[2.5rem]">{p.name}</h6>
                                        <p className="text-brand-orange font-bold text-sm mb-4">{formatRupiah(p.price)}</p>
                                        
                                        <a 
                                           href={`https://wa.me/6282325103336?text=Halo, saya lihat artikel "${article.title}" dan tertarik dengan produk ${p.name}`}
                                           target="_blank"
                                           rel="noreferrer"
                                           className="mt-auto w-full py-2.5 rounded-lg bg-white/5 hover:bg-brand-orange text-gray-300 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            <ShoppingCart size={14} /> Beli Sekarang
                                        </a>
                                    </div>
                                </div>
                            ))}
                         </div>
                         
                         {/* CTA Box */}
                         <div className="bg-gradient-to-br from-brand-orange/20 to-brand-dark border border-brand-orange/30 p-5 rounded-xl text-center mt-6">
                            <p className="text-xs text-gray-300 mb-3 font-bold">Butuh konsultasi lebih lanjut?</p>
                            <a href="https://wa.me/6282325103336" target="_blank" rel="noreferrer" className="block w-full py-2 bg-brand-orange text-white text-xs font-bold rounded hover:bg-brand-glow transition-all">
                                Chat Tim Ahli
                            </a>
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

// --- MAIN PAGE COMPONENT ---
export const ArticlesPage = ({ 
  articles,
  products 
}: { 
  articles: Article[], 
  products: Product[] // Receive products from parent
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Extract Categories dynamically
  const categories = ['Semua', ...Array.from(new Set(articles.map(a => a.category || 'Lainnya')))];

  // Filter Logic
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Wawasan &" 
        highlight="Edukasi" 
        subtitle="Panduan bisnis, review teknologi, dan strategi manajemen kasir." 
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 sticky top-24 z-30 bg-brand-black/90 backdrop-blur-md py-4 border-b border-white/10 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:border-none md:static">
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
          {categories.map(cat => (
            <React.Fragment key={cat}>
              <CategoryTab 
                label={cat} 
                active={selectedCategory === cat} 
                onClick={() => setSelectedCategory(cat)} 
              />
            </React.Fragment>
          ))}
        </div>

        <div className="relative w-full md:w-72 group">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Cari topik..." 
            className="pl-12 rounded-full bg-brand-card border-white/10 group-hover:border-brand-orange/50 transition-colors"
          />
          <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
        </div>
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-3xl border border-white/5 border-dashed">
          <Search size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Artikel tidak ditemukan</h3>
          <p className="text-gray-400">Coba kata kunci lain atau ganti kategori.</p>
        </div>
      ) : (
        <>
          {featuredArticle && (
             <FeaturedArticle 
               article={featuredArticle} 
               onClick={() => setSelectedArticle(featuredArticle)} 
             />
          )}

          {gridArticles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => (
                <div 
                  key={article.id} 
                  onClick={() => setSelectedArticle(article)}
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
              ))}
            </div>
          )}
        </>
      )}

      {selectedArticle && (
        <ArticleDetailModal 
          article={selectedArticle} 
          products={products} // Pass products to modal
          onClose={() => setSelectedArticle(null)} 
        />
      )}

    </div>
  );
};
