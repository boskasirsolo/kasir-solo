
import { useState, useMemo, useEffect } from 'react';
import { Article } from '../../types';
import { FilterState } from '../types';
import { CATEGORY_TREE, ITEMS_PER_PAGE } from '../constants';

export const useArticleList = (articles: Article[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterState>({ type: 'all', value: '' });
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchTerm, selectedFilter]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      // 1. Search Filter
      const titleMatch = (article.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const excerptMatch = (article.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSearch = titleMatch || excerptMatch;
      
      // 2. Category Filter
      let matchesCategory = true;
      const articleCat = (article.category || '').toLowerCase().trim();

      if (selectedFilter.type === 'sub') {
        const filterVal = selectedFilter.value.toLowerCase().trim();
        matchesCategory = articleCat.includes(filterVal);
      } else if (selectedFilter.type === 'parent') {
        const parentGroup = CATEGORY_TREE.find(p => p.id === selectedFilter.value);
        if (parentGroup) {
          matchesCategory = parentGroup.subCategories.some(sub => 
            articleCat.includes(sub.toLowerCase().trim())
          );
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedFilter]);

  // Pagination Logic
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  // If searching or filtering, we might not want to pull out the first one as featured, but for now we follow the design.
  // Actually, standard list logic: Featured is ONLY shown on page 1 and if NO search/filter is active (optional, but cleaner).
  // Let's keep it simple: First item is featured if page 1.
  
  const gridSource = filteredArticles.length > 0 ? filteredArticles.slice(1) : [];
  const totalPages = Math.ceil(gridSource.length / ITEMS_PER_PAGE);
  const paginatedArticles = gridSource.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSelectedFilter({ type: 'all', value: '' });
    setSearchTerm('');
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
  };
};
