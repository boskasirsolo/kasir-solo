
import React from 'react';
import { Sparkles, X, Radar, Zap } from 'lucide-react';
import { SimpleMarkdown } from '../../admin-articles/markdown';

export const BriefingRoom = ({ insight, onClear }: { insight: string | null, onClear: () => void }) => {
    if (!insight) return (
        <div className="px-1 mb-6">
            <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-brand-orange shrink-0">
                    <Radar size={24} className="animate-pulse" />
                </div>
                <div className="flex-1">
                    <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-1">Status Radar: Aktif</p>
                    <p className="text-xs text-gray-500 font-medium">SIBOS AI sedang memantau gerak-gerik calon juragan di website. Alert akan muncul di sini jika ada target potensial.</p>
                </div>
                <Zap size={14} className="text-gray-700" />
            </div>
        </div>
    );

    return (
        <div className="mx-1 bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-3xl relative animate-fade-in shadow-neon-text/5 mb-6">
            <button onClick={onClear} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={18}/></button>
            <div className="flex items-center gap-3 mb-4">
                <span className="p-2 bg-brand-orange/10 rounded-xl border border-brand-orange/30"><Sparkles className="text-brand-orange" size={20} /></span>
                <h3 className="text-white font-black text-sm uppercase tracking-widest">Briefing Strategi SIBOS</h3>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
                <SimpleMarkdown content={insight} />
            </div>
        </div>
    );
};
