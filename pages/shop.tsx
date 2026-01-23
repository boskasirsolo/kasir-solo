import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, SiteConfig, GalleryItem } from '../types';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';
import { ShopModule, ProductDetailView } from '../components/shop';
import { SEOHelmet } from '../components/seo';

export const ShopPage = ({ 
    products, 
    gallery,
    config
}: { 
    products: Product[], 
    gallery?: GalleryItem[],
    config: SiteConfig
}) => {
  return (
    <>
        <SEOHelmet 
            title="Katalog Mesin Kasir" 
            description="Daftar paket mesin kasir lengkap Android & Windows. Garansi resmi, siap kirim seluruh Indonesia."
        />
        <ShopModule products={products} gallery={gallery} config={config} />
    </>
  );
};

export const ProductDetailPage = ({ products, config }: { products: Product[], config: SiteConfig }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  
  // Find product by slug
  const product = products.find(p => slugify(p.name) === slug);

  if (!product) {
    return <NotFoundPage setPage={() => navigate('/')} />;
  }

  return (
    <>
        <SEOHelmet 
            title={product.name}
            description={product.description || `Beli ${product.name} termurah dan bergaransi resmi di Mesin Kasir Solo.`}
            image={product.image}
            type="product"
        />
        <ProductDetailView 
          product={product} 
          onClose={() => navigate('/shop')} 
          config={config}
        />
    </>
  );
};