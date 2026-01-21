
import React from 'react';
import { SiteConfig, GalleryItem, Testimonial } from '../types';
import { HomeModule } from '../components/home';
import { LocalBusinessSchema } from '../components/seo';

export const HomePage = ({ 
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
  return (
    <>
      <LocalBusinessSchema city="Solo Raya" />
      <HomeModule 
        setPage={setPage} 
        config={config} 
        gallery={gallery} 
        testimonials={testimonials} 
      />
    </>
  );
};
