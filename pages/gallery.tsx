
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Image as ImageIcon, X, PlayCircle, Calendar, Monitor, Smartphone, 
  Code, Globe, CheckCircle2, ArrowRight, Laptop, Quote, Star, MessageCircle, ShieldCheck
} from 'lucide-react';
import { GalleryItem, Testimonial } from '../types';
import { SectionHeader, Badge } from '../components/ui';

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
      className="break-inside-avoid relative group rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange transition-all duration-500 cursor-pointer shadow-lg"
    >
      <img 
        src={item.image_url} 
        alt={item.title} 
        className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
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
);

// --- MAIN PAGE COMPONENT ---
export const GalleryPage = ({ gallery, testimonials }: { gallery: GalleryItem[], testimonials: Testimonial[] }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter Logic
  const filteredGallery = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(item => item.category_type === activeFilter);

  // Logic: Find related testimonial or use DEFAULT Fallback Layout
  // This ensures layout consistency (Always Avatar + Name + Stars + Text)
  const activeTestimonial = selectedItem 
    ? (testimonials.find(t => 
        selectedItem.title.toLowerCase().includes(t.business_name.toLowerCase()) || 
        t.business_name.toLowerCase().includes(selectedItem.title.toLowerCase())
      ) || {
        // FALLBACK OBJECT (Visual Placeholder)
        id: 0,
        client_name: "Tim Teknis",
        business_name: "PT MESIN KASIR SOLO",
        content: "Instalasi dan konfigurasi sistem pada project ini telah melalui uji kelayakan standar operasional prosedur (SOP) yang ketat.",
        rating: 5,
        image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200", // Generic Engineer Avatar
        is_featured: false
      }) 
    : null;

  // Body lock scroll
  React.useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedItem]);

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
        <div className={`grid gap-8 ${activeFilter === 'physical' ? 'columns-1 md:columns-2 lg:columns-3 block space-y-8' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {filteredGallery.map((item) => (
              <React.Fragment key={item.id}>
                {activeFilter === 'physical' || (activeFilter === 'all' && item.category_type === 'physical') ? (
                    <PhysicalProjectCard item={item} onClick={() => setSelectedItem(item)} />
                ) : (
                    <DigitalProjectCard item={item} onClick={() => setSelectedItem(item)} />
                )}
              </React.Fragment>
            ))}
        </div>
      )}

      {/* --- LIGHTBOX / MODAL --- */}
      {selectedItem && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={() => setSelectedItem(null)} />

          <div className="relative w-full max-w-7xl h-[90vh] rounded-2xl bg-brand-dark shadow-2xl border border-white/10 animate-fade-in flex flex-col md:flex-row z-[10000] overflow-hidden">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm hover:bg-brand-orange transition-colors">
              <X size={24} />
            </button>

            {/* =========================================================
                LEFT COLUMN (65%): IMAGE + FOOTER (TESTIMONIAL + BUTTONS)
               ========================================================= */}
            <div className="w-full md:w-8/12 h-[55%] md:h-full bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-white/10">
               
               {/* 1. IMAGE DISPLAY (Flex Grow) */}
               <div className="flex-grow relative overflow-hidden bg-gray-900 group">
                  {selectedItem.category_type === 'digital' ? (
                     <div className="w-full h-full overflow-y-auto custom-scrollbar">
                        <img 
                            src={selectedItem.image_url} 
                            alt={selectedItem.title} 
                            className="w-full min-h-full object-cover object-top" 
                        />
                     </div>
                  ) : (
                     selectedItem.type === 'video' && selectedItem.video_url ? (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                            <iframe src={selectedItem.video_url} title={selectedItem.title} className="w-full aspect-video" allowFullScreen></iframe>
                        </div>
                     ) : (
                        <div className="w-full h-full flex items-center justify-center p-4">
                            <img src={selectedItem.image_url} alt={selectedItem.title} className="max-w-full max-h-full object-contain" />
                        </div>
                     )
                  )}
               </div>

               {/* 2. BOTTOM BAR (Footer) - COMPACT FIXED HEIGHT */}
               <div className="shrink-0 bg-brand-dark border-t border-white/10 h-auto md:h-40 flex flex-col md:flex-row">
                   
                   {/* TESTIMONIAL SECTION (Left side) - Flex 1 */}
                   {/* Layout konsisten: Avatar di kiri, Teks di kanan */}
                   <div className="flex-1 p-5 flex items-center border-b md:border-b-0 md:border-r border-white/10">
                       {activeTestimonial && (
                          <div className="flex gap-5 items-center w-full animate-fade-in">
                              {/* Avatar */}
                              <div className="w-16 h-16 rounded-full border-2 border-brand-orange/30 p-0.5 shrink-0 shadow-neon">
                                  <img src={activeTestimonial.image_url} className="w-full h-full rounded-full object-cover" alt={activeTestimonial.client_name} />
                              </div>
                              
                              {/* Text Content */}
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-3 mb-1">
                                      <h5 className="font-bold text-white text-base flex items-center gap-1">
                                         {activeTestimonial.client_name}
                                         {activeTestimonial.id === 0 && <ShieldCheck size={14} className="text-blue-400" />}
                                      </h5>
                                      <div className="flex text-yellow-500 gap-0.5">
                                          {[...Array(5)].map((_, i) => (
                                              <Star key={i} size={12} fill={i < activeTestimonial.rating ? "currentColor" : "none"} />
                                          ))}
                                      </div>
                                  </div>
                                  <p className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">{activeTestimonial.business_name}</p>
                                  <p className="text-gray-300 text-sm md:text-base italic leading-relaxed line-clamp-2">"{activeTestimonial.content}"</p>
                              </div>
                          </div>
                       )}
                   </div>

                   {/* ACTION BUTTONS (Right side) - Fixed Width */}
                   {/* Logic: Flex column justify-center centers vertical. Gap handles spacing. */}
                   <div className="w-full md:w-64 p-5 flex flex-col justify-center gap-2 bg-brand-dark/50">
                        <a 
                             href="https://wa.me/6282325103336" 
                             target="_blank" 
                             rel="noreferrer"
                             className="w-full flex items-center justify-center py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-lg font-bold transition-all shadow-action hover:shadow-action-strong gap-2 text-xs"
                        >
                             <MessageCircle size={16} /> Hubungi Sales
                        </a>
                        {selectedItem.client_url && (
                             <a 
                                href={selectedItem.client_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="w-full flex items-center justify-center py-3 border border-white/20 hover:border-white hover:bg-white/5 text-white rounded-lg font-bold transition-all gap-2 text-xs"
                             >
                                <Globe size={16}/> Visit Project
                             </a>
                        )}
                   </div>
               </div>
            </div>

            {/* =========================================================
                RIGHT COLUMN (35%): HEADER + NARRATIVE
               ========================================================= */}
            <div className="w-full md:w-4/12 h-[45%] md:h-full bg-brand-card flex flex-col relative z-20">
              
              {/* HEADER (Sticky) */}
              <div className="p-6 md:p-8 border-b border-white/10 bg-brand-card sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                   <Badge className="bg-brand-orange text-white border-transparent">{selectedItem.category_type === 'digital' ? 'Software' : 'Hardware'}</Badge>
                   {selectedItem.platform && <Badge className="bg-white/10 text-gray-300 border-white/20">{selectedItem.platform.toUpperCase()}</Badge>}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4">{selectedItem.title}</h3>
                
                {selectedItem.tech_stack && (
                   <div className="flex flex-wrap gap-2">
                      {selectedItem.tech_stack.map((t, i) => (
                         <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-black/40 text-brand-orange border border-brand-orange/20">{t}</span>
                      ))}
                   </div>
                )}
              </div>

              {/* BODY (Scrollable) */}
              <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar text-left space-y-8">
                {selectedItem.case_study ? (
                   // CASE STUDY FORMAT (STAR METHOD)
                   <>
                      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                         <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                            <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">1</div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest">The Challenge</h4>
                         </div>
                         <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-white/5 hover:border-red-500/50 transition-colors">
                            {selectedItem.case_study.challenge}
                         </p>
                      </div>

                      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                         <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">2</div>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest">Our Solution</h4>
                         </div>
                         <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-white/5 hover:border-blue-500/50 transition-colors">
                            {selectedItem.case_study.solution}
                         </p>
                      </div>

                      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                         <div className="bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20 hover:bg-brand-orange/10 transition-colors">
                            <div className="flex items-center gap-2 mb-3">
                                <CheckCircle2 size={18} className="text-brand-orange"/>
                                <h4 className="text-white font-bold text-sm uppercase tracking-widest">The Result</h4>
                            </div>
                            <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                                {selectedItem.case_study.result}
                            </p>
                         </div>
                      </div>
                   </>
                ) : (
                   // STANDARD DESCRIPTION
                   <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                      {selectedItem.description || "Belum ada deskripsi detail untuk project ini."}
                   </div>
                )}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
