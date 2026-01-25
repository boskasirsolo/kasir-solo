
import React, { useState } from 'react';
import { Search, MapPin, Sparkles, Loader2, BarChart3, TrendingUp, Target, Lightbulb, ArrowRight, Zap, Info, Brain } from 'lucide-react';
import { Input, Button, LoadingSpinner } from '../ui';
import { SEOAI } from '../../services/ai/seo';
import { SimpleMarkdown } from '../admin-articles/markdown';

export const SEOIntelligencePanel = ({ state, setters, actions }: any) => {
    const { intelSearch, intelRegion, keywordResults, isIntelLoading, selectedIntel } = state.intelligence;
    const [intentAnalysis, setIntentAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const runIntentAnalysis = async () => {
        if (!selectedIntel) return;
        setIsAnalyzing(true);
        try {
            const res = await SEOAI.analyzeIntent(selectedIntel.keyword);
            setIntentAnalysis(res);
        } catch (e) {
            alert("Gagal membedah otak user.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-full min-h-[700px]">
            
            {/* LEFT: SEARCH & RESULTS */}
            <div className="lg:col-span-5 bg-brand-dark border border-white/5 rounded-2xl flex flex-col overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-black/20 space-y-4">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Target size={18} className="text-brand-orange" /> Keyword Laboratory
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-3 text-gray-500" />
                            <Input 
                                value={intelSearch}
                                onChange={(e: any) => setters.setIntelSearch(e.target.value)}
                                placeholder="Topik (Cth: Kasir Cafe)"
                                className="pl-9 bg-black/40 text-xs"
                            />
                        </div>
                        <div className="relative">
                            <MapPin size={14} className="absolute left-3 top-3 text-gray-500" />
                            <Input 
                                value={intelRegion}
                                onChange={(e: any) => setters.setIntelRegion(e.target.value)}
                                placeholder="Lokasi (Cth: Solo)"
                                className="pl-9 bg-black/40 text-xs"
                            />
                        </div>
                    </div>
                    <Button 
                        onClick={actions.runIntelResearch} 
                        disabled={isIntelLoading || !intelSearch}
                        className="w-full py-3 shadow-neon"
                    >
                        {isIntelLoading ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16}/> BEDAH KEYWORD VIRAL</>}
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 bg-black/10">
                    {keywordResults.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                            <BarChart3 size={48} className="mb-4" />
                            <p className="text-xs">Data intel belum ditarik. Masukkan topik di atas.</p>
                        </div>
                    ) : (
                        keywordResults.map((k: any, i: number) => (
                            <div 
                                key={i} 
                                onClick={() => { setters.setSelectedIntel(k); setIntentAnalysis(null); }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all group flex items-center justify-between ${selectedIntel?.keyword === k.keyword ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/5' : 'bg-brand-card/60 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex-1 min-w-0 mr-4">
                                    <h5 className={`text-sm font-bold truncate ${selectedIntel?.keyword === k.keyword ? 'text-white' : 'text-gray-300'}`}>{k.keyword}</h5>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${k.intent === 'Transactional' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'}`}>{k.intent}</span>
                                        <span className="text-[8px] text-gray-500 font-mono">DIF: {k.difficulty}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] text-gray-500 uppercase font-black">ROI Score</p>
                                    <p className="text-lg font-display font-black text-brand-orange">{k.potensi_cuan}/10</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* RIGHT: DEEP ANALYSIS */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                {!selectedIntel ? (
                    <div className="h-full bg-brand-card/30 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center p-12 text-center">
                         <Zap size={64} className="text-gray-700 mb-6 opacity-20" />
                         <h4 className="text-gray-600 font-black uppercase tracking-widest text-lg">Pilih Keyword buat Dianalisa</h4>
                         <p className="text-gray-700 text-sm mt-2">SIBOS AI bakal bedah strategi konten yang pas buat keyword itu.</p>
                    </div>
                ) : (
                    <div className="bg-brand-card border border-white/10 rounded-3xl p-8 shadow-2xl animate-fade-in h-full flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Lightbulb size={120} /></div>
                        
                        <div className="flex justify-between items-start mb-8 border-b border-white/5 pb-6 shrink-0">
                            <div>
                                <span className="text-brand-orange font-black text-[10px] uppercase tracking-[0.3em] bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/30">Strategic Intel</span>
                                <h3 className="text-2xl md:text-3xl font-display font-black text-white mt-4">{selectedIntel.keyword}</h3>
                            </div>
                            <button 
                                onClick={runIntentAnalysis}
                                disabled={isAnalyzing}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase shadow-neon animate-pulse disabled:opacity-50"
                            >
                                {isAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Brain size={14}/>}
                                BEDAH NIAT USER
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                            {intentAnalysis ? (
                                <div className="animate-fade-in bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5"><Brain size={100} className="text-blue-400" /></div>
                                    <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><Brain size={14}/> Hasil Psikogram User</h4>
                                    <SimpleMarkdown content={intentAnalysis} />
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 gap-8 mb-10">
                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2"><ArrowRight size={14} className="text-brand-orange"/> Why This Keyword?</h4>
                                            <p className="text-gray-400 text-sm leading-relaxed italic">
                                                "Keyword ini memiliki tingkat konversi tinggi karena menunjukkan masalah spesifik yang dialami oleh pebisnis ${intelRegion}."
                                            </p>
                                        </div>
                                        <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                                            <h4 className="text-green-400 font-bold text-[10px] uppercase tracking-widest mb-3 flex items-center gap-2"><Lightbulb size={12}/> Quick Strategy</h4>
                                            <ul className="space-y-2 text-xs text-gray-300">
                                                <li className="flex gap-2"><span>✅</span> <span>Bikin konten tutorial solusi.</span></li>
                                                <li className="flex gap-2"><span>✅</span> <span>Fokus ke After Sales lokal.</span></li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-6">
                                        <h4 className="text-brand-orange font-bold text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2"><TrendingUp size={14}/> Forecast</h4>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500">Search Intensity</span>
                                                <span className="text-white font-bold">~1.2k Klik/Bln</span>
                                            </div>
                                            <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                                                <div className="bg-brand-orange h-full rounded-full w-[65%] shadow-neon"></div>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-500">Buying Probability</span>
                                                <span className="text-white font-bold">Medium-High</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-white/5 shrink-0">
                            <Button 
                                onClick={() => {
                                    setters.setForm({ ...state.form, name: selectedIntel.keyword, type: 'Ekspansi' });
                                    setters.setModuleSubTab('cities');
                                }}
                                className="w-full py-4 text-[11px] font-black shadow-neon uppercase tracking-widest"
                            >
                                JADIKAN TARGET LANDING PAGE SEKARANG
                            </Button>
                        </div>
                    </div>
                )}
            </div>

        </div>
    );
};
