
import React, { useState, useEffect, useMemo } from 'react';
import { GalleryItem, Testimonial } from '../types';
import { ProjectDetailView } from '../components/gallery-modal'; 
import { 
  GalleryHero, 
  FilterBar, 
  GalleryGrid, 
  PhysicalProjectCard, 
  DigitalProjectCard, 
  GalleryPagination, 
  EmptyGalleryState 
} from '../components/gallery-parts';
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

const ITEMS_PER_PAGE = 6;

// --- LOGIC HOOK ---
const useGalleryLogic = (gallery: GalleryItem[]) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
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

// --- PAGES ---

export const ProjectDetailPage = ({ gallery, testimonials }: { gallery: GalleryItem[], testimonials: Testimonial[] }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = gallery.find(g => slugify(g.title) === slug);

  if (!item) {
    return <NotFoundPage setPage={() => navigate('/')} />;
  }

  return (
    <ProjectDetailView 
      item={item} 
      testimonials={testimonials} 
      onClose={() => navigate('/gallery')} 
    />
  );
};

export const GalleryPage = ({ gallery, testimonials }: { gallery: GalleryItem[], testimonials: Testimonial[] }) => {
  const navigate = useNavigate();
  const { 
    activeFilter, 
    setActiveFilter, 
    page, 
    setPage, 
    totalPages, 
    paginatedGallery, 
    hasResults 
  } = useGalleryLogic(gallery);

  const handleItemClick = (item: GalleryItem) => {
    navigate(`/gallery/${slugify(item.title)}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <GalleryHero />

      <FilterBar 
        activeFilter={activeFilter} 
        setFilter={setActiveFilter} 
      />

      <GalleryPagination 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
        className="mb-8" 
      />

      {!hasResults ? (
        <EmptyGalleryState />
      ) : (
        <GalleryGrid>
            {paginatedGallery.map((item) => (
              <React.Fragment key={item.id}>
                {/* Render appropriate card based on active filter context or item type */}
                {activeFilter === 'physical' || (activeFilter === 'all' && item.category_type === 'physical') ? (
                    <PhysicalProjectCard item={item} onClick={() => handleItemClick(item)} />
                ) : (
                    <DigitalProjectCard item={item} onClick={() => handleItemClick(item)} />
                )}
              </React.Fragment>
            ))}
        </GalleryGrid>
      )}

      <GalleryPagination 
        page={page} 
        totalPages={totalPages} 
        setPage={setPage} 
        className="mt-12 border-t border-white/5 pt-8" 
      />
    </div>
  );
};
