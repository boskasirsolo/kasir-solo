
import { useState, useMemo, useEffect } from 'react';
import { GalleryItem } from '../../types';
import { GalleryFilterType } from './types';

const ITEMS_PER_PAGE = 6;

export const useGalleryLogic = (gallery: GalleryItem[]) => {
    const [activeFilter, setActiveFilter] = useState<GalleryFilterType>('all');
    const [page, setPage] = useState(1);

    // Reset page when filter changes
    useEffect(() => {
        setPage(1);
    }, [activeFilter]);

    const filteredGallery = useMemo(() => {
        if (activeFilter === 'all') return gallery;
        return gallery.filter(item => item.category_type === activeFilter);
    }, [gallery, activeFilter]);

    const totalPages = Math.ceil(filteredGallery.length / ITEMS_PER_PAGE);
    
    const paginatedGallery = useMemo(() => {
        return filteredGallery.slice(
            (page - 1) * ITEMS_PER_PAGE, 
            page * ITEMS_PER_PAGE
        );
    }, [filteredGallery, page]);

    return {
        activeFilter,
        setActiveFilter,
        page,
        setPage,
        totalPages,
        paginatedGallery,
        hasResults: paginatedGallery.length > 0
    };
};
