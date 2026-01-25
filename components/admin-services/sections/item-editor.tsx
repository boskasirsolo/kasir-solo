
import React from 'react';
import { Save, RefreshCw, Sparkles, Zap, ListChecks, Coffee, Loader2, CheckSquare, Square } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner } from '../../ui';
import { formatNumberInput, cleanNumberInput } from '../../../utils';

export const ItemEditor = ({ form, setForm, onSave, onAi, aiLoading, saving, targets, hideHeader, onReset }: any) => (
    <div className={`bg-brand-card border border-white/10 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col ${hideHeader ? 'border-none shadow-none bg-transparent' : 'p-6 h-full'}`}>
        {!hideHeader && (
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange"><Sparkles size={20} /></div>
                    <div><h3 className="text-white font-bold text-lg leading-none">{form.id ? 'Edit Strategi' : 'Item Baru'}</h3><p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">Kalkulator Engine</p></div>
                </div>
                <button onClick={onReset} className="text-gray-500 hover:text-white transition-colors"><RefreshCw size={18}/></button>
            </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-1">
            <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
                <div>
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Jenis Item:</label>
                    <div className="flex gap-2">
                        {['base', 'addon'].map(r => (
                            <button key={r} onClick={() => setForm({...form, role: r})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${form.role === r ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-black/20 border-white/5 text-gray-500'}`}>{r === 'base' ? 'PAKET' : 'ADD-ON'}</button>
                        ))}
                    </div>
                </div>
                {form.role === 'addon' && (
                    <div className="animate-fade-in">
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Tier:</label>
                        <div className="flex gap-2">
                            {['basic', 'advanced'].map(t => (
                                <button key={t} onClick={() => setForm({...form, tier: t})} className={`flex-1 py-2 rounded-xl border text-[10px] font-bold transition-all ${form.tier === t ? 'bg-blue-600 border-blue-600 text-white shadow-neon' : 'bg-black/20 border-white/5 text-gray-500'}`}>{t.toUpperCase()}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Broadcast Target:</label>
                <div className="grid grid-cols-3 gap-2">
                    {targets.map((svc: any) => (
                        <button key={svc.id} onClick={() => setForm({...form, targets: form.targets.includes(svc.id) ? form.targets.filter((t:any) => t !== svc.id) : [...form.targets, svc.id]})} className={`flex items-center gap-2 p-2 rounded-lg border text-[9px] font-bold ${form.targets.includes(svc.id) ? 'bg-brand-orange/20 border-brand-orange text-white' : 'bg-black/40 border-white/5 text-gray-600'}`}>{form.targets.includes(svc.id) ? <CheckSquare size={12}/> : <Square size={12}/>}{svc.label}</button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div><label className="text-[10px] text-gray-500 font-bold mb-2 block">LABEL</label><Input value={form.label} onChange={(e:any) => setForm({...form, label: e.target.value})} className="bg-black/40"/></div>
                <div><label className="text-[10px] text-gray-500 font-bold mb-2 block">HARGA (IDR)</label><Input value={formatNumberInput(form.price)} onChange={(e:any) => setForm({...form, price: cleanNumberInput(e.target.value)})} className="bg-black/40 font-mono text-brand-orange font-black"/></div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center"><label className="text-[10px] text-gray-500 font-bold uppercase">Inclusions (Markdown)</label><button onClick={() => onAi('includes')} className="text-[9px] text-blue-400 flex items-center gap-1">{aiLoading === 'includes' ? <LoadingSpinner size={8}/> : <><Zap size={10}/> AI</>}</button></div>
                <TextArea value={form.includesStr} onChange={(e:any) => setForm({...form, includesStr: e.target.value})} className="h-24 text-[10px] font-mono bg-black/20" />
                
                <div className="flex justify-between items-center"><label className="text-[10px] text-gray-500 font-bold uppercase">Detail Strategi</label><button onClick={() => onAi('longDesc')} className="text-[9px] text-blue-400 flex items-center gap-1">{aiLoading === 'longDesc' ? <LoadingSpinner size={8}/> : <><Zap size={10}/> AI</>}</button></div>
                <TextArea value={form.longDesc} onChange={(e:any) => setForm({...form, longDesc: e.target.value})} className="h-40 text-[10px] bg-black/20" />
            </div>

            <div className="pt-6 border-t border-white/5 pb-10">
                <Button onClick={onSave} disabled={saving} className="w-full py-4 shadow-neon font-black bg-brand-gradient">{saving ? <LoadingSpinner /> : 'SIMPAN & BROADCAST'}</Button>
            </div>
        </div>
    </div>
);
