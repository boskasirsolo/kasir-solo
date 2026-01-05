
import { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { ITEMS_PER_PAGE } from './constants';

export const useShopLogic = (products: Product[]) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // COMPARISON STATE
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.category.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(
      (page - 1) * ITEMS_PER_PAGE, 
      page * ITEMS_PER_PAGE
    );
  }, [filteredProducts, page]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Comparison Handlers
  const toggleCompare = (product: Product) => {
      setCompareIds(prev => {
          if (prev.includes(product.id)) {
              return prev.filter(id => id !== product.id);
          } else {
              if (prev.length >= 3) {
                  alert("Woi, santai! Maksimal 3 barang aja yang diadu biar gak pusing.");
                  return prev;
              }
              return [...prev, product.id];
          }
      });
  };

  const removeCompare = (id: number) => {
      setCompareIds(prev => prev.filter(pid => pid !== id));
  };

  const clearCompare = () => setCompareIds([]);

  const comparedProducts = products.filter(p => compareIds.includes(p.id));

  return {
    state: {
        searchTerm,
        page,
        totalPages,
        displayedProducts,
        hasResults: displayedProducts.length > 0,
        compareIds,
        comparedProducts,
        showCompareModal
    },
    actions: {
        setSearchTerm,
        setPage,
        toggleCompare,
        removeCompare,
        clearCompare,
        setShowCompareModal
    }
  };
};
