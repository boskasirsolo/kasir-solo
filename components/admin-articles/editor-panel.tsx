import React, { useState } from 'react';
import { Sparkles, RefreshCw, Wand2, Loader2, Layout, Network, User, Search, CheckCircle2, ChevronRight, Tags, ArrowRight, X as XIcon, Users } from 'lucide-react';
import { Article } from '../../types';
import { Button } from '../ui';
import { ARTICLE_CATEGORIES, AUTHOR_PRESETS, NARRATIVE_TONES, RESEARCH_TOPICS } from './types';

// --- ATOM: Strategy Switcher ---
const StrategySwitcher = ({ type, onChange }: { type: string, onChange: (t: 'pillar' | 'cluster') => void }) => (
    <div className="bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
            <Layout size={10} /> Strategi Konten (SEO Structure)
        </label>
        <div className="flex gap-2">
            <button 
                onClick={() => onChange('pillar')}
                className={`flex-1 py-2 px-2 text-[10px] rounded border transition-all flex items-center justify-center gap-2 ${type === 'pillar' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 font-bold shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
            >
                <div className="w-2 h-2 rounded-full bg-current"></div> Pillar Page
            </button>
            <button 
                onClick={() => onChange('cluster')}
                className={`flex-1 py-2 px-2 text-[10px] rounded border transition-all flex items-center justify-center gap-2 ${type === 'cluster' ? 'bg-blue-500/20 border-blue-500 text-blue-500 font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
            >
                <div className="w-2 h-2 rounded-sm bg-current"></div> Cluster Content
            </button>
        </div>
    </div>
);

// --- ORGANISM: Editor Panel (Research & Configuration Flow) ---
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
    
    // Multi Category Logic
    const [catInput, setCatInput] = useState('');
    const selectedCats = form.category ? form.category.split(',').map((s: string) => s.trim()).filter(Boolean) : [];

    const addCategory = (cat: string) => {
        const trimmed = cat.trim();
        if (trimmed && !selectedCats.includes(trimmed)) {
            const newCats = [...selectedCats, trimmed];
            setForm((p: any) => ({ ...p, category: newCats.join(', ') }));
        }
        setCatInput('');
    };

    const removeCategory = (cat: string) => {
        const newCats = selectedCats.filter((c: string) => c !== cat);
        setForm((p: any) => ({ ...p, category: newCats.join(', ') }));
    };

    const toggleTone = (toneId: string) => {
        const current = aiState.selectedTones || [];
        const exists = current.includes(toneId);
        
        if (exists) {
            aiState.setSelectedTones(current.filter((t: string) => t !== toneId));
        } else {
            if (current.length >= 3) alert("Maksimal 3 kombinasi tone.");
            else aiState.setSelectedTones([...current, toneId]);
        }
    };

    const togglePresetTopic = (topic: string) => {
        const current = aiState.selectedPresets || [];
        if (current.includes(topic)) {
            aiState.setSelectedPresets(current.filter((t: string) => t !== topic));
        } else {
            aiState.setSelectedPresets([...current, topic]);
        }
    };

    // --- VIEW STEPS ---

    // STEP 1: RESEARCH CONTEXT
    if (aiState.step === 0 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4">
                <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-400">
                        <Search size={24} />
                    </div>
                    <h3 className="text-white font-bold text-lg">Riset Topik</h3>
                    <p className="text-gray-500 text-xs">Pilih topik untuk mencari ide judul artikel.</p>
                </div>

                <div className="flex-grow overflow-y-auto custom-scrollbar">
                    <div className="flex flex-wrap gap-2">
                        {RESEARCH_TOPICS.map((topic, i) => {
                            const isSelected = aiState.selectedPresets.includes(topic);
                            return (
                                <button
                                    key={i}
                                    onClick={() => togglePresetTopic(topic)}
                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                                        isSelected 
                                        ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
                                        : 'bg-black/20 text-gray-400 border-white/10 hover:border-white/30'
                                    }`}
                                >
                                    {topic}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                    <Button 
                        onClick={actions.runResearch} 
                        disabled={loading.researching || aiState.selectedPresets.length === 0}
                        className="w-full py-3 shadow-neon"
                    >
                        {loading.researching ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16}/> GENERATE IDE JUDUL</>}
                    </Button>
                </div>
            </div>
        );
    }

    // STEP 2: SELECT TITLE
    if (aiState.step === 1 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <button onClick={() => aiState.setStep(0)} className="p-1 hover:bg-white/10 rounded"><ArrowRight size={16} className="rotate-180 text-gray-400"/></button>
                    <h3 className="text-white font-bold text-sm">Pilih Judul</h3>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2">
                    {aiState.keywords.map((k: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => actions.selectTopic(k)}
                            className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-brand-orange hover:bg-brand-orange/5 cursor-pointer group transition-all"
                        >
                            <h4 className="text-xs font-bold text-white mb-1 group-hover:text-brand-orange">{k.keyword}</h4>
                            <div className="flex gap-2">
                                <span className={`text-[9px] px-1.5 rounded ${k.competition === 'Low' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{k.competition} Comp</span>
                                <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 rounded">{k.volume} Vol</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // STEP 3 (OR EDIT MODE): CONFIGURATION
    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 bg-brand-dark z-20">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi</h3>
                <div className="flex gap-2">
                    {!form.id && <button onClick={() => aiState.setStep(1)} className="text-[10px] text-gray-400 hover:text-white">Ganti Judul</button>}
                    <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /> Reset</button>
                </div>
            </div>

            {/* Scrollable Settings */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5">
                
                {/* 1. SEO STRATEGY */}
                <StrategySwitcher 
                    type={form.type} 
                    onChange={(t) => {
                        setForm((p:any) => ({...p, type: t, pillar_id: t === 'pillar' ? 0 : p.pillar_id}));
                    }} 
                />

                {/* 2. PILLAR LINK (If Cluster) */}
                {form.type === 'cluster' && (
                    <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20 animate-fade-in">
                        <label className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <Network size={10} /> Link ke Pillar Page
                        </label>
                        <select 
                            value={form.pillar_id || 0}
                            onChange={(e) => setForm((p:any) => ({...p, pillar_id: parseInt(e.target.value)}))}
                            className="w-full bg-black text-white text-[10px] border border-white/10 rounded px-2 py-2 focus:border-brand-orange outline-none"
                        >
                            <option value={0}>-- Pilih Artikel Pilar --</option>
                            {availablePillars.filter(p => p.id !== form.id).map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* 3. CATEGORIES */}
                <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2"><Tags size={10}/> Kategori</label>
                    <div className="flex flex-wrap gap-1.5 mb-2 min-h-[26px]">
                        {selectedCats.map((cat: string, i: number) => (
                            <span key={i} className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded px-2 py-1 text-[9px] font-bold flex items-center gap-1">
                                {cat}
                                <button onClick={() => removeCategory(cat)} className="hover:text-white"><XIcon size={8}/></button>
                            </span>
                        ))}
                    </div>
                    <input 
                        list="categories" 
                        value={catInput}
                        onChange={(e) => {
                            setCatInput(e.target.value);
                            const match = ARTICLE_CATEGORIES.find(c => c.toLowerCase() === e.target.value.toLowerCase());
                            if (match) addCategory(match);
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

                {/* 4. AUTHOR & TONE */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-3">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block flex items-center gap-2">
                        <User size={10} /> Penulis & Tone (Gaya Bahasa)
                    </label>
                    
                    {/* Author Chips */}
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                        {AUTHOR_PRESETS.map((preset) => {
                            const isActive = form.author === preset.name;
                            return (
                                <button 
                                    key={preset.id}
                                    onClick={() => setForm((p:any) => ({...p, author: preset.name}))}
                                    className={`shrink-0 px-2 py-1 text-[9px] rounded border transition-all flex items-center gap-1 ${
                                        isActive 
                                        ? 'bg-brand-orange text-white border-brand-orange' 
                                        : 'bg-black/20 border-white/10 text-gray-500'
                                    }`}
                                >
                                    {preset.mode === 'personal' ? <User size={8} /> : <Users size={8} />}
                                    {preset.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tone Chips */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {NARRATIVE_TONES.slice(0, 6).map((tone) => {
                            const isActive = aiState.selectedTones?.includes(tone.id);
                            return (
                                <button
                                    key={tone.id}
                                    onClick={() => toggleTone(tone.id)}
                                    className={`text-[9px] p-1.5 rounded text-left border transition-all ${
                                        isActive 
                                        ? 'bg-brand-orange/20 border-brand-orange text-white' 
                                        : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'
                                    }`}
                                >
                                    <div className="flex items-center gap-1 font-bold">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-orange' : 'bg-gray-600'}`}></div>
                                        {tone.label.split('(')[0]}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 5. GENERATE BUTTON */}
                <Button onClick={actions.runWrite} disabled={loading.generatingText} className="w-full py-4 text-xs font-bold shadow-neon bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:brightness-110">
                    {loading.generatingText ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16} /> GENERATE CONTENT (AI)</>}
                </Button>

            </div>
        </div>
    );
};