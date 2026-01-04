
import React from 'react';
import { Briefcase, X as XIcon, Sparkles, Wand2, Save } from 'lucide-react';
import { Input, TextArea, Button, LoadingSpinner } from '../ui';

export const JobEditor = ({ 
    form, 
    setForm, 
    loading, 
    aiLoading, 
    actions 
}: any) => {
    return (
        <div className="bg-brand-dark p-6 rounded-xl border border-white/5 sticky top-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Briefcase size={18} className="text-brand-orange"/>
                    {form.id ? "Edit Lowongan" : "Buat Lowongan"}
                </h3>
                {form.id && (
                    <button type="button" onClick={actions.resetForm} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded"><XIcon size={12} /> Batal</button>
                )}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
                <div>
                    <label className="text-xs text-gray-500 font-bold mb-1 block uppercase">Posisi / Jabatan</label>
                    <Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="py-2 text-sm" placeholder="Contoh: Digital Marketing"/>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block uppercase">Divisi</label>
                        <Input value={form.division} onChange={e => setForm({...form, division: e.target.value})} className="py-2 text-sm" placeholder="Contoh: Marketing"/>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block uppercase">Tipe</label>
                        <select 
                            value={form.type} 
                            onChange={e => setForm({...form, type: e.target.value as any})} 
                            className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-brand-orange outline-none"
                        >
                            <option>Full-time</option>
                            <option>Part-time</option>
                            <option>Internship</option>
                            <option>Freelance</option>
                        </select>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-500 font-bold uppercase">Deskripsi Pekerjaan</label>
                        <button 
                            onClick={() => actions.generateJobContent('desc')} 
                            disabled={aiLoading.desc} 
                            className="text-[9px] text-blue-400 flex items-center gap-1 hover:text-white"
                        >
                            {aiLoading.desc ? <LoadingSpinner size={10}/> : <><Sparkles size={10}/> AI Generate</>}
                        </button>
                    </div>
                    <TextArea 
                        value={form.description} 
                        onChange={e => setForm({...form, description: e.target.value})} 
                        className="h-24 text-xs" 
                        placeholder="Jelaskan tanggung jawab utama..."
                    />
                </div>

                <div>
                    <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-500 font-bold uppercase">Kualifikasi (Requirements)</label>
                        <button 
                            onClick={() => actions.generateJobContent('req')} 
                            disabled={aiLoading.req} 
                            className="text-[9px] text-blue-400 flex items-center gap-1 hover:text-white"
                        >
                            {aiLoading.req ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> AI List</>}
                        </button>
                    </div>
                    <TextArea 
                        value={form.requirements} 
                        onChange={e => setForm({...form, requirements: e.target.value})} 
                        className="h-24 text-xs" 
                        placeholder="- Minimal S1&#10;- Pengalaman 1 tahun"
                    />
                </div>

                <div className="flex items-center gap-2 pt-2 bg-black/20 p-2 rounded border border-white/5">
                    <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="accent-brand-orange w-4 h-4"/>
                    <span className={`text-xs font-bold ${form.is_active ? 'text-green-400' : 'text-gray-500'}`}>
                        {form.is_active ? 'Status: OPEN (Tayang)' : 'Status: CLOSED (Disembunyikan)'}
                    </span>
                </div>

                <Button onClick={actions.handleSubmit} disabled={loading} className="w-full py-2.5 text-sm mt-2 shadow-neon">
                    {loading ? <LoadingSpinner /> : <><Save size={16}/> SIMPAN LOWONGAN</>}
                </Button>
            </div>
        </div>
    );
};
