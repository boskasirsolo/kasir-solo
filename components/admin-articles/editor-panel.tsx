
import React from 'react';
import { Sparkles, Edit, RefreshCw, Wand2, Loader2, Save } from 'lucide-react';
import { Article } from '../../types';
import { Button, Input, TextArea, LoadingSpinner } from '../ui';
import { PRESET_TOPICS } from './types';

// --- ATOM: Strategy Switcher ---
const StrategySwitcher = ({ type, onChange }: { type: string, onChange: (t: 'pillar' | 'cluster') => void }) => (
    <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-4">
        <label className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block mb-2">Strategi Konten</label>
        <div className="flex gap-2">
            <button 
                onClick={() => onChange('pillar')}
                className={`flex-1 py-1.5 text-[10px] rounded border transition-all ${type === 'pillar' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
            >
                Pillar Page
            </button>
            <button 
                onClick={() => onChange('cluster')}
                className={`flex-1 py-1.5 text-[10px] rounded border transition-all ${type === 'cluster' ? 'bg-blue-500/20 border-blue-500 text-blue-500' : 'bg-black/20 border-white/10 text-gray-500 hover:bg-white/5'}`}
            >
                Cluster
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
    
    // --- MODE 1: AI STUDIO (New Article) ---
    if (!form.id && aiState.step < 3) {
        return (
            <div className="flex flex-col h-full bg-brand-dark">
                <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Sparkles size={14}/> AI Studio</h3>
                </div>
                
                <div className="p-4 space-y-6 overflow-y-auto custom-scrollbar flex-grow">
                    {/* Topic Selection */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Pilih Topik (Context)</label>
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
                        {loading.researching ? <LoadingSpinner size={14}/> : <><Sparkles size={14} /> GENERATE TOPICS</>}
                    </Button>

                    {/* Manual Override */}
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink-0 mx-2 text-[9px] text-gray-600 uppercase">Atau</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>
                    
                    <button 
                        onClick={() => aiState.setStep(3)}
                        className="w-full py-3 border border-white/10 rounded-lg text-gray-400 text-xs font-bold hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Edit size={14} /> TULIS MANUAL
                    </button>

                    {/* AI Results */}
                    {aiState.step === 1 && (
                        <div className="grid gap-2 mt-4 animate-fade-in">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Hasil Riset AI:</label>
                            {/* Assuming keywords is populated in logic layer */}
                            {/* In real implementation, pass keywords via props. For now using placeholder logic as data is in parent */}
                            <p className="text-[10px] text-gray-500 italic">Pilih topik dari hasil riset di atas (Data keywords di-handle oleh logic layer).</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // --- MODE 2: EDITOR (Writing/Editing) ---
    return (
        <div className="flex flex-col h-full bg-brand-dark">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2"><Edit size={14}/> Editor</h3>
                <button onClick={actions.resetForm} className="text-[10px] text-red-400 flex items-center gap-1 border border-red-500/20 px-2 py-1 rounded bg-red-500/10 hover:bg-red-500/20 transition-colors"><RefreshCw size={10} /> Reset</button>
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-4">
                <Input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul Artikel"/>
                
                <StrategySwitcher 
                    type={form.type} 
                    onChange={(t) => {
                        setForm((p:any) => ({...p, type: t, pillar_id: t === 'pillar' ? 0 : p.pillar_id}));
                    }} 
                />

                {form.type === 'cluster' && (
                    <select 
                        value={form.pillar_id || 0}
                        onChange={(e) => setForm((p:any) => ({...p, pillar_id: parseInt(e.target.value)}))}
                        className="w-full bg-black text-white text-[10px] border border-white/10 rounded px-2 py-2 focus:border-brand-orange outline-none mb-4"
                    >
                        <option value={0}>-- Pilih Induk (Pillar) --</option>
                        {availablePillars.filter(p => p.id !== form.id).map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                )}

                <div className="relative group">
                    <TextArea value={form.content} onChange={e => setForm((p:any) => ({...p, content: e.target.value}))} placeholder="# Konten..." className="h-96 text-[10px] font-mono pb-12 resize-none custom-scrollbar"/>
                    
                    {/* Floating AI Button */}
                    <div className="absolute bottom-4 right-4 flex gap-2">
                            <button 
                            onClick={actions.runWrite}
                            disabled={loading.generatingText}
                            className="bg-brand-orange/90 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 rounded-full shadow-lg hover:bg-brand-orange flex items-center gap-1 border border-white/20 transition-all transform hover:scale-105"
                            >
                            {loading.generatingText ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>}
                            Regenerate AI
                            </button>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-white/5 bg-brand-dark/90 backdrop-blur-sm sticky bottom-0 z-10">
                <div className="grid grid-cols-2 gap-2">
                    <select value={form.status} onChange={(e) => setForm((p:any) => ({...p, status: e.target.value}))} className="bg-black/40 text-white text-[10px] rounded border border-white/10 px-2 focus:border-brand-orange outline-none">
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                    </select>
                    <Button onClick={actions.saveArticle} disabled={loading.uploading} className="py-2 text-[10px]">
                        {loading.uploading ? <LoadingSpinner size={12}/> : <><Save size={12}/> SIMPAN</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
