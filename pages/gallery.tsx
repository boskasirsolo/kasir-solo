
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Image as ImageIcon, X, PlayCircle, Calendar, Monitor, Smartphone, 
  Code, Globe, CheckCircle2, ArrowRight, Laptop 
} from 'lucide-react';
import { GalleryItem } from '../types';
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
  // Tab remains using brand-orange (Amber) as it's a navigational/state element
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
export const GalleryPage = ({ gallery }: { gallery: GalleryItem[] }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'physical' | 'digital'>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Filter Logic
  const filteredGallery = activeFilter === 'all' 
    ? gallery 
    : gallery.filter(item => item.category_type === activeFilter);

  // Body lock scroll
  React.useEffect(() => {
    document.body.style.overflow = selectedItem ? 'hidden' : 'auto';
  }, [selectedItem]);

  return (
    <div className="container mx-auto px-4 py-10 animate-fade-in relative">
      <SectionHeader 
        title="Showcase" 
        highlight="Portofolio" 
        subtitle="Rekam jejak instalasi fisik dan inovasi digital PT Mesin Kasir Solo."
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

      {/* --- GRID VIEW --- */}
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

          <div className="relative w-full max-w-6xl h-[90vh] rounded-2xl bg-brand-dark shadow-2xl border border-white/10 animate-fade-in flex flex-col md:flex-row z-[10000] overflow-hidden">
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm hover:bg-brand-orange transition-colors">
              <X size={24} />
            </button>

            {/* LEFT SIDE: MEDIA */}
            <div className="w-full md:w-3/5 h-[40%] md:h-full bg-black flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/10 overflow-hidden group">
              {selectedItem.category_type === 'digital' ? (
                 // Digital View: Scrollable Full Image
                 <div className="w-full h-full overflow-y-auto custom-scrollbar bg-gray-900">
                    <img src={selectedItem.image_url} alt={selectedItem.title} className="w-full h-auto object-cover" />
                 </div>
              ) : (
                 // Physical View: Fit Image
                 selectedItem.type === 'video' && selectedItem.video_url ? (
                    <iframe src={selectedItem.video_url} title={selectedItem.title} className="w-full h-full" allowFullScreen></iframe>
                 ) : (
                    <img src={selectedItem.image_url} alt={selectedItem.title} className="w-full h-full object-contain p-4" />
                 )
              )}
            </div>

            {/* RIGHT SIDE: INFO (CASE STUDY) */}
            <div className="w-full md:w-2/5 h-[60%] md:h-full flex flex-col bg-brand-card/95 backdrop-blur-xl">
              <div className="p-6 md:p-8 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2 mb-3">
                   <Badge className="bg-brand-orange text-white border-transparent">{selectedItem.category_type === 'digital' ? 'Software Development' : 'Hardware Installation'}</Badge>
                   {selectedItem.platform && <Badge>{selectedItem.platform.toUpperCase()}</Badge>}
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">{selectedItem.title}</h3>
                
                {selectedItem.tech_stack && (
                   <div className="flex flex-wrap gap-2 mt-4">
                      {selectedItem.tech_stack.map((t, i) => (
                         <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-white/10 text-brand-orange border border-brand-orange/20">{t}</span>
                      ))}
                   </div>
                )}
              </div>

              <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar text-left space-y-6">
                {selectedItem.case_study ? (
                   // CASE STUDY FORMAT (STAR)
                   <>
                      <div>
                         <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-2">The Challenge</h4>
                         <p className="text-gray-300 text-sm leading-relaxed">{selectedItem.case_study.challenge}</p>
                      </div>
                      <div>
                         <h4 className="text-teal-400 font-bold text-xs uppercase tracking-widest mb-2">Our Solution</h4>
                         <p className="text-gray-300 text-sm leading-relaxed">{selectedItem.case_study.solution}</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                         <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> The Result</h4>
                         <p className="text-gray-300 text-sm leading-relaxed">{selectedItem.case_study.result}</p>
                      </div>
                   </>
                ) : (
                   // STANDARD DESCRIPTION
                   <p className="text-gray-300 leading-relaxed text-base whitespace-pre-line">
                      {selectedItem.description || "Belum ada deskripsi detail untuk project ini."}
                   </p>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="p-6 border-t border-white/10 bg-brand-dark/50 shrink-0 flex gap-3">
                 <a 
                    href="https://wa.me/6282325103336" 
                    target="_blank" 
                    rel="noreferrer"
                    // UPDATED: Primary action -> brand-action
                    className="flex-1 flex items-center justify-center py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-lg font-bold transition-all shadow-action hover:shadow-action-strong"
                 >
                    Hubungi Sales
                 </a>
                 {selectedItem.client_url && (
                    <a 
                       href={selectedItem.client_url} 
                       target="_blank" 
                       rel="noreferrer"
                       className="flex-1 flex items-center justify-center py-3 border border-white/20 hover:border-white hover:bg-white/5 text-white rounded-lg font-bold transition-all gap-2"
                    >
                       Visit Live Site <Globe size={16}/>
                    </a>
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
