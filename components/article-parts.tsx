
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Clock, Calendar, User, Tag, 
  X, ChevronRight, Share2, MessageCircle, Link as LinkIcon, 
  Facebook, Twitter, Linkedin, Hash, ShoppingCart, TrendingUp,
  ChevronLeft, Send, Plus, Check, Briefcase, HeartHandshake, Quote,
  Search, Filter, FolderOpen, ChevronDown, Network, FileText, Download, HardDrive, Layers,
  Skull, Flame, Target
} from 'lucide-react';
import { Article, Product } from '../types';
import { Button, Input, TextArea } from './ui';
import { formatRupiah, slugify } from '../utils';
import { useCart } from '../context/cart-context';
import { ProductDetailModal, FlyingParticle } from './shop-parts'; 

// --- DATA CONSTANTS (REBRANDED) ---
export const CATEGORY_TREE = [
  {
    id: 'business',
    label: 'Strategi Cuan (Biz)',
    subCategories: ['Bisnis Tips', 'Manajemen', 'Keuangan', 'HR', 'Franchise']
  },
  {
    id: 'tech',
    label: 'Bedah Alat (Tech)',
    subCategories: ['Hardware Review', 'Android POS', 'Windows POS', 'Teknologi', 'Tutorial']
  },
  {
    id: 'marketing',
    label: 'Marketing Jalanan',
    subCategories: ['Digital Marketing', 'Branding', 'Loyalty Program', 'Promosi']
  }
];

// --- ATOMS & MOLECULES FOR SIDEBAR ---

export const ArticleSearchWidget = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
  <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
     <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Search size={14} className="text-brand-orange"/> Cari Jawaban
     </h4>
     <div className="relative group">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Ketik masalah lo..." 
          className="pl-10 py-2 text-sm bg-black/40 border-white/5 focus:border-brand-orange/50 placeholder-gray-600"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
     </div>
  </div>
);

export const CategorySidebar = ({ selectedFilter, onSelect }: { selectedFilter: { type: 'parent' | 'sub' | 'all', value: string }, onSelect: (type: 'parent' | 'sub' | 'all', value: string) => void }) => {
  const [expandedParent, setExpandedParent] = useState<string | null>('business');
  const toggleParent = (id: string) => {
    setExpandedParent(expandedParent === id ? null : id);
  };

  return (
    <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
       <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} className="text-brand-orange"/> Arsip Taktis
          </h4>
          <button onClick={() => onSelect('all', '')} className={`text-[10px] px-2 py-1 rounded transition-colors ${selectedFilter.type === 'all' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white'}`}>RESET</button>
       </div>
       <div className="space-y-2">
          {CATEGORY_TREE.map((parent) => {
             const isExpanded = expandedParent === parent.id;
             const isActiveParent = selectedFilter.type === 'parent' && selectedFilter.value === parent.id;
             return (
               <div key={parent.id} className="overflow-hidden">
                  <button onClick={() => toggleParent(parent.id)} className={`w-full flex items-center justify-between p-2 rounded-lg transition-all group ${isActiveParent ? 'bg-white/10 text-brand-orange' : 'hover:bg-white/5 text-gray-300'}`}>
                     <div className="flex items-center gap-2"><FolderOpen size={16} className={isActiveParent ? "text-brand-orange" : "text-gray-500 group-hover:text-white"} /><span className="text-sm font-bold">{parent.label}</span></div>
                     {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                  </button>
                  <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                     <button onClick={() => onSelect('parent', parent.id)} className={`w-full text-left text-xs py-1.5 px-3 rounded border-l-2 transition-all flex items-center gap-2 ${isActiveParent ? 'border-brand-orange text-white bg-brand-orange/5' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${isActiveParent ? 'bg-brand-orange' : 'bg-transparent border border-gray-600'}`}></div>Semua {parent.label}
                     </button>
                     {parent.subCategories.map(sub => {
                        const isActiveSub = selectedFilter.type === 'sub' && selectedFilter.value === sub;
                        return (
                          <button key={sub} onClick={() => onSelect('sub', sub)} className={`w-full text-left text-xs py-1.5 px-3 rounded border-l-2 transition-all flex items-center gap-2 ${isActiveSub ? 'border-brand-orange text-brand-orange bg-brand-orange/5' : 'border-white/5 text-gray-500 hover:text-white hover:border-white/30'}`}>
                             <span className="text-[10px] opacity-50">#</span> {sub}
                          </button>
                        );
                     })}
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export const TagCloudWidget = ({ onSelectTag }: { onSelectTag: (tag: string) => void }) => (
  <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
     <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Flame size={14} className="text-red-500"/> Lagi Panas
     </h4>
     <div className="flex flex-wrap gap-2">
        {['Anti Fraud', 'Stok Opname', 'Tips Hemat', 'Promo', 'Tutorial'].map((tag, i) => (
           <button key={i} onClick={() => onSelectTag(tag)} className="text-[10px] bg-black/40 border border-white/10 hover:border-brand-orange/50 hover:text-brand-orange text-gray-400 px-2 py-1 rounded-md transition-all">#{tag}</button>
        ))}
     </div>
  </div>
);

export const ProductSidebarWidget = ({ products, onDetail }: { products: Product[], onDetail: (p: Product) => void }) => (
  <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
     <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
        <TrendingUp size={16} className="text-green-500" />
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Senjata Terlaris</h4>
     </div>
     <div className="space-y-4">
        {products.slice(0, 2).map((product) => (
           <React.Fragment key={product.id}>
              <SidebarProductCard product={product} onDetail={() => onDetail(product)} />
           </React.Fragment>
        ))}
     </div>
  </div>
);

export const EmptyArticleState = ({ onReset }: { onReset: () => void }) => (
  <div className="text-center py-20 bg-brand-card rounded-3xl border border-white/5 border-dashed">
    <Skull size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
    <h3 className="text-xl font-bold text-white mb-2">Zonk. Gak Ada Data.</h3>
    <p className="text-gray-400 text-sm max-w-sm mx-auto">Topik ini belum gue tulis. Coba cari kata kunci lain atau DM gue buat request pembahasan.</p>
    <button onClick={onReset} className="mt-6 text-brand-orange hover:text-white border border-brand-orange hover:bg-brand-orange px-6 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider">Reset Filter</button>
  </div>
);

export const ArticlePaginationControl = ({ currentPage, totalPages, setPage }: { currentPage: number, totalPages: number, setPage: (p: any) => void }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-4 py-6">
      <button onClick={() => setPage((p: number) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"><ChevronLeft size={20} /></button>
      <span className="text-brand-orange font-bold text-sm bg-brand-orange/10 px-3 py-1 rounded border border-brand-orange/20">Hal {currentPage} / {totalPages}</span>
      <button onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"><ChevronRight size={20} /></button>
    </div>
  );
};

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

export const useArticlePagination = (content: string, itemsPerPage: number = 30) => {
  const [currentPage, setCurrentPage] = useState(1);
  const allBlocks = useMemo(() => {
    const lines = content.split('\n');
    const grouped: string[] = [];
    let tableBuffer: string[] = [];
    let inTocBlock = false;

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (/^(#+)?\s*(\*\*|__)?(Daftar Isi|Table of Contents)(\*\*|__)?/i.test(trimmed)) { inTocBlock = true; return; }
      if (inTocBlock) {
        if (!trimmed) return;
        if (/^(\d+\.|[\-\*])\s/.test(trimmed)) return;
        if (/^\[.*\]\(#.*\)$/.test(trimmed)) return;
        if (trimmed === '---') { inTocBlock = false; return; }
        if (trimmed.startsWith('#')) { inTocBlock = false; } else { inTocBlock = false; }
      }
      if (/^<a\s+name=["'].*?["']\s*(\/?>|><\/a>)$/i.test(trimmed)) return;
      if (trimmed.startsWith('|')) { tableBuffer.push(line); } else {
        if (tableBuffer.length > 0) { grouped.push(tableBuffer.join('\n')); tableBuffer = []; }
        if (trimmed !== '') { grouped.push(line); }
      }
    });
    if (tableBuffer.length > 0) { grouped.push(tableBuffer.join('\n')); }
    return grouped;
  }, [content]);

  const totalPages = Math.ceil(allBlocks.length / itemsPerPage);
  const currentBlocks = allBlocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  return { currentPage, setCurrentPage, totalPages, currentBlocks, allBlocks };
};

const parseLinks = (text: string) => {
  const linkRegex = /(\[.*?\]\s*\(.*?\))/g;
  const parts = text.split(linkRegex);
  return parts.map((part, i) => {
    const linkMatch = part.match(/^\[(.*?)\]\s*\((.*?)\)$/);
    if (linkMatch) {
      const label = linkMatch[1];
      const url = linkMatch[2];
      if (url.startsWith('#') && !label) return null;
      const isInternal = url.startsWith('/') || url.startsWith('#');
      const className = "text-brand-orange hover:text-white underline decoration-brand-orange/50 hover:decoration-white transition-colors font-medium break-words";
      if (isInternal) {
          if (url.startsWith('#')) { return <a key={`link-${i}`} href={url} className={className}>{label}</a>; }
          return <Link key={`link-${i}`} to={url} className={className}>{label}</Link>;
      }
      return <a key={`link-${i}`} href={url} target="_blank" rel="noreferrer" className={className}>{label}</a>;
    }
    const italicParts = part.split(/(\*.*?\*)/g);
    return (<span key={`text-${i}`}>{italicParts.map((sub, j) => {
        if (sub.startsWith('*') && sub.endsWith('*') && sub.length > 2 && !sub.startsWith('**')) { return <em key={`italic-${j}`} className="text-gray-400 italic">{sub.slice(1, -1)}</em>; }
        return sub;
    })}</span>);
  });
};

export const renderFormattedText = (text: string) => {
  const boldRegex = /(\*\*.*?\*\*)/g;
  const parts = text.split(boldRegex);
  return <>{parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) { const content = part.slice(2, -2); return <strong key={i} className="text-white font-bold bg-brand-orange/10 px-1 rounded">{parseLinks(content)}</strong>; }
        return <span key={i}>{parseLinks(part)}</span>;
      })}</>;
};

const FileDownloadCard: React.FC<{ label: string, url: string }> = ({ label, url }) => {
    return (
        <div className="my-6 p-4 rounded-xl border border-blue-500/30 bg-blue-900/10 flex items-center gap-4 hover:bg-blue-900/20 transition-all group">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30 text-blue-400 shrink-0"><FileText size={24} /></div>
            <div className="flex-1 min-w-0"><h5 className="font-bold text-white text-sm truncate">{label}</h5><p className="text-xs text-blue-300/70 truncate flex items-center gap-1 mt-0.5"><HardDrive size={10} /> File Attachment</p></div>
            <a href={url} target="_blank" rel="noreferrer" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg transition-all"><Download size={14} /> <span className="hidden sm:inline">Download</span></a>
        </div>
    );
};

const ProjectEmbedCard: React.FC<{ title: string, url: string, image: string, desc: string }> = ({ title, url, image, desc }) => {
    return (
        <div className="my-10 bg-brand-dark rounded-2xl border border-white/5 overflow-hidden group hover:border-brand-orange/30 transition-all shadow-lg">
            <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-56 h-48 md:h-auto relative bg-black shrink-0">
                    <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                    <div className="absolute top-3 left-3 bg-brand-orange text-white text-[10px] font-bold px-2 py-1 rounded shadow-neon">STUDI KASUS</div>
                </div>
                <div className="p-6 flex flex-col justify-between flex-1">
                    <div><h4 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h4><p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">{desc}</p></div>
                    <div className="flex justify-end pt-4 border-t border-white/5"><Link to={url} className="inline-flex items-center gap-2 text-brand-orange font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all">Lihat Detail <ArrowRight size={16} /></Link></div>
                </div>
            </div>
        </div>
    );
};

const MarkdownTable: React.FC<{ content: string }> = ({ content }) => {
    const rows = content.trim().split('\n');
    if (rows.length < 2) return <pre className="whitespace-pre-wrap">{content}</pre>;
    const headers = rows[0].split('|').filter(c => c.trim() !== '').map(c => c.trim());
    const bodyRows = rows.slice(2); 
    return (
        <div className="overflow-x-auto my-8 rounded-xl border border-white/10 bg-black/20 shadow-lg">
            <table className="w-full text-sm text-left border-collapse min-w-[600px]">
                <thead className="bg-white/5 text-brand-orange uppercase text-xs font-bold tracking-wider"><tr>{headers.map((h, i) => <th key={i} className="px-6 py-4 border-b border-white/10">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-white/5">{bodyRows.map((row, idx) => {
                        const cells = row.split('|').filter((c, i, arr) => { if (i === 0 && c === '') return false; if (i === arr.length - 1 && c === '') return false; return true; });
                        return (<tr key={idx} className="hover:bg-white/5 transition-colors">{cells.map((c, cIdx) => (<td key={cIdx} className="px-6 py-4 border-r border-white/5 last:border-0 text-gray-300 align-top leading-relaxed">{renderFormattedText(c.trim())}</td>))}</tr>);
                    })}</tbody>
            </table>
        </div>
    );
};

const extractHeadings = (content: string) => {
  const allLines = content.split('\n');
  const nonEmptyLines = allLines.filter(line => line.trim() !== '');
  return nonEmptyLines.reduce((acc, line, index) => {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('daftar isi')) return acc;
    if (trimmed.startsWith('# ')) { acc.push({ id: trimmed.replace('# ', '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), text: trimmed.replace('# ', ''), level: 1, originalIndex: index }); } 
    else if (trimmed.startsWith('## ')) { acc.push({ id: trimmed.replace('## ', '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''), text: trimmed.replace('## ', ''), level: 2, originalIndex: index }); }
    return acc;
  }, [] as { id: string, text: string, level: number, originalIndex: number }[]);
};

const getAuthorRole = (authorName: string) => {
    if (authorName === 'Amin Maghfuri') { return { role: 'Founder & CEO', desc: 'Founder PT Mesin Kasir Solo. Inisiator platform SIBOS (ERP System) dan QALAM (Education Management). Berdedikasi membantu digitalisasi ribuan UMKM di Indonesia.', initials: 'AM' }; }
    return { role: 'Senior Content Writer', desc: 'Tim Redaksi & Riset di PT Mesin Kasir Solo. Spesialis dalam edukasi bisnis, strategi kasir, dan manajemen ritel modern.', initials: 'TR' };
};

export const CategoryTab = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${active ? 'bg-brand-orange text-white shadow-neon' : 'bg-brand-card text-gray-400 border border-white/5 hover:border-brand-orange/50 hover:text-white'}`}>{label}</button>
);

export const ArticleGridCard = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div onClick={onClick} className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-300 hover:shadow-neon hover:-translate-y-2 cursor-pointer flex flex-col group h-full">
    <div className="relative h-56 overflow-hidden">
      <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
      <div className="absolute top-4 left-4"><span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded border border-white/10">{article.category}</span></div>
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3"><span className="flex items-center gap-1"><Calendar size={12}/> {article.date}</span><span>•</span><span className="text-brand-orange font-bold">{article.readTime || '3 min'}</span></div>
      <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-brand-orange transition-colors">{article.title}</h3>
      <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-sm font-bold text-white mt-auto pt-4 border-t border-white/5 uppercase tracking-widest text-brand-orange">Sikat Habis <ChevronRight size={16} className="text-brand-orange group-hover:translate-x-1 transition-transform" /></div>
    </div>
  </div>
);

export const FeaturedArticleHero = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div onClick={onClick} className="group relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-orange/50 transition-all shadow-2xl mb-16">
    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" loading="eager" />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
    
    <div className="absolute top-8 right-8">
        <div className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-neon animate-pulse text-xs uppercase tracking-widest border border-red-400">Wajib Baca Bos</div>
    </div>

    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
      <div className="flex items-center gap-3 mb-4"><span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full uppercase tracking-wider">{article.category || "Featured"}</span><span className="flex items-center gap-1 text-gray-300 text-xs font-bold"><Clock size={12} /> {article.readTime || "3 min read"}</span></div>
      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-brand-orange transition-colors">{article.title}</h2>
      <p className="text-gray-300 text-lg line-clamp-2 mb-6 opacity-90">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all bg-brand-orange/20 w-fit px-4 py-2 rounded-lg border border-brand-orange/30 group-hover:bg-brand-orange group-hover:text-white">Bongkar Isinya <ArrowRight size={16} /></div>
    </div>
  </div>
);

export const SidebarProductCard = ({ product, onDetail }: { product: Product, onDetail: () => void }) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flyData, setFlyData] = useState<{ start: DOMRect, target: DOMRect } | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (isAnimating) return;
    const cartBtnDesktop = document.getElementById('desktop-cart-btn');
    const cartBtnMobile = document.getElementById('mobile-cart-btn');
    const targetEl = (cartBtnMobile && cartBtnMobile.offsetWidth > 0) ? cartBtnMobile : cartBtnDesktop;
    if (buttonRef.current && targetEl) {
      const startRect = buttonRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      setIsAnimating(true);
      setFlyData({ start: startRect, target: targetRect });
      setTimeout(() => { addToCart(product); setIsAdded(true); }, 600);
      setTimeout(() => { setIsAdded(false); setIsAnimating(false); setFlyData(null); }, 2000);
    } else { addToCart(product); }
  };

  return (
    <>
      {flyData && createPortal(<FlyingParticle src={product.image} startRect={flyData.start} targetRect={flyData.target} onFinish={() => {}} />, document.body)}
      <div onClick={onDetail} className="bg-brand-card border border-white/10 rounded-xl overflow-hidden hover:border-brand-orange transition-all shadow-lg hover:shadow-neon flex flex-col group cursor-pointer">
        <div className="relative h-28 w-full bg-black border-b border-white/5 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
          <div className="absolute top-2 right-2"><span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">{product.category}</span></div>
        </div>
        <div className="p-3 flex flex-col">
          <h6 className="font-bold text-white text-xs line-clamp-2 leading-snug mb-2 group-hover:text-brand-orange transition-colors min-h-[2.5em]">{product.name}</h6>
          <div className="mt-1">
            <p className="text-brand-orange font-bold text-sm mb-2 font-display">{formatRupiah(product.price)}</p>
            <div className="grid grid-cols-2 gap-2">
              <a href={`https://wa.me/6282325103336?text=Halo, saya tertarik dengan produk ${product.name} yang ada di artikel.`} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="px-2 py-1.5 rounded-lg border border-brand-orange text-gray-300 hover:text-white hover:bg-brand-orange font-bold text-[10px] transition-all hover:shadow-neon flex items-center justify-center gap-1"><MessageCircle size={12} /> Chat</a>
              <button ref={buttonRef} onClick={handleAddToCart} className={`px-2 py-1.5 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1 transition-all group/btn ${isAdded ? 'bg-green-500 text-white shadow-lg' : 'bg-brand-orange text-white hover:bg-brand-glow hover:shadow-neon'}`}>{isAdded ? <><Check size={12} /> OK</> : <><Plus size={12} className={isAnimating ? "animate-spin" : "group-hover/btn:scale-125 transition-transform"}/> Beli</>}</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ArticleSidebarRight = ({ article, products, allArticles, onProductClick }: { article: Article, products: Product[], allArticles: Article[], onProductClick: (p: Product) => void }) => {
  let recommendedProducts = products.filter((p: Product) => article.category && p.category.toLowerCase().includes(article.category.split(' ')[0].toLowerCase()));
  let recTitle = "Alat Tempur Relevan"; let RecIcon = Target;
  if (recommendedProducts.length === 0) { recommendedProducts = products.slice(0, 3); recTitle = "Senjata Andalan"; RecIcon = TrendingUp; } else { recommendedProducts = recommendedProducts.slice(0, 3); }
  let relatedArticles: Article[] = []; let relatedTitle = "Baca Juga";
  if (article.type === 'pillar' && article.related_pillars && article.related_pillars.length > 0) { relatedArticles = allArticles.filter(a => article.related_pillars?.includes(a.id)); relatedTitle = "Topik Utama Terkait"; } else { relatedArticles = allArticles.filter(a => a.id !== article.id).slice(0, 4); }

  return (
      <div className="space-y-6 sticky top-28">
            {relatedArticles.length > 0 && (
                <div className="bg-brand-card border border-white/5 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4"><Network size={16} className="text-brand-orange" /><h5 className="text-xs font-bold text-white uppercase tracking-widest">{relatedTitle}</h5></div>
                    <div className="space-y-4">{relatedArticles.map(a => (<Link to={`/articles/${slugify(a.title)}`} key={a.id} className="block group"><h6 className="text-xs font-bold text-gray-300 group-hover:text-brand-orange transition-colors line-clamp-2 mb-1">{a.title}</h6><div className="flex items-center gap-2 text-[10px] text-gray-600"><span>{a.date}</span><span>•</span><span>{a.readTime}</span></div></Link>))}</div>
                </div>
            )}
            <div>
                 <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4"><RecIcon size={16} className="text-brand-orange" /><h5 className="text-xs font-bold text-white uppercase tracking-widest">{recTitle}</h5></div>
                 <div className="space-y-4">{recommendedProducts.map((p: Product) => (<React.Fragment key={p.id}><SidebarProductCard product={p} onDetail={() => onProductClick(p)} /></React.Fragment>))}</div>
            </div>
            <div className="bg-gradient-to-br from-brand-orange/10 to-brand-dark border border-brand-orange/20 p-4 rounded-xl text-center mt-6"><p className="text-xs text-gray-300 mb-3 font-bold">Masih bingung sistem yang pas?</p><a href="https://wa.me/6282325103336" target="_blank" rel="noreferrer" className="block w-full py-2 bg-brand-orange text-white text-xs font-bold rounded hover:bg-brand-glow transition-all">Chat Founder</a></div>
      </div>
  );
};

export const ArticleReaderView = ({ article, onClose, products, allArticles }: { article: Article, onClose: () => void, products: Product[], allArticles: Article[] }) => {
  const { progress, scrollPos, containerRef, handleScroll } = useReadingProgress();
  const ITEMS_PER_PAGE = 30; 
  const { currentPage, setCurrentPage, totalPages, currentBlocks } = useArticlePagination(article.content, ITEMS_PER_PAGE);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');
  const [selectedSidebarProduct, setSelectedSidebarProduct] = useState<Product | null>(null);
  
  const MAX_HEIGHT = 500; const MIN_HEIGHT = 80; 
  const currentHeaderHeight = Math.max(MIN_HEIGHT, MAX_HEIGHT - scrollPos);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const timeout = setTimeout(() => {
      const headings = container.querySelectorAll('h1, h2');
      const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { setActiveHeadingId(entry.target.id); } }); }, { root: container, rootMargin: '-120px 0px -80% 0px', threshold: 0 });
      headings.forEach((h) => observer.observe(h));
      return () => observer.disconnect();
    }, 500);
    return () => clearTimeout(timeout);
  }, [currentBlocks, currentPage]);

  const handleToCClick = (heading: { id: string, originalIndex: number }) => {
    const targetPage = Math.floor(heading.originalIndex / ITEMS_PER_PAGE) + 1;
    if (targetPage !== currentPage) { setCurrentPage(targetPage); setTimeout(() => { scrollToId(heading.id); }, 300); } else { scrollToId(heading.id); }
  };

  const scrollToId = (id: string) => {
    const element = document.getElementById(id);
    if (element && containerRef.current) {
        const headerOffset = 120; 
        const containerRect = containerRef.current.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        const relativeTop = containerRef.current.scrollTop + (elementRect.top - containerRect.top);
        const offsetPosition = relativeTop - headerOffset;
        containerRef.current.scrollTo({ top: offsetPosition, behavior: "smooth" });
        setActiveHeadingId(id);
    }
  };

  const handlePageChange = (page: number) => { setCurrentPage(page); if(containerRef.current) containerRef.current.scrollTo({ top: MAX_HEIGHT - MIN_HEIGHT, behavior: 'smooth' }); }
  const handleHeaderWheelProxy = (e: React.WheelEvent) => { if (containerRef.current) { containerRef.current.scrollTop += e.deltaY; } };

  const ReaderHeader = ({ article, progress, currentHeight, maxHeight, minHeight, onClose, onWheelProxy }: any) => {
      const expandRatio = Math.max(0, (currentHeight - minHeight) / (maxHeight - minHeight));
      const collapseRatio = 1 - expandRatio;
      return (
        <div className="fixed top-0 left-0 w-full z-50 overflow-hidden border-b border-white/10 shadow-2xl will-change-[height]" style={{ height: `${currentHeight}px`, transition: 'none' }} onWheel={onWheelProxy}>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10 z-50"><div className="h-full bg-brand-orange shadow-[0_0_10px_rgba(255,95,31,0.8)]" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div></div>
            <button onClick={onClose} className="absolute top-6 right-6 z-[60] p-2 bg-black/50 hover:bg-red-500 text-white rounded-full backdrop-blur-md transition-colors border border-white/10 shadow-lg group"><X size={24} className="group-hover:rotate-90 transition-transform" /></button>
            <div className="absolute inset-0 w-full h-full"><img src={article.image} alt={article.title} className="w-full h-full object-cover" style={{ filter: `brightness(${0.4 + (expandRatio * 0.4)})` }} /><div className="absolute inset-0 bg-brand-black" style={{ opacity: collapseRatio * 0.9 }}></div><div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent" style={{ opacity: expandRatio }}></div></div>
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
      const authorInfo = getAuthorRole(article.author);
      return (
        <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed space-y-6">
            {currentPage === 1 && article.excerpt && (<div className="mb-10 relative"><div className="absolute -top-4 -left-2 text-brand-orange opacity-20"><Quote size={40} fill="currentColor" /></div><blockquote className="relative z-10 border-l-4 border-brand-orange bg-gradient-to-r from-brand-orange/10 to-transparent p-6 rounded-r-xl shadow-lg my-8"><p className="text-xl text-white font-medium italic leading-relaxed m-0">"{article.excerpt}"</p></blockquote></div>)}
            {blocks.map((paragraph: string, idx: number) => {
                const p = paragraph.trim();
                if (!p) return null;
                if (p.startsWith('|') && p.includes('|')) { return <MarkdownTable key={idx} content={p} />; }
                const fileMatch = p.match(/^\[FILE: (.*?)\]\((.*?)\)$/); if (fileMatch) { return <FileDownloadCard key={idx} label={fileMatch[1]} url={fileMatch[2]} />; }
                const projectMatch = p.match(/^\[PROJECT: (.*?) \| (.*?) \| (.*?) \| (.*?)\]$/); if (projectMatch) { return <ProjectEmbedCard key={idx} title={projectMatch[1]} url={projectMatch[2]} image={projectMatch[3]} desc={projectMatch[4]} />; }
                const cleanId = (text: string) => text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
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
            {currentPage === totalPages && (<div className="mt-16"><div className="mb-8 p-6 bg-brand-orange/5 border-l-4 border-brand-orange rounded-r-xl flex gap-4 items-start"><HeartHandshake className="text-brand-orange shrink-0 mt-1" size={24} /><div><p className="text-gray-300 italic text-base leading-relaxed">"Semoga artikel ini bermanfaat dan memberikan wawasan baru untuk perkembangan bisnis Anda. Jangan ragu untuk memulai langkah kecil digitalisasi hari ini. Sukses selalu, Juragan!"</p></div></div><div className="p-8 bg-brand-card rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left animate-fade-in hover:border-brand-orange/30 transition-colors"><div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-brand-orange/30 shrink-0 overflow-hidden bg-brand-dark shadow-neon">{article.author_avatar ? (<img src={article.author_avatar} alt={article.author} className="w-full h-full object-cover" />) : (<div className="w-full h-full bg-brand-orange flex items-center justify-center text-white font-bold text-2xl">{authorInfo.initials}</div>)}</div><div><p className="text-xs text-brand-orange uppercase font-bold mb-1 tracking-widest flex items-center justify-center sm:justify-start gap-2"><Briefcase size={12} /> {authorInfo.role}</p><h4 className="text-2xl font-bold text-white mb-3">{article.author || "Tim Redaksi"}</h4><p className="text-sm text-gray-400 leading-relaxed max-w-xl">{authorInfo.desc}</p></div></div></div>)}
        </div>
      );
  };

  const ArticleSidebarLeft = ({ article, onHeadingClick, activeId }: { article: Article, onHeadingClick: (h: any) => void, activeId: string }) => {
      const headings = useMemo(() => extractHeadings(article.content), [article.content]);
      const [comments, setComments] = useState<{name: string, text: string, time: string, website?: string}[]>([]);
      const [newName, setNewName] = useState(''); const [newWebsite, setNewWebsite] = useState(''); const [newComment, setNewComment] = useState(''); const [showCommentForm, setShowCommentForm] = useState(false);
      useEffect(() => { const storageKey = `mks_comments_${article.id}`; const saved = localStorage.getItem(storageKey); if (saved) { try { setComments(JSON.parse(saved)); } catch (e) { setComments([]); } } else { if (article.id === 1) { setComments([{ name: 'Budi Santoso', text: 'Sangat menginspirasi! Saya juga pake Android POS, memang lebih hemat.', time: '2 jam lalu' }]); } else { setComments([]); } } }, [article.id]);
      const handleShare = (platform: 'fb' | 'twitter' | 'linkedin' | 'copy') => { const url = window.location.href; const text = `Baca artikel menarik ini: ${article.title}`; switch(platform) { case 'fb': window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank'); break; case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank'); break; case 'linkedin': window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank'); break; case 'copy': navigator.clipboard.writeText(url); alert('Link artikel berhasil disalin!'); break; } };
      const submitComment = () => { if(!newComment.trim() || !newName.trim()) return alert("Mohon isi Nama dan Komentar."); const newEntry = { name: newName, text: newComment, website: newWebsite, time: 'Baru saja' }; const updatedList = [newEntry, ...comments]; setComments(updatedList); localStorage.setItem(`mks_comments_${article.id}`, JSON.stringify(updatedList)); setNewComment(''); setNewName(''); setNewWebsite(''); setShowCommentForm(false); };
      return (
        <>
          <div className="border-l border-white/10 pl-5 py-2 mb-10"><h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2"><Hash size={14}/> Daftar Isi</h4><ul className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">{headings.length === 0 && <li className="text-xs text-gray-500 italic">Tidak ada sub-judul.</li>}{headings.map((h: any, idx: number) => (<li key={idx}><button onClick={() => onHeadingClick(h)} className={`text-left text-sm transition-all duration-300 block w-full relative ${h.id === activeId ? 'text-brand-orange font-bold translate-x-2' : 'text-gray-500 hover:text-gray-300 hover:translate-x-1'} ${h.level > 1 ? 'pl-4' : ''}`}>{h.id === activeId && (<span className="absolute -left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-neon"></span>)}{h.text}</button></li>))}</ul></div>
          <div className="border-l border-white/5 pl-5 pt-2 mb-10"><h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Share2 size={12}/> Bagikan & Diskusi</h5><div className="grid grid-cols-4 gap-2 mb-6"><button onClick={() => handleShare('fb')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all"><Facebook size={16} /></button><button onClick={() => handleShare('twitter')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all"><Twitter size={16} /></button><button onClick={() => handleShare('linkedin')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-all"><Linkedin size={16} /></button><button onClick={() => handleShare('copy')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><LinkIcon size={16} /></button></div>{!showCommentForm ? (<button onClick={() => setShowCommentForm(true)} className="w-full py-3 rounded-lg bg-white/5 border border-white/10 hover:border-brand-orange hover:bg-brand-orange/10 text-gray-400 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 group mb-6"><MessageCircle size={14} className="group-hover:text-brand-orange"/> <span>Tulis Komentar ({comments.length})</span></button>) : (<div className="bg-brand-card border border-white/10 rounded-lg p-3 mb-6 animate-fade-in space-y-2"><Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nama Lengkap *" className="text-xs py-2 bg-black/20 border-white/10 focus:border-brand-orange" /><Input value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} placeholder="Website (Opsional - Backlink)" className="text-xs py-2 bg-black/20 border-white/10 focus:border-brand-orange" /><TextArea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Tulis pendapat Anda..." className="text-xs min-h-[80px] bg-black/20 border-white/10 focus:border-brand-orange" /><div className="flex gap-2"><Button onClick={() => setShowCommentForm(false)} variant="outline" className="flex-1 py-1 text-xs h-8">Batal</Button><Button onClick={submitComment} className="flex-1 py-1 text-xs h-8"><Send size={12}/> Kirim</Button></div></div>)}<div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">{comments.length === 0 && (<p className="text-gray-500 text-xs italic">Belum ada komentar. Jadilah yang pertama!</p>)}{comments.map((c, i) => (<div key={i} className="bg-black/20 p-3 rounded-lg border border-white/5"><div className="flex justify-between items-center mb-1">{c.website ? (<a href={c.website} target="_blank" rel="nofollow noreferrer" className="text-brand-orange font-bold text-xs hover:underline flex items-center gap-1 group">{c.name} <LinkIcon size={8} className="opacity-50 group-hover:opacity-100"/></a>) : (<span className="text-brand-orange font-bold text-xs">{c.name}</span>)}<span className="text-[10px] text-gray-600">{c.time}</span></div><p className="text-gray-400 text-xs leading-relaxed">{c.text}</p></div>))}</div></div>
        </>
      );
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-brand-black" aria-modal="true" role="dialog">
      <ReaderHeader article={article} progress={progress} currentHeight={currentHeaderHeight} maxHeight={MAX_HEIGHT} minHeight={MIN_HEIGHT} onClose={onClose} onWheelProxy={handleHeaderWheelProxy} />
      <div ref={containerRef} onScroll={handleScroll} className="h-full w-full overflow-y-auto custom-scrollbar relative bg-brand-black">
        <div style={{ height: `${MAX_HEIGHT}px` }} className="w-full bg-transparent pointer-events-none"></div>
        <div className="bg-brand-black relative z-10 border-t border-white/5 min-h-[100vh]">
            <div className="container mx-auto px-4 pb-20 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 relative">
                    <div className="hidden lg:block lg:col-span-3"><div className="sticky top-28 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}><ArticleSidebarLeft article={article} onHeadingClick={handleToCClick} activeId={activeHeadingId} /></div></div>
                    <div className="lg:col-span-6 min-h-screen"><ReaderContent blocks={currentBlocks} currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} article={article} /></div>
                    <div className="hidden lg:block lg:col-span-3"><div className="sticky top-28 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}><ArticleSidebarRight article={article} products={products} allArticles={allArticles} onProductClick={setSelectedSidebarProduct} /></div></div>
                </div>
            </div>
        </div>
      </div>
      {selectedSidebarProduct && (<ProductDetailModal product={selectedSidebarProduct} onClose={() => setSelectedSidebarProduct(null)} />)}
    </div>
  );
};
