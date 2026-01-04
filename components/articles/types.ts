
import { Article, Product } from '../../types';

export interface FilterState {
    type: 'parent' | 'sub' | 'all';
    value: string;
}

export interface ArticleListProps {
    articles: Article[];
    products: Product[];
}

export interface ArticleDetailProps {
    article: Article;
    allArticles: Article[];
    products: Product[];
    onClose: () => void;
}

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video' | 'file' | 'project' | 'table';
    content: string;
    meta?: any;
}
