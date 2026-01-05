
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import { useShopLogic } from './logic';
import { slugify } from '../../utils';

// UI Imports
import { ShopHero, SearchWidget, EmptyState, PaginationControl } from './ui/common';
import { ProductCard, ProductGrid } from './product/card';
import { ComparisonBar, ComparisonModal } from './comparison';

// Export Detail View for standalone usage (routes)
export { ProductDetailView } from './product/detail';

export const ShopModule = ({ products }: { products: Product[] }) => {
  const navigate = useNavigate();
  const { state, actions } = useShopLogic(products);

  const handleProductClick = (product: Product) => {
    navigate(`/shop/${slugify(product.name)}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/5 pb-8">
        <ShopHero />
        <SearchWidget 
          value={state.searchTerm} 
          onChange={actions.setSearchTerm} 
        />
      </div>

      {/* Content Section */}
      {state.hasResults ? (
        <ProductGrid>
          {state.displayedProducts.map((product) => (
            <React.Fragment key={product.id}>
              <ProductCard 
                product={product} 
                onDetail={() => handleProductClick(product)}
                onCompare={actions.toggleCompare}
                isSelected={state.compareIds.includes(product.id)}
              />
            </React.Fragment>
          ))}
        </ProductGrid>
      ) : (
        <EmptyState />
      )}

      {/* Pagination */}
      <PaginationControl 
        page={state.page} 
        totalPages={state.totalPages} 
        setPage={actions.setPage} 
      />

      {/* COMPARISON WIDGETS */}
      <ComparisonBar 
         selectedProducts={state.comparedProducts}
         onRemove={actions.removeCompare}
         onClear={actions.clearCompare}
         onCompare={() => actions.setShowCompareModal(true)}
      />

      {state.showCompareModal && (
         <ComparisonModal 
            products={state.comparedProducts} 
            onClose={() => actions.setShowCompareModal(false)}
            onRemove={(id) => {
                actions.removeCompare(id);
                if (state.comparedProducts.length <= 1) actions.setShowCompareModal(false);
            }}
         />
      )}

    </div>
  );
};
