
import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, X, MessageCircle, Tag, ShoppingCart, Plus, Check, ArrowLeft, PackageOpen, Scale, XCircle, ThumbsUp } from 'lucide-react';
import { Product } from '../types';
import { Badge, Card, Input, Button } from './ui';
import { formatRupiah } from '../utils';
import { useCart } from '../context/cart-context';
import { createPortal } from 'react-dom';

// --- ATOMS ---

export const ShopHero = () => (
  <div className="text-left mb-8 md:mb-0">
    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
      Katalog <span className="text-brand-orange">Mesin Kasir</span>
    </h2>
    <p className="text-gray-400 text-lg">Pilihan paket POS terbaik untuk Retail, F&B, dan Jasa</p>
  </div>
);

// ... (Rest of imports like SearchWidget, EmptyState, PaginationControl, ComparisonModal, ComparisonBar are unchanged, keeping them brief for XML context) ...
export const SearchWidget = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
  <div className="relative group w-full md:w-80">
    <Input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder="Cari hardware..." 
      className="pl-12 py-3 rounded-full bg-brand-card/50 border-white/10 focus:border-brand-orange transition-all"
    />
    <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
    <PackageOpen size={48} className="text-gray-600 mb-4" />
    <h3 className="text-xl font-bold text-white mb-2">Produk Tidak Ditemukan</h3>
    <p className="text-gray-500 text-sm">Coba gunakan kata kunci lain atau ubah pencarian.</p>
  </div>
);

export const PaginationControl = ({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-4 py-8 border-t border-white/5 mt-8">
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <span className="text-brand-orange font-display font-bold px-4 py-2 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
        Page {page} / {totalPages}
      </span>
      <button 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export const ComparisonModal = ({ products, onClose, onRemove }: { products: Product[], onClose: () => void, onRemove: (id: number) => void }) => {
    const allSpecKeys = Array.from(new Set(products.flatMap(p => p.specs ? Object.keys(p.specs) : [])));
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-10 animate-fade-in" role="dialog">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={onClose}></div>
            <div className="relative w-full max-w-6xl h-[85vh] bg-brand-dark border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-brand-card shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Scale className="text-brand-orange"/> Perbandingan Produk
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Bandingkan spesifikasi teknis untuk keputusan terbaik.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-grow overflow-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="p-4 bg-black/40 text-gray-500 text-xs font-bold uppercase tracking-wider sticky top-0 left-0 z-20 min-w-[150px] border-b border-r border-white/10 backdrop-blur-sm">Fitur</th>
                                {products.map(p => (
                                    <th key={p.id} className="p-4 bg-brand-card/90 text-white min-w-[250px] border-b border-r border-white/10 sticky top-0 z-10 backdrop-blur-sm">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="h-16 w-16 bg-black rounded-lg border border-white/10 overflow-hidden shrink-0">
                                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                                            </div>
                                            <button onClick={() => onRemove(p.id)} className="text-gray-500 hover:text-red-500 p-1"><XCircle size={16}/></button>
                                        </div>
                                        <h4 className="font-bold text-sm leading-tight mb-1">{p.name}</h4>
                                        <p className="text-brand-orange font-bold text-sm">{formatRupiah(p.price)}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-300 divide-y divide-white/5">
                            {allSpecKeys.length === 0 && <tr><td colSpan={products.length + 1} className="p-8 text-center text-gray-500 italic">Belum ada data spesifikasi detail.</td></tr>}
                            {allSpecKeys.map(key => (
                                <tr key={key} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 border-r border-white/10 font-bold text-gray-400 bg-black/20">{key}</td>
                                    {products.map(p => (
                                        <td key={p.id} className="p-4 border-r border-white/10">{p.specs?.[key] || <span className="text-gray-600">-</span>}</td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="bg-brand-orange/5 font-bold">
                                <td className="p-4 border-r border-white/10 text-brand-orange">Kategori</td>
                                {products.map(p => (
                                    <td key={p.id} className="p-4 border-r border-white/10 text-white">{p.category}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>, document.body
    );
};

export const ComparisonBar = ({ selectedProducts, onRemove, onClear, onCompare }: { selectedProducts: Product[], onRemove: (id: number) => void, onClear: () => void, onCompare: () => void }) => {
    if (selectedProducts.length === 0) return null;
    return createPortal(
        <div className="fixed bottom-0 left-0 right-0 z-[9000] p-4 flex justify-center animate-fade-in">
            <div className="bg-brand-dark/95 backdrop-blur-xl border border-brand-orange/30 rounded-2xl shadow-neon-strong p-4 flex flex-col md:flex-row items-center gap-6 max-w-4xl w-full mx-4">
                <div className="flex items-center gap-3 md:border-r md:border-white/10 md:pr-6 w-full md:w-auto">
                    <div className="w-10 h-10 rounded-full bg-brand-orange flex items-center justify-center text-white shadow-neon shrink-0"><Scale size={20} /></div>
                    <div><h4 className="text-white font-bold text-sm">Komparasi ({selectedProducts.length}/3)</h4><button onClick={onClear} className="text-[10px] text-red-400 hover:underline">Hapus Semua</button></div>
                </div>
                <div className="flex gap-3 overflow-x-auto max-w-full md:flex-1 py-1 custom-scrollbar">
                    {selectedProducts.map(p => (
                        <div key={p.id} className="relative group shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-black border border-white/20 overflow-hidden"><img src={p.image} className="w-full h-full object-cover" loading="lazy" /></div>
                            <button onClick={() => onRemove(p.id)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                        </div>
                    ))}
                    {[...Array(3 - selectedProducts.length)].map((_, i) => (
                        <div key={i} className="w-12 h-12 rounded-lg border border-dashed border-white/10 flex items-center justify-center text-gray-600 shrink-0"><span className="text-[10px]">{i + 1 + selectedProducts.length}</span></div>
                    ))}
                </div>
                <Button onClick={onCompare} className="w-full md:w-auto px-6 py-3 whitespace-nowrap shadow-neon" disabled={selectedProducts.length < 2}>{selectedProducts.length < 2 ? 'Pilih min. 2' : 'BANDINGKAN'}</Button>
            </div>
        </div>, document.body
    );
};

// --- MOLECULES: PRODUCT CARD ---

const ProductImage = ({ image, name, category }: { image: string, name: string, category: string }) => (
  <div className="relative h-56 overflow-hidden bg-black">
    <img 
      src={image} 
      alt={name} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
      loading="lazy"
      decoding="async"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
    <div className="absolute top-3 right-3">
      <Badge className="backdrop-blur-md bg-black/50 border-white/10">{category}</Badge>
    </div>
  </div>
);

// --- COMPONENT: FLYING IMAGE ANIMATION ---
export const FlyingParticle = ({ src, startRect, targetRect, onFinish }: { src: string, startRect: DOMRect, targetRect: DOMRect, onFinish: () => void }) => {
  const [style, setStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: startRect.top,
    left: startRect.left,
    width: 60,
    height: 60,
    opacity: 1,
    zIndex: 9999,
    borderRadius: '8px',
    objectFit: 'cover',
    pointerEvents: 'none',
    transition: 'all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)',
    boxShadow: '0 0 15px rgba(255, 95, 31, 0.8)'
  });

  useEffect(() => {
    requestAnimationFrame(() => {
      setStyle(prev => ({
        ...prev,
        top: targetRect.top + 10,
        left: targetRect.left + 10,
        width: 20,
        height: 20,
        opacity: 0,
        transform: 'scale(0.5) rotate(360deg)'
      }));
    });

    const timer = setTimeout(onFinish, 800);
    return () => clearTimeout(timer);
  }, [targetRect, onFinish]);

  return <img src={src} style={style} alt="flying-product" />;
};

const ProductActions = ({ product, onDetail, onCompare, isSelected }: { product: Product, onDetail: () => void, onCompare: (p: Product) => void, isSelected: boolean }) => {
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
    } else {
      addToCart(product);
    }
  };

  return (
    <>
      {flyData && createPortal(<FlyingParticle src={product.image} startRect={flyData.start} targetRect={flyData.target} onFinish={() => {}} />, document.body)}
      <div className="grid grid-cols-4 gap-2">
        {/* Compare Button: Icon + Text (col-span-2) */}
        <button 
            onClick={(e) => { e.stopPropagation(); onCompare(product); }} 
            className={`col-span-2 py-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all text-[10px] font-bold uppercase ${isSelected ? 'bg-brand-orange text-white border-brand-orange shadow-neon' : 'border-white/10 text-gray-400 hover:text-white hover:border-white/30 hover:bg-white/5'}`} 
            title="Bandingkan Produk"
        >
            <Scale size={14} /> Bandingkan
        </button>

        {/* Detail Button: Text Only (col-span-1) */}
        <button 
            onClick={(e) => { e.stopPropagation(); onDetail(); }} 
            className="col-span-1 py-2 rounded-lg border border-brand-orange/50 text-brand-orange hover:text-white hover:bg-brand-orange font-bold text-[10px] transition-all hover:shadow-neon flex items-center justify-center"
        >
            Detail
        </button>

        {/* Buy Button: Icon Only (col-span-1) */}
        <button 
            ref={buttonRef} 
            onClick={handleAddToCart} 
            className={`col-span-1 py-2 rounded-lg font-bold flex items-center justify-center transition-all group/btn ${isAdded ? 'bg-green-500 text-white shadow-lg scale-95' : 'bg-brand-gradient text-white hover:bg-brand-gradient-hover hover:shadow-action'}`}
            title="Tambah ke Keranjang"
        >
            {isAdded ? <Check size={16} /> : <Plus size={18} className={isAnimating ? "animate-spin" : "group-hover/btn:scale-125 transition-transform"}/>}
        </button>
      </div>
    </>
  );
}

export const ProductCard = ({ product, onDetail, onCompare, isSelected }: { product: Product, onDetail: (p: Product) => void, onCompare: (p: Product) => void, isSelected: boolean }) => (
  <div onClick={() => onDetail(product)}>
    <Card className={`flex flex-col h-full group cursor-pointer transition-all ${isSelected ? 'border-brand-orange shadow-neon' : 'hover:border-brand-orange hover:shadow-neon'}`}>
      <ProductImage image={product.image} name={product.name} category={product.category} />
      <div className="p-6 flex flex-col flex-grow relative">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-brand-orange transition-colors">{product.name}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{product.description}</p>
        <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
          <div className="text-2xl font-display font-bold text-brand-orange">{formatRupiah(product.price)}</div>
          <ProductActions product={product} onDetail={() => onDetail(product)} onCompare={onCompare} isSelected={isSelected} />
        </div>
      </div>
    </Card>
  </div>
);

export const ProductGrid = ({ children }: { children?: React.ReactNode }) => (
  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
    {children}
  </div>
);

// --- HELPER: DESCRIPTION FORMATTER ---
const FormattedDescription = ({ text }: { text: string }) => {
  if (!text) return null;

  // Split lines
  const lines = text.split('\n');
  const renderedContent = [];
  let listBuffer: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if line is a list item
    if (line.startsWith('-') || line.startsWith('•')) {
      listBuffer.push(line.replace(/^[-•]\s*/, ''));
      inList = true;
    } else {
      // Flush list if we were in one
      if (inList) {
        renderedContent.push(
          <ul key={`list-${i}`} className="space-y-2 mb-4 bg-white/5 p-4 rounded-lg border border-white/5">
            {listBuffer.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
                <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        listBuffer = [];
        inList = false;
      }

      // Render Headers (Ends with :)
      if (line.endsWith(':')) {
        renderedContent.push(
          <h4 key={`head-${i}`} className="font-bold text-white mt-6 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
             <div className="w-1 h-4 bg-brand-orange rounded-full"></div>
             {line.replace(':', '')}
          </h4>
        );
      } else if (line !== '') {
        // Normal paragraph
        renderedContent.push(<p key={`p-${i}`} className="mb-4 text-gray-300 leading-relaxed text-sm md:text-base">{line}</p>);
      }
    }
  }

  // Flush remaining list
  if (inList && listBuffer.length > 0) {
    renderedContent.push(
      <ul key={`list-end`} className="space-y-2 mb-4 bg-white/5 p-4 rounded-lg border border-white/5">
        {listBuffer.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-300">
            <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  return <div>{renderedContent}</div>;
};

// --- ORGANISMS: DETAIL VIEW ---

export const ProductDetailView = ({ product, onClose, isModal = false }: { product: Product, onClose: () => void, isModal?: boolean }) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    setTimeout(() => { setIsAnimating(false); if(isModal) onClose(); }, 500);
  };

  const Wrapper = isModal ? 
    ({children}: any) => createPortal(<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" aria-modal="true"><div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose} />{children}</div>, document.body) : 
    ({children}: any) => (<div className="min-h-screen flex items-center justify-center p-4 sm:p-6 animate-fade-in relative"><div className="absolute top-0 left-0 w-full h-full bg-brand-black -z-10"></div><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>{children}</div>);

  return (
    <Wrapper>
      <div className={`relative w-full max-w-6xl ${isModal ? 'h-[90vh]' : 'min-h-[600px] md:h-[80vh]'} bg-brand-dark shadow-2xl border border-white/10 flex flex-col md:flex-row overflow-hidden rounded-2xl`}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-brand-action transition-colors border border-white/10 shadow-lg">{isModal ? <X size={20} /> : <ArrowLeft size={20} />}</button>
        <div className="w-full md:w-[60%] bg-brand-dark flex flex-col h-full relative border-b md:border-b-0 md:border-r border-white/10 shrink-0">
            <div className="p-6 md:p-8 pb-4 shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange border border-brand-orange/30 px-2 py-1 rounded bg-brand-orange/10 mb-3"><Tag size={12} /> {product.category}</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-2">{product.name}</h2>
                <p className="text-3xl font-bold text-brand-orange">{formatRupiah(product.price)}</p>
            </div>
            <div className="flex-grow relative bg-black/20 m-4 md:mx-8 rounded-2xl border border-white/5 overflow-hidden group flex items-center justify-center min-h-[200px]">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 md:p-8 pt-2 mt-auto shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleAddToCart} className={`flex items-center justify-center w-full py-4 rounded-xl font-bold transition-all shadow-action hover:shadow-action-strong gap-2 ${isAnimating ? 'bg-green-500 text-white' : 'bg-brand-gradient hover:bg-brand-gradient-hover text-white'}`}>
                        {isAnimating ? <Check size={20} /> : <ShoppingCart size={20} />} {isAnimating ? "Berhasil" : "Beli Sekarang"}
                    </button>
                    <a href={`https://wa.me/6282325103336?text=Halo admin, saya tertarik dengan detail produk: ${product.name}.`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-4 border border-brand-orange hover:bg-brand-orange text-white rounded-xl font-bold transition-all gap-2 hover:shadow-neon">
                        <MessageCircle size={20} /> Tanya Sales
                    </a>
                </div>
            </div>
        </div>
        <div className="w-full md:w-[40%] h-full overflow-y-auto custom-scrollbar bg-black/20 p-6 md:p-10">
            <div className="prose prose-invert prose-sm text-gray-300 leading-relaxed max-w-none">
                
                {/* NEW: WHY BUY SECTION (Top Priority) */}
                {(product.why_buy && product.why_buy.length > 0) && (
                    <div className="mb-8 p-6 bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-neon-text/20">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ThumbsUp size={16} className="text-brand-orange"/> Kenapa Harus Beli Paket Ini?
                        </h4>
                        <ul className="space-y-3">
                           {product.why_buy.map((item, i) => (
                               <li key={i} className="flex items-start gap-3">
                                   <div className="w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 mt-0.5"><Check size={12}/></div>
                                   <span className="text-gray-200 font-medium">{item}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}

                <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2">Deskripsi Produk</h4>
                
                {/* USE FORMATTED DESCRIPTION HERE */}
                <FormattedDescription text={product.description} />

                {product.specs && (
                    <div className="mt-8 bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-2"><Scale size={18} className="text-brand-orange"/><h4 className="text-sm font-bold text-white uppercase tracking-widest">Spesifikasi Utama</h4></div>
                        <div className="divide-y divide-white/5">
                            {Object.entries(product.specs).map(([key, val]) => (
                                <div key={key} className="flex justify-between p-4 hover:bg-white/5 transition-colors"><span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{key}</span><span className="text-white font-bold text-sm text-right">{val}</span></div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* NEW: DYNAMIC PACKAGE INCLUDES */}
                {(product.package_includes && product.package_includes.length > 0) && (
                    <div className="mt-8 p-6 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
                        <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2"><Check size={16}/> Paket Termasuk:</h4>
                        <ul className="space-y-3">
                           {product.package_includes.map((item, i) => (
                               <li key={i} className="flex items-start gap-3">
                                   <div className="w-5 h-5 rounded-full bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0 mt-0.5"><Check size={12}/></div>
                                   <span>{item}</span>
                               </li>
                           ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
      </div>
    </Wrapper>
  );
};

export const ProductDetailModal = (props: any) => <ProductDetailView {...props} isModal={true} />;
