
import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, FolderOpen, Info, Zap, Type } from 'lucide-react';
import { Input, Button } from '../ui';

export const SettingsSection = ({ title, desc, children }: { title: string, desc?: string, children?: React.ReactNode }) => (
    <div className="space-y-3">
        <div className="border-b border-white/5 pb-1 mb-2">
            <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">{title}</h3>
            {desc && <p className="text-[8px] text-gray-500 uppercase font-bold">{desc}</p>}
        </div>
        {children}
    </div>
);

export const HeroCheatSheet = () => (
    <div className="bg-brand-dark/80 border border-brand-orange/20 rounded-xl p-3 relative overflow-hidden group h-full">
        <div className="absolute top-0 right-0 p-1 opacity-5 group-hover:opacity-100 transition-opacity">
            <Zap size={24} className="text-brand-orange" />
        </div>
        
        <h4 className="text-brand-orange text-[8px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-1">
            <Info size={10} /> Mantra Visual
        </h4>

        <div className="flex flex-col gap-2 relative z-10">
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 hover:border-brand-orange/30 transition-all">
                <code className="text-[8px] text-white bg-white/5 px-1 py-0.5 rounded block font-mono">{"{Orange}"}</code>
            </div>
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 hover:border-blue-500/30 transition-all">
                <code className="text-[8px] text-white bg-white/5 px-1 py-0.5 rounded block font-mono">{"[Gradasi]"}</code>
            </div>
            <div className="p-2 bg-black/40 rounded-lg border border-white/5 hover:border-green-500/30 transition-all">
                <code className="text-[8px] text-white bg-white/5 px-1 py-0.5 rounded font-mono">Enter / \n</code>
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
            <h3 className="text-[9px] font-black text-gray-500 mb-1.5 flex items-center gap-1 uppercase tracking-widest">
                <ImageIcon size={10}/> {label}
            </h3>
            
            <div className="space-y-1.5">
                <div className={`w-full ${aspectClass} bg-black rounded-lg overflow-hidden border border-white/10 relative group shadow-inner`}>
                    <img 
                        src={previewUrl || "https://via.placeholder.com/800"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        alt={label}
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px] flex items-center justify-center gap-2">
                        <button 
                            onClick={() => inputRef.current?.click()} 
                            className="flex flex-col items-center gap-1 p-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-all hover:-translate-y-0.5"
                        >
                            <UploadCloud size={14} className="text-white" />
                            <span className="text-[7px] font-black text-white uppercase">Upload</span>
                        </button>
                        
                        {onGalleryPick && (
                            <button 
                                onClick={onGalleryPick} 
                                className="flex flex-col items-center gap-1 p-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 rounded-lg transition-all hover:-translate-y-0.5"
                            >
                                <FolderOpen size={14} className="text-brand-orange" />
                                <span className="text-[7px] font-black text-brand-orange uppercase">Galeri</span>
                            </button>
                        )}
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
                    <p className="text-[7px] text-gray-600 font-black uppercase tracking-tighter text-center">{helperText}</p>
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
    <div className="bg-brand-dark/50 p-2.5 rounded-xl border border-white/10 flex flex-col md:flex-row gap-2 items-end mb-4">
        <div className="flex-1 w-full">
            <label className="text-[8px] text-blue-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1">
                <Sparkles size={8}/> AI Copywriter
            </label>
            <Input 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Konteks promo..."
                className="bg-black/40 text-xs h-8"
            />
        </div>
        <Button onClick={onGenerate} disabled={isGenerating} variant="outline" className="w-full md:w-auto h-8 text-[8px] px-4 border-brand-orange/40 text-brand-orange font-black">
            {isGenerating ? <Loader2 size={10} className="animate-spin"/> : 'GENERATE'}
        </Button>
    </div>
);
