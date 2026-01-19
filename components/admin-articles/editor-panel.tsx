
import React, { useState } from 'react';
import { Wand2, RefreshCw, MessageSquare, FileType, Search, Target, MapPin, Sparkles, Loader2, ArrowLeft, BarChart, Layout } from 'lucide-react';
import { Article } from '../../types';
import { StatusModule, MediaModule, LinkingModule, TagModule, PersonaModule } from './editor/molecules';
import { EditorCard, SectionLabel, ActionPill } from './editor/atoms';
import { Button } from '../ui';

export const EditorPanel = ({ form, setForm, loading, aiState, actions, availablePillars }: any) => {
    const [catInput, setCatInput] = useState('');
    const [pillarSearch, setPillarSearch] = useState('');
    const [researchTopicInput, setResearchTopicInput] = useState('');
    const [useCityTemplate, setUseCityTemplate] = useState(false);

    const selectedCats = form.category ? form.category.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
    const addCat = (c: string) => { if (c && !selectedCats.includes(c)) setForm((p:any) => ({...p, category: [...selectedCats, c].join(', ')})); setCatInput(''); };
    const remCat = (c: string) => setForm((p:any) => ({...p, category: selectedCats.filter(x => x !== c).join(', ')}));

    if (aiState.step === 0 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4 items-center justify-center text-center overflow-y-auto custom-scrollbar pb-32">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)] shrink-0"><Search size={32} className="text-blue-400" /></div>
                <h3 className="text-white font-bold text-lg mb-2">Riset Judul Viral</h3>
                <p className="text-gray-500 text-xs max-w-[220px] mb-6 leading-relaxed">Tentukan jenis artikel, lalu AI akan mencari topik volume tertinggi.</p>
                <div className="w-full max-w-[250px] mb-4 text-left bg-black/30 p-3 rounded-xl border border-white/5">
                    <label className="flex items-center justify-between cursor-pointer group"><span className="text-[10px] text-gray-400 font-bold uppercase flex items-center gap-2 group-hover:text-brand-orange"><MapPin size={12} /> Target Wilayah</span><input type="checkbox" checked={useCityTemplate} onChange={(e) => setUseCityTemplate(e.target.checked)} className="accent-brand-orange w-4 h-4"/></label>
                    {useCityTemplate && (<div className="mt-2 animate-fade-in"><select value={form.targetCityId} onChange={(e) => setForm((p:any) => ({...p, targetCityId: parseInt(e.target.value), title: `Jual Paket Mesin Kasir di ${aiState.cities.find((c:any) => c.id === parseInt(e.target.value))?.name} - Lengkap`}))} className="w-full bg-brand-dark text-white text-[10px] p-2 rounded border border-brand-orange/30 outline-none"><option value={0}>-- Pilih Kota --</option>{aiState.cities?.map((city: any) => (<option key={city.id} value={city.id}>{city.name}</option>))}</select></div>)}
                </div>
                {!useCityTemplate && (<div className="w-full max-w-[250px] mb-4 text-left"><SectionLabel icon={Target}>Topik Spesifik</SectionLabel><input type="text" value={researchTopicInput} onChange={(e) => setResearchTopicInput(e.target.value)} placeholder="Contoh: Pajak, Stok..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange" /></div>)}
                <div className="w-full max-w-[250px] mb-6 text-left">
                    <SectionLabel icon={Layout}>SEO Strategy</SectionLabel>
                    <div className="flex gap-2">
                        <ActionPill active={form.type === 'pillar'} onClick={() => setForm((p:any) => ({...p, type: 'pillar'}))} label="Pillar" color="yellow-500" />
                        <ActionPill active={form.type === 'cluster'} onClick={() => setForm((p:any) => ({...p, type: 'cluster'}))} label="Cluster" color="blue-500" />
                    </div>
                </div>
                <Button onClick={() => useCityTemplate ? aiState.setStep(2) : actions.runResearch(researchTopicInput)} disabled={loading.researching} className="w-full max-w-[250px] py-3 shadow-neon">{loading.researching ? <Loader2 size={16} className="animate-spin"/> : <><Sparkles size={16}/> {useCityTemplate ? 'GUNAKAN TEMPLATE' : 'RISET MARKET'}</>}</Button>
            </div>
        );
    }

    if (aiState.step === 1 && !form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark p-4">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10"><button onClick={() => aiState.setStep(0)} className="p-1 hover:bg-white/10 rounded"><ArrowLeft size={16} className="text-gray-400"/></button><h3 className="text-white font-bold text-sm">Hasil Riset</h3></div>
                <div className="flex-grow overflow-y-auto custom-scrollbar space-y-2 pb-32">
                    {aiState.keywords.map((k: any, i: number) => (
                        <div key={i} onClick={() => actions.selectTopic(k)} className="p-3 rounded-lg bg-white/5 border border-white/5 hover:border-brand-orange hover:bg-brand-orange/5 cursor-pointer transition-all"><h4 className="text-xs font-bold text-white mb-2">{k.keyword}</h4><div className="flex items-center gap-2"><span className="text-[9px] px-2 py-0.5 rounded border border-green-500/20 text-green-400 flex items-center gap-1"><BarChart size={8} /> {k.volume}</span></div></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center bg-brand-dark z-20 shrink-0">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi</h3>
                <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10"><RefreshCw size={10} /> Reset</button>
            </div>
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5 pb-32">
                <StatusModule status={form.status} scheduledFor={form.scheduled_for} onStatusChange={(s:any) => setForm((p:any) => ({...p, status: s}))} onScheduleChange={(v:any) => setForm((p:any) => ({...p, scheduled_for: v}))} />
                <MediaModule preview={form.imagePreview} loading={loading.generatingImage} onGenerate={actions.runImage} onUpload={(e:any) => { const f = e.target.files?.[0]; if (f) setForm((p:any) => ({...p, uploadFile: f, imagePreview: URL.createObjectURL(f)})); }} />
                <EditorCard><SectionLabel icon={Layout}>Strategi Konten</SectionLabel><div className="flex gap-2"><ActionPill active={form.type === 'pillar'} label="Pillar" color="yellow-500" onClick={() => setForm((p:any)=>({...p, type:'pillar'}))} /><ActionPill active={form.type === 'cluster'} label="Cluster" color="blue-500" onClick={() => setForm((p:any)=>({...p, type:'cluster'}))} /></div></EditorCard>
                <LinkingModule pillars={availablePillars.filter((p:any) => p.title.toLowerCase().includes(pillarSearch.toLowerCase()) && p.id !== form.id)} linkedIds={form.related_pillars} onToggle={(id:number) => setForm((p:any) => ({...p, related_pillars: p.related_pillars?.includes(id) ? p.related_pillars.filter((x:any)=>x!==id) : [...(p.related_pillars||[]), id]}))} search={pillarSearch} onSearch={setPillarSearch} />
                <EditorCard><SectionLabel icon={MessageSquare}>Konteks AI</SectionLabel><textarea value={form.generationContext} onChange={(e) => setForm((p:any) => ({...p, generationContext: e.target.value}))} placeholder="Misal: Jangan sebut harga..." className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-brand-orange h-16 resize-none" /></EditorCard>
                <TagModule selected={selectedCats} input={catInput} onInputChange={setCatInput} onAdd={addCat} onRemove={remCat} />
                <EditorCard><div className="flex justify-between items-center mb-2"><SectionLabel icon={FileType} className="mb-0">Panjang</SectionLabel><span className="text-brand-orange text-[10px] font-bold">{form.targetWordCount} Kata</span></div><input type="range" min="400" max="6000" step="100" value={form.targetWordCount} onChange={(e) => setForm((p:any) => ({...p, targetWordCount: parseInt(e.target.value)}))} className="w-full h-1 bg-black rounded-lg appearance-none cursor-pointer accent-brand-orange" /></EditorCard>
                <PersonaModule selected={aiState.selectedTones} onToggle={(id:string) => aiState.setSelectedTones(aiState.selectedTones.includes(id) ? aiState.selectedTones.filter((x:any)=>x!==id) : [...aiState.selectedTones, id].slice(-3))} />
            </div>
        </div>
    );
};
