import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingBag, Package, LayoutGrid, Image, Settings, 
    LogOut, FileText, Briefcase, 
    BarChart, Download, Share2, Globe, Cpu, 
    Bot, BookOpen, Users, LayoutDashboard, Menu, X, ArrowUpRight,
    Terminal, ShieldCheck, Activity, Box, Zap, Wrench
} from 'lucide-react';
import { DashboardProps, MenuCategory } from '../types';
import { useAdminDashboard } from '../logic';
import { SidebarTabButton, SidebarGroupHeader, StoreSubTabBtn, SidebarActionBtn, SystemHealthWidget } from '../ui-parts';

// Sub-Modules Imports
import { AdminProducts } from '../../admin-products/index'; 
import { AdminGallery } from '../../admin-gallery/index'; 
import { AdminSettings } from '../../admin-settings/index'; 
import { AdminOrders } from '../../admin-orders/index'; 
import { AdminArticles } from '../../admin-articles/index';
import { AdminCareer } from '../../admin-career/index'; 
import { AdminDownloads } from '../../admin-downloads/index'; 
import { AdminSocialStudio } from '../../admin-social/index'; 
import { AdminSEO } from '../../admin-seo/index'; 
import { AnalyticsDashboard } from '../../admin-analytics/index';
import { AdminServices } from '../../admin-services/index';
import { SibosTrainer } from '../sibos-trainer/index';
import { AdminDocumentation } from '../documentation/index';
import { AdminCRM } from '../../admin-crm/index';
import { AdminRMA } from '../../admin-rma/index';

const MENU_GROUPS: MenuCategory[] = [
    { id: 'radar', label: 'Intelligence', items: ['analytics', 'crm', 'seo'] },
    { id: 'ops', label: 'Operations', items: ['store', 'rma'] },
    { id: 'content', label: 'Asset Library', items: ['articles', 'gallery', 'downloads'] },
    { id: 'growth', label: 'Expansion', items: ['social', 'career'] },
    { id: 'core', label: 'System Core', items: ['siboy', 'documentation', 'settings'] }
];

const ICON_MAP: Record<string, any> = {
    analytics: BarChart,
    crm: Users,
    seo: Globe,
    store: ShoppingBag,
    rma: Wrench,
    articles: FileText,
    gallery: Image,
    downloads: Download,
    social: Share2,
    career: Briefcase,
    siboy: Bot,
    documentation: BookOpen,
    settings: Settings
};

const LABEL_MAP: Record<string, string> = {
    analytics: 'Traffic Analytics',
    crm: 'Sales War Room',
    seo: 'SEO Engine',
    store: 'Store Management',
    rma: 'Garansi & Retur',
    articles: 'Article Intel',
    gallery: 'Portfolio Case',
    downloads: 'File Center',
    social: 'Social Studio',
    career: 'HR Recruitment',
    siboy: 'AI Trainer',
    documentation: 'War Manual',
    settings: 'Core Settings'
};

export const DashboardShell = (props: DashboardProps) => {
    const navigate = useNavigate();
    const { activeTab, setActiveTab, storeSubTab, setStoreSubTab } = useAdminDashboard();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const renderActiveModule = () => {
        switch (activeTab) {
            case 'analytics': return <AnalyticsDashboard />;
            case 'crm': return <AdminCRM config={props.config} />;
            case 'store':
                return (
                    <div className="space-y-6">
                        <div className="bg-brand-dark/40 p-1.5 rounded-2xl inline-flex border border-white/5 w-full mb-6 shadow-inner backdrop-blur-sm">
                            <StoreSubTabBtn active={storeSubTab === 'orders'} onClick={() => setStoreSubTab('orders')} icon={Package} label="ORDERS" />
                            <StoreSubTabBtn active={storeSubTab === 'catalog'} onClick={() => setStoreSubTab('catalog')} icon={LayoutGrid} label="CATALOG" />
                            <StoreSubTabBtn active={storeSubTab === 'services'} onClick={() => setStoreSubTab('services')} icon={Cpu} label="SERVICES" />
                        </div>
                        <div>
                            {storeSubTab === 'orders' ? <AdminOrders config={props.config} /> : 
                             storeSubTab === 'catalog' ? <AdminProducts products={props.products} setProducts={props.setProducts} /> : 
                             <AdminServices config={props.config} />}
                        </div>
                    </div>
                );
            case 'rma': return <AdminRMA />;
            case 'siboy': return <SibosTrainer />;
            case 'seo': return <AdminSEO />;
            case 'gallery': return <AdminGallery gallery={props.gallery} setGallery={props.setGallery} testimonials={props.testimonials} setTestimonials={props.setTestimonials} />;
            case 'articles': return <AdminArticles articles={props.articles} setArticles={props.setArticles} gallery={props.gallery} config={props.config} products={props.products} />;
            case 'career': return <AdminCareer jobs={props.jobs} setJobs={props.setJobs} />;
            case 'downloads': return <AdminDownloads />;
            case 'social': return <AdminSocialStudio products={props.products} articles={props.articles} gallery={props.gallery} />;
            case 'documentation': return <AdminDocumentation />;
            case 'settings': return <AdminSettings config={props.config} setConfig={props.setConfig} />;
            default: return <AnalyticsDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-col lg:flex-row relative selection:bg-brand-orange selection:text-white">
            
            {/* --- MOBILE TOP HEADER --- */}
            <div className="lg:hidden h-16 bg-brand-card/95 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-[60] backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white shadow-[0_0_15px_#FF5F1F]">
                        <Terminal size={18} />
                    </div>
                    <span className="font-display font-black text-white uppercase tracking-widest text-[10px]">SOLO_CMD_V3</span>
                </div>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                    className="p-2.5 text-brand-orange bg-brand-orange/5 border border-brand-orange/20 rounded-xl active:scale-90 transition-transform"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* --- MAIN CONTENT (LEFT SIDE ON DESKTOP) --- */}
            <main className="flex-1 min-h-screen p-4 lg:p-8 pb-24 lg:pb-8 relative lg:order-1">
                <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_top_left,rgba(255,95,31,0.05),transparent)] pointer-events-none -z-10"></div>
                
                <div className="max-w-[1600px] mx-auto">
                    <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-0.5">
                                <span className="p-1 bg-brand-orange/10 rounded border border-brand-orange/30"><Zap size={10} className="text-brand-orange" /></span>
                                Command &gt; {activeTab}
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-black text-white tracking-tighter leading-none">
                                {LABEL_MAP[activeTab].toUpperCase()}
                            </h1>
                        </div>
                        
                        <div className="flex gap-3 items-center">
                             <SystemHealthWidget horizontal />
                             
                             <div className="bg-brand-card/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-xl group hover:border-brand-orange/30 transition-all cursor-help">
                                <div className="relative">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,1)]"></div>
                                    <div className="absolute inset-0 rounded-full bg-green-500/50 animate-ping"></div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[8px] font-black text-white uppercase tracking-widest block leading-none mb-0.5">System Live</span>
                                    <span className="text-[7px] text-gray-500 font-mono uppercase tracking-tighter block leading-none">Lat: 24ms</span>
                                </div>
                             </div>
                        </div>
                    </header>

                    <div>
                        {renderActiveModule()}
                    </div>
                </div>
            </main>

            {/* --- STICKY SIDEBAR NAV (RIGHT SIDE ON DESKTOP) --- */}
            <aside 
                className={`fixed lg:sticky top-0 right-0 h-screen w-72 lg:w-[280px] bg-brand-card/40 backdrop-blur-3xl border-l border-white/5 z-50 flex flex-col transition-all duration-500 transform lg:translate-x-0 lg:order-2 shadow-[-20px_0_50px_rgba(0,0,0,0.3)] ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Sidebar Header with Action Buttons */}
                <div className="p-6 border-b border-white/5 bg-black/40 shrink-0 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-[0_0_15px_rgba(255,95,31,0.3)] shrink-0">
                            <Box size={20} />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-white font-black text-sm leading-none tracking-tight truncate">SOLO CMD</h3>
                            <p className="text-[8px] text-brand-orange font-black uppercase tracking-[0.25em] mt-1 flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-brand-orange animate-ping"></div> V 3.0 GOLD
                            </p>
                        </div>
                    </div>
                    
                    {/* TOP ACTION BUTTONS */}
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => window.open('/', '_blank')}
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-brand-orange/30 hover:bg-brand-orange/5 transition-all group"
                        >
                            <ArrowUpRight size={14} className="text-brand-orange group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest group-hover:text-white">Web</span>
                        </button>
                        <button 
                            onClick={props.onLogout}
                            className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group"
                        >
                            <LogOut size={14} className="text-red-500 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest group-hover:text-red-400">Exit</span>
                        </button>
                    </div>
                </div>

                {/* Sidebar Menu - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-1">
                    {MENU_GROUPS.map(group => (
                        <div key={group.id} className="mb-4">
                            <SidebarGroupHeader label={group.label} />
                            <div className="space-y-1">
                                {group.items.map(tabId => (
                                    <SidebarTabButton 
                                        key={tabId}
                                        id={tabId}
                                        label={LABEL_MAP[tabId].split(' ')[0]}
                                        icon={ICON_MAP[tabId]}
                                        isActive={activeTab === tabId}
                                        onClick={() => {
                                            setActiveTab(tabId);
                                            if(window.innerWidth < 1024) setIsSidebarOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Bottom Branding */}
                <div className="p-6 border-t border-white/5 opacity-20 hover:opacity-100 transition-opacity duration-500 flex justify-between items-center">
                    <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.4em]">Proprietary OS © 2025</p>
                    <ShieldCheck size={12} className="text-brand-orange" />
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/95 backdrop-blur-md z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};