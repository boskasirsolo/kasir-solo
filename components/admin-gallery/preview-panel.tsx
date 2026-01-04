
import React from 'react';
import { Layers, ChevronRight, Star } from 'lucide-react';

export const PreviewPanel = ({ form, testiForm }: any) => {
    return (
        <div className="w-full h-full bg-black flex items-center justify-center p-8 overflow-hidden relative border-l border-white/5">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            
            <div className="w-full max-w-sm relative z-10">
                <div className="text-center mb-6">
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full border border-white/10">Live Preview</span>
                </div>

                <div className="group relative bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-auto">
                    {/* Image Area */}
                    <div className="relative bg-gray-900 pt-4 px-4 pb-0 border-b border-white/5">
                        <div className="relative rounded-t-xl bg-black border-[4px] border-gray-800 border-b-0 overflow-hidden aspect-[16/10]">
                            {form.imagePreview ? (
                                <img src={form.imagePreview} className="w-full h-full object-cover object-top" />
                            ) : (
                                <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-600 text-xs">No Image</div>
                            )}
                            {(form.galleryImages.length + form.newGalleryFiles.length) > 0 && (
                                <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[9px] text-white flex items-center gap-1 border border-white/10">
                                    <Layers size={8} /> +{form.galleryImages.length + form.newGalleryFiles.length}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col">
                        <div className="flex flex-wrap gap-1 mb-2">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded border border-white/5 ${form.category_type === 'physical' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {form.category_type === 'physical' ? 'HARDWARE' : 'SOFTWARE'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{form.title || 'Judul Project'}</h3>
                        
                        <div className="space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                            {form.cs_challenge && (
                                <p className="text-[10px] text-gray-400 line-clamp-1"><span className="text-red-400 font-bold">Challenge:</span> {form.cs_challenge}</p>
                            )}
                            {form.cs_solution && (
                                <p className="text-[10px] text-gray-400 line-clamp-1"><span className="text-blue-400 font-bold">Solution:</span> {form.cs_solution}</p>
                            )}
                        </div>

                        <div className="flex items-center text-brand-orange text-[10px] font-bold uppercase tracking-widest gap-1 mt-4 pt-3 border-t border-white/5">
                            Lihat Case Study <ChevronRight size={12}/>
                        </div>
                    </div>
                </div>

                {/* Testimonial Preview */}
                {testiForm.hasTestimonial && (
                    <div className="mt-4 bg-brand-dark border border-white/10 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
                        <div className="w-10 h-10 rounded-full border border-brand-orange/30 p-0.5 shrink-0 overflow-hidden">
                            <img src={testiForm.imagePreview || "https://via.placeholder.com/100"} className="w-full h-full rounded-full object-cover bg-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <h5 className="text-xs font-bold text-white">{testiForm.client_name || "Nama Klien"}</h5>
                                <div className="flex text-yellow-500 gap-0.5">{[...Array(5)].map((_,i) => <Star key={i} size={8} fill={i < testiForm.rating ? "currentColor":"none"}/>)}</div>
                            </div>
                            <p className="text-[9px] text-gray-400 italic line-clamp-1">"{testiForm.content || "Isi testimoni..."}"</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
