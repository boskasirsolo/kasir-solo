
import React from 'react';
import { ImageIcon, Sparkles, Loader2, UploadCloud, Save, FolderOpen } from 'lucide-react';
import { LiveEditor } from '../live-editor';
import { LoadingSpinner } from '../../ui';

export const CanvasEditor = ({ manager, onMediaOpen }: any) => {
    const { form, setForm, aiLogic, actions } = manager;

    return (
        <div className="flex flex-col h-full bg-black">
            {/* CANVAS HEADER */}
            <div className="p-4 md:p-6 border-b border-white/10 bg-brand-dark/50 backdrop-blur-sm z-10 sticky top-0 shrink-0">
                <div className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        value={form.title}
                        onChange={(e) => setForm((p:any) => ({...p, title: e.target.value}))}
                        placeholder="Judul Artikel..."
                        className="w-full bg-transparent text-xl md:text-3xl font-display font-bold text-white placeholder-gray-600 outline-none"
                    />

                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            {['draft', 'published', 'scheduled'].map((s) => (
                                <button key={s} onClick={() => setForm((p:any) => ({...p, status: s}))} className={`px-3 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${form.status === s ? 'bg-white/10 text-white' : 'text-gray-600'}`}>{s}</button>
                            ))}
                        </div>

                        <div className="flex items-center gap-2">
                            <button onClick={() => actions.runWrite()} disabled={aiLogic.loading.generatingText} className="h-10 px-4 rounded-lg font-bold text-[10px] bg-brand-gradient text-white flex items-center gap-2 shadow-neon transition-all active:scale-95 disabled:opacity-50">
                                {aiLogic.loading.generatingText ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                <span className="hidden md:inline uppercase tracking-widest">GENERATE (AI)</span>
                            </button>
                            <button onClick={() => actions.saveArticle()} disabled={aiLogic.loading.uploading} className="w-10 h-10 bg-brand-orange hover:bg-brand-action text-white rounded-lg shadow-neon flex items-center justify-center transition-all active:scale-90">
                                {aiLogic.loading.uploading ? <LoadingSpinner size={18}/> : <Save size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* WRITING AREA */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative pb-24 lg:pb-8">
                <div className="w-full mb-10 group/cover relative">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-white/5 bg-gray-900 shadow-2xl relative">
                        {form.imagePreview ? <img src={form.imagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/[0.02]"><ImageIcon size={48} className="mb-4 opacity-20" /><p className="text-xs font-bold uppercase">Belum Ada Cover</p></div>}
                        <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-opacity ${form.imagePreview ? 'opacity-0 group-hover/cover:opacity-100' : 'opacity-100'}`}>
                            <button onClick={() => actions.runImage()} disabled={aiLogic.loading.generatingImage} className="flex flex-col items-center gap-2 p-4 bg-blue-600/20 border border-blue-500/30 rounded-2xl transition-all w-24">
                                {aiLogic.loading.generatingImage ? <Loader2 size={24} className="text-blue-400 animate-spin"/> : <Sparkles size={24} className="text-blue-400" />}
                                <span className="text-[10px] font-bold text-blue-400 uppercase">AI Gen</span>
                            </button>
                            <label className="flex flex-col items-center gap-2 p-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer w-24"><UploadCloud size={24} className="text-white"/><span className="text-[10px] font-bold text-white uppercase">Upload</span><input type="file" className="hidden" onChange={(e) => e.target.files?.[0] && actions.handleCoverUpload(e.target.files[0])} /></label>
                            <button onClick={onMediaOpen} className="flex flex-col items-center gap-2 p-4 bg-brand-orange/10 border border-brand-orange/20 rounded-2xl w-24"><FolderOpen size={24} className="text-brand-orange" /><span className="text-[10px] font-bold text-brand-orange uppercase">Media</span></button>
                        </div>
                    </div>
                </div>

                <LiveEditor content={form.content} onChange={(v) => setForm((p: any) => ({ ...p, content: v }))} />

                {(aiLogic.loading.generatingText || aiLogic.loading.generatingImage) && (
                    <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-fade-in backdrop-blur-md">
                        <Loader2 size={48} className="text-brand-orange animate-spin mb-4" />
                        <p className="text-white font-bold text-lg animate-pulse">{aiLogic.loading.progressMessage || 'SIBOS lagi ngeracik...'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
