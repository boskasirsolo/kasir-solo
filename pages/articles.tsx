
import React from 'react';
import { Article, Product } from '../types';
import { ArticlesModule } from '../components/articles';

export const ArticlesPage = ({ 
  articles, 
  products 
}: { 
  articles: Article[], 
  products: Product[] 
}) => {
  return <ArticlesModule articles={articles} products={products} />;
};

export const ArticleDetailPage = ({ 
  articles, 
  products 
}: { 
  articles: Article[], 
  products: Product[] 
}) => {
  return <ArticlesModule articles={articles} products={products} />;
};
