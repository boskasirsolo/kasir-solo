
import React from 'react';
import { GalleryItem, Testimonial, SiteConfig } from '../../types';
import { ProjectDetailModal } from '../gallery';
import { useHomeLogic } from './logic';

// Import Sections
import { HomeHero } from './sections/hero';
import { TrustStrip } from './sections/trust-strip';
import { ProblemSolution } from './sections/problem-solution';
import { InnovationTeaser } from './sections/innovation';
import { GalleryMarquee } from './sections/gallery-marquee';
import { ServicesGrid } from './sections/services';
import { FounderCTA } from './sections/founder-cta';

export const HomeModule = ({ 
  setPage, 
  config, 
  gallery, 
  testimonials 
}: { 
  setPage: (p: string) => void, 
  config: SiteConfig,
  gallery: GalleryItem[],
  testimonials: Testimonial[]
}) => {
  const {
    featuredGallery,
    selectedProject,
    setSelectedProject,
    onsiteRemaining,
    digitalRemaining,
    getTestimonialForProject
  } = useHomeLogic(gallery, testimonials, config);

  return (
    <div className="animate-fade-in">
      <HomeHero setPage={setPage} />
      <TrustStrip />
      <ProblemSolution />
      <InnovationTeaser setPage={setPage} />
      
      <GalleryMarquee 
        featuredGallery={featuredGallery}
        getTestimonialForProject={getTestimonialForProject}
        onProjectClick={setSelectedProject}
        onViewAll={() => setPage('gallery')}
      />

      <ServicesGrid setPage={setPage} />
      
      <FounderCTA 
        config={config} 
        onsiteRemaining={onsiteRemaining} 
        digitalRemaining={digitalRemaining} 
      />

      {selectedProject && (
        <ProjectDetailModal 
          item={selectedProject} 
          testimonials={testimonials} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};
