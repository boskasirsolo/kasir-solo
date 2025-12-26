
import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { ShopHeader, ProductCard, ShopPagination, ProductDetailModal } from '../components/shop-parts';

const ITEMS_PER_PAGE = 4;

export const ShopPage = ({ products }: { products: Product[] }) => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter Logic
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );

  // Reset page to 1 when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      
      {/* Modular Header */}
      <ShopHeader 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* Product Grid */}
      {displayedProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {displayedProducts.map((product) => (
            // Fixed: Wrapped in React.Fragment to resolve key prop type error
            <React.Fragment key={product.id}>
              <ProductCard 
                product={product} 
                onDetail={setSelectedProduct} 
              />
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">Produk tidak ditemukan.</p>
        </div>
      )}

      {/* Modular Pagination */}
      <ShopPagination 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
      />

      {/* Modular Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

    </div>
  );
};
