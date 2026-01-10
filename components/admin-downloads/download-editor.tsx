
import React, { useRef } from 'react';
import { Edit, Plus, UploadCloud, Sparkles, Wand2, Save, X, Lock } from 'lucide-react';
import { Button, Input, TextArea, LoadingSpinner } from '../ui';
import { DOWNLOAD_CATEGORIES } from './types';
import { getCategoryColor } from './utils';

export const DownloadEditor = ({ logic }: { logic: any }) => {
    const { form, setForm, contextInput, setContextInput, generatedTitles, uploadFile, setUploadFile, loading, aiLoading, actions } = logic;
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden shadow-2xl relative">
            {/* HEADER (Sticky / Fixed Top) */}
            <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0 bg-brand-dark z-20 relative">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {form.id ? <Edit size={16} className="text-brand-orange"/> : <Plus size={16} className="text-brand-orange"/>} 
                    {form.id ? 'Edit File' : 'Upload File Baru'}
                </h3>
                {form.id && (
                    <button onClick={actions.resetForm} className="text-xs text-gray-500 hover:text-white flex items-center gap-1 border border-white/10 px-2 py-1 rounded bg-white/5 transition-colors">
                        <X size={12}/> Batal
                    </button>
                )}
            </div>
            
            {/* SCROLLABLE FORM CONTENT - Using flex-1 and min-h-0 to ensure proper scroll containment */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-5 min-h-0">
                
                {/* Step 1: Type & Context */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="mb-4">
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">1. Jenis File</label>
                        {/* Grid cols 4 forces single row. whitespace-nowrap prevents text break */}
                        <div className="grid grid-cols-4 gap-2">
                            {DOWNLOAD_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setForm((p:any) => ({...p, category: cat.id}))}
                                    className={`${getCategoryColor(cat.id, form.category === cat.id)} justify-center px-1 text-[9px] whitespace-nowrap overflow-hidden text-ellipsis`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex justify-between">
                            <span>2. Konteks Produk</span>
                            <span className="text-brand-orange flex items-center gap-1 opacity-80"><Sparkles size={8}/> AI Assist</span>
                        </label>
                        <div className="flex gap-2">
                            <Input 
                                value={contextInput} 
                                onChange={(e) => setContextInput(e.target.value)} 
                                placeholder="Contoh: Driver Eppos RPP02..." 
                                className="text-xs h-10 flex-1"
                            />
                            <button 
                                onClick={actions.researchTitles} 
                                disabled={aiLoading.research} 
                                className="shrink-0 h-10 w-10 bg-brand-orange text-white rounded-lg font-bold hover:bg-brand-action transition-all disabled:opacity-50 flex items-center justify-center shadow-neon border border-white/10" 
                                title="Riset Judul Otomatis"
                            >
                                {aiLoading.research ? <LoadingSpinner size={16}/> : <Sparkles size={18}/>}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Step 2: Magic Titles (Optional) */}
                {generatedTitles.length > 0 && (
                    <div className="p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-lg animate-fade-in">
                        <label className="text-[10px] text-brand-orange font-bold uppercase mb-2 block flex items-center gap-2"><Sparkles size={10}/> Hasil Riset Judul</label>
                        <div className="space-y-2">
                            {generatedTitles.map((t: any, idx: number) => (
                                <button 
                                    key={idx} 
                                    onClick={() => { setForm((p:any) => ({...p, title: t.title})); actions.setGeneratedTitles([]); }}
                                    className="w-full text-left p-3 rounded border transition-all flex items-center justify-between gap-3 bg-black/40 text-gray-300 border-white/5 hover:bg-white/5 hover:border-white/20"
                                >
                                    <span className="text-[11px] font-medium leading-snug line-clamp-2 flex-1">{t.title}</span>
                                    <div className="flex flex-col items-end gap-1 shrink-0 text-right min-w-[70px]">
                                        <span className="text-[10px] font-bold px-1.5 rounded bg-white/5 text-gray-400">{t.competition}</span>
                                        <span className="text-xs font-mono font-bold text-white">{t.volume}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: File Upload */}
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">3. File Sumber</label>
                    <div 
                        className="border-2 border-dashed border-white/10 p-6 rounded-xl text-center mb-3 hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all cursor-pointer relative group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef}
                            onChange={e => e.target.files?.[0] && setUploadFile(e.target.files[0])} 
                            className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2 pointer-events-none">
                            <div className="p-3 rounded-full bg-black/40 border border-white/10 group-hover:border-brand-orange/30 transition-colors">
                                <UploadCloud size={20} className={uploadFile ? "text-brand-orange" : "text-gray-500"}/>
                            </div>
                            <span className="text-xs font-bold text-gray-300">{uploadFile ? uploadFile.name : "Klik Upload File Local"}</span>
                            {!uploadFile && <span className="text-[9px] text-gray-500">Maksimal 100MB</span>}
                        </div>
                    </div>
                    <Input 
                        value={form.file_url || ''} 
                        onChange={e => setForm((p:any) => ({...p, file_url: e.target.value}))} 
                        placeholder="Atau paste URL Eksternal (G-Drive / Mediafire)..." 
                        className="text-[10px] bg-black/40 h-9"
                    />
                </div>

                {/* Step 4: Final Info */}
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">4. Judul Final</label>
                        <Input value={form.title || ''} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Judul File Lengkap..." className="text-sm font-bold"/>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Versi</label>
                            <Input value={form.version || ''} onChange={e => setForm((p:any) => ({...p, version: e.target.value}))} placeholder="v1.0" className="text-xs"/>
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">OS Support</label>
                            <select 
                                value={form.os_support || 'Windows'} 
                                onChange={e => setForm((p:any) => ({...p, os_support: e.target.value}))} 
                                className="w-full bg-brand-card border border-white/10 rounded-lg px-3 py-2.5 text-xs text-white focus:border-brand-orange outline-none"
                            >
                                <option>Windows</option>
                                <option>Android</option>
                                <option>iOS</option>
                                <option>MacOS</option>
                                <option>Linux</option>
                                <option>All</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative">
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Deskripsi</label>
                        <TextArea value={form.description || ''} onChange={e => setForm((p:any) => ({...p, description: e.target.value}))} placeholder="Deskripsi file, cara install singkat..." className="h-24 text-xs leading-relaxed"/>
                        <button 
                            onClick={actions.generateDescription} 
                            disabled={aiLoading.desc} 
                            className="absolute bottom-2 right-2 text-[10px] text-blue-400 hover:text-white flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30 shadow-lg"
                        >
                            {aiLoading.desc ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Desc</>}
                        </button>
                    </div>
                    
                    {/* ACCESS KEY (SECURE GATE) - FIXED VISIBILITY */}
                    <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
                        <label className="text-[10px] text-red-400 font-bold uppercase mb-2 block flex items-center gap-1">
                            <Lock size={12}/> PIN Akses (Proteksi)
                        </label>
                        <Input 
                            value={form.access_key || ''} 
                            onChange={e => setForm((p:any) => ({...p, access_key: e.target.value}))} 
                            placeholder="Buat PIN (Contoh: 123456)..." 
                            className="text-sm font-bold bg-black/40 border-red-500/20 focus:border-red-500 text-white placeholder-gray-600 tracking-widest"
                        />
                        <p className="text-[10px] text-gray-500 mt-2 italic leading-relaxed">
                            *Jika diisi, user <strong>WAJIB</strong> masukkan PIN ini untuk download. Biarkan kosong jika file ini Publik (Gratis).
                        </p>
                    </div>
                </div>

                <div className="pt-2 pb-4">
                    <Button onClick={actions.handleSubmit} disabled={loading} className="w-full text-xs py-3 shadow-neon font-bold">
                        {loading ? <><LoadingSpinner size={14}/> MEMPROSES...</> : <><Save size={14}/> SIMPAN & TERBITKAN</>}
                    </Button>
                </div>
            </div>
        </div>
    );
};
