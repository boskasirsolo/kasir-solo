
import React from 'react';
import { Monitor, Smartphone, Globe, PlayCircle, ArrowRight, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { GalleryItem } from '../../types';
import { optimizeImage } from '../../utils';
import { SectionHeader } from '../ui';

export const GalleryHero = () => (
  <SectionHeader 
    title="Showcase" 
    highlight="Portofolio" 
    subtitle="Rekam jejak instalasi fisik, inovasi digital, dan kepercayaan klien."
  />
);

export const FilterTab = ({ 
  label, 
  active, 
  onClick,
  icon: Icon
}: { 
  label: string, 
  active: boolean, 
  onClick: () => void,
  icon: any
}) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap border ${
      active 
        ? 'bg-brand-orange text-white border-brand-orange shadow-neon' 
        : 'bg-brand-card text-gray-400 border-brand-orange hover:bg-brand-orange hover:text-white'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

export const GalleryPagination = ({ 
  page, 
  totalPages, 
  setPage,
  className = ""
}: { 
  page: number, 
  totalPages: number, 
  setPage: (p: number) => void,
  className?: string
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex justify-center items-center gap-4 ${className}`}>
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      
      <span className="text-brand-orange font-display font-bold">
        Page {page} / {totalPages}
      </span>

      <button 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export const EmptyGalleryState = () => (
  <div className="text-center py-20 bg-brand-card rounded-2xl border border-white/5 border-dashed">
    <ImageIcon className="mx-auto w-16 h-16 text-gray-600 mb-4" />
    <p className="text-gray-400">Belum ada portofolio di kategori ini.</p>
  </div>
);

export const DigitalProjectCard: React.FC<{ item: GalleryItem, onClick: () => void }> = ({ item, onClick }) => {
  const displayDesc = item.description && item.description !== 'undefined' 
    ? item.description 
    : "Sistem kustom yang dirancang untuk otomatisasi dan efisiensi operasional bisnis.";

  return (
    <div 
      onClick={onClick}
      className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg hover:shadow-neon flex flex-col h-full"
    >
      <div className="relative bg-gray-900 pt-4 px-4 pb-0 overflow-hidden border-b border-white/5">
         <div className="relative rounded-t-xl bg-black border-[6px] border-gray-800 border-b-0 overflow-hidden aspect-[16/10] shadow-2xl">
            <div 
                className="w-full h-full bg-cover bg-top transition-all duration-[20000ms] ease-in-out group-hover:bg-bottom"
                style={{ backgroundImage: `url(${optimizeImage(item.image_url || 'https://via.placeholder.com/600', 600)})` }}
                role="img"
                aria-label={item.title}
            >
                <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-500"></div>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
               <div className="bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/10">
                  {item.platform === 'mobile' ? <Smartphone size={24} className="text-white"/> : <Globe size={24} className="text-white"/>}
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
         <div className="flex flex-wrap gap-2 mb-3">
            {(item.tech_stack || ['Web App']).slice(0, 3).map((tech, idx) => (
               <span key={idx} className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                 {tech}
               </span>
            ))}
         </div>
         <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">{item.title}</h3>
         <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{displayDesc}</p>
         
         <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2 mt-auto">
            Lihat Case Study <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    </div>
  );
};

export const PhysicalProjectCard: React.FC<{ item: GalleryItem, onClick: () => void }> = ({ item, onClick }) => {
    const displayDesc = item.description && item.description !== 'undefined' 
        ? item.description 
        : "Dokumentasi instalasi perangkat keras dan konfigurasi sistem di lokasi klien.";

    return (
        <div 
        onClick={onClick}
        className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg hover:shadow-neon flex flex-col h-full"
        >
        <div className="relative bg-gray-900 p-4 border-b border-white/5">
            <div className="relative rounded-xl bg-black border border-white/10 overflow-hidden aspect-[16/10] shadow-2xl">
                <img 
                src={optimizeImage(item.image_url || 'https://via.placeholder.com/600', 600)} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                />
                
                {item.type === 'video' && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm border border-white/20 group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors">
                    <PlayCircle size={32} className="text-white fill-white/20" />
                    </div>
                </div>
                )}

                <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${item.type === 'video' ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}>
                <div className="bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/10">
                    <Monitor size={24} className="text-white"/>
                </div>
                </div>
            </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
            <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/10 text-green-400 border border-green-500/20">
                Hardware & Instalasi
                </span>
                {item.type === 'video' && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                    Video
                    </span>
                )}
            </div>

            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors line-clamp-2">{item.title}</h3>
            
            <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">
                {displayDesc}
            </p>
            
            <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2 mt-auto">
                Lihat Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
        </div>
    );
};

export const GalleryGrid = ({ children }: { children?: React.ReactNode }) => (
  <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {children}
  </div>
);
