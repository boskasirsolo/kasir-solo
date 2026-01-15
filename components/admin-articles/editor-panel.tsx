
import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Wand2, Loader2, Layout, Network, User, Search, CheckCircle2, ChevronRight, Tags, ArrowRight, X as XIcon, Users, ArrowLeft, BarChart, Save, FileText, Share2, Target, Instagram, Facebook, Linkedin, Rocket, AlertCircle, FileType, MessageSquare, MapPin, Image as ImageIcon, Send, Clock } from 'lucide-react';
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
                className={`flex-1 py-2 px-2 text-[10px] rounded border transition-all flex items-center justify-center gap-2 ${type === 'cluster' ? 'bg-blue-500/20 border-blue-500 text-blue-400 font-bold shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
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
    
    const [catInput, setCatInput] = useState('');
    const [researchTopicInput, setResearchTopicInput] = useState(''); 
    const [useCityTemplate, setUseCityTemplate] = useState(false);
    
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

    const handleCitySelect = (cityId: number) => {
        const city = aiState.cities.find((c: any) => c.id === cityId);
        if (city) {
            setForm((p: any) => ({ 
                ...p, 
                targetCityId: cityId,
                title: `Jual Paket Mesin Kasir di ${city.name} - Unit Lengkap & Garansi Resmi`
            }));
            // Auto add category if relevant
            if (!selectedCats.includes('Area Layanan')) addCategory('Area Layanan');
        } else {
            setForm((p: any) => ({ ...p, targetCityId: 0 }));
        }
    };

    // STEP 0: INITIAL START
    if (aiState.step === 0 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4 items-center justify-center text-center overflow-y-auto custom-scrollbar pb-32">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] shrink-0">
                    <Search size={32} className="text-blue-400" />
                </div>
                
                <h3 className="text-white font-bold text-lg mb-2">Riset Judul Viral</h3>
                <p className="text-gray-500 text-xs max-w-[220px] mb-6 leading-relaxed">
                    Tentukan jenis artikel, lalu AI akan mencari topik dengan volume pencarian tertinggi.
                </p>

                {/* TEMPLATE WILAYAH TOGGLE */}
                <div className="w-full max-w-[250px] mb-4 text-left bg-black/30 p-3 rounded-xl border border-white/5">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-2 group-hover:text-brand-orange">
                            <MapPin size={12} /> Target Wilayah
                        </span>
                        <input 
                            type="checkbox" 
                            checked={useCityTemplate} 
                            onChange={(e) => {
                                setUseCityTemplate(e.target.checked);
                                if (!e.target.checked) setForm((p:any) => ({...p, targetCityId: 0}));
                            }}
                            className="accent-brand-orange w-4 h-4"
                        />
                    </label>
                    {useCityTemplate && (
                        <div className="mt-2 animate-fade-in">
                            <select 
                                value={form.targetCityId}
                                onChange={(e) => handleCitySelect(parseInt(e.target.value))}
                                className="w-full bg-brand-dark text-white text-[10px] p-2 rounded border border-brand-orange/30 outline-none"
                            >
                                <option value={0}>-- Pilih Kota Target --</option>
                                {aiState.cities?.map((city: any) => (
                                    <option key={city.id} value={city.id}>{city.name} ({city.type})</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {!useCityTemplate && (
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
                )}

                <div className="w-full max-w-[250px] mb-4 text-left">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2">
                        <MessageSquare size={10} /> Konteks Tambahan
                    </label>
                    <textarea
                        value={form.generationContext}
                        onChange={(e) => setForm((p:any) => ({...p, generationContext: e.target.value}))}
                        placeholder="Cth: Jangan sebut harga, tone agresif..."
                        className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white focus:outline-none focus:border-brand-orange placeholder-gray-600 resize-none h-16 custom-scrollbar"
                    />
                </div>

                <div className="w-full max-w-[250px] mb-6 text-left">
                    <StrategySwitcher type={form.type} onChange={(t) => setForm((p:any) => ({...p, type: t}))} />
                </div>

                <Button 
                    onClick={() => useCityTemplate ? actions.setStep(2) : actions.runResearch(researchTopicInput)}
                    disabled={loading.researching}
                    className="w-full max-w-[250px] py-3 shadow-neon"
                >
                    {loading.researching ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16}/> {useCityTemplate ? 'GUNAKAN TEMPLATE' : 'RISET MARKET'}</>}
                </Button>
            </div>
        );
    }

    // STEP 1: KEYWORD RESULTS
    if (aiState.step === 1 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                    <button onClick={() => aiState.setStep(0)} className="p-1 hover:bg-white/10 rounded"><ArrowLeft size={16} className="text-gray-400 hover:text-white"/></button>
                    <h3 className="text-white font-bold text-sm">Hasil Riset</h3>
                </div>
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pb-32">
                    {aiState.keywords.map((k: any, i: number) => (
                        <div key={i} onClick={() => actions.selectTopic(k)} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-brand-orange hover:bg-brand-orange/5 cursor-pointer group transition-all">
                            <h4 className="text-xs font-bold text-white mb-2 group-hover:text-brand-orange leading-snug">{k.keyword}</h4>
                            <div className="flex items-center gap-2">
                                <span className={`text-[9px] px-2 py-0.5 rounded border flex items-center gap-1 ${k.competition === 'Low' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}><BarChart size={8} /> {k.competition} Comp</span>
                                <span className="text-[9px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20 font-mono">{k.volume} Vol</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // STEP 2: CONFIGURATION
    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 bg-brand-dark z-20">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi</h3>
                <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /> Reset</button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5 pb-32">
                
                {/* STATUS PENERBITAN (NEW) */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2 mb-3">
                        <Send size={10} className="text-blue-400"/> Status Penerbitan
                    </label>
                    <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                        {['draft', 'published', 'scheduled'].map((s: any) => (
                            <button
                                key={s}
                                onClick={() => setForm((p:any) => ({...p, status: s}))}
                                className={`flex-1 py-2 rounded text-[9px] font-bold uppercase transition-all ${form.status === s ? 'bg-brand-orange text-white shadow-neon-text' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    {form.status === 'scheduled' && (
                        <div className="mt-4 animate-fade-in space-y-2">
                             <label className="text-[9px] text-brand-orange font-bold uppercase flex items-center gap-1">
                                <Clock size={10}/> Atur Jadwal Tayang
                             </label>
                             <input 
                                type="datetime-local" 
                                value={form.scheduled_for}
                                onChange={(e) => setForm((p:any) => ({...p, scheduled_for: e.target.value}))}
                                className="w-full bg-black/60 border border-brand-orange/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                             />
                             <p className="text-[8px] text-gray-500 italic">*Wajib isi tanggal & jam untuk mode scheduled.</p>
                        </div>
                    )}
                </div>

                {/* COVER IMAGE SECTION */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                         <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2"><ImageIcon size={10}/> Aset Visual (Cover)</label>
                         <button 
                            onClick={actions.runImage}
                            disabled={loading.generatingImage || !form.title}
                            className="text-[9px] text-brand-orange hover:text-white flex items-center gap-1 disabled:opacity-30"
                         >
                            {loading.generatingImage ? <Loader2 size={10} className="animate-spin"/> : <><Sparkles size={10}/> AI Generate</>}
                         </button>
                    </div>
                    <div className="aspect-video bg-black rounded-lg border border-white/5 overflow-hidden relative group">
                        {form.imagePreview ? (
                            <img src={form.imagePreview} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 text-[10px]">
                                <ImageIcon size={24} className="mb-1 opacity-20"/>
                                Belum Ada Cover
                            </div>
                        )}
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <span className="text-[10px] text-white font-bold">GANTI MANUAL</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                                const file = e.target.files ? e.target.files[0] : null;
                                if (file) setForm((prev:any) => ({...prev, uploadFile: file, imagePreview: URL.createObjectURL(file)}));
                            }} />
                        </label>
                    </div>
                </div>

                <StrategySwitcher type={form.type} onChange={(t) => setForm((p:any) => ({...p, type: t}))} />

                {/* LOCAL SEO INDICATOR */}
                {form.targetCityId > 0 && (
                    <div className="bg-brand-orange/10 p-3 rounded-lg border border-brand-orange/30">
                        <label className="text-[9px] text-brand-orange font-bold uppercase tracking-wider block mb-1 flex items-center gap-2">
                            <MapPin size={10} /> Target Wilayah Aktif
                        </label>
                        <p className="text-[10px] text-white font-bold">
                            {aiState.cities?.find((c:any) => c.id === form.targetCityId)?.name}
                        </p>
                    </div>
                )}

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center gap-2"><MessageSquare size={10} /> Edit Konteks Tambahan</label>
                    <textarea value={form.generationContext} onChange={(e) => setForm((p:any) => ({...p, generationContext: e.target.value}))} placeholder="Konteks AI..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-brand-orange resize-none h-16" />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-[9px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-2"><Tags size={10}/> Kategori</label>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {selectedCats.map((cat: string, i: number) => (
                            <span key={i} className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded px-2 py-1 text-[9px] font-bold flex items-center gap-1">
                                {cat} <button onClick={() => removeCategory(cat)}><XIcon size={8}/></button>
                            </span>
                        ))}
                    </div>
                    <input list="categories" value={catInput} onChange={(e) => setCatInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addCategory(catInput); } }} placeholder="+ Tambah Kategori..." className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none" />
                    <datalist id="categories">{ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat} />)}</datalist>
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2 flex items-center justify-between"><span className="flex items-center gap-2"><FileType size={10} /> Panjang Artikel</span><span className="text-brand-orange">{form.targetWordCount} Kata</span></label>
                    <input type="range" min="400" max="3000" step="100" value={form.targetWordCount} onChange={(e) => setForm((p:any) => ({...p, targetWordCount: parseInt(e.target.value)}))} className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-brand-orange" />
                </div>

                <div className="bg-white/5 p-3 rounded-lg border border-white/10 space-y-3">
                    <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block flex items-center gap-2"><User size={10} /> Persona & Tone</label>
                    <div className="grid grid-cols-2 gap-1.5">
                        {NARRATIVE_TONES.slice(0, 6).map((tone) => {
                            const isActive = aiState.selectedTones?.includes(tone.id);
                            return (
                                <button key={tone.id} onClick={() => toggleTone(tone.id)} className={`text-[9px] p-1.5 rounded text-left border transition-all ${isActive ? 'bg-brand-orange/20 border-brand-orange text-white' : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'}`}>
                                    <div className="flex items-center gap-1 font-bold"><div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-orange' : 'bg-gray-600'}`}></div>{tone.label.split('(')[0]}</div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
