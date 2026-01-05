
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowLeft, Tag, Check, ShoppingCart, MessageCircle, ThumbsUp, ShieldCheck, Zap, PackageOpen } from 'lucide-react';
import { Product, SiteConfig } from '../../types';
import { optimizeImage, formatRupiah } from '../../../utils';
import { useCart } from '../../../context/cart-context';
import { ProductSchema } from '../../seo';

// --- HELPER: DESCRIPTION FORMATTER ---
const FormattedDescription = ({ text }: { text: string }) => {
  if (!text) return null;

  const lines = text.split('\n');
  const renderedContent: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('-') || line.startsWith('•')) {
      listBuffer.push(line.replace(/^[-•]\s*/, ''));
      inList = true;
    } else {
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
      if (line.endsWith(':')) {
        renderedContent.push(
          <h4 key={`head-${i}`} className="font-bold text-white mt-6 mb-3 flex items-center gap-2 text-sm uppercase tracking-wider">
             <div className="w-1 h-4 bg-brand-orange rounded-full"></div>
             {line.replace(':', '')}
          </h4>
        );
      } else if (line !== '') {
        renderedContent.push(<p key={`p-${i}`} className="mb-4 text-gray-300 leading-relaxed text-sm md:text-base">{line}</p>);
      }
    }
  }
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

interface ProductDetailProps {
    product: Product;
    onClose: () => void;
    isModal?: boolean;
    config?: SiteConfig;
}

// --- MAIN DETAIL VIEW ---
export const ProductDetailView = ({ product, onClose, isModal = false, config }: ProductDetailProps) => {
  const { addToCart } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const waNumber = config?.whatsappNumber || "6282325103336";
  
  const handleAddToCart = () => {
    setIsAnimating(true);
    addToCart(product);
    setTimeout(() => { setIsAnimating(false); if(isModal) onClose(); }, 500);
  };

  const innerContent = (
    <>
      {/* INJECT SCHEMA HERE */}
      <ProductSchema product={product} />

      <div className={`relative w-full max-w-6xl ${isModal ? 'h-[90vh]' : 'min-h-[600px] md:h-[80vh]'} bg-brand-dark shadow-2xl border border-white/10 flex flex-col md:flex-row overflow-hidden rounded-2xl`}>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-brand-action transition-colors border border-white/10 shadow-lg">{isModal ? <X size={20} /> : <ArrowLeft size={20} />}</button>
        <div className="w-full md:w-[60%] bg-brand-dark flex flex-col h-full relative border-b md:border-b-0 md:border-r border-white/10 shrink-0">
            <div className="p-6 md:p-8 pb-4 shrink-0">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange border border-brand-orange/30 px-2 py-1 rounded bg-brand-orange/10 mb-3"><Tag size={12} /> {product.category}</span>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-2">{product.name}</h2>
                <p className="text-3xl font-bold text-brand-orange">{formatRupiah(product.price)}</p>
            </div>
            <div className="flex-grow relative bg-black/20 m-4 md:mx-8 rounded-2xl border border-white/5 overflow-hidden group flex items-center justify-center min-h-[200px]">
                <img src={optimizeImage(product.image, 800)} alt={product.name} className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6 md:p-8 pt-2 mt-auto shrink-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleAddToCart} className={`flex items-center justify-center w-full py-4 rounded-xl font-bold transition-all shadow-action hover:shadow-action-strong gap-2 ${isAnimating ? 'bg-green-500 text-white' : 'bg-brand-gradient hover:bg-brand-gradient-hover text-white'}`}>
                        {isAnimating ? <Check size={20} /> : <ShoppingCart size={20} />} {isAnimating ? "Berhasil" : "ANGKUT SEKARANG"}
                    </button>
                    <a href={`https://wa.me/${waNumber}?text=Halo Mas Amin, saya mau nego/tanya detail produk: ${product.name}.`} target="_blank" rel="noreferrer" className="flex items-center justify-center w-full py-4 border border-brand-orange hover:bg-brand-orange text-white rounded-xl font-bold transition-all gap-2 hover:shadow-neon">
                        <MessageCircle size={20} /> NEGO HARGA
                    </a>
                </div>
            </div>
        </div>
        <div className="w-full md:w-[40%] h-full overflow-y-auto custom-scrollbar bg-black/20 p-6 md:p-10">
            <div className="prose prose-invert prose-sm text-gray-300 leading-relaxed max-w-none">
                
                {(product.why_buy && product.why_buy.length > 0) && (
                    <div className="mb-8 p-6 bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-neon-text/20">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ThumbsUp size={16} className="text-brand-orange"/> Kenapa Ini Worth It?
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

                <h4 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2"><ShieldCheck size={18} className="text-brand-orange"/> Review Jujur (No B.S.)</h4>
                
                <FormattedDescription text={product.description} />

                {product.specs && (
                    <div className="mt-8 bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-lg">
                        <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-2"><Zap size={18} className="text-brand-orange"/><h4 className="text-sm font-bold text-white uppercase tracking-widest">Jeroan Mesin (Specs)</h4></div>
                        <div className="divide-y divide-white/5">
                            {Object.entries(product.specs).map(([key, val]) => (
                                <div key={key} className="flex justify-between p-4 hover:bg-white/5 transition-colors">
                                    <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">{key}</span>
                                    <span className="text-white font-bold text-sm text-right">{val as React.ReactNode}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {(product.package_includes && product.package_includes.length > 0) && (
                    <div className="mt-8 p-6 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
                        <h4 className="text-sm font-bold text-brand-orange uppercase tracking-widest mb-4 flex items-center gap-2"><PackageOpen size={16}/> Isi Kotak (Fullset):</h4>
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
    </>
  );

  if (isModal) {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6" aria-modal="true">
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose} />
        {innerContent}
      </div>, 
      document.body
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 animate-fade-in relative">
      <div className="absolute top-0 left-0 w-full h-full bg-brand-black -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
      {innerContent}
    </div>
  );
};
