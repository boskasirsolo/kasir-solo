
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Image as ImageIcon, X, PlayCircle, Calendar } from 'lucide-react';
import { GalleryItem } from '../types';
import { SectionHeader } from '../components/ui';

export const GalleryPage = ({ gallery }: { gallery: GalleryItem[] }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Mencegah scroll pada body saat lightbox aktif
  React.useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedItem]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Galeri" 
        highlight="Dokumentasi" 
        subtitle="Portofolio instalasi mesin kasir, aktivitas kantor, dan event terbaru kami."
      />

      {/* --- GRID VIEW --- */}
      {gallery.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-white/5 border-dashed">
          <ImageIcon className="mx-auto w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400">Belum ada foto di galeri saat ini.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {gallery.map((item) => (
            <div 
              key={item.id} 
              onClick={() => setSelectedItem(item)}
              className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg"
            >
              {/* Image / Thumbnail */}
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Video Indicator Overlay */}
              {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm border border-white/20 group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors">
                    <PlayCircle size={40} className="text-white fill-white/20" />
                  </div>
                </div>
              )}

              {/* Hover Caption */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                <div className="w-10 h-1 bg-brand-orange mt-2 rounded-full shadow-neon"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- LIGHTBOX (PORTAL TO BODY) --- */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" aria-labelledby="lightbox-title" role="dialog" aria-modal="true">
          
          {/* 1. Backdrop (Fixed Fullscreen) */}
          <div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity"
            onClick={() => setSelectedItem(null)}
          />

          {/* 2. Modal Panel (Centered & Scrollable Internally) */}
          <div className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto rounded-2xl bg-brand-dark shadow-2xl border border-white/10 animate-fade-in flex flex-col md:flex-row z-[10000] custom-scrollbar">
            
            {/* Close Button */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm hover:bg-brand-orange transition-colors"
            >
              <X size={24} />
            </button>

            {/* LEFT SIDE: MEDIA */}
            <div className="w-full md:w-2/3 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[600px]">
              {selectedItem.type === 'video' && selectedItem.video_url ? (
                <iframe 
                  src={selectedItem.video_url} 
                  title={selectedItem.title}
                  className="w-full h-full aspect-video md:h-[500px]"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={selectedItem.image_url} 
                  alt={selectedItem.title} 
                  className="w-full h-auto max-h-[80vh] object-contain"
                />
              )}
            </div>

            {/* RIGHT SIDE: INFO (Sticky on Desktop) */}
            <div className="w-full md:w-1/3 flex-shrink-0 bg-brand-card/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 flex flex-col">
              {/* Header Info */}
              <div className="p-8 border-b border-white/10 text-left">
                <div className="flex items-center gap-2 text-brand-orange text-xs font-bold tracking-widest uppercase mb-3">
                  <Calendar size={14} /> Dokumentasi
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-2 pr-8">
                  {selectedItem.title}
                </h3>
                {selectedItem.type === 'video' && (
                  <span className="inline-block px-3 py-1 bg-brand-orange/20 border border-brand-orange/50 rounded-full text-brand-orange text-xs font-bold mt-2">
                    VIDEO DOKUMENTASI
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="p-8 flex-grow text-left overflow-y-auto custom-scrollbar">
                <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                  {selectedItem.description || "Belum ada deskripsi untuk dokumentasi ini."}
                </p>
                
                <div className="mt-8 pt-8 border-t border-white/5">
                  <p className="text-gray-500 text-sm italic">
                    PT Mesin Kasir Solo berkomitmen memberikan pelayanan terbaik dalam setiap project instalasi.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 border-t border-white/10 bg-brand-dark/50 mt-auto">
                <a 
                  href="https://wa.me/6282325103336" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center w-full py-3 bg-brand-orange hover:bg-brand-glow text-white rounded-lg font-bold transition-all shadow-neon hover:shadow-neon-strong transform hover:-translate-y-1"
                >
                  Konsultasi Sekarang
                </a>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
