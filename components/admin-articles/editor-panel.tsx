
import React, { useState } from 'react';
import { Settings, Sparkles, Loader2, Tags, X as XIcon, RefreshCw, ChevronDown, AlignLeft, Image as ImageIcon, Search } from 'lucide-react';
import { ARTICLE_CATEGORIES, NARRATIVE_TONES, RESEARCH_TOPICS } from './types';
import { Article } from '../../types';

export const EditorPanel = ({
    form,
    setForm,
    loading,
    aiState,
    actions,
    availablePillars
}: {
    form: any,
    setForm: any,
    loading: any,
    aiState: any,
    actions: any,
    availablePillars: Article[]
}) => {
    const [catInput, setCatInput] = useState('');
    const [topicInput, setTopicInput] = useState('');

    const addCategory = (cat: string) => {
        if (!cat) return;
        const current = form.category ? form.category.split(',').map((s: any) => s.trim()).filter(Boolean) : [];
        if (!current.includes(cat)) {
            setForm((prev: any) => ({ ...prev, category: [...current, cat].join(', ') }));
        }
        setCatInput('');
    };

    const removeCategory = (cat: string) => {
        const current = form.category ? form.category.split(',').map((s: any) => s.trim()).filter(Boolean) : [];
        const filtered = current.filter((c: string) => c !== cat);
        setForm((prev: any) => ({ ...prev, category: filtered.join(', ') }));
    };

    const selectedCats = form.category ? form.category.split(',').map((s: any) => s.trim()).filter(Boolean) : [];

    const toggleTone = (toneId: string) => {
        const current = aiState.selectedTones || [];
        if (current.includes(toneId)) {
            aiState.setSelectedTones(current.filter((t: string) => t !== toneId));
        } else {
            aiState.setSelectedTones([...current, toneId]);
        }
    };

    const handleRelatedPillarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = parseInt(e.target.value);
        if (!id) return;
        const current = form.related_pillars || [];
        if (!current.includes(id)) {
            setForm((prev: any) => ({ ...prev, related_pillars: [...current, id] }));
        }
    };

    const removeRelatedPillar = (id: number) => {
        setForm((prev: any) => ({ ...prev, related_pillars: prev.related_pillars.filter((pid: number) => pid !== id) }));
    };

    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-y-auto custom-scrollbar p-4 space-y-6">
            
            {/* 1. TOPIC & RESEARCH */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Search size={12}/> Riset & Topik
                </h4>
                <div className="flex gap-2">
                    <input 
                        value={topicInput}
                        onChange={(e) => setTopicInput(e.target.value)}
                        placeholder="Topik spesifik..."
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                    />
                    <button 
                        onClick={() => actions.runResearch(topicInput)}
                        disabled={loading.researching}
                        className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        title="Riset AI"
                    >
                        {loading.researching ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                    </button>
                </div>
                
                {/* Keywords Cloud from AI */}
                {aiState.keywords && aiState.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {aiState.keywords.map((k: any, i: number) => (
                            <button 
                                key={i}
                                onClick={() => actions.selectTopic(k)}
                                className="text-[9px] bg-white/5 hover:bg-brand-orange/20 border border-white/10 hover:border-brand-orange text-gray-300 hover:text-white px-2 py-1 rounded transition-all text-left"
                            >
                                {k.keyword}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. STRUCTURE & TYPE */}
            <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Settings size={12}/> Struktur
                </h4>
                
                {/* Type Selector */}
                <div className="flex bg-black/40 rounded-lg p-1 border border-white/10">
                    <button 
                        onClick={() => setForm((p:any) => ({...p, type: 'pillar'}))}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${form.type === 'pillar' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        Pillar Page
                    </button>
                    <button 
                        onClick={() => setForm((p:any) => ({...p, type: 'cluster'}))}
                        className={`flex-1 py-1.5 rounded text-[10px] font-bold uppercase transition-all ${form.type === 'cluster' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-white'}`}
                    >
                        Cluster Content
                    </button>
                </div>

                {/* Conditional Inputs based on Type */}
                {form.type === 'cluster' && (
                    <div>
                        <label className="text-[9px] text-gray-500 font-bold mb-1 block">Parent Pillar</label>
                        <div className="relative">
                            <select 
                                value={form.pillar_id} 
                                onChange={(e) => setForm((p:any) => ({...p, pillar_id: parseInt(e.target.value)}))}
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none appearance-none"
                            >
                                <option value={0}>-- Pilih Pillar --</option>
                                {availablePillars.map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-3 text-gray-500 pointer-events-none"/>
                        </div>
                    </div>
                )}

                {/* Related Pillars (Inter-linking) */}
                {form.type === 'pillar' && (
                    <div>
                        <label className="text-[9px] text-gray-500 font-bold mb-1 block">Related Pillars (Interlink)</label>
                        <div className="flex flex-wrap gap-1 mb-2">
                            {form.related_pillars && form.related_pillars.map((pid: number) => {
                                const p = availablePillars.find(ap => ap.id === pid);
                                if (!p) return null;
                                return (
                                    <span key={pid} className="bg-white/10 text-gray-300 border border-white/20 rounded px-2 py-1 text-[9px] flex items-center gap-1">
                                        {p.title.substring(0, 15)}...
                                        <button onClick={() => removeRelatedPillar(pid)} className="hover:text-red-400"><XIcon size={8}/></button>
                                    </span>
                                );
                            })}
                        </div>
                        <div className="relative">
                            <select 
                                onChange={handleRelatedPillarChange}
                                value={0}
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none appearance-none"
                            >
                                <option value={0}>+ Add Link</option>
                                {availablePillars.filter(p => p.id !== form.id).map(p => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                            <ChevronDown size={12} className="absolute right-3 top-3 text-gray-500 pointer-events-none"/>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. CATEGORIES (UPDATED WITH MAGIC CAT) */}
            <div className="space-y-3 pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2">
                        <Tags size={10}/> Kategori
                    </label>
                    <button 
                        onClick={actions.runGenerateCategory} 
                        disabled={loading.researching}
                        className="text-[9px] text-blue-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
                    >
                        {loading.researching ? <Loader2 size={10} className="animate-spin"/> : <><Sparkles size={10}/> Magic Cat</>}
                    </button>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[26px]">
                    {selectedCats.map((cat: string, i: number) => (
                        <span key={i} className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded px-2 py-1 text-[9px] font-bold flex items-center gap-1">
                            {cat}
                            <button onClick={() => removeCategory(cat)} className="hover:text-white"><XIcon size={8}/></button>
                        </span>
                    ))}
                </div>
                <div className="relative">
                    <input 
                        list="categories" 
                        value={catInput}
                        onChange={(e) => {
                            setCatInput(e.target.value);
                            // Auto add if matches list exact
                            const match = ARTICLE_CATEGORIES.find(c => c.toLowerCase() === e.target.value.toLowerCase());
                            if (match) {
                                addCategory(match);
                                setCatInput('');
                            }
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                addCategory(catInput);
                            }
                        }}
                        placeholder="+ Tambah Kategori..."
                        className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none"
                    />
                    <datalist id="categories">
                        {ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
            </div>

            {/* 4. WRITING CONFIG */}
            <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <AlignLeft size={12}/> Writing Config
                </h4>
                
                {/* Length Slider */}
                <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                        <span>Target Words</span>
                        <span className="text-white font-bold">{form.targetWordCount}</span>
                    </div>
                    <input 
                        type="range" 
                        min="500" 
                        max="3000" 
                        step="100" 
                        value={form.targetWordCount} 
                        onChange={(e) => setForm((p:any) => ({...p, targetWordCount: parseInt(e.target.value)}))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                    />
                </div>

                {/* Tone Selector */}
                <div>
                    <label className="text-[9px] text-gray-500 font-bold mb-2 block">Narrative Tone</label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {NARRATIVE_TONES.map(tone => (
                            <button
                                key={tone.id}
                                onClick={() => toggleTone(tone.id)}
                                className={`px-2 py-1.5 rounded text-[9px] text-left border transition-all ${
                                    aiState.selectedTones.includes(tone.id)
                                    ? 'bg-brand-orange/20 border-brand-orange text-brand-orange font-bold'
                                    : 'bg-white/5 border-transparent text-gray-400 hover:text-white'
                                }`}
                                title={tone.desc}
                            >
                                {tone.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="pt-4 mt-auto">
                <button 
                    onClick={actions.runWrite}
                    disabled={loading.generatingText}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                >
                    {loading.generatingText ? <Loader2 size={16} className="animate-spin"/> : <Sparkles size={16}/>}
                    {loading.generatingText ? "Writing Magic..." : "GENERATE ARTICLE"}
                </button>
            </div>

        </div>
    );
};
