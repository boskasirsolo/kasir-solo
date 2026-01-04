
import React, { useState, useEffect, useMemo } from 'react';
import { GalleryItem, Testimonial } from '../types';
import { ProjectDetailView } from '../components/gallery-modal'; 
import { 
  GalleryGrid, 
  PhysicalProjectCard, 
  DigitalProjectCard, 
  GalleryPagination, 
  EmptyGalleryState,
  FilterTab // Reusing the atom
} from '../components/gallery-parts';
import { SectionHeader, Button } from '../components/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { slugify } from '../utils';
import { NotFoundPage } from './not-found';
import { Monitor, Laptop, Code, Layers, Database, Zap } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

// --- LOGIC HOOK ---
const useGalleryLogic = (gallery: GalleryItem[]) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [page, setPage] = useState(1);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [activeFilter]);

  const filteredGallery = useMemo(() => {
    if (activeFilter === 'all') return gallery;
    return gallery.filter(item => item.category_type === activeFilter);
  }, [gallery, activeFilter]);

  const totalPages = Math.ceil(filteredGallery.length / ITEMS_PER_PAGE);
  
  const paginatedGallery = useMemo(() => {
    return filteredGallery.slice(
      (page - 1) * ITEMS_PER_PAGE, 
      page * ITEMS_PER_PAGE
    );
  }, [filteredGallery, page]);

  return {
    activeFilter,
    setActiveFilter,
    page,
    setPage,
    totalPages,
    paginatedGallery,
    hasResults: paginatedGallery.length > 0
  };
};

// --- PAGES ---

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
  const { 
    activeFilter, 
    setActiveFilter, 
    page, 
    setPage, 
    totalPages, 
    paginatedGallery, 
    hasResults 
  } = useGalleryLogic(gallery);

  const handleItemClick = (item: GalleryItem) => {
    navigate(`/gallery/${slugify(item.title)}`);
  };

  return (
    <div className="animate-fade-in">
      
      {/* HERO SECTION - CUSTOMIZED */}
      <section className="relative py-20 border-b border-white/5 overflow-hidden">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
               <Database size={14} className="text-brand-orange" />
               <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Arsip Lapangan</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
               Bukan <span className="text-brand-orange">Kaleng-Kaleng.</span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed">
               Gue gak jual janji manis. Ini bukti otentik instalasi <strong>Mesin Kasir Solo</strong> dan sistem digital yang gue kerjain. 
               Foto asli lapangan, bukan colongan Google. Cek sendiri biar lo yakin gue bukan sales abal-abal.
            </p>
         </div>
      </section>

      <div className="container mx-auto px-4 py-12 relative">
        
        {/* CUSTOM FILTER BAR */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <FilterTab 
              label="Semua Arsenal" 
              active={activeFilter === 'all'} 
              onClick={() => setActiveFilter('all')} 
              icon={Layers}
            />
            <FilterTab 
              label="Mesin Kasir (Fisik)" 
              active={activeFilter === 'physical'} 
              onClick={() => setActiveFilter('physical')} 
              icon={Monitor}
            />
            <FilterTab 
              label="Software & Web (Otak)" 
              active={activeFilter === 'digital'} 
              onClick={() => setActiveFilter('digital')} 
              icon={Code}
            />
        </div>

        <GalleryPagination 
            page={page} 
            totalPages={totalPages} 
            setPage={setPage} 
            className="mb-8" 
        />

        {!hasResults ? (
            <div className="text-center py-20 bg-brand-card rounded-2xl border border-white/5 border-dashed">
                <Zap className="mx-auto w-16 h-16 text-gray-600 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Zona Kosong</h3>
                <p className="text-gray-400">Belum ada barang di kategori ini. Coba cek kategori sebelah.</p>
            </div>
        ) : (
            <GalleryGrid>
                {paginatedGallery.map((item) => (
                <React.Fragment key={item.id}>
                    {/* Render appropriate card based on active filter context or item type */}
                    {item.category_type === 'physical' ? (
                        <PhysicalProjectCard item={item} onClick={() => handleItemClick(item)} />
                    ) : (
                        <DigitalProjectCard item={item} onClick={() => handleItemClick(item)} />
                    )}
                </React.Fragment>
                ))}
            </GalleryGrid>
        )}

        <GalleryPagination 
            page={page} 
            totalPages={totalPages} 
            setPage={setPage} 
            className="mt-12 border-t border-white/5 pt-8" 
        />
      </div>

      {/* FOOTER CTA */}
      <section className="py-20 border-t border-white/5 bg-brand-dark relative overflow-hidden">
         <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="text-3xl font-display font-bold text-white mb-6">
               Mau Bisnis Lo Masuk Sini?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
               Jangan cuma jadi penonton kesuksesan orang lain. Saatnya giliran lo yang gue bantu upgrade sistemnya.
            </p>
            <Button onClick={() => navigate('/contact')} className="px-10 py-4 shadow-neon hover:shadow-neon-strong">
               MULAI PROYEK BARU
            </Button>
         </div>
      </section>

    </div>
  );
};
