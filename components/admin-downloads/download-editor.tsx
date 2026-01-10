
import React, { useRef } from 'react';
import { Edit, Plus, UploadCloud, Sparkles, Wand2, Save, X, Lock, FileDigit } from 'lucide-react';
import { Button, Input, TextArea, LoadingSpinner } from '../ui';
import { DOWNLOAD_CATEGORIES } from './types';
import { getCategoryColor } from './utils';

export const DownloadEditor = ({ logic }: { logic: any }) => {
    const { form, setForm, contextInput, setContextInput, generatedTitles, uploadFile, setUploadFile, loading, aiLoading, actions } = logic;
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden shadow-2xl relative">
            {/* HEADER (Fixed) */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0 bg-brand-dark z-20">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {form.id ? <Edit size={16} className="text-brand-orange"/> : <Plus size={16} className="text-brand-orange"/>} 
                    {form.id ? 'Edit File' : 'Upload Baru'}
                </h3>
                <div className="flex items-center gap-2">
                    {form.id && (
                        <button onClick={actions.resetForm} className="text-gray-500 hover:text-white p-2 rounded hover:bg-white/5 transition-colors" title="Batal">
                            <X size={16}/>
                        </button>
                    )}
                    <Button onClick={actions.handleSubmit} disabled={loading} className="py-1.5 px-4 text-xs h-9 shadow-neon font-bold">
                        {loading ? <LoadingSpinner size={14}/> : <><Save size={14}/> SIMPAN</>}
                    </Button>
                </div>
            </div>
            
            {/* BODY (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 min-h-0 relative">
                
                {/* Section 1: Jenis File */}
                <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">Jenis File</label>
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

                {/* Section 2: Magic Titles Results (Optional) */}
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

                {/* Section 3: File & Atribut */}
                <div className="bg-white/5 rounded-xl border border-white/5 p-4">
                    <label className="text-[10px] text-gray-500 font-bold uppercase mb-3 block">File & Atribut</label>
                    
                    <div className="grid grid-cols-12 gap-4 mb-3">
                        {/* Left: Compact Upload (Full Height of Row) */}
                        <div className="col-span-5">
                            <div 
                                className="border-2 border-dashed border-white/10 rounded-xl text-center hover:border-brand-orange/50 hover:bg-brand-orange/5 transition-all cursor-pointer relative group flex flex-col items-center justify-center h-full p-2 min-h-[140px]"
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
                                    <span className="text-[10px] font-bold text-gray-300 leading-tight px-1 break-words w-full">
                                        {uploadFile ? uploadFile.name : "Klik Upload"}
                                    </span>
                                    {!uploadFile && <span className="text-[8px] text-gray-500">Max 100MB</span>}
                                </div>
                            </div>
                        </div>

                        {/* Right: Meta Fields (Stacked) */}
                        <div className="col-span-7 space-y-2">
                            {/* Konteks (Moved Here) */}
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1 block">Konteks Produk</label>
                                <Input 
                                    value={contextInput} 
                                    onChange={(e) => setContextInput(e.target.value)} 
                                    placeholder="Contoh: Driver Eppos..." 
                                    className="text-xs h-8 w-full bg-black/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[9px] text-gray-500 font-bold uppercase mb-1 block">Versi</label>
                                    <Input value={form.version || ''} onChange={e => setForm((p:any) => ({...p, version: e.target.value}))} placeholder="v1.0" className="text-xs h-8 bg-black/20"/>
                                </div>
                                <div>
                                    <label className="text-[9px] text-gray-500 font-bold uppercase mb-1 block">Ukuran</label>
                                    <Input value={form.file_size || ''} onChange={e => setForm((p:any) => ({...p, file_size: e.target.value}))} placeholder="15 MB" className="text-xs h-8 bg-black/20"/>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1 block">OS Support</label>
                                <select 
                                    value={form.os_support || 'Windows'} 
                                    onChange={e => setForm((p:any) => ({...p, os_support: e.target.value}))} 
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-brand-orange outline-none h-8"
                                >
                                    <option>Windows</option>
                                    <option>Android</option>
                                    <option>iOS</option>
                                    <option>MacOS</option>
                                    <option>Linux</option>
                                    <option>All</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] text-red-400 font-bold uppercase mb-1 block flex items-center gap-1">
                                    <Lock size={10}/> PIN (Opsional)
                                </label>
                                <Input 
                                    value={form.access_key || ''} 
                                    onChange={e => setForm((p:any) => ({...p, access_key: e.target.value}))} 
                                    placeholder="123456..." 
                                    className="text-xs font-bold bg-black/20 border-red-500/20 focus:border-red-500 text-white placeholder-gray-600 tracking-widest h-8"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Bottom: URL Input (Full Width) */}
                    <div>
                        <Input 
                            value={form.file_url || ''} 
                            onChange={e => setForm((p:any) => ({...p, file_url: e.target.value}))} 
                            placeholder="Atau paste Link URL Eksternal (G-Drive / Mediafire)..." 
                            className="text-[10px] bg-black/20 h-9"
                        />
                    </div>
                </div>

                {/* Section 4: Judul & Deskripsi */}
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1.5 block">Judul & Deskripsi</label>
                        <div className="flex gap-2 mb-3">
                            <Input 
                                value={form.title || ''} 
                                onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} 
                                placeholder="Judul File Lengkap..." 
                                className="text-sm font-bold flex-1"
                            />
                            <button 
                                onClick={actions.researchTitles} 
                                disabled={aiLoading.research} 
                                className="shrink-0 h-11 w-11 bg-brand-orange text-white rounded-lg font-bold hover:bg-brand-action transition-all disabled:opacity-50 flex items-center justify-center shadow-neon border border-white/10" 
                                title="Generate Judul Otomatis"
                            >
                                {aiLoading.research ? <LoadingSpinner size={18}/> : <Sparkles size={20}/>}
                            </button>
                        </div>
                        
                        <div className="relative">
                            <TextArea value={form.description || ''} onChange={e => setForm((p:any) => ({...p, description: e.target.value}))} placeholder="Deskripsi file, cara install singkat..." className="h-24 text-xs leading-relaxed"/>
                            <button 
                                onClick={actions.generateDescription} 
                                disabled={aiLoading.desc} 
                                className="absolute bottom-2 right-2 text-[10px] text-blue-400 hover:text-white flex items-center gap-1 bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-blue-500/30 shadow-lg"
                            >
                                {aiLoading.desc ? <LoadingSpinner size={10}/> : <><Wand2 size={10}/> Auto-Desc</>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
