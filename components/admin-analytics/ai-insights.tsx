
import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, TrendingUp, AlertTriangle, Coffee, Loader2 } from 'lucide-react';
import { SibosAI } from '../../services/ai/sibos';

export const AIInsights = ({ stats }: { stats: any }) => {
    const [insight, setInsight] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generateInsight = async () => {
        if (!stats) return;
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
        if (stats && !insight) generateInsight();
    }, [stats]);

    return (
        <div className="bg-brand-dark/80 border border-brand-orange/30 rounded-3xl p-6 relative overflow-hidden shadow-neon-strong">
            <div className="absolute top-0 right-0 p-8 opacity-5">
                <Sparkles size={150} className="text-brand-orange" />
            </div>
            
            <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange flex items-center justify-center text-white shadow-neon">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">Mata-Mata AI</h3>
                        <p className="text-[10px] text-gray-500 mt-1 font-bold">ANALISA JALUR SUKSES</p>
                    </div>
                </div>
                <button 
                    onClick={generateInsight} 
                    disabled={loading}
                    className="p-2 bg-white/5 hover:bg-brand-orange/20 text-gray-500 hover:text-brand-orange rounded-lg transition-all"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                </button>
            </div>

            {loading ? (
                <div className="py-10 flex flex-col items-center justify-center space-y-4">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-brand-orange rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Sabar Bos, Siboy lagi bedah data...</p>
                </div>
            ) : (
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 leading-relaxed animate-fade-in">
                    <div className="flex items-start gap-4 bg-brand-orange/5 p-4 rounded-2xl border border-brand-orange/10 mb-4">
                        <Coffee size={24} className="text-brand-orange shrink-0 mt-1" />
                        <div className="text-[11px] font-medium italic">
                            {insight || "Gue belum nemu pola aneh hari ini. Tetep fokus jualan!"}
                        </div>
                    </div>
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest text-center mt-4">
                        Powered by SIBOS AI Engine v5.0
                    </p>
                </div>
            )}
        </div>
    );
};
