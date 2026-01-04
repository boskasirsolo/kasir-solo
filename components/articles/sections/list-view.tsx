
import React, { useState } from 'react';
import { Filter, X, Zap, ChevronLeft, ChevronRight, Skull } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Article, Product } from '../../types';
import { ArticleGridCard, InFeedProductCard } from '../ui/cards';
import { ArticleSearchWidget, CategorySidebar, TagCloudWidget, ProductSidebarWidget } from '../ui/widgets';
import { FeaturedArticleHero } from './hero';
import { Button, SectionHeader } from '../../ui';
import { slugify } from '../../../utils';
import { useArticleList } from '../hooks/use-article-list';
import { ArticleListProps } from '../types';

export const ArticleListView = ({ articles, products }: ArticleListProps) => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); 
  
  const { 
    searchTerm, setSearchTerm, 
    selectedFilter, handleFilterSelect,
    currentPage, setCurrentPage,
    featuredArticle,
    paginatedArticles,
    totalPages,
    hasResults,
    resetFilters
  } = useArticleList(articles);

  const handleArticleClick = (article: Article) => {
    navigate(`/articles/${slugify(article.title)}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Pusat" 
        highlight="Intelijen." 
        subtitle="Gue gak nulis teori kuliah. Ini strategi lapangan, trik kasir, dan cara bertahan hidup di kerasnya persaingan ritel." 
      />

      {featuredArticle && currentPage === 1 && hasResults && (
         <div className="mb-12 animate-fade-in">
            <FeaturedArticleHero 
              article={featuredArticle} 
              onClick={() => handleArticleClick(featuredArticle)} 
            />
         </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        {/* LEFT COLUMN: ARTICLES LIST */}
        <div className="lg:col-span-9 order-2 lg:order-1">
          {/* Mobile Filter Trigger */}
          <div className="lg:hidden sticky top-[74px] z-30 mb-6 -mx-4 px-4 py-3 bg-brand-black/95 backdrop-blur-md border-y border-white/10 flex justify-center transition-all">
             <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="flex items-center gap-2 bg-brand-orange text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-neon hover:shadow-neon-strong transition-all hover:scale-105"
             >
                <Filter size={16} /> Filter & Topik 
                {(searchTerm || selectedFilter.value) && (
                    <span className="flex h-2 w-2 rounded-full bg-white ml-1 animate-pulse"></span>
                )}
             </button>
          </div>

          {!hasResults ? (
            <div className="text-center py-20 bg-brand-card rounded-3xl border border-white/5 border-dashed">
                <Skull size={48} className="mx-auto text-gray-600 mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-white mb-2">Zonk. Gak Ada Data.</h3>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">Topik ini belum gue tulis. Coba cari kata kunci lain atau DM gue buat request pembahasan.</p>
                <button onClick={resetFilters} className="mt-6 text-brand-orange hover:text-white border border-brand-orange hover:bg-brand-orange px-6 py-2 rounded-full transition-all text-xs font-bold uppercase tracking-wider">Reset Filter</button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article, idx) => (
                  <React.Fragment key={article.id}>
                    <ArticleGridCard 
                      article={article}
                      onClick={() => handleArticleClick(article)}
                    />
                    
                    {/* IN-FEED PRODUCT INJECTION LOGIC */}
                    {products.length > 0 && (idx + 1) % 3 === 0 && (
                       <div className="md:hidden lg:hidden">
                          <InFeedProductCard 
                             product={products[(Math.floor((idx + 1) / 3) - 1) % products.length]} 
                             onClick={() => setSelectedProduct(products[(Math.floor((idx + 1) / 3) - 1) % products.length])}
                          />
                       </div>
                    )}
                    {products.length > 0 && (idx + 1) % 5 === 0 && (
                        <div className="hidden md:block">
                           <InFeedProductCard 
                              product={products[(Math.floor((idx + 1) / 5) - 1) % products.length]} 
                              onClick={() => setSelectedProduct(products[(Math.floor((idx + 1) / 5) - 1) % products.length])}
                           />
                        </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
              
              {/* PAGINATION CONTROL */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-6">
                    <button onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"><ChevronLeft size={20} /></button>
                    <span className="text-brand-orange font-bold text-sm bg-brand-orange/10 px-3 py-1 rounded border border-brand-orange/20">Hal {currentPage} / {totalPages}</span>
                    <button onClick={() => setCurrentPage((p: number) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-2 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"><ChevronRight size={20} /></button>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR */}
        <div className="hidden lg:block lg:col-span-3 order-1 lg:order-2 space-y-8 sticky top-24 h-fit">
          <ArticleSearchWidget 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />
          <CategorySidebar 
            selectedFilter={selectedFilter}
            onSelect={handleFilterSelect}
          />
          <TagCloudWidget onSelectTag={(t) => { setSearchTerm(t); handleFilterSelect('all', ''); }} />
          <ProductSidebarWidget 
            products={products} 
            onDetail={setSelectedProduct} 
          />
        </div>
      </div>

      {/* MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
         <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm lg:hidden flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-brand-dark">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter size={20} className="text-brand-orange"/> Filter Artikel
               </h3>
               <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                  <X size={24} />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-32">
               <ArticleSearchWidget value={searchTerm} onChange={setSearchTerm} />
               <CategorySidebar selectedFilter={selectedFilter} onSelect={(t, v) => { handleFilterSelect(t, v); setIsMobileFilterOpen(false); }}/>
               <TagCloudWidget onSelectTag={(t) => { setSearchTerm(t); setIsMobileFilterOpen(false); }} />
               <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Zap size={14} className="text-yellow-500"/> Promo Spesial
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                     {products.slice(0, 2).map(p => (
                        <div key={p.id} onClick={() => { setSelectedProduct(p); setIsMobileFilterOpen(false); }} className="bg-white/5 p-3 rounded-xl border border-white/5 flex gap-3 items-center">
                           <img src={p.image} className="w-12 h-12 rounded bg-black object-cover"/>
                           <div className="flex-1">
                              <p className="text-xs font-bold text-white">{p.name}</p>
                              <p className="text-xs text-brand-orange font-bold">Cek Detail</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
            <div className="p-4 border-t border-white/10 bg-brand-dark absolute bottom-0 left-0 right-0">
               <Button onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }} className="w-full py-3 shadow-neon">
                  RESET SEMUA FILTER
               </Button>
            </div>
         </div>
      )}
    </div>
  );
};
