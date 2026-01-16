
import React from 'react';
import { Edit, UploadCloud, ShieldCheck, X as XIcon, Plus, Link as LinkIcon, Wand2, Star, User, Save, Layers } from 'lucide-react';
import { Button, LoadingSpinner } from '../ui';

export const EditorPanel = ({ 
    form, setForm, 
    testiForm, setTestiForm, 
    loading, useWatermark, setUseWatermark, 
    actions,
    hideHeader = false
}: any) => {
    
    // Multi Image Handlers
    const handleFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setForm((p: any) => ({ ...p, newGalleryFiles: [...p.newGalleryFiles, ...Array.from(e.target.files!)] }));
        }
    };

    return (
        <div className={`flex flex-col h-full bg-brand-dark overflow-hidden ${hideHeader ? '' : 'border border-white/5 rounded-xl shadow-xl'}`}>
            <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
                {!hideHeader && (
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
                        <Edit size={12}/> Project Details
                    </h4>
                )}

                <div className="space-y-6">
                    
                    {/* COVER IMAGE */}
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Foto Utama (Cover)</label>
                        <div className="w-full h-40 bg-black rounded-xl border border-white/10 relative group overflow-hidden flex items-center justify-center">
                            {form.imagePreview ? (
                                <img src={form.imagePreview} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center text-gray-500">
                                    <UploadCloud size={24} className="mx-auto mb-2 opacity-50"/>
                                    <span className="text-[10px]">Upload Cover</span>
                                </div>
                            )}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setForm((p:any) => ({...p, uploadFile: e.target.files![0], imagePreview: URL.createObjectURL(e.target.files![0])}))} />
                        </div>
                    </div>

                    {/* WATERMARK */}
                    <div className="flex items-center justify-between bg-black/20 p-3 rounded-lg border border-white/5">
                        <span className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                            <ShieldCheck size={12} className={useWatermark ? "text-green-500" : "text-gray-600"}/> 
                            Auto Watermark
                        </span>
                        <input type="checkbox" checked={useWatermark} onChange={e => setUseWatermark(e.target.checked)} className="accent-brand-orange w-4 h-4" />
                    </div>

                    {/* GALLERY IMAGES */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Galeri Tambahan</label>
                            <span className="text-[9px] text-gray-500">{form.galleryImages.length + form.newGalleryFiles.length} foto</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {form.galleryImages.map((url: string, idx: number) => (
                                <div key={`ex-${idx}`} className="relative aspect-square rounded bg-black border border-white/10 group">
                                    <img src={url} className="w-full h-full object-cover rounded" />
                                    <button onClick={() => setForm((p:any) => ({...p, galleryImages: p.galleryImages.filter((_:any, i:number) => i !== idx)}))} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><XIcon size={10}/></button>
                                </div>
                            ))}
                            {form.newGalleryFiles.map((file: File, idx: number) => (
                                <div key={`new-${idx}`} className="relative aspect-square rounded bg-black border border-green-500/30">
                                    <img src={URL.createObjectURL(file)} className="w-full h-full object-cover rounded opacity-80" />
                                    <button onClick={() => setForm((p:any) => ({...p, newGalleryFiles: p.newGalleryFiles.filter((_:any, i:number) => i !== idx)}))} className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"><XIcon size={10}/></button>
                                </div>
                            ))}
                            <label className="relative aspect-square rounded bg-white/5 border border-dashed border-white/20 hover:border-brand-orange/50 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-brand-orange transition-colors">
                                <Plus size={16} />
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleFilesSelect} />
                            </label>
                        </div>
                    </div>

                    {/* DETAILS INPUTS */}
                    <div className="grid grid-cols-2 gap-3">
                        <select 
                            value={actions.getCurrentType()} 
                            onChange={e => actions.handleTypeChange(e.target.value)} 
                            className="bg-black text-white text-[10px] p-2 rounded border border-white/10 focus:border-brand-orange outline-none"
                        >
                            <option value="hardware">Hardware</option>
                            <option value="web">Website</option>
                            <option value="mobile">Mobile App</option>
                            <option value="desktop">Desktop App</option>
                        </select>
                        <div className="relative">
                            <LinkIcon size={12} className="absolute left-2 top-2.5 text-gray-500" />
                            <input value={form.client_url} onChange={e => setForm((p:any) => ({...p, client_url: e.target.value}))} placeholder="Link Project" className="w-full bg-black text-white text-[10px] py-2 pl-6 pr-2 rounded border border-white/10 focus:border-brand-orange outline-none" />
                        </div>
                    </div>

                    <input value={form.title} onChange={e => setForm((p:any) => ({...p, title: e.target.value}))} placeholder="Nama Project..." className="w-full bg-black text-white text-sm font-bold py-3 px-4 rounded border border-white/10 focus:border-brand-orange outline-none" />

                    {/* CASE STUDY (AI) */}
                    <div className="space-y-3">
                        {['challenge', 'solution', 'result'].map((field) => (
                            <div key={field} className="relative">
                                <input 
                                    value={form[`cs_${field}`]} 
                                    onChange={e => setForm((p:any) => ({...p, [`cs_${field}`]: e.target.value}))} 
                                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)} 
                                    className="w-full bg-black text-white text-[10px] p-2 pr-8 rounded border border-white/10 focus:border-brand-orange outline-none" 
                                />
                                <button 
                                    onClick={() => actions.generateSpecificPoint(field)}
                                    disabled={loading.generatingSpecific === field}
                                    className="absolute right-1 top-1 p-1 text-gray-500 hover:text-brand-orange transition-colors"
                                >
                                    {loading.generatingSpecific === field ? <LoadingSpinner size={10}/> : <Wand2 size={12}/>}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* TESTIMONIAL */}
                    <div className="border-t border-white/10 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none mb-4">
                            <input type="checkbox" checked={testiForm.hasTestimonial} onChange={e => setTestiForm((p:any) => ({...p, hasTestimonial: e.target.checked}))} className="accent-brand-orange w-3 h-3" />
                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Include Testimoni</span>
                        </label>

                        {testiForm.hasTestimonial && (
                            <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-xl p-4 space-y-3">
                                <div className="flex gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black border border-brand-orange/30 overflow-hidden relative group shrink-0">
                                        {testiForm.imagePreview ? <img src={testiForm.imagePreview} className="w-full h-full object-cover" /> : <User size={16} className="text-gray-500 m-auto mt-2"/>}
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => e.target.files?.[0] && setTestiForm((p:any) => ({...p, uploadFile: e.target.files![0], imagePreview: URL.createObjectURL(e.target.files![0])}))} />
                                    </div>
                                    <input value={testiForm.client_name} onChange={e => setTestiForm((p:any) => ({...p, client_name: e.target.value}))} placeholder="Nama Klien" className="flex-1 bg-transparent border-b border-brand-orange/30 text-xs text-white focus:outline-none py-1" />
                                </div>
                                <textarea value={testiForm.content} onChange={e => setTestiForm((p:any) => ({...p, content: e.target.value}))} placeholder="Isi testimoni..." className="w-full h-16 bg-black/40 text-[10px] text-white p-2 rounded border border-brand-orange/10 focus:border-brand-orange outline-none resize-none" />
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => <Star key={s} size={12} className={`cursor-pointer ${s<=testiForm.rating?'text-yellow-500 fill-yellow-500':'text-gray-600'}`} onClick={() => setTestiForm((p:any)=>({...p, rating: s}))}/>)}
                                </div>
                            </div>
                        )}
                    </div>

                    <Button onClick={actions.handleSubmit} disabled={loading.uploading || loading.processingImage} className="w-full py-3 shadow-neon">
                        {loading.processingImage ? <><LoadingSpinner/> Watermarking...</> : loading.uploading ? <LoadingSpinner /> : <><Save size={16} /> SIMPAN PROJECT</>}
                    </Button>

                </div>
            </div>
        </div>
    );
};
