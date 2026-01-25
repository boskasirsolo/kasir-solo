
import { useState, useMemo, useEffect } from 'react';
import { Product, Article, GalleryItem } from '../../../types';
import { SocialContentItem, SourceType } from '../types';
import { SERVICE_CATALOG } from '../data';
import { slugify } from '../../../utils';
import { ITEMS_PER_PAGE } from '../constants';

export const useSourcePicker = (products: Product[], articles: Article[], gallery: GalleryItem[]) => {
    const [selectedSourceType, setSelectedSourceType] = useState<SourceType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sourcePage, setSourcePage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<SocialContentItem | null>(null);

    const allItems = useMemo(() => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://kasirsolo.my.id';
        
        return [
            ...SERVICE_CATALOG.map(s => ({ ...s, url: s.url.startsWith('http') ? s.url : `${origin}${s.url}` })),
            ...products.map(p => ({ id: p.id, type: 'product', title: p.name, description: p.description, image: p.image, url: `${origin}/shop/${slugify(p.name)}`, originalData: p } as SocialContentItem)),
            ...articles.filter(a => a.status === 'published').map(a => ({ id: a.id, type: 'article', title: a.title, description: a.excerpt, image: a.image, url: `${origin}/articles/${slugify(a.title)}`, originalData: a } as SocialContentItem)),
            ...gallery.map(g => ({ id: g.id, type: 'gallery', title: g.title, description: g.description || 'Project Portfolio', image: g.image_url, url: `${origin}/gallery/${slugify(g.title)}`, originalData: g } as SocialContentItem))
        ];
    }, [products, articles, gallery]);

    const filteredItems = useMemo(() => {
        return allItems.filter(item => {
            const matchesType = selectedSourceType === 'all' || item.type === selectedSourceType;
            return matchesType && item.title.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [allItems, selectedSourceType, searchTerm]);

    useEffect(() => setSourcePage(1), [selectedSourceType, searchTerm]);

    return {
        selectedSourceType, setSelectedSourceType,
        searchTerm, setSearchTerm,
        sourcePage, setSourcePage,
        selectedItem, setSelectedItem,
        paginatedItems: filteredItems.slice((sourcePage - 1) * ITEMS_PER_PAGE, sourcePage * ITEMS_PER_PAGE),
        totalSourcePages: Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
    };
};
