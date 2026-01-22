
import React, { useState, useEffect } from 'react';
import { Wand2, RefreshCw, MessageSquare, FileType, Search, Target, MapPin, Sparkles, Loader2, ArrowLeft, BarChart, Layout, Link2, CheckSquare, Square, ChevronDown } from 'lucide-react';
import { LinkingModule, TagModule, PersonaModule } from './editor/molecules';
import { EditorCard, SectionLabel, ActionPill } from './editor/atoms';
import { Button, LoadingSpinner } from '../ui';

// --- ATOMIC COMPONENT: PILLAR SELECTOR ---
const PillarSelector = ({ 
    pillars, 
    selectedIds, 
    onToggle, 
    mode = 'single', 
    search, 
    onSearch 
}: any) => (
    <div className="bg-black/40 border border-white/5 rounded-xl p-3">
        <div className="relative mb-2">
            <Search size={12} className="absolute left-2 top-2 text-gray-500" />
            <input 
                value={search} 
                onChange={(e) => onSearch(e.target.value)} 
                placeholder="Cari judul pillar..." 
                className="w-full bg-black/40 border border-white/10 rounded-lg pl-7 pr-2 py-1.5 text-[10px] text-white focus:border-brand-orange outline-none" 
            />
        </div>

        <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1">
            {pillars.length === 0 ? (
                <div className="text-[9px] text-gray-500 text-center py-2 italic">Belum ada artikel Pillar lain.</div>
            ) : (
                pillars.map((p: any) => {
                    const isSelected = mode === 'single' 
                        ? selectedIds[0] === p.id 
                        : selectedIds.includes(p.id);
                    
                    return (
                        <button 
                            key={p.id} 
                            onClick={(e) => { e.stopPropagation(); onToggle(p.id); }} 
                            className={`w-full text-left p-2 rounded text-[9px] border transition-all flex items-center justify-between group ${
                                isSelected 
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' 
                                : 'bg-transparent border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            <span className="truncate flex-1">{p.title}</span>
                            {isSelected ? <CheckSquare size={12} /> : <Square size={12} className="opacity-30 group-hover:opacity-100"/>}
                        </button>
                    );
                })
            )}
        </div>
    </div>
);

// --- COMPONENT: CLUSTER CONFIG ---
const ClusterConfig = ({ pillars, selectedPillarId, onSelectPillar, search, onSearch }: any) => (
    <div className="mt-2 animate-fade-in">
        <p className="text-[9px] text-gray-400 mb-3 leading-relaxed">
            Artikel Cluster berfungsi memperkuat SEO Pillar. AI akan otomatis membuat link balik ke artikel induk ini.
        </p>
        <PillarSelector 
            pillars={pillars}
            selectedIds={[selectedPillarId]}
            onToggle={(id: number) => onSelectPillar(id)}
            mode="single"
            search={search}
            onSearch={onSearch}
        />
    </div>
);

// --- COMPONENT: PILLAR CONFIG ---
const PillarConfig = ({ pillars, selectedRelatedIds, onToggleRelated, search, onSearch }: any) => (
    <div className="mt-2 animate-fade-in">
        <p className="text-[9px] text-gray-400 leading-relaxed mb-3">
            Artikel ini adalah fondasi utama (Ultimate Guide). Pilih Pillar lain yang relevan untuk **Cross-Linking**.
        </p>
        <PillarSelector 
            pillars={pillars}
            selectedIds={selectedRelatedIds || []}
            onToggle={onToggleRelated}
            mode="multi"
            search={search}
            onSearch={onSearch}
        />
    </div>
);

export const EditorPanel = ({ form, setForm, loading, aiState, actions, availablePillars }: any) => {
    const [catInput, setCatInput] = useState('');
    const [pillarSearch, setPillarSearch] = useState('');
    const [researchTopicInput, setResearchTopicInput] = useState('');
    const [useCityTemplate, setUseCityTemplate] = useState(false);
    
    const [activeAccordion, setActiveAccordion] = useState<string | null>(form.type);

    useEffect(() => {
        if (form.type) setActiveAccordion(form.type);
    }, [form.id]);

    const selectedCats = form.category ? form.category.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const addCat = (c: string) => { if (c && !selectedCats.includes(c)) setForm((p:any) => ({...p, category: [...selectedCats, c].join(', ')})); setCatInput(''); };
    const remCat = (c: string) => setForm((p:any) => ({...p, category: selectedCats.filter(x => x !== c).join(', ')}));

    const filteredPillars = availablePillars.filter((p:any) => 
        p.title.toLowerCase().includes(pillarSearch.toLowerCase()) && p.id !== form.id
    );

    const handleRelatedToggle = (id: number) => {
        const current = form.related_pillars || [];
        if (current.includes(id)) {
            setForm((p: any) => ({ ...p, related_pillars: current.filter((x: number) => x !== id) }));
        } else {
            setForm((p: any) => ({ ...p, related_pillars: [...current, id] }));
        }
    };

    const toggleAccordion = (type: string) => {
        setForm((p:any) => ({...p, type: type}));
        setActiveAccordion(prev => prev === type ? null : type);
    };

    if (loading.researching) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-8 items-center justify-center text-center">
                <div className="relative mb-8">
                    <Loader2 size={48} className="text-brand-orange animate-spin" />
                    <Sparkles size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-pulse" />
                </div>
                <h3 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-4">Scanning Market...</h3>
                <p className="text-gray-500 text-xs italic leading-relaxed px-4">
                    {loading.progressMessage || "SIBOS lagi ngebongkar pola keyword yang volumenya gurih..."}
                </p>
            </div>
        );
    }

    if (aiState.step === 0 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4 items-center justify-center text-center overflow-y-auto custom-scrollbar pb-32">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] shrink-0"><Search size={32} className="text-blue-400" /></div>
                <h3 className="text-white font-bold text-lg mb-2">Riset Judul Viral</h3>
                <p className="text-gray-500 text-xs max-w-[220px] mb-6 leading-relaxed">Tentukan jenis artikel, lalu AI akan mencari topik volume tertinggi.</p>
                
                <div className="w-full max-w-[250px] mb-6 text-left">
                    <SectionLabel icon={Layout}>Tipe Strategi SEO</SectionLabel>
                    <div className="flex gap-2">
                        <ActionPill active={form.type === 'pillar'} onClick={() => setForm((p:any) => ({...p, type: 'pillar'}))} label="Pillar" color="yellow-500" />
                        <ActionPill active={form.type === 'cluster'} onClick={() => setForm((p:any) => ({...p, type: 'cluster'}))} label="Cluster" color="blue-500" />
                    </div>
                </div>

                <div className="w-full max-w-[250px] mb-4 text-left bg-black/30 p-3 rounded-xl border border-white/5">
                    <label className="flex items-center justify-between cursor-pointer group"><span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-2 group-hover:text-brand-orange"><MapPin size={12} /> Target Wilayah</span><input type="checkbox" checked={useCityTemplate} onChange={(e) => setUseCityTemplate(e.target.checked)} className="accent-brand-orange w-4 h-4"/></label>
                    {useCityTemplate && (<div className="mt-2 animate-fade-in"><select value={form.targetCityId} onChange={(e) => setForm((p:any) => ({...p, targetCityId: parseInt(e.target.value), title: `Jual Paket Mesin Kasir di ${aiState.cities.find((c:any) => c.id === parseInt(e.target.value))?.name} - Lengkap`}))} className="w-full bg-brand-dark text-white text-[10px] p-2 rounded border border-brand-orange/30 outline-none"><option value={0}>-- Pilih Kota --</option>{aiState.cities?.map((city: any) => (<option key={city.id} value={city.id}>{city.name}</option>))}</select></div>)}
                </div>
                
                {!useCityTemplate && (<div className="w-full max-w-[250px] mb-4 text-left"><SectionLabel icon={Target}>Topik Spesifik</SectionLabel><input type="text" value={researchTopicInput} onChange={(e) => setResearchTopicInput(e.target.value)} placeholder="Contoh: Pajak, Stok..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange" /></div>)}
                
                <Button onClick={() => useCityTemplate ? aiState.setStep(2) : actions.researchTitles ? actions.researchTitles(researchTopicInput) : actions.runResearch(researchTopicInput)} disabled={loading.researching} className="w-full max-w-[250px] py-3 shadow-neon">{loading.researching ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16}/> {useCityTemplate ? 'GUNAKAN TEMPLATE' : 'RISET MARKET'}</>}</Button>
            </div>
        );
    }

    if (aiState.step === 1 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4 animate-fade-in">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                        <button onClick={() => aiState.setStep(0)} className="p-1 hover:bg-white/10 rounded transition-colors">
                            <ArrowLeft size={16} className="text-gray-400"/>
                        </button>
                        <h3 className="text-white font-bold text-sm uppercase tracking-widest">Rekomendasi Judul</h3>
                    </div>
                    {form.pillar_id && (
                        <span className="text-[8px] font-black text-brand-orange bg-brand-orange/10 px-2 py-1 rounded border border-brand-orange/20 uppercase tracking-tighter">Cluster Mode</span>
                    )}
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pb-32">
                    {aiState.keywords.length === 0 ? (
                        <div className="text-center py-20 opacity-30 italic text-xs">Gak ada keyword yang cocok, Bos.</div>
                    ) : (
                        aiState.keywords.map((k: any, i: number) => (
                            <div 
                                key={i} 
                                onClick={() => actions.selectTopic(k)} 
                                className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/50 hover:bg-brand-orange/5 cursor-pointer transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Sparkles size={12} className="text-brand-orange" />
                                </div>
                                <h4 className="text-xs font-bold text-white mb-2 leading-snug group-hover:text-brand-orange transition-colors">{k.keyword}</h4>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] px-2 py-0.5 rounded border border-green-500/20 text-green-400 flex items-center gap-1 font-mono">
                                        <BarChart size={8} /> {k.volume}
                                    </span>
                                    <span className={`text-[8px] font-black uppercase tracking-widest ${k.competition === 'Low' ? 'text-green-500' : 'text-yellow-500'}`}>
                                        Comp: {k.competition}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-brand-dark z-20 shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi AI</h3>
                <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /> Reset</button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5 pb-32">
                
                <div className="space-y-2">
                    <SectionLabel icon={Layout}>Arsitektur Konten</SectionLabel>
                    
                    <div className={`border rounded-xl transition-all overflow-hidden ${form.type === 'pillar' ? 'bg-yellow-500/5 border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.05)]' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                        <button 
                            onClick={() => toggleAccordion('pillar')}
                            className="w-full flex items-center justify-between p-4 text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-all ${form.type === 'pillar' ? 'bg-yellow-500 text-white shadow-neon' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'}`}>
                                    <Layout size={16} />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest transition-colors ${form.type === 'pillar' ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>Mode Pillar</h4>
                                    <p className="text-[9px] text-gray-600 uppercase font-bold">Authority & Master Guide</p>
                                </div>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeAccordion === 'pillar' ? 'rotate-180 text-yellow-500' : 'text-gray-700'}`} />
                        </button>
                        
                        {activeAccordion === 'pillar' && (
                            <div className="px-4 pb-4">
                                <PillarConfig 
                                    pillars={filteredPillars}
                                    selectedRelatedIds={form.related_pillars}
                                    onToggleRelated={handleRelatedToggle}
                                    search={pillarSearch}
                                    onSearch={setPillarSearch}
                                />
                            </div>
                        )}
                    </div>

                    <div className={`border rounded-xl transition-all overflow-hidden ${form.type === 'cluster' ? 'bg-blue-500/5 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.05)]' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
                        <button 
                            onClick={() => toggleAccordion('cluster')}
                            className="w-full flex items-center justify-between p-4 text-left group"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg transition-all ${form.type === 'cluster' ? 'bg-blue-500 text-white shadow-neon' : 'bg-white/5 text-gray-500 group-hover:text-gray-300'}`}>
                                    <Link2 size={16} />
                                </div>
                                <div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest transition-colors ${form.type === 'cluster' ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>Mode Cluster</h4>
                                    <p className="text-[9px] text-gray-600 uppercase font-bold">Deep Dive & Link Juice</p>
                                </div>
                            </div>
                            <ChevronDown size={14} className={`transition-transform duration-300 ${activeAccordion === 'cluster' ? 'rotate-180 text-blue-400' : 'text-gray-700'}`} />
                        </button>
                        
                        {activeAccordion === 'cluster' && (
                            <div className="px-4 pb-4">
                                <ClusterConfig 
                                    pillars={filteredPillars}
                                    selectedPillarId={form.pillar_id}
                                    onSelectPillar={(id: number) => setForm((p:any) => ({...p, pillar_id: id}))}
                                    search={pillarSearch}
                                    onSearch={setPillarSearch}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <EditorCard>
                    <SectionLabel icon={MessageSquare}>Konteks Tambahan</SectionLabel>
                    <textarea value={form.generationContext} onChange={(e) => setForm((p:any) => ({...p, generationContext: e.target.value}))} placeholder="Instruksi khusus buat AI..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-brand-orange h-24 resize-none" />
                </EditorCard>
                
                <TagModule selected={selectedCats} input={catInput} onInputChange={setCatInput} onAdd={addCat} onRemove={remCat} />
                
                <EditorCard>
                    <div className="flex justify-between items-center mb-2">
                        <SectionLabel icon={FileType} className="mb-0">Target Panjang</SectionLabel>
                        <span className="text-brand-orange text-[10px] font-bold">{form.targetWordCount} Kata</span>
                    </div>
                    <input 
                        type="range" 
                        min={form.type === 'pillar' ? "1500" : "600"} 
                        max="6000" 
                        step="100" 
                        value={form.targetWordCount} 
                        onChange={(e) => setForm((p:any) => ({...p, targetWordCount: parseInt(e.target.value)}))} 
                        className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                    />
                    <div className="flex justify-between text-[8px] text-gray-600 mt-1">
                        <span>{form.type === 'pillar' ? '1.5k' : '600'}</span>
                        <span>6k</span>
                    </div>
                </EditorCard>
                
                <PersonaModule selected={aiState.selectedTones} onToggle={(id:string) => aiState.setSelectedTones(aiState.selectedTones.includes(id) ? aiState.selectedTones.filter((x:any)=>x!==id) : [...aiState.selectedTones, id].slice(-3))} />
            </div>
        </div>
    );
};
