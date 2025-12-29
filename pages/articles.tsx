
import React, { useState } from 'react';
import { Search, ChevronDown, ChevronRight, Hash, FolderOpen, Tag, Filter } from 'lucide-react';
import { Article, Product } from '../types';
import { SectionHeader, Input } from '../components/ui';
import { 
  FeaturedArticleHero, 
  ArticleGridCard, 
  ArticleReaderView
} from '../components/article-parts';
import { useParams, useNavigate } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

// --- DATA: CATEGORY HIERARCHY ---
// Mapping kategori umum ke kategori spesifik (sesuai data di DB/CMS)
const CATEGORY_TREE = [
  {
    id: 'business',
    label: 'Wawasan Bisnis',
    subCategories: ['Bisnis Tips', 'Manajemen', 'Keuangan', 'HR', 'Franchise']
  },
  {
    id: 'tech',
    label: 'Teknologi & Hardware',
    subCategories: ['Hardware Review', 'Android POS', 'Windows POS', 'Teknologi', 'Tutorial']
  },
  {
    id: 'marketing',
    label: 'Marketing & Sales',
    subCategories: ['Digital Marketing', 'Branding', 'Loyalty Program', 'Promosi']
  }
];

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
  
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<{ type: 'parent' | 'sub' | 'all', value: string }>({ type: 'all', value: '' });
  const [expandedParent, setExpandedParent] = useState<string | null>('business'); // Default expand first

  // --- FILTER LOGIC ---
  const filteredArticles = articles.filter(article => {
    // 1. Search Filter
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category Filter
    let matchesCategory = true;
    
    if (selectedFilter.type === 'sub') {
      // Exact match for sub-category
      matchesCategory = article.category === selectedFilter.value;
    } else if (selectedFilter.type === 'parent') {
      // Check if article category belongs to the parent group
      const parentGroup = CATEGORY_TREE.find(p => p.id === selectedFilter.value);
      if (parentGroup) {
        matchesCategory = parentGroup.subCategories.includes(article.category || '');
      }
    }

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const gridArticles = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];

  const handleArticleClick = (article: Article) => {
    navigate(`/articles/${slugify(article.title)}`);
  };

  const toggleParent = (id: string) => {
    setExpandedParent(expandedParent === id ? null : id);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Wawasan &" 
        highlight="Edukasi" 
        subtitle="Panduan bisnis, review teknologi, dan strategi manajemen kasir." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pt-8">
        
        {/* --- LEFT COLUMN: CONTENT (75%) --- */}
        <div className="lg:col-span-9 order-2 lg:order-1">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-20 bg-brand-card rounded-3xl border border-white/5 border-dashed">
              <Search size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Artikel tidak ditemukan</h3>
              <p className="text-gray-400">Coba kata kunci lain atau ganti kategori di sidebar.</p>
              <button 
                onClick={() => { setSelectedFilter({ type: 'all', value: '' }); setSearchTerm(''); }}
                className="mt-4 text-brand-orange hover:underline text-sm font-bold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <>
              {/* Featured Hero (Only shows if no specific search/filter active, or just show always) */}
              {featuredArticle && (
                 <FeaturedArticleHero 
                   article={featuredArticle} 
                   onClick={() => handleArticleClick(featuredArticle)} 
                 />
              )}

              {/* Grid Articles */}
              {gridArticles.length > 0 && (
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                  {gridArticles.map((article) => (
                    <React.Fragment key={article.id}>
                      <ArticleGridCard 
                        article={article}
                        onClick={() => handleArticleClick(article)}
                      />
                    </React.Fragment>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* --- RIGHT COLUMN: SIDEBAR (25%) --- */}
        <div className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          
          {/* 1. Search Widget */}
          <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
             <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Search size={14} className="text-brand-orange"/> Pencarian
             </h4>
             <div className="relative group">
                <Input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  placeholder="Cari topik..." 
                  className="pl-10 py-2 text-sm bg-black/40 border-white/5 focus:border-brand-orange/50"
                />
                <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
             </div>
          </div>

          {/* 2. Category Tree Widget */}
          <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
             <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <Filter size={14} className="text-brand-orange"/> Kategori
                </h4>
                <button 
                  onClick={() => setSelectedFilter({ type: 'all', value: '' })}
                  className={`text-[10px] px-2 py-1 rounded transition-colors ${selectedFilter.type === 'all' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white'}`}
                >
                  RESET
                </button>
             </div>

             <div className="space-y-2">
                {CATEGORY_TREE.map((parent) => {
                   const isExpanded = expandedParent === parent.id;
                   const isActiveParent = selectedFilter.type === 'parent' && selectedFilter.value === parent.id;

                   return (
                     <div key={parent.id} className="overflow-hidden">
                        {/* Parent Button */}
                        <button 
                          onClick={() => toggleParent(parent.id)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-all group ${
                             isActiveParent ? 'bg-white/10 text-brand-orange' : 'hover:bg-white/5 text-gray-300'
                          }`}
                        >
                           <div className="flex items-center gap-2">
                              <FolderOpen size={16} className={isActiveParent ? "text-brand-orange" : "text-gray-500 group-hover:text-white"} />
                              <span className="text-sm font-bold">{parent.label}</span>
                           </div>
                           {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                        </button>

                        {/* Sub Menu (Accordion Body) */}
                        <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 pt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                           
                           {/* Option to select ALL in Parent */}
                           <button
                              onClick={() => setSelectedFilter({ type: 'parent', value: parent.id })}
                              className={`w-full text-left text-xs py-1.5 px-3 rounded border-l-2 transition-all flex items-center gap-2 ${
                                 isActiveParent 
                                 ? 'border-brand-orange text-white bg-brand-orange/5' 
                                 : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'
                              }`}
                           >
                              <div className={`w-1.5 h-1.5 rounded-full ${isActiveParent ? 'bg-brand-orange' : 'bg-transparent border border-gray-600'}`}></div>
                              Semua {parent.label}
                           </button>

                           {/* Specific Sub Categories */}
                           {parent.subCategories.map(sub => {
                              const isActiveSub = selectedFilter.type === 'sub' && selectedFilter.value === sub;
                              return (
                                <button
                                  key={sub}
                                  onClick={() => setSelectedFilter({ type: 'sub', value: sub })}
                                  className={`w-full text-left text-xs py-1.5 px-3 rounded border-l-2 transition-all flex items-center gap-2 ${
                                     isActiveSub 
                                     ? 'border-brand-orange text-brand-orange bg-brand-orange/5' 
                                     : 'border-white/5 text-gray-500 hover:text-white hover:border-white/30'
                                  }`}
                                >
                                   <span className="text-[10px] opacity-50">#</span> {sub}
                                </button>
                              );
                           })}
                        </div>
                     </div>
                   );
                })}
             </div>
          </div>

          {/* 3. Popular Tags Widget (Optional Visual Filler) */}
          <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
             <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                <Hash size={14} className="text-brand-orange"/> Trending
             </h4>
             <div className="flex flex-wrap gap-2">
                {['Android POS', 'Bisnis F&B', 'Tips Hemat', 'Promo', 'Tutorial'].map((tag, i) => (
                   <button 
                     key={i}
                     onClick={() => { setSearchTerm(tag); setSelectedFilter({type:'all', value:''}); }}
                     className="text-[10px] bg-black/40 border border-white/10 hover:border-brand-orange/50 hover:text-brand-orange text-gray-400 px-2 py-1 rounded-md transition-all"
                   >
                      #{tag}
                   </button>
                ))}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};
