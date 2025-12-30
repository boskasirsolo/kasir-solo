
import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { 
  ShopHero, 
  SearchWidget, 
  ProductCard, 
  ProductGrid, 
  EmptyState, 
  PaginationControl, 
  ProductDetailView 
} from '../components/shop-parts';
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

const ITEMS_PER_PAGE = 4;

// --- LOGIC HOOK ---
const useShopLogic = (products: Product[]) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

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

  return {
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    displayedProducts,
    hasResults: displayedProducts.length > 0
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
    hasResults 
  } = useShopLogic(products);

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

    </div>
  );
};
