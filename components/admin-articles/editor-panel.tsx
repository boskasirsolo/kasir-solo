
import React, { useState } from 'react';
import { Sparkles, RefreshCw, Wand2, Loader2, Layout, Network, User, Search, CheckCircle2, ChevronRight, Tags, ArrowRight, X as XIcon, Users, ArrowLeft, BarChart, Save, FileText, Share2, Target, Instagram, Facebook, MapPin, Rocket, AlertCircle } from 'lucide-react';
import { Article } from '../../types';
import { Button, LoadingSpinner } from '../ui';
import { ARTICLE_CATEGORIES, AUTHOR_PRESETS, NARRATIVE_TONES } from './types';

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
    socialState,
    availablePillars
}: {
    form: any,
    setForm: any,
    loading: any,
    aiState: any,
    actions: any,
    socialState: any,
    availablePillars: Article[]
}) => {
    
    // Multi Category Logic
    const [catInput, setCatInput] = useState('');
    const [researchTopicInput, setResearchTopicInput] = useState(''); // NEW STATE
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

    // Toggle Related Pillar ID
    const toggleRelatedPillar = (id: number) => {
        const current = form.related_pillars || [];
        if (current.includes(id)) {
            setForm((p: any) => ({ ...p, related_pillars: current.filter((pid: number) => pid !== id) }));
        } else {
            setForm((p: any) => ({ ...p, related_pillars: [...current, id] }));
        }
    };

    // --- VIEW STEPS ---

    // STEP 0: INITIAL START (Pre-Research)
    if (aiState.step === 0 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4 items-center justify-center text-center">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                    <Search size={32} className="text-blue-400" />
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">Riset Judul Viral</h3>
                <p className="text-gray-500 text-xs max-w-[220px] mb-6 leading-relaxed">
                    Tentukan jenis artikel, lalu AI akan mencari topik dengan volume pencarian tertinggi.
                </p>

                {/* INSERTED: Manual Topic Input */}
                <div className="w-full max-w-[250px] mb-4 text-left">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                        <Target size={10} /> Topik Spesifik (Opsional)
                    </label>
                    <input 
                        type="text" 
                        value={researchTopicInput}
                        onChange={(e) => setResearchTopicInput(e.target.value)}
                        placeholder="Contoh: Pajak, Stok, Promo..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange placeholder-gray-600"
                    />
                </div>

                {/* INSERTED: Strategy Switcher for Pre-Research Context */}
                <div className="w-full max-w-[250px] mb-6 text-left">
                    <StrategySwitcher 
                        type={form.type} 
                        onChange={(t) => {
                            setForm((p:any) => ({...p, type: t}));
                        }} 
                    />
                </div>

                <Button 
                    onClick={() => actions.runResearch(researchTopicInput)} // PASS INPUT VALUE
                    disabled={loading.researching}
                    className="w-full max-w-[250px] py-3 shadow-neon"
                >
                    {loading.researching ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16}/> RISET MARKET ({form.type.toUpperCase()})</>}
                </Button>
            </div>
        );
    }

    // STEP 1: KEYWORD RESULTS (New Merged Step)
    if (aiState.step === 1 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <button onClick={() => aiState.setStep(0)} className="p-1 hover:bg-white/10 rounded"><ArrowLeft size={16} className="text-gray-400 hover:text-white"/></button>
                    <h3 className="text-white font-bold text-sm">Hasil Riset ({form.type === 'pillar' ? 'Pillar' : 'Cluster'})</h3>
                </div>
                
                <p className="text-xs text-gray-500 mb-4">Pilih judul dengan volume tinggi & kompetisi rendah.</p>

                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2">
                    {aiState.keywords.map((k: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => actions.selectTopic(k)}
                            className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-brand-orange hover:bg-brand-orange/5 cursor-pointer group transition-all"
                        >
                            <h4 className="text-xs font-bold text-white mb-2 group-hover:text-brand-orange leading-snug">{k.keyword}</h4>
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-2 py-0.5 rounded border flex items-center gap-1 ${k.competition === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                    <BarChart size={8} /> {k.competition} Comp
                                </span>
                                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                                    {k.volume} Vol
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // STEP 2: CONFIGURATION (Was Step 3)
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

                {/* 1.5 INTER-PILLAR LINKING (New Feature) */}
                {form.type === 'pillar' && (
                    <div className="bg-yellow-500/5 p-3 rounded-lg border border-yellow-500/20">
                        <label className="text-[9px] text-yellow-500 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <Share2 size={10} /> Koneksi Antar Pilar (Content Web)
                        </label>
                        <p className="text-[9px] text-gray-500 mb-2 leading-relaxed">
                            Hubungkan pilar ini dengan pilar lain untuk memperkuat struktur SEO.
                        </p>
                        <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                            {availablePillars
                                .filter(p => p.id !== form.id) // Exclude self
                                .map(p => {
                                    const isLinked = (form.related_pillars || []).includes(p.id);
                                    return (
                                        <button 
                                            key={p.id}
                                            onClick={() => toggleRelatedPillar(p.id)}
                                            className={`w-full text-left text-[10px] px-2 py-1.5 rounded flex items-center justify-between border transition-all ${
                                                isLinked 
                                                ? 'bg-yellow-500/20 text-white border-yellow-500/50' 
                                                : 'bg-black/20 text-gray-400 border-transparent hover:bg-white/5'
                                            }`}
                                        >
                                            <span className="truncate">{p.title}</span>
                                            {isLinked && <CheckCircle2 size={10} className="text-yellow-500 shrink-0"/>}
                                        </button>
                                    );
                                })
                            }
                            {availablePillars.filter(p => p.id !== form.id).length === 0 && (
                                <p className="text-[9px] text-gray-500 italic">Belum ada artikel pilar lain.</p>
                            )}
                        </div>
                    </div>
                )}

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

                {/* 4. WORD COUNT SELECTOR */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-2"><FileText size={10} /> Target Panjang Artikel</span>
                        <span className="text-brand-orange">{form.targetWordCount || 1000} Kata</span>
                    </label>
                    
                    <input 
                        type="range" 
                        min="400" 
                        max="5000" 
                        step="100" 
                        value={form.targetWordCount || 1000}
                        onChange={(e) => setForm((p:any) => ({...p, targetWordCount: parseInt(e.target.value)}))}
                        className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-brand-orange mb-3"
                    />
                    
                    <div className="flex justify-between text-[8px] text-gray-500 font-mono">
                        <span>400 (Short)</span>
                        <span>2500 (Deep)</span>
                        <span>5000 (Epic)</span>
                    </div>
                </div>

                {/* 5. AUTHOR & TONE */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-3">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block flex items-center gap-2">
                        <User size={10} /> Penulis & Tone (Gaya Bahasa)
                    </label>
                    
                    {/* Author is now set by Global Switcher in Left Panel, but display here for confirmation */}
                    <div className="flex items-center gap-2 bg-black/20 p-2 rounded border border-white/5">
                        <img src={form.authorAvatar || 'https://via.placeholder.com/30'} className="w-5 h-5 rounded-full object-cover"/>
                        <span className="text-[9px] font-bold text-gray-300">{form.author} (Aktif)</span>
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

                {/* 6. SOCIAL BROADCAST (NEW) */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-3 rounded-lg border border-purple-500/30 space-y-3">
                    <div className="flex justify-between items-center">
                        <h4 className="text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <Share2 size={12} className="text-purple-400"/> Social Broadcast
                        </h4>
                        <div className="flex gap-1">
                            {['instagram', 'facebook', 'gmb'].map((p) => (
                                <button 
                                    key={p}
                                    onClick={() => actions.setSelectedPlatforms((prev: any) => ({...prev, [p]: !prev[p]}))}
                                    className={`p-1.5 rounded transition-all ${
                                        socialState.selectedPlatforms[p] 
                                        ? (p === 'instagram' ? 'bg-pink-600 text-white' : p === 'facebook' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white') 
                                        : 'bg-white/10 text-gray-500'
                                    }`}
                                    title={p.toUpperCase()}
                                >
                                    {p === 'instagram' && <Instagram size={10} />}
                                    {p === 'facebook' && <Facebook size={10} />}
                                    {p === 'gmb' && <MapPin size={10} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <textarea 
                            value={socialState.socialCaption}
                            onChange={(e) => actions.setSocialCaption(e.target.value)}
                            placeholder="Caption sosmed..."
                            className="w-full h-16 bg-black/40 text-[9px] text-white p-2 rounded border border-purple-500/20 focus:border-purple-500 outline-none resize-none custom-scrollbar"
                        />
                        <button 
                            onClick={actions.generateSocialCaption}
                            disabled={socialState.socialLoading.generating}
                            className="absolute bottom-1 right-1 text-[8px] bg-purple-500 hover:bg-purple-400 text-white px-2 py-0.5 rounded flex items-center gap-1 shadow-lg transition-all disabled:opacity-50"
                        >
                            {socialState.socialLoading.generating ? <Loader2 size={8} className="animate-spin"/> : <><Sparkles size={8}/> AI Caption</>}
                        </button>
                    </div>

                    <button 
                        onClick={actions.broadcastArticle}
                        disabled={socialState.socialLoading.posting}
                        className="w-full py-1.5 bg-white/5 hover:bg-purple-600 border border-purple-500/30 text-purple-200 hover:text-white rounded text-[9px] font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {socialState.socialLoading.posting ? <LoadingSpinner size={10}/> : <><Rocket size={10}/> POST TO SOCIAL</>}
                    </button>
                    
                    {(!form.imagePreview || form.imagePreview.startsWith('blob:')) && (
                        <div className="flex items-center gap-1 mt-1 text-[8px] text-yellow-500 bg-yellow-500/10 p-1 rounded">
                            <AlertCircle size={8}/>
                            <span>Simpan dulu untuk broadcast.</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
