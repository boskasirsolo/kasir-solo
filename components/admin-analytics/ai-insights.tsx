
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, Zap, TrendingUp, X, Coffee, Loader2, Radar, ShieldAlert, Terminal } from 'lucide-react';
import { SibosAI } from '../../services/ai/sibos';
import { SimpleMarkdown } from '../admin-articles/markdown';

export const AIInsights = ({ stats }: { stats: any }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const generateInsight = async () => {
        if (!stats || loading) return;
        setLoading(true);
        try {
            const res = await SibosAI.getQuickInsight(stats);
            setInsight(res || "Lagi gak ada ide Bos, coba refresh.");
        } catch (e) {
            setInsight("Error pas lagi mikir. Server Gemini mungkin lagi ngopi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Cuma generate kalau modal kebuka DAN belum ada insight sebelumnya
        if (stats && !insight && isOpen) {
            generateInsight();
        }
    }, [isOpen]); // Dependency cuma isOpen biar gak re-trigger tiap stats update (bikin kedip)

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-lg text-[10px] font-black text-brand-orange hover:bg-brand-orange hover:text-white transition-all shadow-lg group active:scale-95"
            >
                <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                MATA-MATA AI
            </button>

            {/* Render Portal Langsung di sini, jangan pake fungsi internal biar gak kedip (Re-mount bug) */}
            {isOpen && createPortal(
                <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div className="bg-brand-dark border border-brand-orange/30 rounded-3xl w-full max-w-2xl shadow-[0_0_50px_rgba(255,95,31,0.2)] overflow-hidden flex flex-col max-h-[85vh]">
                        
                        {/* Modal Header */}
                        <div className="p-5 border-b border-white/10 bg-brand-card flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange">
                                    <Radar size={20} className={loading ? "animate-spin" : "animate-pulse"} />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">Intelligence Report</h3>
                                    <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">Analisa Jalur Sukses SIBOS</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)} 
                                className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-full transition-all"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/20">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                                    <div className="relative">
                                        <Loader2 size={48} className="text-brand-orange animate-spin" />
                                        <Zap size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
                                    </div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] animate-pulse text-center">Siboy lagi nyadap trafik lo...</p>
                                </div>
                            ) : (
                                <div className="animate-fade-in">
                                    <div className="flex items-start gap-5 bg-brand-orange/5 p-6 rounded-2xl border border-brand-orange/20 mb-6 shadow-inner">
                                        <div className="p-3 bg-brand-orange/10 rounded-2xl text-brand-orange shrink-0">
                                            <Coffee size={32} />
                                        </div>
                                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed italic">
                                            <SimpleMarkdown content={insight || "Gue belum nemu pola aneh hari ini. Tetep fokus jualan!"} />
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                            <p className="text-[9px] text-gray-600 font-black uppercase mb-1">Status Enkripsi</p>
                                            <p className="text-[10px] text-green-500 font-bold flex items-center gap-1"><ShieldAlert size={10}/> END-TO-END SECURE</p>
                                        </div>
                                        <div className="p-4 bg-black/40 rounded-xl border border-white/5">
                                            <p className="text-[9px] text-gray-600 font-black uppercase mb-1">AI Engine</p>
                                            <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1"><Terminal size={10}/> GEMINI 1.5 PRO</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 bg-brand-dark border-t border-white/5 flex justify-center items-center shrink-0">
                            <p className="text-[8px] text-gray-700 font-black uppercase tracking-[0.4em]">Proprietary Intelligence System // PT MKS</p>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};
