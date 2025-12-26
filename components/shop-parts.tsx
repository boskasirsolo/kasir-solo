
import React, { useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X, MessageCircle, Tag, ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../types';
import { Badge, Card, Input, Button } from './ui';
import { formatRupiah } from '../utils';
import { useCart } from '../context/cart-context';

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
  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">{title}</h3>
);

export const ProductDescription = ({ description }: { description: string }) => (
  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{description}</p>
);

export const ProductPrice = ({ price }: { price: number }) => (
  <div className="text-2xl font-display font-bold text-brand-orange">{formatRupiah(price)}</div>
);

export const ProductActions = ({ 
  product, 
  onDetail 
}: { 
  product: Product, 
  onDetail: () => void 
}) => {
  const { addToCart } = useCart();
  
  return (
    <div className="grid grid-cols-2 gap-3">
      <button 
        onClick={onDetail}
        className="px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-brand-orange hover:border-brand-orange font-bold text-sm transition-all hover:shadow-neon"
      >
        Detail
      </button>
      <button 
        onClick={() => {
          addToCart(product);
          // Optional toast or feedback
        }}
        className="px-4 py-2 rounded-lg bg-brand-orange text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-glow hover:shadow-neon transition-all group/btn"
      >
        <Plus size={16} className="group-hover/btn:scale-125 transition-transform"/> Beli
      </button>
    </div>
  );
}

// --- MOLECULE: PRODUCT CARD ---
export const ProductCard = ({ 
  product, 
  onDetail 
}: { 
  product: Product, 
  onDetail: (p: Product) => void,
  key?: any
}) => (
  <Card className="flex flex-col h-full group">
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

// --- MOLECULE: DETAIL MODAL ---
export const ProductDetailModal = ({ 
  product, 
  onClose 
}: { 
  product: Product, 
  onClose: () => void 
}) => {
  const { addToCart } = useCart();
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative w-full max-w-4xl bg-brand-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-brand-orange transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 md:p-0">
            <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover md:object-contain max-h-64 md:max-h-full" 
            />
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="mb-4">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange border border-brand-orange/30 px-2 py-1 rounded bg-brand-orange/10 mb-3">
                <Tag size={12} /> {product.category}
              </span>
              <h2 className="text-3xl font-display font-bold text-white leading-tight mb-2">{product.name}</h2>
              <p className="text-2xl font-bold text-brand-orange">{formatRupiah(product.price)}</p>
          </div>

          <div className="prose prose-invert prose-sm text-gray-300 mb-8 leading-relaxed border-t border-white/10 pt-4 flex-grow">
            <p>{product.description}</p>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4">
            <button 
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="flex items-center justify-center w-full py-4 bg-brand-orange hover:bg-brand-glow text-white rounded-xl font-bold transition-all shadow-neon hover:shadow-neon-strong gap-2"
            >
              <ShoppingCart size={20} /> Masuk Keranjang
            </button>
            <a 
              href={`https://wa.me/6282325103336?text=Halo admin, saya tertarik dengan detail produk: ${product.name}.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center w-full py-4 border border-white/20 hover:border-brand-orange text-white rounded-xl font-bold transition-all gap-2"
            >
              <MessageCircle size={20} /> Chat Admin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
