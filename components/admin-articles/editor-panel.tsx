
import React, { useState } from 'react';
import { Wand2, RefreshCw, MessageSquare, FileType } from 'lucide-react';
import { Article } from '../../types';
import { StatusPicker, CoverManager, StrategyPicker, InternalLinkSelector, CategoryManager, TonePersonaPicker } from './editor/molecules';
import { EditorCard, SectionLabel } from './editor/atoms';

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
    socialState: any,
    availablePillars: Article[]
}) => {
    
    const [catInput, setCatInput] = useState('');
    const [pillarSearch, setPillarSearch] = useState('');
    
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

    const togglePillarLink = (id: number) => {
        const current = form.related_pillars || [];
        if (current.includes(id)) {
            setForm((p:any) => ({ ...p, related_pillars: current.filter((pid: number) => pid !== id) }));
        } else {
            setForm((p:any) => ({ ...p, related_pillars: [...current, id] }));
        }
    };

    // Filter pilar berdasarkan search
    const filteredPillars = availablePillars.filter(p => 
        p.title.toLowerCase().includes(pillarSearch.toLowerCase()) && p.id !== form.id
    );

    // Render Step 0 & 1 is already handled by EditorPanel in original implementation, 
    // we keep the assembly structure here for Step 2 (The main config).

    if (aiState.step === 2 || form.id) {
        return (
            <div className="flex flex-col h-full bg-brand-dark overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center shrink-0 bg-brand-dark z-20">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2"><Wand2 size={14}/> Konfigurasi</h3>
                    <button onClick={actions.resetForm} className="text-[10px] text-red-400 hover:text-red-300 border border-red-500/20 px-2 py-1 rounded bg-red-500/10 flex items-center gap-1">
                        <RefreshCw size={10} /> Reset
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5 pb-32">
                    <StatusPicker 
                        status={form.status}
                        scheduledFor={form.scheduled_for}
                        onStatusChange={(s: string) => setForm((p:any) => ({...p, status: s}))}
                        onScheduleChange={(val: string) => setForm((p:any) => ({...p, scheduled_for: val}))}
                    />

                    <CoverManager 
                        preview={form.imagePreview}
                        loading={loading.generatingImage}
                        onGenerate={actions.runImage}
                        onUpload={(e: any) => {
                            const file = e.target.files ? e.target.files[0] : null;
                            if (file) setForm((prev:any) => ({...prev, uploadFile: file, imagePreview: URL.createObjectURL(file)}));
                        }}
                    />

                    <StrategyPicker 
                        type={form.type}
                        onChange={(t: string) => setForm((p:any) => ({...p, type: t}))}
                    />

                    <InternalLinkSelector 
                        pillars={filteredPillars}
                        linkedIds={form.related_pillars}
                        onToggle={togglePillarLink}
                        search={pillarSearch}
                        onSearch={setPillarSearch}
                    />

                    <EditorCard>
                        <SectionLabel icon={MessageSquare}>Konteks Tambahan</SectionLabel>
                        <textarea 
                            value={form.generationContext} 
                            onChange={(e) => setForm((p:any) => ({...p, generationContext: e.target.value}))} 
                            placeholder="Konteks AI..." 
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-[10px] text-white outline-none focus:border-brand-orange resize-none h-16" 
                        />
                    </EditorCard>

                    <CategoryManager 
                        selected={selectedCats}
                        input={catInput}
                        onInputChange={setCatInput}
                        onAdd={addCategory}
                        onRemove={removeCategory}
                    />

                    <EditorCard>
                        <div className="flex justify-between items-center mb-2">
                             <SectionLabel icon={FileType} className="mb-0">Panjang Artikel</SectionLabel>
                             <span className="text-brand-orange text-[10px] font-bold">{form.targetWordCount} Kata</span>
                        </div>
                        <input 
                            type="range" min="400" max="3000" step="100" 
                            value={form.targetWordCount} 
                            onChange={(e) => setForm((p:any) => ({...p, targetWordCount: parseInt(e.target.value)}))} 
                            className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-brand-orange" 
                        />
                    </EditorCard>

                    <TonePersonaPicker 
                        selected={aiState.selectedTones}
                        onToggle={toggleTone}
                    />
                </div>
            </div>
        );
    }

    // Fallback if step is 0 or 1 (Keeping the original research UI for those steps)
    return null; 
};
