
import React from 'react';
import { Quote, User, Star, ArrowRight } from 'lucide-react';
import { GalleryItem, Testimonial } from '../../types';
import { Button } from '../../ui';

// --- ATOM: Combined Card (Project + Testimonial) ---
const CombinedCard = ({ 
  item, 
  testimonial, 
  onClick 
}: { 
  item: GalleryItem, 
  testimonial: Testimonial, 
  onClick: (item: GalleryItem) => void 
}) => {
  return (
    <div 
      onClick={() => onClick(item)}
      className="w-[350px] md:w-[450px] shrink-0 flex flex-col gap-4 group/container cursor-pointer"
    >
      {/* TOP: Project Card */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover/container:border-brand-orange transition-all shadow-lg group-hover/container:shadow-neon">
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/container:scale-105" 
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-5 left-5 right-5">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 border ${item.category_type === 'physical' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-blue-600 text-white border-blue-500'}`}>
                {item.category_type === 'physical' ? 'Mesin Kasir' : 'Software'}
              </span>
              <h3 className="text-xl font-bold text-white leading-tight mb-1 truncate drop-shadow-md">
                {item.title}
              </h3>
              <p className="text-gray-300 text-xs truncate opacity-80">
                {item.client_url || "Instalasi Mesin Kasir Solo"}
              </p>
          </div>
      </div>

      {/* BOTTOM: Testimonial Card */}
      <div className="bg-brand-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-5 relative mt-auto hover:bg-brand-card transition-colors">
          {/* Quote Icon */}
          <div className="absolute -top-3 left-6 bg-brand-dark p-1 rounded-full border border-white/10 text-brand-orange">
             <Quote size={16} fill="currentColor" />
          </div>
          
          <p className="text-gray-400 text-sm italic mb-4 leading-relaxed line-clamp-2">
             "{testimonial.content}"
          </p>
          
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-orange/30 overflow-hidden flex items-center justify-center shrink-0">
                 {testimonial.image_url ? (
                   <img src={testimonial.image_url} className="w-full h-full object-cover" />
                 ) : (
                   <User size={14} className="text-gray-500"/>
                 )}
              </div>
              <div>
                 <p className="text-white text-xs font-bold">{testimonial.client_name}</p>
                 <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_,i) => (
                      <Star key={i} size={8} className={`${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                    ))}
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

// --- SECTION: Gallery Marquee ---
export const GalleryMarquee = ({
    featuredGallery,
    getTestimonialForProject,
    onProjectClick,
    onViewAll
}: {
    featuredGallery: GalleryItem[],
    getTestimonialForProject: (title: string) => Testimonial,
    onProjectClick: (item: GalleryItem) => void,
    onViewAll: () => void
}) => {
    if (featuredGallery.length === 0) return null;

    return (
        <section className="py-24 bg-brand-black border-t border-white/5 relative overflow-hidden">
           <div className="container mx-auto px-4 relative z-10 mb-12 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                  Jejak Perang <span className="text-brand-orange">Mesin Kasir Solo</span>
                </h2>
                <p className="text-gray-400 text-base">Ini bukti lapangan instalasi di tempat klien. Bukan foto colongan dari Google.</p>
              </div>
           </div>

           <div className="relative w-full overflow-hidden group/marquee mb-12">
             <div className="absolute left-0 top-0 bottom-0 w-12 md:w-40 bg-gradient-to-r from-brand-black to-transparent z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-12 md:w-40 bg-gradient-to-l from-brand-black to-transparent z-20 pointer-events-none"></div>

             <div className="flex w-full gap-8">
                <div className="flex min-w-full shrink-0 animate-marquee gap-8 justify-around items-stretch py-4 group-hover/marquee:[animation-play-state:paused] group-active/marquee:[animation-play-state:paused]">
                  {featuredGallery.map((item) => (
                    <React.Fragment key={`orig-${item.id}`}>
                      <CombinedCard item={item} testimonial={getTestimonialForProject(item.title)} onClick={onProjectClick} />
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex min-w-full shrink-0 animate-marquee gap-8 justify-around items-stretch py-4 group-hover/marquee:[animation-play-state:paused] group-active/marquee:[animation-play-state:paused]" aria-hidden="true">
                  {featuredGallery.map((item) => (
                    <React.Fragment key={`clone-${item.id}`}>
                      <CombinedCard item={item} testimonial={getTestimonialForProject(item.title)} onClick={onProjectClick} />
                    </React.Fragment>
                  ))}
                </div>
             </div>
           </div>

           <div className="relative z-10 text-center">
             <Button onClick={onViewAll} className="px-8 py-4 text-base font-bold shadow-action hover:shadow-action-strong transition-transform hover:-translate-y-1 mx-auto">
                LIHAT SEMUA PORTOFOLIO <ArrowRight size={20} />
             </Button>
           </div>
        </section>
    );
};
