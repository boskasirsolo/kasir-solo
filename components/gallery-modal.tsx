
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe, MessageCircle, ShieldCheck, Star, CheckCircle2 } from 'lucide-react';
import { GalleryItem, Testimonial } from '../types';
import { Badge } from './ui';

interface ProjectDetailModalProps {
  item: GalleryItem;
  testimonials: Testimonial[];
  onClose: () => void;
}

export const ProjectDetailModal = ({ item, testimonials, onClose }: ProjectDetailModalProps) => {
  
  // Logic: Find related testimonial or use DEFAULT Fallback Layout
  const activeTestimonial = testimonials.find(t => 
    item.title.toLowerCase().includes(t.business_name.toLowerCase()) || 
    t.business_name.toLowerCase().includes(item.title.toLowerCase())
  ) || {
    // FALLBACK OBJECT (Visual Placeholder)
    id: 0,
    client_name: "Tim Teknis",
    business_name: "PT MESIN KASIR SOLO",
    content: "Instalasi dan konfigurasi sistem pada project ini telah melalui uji kelayakan standar operasional prosedur (SOP) yang ketat.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200", 
    is_featured: false
  };

  // Body lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-7xl h-[90vh] rounded-2xl bg-brand-dark shadow-2xl border border-white/10 animate-fade-in flex flex-col md:flex-row z-[10000] overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm hover:bg-brand-orange transition-colors">
          <X size={24} />
        </button>

        {/* =========================================================
            LEFT COLUMN (65%): IMAGE + FOOTER (TESTIMONIAL + BUTTONS)
           ========================================================= */}
        <div className="w-full md:w-8/12 h-[55%] md:h-full bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-white/10">
           
           {/* 1. IMAGE DISPLAY (Flex Grow) */}
           <div className="flex-grow relative overflow-hidden bg-gray-900 group">
              {item.category_type === 'digital' ? (
                 <div className="w-full h-full overflow-y-auto custom-scrollbar">
                    <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full min-h-full object-cover object-top" 
                    />
                 </div>
              ) : (
                 item.type === 'video' && item.video_url ? (
                    <div className="w-full h-full flex items-center justify-center bg-black">
                        <iframe src={item.video_url} title={item.title} className="w-full aspect-video" allowFullScreen></iframe>
                    </div>
                 ) : (
                    <div className="w-full h-full flex items-center justify-center p-4">
                        <img src={item.image_url} alt={item.title} className="max-w-full max-h-full object-contain" />
                    </div>
                 )
              )}
           </div>

           {/* 2. BOTTOM BAR (Footer) - COMPACT FIXED HEIGHT */}
           <div className="shrink-0 bg-brand-dark border-t border-white/10 h-auto md:h-40 flex flex-col md:flex-row">
               
               {/* TESTIMONIAL SECTION */}
               <div className="flex-1 p-5 flex items-center border-b md:border-b-0 md:border-r border-white/10">
                   {activeTestimonial && (
                      <div className="flex gap-5 items-center w-full animate-fade-in">
                          <div className="w-16 h-16 rounded-full border-2 border-brand-orange/30 p-0.5 shrink-0 shadow-neon">
                              <img src={activeTestimonial.image_url} className="w-full h-full rounded-full object-cover" alt={activeTestimonial.client_name} />
                          </div>
                          
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

               {/* ACTION BUTTONS */}
               <div className="w-full md:w-64 p-5 flex flex-col justify-center gap-2 bg-brand-dark/50">
                    <a 
                         href="https://wa.me/6282325103336" 
                         target="_blank" 
                         rel="noreferrer"
                         className="w-full flex items-center justify-center py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-lg font-bold transition-all shadow-action hover:shadow-action-strong gap-2 text-xs"
                    >
                         <MessageCircle size={16} /> Hubungi Sales
                    </a>
                    {item.client_url && (
                         <a 
                            href={item.client_url} 
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
               <Badge className="bg-brand-orange text-white border-transparent">{item.category_type === 'digital' ? 'Software' : 'Hardware'}</Badge>
               {item.platform && <Badge className="bg-white/10 text-gray-300 border-white/20">{item.platform.toUpperCase()}</Badge>}
            </div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-4">{item.title}</h3>
            
            {item.tech_stack && (
               <div className="flex flex-wrap gap-2">
                  {item.tech_stack.map((t, i) => (
                     <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-black/40 text-brand-orange border border-brand-orange/20">{t}</span>
                  ))}
               </div>
            )}
          </div>

          {/* BODY (Scrollable) */}
          <div className="p-6 md:p-8 flex-grow overflow-y-auto custom-scrollbar text-left space-y-8">
            {item.case_study ? (
               // CASE STUDY FORMAT (STAR METHOD)
               <>
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                     <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">1</div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">The Challenge</h4>
                     </div>
                     <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-white/5 hover:border-red-500/50 transition-colors">
                        {item.case_study.challenge}
                     </p>
                  </div>

                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                     <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">2</div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Our Solution</h4>
                     </div>
                     <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-white/5 hover:border-blue-500/50 transition-colors">
                        {item.case_study.solution}
                     </p>
                  </div>

                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                     <div className="bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20 hover:bg-brand-orange/10 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={18} className="text-brand-orange"/>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest">The Result</h4>
                        </div>
                        <p className="text-gray-200 leading-relaxed text-sm md:text-base">
                            {item.case_study.result}
                        </p>
                     </div>
                  </div>
               </>
            ) : (
               // STANDARD DESCRIPTION
               <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                  {item.description || "Belum ada deskripsi detail untuk project ini."}
               </div>
            )}
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
