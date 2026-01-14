
import React from 'react';
import { Sparkles, MapPin, Rocket, Check, X, Send } from 'lucide-react';
import { Button } from '../ui';
import { AITargetSuggestion } from './types';

export const AISuggestionsPanel = ({ 
    suggestions, 
    onPublish, 
    onClear,
    loading 
}: { 
    suggestions: AITargetSuggestion[], 
    onPublish: () => void, 
    onClear: () => void,
    loading: boolean 
}) => {
    if (suggestions.length === 0) return null;

    return (
        <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-6 mt-8 animate-fade-in shadow-neon-text/5">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-brand-orange rounded-lg text-white">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-sm">Hasil Riset AI</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target Wilayah Potensial</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={onClear} className="p-2 text-gray-500 hover:text-white transition-colors"><X size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {suggestions.map((s, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/5 p-4 rounded-xl relative group">
                        <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${s.type === 'Kandang' ? 'bg-brand-orange' : 'bg-blue-400'}`}></div>
                        <h4 className="text-white font-bold text-xs mb-1">{s.name}</h4>
                        <p className="text-[9px] text-gray-500 font-mono mb-2">/{s.slug}</p>
                        <p className="text-[10px] text-gray-400 leading-relaxed italic">"{s.reason}"</p>
                    </div>
                ))}
            </div>

            <Button onClick={onPublish} disabled={loading} className="w-full py-4 shadow-neon">
                {loading ? 'MEMPROSES...' : <><Send size={18}/> TERBITKAN SEMUA HALAMAN (AUTO-GENERATE)</>}
            </Button>
        </div>
    );
};
