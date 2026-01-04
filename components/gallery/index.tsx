
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GalleryProps } from './types';
import { useGalleryLogic } from './logic';
import { slugify } from '../../utils';
import { NotFoundPage } from '../../pages/not-found';
import { 
    GalleryHero, 
    FilterTab, 
    GalleryPagination, 
    EmptyGalleryState, 
    GalleryGrid,
    PhysicalProjectCard,
    DigitalProjectCard 
} from './ui-parts';
import { ProjectDetailView } from './detail-modal';
import { Button } from '../ui';
import { Database, Monitor, Code, Layers } from 'lucide-react';

// Export Modal for Home Usage
export { ProjectDetailModal } from './detail-modal';

export const GalleryModule = ({ gallery, testimonials }: GalleryProps) => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { 
        activeFilter, setActiveFilter, 
        page, setPage, 
        totalPages, paginatedGallery, hasResults 
    } = useGalleryLogic(gallery);

    // If slug exists, show detail view (or not found)
    if (slug) {
        const item = gallery.find(g => slugify(g.title) === slug);
        if (!item) return <NotFoundPage setPage={() => navigate('/')} />;
        return <ProjectDetailView item={item} testimonials={testimonials} onClose={() => navigate('/gallery')} />;
    }

    // Default: List View
    return (
        <div className="animate-fade-in">
            {/* HERO */}
            <section className="relative py-20 border-b border-white/5 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                        <Database size={14} className="text-brand-orange" />
                        <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Arsip Lapangan</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                        Jejak Perjuangan Mesin Kasir Solo. Bukan <span className="text-brand-orange">Kaleng-Kaleng.</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed">
                        Gue gak jual janji manis. Ini bukti otentik instalasi <strong>Mesin Kasir Solo</strong> dan sistem digital yang gue kerjain. 
                        Foto asli lapangan, bukan colongan Google. Cek sendiri biar lo yakin gue bukan sales abal-abal.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-12 relative">
                {/* FILTER BAR */}
                <div className="flex justify-center gap-4 mb-12 flex-wrap">
                    <FilterTab label="Semua Arsenal" active={activeFilter === 'all'} onClick={() => setActiveFilter('all')} icon={Layers} />
                    <FilterTab label="Mesin Kasir (Fisik)" active={activeFilter === 'physical'} onClick={() => setActiveFilter('physical')} icon={Monitor} />
                    <FilterTab label="Software & Web (Otak)" active={activeFilter === 'digital'} onClick={() => setActiveFilter('digital')} icon={Code} />
                </div>

                <GalleryPagination page={page} totalPages={totalPages} setPage={setPage} className="mb-8" />

                {!hasResults ? (
                    <EmptyGalleryState />
                ) : (
                    <GalleryGrid>
                        {paginatedGallery.map((item) => (
                            <React.Fragment key={item.id}>
                                {item.category_type === 'physical' ? (
                                    <PhysicalProjectCard item={item} onClick={() => navigate(`/gallery/${slugify(item.title)}`)} />
                                ) : (
                                    <DigitalProjectCard item={item} onClick={() => navigate(`/gallery/${slugify(item.title)}`)} />
                                )}
                            </React.Fragment>
                        ))}
                    </GalleryGrid>
                )}

                <GalleryPagination page={page} totalPages={totalPages} setPage={setPage} className="mt-12 border-t border-white/5 pt-8" />
            </div>

            {/* FOOTER CTA */}
            <section className="py-20 border-t border-white/5 bg-brand-dark relative overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl font-display font-bold text-white mb-6">Mau Bisnis Lo Masuk Sini?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                        Jangan cuma jadi penonton kesuksesan orang lain. Saatnya giliran lo yang gue bantu upgrade sistemnya.
                    </p>
                    <Button onClick={() => navigate('/contact')} className="px-10 py-4 shadow-neon hover:shadow-neon-strong mx-auto">
                        MULAI PROYEK BARU
                    </Button>
                </div>
            </section>
        </div>
    );
};
