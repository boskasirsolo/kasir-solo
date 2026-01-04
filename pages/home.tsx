
import React from 'react';
import { SiteConfig, GalleryItem, Testimonial } from '../types';
import { HomeModule } from '../components/home';

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
    <HomeModule 
      setPage={setPage} 
      config={config} 
      gallery={gallery} 
      testimonials={testimonials} 
    />
  );
};
