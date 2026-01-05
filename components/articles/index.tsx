
import React from 'react';
import { Article, Product, SiteConfig } from '../../types';
import { ArticleListView } from './sections/list-view';
import { ArticleReaderView } from './sections/detail-view';
import { useParams, useNavigate } from 'react-router-dom';
import { slugify } from '../../utils';
import { NotFoundPage } from '../../pages/not-found';

export const ArticlesModule = ({ articles, products, config }: { articles: Article[], products: Product[], config?: SiteConfig }) => {
    const { slug } = useParams();
    const navigate = useNavigate();

    // LIST VIEW
    if (!slug) {
        return <ArticleListView articles={articles} products={products} config={config} />;
    }

    // DETAIL VIEW
    const article = articles.find(a => slugify(a.title) === slug);
    
    if (!article) {
        return <NotFoundPage setPage={() => navigate('/')} />;
    }

    return (
        <ArticleReaderView 
            article={article} 
            products={products} 
            allArticles={articles}
            onClose={() => navigate('/articles')}
            config={config}
        />
    );
};
