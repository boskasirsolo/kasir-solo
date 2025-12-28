
import React, { useState } from 'react';
import { 
  Image as ImageIcon, PlayCircle, Monitor, Smartphone, 
  Code, Globe, ArrowRight, Laptop 
} from 'lucide-react';
import { GalleryItem, Testimonial } from '../types';
import { SectionHeader } from '../components/ui';
import { ProjectDetailView } from '../components/gallery-modal'; 
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

// --- COMPONENTS: FILTER TABS ---
const FilterTab = ({ 
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
        : 'bg-brand-card text-gray-400 border-white/10 hover:border-brand-orange/50 hover:text-white'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

// --- COMPONENTS: DIGITAL PROJECT CARD (THE SHOWCASE) ---
const DigitalProjectCard = ({ item, onClick }: { item: GalleryItem, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg hover:shadow-neon flex flex-col h-full"
    >
      {/* LAPTOP FRAME MOCKUP */}
      <div className="relative bg-gray-900 pt-4 px-4 pb-0 overflow-hidden border-b border-white/5">
         {/* Laptop Screen Frame */}
         <div className="relative rounded-t-xl bg-black border-[6px] border-gray-800 border-b-0 overflow-hidden aspect-[16/10] shadow-2xl">
            {/* The Scrolling Image */}
            <div 
                className="w-full h-full bg-cover bg-top transition-all duration-[4000ms] ease-linear group-hover:bg-bottom"
                style={{ backgroundImage: `url(${item.image_url})` }}
            >
                {/* Overlay for inactive state */}
                <div className="absolute inset-0 bg-black/20 group-hover:opacity-0 transition-opacity duration-500"></div>
            </div>
            
            {/* Logo/Icon Overlay (Center) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
               <div className="bg-black/60 backdrop-blur-md p-3 rounded-full border border-white/10">
                  {item.platform === 'mobile' ? <Smartphone size={24} className="text-white"/> : <Globe size={24} className="text-white"/>}
               </div>
            </div>
         </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
         <div className="flex flex-wrap gap-2 mb-3">
            {item.tech_stack?.slice(0, 3).map((tech, idx) => (
               <span key={idx} className="text-[10px] font-bold px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/5">
                 {tech}
               </span>
            ))}
         </div>
         <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-orange transition-colors">{item.title}</h3>
         <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-grow">{item.description}</p>
         
         <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2 mt-auto">
            Lihat Case Study <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    </div>
  );
};

// --- COMPONENTS: PHYSICAL PROJECT CARD (CLASSIC) ---
const PhysicalProjectCard = ({ item, onClick }: { item: GalleryItem, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className="group relative rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg h-full bg-brand-card"
    >
      <div className="relative w-full h-72 md:h-80 overflow-hidden">
        <img 
          src={item.image_url} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {item.type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm border border-white/20 group-hover:bg-brand-orange group-hover:border-brand-orange transition-colors">
              <PlayCircle size={40} className="text-white fill-white/20" />
            </div>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
          <h3 className="text-white font-bold text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
          <div className="w-10 h-1 bg-brand-orange mt-2 rounded-full shadow-neon"></div>
        </div>
      </div>
    </div>
);

// --- PAGE: DETAIL ---
export const ProjectDetailPage = ({ gallery, testimonials }: { gallery: GalleryItem[], testimonials: Testimonial[] }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const item = gallery.find(g => slugify(g.title) === slug);

  if (!item) {
    return <NotFoundPage setPage={() => navigate('/')} />;
  }

  return (
    <ProjectDetailView 
      item={item} 
      testimonials={testimonials} 
      onClose={() => navigate('/gallery')} 
    />
  );
};

// --- PAGE: MAIN LIST ---
export const GalleryPage = ({ gallery, testimonials }: { gallery: GalleryItem[], testimonials: Testimonial[] }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');

  // Filter Logic
  const filteredGallery = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(item => item.category_type === activeFilter);

  const handleItemClick = (item: GalleryItem) => {
    navigate(`/gallery/${slugify(item.title)}`);
  };

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Showcase" 
        highlight="Portofolio" 
        subtitle="Rekam jejak instalasi fisik, inovasi digital, dan kepercayaan klien."
      />

      {/* --- FILTER TABS --- */}
      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <FilterTab 
          label="Semua Project" 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')} 
          icon={Monitor}
        />
        <FilterTab 
          label="Hardware & Instalasi" 
          active={activeFilter === 'physical'} 
          onClick={() => setActiveFilter('physical')} 
          icon={Laptop}
        />
        <FilterTab 
          label="Website & Apps" 
          active={activeFilter === 'digital'} 
          onClick={() => setActiveFilter('digital')} 
          icon={Code}
        />
      </div>

      {/* --- GALLERY GRID VIEW --- */}
      {filteredGallery.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-white/5 border-dashed">
          <ImageIcon className="mx-auto w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400">Belum ada portofolio di kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredGallery.map((item) => (
              <React.Fragment key={item.id}>
                {activeFilter === 'physical' || (activeFilter === 'all' && item.category_type === 'physical') ? (
                    <PhysicalProjectCard item={item} onClick={() => handleItemClick(item)} />
                ) : (
                    <DigitalProjectCard item={item} onClick={() => handleItemClick(item)} />
                )}
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
};
