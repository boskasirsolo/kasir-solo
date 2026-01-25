
import React, { useRef, useState } from 'react';
import { Tag, Edit, ImageIcon, UploadCloud, ShieldCheck, Sparkles, DollarSign, Filter, X as XIcon, Link as LinkIcon, ExternalLink, FolderOpen, Box, Scale } from 'lucide-react';
import { AdminInput, AdminSelect, AdminCheckbox, CmdButton } from '../admin/ui-shared/atoms';
import { FieldGroup } from '../admin/ui-shared/molecules';
import { PRODUCT_CATEGORIES } from './types';
import { MediaLibraryModal } from '../admin/media-library';
import { formatNumberInput } from '../../utils';

export const EditorBasic = ({ 
    form, 
    setForm, 
    loading, 
    useWatermark, 
    setUseWatermark, 
    aiActions,
    actions,
    hideHeader = false 
}: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    return (
        <div className={`bg-brand-dark flex flex-col h-full overflow-hidden relative ${hideHeader ? '' : 'rounded-2xl border border-white/5 shadow-2xl'}`}>
            {showMediaLib && <MediaLibraryModal onSelect={handleMediaSelect} onClose={() => setShowMediaLib(false)} />}

            {!hideHeader && (
                <div className="p-5 border-b border-white/10 shrink-0 flex justify-between items-center bg-black/20">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {form.id ? <Edit size={18} className="text-brand-orange"/> : <Tag size={18} className="text-brand-orange"/>}
                        {form.id ? "EDIT INFO" : "INFO BARU"}
                    </h3>
                    {form.id && (
                        <button onClick={actions.resetForm} className="text-[9px] text-red-500 font-black uppercase tracking-widest flex items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/20">
                            <XIcon size={12}/> BATAL
                        </button>
                    )}
                </div>
            )}

            <div className={`flex-grow overflow-y-auto custom-scrollbar space-y-6 ${hideHeader ? 'p-0' : 'p-5 md:p-6'}`}>
                
                {/* MEDIA CANVAS */}
                <FieldGroup label="Media & Galeri" icon={ImageIcon}>
                    <div className="flex gap-3 overflow-x-auto pb-4 custom-scrollbar items-start -mx-1 px-1">
                        {/* COVER */}
                        <div className="shrink-0 text-center space-y-2">
                            <div className="relative w-24 h-24 bg-black rounded-xl overflow-hidden border-2 border-brand-orange shadow-neon-text/20 group">
                                {form.imagePreview ? <img src={form.imagePreview} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-800 bg-white/5"><ImageIcon size={20} /></div>}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-1">
                                    <button onClick={aiActions.generateImage} disabled={loading.generatingImage} className="w-full py-1 bg-blue-600 text-white rounded text-[8px] font-black uppercase">AI GEN</button>
                                    <button onClick={() => fileInputRef.current?.click()} className="w-full py-1 bg-white/20 text-white rounded text-[8px] font-black uppercase">UPLOAD</button>
                                </div>
                                <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) setForm((p: any) => ({ ...p, uploadFile: file, imagePreview: URL.createObjectURL(file) })); }} />
                            </div>
                            <span className="text-[8px] font-black text-brand-orange uppercase tracking-widest">Utama</span>
                        </div>

                        {/* ADD BUTTON */}
                        <div className="shrink-0 text-center space-y-2">
                            <div onClick={() => openMediaLib('gallery')} className="w-24 h-24 rounded-xl bg-white/5 border-2 border-dashed border-white/10 hover:border-brand-orange/50 transition-all flex flex-col items-center justify-center text-gray-700 hover:text-brand-orange group cursor-pointer">
                                <FolderOpen size={20} className="mb-1" />
                                <span className="text-[8px] font-black uppercase">Galeri</span>
                            </div>
                            <span className="text-[8px] font-black text-gray-700 uppercase tracking-widest">+ Item</span>
                        </div>

                        {/* GALLERY ITEMS */}
                        {form.galleryImages.map((url: string, idx: number) => (
                            <div key={`ex-${idx}`} className="relative w-24 h-24 shrink-0 rounded-xl bg-black border border-white/10 overflow-hidden group">
                                <img src={url} className="w-full h-full object-cover" />
                                <button onClick={() => setForm((p:any) => ({...p, galleryImages: p.galleryImages.filter((_:any, i:number) => i !== idx)}))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 shadow-lg"><XIcon size={10}/></button>
                            </div>
                        ))}
                    </div>
                </FieldGroup>

                <div className="grid grid-cols-2 gap-4">
                    <AdminCheckbox checked={useWatermark} onChange={(e:any) => setUseWatermark(!useWatermark)} label="Watermark" />
                    <AdminSelect value={form.category} onChange={(e:any) => setForm((p:any) => ({...p, category: e.target.value}))}>
                        {PRODUCT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </AdminSelect>
                </div>

                <div className="bg-brand-orange/5 p-4 rounded-2xl border border-brand-orange/20 space-y-4 shadow-inner">
                    <FieldGroup label="Keywords (AI Context)" icon={Sparkles} helperText="Ketik fitur kunci biar AI makin pinter ngeracik judul.">
                        <AdminInput value={form.shortDesc} onChange={(e:any) => setForm((p:any) => ({...p, shortDesc: e.target.value}))} placeholder="Layar 15 inch, SSD 128GB, garansi 1 thn..." className="bg-black/60 border-brand-orange/20" />
                    </FieldGroup>
                    
                    <FieldGroup label="Nama Produk" onAI={aiActions.generateTitle} aiLoading={loading.generatingTitle}>
                        <AdminInput value={form.name} onChange={(e:any) => setForm((p:any) => ({...p, name: e.target.value}))} placeholder="Nama Produk..." className="font-bold bg-black/40" />
                    </FieldGroup>
                </div>

                {/* ROW: PRICE & WEIGHT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FieldGroup label="Mahar / Harga (IDR)" icon={DollarSign}>
                        <div className="relative">
                            <span className="absolute left-4 top-2.5 text-brand-orange font-black text-sm">Rp</span>
                            <AdminInput value={form.price} onChange={(e:any) => setForm((p:any) => ({...p, price: formatNumberInput(e.target.value)}))} placeholder="0" className="pl-11 text-lg font-black tracking-widest bg-black/40" />
                        </div>
                    </FieldGroup>

                    <FieldGroup label="Berat Barang (Gram)" icon={Scale}>
                        <div className="relative">
                            <AdminInput value={form.weight_grams} type="number" onChange={(e:any) => setForm((p:any) => ({...p, weight_grams: e.target.value}))} placeholder="2000" className="text-lg font-black tracking-widest bg-black/40 pr-12" />
                            <span className="absolute right-4 top-2.5 text-gray-500 font-bold text-sm">gr</span>
                        </div>
                    </FieldGroup>
                </div>

                <div className="bg-blue-900/10 p-4 rounded-2xl border border-blue-500/20 space-y-4">
                    <FieldGroup label="Marketplace Link" icon={LinkIcon} className="text-blue-400">
                        <AdminInput value={form.affiliateLink} onChange={(e:any) => setForm((p:any) => ({...p, affiliateLink: e.target.value}))} placeholder="https://tokopedia.com/..." className="bg-black/40 border-white/5 text-[10px]" />
                    </FieldGroup>
                    <AdminInput value={form.ctaText} onChange={(e:any) => setForm((p:any) => ({...p, ctaText: e.target.value}))} placeholder="Label Tombol (Default: Beli Sekarang)" className="bg-black/40 border-white/5 text-[10px]" />
                </div>
            </div>
        </div>
    );
};
