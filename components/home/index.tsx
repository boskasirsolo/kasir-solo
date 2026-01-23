import React from 'react';
import { GalleryItem, Testimonial, SiteConfig } from '../../types';
import { ProjectDetailModal } from '../gallery';
import { useHomeLogic } from './logic';
import { useScrollReveal } from '../../hooks/use-scroll-reveal';
import { useSocialPulse } from '../../hooks/use-social-pulse';

// Import Sections
import { HomeHero } from './sections/hero';
import { TrustStrip } from './sections/trust-strip';
import { ProblemSolution } from './sections/problem-solution';
import { InnovationTeaser } from './sections/innovation';
import { GalleryMarquee } from './sections/gallery-marquee';
import { ServicesGrid } from './sections/services';
import { FounderCTA } from './sections/founder-cta';
import { LivePulseSection } from './sections/live-pulse';

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

  const { allEvents } = useSocialPulse();

  // Aktifin Scroll Reveal Engine
  useScrollReveal();

  return (
    <div className="animate-fade-in space-y-0">
      <HomeHero 
        setPage={setPage} 
        config={config} 
        onsiteRemaining={onsiteRemaining}
        digitalRemaining={digitalRemaining}
      />
      
      <LivePulseSection events={allEvents} />

      <div className="reveal-on-scroll">
        <TrustStrip />
      </div>

      <div className="reveal-on-scroll">
        <ProblemSolution />
      </div>

      <div className="reveal-on-scroll">
        <InnovationTeaser setPage={setPage} />
      </div>
      
      <div className="reveal-on-scroll">
        <GalleryMarquee 
            featuredGallery={featuredGallery}
            getTestimonialForProject={getTestimonialForProject}
            onProjectClick={setSelectedProject}
            onViewAll={() => setPage('gallery')}
        />
      </div>

      <div className="reveal-on-scroll">
        <ServicesGrid setPage={setPage} />
      </div>
      
      <div className="reveal-on-scroll">
        <FounderCTA 
            config={config} 
            onsiteRemaining={onsiteRemaining} 
            digitalRemaining={digitalRemaining} 
        />
      </div>

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