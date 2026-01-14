
import React, { useRef, useState } from 'react';
import { Tag, Edit, ImageIcon, UploadCloud, ShieldCheck, Wand2, Sparkles, DollarSign, Filter, X as XIcon, Link as LinkIcon, ExternalLink, FolderOpen } from 'lucide-react';
import { Input, LoadingSpinner } from '../ui';
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
        <div className="bg-brand-dark rounded-2xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden relative">
            
            {showMediaLib && <MediaLibraryModal onSelect={handleMediaSelect} onClose={() => setShowMediaLib(false)} />}

            <div className="p-5 border-b border-white/10 shrink-0 flex justify-between items-center bg-black/20">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {form.id ? <Edit size={18} className="text-brand-orange"/> : <Tag size={18} className="text-brand-orange"/>}
                    {form.id ? "EDIT INFO" : "INFO BARU"}
                </h3>
                {form.id && (
                    <button 
                        onClick={actions.resetForm} 
                        className="text-[10px] text-red-400 font-bold hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20"
                    >
                        <XIcon size={12}/> BATAL
                    </button>
                )}
            </div>

            <div className="flex-grow overflow-y-auto p-5 md:p-6 custom-scrollbar space-y-6">
                
                {/* 1. MEDIA VISUAL */}
                <div className="space-y-3">
                    <Label icon={ImageIcon}>Media & Galeri</Label>
                    
                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar items-start -mx-1 px-1">
                        
                        {/* COVER IMAGE */}
                        <div className="shrink-0 text-center space-y-2">
                            <div className="relative w-24 h-24 bg-black rounded-xl overflow-hidden border-2 border-brand-orange shadow-neon-text/20 group">
                                {form.imagePreview ? (
                                    <img src={form.imagePreview} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/5">
                                        <ImageIcon size={20} />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-1">
                                    <button onClick={aiActions.generateImage} disabled={loading.generatingImage} className="w-full py-1 bg-blue-600 text-white rounded text-[9px] font-bold">AI GEN</button>
                                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-1 bg-white/20 text-white rounded text-[9px] font-bold">UPLOAD</button>
                                </div>
                                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => { const file = e.target.files ? e.target.files[0] : null; if (file) setForm((p: any) => ({ ...p, uploadFile: file, imagePreview: URL.createObjectURL(file) })); }} />
                            </div>
                            <span className="text-[9px] font-bold text-brand-orange uppercase tracking-widest">Utama</span>
                        </div>

                        {/* ADD TO GALLERY */}
                        <div className="shrink-0 text-center space-y-2">
                            <div 
                                onClick={() => openMediaLib('gallery')}
                                className="w-24 h-24 rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-brand-orange/50 cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-brand-orange transition-all group"
                            >
                                <FolderOpen size={20} className="mb-1" />
                                <span className="text-[9px] font-bold">Pilih Aset</span>
                            </div>
                            <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">+ Galeri</span>
                        </div>

                        {/* EXISTING GALLERY */}
                        {form.galleryImages.map((url: string, idx: number) => (
                            <div key={`ex-${idx}`} className="relative w-24 h-24 shrink-0 rounded-xl bg-black border border-white/10 overflow-hidden group">
                                <img src={url} className="w-full h-full object-cover" />
                                <button onClick={() => setForm((p:any) => ({...p, galleryImages: p.galleryImages.filter((_:any, i:number) => i !== idx)}))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-lg"><XIcon size={10}/></button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. WATERMARK & SETTINGS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-white/5">
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-2">
                            <ShieldCheck size={14} className={useWatermark ? "text-green-500" : "text-gray-700"}/> 
                            Watermark
                        </span>
                        <input type="checkbox" checked={useWatermark} onChange={e => setUseWatermark(e.target.checked)} className="accent-brand-orange w-4 h-4 cursor-pointer" />
                    </div>
                    <div className="relative">
                        <Filter size={14} className="absolute left-3 top-3 text-gray-500"/>
                        <select 
                            value={form.category} 
                            onChange={e => setForm((p:any) => ({...p, category: e.target.value}))}
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:border-brand-orange outline-none appearance-none cursor-pointer"
                        >
                            {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                </div>

                {/* 3. AI TRIGGERS */}
                <div className="bg-brand-orange/5 p-4 rounded-xl border border-brand-orange/20 space-y-4">
                    <div>
                        <Label icon={Sparkles} className="text-brand-orange mb-2">Keywords (Konteks AI)</Label>
                        <input 
                            value={form.shortDesc} 
                            onChange={e => setForm((p:any) => ({...p, shortDesc: e.target.value}))} 
                            placeholder="Cth: layar 15 inch, ssd 128gb, garansi 1 thn..." 
                            className="w-full bg-black/60 border border-brand-orange/20 rounded-xl px-4 py-2.5 text-sm text-white focus:border-brand-orange outline-none placeholder:text-gray-700"
                        />
                    </div>
                    <div className="pt-2 border-t border-brand-orange/10">
                        <FieldHeader label="Nama Produk" onAI={aiActions.generateTitle} loading={loading.generatingTitle} />
                        <Input value={form.name} onChange={e => setForm((p:any) => ({...p, name: e.target.value}))} placeholder="Nama Produk..." className="py-3 text-sm font-bold bg-black/40" />
                    </div>
                </div>

                {/* 4. PRICE */}
                <div>
                    <Label icon={DollarSign}>Mahar / Harga (IDR)</Label>
                    <div className="relative">
                        <span className="absolute left-4 top-3 text-brand-orange font-bold text-sm">Rp</span>
                        <Input 
                            value={form.price} 
                            onChange={e => setForm((p:any) => ({...p, price: formatNumberInput(e.target.value)}))} 
                            placeholder="0" 
                            className="pl-11 py-3 text-lg font-display font-bold bg-black/40 tracking-wider" 
                        />
                    </div>
                </div>

                {/* 5. AFFILIATE */}
                <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-500/20 space-y-4">
                    <Label icon={LinkIcon} className="text-blue-400">Link Eksternal (Shopee/Tokped)</Label>
                    <div className="relative">
                        <ExternalLink size={14} className="absolute left-3 top-3 text-gray-500"/>
                        <input 
                            value={form.affiliateLink} 
                            onChange={e => setForm((p:any) => ({...p, affiliateLink: e.target.value}))} 
                            placeholder="https://marketplace.com/produk-lo" 
                            className="w-full bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:border-blue-500 outline-none"
                        />
                    </div>
                    <input 
                        value={form.ctaText} 
                        onChange={e => setForm((p:any) => ({...p, ctaText: e.target.value}))} 
                        placeholder="Label Tombol (Default: Beli Sekarang)" 
                        className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs text-white focus:border-blue-500 outline-none"
                    />
                </div>

            </div>
        </div>
    );
};
