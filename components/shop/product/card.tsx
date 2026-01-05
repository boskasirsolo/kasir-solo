
import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, Check, Scale } from 'lucide-react';
import { Product } from '../../types';
import { Badge, Card } from '../../ui';
import { formatRupiah, optimizeImage } from '../../../utils';
import { useCart } from '../../../context/cart-context';
import { FlyingParticle } from '../ui/fly-animation';
import { ProductCardProps } from '../types';

const ProductImage = ({ image, name, category }: { image: string, name: string, category: string }) => (
  <div className="relative h-56 overflow-hidden bg-black">
    <img 
      src={optimizeImage(image, 500)} // OPTIMIZED
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

const ProductActions = ({ product, onDetail, onCompare, isSelected }: ProductCardProps) => {
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
            <Scale size={14} /> ADU SPEK
        </button>

        {/* Detail Button: Text Only (col-span-1) */}
        <button 
            onClick={(e) => { e.stopPropagation(); onDetail(product); }} 
            className="col-span-1 py-2 rounded-lg border border-brand-orange/50 text-brand-orange hover:text-white hover:bg-brand-orange font-bold text-[10px] transition-all hover:shadow-neon flex items-center justify-center"
        >
            BEDAH
        </button>

        {/* Buy Button: Icon Only (col-span-1) */}
        <button 
            ref={buttonRef} 
            onClick={handleAddToCart} 
            className={`col-span-1 py-2 rounded-lg font-bold flex items-center justify-center transition-all group/btn ${isAdded ? 'bg-green-500 text-white shadow-lg scale-95' : 'bg-brand-gradient text-white hover:bg-brand-gradient-hover hover:shadow-action'}`}
            title="Angkut Barang Ini"
        >
            {isAdded ? <Check size={16} /> : <ShoppingCart size={18} className={isAnimating ? "animate-spin" : "group-hover/btn:scale-125 transition-transform"}/>}
        </button>
      </div>
    </>
  );
};

export const ProductCard = (props: ProductCardProps) => (
  <div onClick={() => props.onDetail(props.product)}>
    <Card className={`flex flex-col h-full group cursor-pointer transition-all ${props.isSelected ? 'border-brand-orange shadow-neon' : 'hover:border-brand-orange hover:shadow-neon'}`}>
      <ProductImage image={props.product.image} name={props.product.name} category={props.product.category} />
      <div className="p-6 flex flex-col flex-grow relative">
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-brand-orange transition-colors">{props.product.name}</h3>
        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{props.product.description}</p>
        <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
          <div className="text-2xl font-display font-bold text-brand-orange">{formatRupiah(props.product.price)}</div>
          <ProductActions {...props} />
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
