
import React from 'react';
import { GalleryItem, Testimonial } from '../types';
import { GalleryModule } from '../components/gallery';

export const GalleryPage = ({ 
  gallery, 
  testimonials 
}: { 
  gallery: GalleryItem[], 
  testimonials: Testimonial[] 
}) => {
  return (
    <GalleryModule 
        gallery={gallery} 
        testimonials={testimonials} 
    />
  );
};

export const ProjectDetailPage = ({ 
  gallery, 
  testimonials 
}: { 
  gallery: GalleryItem[], 
  testimonials: Testimonial[] 
}) => {
  return (
    <GalleryModule 
        gallery={gallery} 
        testimonials={testimonials} 
    />
  );
};
