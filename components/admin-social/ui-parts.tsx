
import React from 'react';
import { 
    Instagram, Facebook, Linkedin, Image as ImageIcon, 
    Monitor, ShoppingBag, FileText, Briefcase, 
    Sparkles, UploadCloud, Rocket, RefreshCw, Smartphone,
    Twitter, MapPin, Music2, Pin, Send, Youtube, AtSign
} from 'lucide-react';
import { SocialContentItem } from './types';

// --- ICONS ---
export const PlatformIcon = ({ id, size=16 }: { id: string, size?: number }) => {
    switch (id) {
        case 'instagram': return <Instagram size={size} className="text-pink-500" />;
        case 'facebook': return <Facebook size={size} className="text-blue-600" />;
        case 'linkedin': return <Linkedin size={size} className="text-blue-700" />;
        case 'twitter': return <Twitter size={size} className="text-sky-500" />; // X / Twitter
        case 'tiktok': return <Music2 size={size} className="text-black dark:text-white" />;
        case 'gmb': return <MapPin size={size} className="text-blue-500" />; // Google Business
        case 'pinterest': return <Pin size={size} className="text-red-600" />;
        case 'telegram': return <Send size={size} className="text-blue-400" />;
        case 'youtube': return <Youtube size={size} className="text-red-600" />;
        case 'threads': return <AtSign size={size} className="text-black dark:text-white" />;
        default: return <Monitor size={size} />;
    }
};

export const TypeIcon = ({ type }: { type: string }) => {
    if (type === 'product') return <ShoppingBag size={14} className="text-green-400" />;
    if (type === 'article') return <FileText size={14} className="text-yellow-400" />;
    if (type === 'gallery') return <ImageIcon size={14} className="text-purple-400" />;
    if (type === 'service') return <Briefcase size={14} className="text-blue-400" />;
    return <Monitor size={14} />;
};

// --- LEFT PANE: SOURCE CARD ---
export const SourceCard: React.FC<{ item: SocialContentItem, onClick: () => void, active: boolean }> = ({ item, onClick, active }) => (
    <div 
        onClick={onClick}
        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all group hover:bg-white/5 ${
            active ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' : 'bg-transparent border-white/5'
        }`}
    >
        <div className="w-12 h-12 rounded bg-black border border-white/10 overflow-hidden shrink-0">
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border flex items-center gap-1 uppercase font-bold bg-black/40 border-white/10 text-gray-400`}>
                    <TypeIcon type={item.type} /> {item.type}
                </span>
            </div>
            <h5 className={`text-xs font-bold truncate ${active ? 'text-brand-orange' : 'text-white'}`}>{item.title}</h5>
            <p className="text-[10px] text-gray-500 truncate">{item.description}</p>
        </div>
    </div>
);

// --- MIDDLE PANE: CAPTION EDITOR ---
export const CaptionEditor = ({ 
    value, 
    onChange, 
    onGenerate, 
    isGenerating,
    platform 
}: { 
    value: string, 
    onChange: (v: string) => void, 
    onGenerate: () => void,
    isGenerating: boolean,
    platform: string
}) => (
    <div className="relative h-full flex flex-col">
        <textarea 
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-grow w-full bg-black/20 border border-white/10 rounded-xl p-4 text-xs text-gray-300 focus:outline-none focus:border-brand-orange/50 resize-none leading-relaxed custom-scrollbar"
            placeholder={`Tulis caption untuk ${platform}...`}
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
            <button 
                onClick={onGenerate}
                disabled={isGenerating}
                className="flex items-center gap-2 px-3 py-1.5 bg-brand-dark/80 backdrop-blur border border-brand-orange/30 rounded-lg text-[10px] font-bold text-brand-orange hover:bg-brand-orange hover:text-white transition-all shadow-lg"
            >
                {isGenerating ? <RefreshCw size={12} className="animate-spin"/> : <Sparkles size={12} />}
                AI Magic ({platform === 'master' ? 'General' : platform})
            </button>
        </div>
    </div>
);

// --- RIGHT PANE: PHONE MOCKUP ---
export const PhoneMockup = ({ 
    image, 
    caption, 
    platform 
}: { 
    image: string, 
    caption: string,
    platform: string
}) => {
    return (
        <div className="relative mx-auto w-[280px] h-[550px] bg-black rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl overflow-hidden flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
            
            {/* Status Bar */}
            <div className="h-8 bg-white w-full shrink-0"></div>

            {/* App Header */}
            <div className="h-12 bg-white border-b flex items-center px-4 justify-between shrink-0">
                <PlatformIcon id={platform} size={20} />
                <span className="text-xs font-bold text-black uppercase">{platform}</span>
                <div className="w-5"></div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 bg-white overflow-y-auto custom-scrollbar-hide">
                {/* Post Image */}
                <div className="aspect-square bg-gray-100 w-full overflow-hidden">
                    {image ? (
                        <img src={image} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                </div>

                {/* Action Bar (Fake) */}
                <div className="h-10 flex items-center px-3 gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                    <div className="w-6 h-6 rounded-full bg-gray-200"></div>
                </div>

                {/* Caption Area */}
                <div className="px-3 pb-8">
                    <p className="text-[10px] text-black font-bold mb-1">2,490 likes</p>
                    <p className="text-[10px] text-gray-800 leading-snug whitespace-pre-wrap">
                        <span className="font-bold mr-1">kasirsolo</span>
                        {caption || "Caption preview will appear here..."}
                    </p>
                </div>
            </div>

            {/* Home Indicator */}
            <div className="h-4 bg-white w-full shrink-0 flex justify-center items-center">
                <div className="w-20 h-1 bg-gray-300 rounded-full"></div>
            </div>
        </div>
    );
};
