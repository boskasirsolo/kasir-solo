
import React, { useState } from 'react';
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

      {/* --- LIGHTBOX (OVERLAY) --- */}
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 animate-fade-in">
          {/* Backdrop Blur */}
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          ></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-7xl h-full md:h-[85vh] bg-brand-dark md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl border border-white/10">
            
            {/* Close Button (Mobile) */}
            <button 
              onClick={() => setSelectedItem(null)}
              className="md:hidden absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm"
            >
              <X size={24} />
            </button>

            {/* LEFT SIDE: MEDIA (Image/Video) */}
            <div className="w-full md:flex-1 bg-black flex items-center justify-center relative h-[40vh] md:h-auto">
              {selectedItem.type === 'video' && selectedItem.video_url ? (
                <iframe 
                  src={selectedItem.video_url} 
                  title={selectedItem.title}
                  className="w-full h-full md:h-full aspect-video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img 
                  src={selectedItem.image_url} 
                  alt={selectedItem.title} 
                  className="w-full h-full object-contain max-h-[40vh] md:max-h-full"
                />
              )}
            </div>

            {/* RIGHT SIDE: INFO & DESCRIPTION */}
            <div className="w-full md:w-[400px] flex-shrink-0 bg-brand-card/95 backdrop-blur-xl border-t md:border-t-0 md:border-l border-white/10 flex flex-col h-[60vh] md:h-auto">
              {/* Header Info */}
              <div className="p-8 border-b border-white/10 relative">
                 <button 
                  onClick={() => setSelectedItem(null)}
                  className="hidden md:block absolute top-6 right-6 text-gray-400 hover:text-brand-orange transition-colors"
                >
                  <X size={28} />
                </button>

                <div className="flex items-center gap-2 text-brand-orange text-xs font-bold tracking-widest uppercase mb-3">
                  <Calendar size={14} /> Dokumentasi
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-2">
                  {selectedItem.title}
                </h3>
                {selectedItem.type === 'video' && (
                  <span className="inline-block px-3 py-1 bg-brand-orange/20 border border-brand-orange/50 rounded-full text-brand-orange text-xs font-bold mt-2">
                    VIDEO DOKUMENTASI
                  </span>
                )}
              </div>

              {/* Scrollable Description */}
              <div className="p-8 overflow-y-auto flex-grow custom-scrollbar">
                <p className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line">
                  {selectedItem.description || "Belum ada deskripsi untuk dokumentasi ini."}
                </p>
                
                {/* Decoration */}
                <div className="mt-8 pt-8 border-t border-white/5">
                   <p className="text-gray-500 text-sm italic">
                    PT Mesin Kasir Solo berkomitmen memberikan pelayanan terbaik dalam setiap project instalasi.
                   </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 border-t border-white/10 bg-brand-dark/50">
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
        </div>
      )}
    </div>
  );
};
