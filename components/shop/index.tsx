import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, GalleryItem, SiteConfig } from '../../types';
import { useShopLogic } from './logic';
import { slugify } from '../../utils';

// UI Imports
import { ShopHero, SearchWidget, EmptyState, PaginationControl, QuickActions } from './ui/common';
import { ProductCard, ProductGrid } from './product/card';
import { ComparisonBar, ComparisonModal } from './comparison';
import { PhysicalProjectCard } from '../gallery/ui-parts'; 
import { SectionHeader, Button } from '../ui'; 
import { ArrowRight } from 'lucide-react';

// Export Detail View for standalone usage (routes)
export { ProductDetailView } from './product/detail';

export const ShopModule = ({ 
  products, 
  gallery = [],
  config
}: { 
  products: Product[], 
  gallery?: GalleryItem[],
  config: SiteConfig
}) => {
  const navigate = useNavigate();
  const { state, actions } = useShopLogic(products);

  const handleProductClick = (product: Product) => {
    navigate(`/shop/${slugify(product.name)}`);
  };

  // Filter 3 latest Hardware Projects
  const hardwareProjects = gallery
    .filter(item => item.category_type === 'physical')
    .slice(0, 3);

  // Scarcity Logic
  const onsiteRemaining = Math.max(0, (config?.quota_onsite_max || 5) - (config?.quota_onsite_used || 0));

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-8 border-b border-white/5 pb-8">
        {/* Left: Hero Text with Quota */}
        <ShopHero 
            remaining={onsiteRemaining} 
            max={config?.quota_onsite_max || 5} 
        />
        
        {/* Right: Search & Actions */}
        <div className="flex flex-col items-end w-full lg:w-auto gap-2">
            <SearchWidget 
              value={state.searchTerm} 
              onChange={actions.setSearchTerm} 
            />
            <QuickActions />
        </div>
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

      {/* NEW SECTION: HARDWARE PROJECTS */}
      {hardwareProjects.length > 0 && (
        <section className="mt-24 pt-16 border-t border-white/5 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent opacity-50"></div>
            
            <SectionHeader 
                title="Bukti" 
                highlight="Lapangan" 
                subtitle="Foto asli pemasangan unit di lokasi klien. Bukan gambar comotan internet."
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {hardwareProjects.map(item => (
                    <PhysicalProjectCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => { navigate(`/gallery/${slugify(item.title)}`); }}
                    />
                ))}
            </div>

            <div className="text-center">
                <Button variant="outline" onClick={() => navigate('/gallery')} className="px-8 py-3">
                    LIHAT SEMUA PORTOFOLIO <ArrowRight size={16} className="ml-2"/>
                </Button>
            </div>
        </section>
      )}

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