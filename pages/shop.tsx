
import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, X, MessageCircle, Tag } from 'lucide-react';
import { Product } from '../types';
import { Badge, Card, Input } from '../components/ui';
import { formatRupiah } from '../utils';

const ITEMS_PER_PAGE = 4;

export const ShopPage = ({ products }: { products: Product[] }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = selectedProduct ? 'hidden' : 'auto';
  }, [selectedProduct]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="text-left">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">Katalog <span className="text-brand-orange">Mesin Kasir</span></h2>
          <p className="text-gray-400 text-lg">Pilihan paket POS terbaik untuk Retail, F&B, dan Jasa</p>
        </div>
        <div className="relative group w-full md:w-80">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Cari hardware..." 
            className="pl-12 py-3 rounded-full"
          />
          <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
        </div>
      </div>

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedProducts.map((product) => (
            <Card key={product.id} className="flex flex-col h-full group">
              {/* Image Area */}
              <div className="relative h-56 overflow-hidden bg-black">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                <div className="absolute top-3 right-3">
                  <Badge>{product.category}</Badge>
                </div>
              </div>

              {/* Content Area */}
              <div className="p-6 flex flex-col flex-grow relative">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 min-h-[3.5rem]">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">{product.description}</p>
                
                <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
                  <div className="text-2xl font-display font-bold text-brand-orange">{formatRupiah(product.price)}</div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="px-4 py-2 rounded-lg border border-white/20 text-gray-300 hover:text-brand-orange hover:border-brand-orange font-bold text-sm transition-all hover:shadow-neon"
                    >
                      Detail
                    </button>
                    <a 
                      href={`https://wa.me/6282325103336?text=Halo PT Mesin Kasir Solo, saya mau tanya produk: ${product.name}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-lg bg-brand-orange text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-brand-glow hover:shadow-neon transition-all"
                    >
                      <MessageCircle size={16} /> Tanya
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">Produk tidak ditemukan.</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8 border-t border-white/5">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"
          >
            <ChevronLeft size={20} />
          </button>
          
          <span className="text-brand-orange font-display font-bold">
            Page {page} / {totalPages}
          </span>

          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* --- PRODUCT DETAIL MODAL --- */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          ></div>

          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-brand-dark rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-brand-orange transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left: Image */}
            <div className="w-full md:w-1/2 bg-black flex items-center justify-center p-4 md:p-0">
               <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover md:object-contain max-h-64 md:max-h-full" 
               />
            </div>

            {/* Right: Info */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
              <div className="mb-4">
                 <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange border border-brand-orange/30 px-2 py-1 rounded bg-brand-orange/10 mb-3">
                   <Tag size={12} /> {selectedProduct.category}
                 </span>
                 <h2 className="text-3xl font-display font-bold text-white leading-tight mb-2">{selectedProduct.name}</h2>
                 <p className="text-2xl font-bold text-brand-orange">{formatRupiah(selectedProduct.price)}</p>
              </div>

              <div className="prose prose-invert prose-sm text-gray-300 mb-8 leading-relaxed border-t border-white/10 pt-4 flex-grow">
                <p>{selectedProduct.description}</p>
                <p className="mt-4 text-gray-500 italic text-xs">
                  *Harga dapat berubah sewaktu-waktu. Hubungi admin untuk ketersediaan stok terbaru dan promo paket bundling.
                </p>
              </div>

              <div className="mt-auto">
                <a 
                   href={`https://wa.me/6282325103336?text=Halo admin, saya tertarik dengan detail produk: ${selectedProduct.name}. Apakah stok tersedia?`}
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center justify-center w-full py-4 bg-brand-orange hover:bg-brand-glow text-white rounded-xl font-bold transition-all shadow-neon hover:shadow-neon-strong transform hover:-translate-y-1 gap-2"
                 >
                   <MessageCircle size={20} /> Hubungi Admin via WhatsApp
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
