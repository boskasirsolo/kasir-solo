
import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, FolderOpen, Info, Zap, Type } from 'lucide-react';
import { Input, Button } from '../ui';

export const SettingsSection = ({ title, desc, children }: { title: string, desc?: string, children?: React.ReactNode }) => (
    <div className="space-y-4">
        <div className="border-b border-white/5 pb-1.5 mb-3">
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">{title}</h3>
            {desc && <p className="text-[9px] text-gray-500 mt-0.5 uppercase font-bold">{desc}</p>}
        </div>
        {children}
    </div>
);

export const HeroCheatSheet = () => (
    <div className="bg-brand-dark/80 border border-brand-orange/20 rounded-2xl p-4 relative overflow-hidden group h-full">
        <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-100 transition-opacity">
            <Zap size={30} className="text-brand-orange" />
        </div>
        
        <h4 className="text-brand-orange text-[9px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-1.5">
            <Info size={12} /> Mantra Visual
        </h4>

        <div className="flex flex-col gap-3 relative z-10">
            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 hover:border-brand-orange/30 transition-all">
                <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Orange Brand</p>
                <code className="text-[9px] text-white bg-white/5 px-1.5 py-0.5 rounded block mb-1 font-mono">{"{Teks}"}</code>
            </div>

            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all">
                <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Gradasi Mewah</p>
                <code className="text-[9px] text-white bg-white/5 px-1.5 py-0.5 rounded block mb-1 font-mono">{"[Teks]"}</code>
            </div>

            <div className="p-2.5 bg-black/40 rounded-xl border border-white/5 hover:border-green-500/30 transition-all">
                <p className="text-[8px] text-gray-600 font-black uppercase mb-1">Ganti Baris</p>
                <code className="text-[9px] text-white bg-white/5 px-1.5 py-0.5 rounded font-mono">Enter / \n</code>
            </div>
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
            <h3 className="text-[10px] font-black text-gray-500 mb-2 flex items-center gap-1.5 uppercase tracking-widest">
                <ImageIcon size={12}/> {label}
            </h3>
            
            <div className="space-y-2">
                <div className={`w-full ${aspectClass} bg-black rounded-xl overflow-hidden border border-white/10 relative group shadow-inner`}>
                    <img 
                        src={previewUrl || "https://via.placeholder.com/800"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={label}
                    />
                    
                    {/* OVERLAY KONTROL - LEBIH KECIL & COMPACT */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => inputRef.current?.click()} 
                                className="flex flex-col items-center gap-1 p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all hover:-translate-y-0.5"
                            >
                                <UploadCloud size={18} className="text-white" />
                                <span className="text-[8px] font-black text-white uppercase tracking-tighter">Upload</span>
                            </button>
                            
                            {onGalleryPick && (
                                <button 
                                    onClick={onGalleryPick} 
                                    className="flex flex-col items-center gap-1 p-2.5 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 rounded-xl transition-all hover:-translate-y-0.5"
                                >
                                    <FolderOpen size={18} className="text-brand-orange" />
                                    <span className="text-[8px] font-black text-brand-orange uppercase tracking-tighter">Galeri</span>
                                </button>
                            )}
                        </div>
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
                    <div className="flex items-center gap-1.5 px-0.5">
                        <div className="w-1 h-1 rounded-full bg-brand-orange/50"></div>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">{helperText}</p>
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
    <div className="bg-brand-dark/50 p-3 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 items-end mb-4">
        <div className="flex-1 w-full">
            <label className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <span className="p-1 bg-blue-500/10 rounded-md"><Sparkles size={8}/></span> AI Copywriter
            </label>
            <Input 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Konteks promo, gaya bicara, dll..."
                className="bg-black/40 text-xs h-9"
            />
        </div>
        <Button onClick={onGenerate} disabled={isGenerating} variant="outline" className="w-full md:w-auto h-9 text-[9px] px-6 border-brand-orange/40 text-brand-orange">
            {isGenerating ? <Loader2 size={12} className="animate-spin"/> : 'GENERATE'}
        </Button>
    </div>
);
