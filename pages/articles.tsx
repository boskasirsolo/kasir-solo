
import React from 'react';
import { Article, Product, SiteConfig } from '../types';
import { ArticlesModule } from '../components/articles';

export const ArticlesPage = ({ 
  articles, 
  products,
  config
}: { 
  articles: Article[], 
  products: Product[],
  config?: SiteConfig
}) => {
  return <ArticlesModule articles={articles} products={products} config={config} />;
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
  return <ArticlesModule articles={articles} products={products} config={config} />;
};
