
import { useState, useMemo } from 'react';
import { GalleryItem, Testimonial, SiteConfig } from '../../types';

export const useHomeLogic = (
  gallery: GalleryItem[], 
  testimonials: Testimonial[],
  config: SiteConfig
) => {
  const [selectedProject, setSelectedProject] = useState<GalleryItem | null>(null);

  // Filter 6 project terbaru untuk Marquee
  const featuredGallery = useMemo(() => gallery.slice(0, 6), [gallery]);

  // Kalkulasi Kuota (Safe Guard jika config undefined/null)
  const onsiteRemaining = Math.max(0, (config?.quotaOnsiteMax || 4) - (config?.quotaOnsiteUsed || 0));
  const digitalRemaining = Math.max(0, (config?.quotaDigitalMax || 2) - (config?.quotaDigitalUsed || 0));

  // Helper: Match Testimonial to Project
  const getTestimonialForProject = (projectTitle: string) => {
    return testimonials.find(t => 
      projectTitle.toLowerCase().includes(t.business_name.toLowerCase()) || 
      t.business_name.toLowerCase().includes(projectTitle.toLowerCase())
    ) || {
      // Placeholder Default
      id: 0,
      client_name: "Smart Owner",
      business_name: "UMKM Indonesia",
      content: "Awalnya ragu karena gue gaptek, tapi Mas Amin sabar banget ngajarin staf gue sampe bisa. Support-nya gila sih, jam 11 malem masih dibales.",
      rating: 5,
      image_url: "",
      is_featured: false
    };
  };

  return {
    featuredGallery,
    selectedProject,
    setSelectedProject,
    onsiteRemaining,
    digitalRemaining,
    getTestimonialForProject
  };
};
