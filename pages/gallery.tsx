
import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../types';
import { SectionHeader } from '../components/ui';

export const GalleryPage = ({ gallery }: { gallery: GalleryItem[] }) => (
  <div className="container mx-auto px-4 py-10 animate-fade-in">
    <SectionHeader 
      title="Galeri" 
      highlight="Dokumentasi" 
      subtitle="Portofolio instalasi mesin kasir, aktivitas kantor, dan event terbaru kami."
    />

    {gallery.length === 0 ? (
      <div className="text-center py-20 bg-brand-card rounded-2xl border border-white/5 border-dashed">
        <ImageIcon className="mx-auto w-16 h-16 text-gray-600 mb-4" />
        <p className="text-gray-400">Belum ada foto di galeri saat ini.</p>
      </div>
    ) : (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {gallery.map((item) => (
          <div key={item.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange transition-all duration-500">
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
              <div className="w-10 h-1 bg-brand-orange mt-2 rounded-full shadow-neon"></div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);
