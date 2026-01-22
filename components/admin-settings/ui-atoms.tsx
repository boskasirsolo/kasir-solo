
import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, FolderOpen, Info, Zap, Type } from 'lucide-react';
import { Input, Button } from '../ui';

export const SettingsSection = ({ title, desc, children }: { title: string, desc?: string, children?: React.ReactNode }) => (
    <div className="space-y-6">
        <div className="border-b border-white/5 pb-2 mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">{title}</h3>
            {desc && <p className="text-[10px] text-gray-500 mt-1">{desc}</p>}
        </div>
        {children}
    </div>
);

export const HeroCheatSheet = () => (
    <div className="bg-brand-dark/80 border border-brand-orange/20 rounded-2xl p-5 relative overflow-hidden group h-full">
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Zap size={40} className="text-brand-orange" />
        </div>
        
        <h4 className="text-brand-orange text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
            <Info size={14} /> Mantra Visual
        </h4>

        <div className="flex flex-col gap-5 relative z-10">
            {/* Rule 1: Orange */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-brand-orange/30 transition-all">
                <p className="text-[9px] text-gray-500 font-bold uppercase mb-2">Orange Brand</p>
                <code className="text-[10px] text-white bg-white/5 px-2 py-1 rounded block mb-2 font-mono">{"{Teks}"}</code>
                <p className="text-[10px] text-brand-orange font-black italic">Preview: Teks</p>
            </div>

            {/* Rule 2: Gradient */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
                <p className="text-[9px] text-gray-500 font-bold uppercase mb-2">Gradasi Mewah</p>
                <code className="text-[10px] text-white bg-white/5 px-2 py-1 rounded block mb-2 font-mono">{"[Teks]"}</code>
                <p className="text-[10px] text-transparent bg-clip-text bg-brand-gradient font-black italic">Preview: Teks</p>
            </div>

            {/* Rule 3: Line Break */}
            <div className="p-3 bg-black/40 rounded-xl border border-white/5 hover:border-green-500/30 transition-all">
                <p className="text-[9px] text-gray-500 font-bold uppercase mb-2">Ganti Baris</p>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                   <code className="text-[10px] text-white bg-white/5 px-1.5 py-1 rounded font-mono">Enter</code>
                   <span className="text-[9px] text-gray-600">atau</span>
                   <code className="text-[10px] text-white bg-white/5 px-1.5 py-1 rounded font-mono">\n</code>
                </div>
                <p className="text-[9px] text-gray-400 leading-tight">Bikin judul jadi <br/>dua baris atau lebih.</p>
            </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-white/5">
             <p className="text-[8px] text-gray-600 uppercase font-black tracking-widest leading-relaxed">
                *Satu seksi satu efek aja udah mantap, Bos.
             </p>
        </div>
    </div>
);

export const ImageUploader = ({ 
    label, 
    previewUrl, 
    onSelect, 
    onGalleryPick, 
    aspect = 'landscape',
    helperText 
}: { 
    label: string, 
    previewUrl: string, 
    onSelect: (f: File) => void,
    onGalleryPick?: () => void,
    aspect?: 'landscape' | 'portrait',
    helperText?: string
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const aspectClass = aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-video';

    return (
        <div className="w-full">
            <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-2 uppercase tracking-widest">
                <ImageIcon size={14}/> {label}
            </h3>
            
            <div className="space-y-3">
                <div className={`w-full ${aspectClass} bg-black rounded-2xl overflow-hidden border border-white/10 relative group shadow-inner`}>
                    <img 
                        src={previewUrl || "https://via.placeholder.com/800"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={label}
                    />
                    
                    {/* OVERLAY KONTROL - AKTIF PAS HOVER */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                        <div className="flex gap-3">
                            <button 
                                onClick={() => inputRef.current?.click()} 
                                className="flex flex-col items-center gap-2 p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl transition-all hover:-translate-y-1"
                                title="Upload Foto Baru"
                            >
                                <UploadCloud size={24} className="text-white" />
                                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Upload</span>
                            </button>
                            
                            {onGalleryPick && (
                                <button 
                                    onClick={onGalleryPick} 
                                    className="flex flex-col items-center gap-2 p-4 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 rounded-2xl transition-all hover:-translate-y-1"
                                    title="Pilih dari Galeri Aset"
                                >
                                    <FolderOpen size={24} className="text-brand-orange" />
                                    <span className="text-[10px] font-black text-brand-orange uppercase tracking-tighter">Galeri</span>
                                </button>
                            )}
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest px-6 text-center">
                            {previewUrl ? 'Klik salah satu untuk ganti foto' : 'Foto masih kosong, Bos!'}
                        </p>
                    </div>

                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={inputRef}
                        onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])} 
                        className="hidden" 
                    />
                </div>

                {helperText && (
                    <div className="flex items-center gap-2 px-1">
                        <div className="w-1 h-1 rounded-full bg-brand-orange"></div>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">{helperText}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export const AIGeneratorBox = ({ 
    context, 
    setContext, 
    onGenerate, 
    isGenerating 
}: { 
    context: string, 
    setContext: (v: string) => void, 
    onGenerate: () => void, 
    isGenerating: boolean 
}) => (
    <div className="bg-brand-dark/50 p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-end mb-6">
        <div className="flex-1 w-full">
            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="p-1 bg-blue-500/10 rounded-md"><Sparkles size={10}/></span> AI Copywriter
            </label>
            <Input 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Konteks promo, gaya bicara, dll..."
                className="bg-black/40 text-sm h-11"
            />
        </div>
        <Button onClick={onGenerate} disabled={isGenerating} variant="outline" className="w-full md:w-auto h-11 text-[10px] px-8 border-brand-orange/40 text-brand-orange">
            {isGenerating ? <Loader2 size={14} className="animate-spin"/> : 'GENERATE'}
        </Button>
    </div>
);
