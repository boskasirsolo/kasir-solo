
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight, MessageCircle, AlertTriangle, Coffee } from 'lucide-react';
import { CalcOption } from './types';
import { SimpleMarkdown } from '../../admin-articles/markdown';

export const SideDrawer = ({ 
    item, 
    onClose,
    serviceName,
    waNumber 
}: { 
    item: CalcOption, 
    onClose: () => void,
    serviceName: string,
    waNumber?: string 
}) => {
    // Lock body scroll when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, []);

    const targetWa = waNumber || "6282325103336";

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex justify-end animate-fade-in">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            
            {/* Panel */}
            <div className="relative w-full max-w-lg bg-brand-dark h-full shadow-2xl flex flex-col border-l border-white/10 animate-slide-in-right">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-brand-card shrink-0">
                    <div>
                        <h4 className="text-brand-orange text-[10px] font-bold uppercase tracking-widest mb-1">Kenapa lo butuh ini?</h4>
                        <h3 className="text-white font-bold text-xl leading-tight">{item.label}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 space-y-8">
                    {item.longDesc ? (
                        <div className="animate-fade-in">
                            <SimpleMarkdown content={item.longDesc} />
                        </div>
                    ) : (
                        <div className="py-20 text-center opacity-30 flex flex-col items-center">
                            <AlertTriangle size={48} className="mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">Detail Strategi Belum Ada</p>
                            <p className="text-xs mt-2 italic">Lagi gue tulis Bos, sabar ya...</p>
                        </div>
                    )}

                    {/* Bottom Founder Note (Dynamic) */}
                    <div className="p-5 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl mt-10">
                        <h5 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                            <Coffee size={16} className="text-brand-orange"/> Founder's Note
                        </h5>
                        <p className="text-gray-400 text-xs leading-relaxed italic">
                            {item.founderNote || `"Gue nggak nambahin fitur cuma buat keren-kerenan. Item ini ada di sini karena gue tau persis rasanya boncos kalo nggak ada kontrol di bagian ini."`}
                        </p>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="p-6 border-t border-white/5 bg-brand-card shrink-0">
                    <a 
                        href={`https://wa.me/${targetWa}?text=Halo Mas Amin, gue mau tanya detail soal modul: *${item.label}*.`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-4 bg-brand-orange text-white font-bold rounded-xl shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-1"
                    >
                        <MessageCircle size={20}/> KONSUL DETAIL KE FOUNDER
                    </a>
                </div>
            </div>
        </div>,
        document.body
    );
};
