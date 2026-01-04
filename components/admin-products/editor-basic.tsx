
import React, { useRef } from 'react';
import { Tag, Edit, ImageIcon, UploadCloud, ShieldCheck, Wand2, Sparkles, DollarSign, Filter, Save, Plus, X as XIcon } from 'lucide-react';
import { Input, LoadingSpinner, Button } from '../ui';
import { formatNumberInput } from '../../utils';
import { PRODUCT_CATEGORIES } from './types';
import { Label, FieldHeader } from './atoms';

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

    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/5 shrink-0 flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {form.id ? <Edit size={16} className="text-brand-orange"/> : <Tag size={16} className="text-brand-orange"/>}
                    INFO DASAR
                </h3>
                {form.id && <button onClick={actions.resetForm} className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 border border-white/10 px-2 py-1 rounded"><XIcon size={10}/> Batal</button>}
            </div>

            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-5">
                
                {/* 1. IMAGE UPLOADER */}
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
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-6">
                        <button 
                            onClick={aiActions.generateImage} 
                            disabled={loading.generatingImage} 
                            className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-500 shadow-lg"
                        >
                            {loading.generatingImage ? <LoadingSpinner size={14}/> : <><Wand2 size={14}/> Generate AI Image</>}
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-2 bg-white/10 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-white/20 border border-white/20"
                        >
                            <UploadCloud size={14}/> Upload Manual
                        </button>
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef}
                            className="hidden" 
                            onChange={(e) => {
                                const file = e.target.files ? e.target.files[0] : null;
                                if (file) setForm((p: any) => ({ ...p, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
                            }}
                        />
                    </div>
                </div>

                {/* 2. WATERMARK TOGGLE */}
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

                {/* 3. KEYWORDS (AI CONTEXT) */}
                <div className="bg-brand-orange/5 p-3 rounded-lg border border-brand-orange/20">
                    <Label icon={Sparkles} className="text-brand-orange mb-2">Keywords (Trigger AI)</Label>
                    <input 
                        value={form.shortDesc} 
                        onChange={e => setForm((p:any) => ({...p, shortDesc: e.target.value}))} 
                        placeholder="Cth: printer thermal, cepat, garansi 1 thn..." 
                        className="w-full bg-black/40 border border-brand-orange/30 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange placeholder-gray-600"
                    />
                </div>

                {/* 4. NAME */}
                <div>
                    <FieldHeader label="Nama Produk" onAI={aiActions.generateTitle} loading={loading.generatingTitle} />
                    <Input value={form.name} onChange={e => setForm((p:any) => ({...p, name: e.target.value}))} placeholder="Nama Produk..." className="py-2 text-xs font-bold" />
                </div>

                {/* 5. PRICE & CATEGORY */}
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
