
import React, { useState, useEffect } from 'react';
import { Sparkles, Edit, RefreshCw, Wand2, Loader2, Save, TrendingUp, ArrowRight, Layout, Network, Image as ImageIcon, UploadCloud, CalendarClock, X as XIcon, User, Users } from 'lucide-react';
import { Article } from '../../types';
import { Button, Input, TextArea, LoadingSpinner } from '../ui';
import { PRESET_TOPICS, ARTICLE_CATEGORIES, AUTHOR_PRESETS } from './types';

// --- ATOM: Strategy Switcher ---
const StrategySwitcher = ({ type, onChange }: { type: string, onChange: (t: 'pillar' | 'cluster') => void }) => (
    <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
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

// --- ORGANISM: Editor Panel ---
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

    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCatInput(val);
        
        // Auto-add if it matches a preset (Case insensitive check, but add formatted preset)
        const match = ARTICLE_CATEGORIES.find(c => c.toLowerCase() === val.toLowerCase());
        if (match) {
            addCategory(match);
        }
    };

    const handleCatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addCategory(catInput);
        }
    };

    // --- MODE 1: AI STUDIO - STEP 1 (Topic Selection) ---
    if (!form.id && aiState.step === 0) {
        return (
            <div className="flex flex-col h-full bg-brand-dark">
                <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={14}/> AI Studio - Riset Topik</h3>
                </div>
                
                <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">1. Pilih Konteks</label>
                        <div className="grid grid-cols-2 gap-2">
                            {PRESET_TOPICS.map(topic => (
                                <button 
                                    key={topic.id}
                                    onClick={() => {
                                        const exists = aiState.selectedPresets.includes(topic.label);
                                        const newPresets = exists 
                                            ? aiState.selectedPresets.filter((p:string) => p !== topic.label)
                                            : [...aiState.selectedPresets, topic.label];
                                        aiState.setSelectedPresets(newPresets);
                                    }}
                                    className={`text-[10px] p-2 rounded border transition-all text-left ${
                                        aiState.selectedPresets.includes(topic.label)
                                        ? 'bg-brand-orange text-white border-brand-orange shadow-sm'
                                        : 'bg-black/20 text-gray-400 border-white/10 hover:border-brand-orange/30 hover:text-gray-300'
                                    }`}
                                >
                                    {topic.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button onClick={actions.runResearch} disabled={loading.researching} className="w-full py-3 text-xs">
                        {loading.researching ? <LoadingSpinner size={14}/> : <><Sparkles size={14} /> CARI IDE KONTEN (SEO)</>}
                    </Button>

                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-2 text-[9px] text-gray-600 uppercase">Atau</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    
                    <button 
                        onClick={() => aiState.setStep(3)}
                        className="w-full py-3 border border-white/10 rounded-lg text-gray-400 text-xs font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Edit size={14} /> TULIS MANUAL SAJA
                    </button>
                </div>
            </div>
        );
    }

    // --- MODE 1: AI STUDIO - STEP 1.5 (Select Result) ---
    if (!form.id && aiState.step === 1) {
        return (
            <div className="flex flex-col h-full bg-brand-dark">
                <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp size={14}/> Pilih Topik</h3>
                    <button onClick={() => aiState.setStep(0)} className="text-[10px] text-gray-500 hover:text-white">Ulangi</button>
                </div>
                <div className="p-4 overflow-y-auto custom-scrollbar flex-grow space-y-2">
                    {aiState.keywords.map((k: any, i: number) => (
                        <div 
                            key={i} 
                            onClick={() => actions.selectTopic(k)}
                            className="group bg-brand-card border border-white/10 hover:border-brand-orange rounded-lg p-3 cursor-pointer transition-all hover:bg-white/5 relative"
                        >
                            <h5 className="text-xs font-bold text-white mb-1 group-hover:text-brand-orange transition-colors pr-6">
                                {k.keyword}
                            </h5>
                            <div className="flex gap-2">
                                <span className={`text-[9px] px-1.5 py-0.5 rounded border border-white/10 ${k.competition === 'Low' ? 'text-green-400 bg-green-900/20' : 'text-yellow-400 bg-yellow-900/20'}`}>
                                    Comp: {k.competition}
                                </span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded border border-white/10 text-blue-400 bg-blue-900/20">
                                    Vol: {k.volume}
                                </span>
                            </div>
                            <ArrowRight size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- MODE 1: AI STUDIO - STEP 2 (CONFIGURATION) ---
    if (!form.id && aiState.step === 2) {
        return (
            <div className="flex flex-col h-full bg-brand-dark">
                <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi Artikel</h3>
                    <button onClick={() => aiState.setStep(1)} className="text-[10px] text-gray-500 hover:text-white">Kembali</button>
                </div>

                <div className="p-4 overflow-y-auto custom-scrollbar flex-grow space-y-4">
                    {/* 1. Confirm Title */}
                    <div>
                        <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Judul Artikel (Bisa Diedit)</label>
                        <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} className="text-sm font-bold" />
                    </div>

                    {/* 2. Strategy */}
                    <StrategySwitcher 
                        type={form.type} 
                        onChange={(t) => {
                            setForm((p:any) => ({...p, type: t, pillar_id: t === 'pillar' ? 0 : p.pillar_id}));
                        }} 
                    />

                    {/* 3. AUTHOR SELECTION (NEW) */}
                    <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                            <User size={10} /> Penulis Artikel
                        </label>
                        <div className="flex gap-2">
                            {AUTHOR_PRESETS.map((preset) => {
                                const isActive = form.author === preset.name;
                                return (
                                    <button 
                                        key={preset.id}
                                        onClick={() => setForm((p:any) => ({...p, author: preset.name}))}
                                        className={`flex-1 py-2 px-2 text-[10px] rounded border transition-all flex items-center justify-center gap-2 ${
                                            isActive 
                                            ? 'bg-brand-orange text-white border-brand-orange font-bold shadow-[0_0_10px_rgba(255,95,31,0.4)]' 
                                            : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'
                                        }`}
                                    >
                                        {preset.mode === 'personal' ? <User size={10} /> : <Users size={10} />}
                                        {preset.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4. Parent Selection (If Cluster) */}
                    {form.type === 'cluster' && (
                        <div className="bg-blue-500/5 p-3 rounded-lg border border-blue-500/20 animate-fade-in">
                            <label className="text-[9px] text-blue-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                                <Network size={10} /> Pilih Induk (Pillar Page)
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
                            <p className="text-[9px] text-gray-500 mt-2 italic">
                                *Artikel ini akan nge-link ke Pilar Page yang dipilih untuk memperkuat SEO struktur.
                            </p>
                        </div>
                    )}

                    {/* Action */}
                    <Button onClick={actions.runWrite} disabled={loading.generatingText} className="w-full py-4 text-xs font-bold shadow-neon mt-4">
                        {loading.generatingText ? <LoadingSpinner size={16}/> : <><Sparkles size={16} /> GENERATE KONTEN SEKARANG</>}
                    </Button>
                </div>
            </div>
        );
    }

    // --- MODE 2: EDITOR (Writing/Editing - Step 3) ---
    // Layout: 
    // 1. Header (Fixed)
    // 2. Meta Controls (Fixed / Non-Scrollable)
    // 3. Content Editor (Internal Scroll)
    // 4. Footer (Fixed)
    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
            {/* 1. Header (Fixed) */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 z-20 bg-brand-dark">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Edit size={14}/> Editor Final</h3>
                <div className="flex gap-2">
                    <button onClick={() => aiState.setStep(2)} className="text-[10px] text-gray-500 hover:text-white border border-white/10 px-2 py-1 rounded">Config</button>
                    <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /></button>
                </div>
            </div>

            {/* 2. Top Meta Section (Shrink-0) */}
            <div className="shrink-0 p-4 border-b border-white/5 bg-brand-dark/50 space-y-4 z-10">
                <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel"/>
                
                <div className="flex gap-4">
                    {/* Small Image Preview */}
                    <div className="w-24 h-24 bg-black/40 rounded-lg overflow-hidden border border-white/10 group relative shrink-0">
                        {form.imagePreview ? (
                            <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <ImageIcon size={16} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-1 gap-1">
                             <button onClick={actions.runImage} disabled={loading.generatingImage} className="w-full py-1 bg-blue-600 text-white text-[8px] font-bold rounded hover:bg-blue-500">AI</button>
                             <label className="w-full py-1 bg-white/10 text-white text-[8px] font-bold rounded hover:bg-white/20 cursor-pointer text-center">
                                Upload
                                <input type="file" accept="image/*" onChange={(e) => {
                                    const file = e.target.files ? e.target.files[0] : null;
                                    if (file) setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
                                }} className="hidden" />
                             </label>
                        </div>
                    </div>

                    {/* Metadata Inputs */}
                    <div className="flex-grow space-y-2">
                        {/* Tags */}
                        <div>
                            <div className="flex flex-wrap gap-1.5 mb-1.5 min-h-[22px]">
                                {selectedCats.map((cat: string, i: number) => (
                                    <span key={i} className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded px-2 py-0.5 text-[9px] font-bold flex items-center gap-1">
                                        {cat}
                                        <button onClick={() => removeCategory(cat)} className="hover:text-white"><XIcon size={8}/></button>
                                    </span>
                                ))}
                            </div>
                            <input 
                                list="categories" 
                                value={catInput}
                                onChange={handleCategoryChange}
                                onKeyDown={handleCatKeyDown}
                                placeholder="Kategori... (Pilih / Ketik)"
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-brand-orange outline-none"
                            />
                            <datalist id="categories">
                                {ARTICLE_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                        </div>

                        {/* Excerpt */}
                        <TextArea 
                            value={form.excerpt} 
                            onChange={e => setForm((p:any) => ({...p, excerpt: e.target.value}))} 
                            placeholder="Deskripsi Singkat..." 
                            className="h-12 text-[10px] leading-relaxed resize-none custom-scrollbar"
                        />
                    </div>
                </div>
            </div>

            {/* 3. Main Content Editor (Fixed container, internal scroll) */}
            <div className="flex-grow overflow-hidden p-4 relative flex flex-col">
                <TextArea 
                    value={form.content} 
                    onChange={e => setForm((p:any) => ({...p, content: e.target.value}))} 
                    placeholder="# Konten Artikel..." 
                    className="flex-grow w-full text-xs font-mono resize-none bg-transparent border-none focus:ring-0 p-0 text-gray-300 leading-relaxed custom-scrollbar h-full"
                />
                
                {/* Floating AI Button inside Scroll Area */}
                <div className="absolute bottom-4 right-6 pointer-events-none">
                    <button 
                    onClick={actions.runWrite}
                    disabled={loading.generatingText}
                    className="pointer-events-auto bg-brand-orange/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg hover:bg-brand-orange flex items-center gap-1 border border-white/20 transition-all transform hover:scale-105"
                    >
                    {loading.generatingText ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>}
                    Regenerate
                    </button>
                </div>
            </div>

            {/* 4. Footer Actions (Fixed) */}
            <div className="p-4 border-t border-white/5 bg-brand-dark/90 backdrop-blur-sm shrink-0 z-20">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <select value={form.status} onChange={(e) => setForm((p:any) => ({...p, status: e.target.value}))} className="bg-black/40 text-white text-[10px] rounded border border-white/10 px-2 focus:border-brand-orange outline-none h-8">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Terjadwal</option>
                    </select>
                    
                    {/* SCHEDULE INPUT (Condition) */}
                    {form.status === 'scheduled' ? (
                        <div className="relative">
                            <CalendarClock size={12} className="absolute left-2 top-2 text-gray-500"/>
                            <input 
                                type="datetime-local" 
                                value={form.scheduled_for} 
                                onChange={(e) => setForm((p:any) => ({...p, scheduled_for: e.target.value}))}
                                className="w-full bg-black/40 text-white text-[10px] rounded border border-white/10 pl-6 pr-2 h-8 focus:border-brand-orange outline-none"
                            />
                        </div>
                    ) : (
                        <div className="h-8"></div> // Spacer to keep button size consistent
                    )}
                </div>
                
                <Button onClick={actions.saveArticle} disabled={loading.uploading} className="w-full py-2 text-[10px]">
                    {loading.uploading ? <LoadingSpinner size={12}/> : <><Save size={12}/> SIMPAN ARTIKEL</>}
                </Button>
            </div>
        </div>
    );
};
