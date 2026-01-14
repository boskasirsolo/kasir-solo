
import React from 'react';
import { X, Save, Edit3, PlusCircle, Sparkles, MessageSquare, Loader2 } from 'lucide-react';
import { Button, Input, TextArea } from '../ui';
import { TypeSelectorButton } from './ui-atoms';
import { SEOFormState, SEOTemplate } from './types';

export const CityEditorPanel = ({ 
    form, 
    setForm, 
    templates,
    onSubmit, 
    onReset,
    onGenerate,
    loading,
    isGenerating,
    hideHeader = false
}: { 
    form: SEOFormState, 
    setForm: (f: React.SetStateAction<SEOFormState>) => void, 
    templates: SEOTemplate[],
    onSubmit: () => void, 
    onReset: () => void,
    onGenerate: () => void,
    loading: boolean,
    isGenerating: boolean,
    hideHeader?: boolean
}) => {
    return (
        <div className={`h-full bg-brand-dark flex flex-col overflow-hidden ${hideHeader ? '' : 'rounded-2xl border border-white/5 shadow-2xl p-6 sticky top-6'}`}>
            {!hideHeader && (
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        {form.id ? <Edit3 size={18} className="text-brand-orange"/> : <PlusCircle size={18} className="text-brand-orange"/>}
                        {form.id ? 'EDIT WILAYAH' : 'WILAYAH BARU'}
                    </h3>
                    {form.id && (
                        <button onClick={onReset} className="text-[10px] text-red-400 font-bold hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20">
                            <X size={12}/> BATAL
                        </button>
                    )}
                </div>
            )}

            <div className={`space-y-6 flex-grow overflow-y-auto custom-scrollbar ${hideHeader ? 'p-0' : ''}`}>
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Nama Kota / Kabupaten</label>
                    <Input 
                        value={form.name}
                        onChange={(e) => setForm(prev => ({...prev, name: e.target.value}))}
                        placeholder="Contoh: Magetan..."
                        className="text-sm font-bold bg-black/40"
                    />
                </div>

                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block tracking-widest">Tipe Wilayah</label>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <TypeSelectorButton active={form.type === 'Kandang'} onClick={() => setForm(prev => ({...prev, type: 'Kandang'}))} label="Kandang" icon="🦁" />
                        <TypeSelectorButton active={form.type === 'Ekspansi'} onClick={() => setForm(prev => ({...prev, type: 'Ekspansi'}))} label="Ekspansi" icon="🚀" />
                    </div>
                </div>

                <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/20 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-[10px] text-brand-orange font-bold uppercase flex items-center gap-2">
                            <Sparkles size={12}/> AI Master Template
                        </label>
                        <button onClick={onGenerate} disabled={isGenerating || form.template_id === 0} className="text-[10px] text-blue-400 hover:text-white flex items-center gap-1 disabled:opacity-30">
                            {isGenerating ? <Loader2 size={10} className="animate-spin"/> : <><Sparkles size={10}/> Generate Narasi</>}
                        </button>
                    </div>
                    <select 
                        value={form.template_id}
                        onChange={(e) => setForm(prev => ({...prev, template_id: parseInt(e.target.value)}))}
                        className="w-full bg-black/40 border border-brand-orange/30 text-white text-xs p-2 rounded outline-none"
                    >
                        <option value={0}>-- Pilih Master Template --</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
                    </select>
                    
                    <label className="text-[10px] text-gray-500 font-bold uppercase block mt-2">Narasi SEO (Preview)</label>
                    <TextArea 
                        value={form.narrative}
                        onChange={(e) => setForm(prev => ({...prev, narrative: e.target.value}))}
                        placeholder="AI akan menulis narasi di sini..."
                        className="h-32 text-xs leading-relaxed bg-black/40 border-brand-orange/10"
                    />
                </div>

                <div className="pt-4 pb-2">
                    <Button onClick={onSubmit} disabled={loading} className="w-full py-4 text-sm font-bold shadow-neon">
                        {loading ? 'MENYIMPAN...' : (form.id ? 'UPDATE TARGET' : 'TERBITKAN HALAMAN')}
                    </Button>
                </div>
            </div>
        </div>
    );
};
