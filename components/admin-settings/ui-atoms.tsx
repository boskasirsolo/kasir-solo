
import React from 'react';
import { Info, Sparkles, Loader2, Image as ImageIcon, UploadCloud, FolderOpen, Zap } from 'lucide-react';
import { Input } from '../ui';

// PARTIKEL: Container utama per-tab
// FIX: Use React.FC and make children optional to resolve strictness errors in consuming components
export const SettingsTabWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
    <div className="space-y-10 animate-fade-in relative pb-20">
        {children}
    </div>
);

// PARTIKEL: Header Seksi
export const SettingsHeader = ({ title, desc }: { title: string, desc?: string }) => (
    <div className="border-b border-white/5 pb-4 mb-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">{title}</h3>
        {desc && <p className="text-[10px] text-gray-500 mt-1 font-bold uppercase tracking-widest">{desc}</p>}
    </div>
);

// FIX: Added missing SettingsSection component used in multiple tabs
export const SettingsSection: React.FC<{ title: string, desc?: string, children?: React.ReactNode }> = ({ title, desc, children }) => (
    <div className="space-y-6">
        <SettingsHeader title={title} desc={desc} />
        {children}
    </div>
);

// PARTIKEL: Card pembungkus grup input
// FIX: Use React.FC and make children optional to resolve strictness errors
export const SettingsCard: React.FC<{ 
    title?: string, 
    icon?: any, 
    color?: string, 
    children?: React.ReactNode 
}> = ({ 
    title, 
    icon: Icon, 
    color = "text-brand-orange", 
    children 
}) => (
    <div className="bg-brand-dark/30 p-5 rounded-2xl border border-white/5 space-y-5 group hover:border-white/10 transition-colors">
        {title && (
            <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${color}`}>
                {Icon && <Icon size={14}/>} {title}
            </h4>
        )}
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

// PARTIKEL: Input Group (Label + Field)
// FIX: Use React.FC and make children optional to resolve strictness errors
export const SettingsField: React.FC<{ label: string, helper?: string, children?: React.ReactNode }> = ({ label, helper, children }) => (
    <div className="space-y-1.5">
        <label className="text-[8px] text-gray-600 font-black uppercase tracking-widest block ml-1">{label}</label>
        {children}
        {helper && <p className="text-[7px] text-gray-700 italic px-1">{helper}</p>}
    </div>
);

// FIX: Added missing HeroCheatSheet component used in TabGeneral
export const HeroCheatSheet = () => (
    <div className="bg-black/40 p-5 rounded-2xl border border-white/5 space-y-4">
        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2"><Info size={14}/> Hero Syntax</h4>
        <div className="space-y-3">
            <div className="flex items-center gap-3">
                <div className="text-brand-orange font-bold text-xs">{"{Kata}"}</div>
                <div className="text-[10px] text-gray-500">Aksen warna orange terang</div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-transparent bg-clip-text bg-brand-gradient font-bold text-xs">[Kata]</div>
                <div className="text-[10px] text-gray-500">Aksen warna gradasi mewah</div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-white font-mono text-xs">\n</div>
                <div className="text-[10px] text-gray-500">Pindah baris baru (Line break)</div>
            </div>
        </div>
    </div>
);

// PARTIKEL: AI Helper Box
export const SettingsAiBox = ({ context, setContext, onGenerate, isGenerating }: any) => (
    <div className="bg-brand-orange/5 p-3 rounded-xl border border-brand-orange/10 flex flex-col md:flex-row gap-3 items-end">
        <div className="flex-1 w-full space-y-1.5">
            <div className="flex items-center gap-1.5 ml-1">
                <Sparkles size={10} className="text-blue-400" />
                <span className="text-[8px] text-blue-400 font-black uppercase">Mantera AI Copywriter</span>
            </div>
            <Input 
                value={context}
                onChange={(e: any) => setContext(e.target.value)}
                placeholder="Tulis konteks promo di sini..."
                className="bg-black/40 text-[11px] h-9 border-white/5"
            />
        </div>
        <button 
            onClick={onGenerate} 
            disabled={isGenerating} 
            className="w-full md:w-auto h-9 px-6 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-neon hover:bg-brand-action transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
            {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Zap size={12}/>}
            RACIK MANTERA
        </button>
    </div>
);

// PARTIKEL: Image Uploader Atomic
export const SettingsImageUploader = ({ label, previewUrl, onSelect, onGalleryPick, aspect = 'landscape' }: any) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const aspectClass = aspect === 'portrait' ? 'aspect-[3/4]' : 'aspect-video';

    return (
        <SettingsField label={label}>
            <div className={`w-full ${aspectClass} bg-black rounded-xl overflow-hidden border border-white/10 relative group`}>
                <img src={previewUrl || "https://via.placeholder.com/800"} className="w-full h-full object-cover transition-opacity group-hover:opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => inputRef.current?.click()} className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"><UploadCloud size={18}/></button>
                    <button onClick={onGalleryPick} className="p-2 bg-brand-orange/20 rounded-lg text-brand-orange hover:bg-brand-orange/40"><FolderOpen size={18}/></button>
                </div>
                <input type="file" accept="image/*" ref={inputRef} className="hidden" onChange={(e) => e.target.files?.[0] && onSelect(e.target.files[0])} />
            </div>
        </SettingsField>
    );
};
