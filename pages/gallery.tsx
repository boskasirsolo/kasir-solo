
import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, PlayCircle, Monitor, Smartphone, 
  Code, Globe, ArrowRight, Laptop, ChevronLeft, ChevronRight 
} from 'lucide-react';
import { GalleryItem, Testimonial } from '../types';
import { SectionHeader } from '../components/ui';
import { ProjectDetailView } from '../components/gallery-modal'; 
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';

const ITEMS_PER_PAGE = 6;

const PaginationControl = ({ 
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
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"
      >
        <ChevronLeft size={20} />
      </button>
      
      <span className="text-brand-orange font-display font-bold">
        Page {page} / {totalPages}
      </span>

      <button 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

// --- UPDATED: Filter Tab with Orange Border by Default ---
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
        : 'bg-brand-card text-gray-400 border-brand-orange hover:bg-brand-orange hover:text-white'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

const DigitalProjectCard = ({ item, onClick }: { item: GalleryItem, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg hover:shadow-neon flex flex-col h-full"
    >
      <div className="relative bg-gray-900 pt-4 px-4 pb-0 overflow-hidden border-b border-white/5">
         <div className="relative rounded-t-xl bg-black border-[6px] border-gray-800 border-b-0 overflow-hidden aspect-[16/10] shadow-2xl">
            <div 
                className="w-full h-full bg-cover bg-top transition-all duration-[4000ms] ease-linear group-hover:bg-bottom"
                style={{ backgroundImage: `url(${item.image_url})` }}
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

const PhysicalProjectCard = ({ item, onClick }: { item: GalleryItem, onClick: () => void }) => (
    <div 
      onClick={onClick}
      className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg hover:shadow-neon flex flex-col h-full"
    >
      <div className="relative bg-gray-900 p-4 border-b border-white/5">
         <div className="relative rounded-xl bg-black border border-white/10 overflow-hidden aspect-[16/10] shadow-2xl">
            <img 
              src={item.image_url} 
              alt={item.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
            {item.description || "Dokumentasi instalasi perangkat keras dan konfigurasi sistem."}
         </p>
         
         <div className="flex items-center text-brand-orange text-xs font-bold uppercase tracking-widest gap-2 mt-auto">
            Lihat Detail <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
         </div>
      </div>
    </div>
);

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

export const GalleryPage = ({ gallery, testimonials }: { gallery: GalleryItem[], testimonials: Testimonial[] }) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [page, setPage] = useState(1);

  const filteredGallery = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(item => item.category_type === activeFilter);

  const totalPages = Math.ceil(filteredGallery.length / ITEMS_PER_PAGE);
  const paginatedGallery = filteredGallery.slice(
    (page - 1) * ITEMS_PER_PAGE, 
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

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

      <div className="flex justify-center gap-4 mb-8 flex-wrap">
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

      <PaginationControl page={page} totalPages={totalPages} setPage={setPage} className="mb-8" />

      {filteredGallery.length === 0 ? (
        <div className="text-center py-20 bg-brand-card rounded-2xl border border-white/5 border-dashed">
          <ImageIcon className="mx-auto w-16 h-16 text-gray-600 mb-4" />
          <p className="text-gray-400">Belum ada portofolio di kategori ini.</p>
        </div>
      ) : (
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedGallery.map((item) => (
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

      <PaginationControl page={page} totalPages={totalPages} setPage={setPage} className="mt-12 border-t border-white/5 pt-8" />
    </div>
  );
};
