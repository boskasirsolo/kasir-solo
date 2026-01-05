
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, SiteConfig } from '../types';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';
import { ShopModule, ProductDetailView } from '../components/shop';

export const ShopPage = ({ products }: { products: Product[] }) => {
  return <ShopModule products={products} />;
};

export const ProductDetailPage = ({ products, config }: { products: Product[], config?: SiteConfig }) => {
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
      config={config}
    />
  );
};
