
import React, { useRef, useState } from 'react';
import { Calendar, ChevronRight, ShoppingCart, Star, Plus, Check, MessageCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { Article, Product } from '../../types';
import { optimizeImage, formatRupiah } from '../../../utils';
import { useCart } from '../../../context/cart-context';
import { FlyingParticle } from '../../../components/shop-parts'; // Reuse existing from shop

export const ArticleGridCard = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div onClick={onClick} className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-300 hover:shadow-neon hover:-translate-y-2 cursor-pointer flex flex-col group h-full">
    <div className="relative h-56 overflow-hidden">
      <img 
        src={optimizeImage(article.image, 500)} 
        alt={article.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        loading="lazy" 
      />
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

export const InFeedProductCard = ({ product, onClick }: { product: Product, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="bg-brand-dark/50 border border-brand-orange/30 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-300 shadow-neon-text cursor-pointer flex flex-col h-full group relative"
    >
        <div className="absolute top-3 left-3 z-10">
            <span className="bg-brand-orange text-white text-[9px] font-bold px-2 py-1 rounded shadow-md uppercase tracking-widest animate-pulse">
                Rekomendasi
            </span>
        </div>
        <div className="relative h-56 overflow-hidden bg-black p-4">
            <img 
                src={optimizeImage(product.image, 400)} 
                alt={product.name} 
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110" 
                loading="lazy" 
            />
        </div>
        <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-brand-card to-black">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight group-hover:text-brand-orange transition-colors">{product.name}</h3>
            </div>
            <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={10} className="text-yellow-500 fill-yellow-500" />
                ))}
                <span className="text-[10px] text-gray-500 ml-1">(Best Seller)</span>
            </div>
            
            <p className="text-2xl font-display font-bold text-brand-orange mb-4">{formatRupiah(product.price)}</p>
            
            <button className="w-full mt-auto py-3 bg-white/5 hover:bg-brand-orange hover:text-white text-gray-300 font-bold rounded-xl border border-white/10 hover:border-brand-orange transition-all flex items-center justify-center gap-2 text-sm shadow-lg">
                <ShoppingCart size={16} /> Cek Spesifikasi
            </button>
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
          <img 
            src={optimizeImage(product.image, 300)} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
            loading="lazy" 
          />
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
