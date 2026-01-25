
import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Check } from 'lucide-react';
import { PlatformIcon, CaptionEditor } from '../ui-parts';
import { ALL_PLATFORMS } from '../constants';
import { SOCIAL_TONES } from '../types';

export const ComposerPanel = ({ source, composer, state, actions }: any) => {
    const fileRef = useRef<HTMLInputElement>(null);
    if (!source.selectedItem) return <div className="flex-1 bg-black/80 flex items-center justify-center text-gray-500">Pilih konten dulu, Bos.</div>;

    return (
        <div className="w-full lg:flex-1 h-full bg-brand-dark flex flex-col relative overflow-y-auto lg:overflow-hidden">
            <div className="p-4 border-b border-white/5 bg-black/20 shrink-0">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">2. Target & Tone</h3>
                <div className="flex gap-2 flex-wrap">
                    {ALL_PLATFORMS.map(plat => (
                        <button key={plat} onClick={() => composer.setPlatforms((p: any) => ({ ...p, [plat]: !p[plat] }))} className={`p-2 rounded-lg border transition-all ${composer.platforms[plat] ? 'bg-blue-500/20 border-blue-500 text-blue-400' : 'bg-white/5 border-white/10 text-gray-600'}`}><PlatformIcon id={plat}/></button>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
                    <div className="relative w-20 h-20 bg-black rounded-lg border border-white/10 overflow-hidden group shrink-0" onClick={() => fileRef.current?.click()}>
                        <img src={state.customImage || source.selectedItem.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center"><UploadCloud size={20} className="text-white"/></div>
                        <input type="file" ref={fileRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && actions.handleImageUpload(e.target.files[0])} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-white text-sm truncate">{source.selectedItem.title}</h4>
                        <button onClick={() => fileRef.current?.click()} className="mt-2 text-[10px] text-brand-orange flex items-center gap-1"><ImageIcon size={12}/> Ganti Gambar</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {SOCIAL_TONES.map(t => (
                        <button key={t.id} onClick={() => composer.toggleTone(t.id)} className={`px-2 py-2 rounded text-[10px] font-bold border transition-all ${composer.selectedTones.includes(t.id) ? 'bg-brand-orange text-white border-brand-orange' : 'bg-black/20 text-gray-400 border-white/10'}`}>{t.label}</button>
                    ))}
                </div>
                <div className="flex-1 flex flex-col h-[400px]">
                    <div className="flex gap-1 border-b border-white/10 overflow-x-auto custom-scrollbar-hide">
                        <button onClick={() => composer.setActiveTab('master')} className={`px-4 py-2 text-[10px] font-bold uppercase rounded-t-lg transition-all ${composer.activeTab === 'master' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:bg-white/5'}`}>MASTER</button>
                        {ALL_PLATFORMS.filter(p => composer.platforms[p]).map(tab => (
                            <button key={tab} onClick={() => composer.setActiveTab(tab)} className={`px-4 py-2 rounded-t-lg transition-all ${composer.activeTab === tab ? 'bg-brand-orange text-white' : 'bg-white/5 text-gray-500'}`}><PlatformIcon id={tab} size={12}/></button>
                        ))}
                    </div>
                    <CaptionEditor value={composer.captions[composer.activeTab]} onChange={(v: string) => composer.setCaptions((p: any) => ({ ...p, [composer.activeTab]: v }))} onGenerate={() => composer.generateAI(composer.activeTab, source.selectedItem)} isGenerating={composer.isAiLoading} platform={composer.activeTab} />
                </div>
            </div>
        </div>
    );
};
