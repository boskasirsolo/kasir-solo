import React from 'react';
import { Sparkles, X } from 'lucide-react';
import { SimpleMarkdown } from '../../admin-articles/markdown';

export const BriefingRoom = ({ insight, onClear }: { insight: string | null, onClear: () => void }) => {
    // Jika tidak ada insight, jangan tampilkan apa-apa (komponen radar dicoret silang oleh user)
    if (!insight) return null;

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