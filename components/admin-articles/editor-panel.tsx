
import React, { useState } from 'react';
import { Sparkles, RefreshCw, Wand2, Loader2, Save, Layout, Network, Image as ImageIcon, UploadCloud, CalendarClock, X as XIcon, User, Users, PenTool, Check } from 'lucide-react';
import { Article } from '../../types';
import { Button, Input, TextArea, LoadingSpinner } from '../ui';
import { ARTICLE_CATEGORIES, AUTHOR_PRESETS, NARRATIVE_TONES } from './types';

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

// --- ORGANISM: Editor Panel (Configuration Only) ---
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

    const toggleTone = (toneId: string) => {
        const current = aiState.selectedTones || [];
        const exists = current.includes(toneId);
        
        if (exists) {
            aiState.setSelectedTones(current.filter((t: string) => t !== toneId));
        } else {
            if (current.length >= 3) {
                alert("Maksimal 3 kombinasi tone.");
            } else {
                aiState.setSelectedTones([...current, toneId]);
            }
        }
    };

    // --- CONFIGURATION VIEW ---
    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
            {/* 1. Header (Fixed) */}
            <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 z-20 bg-brand-dark">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi</h3>
                <div className="flex gap-2">
                    <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /> Reset</button>
                </div>
            </div>

            {/* 2. Scrollable Settings */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5">
                
                {/* TITLE & SLUG */}
                <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Judul Utama</label>
                    <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel..." className="text-sm font-bold"/>
                </div>

                {/* SEO STRATEGY */}
                <StrategySwitcher 
                    type={form.type} 
                    onChange={(t) => {
                        setForm((p:any) => ({...p, type: t, pillar_id: t === 'pillar' ? 0 : p.pillar_id}));
                    }} 
                />

                {/* PARENT PILLAR (Conditional) */}
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

                {/* COVER IMAGE */}
                <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-2">Cover Image</label>
                    <div className="w-full h-32 bg-black/40 rounded-lg overflow-hidden border border-white/10 group relative">
                        {form.imagePreview ? (
                            <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 gap-2">
                                <ImageIcon size={20} />
                                <span className="text-[10px]">No Image</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
                                <button onClick={actions.runImage} disabled={loading.generatingImage} className="w-full py-1.5 bg-blue-600 text-white text-[9px] font-bold rounded hover:bg-blue-500 flex items-center justify-center gap-1">
                                    <Sparkles size={10} /> AI Generate
                                </button>
                                <label className="w-full py-1.5 bg-white/10 text-white text-[9px] font-bold rounded hover:bg-white/20 cursor-pointer text-center flex items-center justify-center gap-1">
                                    <UploadCloud size={10} /> Upload
                                    <input type="file" accept="image/*" onChange={(e) => {
                                        const file = e.target.files ? e.target.files[0] : null;
                                        if (file) setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
                                    }} className="hidden" />
                                </label>
                        </div>
                    </div>
                </div>

                {/* CATEGORIES */}
                <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Kategori / Tags</label>
                    <div className="flex flex-wrap gap-1.5 mb-2 min-h-[22px]">
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
                        placeholder="+ Kategori..."
                        className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:border-brand-orange outline-none"
                    />
                    <datalist id="categories">
                        {ARTICLE_CATEGORIES.map(cat => (
                            <option key={cat} value={cat} />
                        ))}
                    </datalist>
                </div>

                {/* EXCERPT */}
                <div>
                    <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider block mb-1">Deskripsi Singkat (Meta Desc)</label>
                    <TextArea 
                        value={form.excerpt} 
                        onChange={e => setForm((p:any) => ({...p, excerpt: e.target.value}))} 
                        placeholder="Ringkasan artikel untuk SEO..." 
                        className="h-20 text-[10px] leading-relaxed resize-none custom-scrollbar"
                    />
                </div>

                {/* AI TOOLS: AUTHOR & TONE */}
                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-3">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block flex items-center gap-2">
                        <User size={10} /> Penulis & Gaya Bahasa (AI)
                    </label>
                    
                    {/* Author Override */}
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

                    {/* Tone Selection */}
                    <div className="grid grid-cols-2 gap-1.5">
                        {NARRATIVE_TONES.slice(0, 4).map((tone) => {
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
                                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-brand-orange' : 'bg-gray-600'}`}></div>
                                        {tone.label}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* AI ACTION: GENERATE FULL ARTICLE */}
                <Button onClick={actions.runWrite} disabled={loading.generatingText} className="w-full py-3 text-xs font-bold shadow-neon bg-gradient-to-r from-blue-600 to-purple-600 border-none hover:brightness-110">
                    {loading.generatingText ? <Loader2 size={14} className="animate-spin"/> : <><Sparkles size={14} /> BUAT KERANGKA / KONTEN (AI)</>}
                </Button>

            </div>

            {/* 3. Footer Actions (Fixed) */}
            <div className="p-4 border-t border-white/5 bg-brand-dark/90 backdrop-blur-sm shrink-0 z-20">
                <div className="grid grid-cols-2 gap-2 mb-2">
                    <select value={form.status} onChange={(e) => setForm((p:any) => ({...p, status: e.target.value}))} className="bg-black/40 text-white text-[10px] rounded border border-white/10 px-2 focus:border-brand-orange outline-none h-8">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="scheduled">Terjadwal</option>
                    </select>
                    
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
                        <div className="h-8"></div> 
                    )}
                </div>
                
                <Button onClick={actions.saveArticle} disabled={loading.uploading} className="w-full py-3 text-xs font-bold shadow-neon">
                    {loading.uploading ? <LoadingSpinner size={14}/> : <><Save size={14}/> SIMPAN PERUBAHAN</>}
                </Button>
            </div>
        </div>
    );
};
