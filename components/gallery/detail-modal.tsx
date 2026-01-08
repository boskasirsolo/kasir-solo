
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Globe, MessageCircle, ShieldCheck, Star, CheckCircle2, ArrowLeft, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { Badge } from '../ui';
import { ProjectDetailProps } from './types';
import { optimizeImage } from '../../utils';

export const ProjectDetailView = ({ item, testimonials, onClose, isModal = false }: ProjectDetailProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [item.image_url, ...(item.gallery_images || [])].filter(Boolean);

  const activeTestimonial = testimonials.find(t => 
    item.title.toLowerCase().includes(t.business_name.toLowerCase()) || 
    t.business_name.toLowerCase().includes(item.title.toLowerCase())
  ) || {
    id: 0,
    client_name: "Tim Teknis",
    business_name: "PT MESIN KASIR SOLO",
    content: "Instalasi dan konfigurasi sistem pada project ini telah melalui uji kelayakan standar operasional prosedur (SOP) yang ketat.",
    rating: 5,
    image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=200", 
    is_featured: false
  };

  useEffect(() => {
    if (isModal) {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }
  }, [isModal]);

  const handleNext = () => {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const Wrapper = isModal ? 
    ({children}: any) => createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md transition-opacity" onClick={onClose} />
            {children}
        </div>, document.body
    ) : 
    ({children}: any) => (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 animate-fade-in relative">
             <div className="absolute top-0 left-0 w-full h-full bg-brand-black -z-10"></div>
             {children}
        </div>
    );

  const isVideo = item.type === 'video' && item.video_url;
  const isDigital = item.category_type === 'digital';

  return (
    <Wrapper>
      <div className={`relative w-full max-w-7xl ${isModal ? 'h-[90vh]' : 'min-h-[80vh] md:h-[90vh]'} rounded-2xl bg-brand-dark shadow-2xl border border-white/10 flex flex-col md:flex-row z-[10000] overflow-hidden`}>
        
        <button onClick={onClose} className="absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-full text-white backdrop-blur-sm hover:bg-brand-orange transition-colors border border-white/10 shadow-lg">
          {isModal ? <X size={24} /> : <ArrowLeft size={24} />}
        </button>

        {/* LEFT COLUMN: VISUAL DISPLAY */}
        <div className="w-full md:w-8/12 h-[500px] md:h-full bg-black flex flex-col relative border-b md:border-b-0 md:border-r border-white/10">
           
           {/* IMAGE/VIDEO AREA */}
           <div className="flex-grow relative bg-gray-900 group overflow-hidden">
                {/* 1. SCROLLABLE CONTAINER (Absolute Inset) */}
                <div className={`absolute inset-0 w-full h-full ${!isVideo && isDigital ? 'overflow-y-auto custom-scrollbar bg-gray-900' : 'flex items-center justify-center overflow-hidden'}`}>
                    {isVideo ? (
                        <div className="w-full h-full flex items-center justify-center bg-black">
                            <iframe src={item.video_url} title={item.title} className="w-full aspect-video" allowFullScreen></iframe>
                        </div>
                    ) : (
                        <img 
                            src={optimizeImage(allImages[currentImageIndex], 1200)} 
                            alt={item.title} 
                            className={`w-full ${isDigital ? 'h-auto min-h-full object-cover object-top' : 'h-full object-contain'} transition-all duration-300`} 
                        />
                    )}
                </div>

                {/* 2. CONTROLS OVERLAY (Pointer events handling) */}
                {!isVideo && (
                    <div className="absolute inset-0 pointer-events-none">
                        
                        {/* Nav Buttons */}
                        {allImages.length > 1 && (
                            <>
                                <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-orange p-2 rounded-full text-white backdrop-blur-sm border border-white/10 transition-colors z-20 pointer-events-auto opacity-0 group-hover:opacity-100 md:opacity-100 shadow-lg"><ChevronLeft size={24} /></button>
                                <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-brand-orange p-2 rounded-full text-white backdrop-blur-sm border border-white/10 transition-colors z-20 pointer-events-auto opacity-0 group-hover:opacity-100 md:opacity-100 shadow-lg"><ChevronRight size={24} /></button>
                            </>
                        )}

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
                                <div className="flex gap-2 overflow-x-auto max-w-full p-2 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 pointer-events-auto shadow-2xl custom-scrollbar">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                            className={`relative w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-lg overflow-hidden transition-all border-2 ${
                                                currentImageIndex === idx 
                                                ? 'border-brand-orange opacity-100 scale-105 shadow-neon' 
                                                : 'border-transparent opacity-50 hover:opacity-100 hover:border-white/30 grayscale hover:grayscale-0'
                                            }`}
                                        >
                                            <img src={optimizeImage(img, 100)} className="w-full h-full object-cover" alt={`thumb-${idx}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Counter Badge */}
                        {allImages.length > 1 && (
                            <div className="absolute top-4 left-4 bg-black/60 px-3 py-1 rounded-full text-xs text-white font-bold backdrop-blur-sm border border-white/10 flex items-center gap-2 z-20 pointer-events-auto">
                                <Layers size={12} className="text-brand-orange"/>
                                {currentImageIndex + 1} / {allImages.length}
                            </div>
                        )}
                    </div>
                )}
           </div>

           {/* BOTTOM ACTION BAR (CTA) */}
           <div className="shrink-0 bg-brand-dark border-t border-white/10 h-auto md:h-40 flex flex-col md:flex-row relative z-20">
               <div className="flex-1 p-5 flex items-center border-b md:border-b-0 md:border-r border-white/10">
                   {activeTestimonial && (
                      <div className="flex gap-5 items-center w-full animate-fade-in">
                          <div className="w-16 h-16 rounded-full border-2 border-brand-orange/30 p-0.5 shrink-0 shadow-neon">
                              <img src={optimizeImage(activeTestimonial.image_url || '', 100)} className="w-full h-full rounded-full object-cover" alt={activeTestimonial.client_name} />
                          </div>
                          <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-1">
                                  <h5 className="font-bold text-white text-base flex items-center gap-1">
                                     {activeTestimonial.client_name}
                                     {activeTestimonial.id === 0 && <ShieldCheck size={14} className="text-blue-400" />}
                                  </h5>
                                  <div className="flex text-yellow-500 gap-0.5">
                                      {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < activeTestimonial.rating ? "currentColor" : "none"} />)}
                                  </div>
                              </div>
                              <p className="text-brand-orange text-xs font-bold uppercase tracking-wider mb-2">{activeTestimonial.business_name}</p>
                              <p className="text-gray-300 text-sm md:text-base italic leading-relaxed line-clamp-2">"{activeTestimonial.content}"</p>
                          </div>
                      </div>
                   )}
               </div>
               <div className="w-full md:w-64 p-5 flex flex-col justify-center gap-2 bg-brand-dark/50">
                    <a href="https://wa.me/6282325103336" target="_blank" rel="noreferrer" className="w-full flex items-center justify-center py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-lg font-bold transition-all shadow-action hover:shadow-action-strong gap-2 text-xs">
                         <MessageCircle size={16} /> Hubungi Sales
                    </a>
                    {item.client_url && (
                         <a href={item.client_url} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center py-3 border border-brand-orange text-white hover:bg-brand-orange rounded-lg font-bold transition-all gap-2 text-xs">
                            <Globe size={16}/> Visit Project
                         </a>
                    )}
               </div>
           </div>
        </div>

        {/* RIGHT COLUMN: TEXT CONTENT */}
        <div className="w-full md:w-4/12 bg-brand-card flex flex-col relative z-20 md:h-full md:overflow-hidden">
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

          <div className="p-6 md:p-8 flex-grow md:overflow-y-auto custom-scrollbar text-left space-y-8">
            {item.case_study ? (
               <>
                  <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                     <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                        <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center font-bold text-xs">1</div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">The Challenge</h4>
                     </div>
                     <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-white/5 hover:border-red-500/50 transition-colors">{item.case_study.challenge}</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                     <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-xs">2</div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest">Our Solution</h4>
                     </div>
                     <p className="text-gray-300 leading-relaxed text-sm md:text-base pl-8 border-l-2 border-white/5 hover:border-blue-500/50 transition-colors">{item.case_study.solution}</p>
                  </div>
                  <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
                     <div className="bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20 hover:bg-brand-orange/10 transition-colors">
                        <div className="flex items-center gap-2 mb-3">
                            <CheckCircle2 size={18} className="text-brand-orange"/>
                            <h4 className="text-white font-bold text-sm uppercase tracking-widest">The Result</h4>
                        </div>
                        <p className="text-gray-200 leading-relaxed text-sm md:text-base">{item.case_study.result}</p>
                     </div>
                  </div>
               </>
            ) : (
               <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                  {item.description || "Belum ada deskripsi detail untuk project ini."}
               </div>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export const ProjectDetailModal = (props: any) => <ProjectDetailView {...props} isModal={true} />;
