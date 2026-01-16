
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Article, Product, SiteConfig } from '../types';
import { ArticlesModule } from '../components/articles';
import { SEOHelmet, BreadcrumbSchema } from '../components/seo';
import { slugify } from '../utils';

export const ArticlesPage = ({ 
  articles, 
  products,
  config
}: { 
  articles: Article[], 
  products: Product[],
  config?: SiteConfig
}) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Root Articles Page SEO
  if (!slug) {
    return (
      <>
          <SEOHelmet 
              title="Wawasan Bisnis & Kasir" 
              description="Tips strategi bisnis ritel, tutorial mesin kasir, dan insight teknologi terbaru untuk UMKM Indonesia."
          />
          <BreadcrumbSchema 
            paths={[
                { name: 'Home', item: '/' },
                { name: 'Wawasan', item: '/articles' }
            ]}
          />
          <ArticlesModule articles={articles} products={products} config={config} />
      </>
    );
  }

  // Article Detail SEO
  const article = articles.find(a => slugify(a.title) === slug);
  if (!article) return <ArticlesModule articles={articles} products={products} config={config} />;

  return (
    <>
        <SEOHelmet 
            title={article.title}
            description={article.excerpt || article.content.substring(0, 160)}
            image={article.image}
            type="article"
        />
        <BreadcrumbSchema 
            paths={[
                { name: 'Home', item: '/' },
                { name: 'Wawasan', item: '/articles' },
                { name: article.title, item: `/articles/${slug}` }
            ]}
        />
        <ArticlesModule articles={articles} products={products} config={config} />
    </>
  );
};

// Add explicit export for ArticleDetailPage to fix routing import error in index.tsx
export const ArticleDetailPage = ArticlesPage;
