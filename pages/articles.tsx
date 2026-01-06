
import React from 'react';
import { Article, Product, SiteConfig } from '../types';
import { ArticlesModule } from '../components/articles';
import { SEOHelmet } from '../components/seo';

export const ArticlesPage = ({ 
  articles, 
  products,
  config
}: { 
  articles: Article[], 
  products: Product[],
  config?: SiteConfig
}) => {
  return (
    <>
        <SEOHelmet 
            title="Wawasan Bisnis & Kasir" 
            description="Tips strategi bisnis ritel, tutorial mesin kasir, dan insight teknologi terbaru untuk UMKM Indonesia."
        />
        <ArticlesModule articles={articles} products={products} config={config} />
    </>
  );
};

export const ArticleDetailPage = ({ 
  articles, 
  products,
  config
}: { 
  articles: Article[], 
  products: Product[],
  config?: SiteConfig
}) => {
  // Logic inside ArticleModule handles reading the slug, but we need to intercept for SEO here or inside the module.
  // Since ArticleModule handles the routing logic internally (via slugify), we might pass the SEO responsibilities down or wrap it here.
  // However, looking at index.tsx, ArticleDetailPage is a Route component.
  // To keep it clean, let's delegate SEO inside the Module which reads the slug.
  
  return <ArticlesModule articles={articles} products={products} config={config} />;
};
