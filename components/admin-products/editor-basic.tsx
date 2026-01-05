
import React, { useRef, useState } from 'react';
import { Tag, Edit, ImageIcon, UploadCloud, ShieldCheck, Wand2, Sparkles, DollarSign, Filter, Save, Plus, X as XIcon, Link as LinkIcon, ExternalLink, Grid, PlayCircle, FolderOpen } from 'lucide-react';
import { Input, LoadingSpinner, Button } from '../ui';
import { formatNumberInput } from '../../utils';
import { PRODUCT_CATEGORIES } from './types';
import { Label, FieldHeader } from './atoms';
import { MediaLibraryModal } from '../admin/media-library';

export const EditorBasic = ({ 
    form, 
    setForm, 
    loading, 
    useWatermark, 
    setUseWatermark, 
    aiActions,
    actions 
}: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galleryInputRef = useRef<HTMLInputElement>(null);
    const [showMediaLib, setShowMediaLib] = useState(false);
    const [targetField, setTargetField] = useState<'cover' | 'gallery'>('cover');

    const openMediaLib = (target: 'cover' | 'gallery') => {
        setTargetField(target);
        setShowMediaLib(true);
    };

    const handleMediaSelect = (url: string) => {
        if (targetField === 'cover') {
            setForm((p: any) => ({ ...p, imagePreview: url, uploadFile: null }));
        } else {
            setForm((p: any) => ({ ...p, galleryImages: [...p.galleryImages, url] }));
        }
        setShowMediaLib(false);
    };

    const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setForm((p: any) => ({ ...p, newGalleryFiles: [...p.newGalleryFiles, ...Array.from(e.target.files!)] }));
        }
    };

    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden relative">
            
            {showMediaLib && <MediaLibraryModal onSelect={handleMediaSelect} onClose={() => setShowMediaLib(false)} />}

            <div className="p-4 border-b border-white/5 shrink-0 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {form.id ? <Edit size={16} className="text-brand-orange"/> : <Tag size={16} className="text-brand-orange"/>}
                    INFO DASAR
                </h3>
                {form.id && <button onClick={actions.resetForm} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 border border-white/10 px-2 py-1 rounded"><XIcon size={10}/> Batal</button>}
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5">
                
                {/* 1. COVER IMAGE */}
                <div className="space-y-2">
                    <Label icon={ImageIcon}>Foto Utama (Cover)</Label>
                    <div className="relative w-full h-48 bg-black/40 rounded-xl overflow-hidden border border-white/10 group">
                        {form.imagePreview ? (
                            <img src={form.imagePreview} alt="Preview" className="w-full h-full object-contain p-2" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                                <ImageIcon size={32} />
                                <span className="text-[10px]">Preview Produk</span>
                            </div>
                        )}
                        
                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-6">
                            <button onClick={aiActions.generateImage} disabled={loading.generatingImage} className="w-full py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-blue-500">
                                {loading.generatingImage ? <LoadingSpinner size={12}/> : <><Wand2 size={12}/> AI Gen</>}
                            </button>
                            <button onClick={() => fileInputRef.current?.click()} className="w-full py-1.5 bg-white/10 text-white text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-white/20 border border-white/20">
                                <UploadCloud size={12}/> Upload
                            </button>
                            <button onClick={() => openMediaLib('cover')} className="w-full py-1.5 bg-brand-orange/20 text-brand-orange text-[10px] font-bold rounded flex items-center justify-center gap-2 hover:bg-brand-orange/30 border border-brand-orange/30">
                                <FolderOpen size={12}/> Pilih Media
                            </button>
                            <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => { const file = e.target.files ? e.target.files[0] : null; if (file) setForm((p: any) => ({ ...p, uploadFile: file, imagePreview: URL.createObjectURL(file) })); }} />
                        </div>
                    </div>
                </div>

                {/* 2. PRODUCT GALLERY (MULTIPLE) */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label icon={Grid}>Galeri Tambahan</Label>
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
                        <div className="relative aspect-square rounded bg-white/5 border border-dashed border-white/20 hover:border-brand-orange/50 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-brand-orange transition-colors gap-1 group">
                            <Plus size={14} />
                            <div className="flex gap-1 absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/80 items-center justify-center">
                                <button onClick={() => galleryInputRef.current?.click()} className="p-1.5 bg-white/10 rounded hover:bg-white/20 text-white" title="Upload"><UploadCloud size={12}/></button>
                                <button onClick={() => openMediaLib('gallery')} className="p-1.5 bg-brand-orange/20 rounded hover:bg-brand-orange/30 text-brand-orange" title="Pilih Media"><FolderOpen size={12}/></button>
                            </div>
                            <input type="file" multiple accept="image/*" ref={galleryInputRef} className="hidden" onChange={handleGalleryUpload} />
                        </div>
                    </div>
                </div>

                {/* 3. VIDEO URL */}
                <div className="space-y-1">
                    <Label icon={PlayCircle}>Video Produk (YouTube/MP4)</Label>
                    <div className="relative">
                        <input 
                            value={form.videoUrl}
                            onChange={(e) => setForm((p:any) => ({...p, videoUrl: e.target.value}))}
                            placeholder="https://youtube.com/..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange placeholder-gray-600"
                        />
                    </div>
                </div>

                {/* 4. WATERMARK TOGGLE */}
                <div className="flex items-center justify-between bg-black/20 p-2.5 rounded-lg border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-2">
                        <ShieldCheck size={12} className={useWatermark ? "text-green-500" : "text-gray-600"}/> 
                        Watermark Otomatis
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={useWatermark} onChange={e => setUseWatermark(e.target.checked)} className="sr-only peer" />
                        <div className="w-8 h-4 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                </div>

                {/* 5. KEYWORDS (AI CONTEXT) */}
                <div className="bg-brand-orange/5 p-3 rounded-lg border border-brand-orange/20">
                    <Label icon={Sparkles} className="text-brand-orange mb-2">Keywords (Trigger AI)</Label>
                    <input 
                        value={form.shortDesc} 
                        onChange={e => setForm((p:any) => ({...p, shortDesc: e.target.value}))} 
                        placeholder="Cth: printer thermal, cepat, garansi 1 thn..." 
                        className="w-full bg-black/40 border border-brand-orange/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange placeholder-gray-600"
                    />
                </div>

                {/* 6. NAME */}
                <div>
                    <FieldHeader label="Nama Produk" onAI={aiActions.generateTitle} loading={loading.generatingTitle} />
                    <Input value={form.name} onChange={e => setForm((p:any) => ({...p, name: e.target.value}))} placeholder="Nama Produk..." className="py-2 text-xs font-bold" />
                </div>

                {/* 7. PRICE & CATEGORY */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <Label>Kategori</Label>
                        <div className="relative">
                            <Filter size={12} className="absolute left-2.5 top-3 text-gray-500"/>
                            <select 
                                value={form.category} 
                                onChange={e => setForm((p:any) => ({...p, category: e.target.value}))}
                                className="w-full bg-brand-card border border-white/10 rounded-lg pl-8 pr-2 py-2.5 text-[10px] text-white focus:border-brand-orange outline-none appearance-none"
                            >
                                {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <Label>Harga (IDR)</Label>
                        <div className="relative">
                            <DollarSign size={12} className="absolute left-2.5 top-3 text-gray-500"/>
                            <Input 
                                value={form.price} 
                                onChange={e => setForm((p:any) => ({...p, price: formatNumberInput(e.target.value)}))} 
                                placeholder="0" 
                                className="pl-8 py-2 text-xs font-mono" 
                            />
                        </div>
                    </div>
                </div>

                {/* 8. AFFILIATE / EXTERNAL LINK */}
                <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
                    <Label icon={LinkIcon} className="text-blue-400 mb-2">Link Affiliate / Marketplace (Opsional)</Label>
                    <div className="space-y-2">
                        <div className="relative">
                            <ExternalLink size={12} className="absolute left-2.5 top-2.5 text-gray-500"/>
                            <input 
                                value={form.affiliateLink} 
                                onChange={e => setForm((p:any) => ({...p, affiliateLink: e.target.value}))} 
                                placeholder="https://tokopedia.com/..." 
                                className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-2 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-gray-600"
                            />
                        </div>
                        <input 
                            value={form.ctaText} 
                            onChange={e => setForm((p:any) => ({...p, ctaText: e.target.value}))} 
                            placeholder="Text Tombol (Default: Beli Sekarang)" 
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-gray-600"
                        />
                    </div>
                </div>

            </div>

            {/* STICKY FOOTER */}
            <div className="p-4 border-t border-white/5 bg-brand-dark shrink-0">
                <Button onClick={actions.handleSubmit} disabled={loading.uploading || loading.processingImage} className="w-full py-3 text-xs font-bold shadow-neon">
                    {loading.processingImage ? <><LoadingSpinner/> Watermarking...</> : loading.uploading ? <LoadingSpinner /> : (form.id ? <><Save size={14}/> UPDATE PRODUK</> : <><Plus size={14}/> SIMPAN PRODUK</>)}
                </Button>
            </div>
        </div>
    );
};
