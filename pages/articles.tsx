
import React, { useState, useEffect, useMemo } from 'react';
import { Article, Product } from '../types';
import { SectionHeader } from '../components/ui';
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
  CATEGORY_TREE
} from '../components/article-parts';
import { ProductDetailModal } from '../components/shop-parts';
import { useParams, useNavigate } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

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

  return {
    searchTerm, setSearchTerm,
    selectedFilter, handleFilterSelect,
    currentPage, setCurrentPage,
    featuredArticle,
    paginatedArticles,
    totalPages,
    hasResults: filteredArticles.length > 0,
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

  const handleArticleClick = (article: Article) => {
    navigate(`/articles/${slugify(article.title)}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Wawasan &" 
        highlight="Edukasi" 
        subtitle="Panduan bisnis, review teknologi, dan strategi manajemen kasir." 
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: ARTICLES LIST (75%) */}
        <div className="lg:col-span-9 order-2 lg:order-1">
          {!hasResults ? (
            <EmptyArticleState onReset={resetFilters} />
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedArticles.map((article) => (
                  <React.Fragment key={article.id}>
                    <ArticleGridCard 
                      article={article}
                      onClick={() => handleArticleClick(article)}
                    />
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
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          
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
