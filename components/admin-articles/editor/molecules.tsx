
import React from 'react';
import { Send, Clock, ImageIcon, Sparkles, Loader2, Link2, Search, CheckCircle2, Plus, Tags, X as XIcon, User, FileType, MessageSquare, Layout } from 'lucide-react';
import { SectionLabel, EditorCard, IconButton } from './atoms';
import { Article } from '../../../types';
import { ARTICLE_CATEGORIES, NARRATIVE_TONES } from '../types';

export const StatusPicker = ({ status, scheduledFor, onStatusChange, onScheduleChange }: any) => (
    <EditorCard>
        <SectionLabel icon={Send}>Status Penerbitan</SectionLabel>
        <div className="flex gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            {['draft', 'published', 'scheduled'].map((s) => (
                <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={`flex-1 py-2 rounded text-[9px] font-bold uppercase transition-all ${status === s ? 'bg-brand-orange text-white shadow-neon-text' : 'text-gray-500 hover:text-gray-300'}`}
                >
                    {s}
                </button>
            ))}
        </div>
        {status === 'scheduled' && (
            <div className="mt-4 animate-fade-in space-y-2">
                 <SectionLabel icon={Clock} className="text-brand-orange">Atur Jadwal Tayang</SectionLabel>
                 <input 
                    type="datetime-local" 
                    value={scheduledFor}
                    onChange={(e) => onScheduleChange(e.target.value)}
                    className="w-full bg-black/60 border border-brand-orange/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                 />
            </div>
        )}
    </EditorCard>
);

export const CoverManager = ({ preview, onGenerate, loading, onUpload }: any) => (
    <EditorCard>
        <div className="flex justify-between items-center mb-3">
             <SectionLabel icon={ImageIcon}>Aset Visual (Cover)</SectionLabel>
             <button 
                onClick={onGenerate}
                disabled={loading || !preview}
                className="text-[9px] text-brand-orange hover:text-white flex items-center gap-1 disabled:opacity-30 transition-colors"
             >
                {loading ? <Loader2 size={10} className="animate-spin"/> : <><Sparkles size={10}/> AI Generate</>}
             </button>
        </div>
        <div className="aspect-video bg-black rounded-lg border border-white/5 overflow-hidden relative group">
            {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Cover Preview" />
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 text-[10px]">
                    <ImageIcon size={24} className="mb-1 opacity-20"/>
                    Belum Ada Cover
                </div>
            )}
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="text-[10px] text-white font-bold uppercase">Ganti Manual</span>
                <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
            </label>
        </div>
    </EditorCard>
);

export const StrategyPicker = ({ type, onChange }: any) => (
    <EditorCard>
        <SectionLabel icon={Layout}>Strategi Konten (SEO Structure)</SectionLabel>
        <div className="flex gap-2">
            <IconButton 
                label="Pillar Page" 
                active={type === 'pillar'} 
                onClick={() => onChange('pillar')}
                color="yellow-500"
            />
            <IconButton 
                label="Cluster Content" 
                active={type === 'cluster'} 
                onClick={() => onChange('cluster')}
                color="blue-500"
            />
        </div>
    </EditorCard>
);

export const InternalLinkSelector = ({ pillars, linkedIds, onToggle, search, onSearch }: any) => (
    <EditorCard className="space-y-3">
        <SectionLabel icon={Link2} className="text-brand-orange">Koneksi Strategis (Linking)</SectionLabel>
        <div className="relative">
            <Search size={10} className="absolute left-2 top-2.5 text-gray-500" />
            <input 
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Cari pilar pendukung..."
                className="w-full bg-black/40 border border-white/5 rounded-lg pl-6 pr-2 py-1.5 text-[10px] text-white focus:border-brand-orange outline-none"
            />
        </div>
        <div className="max-h-32 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
            {pillars.map((p: Article) => {
                const isLinked = linkedIds?.includes(p.id);
                return (
                    <button 
                        key={p.id}
                        onClick={() => onToggle(p.id)}
                        className={`w-full text-left p-2 rounded text-[9px] border transition-all flex items-center justify-between group ${isLinked ? 'bg-brand-orange/20 border-brand-orange text-white' : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'}`}
                    >
                        <span className="truncate flex-1">{p.title}</span>
                        {isLinked ? <CheckCircle2 size={10} className="text-brand-orange shrink-0 ml-2" /> : <Plus size={10} className="opacity-0 group-hover:opacity-100 shrink-0 ml-2" />}
                    </button>
                );
            })}
        </div>
    </EditorCard>
);

export const CategoryManager = ({ selected, onAdd, onRemove, input, onInputChange }: any) => (
    <div className="space-y-3">
        <SectionLabel icon={Tags}>Kategori</SectionLabel>
        <div className="flex flex-wrap gap-1.5 mb-2">
            {selected.map((cat: string, i: number) => (
                <span key={i} className="bg-brand-orange/20 text-brand-orange border border-brand-orange/30 rounded px-2 py-1 text-[9px] font-bold flex items-center gap-1">
                    {cat} <button onClick={() => onRemove(cat)}><XIcon size={8}/></button>
                </span>
            ))}
        </div>
        <input 
            list="categories" 
            value={input} 
            onChange={(e) => onInputChange(e.target.value)} 
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); onAdd(input); } }} 
            placeholder="+ Tambah Kategori..." 
            className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-brand-orange outline-none" 
        />
        <datalist id="categories">{ARTICLE_CATEGORIES.map(cat => <option key={cat} value={cat} />)}</datalist>
    </div>
);

export const TonePersonaPicker = ({ selected, onToggle }: any) => (
    <EditorCard>
        <SectionLabel icon={User}>Persona & Tone</SectionLabel>
        <div className="grid grid-cols-2 gap-1.5">
            {NARRATIVE_TONES.slice(0, 6).map((tone) => {
                const isActive = selected?.includes(tone.id);
                return (
                    <button 
                        key={tone.id} 
                        onClick={() => onToggle(tone.id)} 
                        className={`text-[9px] p-1.5 rounded text-left border transition-all ${isActive ? 'bg-brand-orange/20 border-brand-orange text-white' : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'}`}
                    >
                        <div className="flex items-center gap-1 font-bold">
                            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-brand-orange' : 'bg-gray-600'}`}></div>
                            {tone.label.split('(')[0]}
                        </div>
                    </button>
                );
            })}
        </div>
    </EditorCard>
);
