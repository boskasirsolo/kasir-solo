
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Article, Product } from '../types';
import { SectionHeader, Input } from '../components/ui';
import { 
  CategoryTab, 
  FeaturedArticleHero, 
  ArticleGridCard, 
  ArticleReaderModal 
} from '../components/article-parts';

export const ArticlesPage = ({ 
  articles,
  products 
}: { 
  articles: Article[], 
  products: Product[] 
}) => {
  // --- STATE MANAGEMENT (Controller) ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // --- DATA PROCESSING ---
  // 1. Extract Categories
  const categories = ['Semua', ...Array.from(new Set(articles.map(a => a.category || 'Lainnya')))];

  // 2. Filter Articles
  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];

  // --- RENDER (View Composition) ---
  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Wawasan &" 
        highlight="Edukasi" 
        subtitle="Panduan bisnis, review teknologi, dan strategi manajemen kasir." 
      />

      {/* Controller Controls: Filter & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 sticky top-24 z-30 bg-brand-black/90 backdrop-blur-md py-4 border-b border-white/10 -mx-4 px-4 md:mx-0 md:px-0 md:bg-transparent md:border-none md:static">
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
          {categories.map(cat => (
            <React.Fragment key={cat}>
              <CategoryTab 
                label={cat} 
                active={selectedCategory === cat} 
                onClick={() => setSelectedCategory(cat)} 
              />
            </React.Fragment>
          ))}
        </div>

        <div className="relative w-full md:w-72 group">
          <Input 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            placeholder="Cari topik..." 
            className="pl-12 rounded-full bg-brand-card border-white/10 group-hover:border-brand-orange/50 transition-colors"
          />
          <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
        </div>
      </div>

      {/* Content View */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-3xl border border-white/5 border-dashed">
          <Search size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Artikel tidak ditemukan</h3>
          <p className="text-gray-400">Coba kata kunci lain atau ganti kategori.</p>
        </div>
      ) : (
        <>
          {featuredArticle && (
             <FeaturedArticleHero 
               article={featuredArticle} 
               onClick={() => setSelectedArticle(featuredArticle)} 
             />
          )}

          {gridArticles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((article) => (
                <React.Fragment key={article.id}>
                  <ArticleGridCard 
                    article={article}
                    onClick={() => setSelectedArticle(article)}
                  />
                </React.Fragment>
              ))}
            </div>
          )}
        </>
      )}

      {/* Detail Modal Overlay */}
      {selectedArticle && (
        <ArticleReaderModal 
          article={selectedArticle} 
          products={products}
          onClose={() => setSelectedArticle(null)} 
        />
      )}

    </div>
  );
};
