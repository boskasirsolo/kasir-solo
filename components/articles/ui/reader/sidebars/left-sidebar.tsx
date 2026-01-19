
import React from 'react';
import { Hash, Share2, Facebook, Twitter, Linkedin, Link as LinkIcon } from 'lucide-react';

interface LeftSidebarProps {
    headings: any[];
    activeHeadingId: string;
    onHeadingClick: (h: any) => void;
    onShare: (platform: 'facebook' | 'twitter' | 'linkedin' | 'copy') => void;
}

export const LeftSidebar = ({ headings, activeHeadingId, onHeadingClick, onShare }: LeftSidebarProps) => {
    return (
        <div className="sticky top-28 space-y-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {/* Table of Contents */}
            <div className="border-l border-white/10 pl-5 py-2 mb-10">
                <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Hash size={14}/> Daftar Isi
                </h4>
                <ul className="space-y-4 max-h-[40vh] overflow-y-auto custom-scrollbar pr-2">
                    {headings.length === 0 && <li className="text-xs text-gray-500 italic">Tidak ada sub-judul.</li>}
                    {headings.map((h: any, idx: number) => {
                        const visualLevel = Math.min(h.level, 6);
                        const paddingLeft = (visualLevel - 1) * 12; 
                        
                        return (
                            <li key={idx} style={{ paddingLeft: `${paddingLeft}px` }}>
                                <button 
                                    onClick={() => onHeadingClick(h)} 
                                    className={`text-left text-sm transition-all duration-300 block w-full relative ${h.id === activeHeadingId ? 'text-brand-orange font-bold translate-x-2' : 'text-gray-500 hover:text-gray-300 hover:translate-x-1'}`}
                                >
                                    {h.id === activeHeadingId && (<span className="absolute -left-4 top-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange shadow-neon"></span>)}
                                    {h.text}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Share Widget */}
            <div className="border-l border-white/5 pl-5 pt-2 mb-10">
                <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Share2 size={12}/> Bagikan
                </h5>
                <div className="grid grid-cols-4 gap-2 mb-6">
                    <button onClick={() => onShare('facebook')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1877F2] transition-all"><Facebook size={16} /></button>
                    <button onClick={() => onShare('twitter')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1DA1F2] transition-all"><Twitter size={16} /></button>
                    <button onClick={() => onShare('linkedin')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] transition-all"><Linkedin size={16} /></button>
                    <button onClick={() => onShare('copy')} className="h-10 rounded-lg bg-brand-card border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"><LinkIcon size={16} /></button>
                </div>
            </div>
        </div>
    );
};
