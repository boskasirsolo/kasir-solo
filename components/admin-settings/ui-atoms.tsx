
import React, { useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Loader2, FolderOpen } from 'lucide-react';
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

export const ImageUploader = ({ 
    label, 
    previewUrl, 
    onSelect, 
    onGalleryPick, // NEW PROP
    aspect = 'landscape',
    helperText 
}: { 
    label: string, 
    previewUrl: string, 
    onSelect: (f: File) => void,
    onGalleryPick?: () => void, // Optional
    aspect?: 'landscape' | 'portrait',
    helperText?: string
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const hClass = aspect === 'portrait' ? 'h-32 w-24' : 'h-24 w-40';

    return (
        <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-2"><ImageIcon size={14}/> {label}</h3>
            <div className="flex gap-4 items-start">
                <div className={`${hClass} bg-black rounded-lg overflow-hidden border border-white/10 shrink-0 relative group`}>
                    <img src={previewUrl || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                    {/* Hover Actions in Image */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button onClick={() => inputRef.current?.click()} className="p-1 bg-white/20 hover:bg-white/40 rounded text-white" title="Upload Baru">
                            <UploadCloud size={14} />
                        </button>
                        {onGalleryPick && (
                            <button onClick={onGalleryPick} className="p-1 bg-brand-orange/20 hover:bg-brand-orange/40 rounded text-brand-orange border border-brand-orange/50" title="Pilih dari Galeri">
                                <FolderOpen size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex-1">
                    <div className="flex gap-2 mb-2">
                        <button 
                            onClick={() => inputRef.current?.click()}
                            className="flex-1 border border-dashed border-white/20 rounded-lg p-2 text-center hover:border-brand-orange/50 transition-colors cursor-pointer bg-white/5 flex flex-col items-center justify-center gap-1 group"
                        >
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={inputRef}
                                onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])} 
                                className="hidden" 
                            />
                            <UploadCloud size={14} className="text-gray-500 group-hover:text-brand-orange" />
                            <span className="text-gray-400 font-bold text-[9px] group-hover:text-white">Upload</span>
                        </button>
                        
                        {onGalleryPick && (
                            <button 
                                onClick={onGalleryPick}
                                className="flex-1 border border-dashed border-brand-orange/20 rounded-lg p-2 text-center hover:bg-brand-orange/10 transition-colors cursor-pointer bg-brand-orange/5 flex flex-col items-center justify-center gap-1 group"
                            >
                                <FolderOpen size={14} className="text-brand-orange opacity-70 group-hover:opacity-100" />
                                <span className="text-brand-orange font-bold text-[9px]">Galeri</span>
                            </button>
                        )}
                    </div>
                    {helperText && <p className="text-[9px] text-gray-600 mt-1">{helperText}</p>}
                </div>
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
    <div className="bg-brand-dark/50 p-3 rounded-xl border border-white/10 flex flex-col md:flex-row gap-3 items-end mb-6">
        <div className="flex-1 w-full">
            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                <Sparkles size={12}/> AI Copywriter
            </label>
            <Input 
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Konteks: 'Promo Lebaran', 'Kasir Cafe'..."
                className="bg-black/40 text-xs h-9"
            />
        </div>
        <Button onClick={onGenerate} disabled={isGenerating} variant="outline" className="w-full md:w-auto h-9 text-[10px] px-6">
            {isGenerating ? <Loader2 size={12} className="animate-spin"/> : 'GENERATE HERO'}
        </Button>
    </div>
);
