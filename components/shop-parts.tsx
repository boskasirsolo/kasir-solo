
import React, { useEffect, useState, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, X, MessageCircle, Tag, ShoppingCart, Plus, Check, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { Badge, Card, Input, Button } from './ui';
import { formatRupiah } from '../utils';
import { useCart } from '../context/cart-context';
import { createPortal } from 'react-dom';

// --- ATOM: SEARCH HEADER ---
export const ShopHeader = ({ 
  searchTerm, 
  onSearchChange 
}: { 
  searchTerm: string, 
  onSearchChange: (val: string) => void 
}) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
    <div className="text-left">
      <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
        Katalog <span className="text-brand-orange">Mesin Kasir</span>
      </h2>
      <p className="text-gray-400 text-lg">Pilihan paket POS terbaik untuk Retail, F&B, dan Jasa</p>
    </div>
    <div className="relative group w-full md:w-80">
      <Input 
        value={searchTerm} 
        onChange={(e) => onSearchChange(e.target.value)} 
        placeholder="Cari hardware..." 
        className="pl-12 py-3 rounded-full"
      />
      <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
    </div>
  </div>
);

// --- ATOMS: PRODUCT CARD PARTS ---

export const ProductImage = ({ image, name, category }: { image: string, name: string, category: string }) => (
  <div className="relative h-56 overflow-hidden bg-black">
    <img 
      src={image} 
      alt={name} 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
    <div className="absolute top-3 right-3">
      <Badge>{category}</Badge>
    </div>
  </div>
);

export const ProductTitle = ({ title }: { title: string }) => (
  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-brand-orange transition-colors">{title}</h3>
);

export const ProductDescription = ({ description }: { description: string }) => (
  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{description}</p>
);

export const ProductPrice = ({ price }: { price: number }) => (
  // Price uses Amber (Premium)
  <div className="text-2xl font-display font-bold text-brand-orange">{formatRupiah(price)}</div>
);

// --- COMPONENT: FLYING IMAGE ANIMATION ---
const FlyingParticle = ({ src, startRect, targetRect, onFinish }: { src: string, startRect: DOMRect, targetRect: DOMRect, onFinish: () => void }) => {
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
    // Trigger animation next frame
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

export const ProductActions = ({ 
  product, 
  onDetail 
}: { 
  product: Product, 
  onDetail: () => void 
}) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [flyData, setFlyData] = useState<{ start: DOMRect, target: DOMRect } | null>(null);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening navigation
    if (isAnimating) return;

    // 1. Cari tombol cart di layout (Desktop atau Mobile)
    const cartBtnDesktop = document.getElementById('desktop-cart-btn');
    const cartBtnMobile = document.getElementById('mobile-cart-btn');
    
    // Pilih target yang visible (lebar > 0)
    const targetEl = (cartBtnMobile && cartBtnMobile.offsetWidth > 0) ? cartBtnMobile : cartBtnDesktop;

    if (buttonRef.current && targetEl) {
      const startRect = buttonRef.current.getBoundingClientRect();
      const targetRect = targetEl.getBoundingClientRect();
      
      // 2. Start Animation
      setIsAnimating(true);
      setFlyData({ start: startRect, target: targetRect });
      
      // 3. Add to Cart Logic (Delay sedikit biar pas animasi sampai)
      setTimeout(() => {
        addToCart(product);
        setIsAdded(true);
      }, 600);

      // 4. Reset Button State
      setTimeout(() => {
        setIsAdded(false);
        setIsAnimating(false);
        setFlyData(null);
      }, 2000);
    } else {
      // Fallback if elements not found
      addToCart(product);
    }
  };

  return (
    <>
      {flyData && createPortal(
        <FlyingParticle 
          src={product.image} 
          startRect={flyData.start} 
          targetRect={flyData.target} 
          onFinish={() => {}} 
        />, 
        document.body
      )}

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={(e) => { e.stopPropagation(); onDetail(); }}
          className="px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-brand-orange hover:border-brand-orange font-bold text-sm transition-all hover:shadow-neon"
        >
          Detail
        </button>
        <button 
          ref={buttonRef}
          onClick={handleAddToCart}
          // UPDATED: Use brand-gradient for Buy button
          className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all group/btn ${
            isAdded 
              ? 'bg-green-500 text-white shadow-lg scale-95' 
              : 'bg-brand-gradient text-white hover:bg-brand-gradient-hover hover:shadow-action'
          }`}
        >
          {isAdded ? (
            <><Check size={16} /> Berhasil</>
          ) : (
            <><Plus size={16} className={isAnimating ? "animate-spin" : "group-hover/btn:scale-125 transition-transform"}/> Beli</>
          )}
        </button>
      </div>
    </>
  );
}

// --- MOLECULE: PRODUCT CARD ---
export const ProductCard = ({ 
  product, 
  onDetail 
}: { 
  product: Product, 
  onDetail: (p: Product) => void
}) => (
  // Added onClick here to make the whole card clickable
  <div onClick={() => onDetail(product)}>
    <Card className="flex flex-col h-full group cursor-pointer hover:border-brand-orange transition-colors">
      <ProductImage image={product.image} name={product.name} category={product.category} />
      
      <div className="p-6 flex flex-col flex-grow relative">
        <ProductTitle title={product.name} />
        <ProductDescription description={product.description} />
        
        <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
          <ProductPrice price={product.price} />
          <ProductActions product={product} onDetail={() => onDetail(product)} />
        </div>
      </div>
    </Card>
  </div>
);

// --- ATOM: PAGINATION ---
export const ShopPagination = ({ 
  page, 
  totalPages, 
  setPage 
}: { 
  page: number, 
  totalPages: number, 
  setPage: (p: number) => void 
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 py-8 border-t border-white/5">
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-brand-orange font-display font-bold">
        Page {page} / {totalPages}
      </span>

      <button 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// --- MOLECULE: DETAIL VIEW (Converted from Modal) ---
export const ProductDetailView = ({ 
  product, 
  onClose,
  isModal = false 
}: { 
  product: Product, 
  onClose: () => void,
  isModal?: boolean
}) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    setTimeout(() => {
        setIsAnimating(false);
        if(isModal) onClose(); 
    }, 500);
  };

  // If used as a Modal (e.g. QuickView), use Portal
  const Wrapper = isModal ? 
    ({children}: any) => createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" aria-modal="true">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose} />
            {children}
        </div>, document.body
    ) : 
    ({children}: any) => (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 animate-fade-in relative">
            <div className="absolute top-0 left-0 w-full h-full bg-brand-black -z-10"></div>
            {/* Ambient Background for Page Mode */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            {children}
        </div>
    );

  return (
    <Wrapper>
      <div className={`relative w-full max-w-5xl ${isModal ? 'max-h-[90vh]' : 'min-h-[600px]'} overflow-y-auto rounded-2xl bg-brand-dark shadow-2xl border border-white/10 flex flex-col md:flex-row custom-scrollbar`}>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-brand-action transition-colors border border-white/10"
        >
          {isModal ? <X size={20} /> : <ArrowLeft size={20} />}
        </button>

        {/* Left: Image (Full width mobile, Half width desktop) */}
        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-6 md:p-0 min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-white/10">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full max-h-[400px] md:max-h-[80vh] object-contain" 
            />
        </div>

        {/* Right: Content */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col bg-brand-dark">
          <div className="mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange border border-brand-orange/30 px-2 py-1 rounded bg-brand-orange/10 mb-3">
                <Tag size={12} /> {product.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight mb-3">{product.name}</h2>
              <p className="text-3xl font-bold text-brand-orange">{formatRupiah(product.price)}</p>
          </div>

          <div className="prose prose-invert prose-sm text-gray-300 mb-8 leading-relaxed border-t border-white/10 pt-6 flex-grow">
            <p>{product.description}</p>
            <ul className="list-disc pl-4 space-y-1 text-gray-400 mt-4">
               <li>Garansi Hardware 1 Tahun</li>
               <li>Free Training Staff</li>
               <li>Support Teknis Lifetime</li>
            </ul>
          </div>

          <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleAddToCart}
              className={`flex items-center justify-center w-full py-4 rounded-xl font-bold transition-all shadow-action hover:shadow-action-strong gap-2 ${
                  isAnimating ? 'bg-green-500 text-white' : 'bg-brand-gradient hover:bg-brand-gradient-hover text-white'
              }`}
            >
              {isAnimating ? <Check size={20} /> : <ShoppingCart size={20} />} 
              {isAnimating ? "Berhasil" : "Beli Sekarang"}
            </button>
            <a 
              href={`https://wa.me/6282325103336?text=Halo admin, saya tertarik dengan detail produk: ${product.name}.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-full py-4 border border-white/20 hover:border-brand-action text-white rounded-xl font-bold transition-all gap-2 hover:bg-white/5"
            >
              <MessageCircle size={20} /> Tanya Sales
            </a>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

// Backwards compatibility shim if needed, or ProductDetailView can be used directly
export const ProductDetailModal = (props: any) => <ProductDetailView {...props} isModal={true} />;
