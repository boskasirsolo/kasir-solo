
import React from 'react';
import { 
    ShoppingBag, Package, LayoutGrid, Image, Settings, 
    LogOut, FileText, Briefcase, 
    BarChart, Download, Share2, Globe, Cpu, 
    Bot, BookOpen, Users, X, Box, Zap, Wrench, ArrowUpRight, Database, Quote, TrendingUp
} from 'lucide-react';
import { AdminTabId, MenuCategory } from '../types';
import { SidebarTabButton, SidebarGroupHeader, SystemHealthWidget, GhostModeBtn } from '../ui-parts';

export const MENU_GROUPS: MenuCategory[] = [
    { id: 'radar', label: 'Intelligence', items: ['analytics', 'sales', 'seo'] },
    { id: 'ops', label: 'Operations (Dapur)', items: ['store', 'rma'] },
    { id: 'content', label: 'Asset Library', items: ['articles', 'gallery', 'testimonials', 'media', 'downloads'] },
    { id: 'growth', label: 'Expansion', items: ['social', 'career'] },
    { id: 'core', label: 'System Core', items: ['siboy', 'documentation', 'settings'] }
];

export const ICON_MAP: Record<string, any> = {
    analytics: BarChart, sales: Zap, seo: Globe, store: Package, rma: Wrench,
    articles: FileText, gallery: Image, testimonials: Quote, media: Database, downloads: Download, social: Share2,
    career: Briefcase, siboy: Bot, documentation: BookOpen, settings: Settings
};

export const LABEL_MAP: Record<string, string> = {
    analytics: 'Radar Trafik', sales: 'Tactical War Room', seo: 'SEO Engine', store: 'Katalog Toko',
    rma: 'Klaim Garansi', articles: 'Intel Artikel', gallery: 'Portfolio Proyek',
    testimonials: 'Testimoni Klien',
    media: 'Digital Vault', downloads: 'File Center', social: 'Social Studio', career: 'HR Recruitment',
    siboy: 'AI Trainer', documentation: 'War Manual', settings: 'Setting Core'
};

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab: AdminTabId;
    onTabChange: (id: AdminTabId) => void;
    onLogout: () => void;
}

export const Sidebar = ({ isOpen, onClose, activeTab, onTabChange, onLogout }: SidebarProps) => (
    <aside 
        className={`fixed lg:sticky top-0 right-0 h-screen w-72 lg:w-[280px] bg-brand-card/40 backdrop-blur-3xl border-l border-white/5 z-50 flex flex-col transition-all duration-500 transform lg:translate-x-0 order-1 lg:order-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
    >
        <div className="p-6 border-b border-white/5 bg-black/40 shrink-0 space-y-6">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,95,31,0.3)] shrink-0">
                    <Box size={20} />
                </div>
                <div className="min-w-0">
                    <h3 className="text-white font-black text-sm leading-none tracking-tight truncate">SOLO CMD</h3>
                    <p className="text-[8px] text-brand-orange font-black uppercase tracking-[0.25em] mt-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-brand-orange animate-ping"></span> V 3.1 FRAG
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                <GhostModeBtn />
                <button onClick={onLogout} className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500 hover:text-white hover:bg-red-500/10 transition-all group">
                    <LogOut size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-black uppercase tracking-widest group-hover:text-red-400">Exit</span>
                </button>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-1">
            {MENU_GROUPS.map(group => (
                <div key={group.id} className="mb-4">
                    <SidebarGroupHeader label={group.label} />
                    <div className="space-y-1">
                        {group.items.map(tabId => (
                            <SidebarTabButton 
                                key={tabId}
                                id={tabId as any}
                                label={LABEL_MAP[tabId].split(' ')[0]}
                                icon={ICON_MAP[tabId]}
                                isActive={activeTab === tabId}
                                onClick={() => { onTabChange(tabId as any); if(window.innerWidth < 1024) onClose(); }}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>

        <div className="p-6 border-t border-white/5 opacity-20 hover:opacity-100 transition-opacity duration-500 flex justify-between items-center shrink-0">
            <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.4em]">Proprietary OS © 2025</p>
            <Bot size={12} className="text-brand-orange" />
        </div>
    </aside>
);
