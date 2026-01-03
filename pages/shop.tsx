
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { 
  ShopHero, 
  SearchWidget, 
  ProductCard, 
  ProductGrid, 
  EmptyState, 
  PaginationControl, 
  ProductDetailView,
  ComparisonBar, 
  ComparisonModal 
} from '../components/shop-parts';
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

const ITEMS_PER_PAGE = 8;

// --- LOGIC HOOK ---
const useShopLogic = (products: Product[]) => {
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

  // Comparison Handlers
  const toggleCompare = (product: Product) => {
      setCompareIds(prev => {
          if (prev.includes(product.id)) {
              return prev.filter(id => id !== product.id);
          } else {
              if (prev.length >= 3) {
                  alert("Maksimal 3 produk untuk dibandingkan.");
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
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    displayedProducts,
    hasResults: displayedProducts.length > 0,
    // Compare Props
    compareIds,
    toggleCompare,
    removeCompare,
    clearCompare,
    comparedProducts,
    showCompareModal,
    setShowCompareModal
  };
};

// --- PAGES ---

export const ProductDetailPage = ({ products }: { products: Product[] }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Find product by slug
  const product = products.find(p => slugify(p.name) === slug);

  if (!product) {
    return <NotFoundPage setPage={() => navigate('/')} />;
  }

  return (
    <ProductDetailView 
      product={product} 
      onClose={() => navigate('/shop')} 
    />
  );
};

export const ShopPage = ({ products }: { products: Product[] }) => {
  const navigate = useNavigate();
  const { 
    searchTerm, 
    setSearchTerm, 
    page, 
    setPage, 
    totalPages, 
    displayedProducts,
    hasResults,
    compareIds, toggleCompare, removeCompare, clearCompare, comparedProducts, showCompareModal, setShowCompareModal
  } = useShopLogic(products);

  // Auto-scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const handleProductClick = (product: Product) => {
    navigate(`/shop/${slugify(product.name)}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-8">
        <ShopHero />
        <SearchWidget 
          value={searchTerm} 
          onChange={setSearchTerm} 
        />
      </div>

      {/* Content Section */}
      {hasResults ? (
        <ProductGrid>
          {displayedProducts.map((product) => (
            <React.Fragment key={product.id}>
              <ProductCard 
                product={product} 
                onDetail={() => handleProductClick(product)}
                onCompare={toggleCompare}
                isSelected={compareIds.includes(product.id)}
              />
            </React.Fragment>
          ))}
        </ProductGrid>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      <PaginationControl 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
      />

      {/* COMPARISON WIDGETS */}
      <ComparisonBar 
         selectedProducts={comparedProducts}
         onRemove={removeCompare}
         onClear={clearCompare}
         onCompare={() => setShowCompareModal(true)}
      />

      {showCompareModal && (
         <ComparisonModal 
            products={comparedProducts} 
            onClose={() => setShowCompareModal(false)}
            onRemove={(id) => {
                removeCompare(id);
                if (comparedProducts.length <= 1) setShowCompareModal(false);
            }}
         />
      )}

    </div>
  );
};
