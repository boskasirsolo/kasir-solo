
import React, { useState, useEffect, useMemo } from 'react';
import { Article, Product } from '../types';
import { SectionHeader, Button } from '../components/ui';
import { 
  FeaturedArticleHero, 
  ArticleGridCard, 
  ArticleReaderView,
  ArticleSearchWidget,
  CategorySidebar,
  TagCloudWidget,
  ProductSidebarWidget,
  EmptyArticleState,
  ArticlePaginationControl,
  CATEGORY_TREE,
  InFeedProductCard 
} from '../components/article-parts';
import { ProductDetailModal } from '../components/shop-parts';
import { useParams, useNavigate } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';
import { Filter, X, Zap } from 'lucide-react';

// --- LOGIC HOOK ---
const useArticleLogic = (articles: Article[], itemsPerPage: number = 9) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<{ type: 'parent' | 'sub' | 'all', value: string }>({ type: 'all', value: '' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter Logic
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 1. Search Filter (Safe Check)
      const titleMatch = (article.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const excerptMatch = (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = titleMatch || excerptMatch;
      
      // 2. Category Filter (Robust Check)
      let matchesCategory = true;
      const articleCat = (article.category || '').toLowerCase().trim();

      if (selectedFilter.type === 'sub') {
        // Check if the article category CONTAINS the filter (handles "Teknologi" vs "Teknologi, Tips")
        const filterVal = selectedFilter.value.toLowerCase().trim();
        matchesCategory = articleCat.includes(filterVal);
      } else if (selectedFilter.type === 'parent') {
        const parentGroup = CATEGORY_TREE.find(p => p.id === selectedFilter.value);
        if (parentGroup) {
          // Check if article category matches ANY of the subcategories in this parent group
          matchesCategory = parentGroup.subCategories.some(sub => 
            articleCat.includes(sub.toLowerCase().trim())
          );
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  // Derived Data
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridSource = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];
  
  const totalPages = Math.ceil(gridSource.length / itemsPerPage);
  const paginatedArticles = gridSource.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSelectedFilter({ type: 'all', value: '' });
    setSearchTerm('');
  };

  const selectTag = (tag: string) => {
    setSearchTerm(tag);
    setSelectedFilter({ type: 'all', value: '' });
  };

  const handleFilterSelect = (type: 'parent' | 'sub' | 'all', value: string) => {
    setSelectedFilter({ type, value });
  };

  const hasResults = filteredArticles.length > 0;

  return {
    searchTerm, setSearchTerm,
    selectedFilter, handleFilterSelect,
    currentPage, setCurrentPage,
    featuredArticle,
    paginatedArticles,
    totalPages,
    hasResults,
    resetFilters,
    selectTag
  };
};

export const ArticleDetailPage = ({ articles, products }: { articles: Article[], products: Product[] }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const article = articles.find(a => slugify(a.title) === slug);

  if (!article) {
    return <NotFoundPage setPage={() => navigate('/')} />;
  }

  return (
    <ArticleReaderView
      article={article}
      products={products}
      allArticles={articles}
      onClose={() => navigate('/articles')}
    />
  );
};

export const ArticlesPage = ({ 
  articles,
  products 
}: { 
  articles: Article[], 
  products: Product[] 
}) => {
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
    resetFilters,
    selectTag
  } = useArticleLogic(articles);

  // AUTO SCROLL UP EFFECT
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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

      {/* FEATURED HERO */}
      {featuredArticle && currentPage === 1 && hasResults && (
         <div className="mb-12 animate-fade-in">
            <FeaturedArticleHero 
              article={featuredArticle} 
              onClick={() => handleArticleClick(featuredArticle)} 
            />
         </div>
      )}

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* LEFT COLUMN: ARTICLES LIST (75%) */}
        {/* UPDATED: Full width on mobile/tablet because Sidebar is hidden */}
        <div className="lg:col-span-9 order-2 lg:order-1">
          
          {/* SOLUTION 3: STICKY FILTER BUTTON (Mobile Only) */}
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
            <EmptyArticleState onReset={resetFilters} />
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article, idx) => (
                  <React.Fragment key={article.id}>
                    <ArticleGridCard 
                      article={article}
                      onClick={() => handleArticleClick(article)}
                    />
                    
                    {/* SOLUTION 2: IN-FEED PRODUCT INJECTION */}
                    {/* Inject Product Card every 3 articles (idx 2, 5, 8...) */}
                    {products.length > 0 && (idx + 1) % 3 === 0 && (
                       <div className="md:hidden lg:hidden">
                          {/* Mobile Injection: Full Width Card */}
                          <InFeedProductCard 
                             product={products[(Math.floor((idx + 1) / 3) - 1) % products.length]} 
                             onClick={() => setSelectedProduct(products[(Math.floor((idx + 1) / 3) - 1) % products.length])}
                          />
                       </div>
                    )}
                    
                    {/* Desktop/Tablet Injection Logic: Needs careful grid placement */}
                    {/* Simple approach: Inject a product card into the grid flow */}
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
              
              <ArticlePaginationControl 
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
              />
            </>
          )}
        </div>

        {/* RIGHT COLUMN: SIDEBAR (25%) */}
        {/* UPDATED: Hidden on Mobile/Tablet (Solution 3 Part A) */}
        <div className="hidden lg:block lg:col-span-3 order-1 lg:order-2 space-y-8 sticky top-24 h-fit">
          <ArticleSearchWidget 
            value={searchTerm} 
            onChange={setSearchTerm} 
          />
          <CategorySidebar 
            selectedFilter={selectedFilter}
            onSelect={handleFilterSelect}
          />
          <TagCloudWidget onSelectTag={selectTag} />
          <ProductSidebarWidget 
            products={products} 
            onDetail={setSelectedProduct} 
          />
        </div>

      </div>

      {/* OLD FIXED BUTTON REMOVED - REPLACED WITH STICKY HEADER ABOVE */}

      {/* SOLUTION 3 PART C: MOBILE FILTER MODAL */}
      {isMobileFilterOpen && (
         <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-sm lg:hidden flex flex-col animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-brand-dark">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Filter size={20} className="text-brand-orange"/> Filter Artikel
               </h3>
               <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-white/10 rounded-full text-white">
                  <X size={24} />
               </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pb-32">
               <ArticleSearchWidget 
                  value={searchTerm} 
                  onChange={setSearchTerm} 
               />
               <CategorySidebar 
                  selectedFilter={selectedFilter}
                  onSelect={(t, v) => { handleFilterSelect(t, v); setIsMobileFilterOpen(false); }}
               />
               <TagCloudWidget onSelectTag={(t) => { selectTag(t); setIsMobileFilterOpen(false); }} />
               
               {/* Quick Product Access in Filter */}
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

            {/* Sticky Reset Button */}
            <div className="p-4 border-t border-white/10 bg-brand-dark absolute bottom-0 left-0 right-0">
               <Button onClick={() => { resetFilters(); setIsMobileFilterOpen(false); }} className="w-full py-3 shadow-neon">
                  RESET SEMUA FILTER
               </Button>
            </div>
         </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};
