
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingBag, Package, LayoutGrid, Image, Settings, 
    LogOut, FileText, Briefcase, 
    BarChart, Download, Share2, Globe, Cpu, 
    Bot, BookOpen, Users, LayoutDashboard, Menu, X, ArrowUpRight,
    Terminal, ShieldCheck, Activity, Box, Zap
} from 'lucide-react';
import { DashboardProps, MenuCategory } from '../types';
import { useAdminDashboard } from '../logic';
import { SidebarTabButton, SidebarGroupHeader, StoreSubTabBtn, SidebarActionBtn, SystemHealthWidget, SystemLogWidget } from '../ui-parts';

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

const MENU_GROUPS: MenuCategory[] = [
    { id: 'radar', label: 'Intelligence', items: ['analytics', 'crm', 'seo'] },
    { id: 'ops', label: 'Operations', items: ['store'] },
    { id: 'content', label: 'Asset Library', items: ['articles', 'gallery', 'downloads'] },
    { id: 'growth', label: 'Expansion', items: ['social', 'career'] },
    { id: 'core', label: 'System Core', items: ['siboy', 'documentation', 'settings'] }
];

const ICON_MAP: Record<string, any> = {
    analytics: BarChart,
    crm: Users,
    seo: Globe,
    store: ShoppingBag,
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
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Smooth transition between tabs
    useEffect(() => {
        setIsTransitioning(true);
        const timer = setTimeout(() => setIsTransitioning(false), 350);
        return () => clearTimeout(timer);
    }, [activeTab, storeSubTab]);

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
                        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
                            {storeSubTab === 'orders' ? <AdminOrders config={props.config} /> : 
                             storeSubTab === 'catalog' ? <AdminProducts products={props.products} setProducts={props.setProducts} /> : 
                             <AdminServices config={props.config} />}
                        </div>
                    </div>
                );
            case 'siboy': return <SibosTrainer />;
            case 'seo': return <AdminSEO />;
            case 'gallery': return <AdminGallery gallery={props.gallery} setGallery={props.setGallery} testimonials={props.testimonials} setTestimonials={props.setTestimonials} />;
            case 'articles': return <AdminArticles articles={props.articles} setArticles={props.setArticles} gallery={props.gallery} config={props.config} />;
            case 'career': return <AdminCareer jobs={props.jobs} setJobs={props.setJobs} />;
            case 'downloads': return <AdminDownloads />;
            case 'social': return <AdminSocialStudio products={props.products} articles={props.articles} gallery={props.gallery} />;
            case 'documentation': return <AdminDocumentation />;
            case 'settings': return <AdminSettings config={props.config} setConfig={props.setConfig} />;
            default: return <AnalyticsDashboard />;
        }
    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-col lg:flex-row relative overflow-hidden selection:bg-brand-orange selection:text-white">
            
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

            {/* --- MAIN CONTENT (LEFT SIDE) --- */}
            <main className="flex-1 min-h-screen overflow-y-auto custom-scrollbar p-4 lg:p-12 order-2 lg:order-1 pb-24 lg:pb-12 relative">
                {/* Background Accent Grid */}
                <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_top_left,rgba(255,95,31,0.05),transparent)] pointer-events-none -z-10"></div>
                
                <div className="max-w-[1600px] mx-auto">
                    <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-10">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 text-[9px] font-black text-gray-500 uppercase tracking-[0.4em] mb-1">
                                <span className="p-1 bg-brand-orange/10 rounded border border-brand-orange/30"><Zap size={10} className="text-brand-orange" /></span>
                                Command &gt; {activeTab}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-display font-black text-white tracking-tighter leading-none">
                                {LABEL_MAP[activeTab].toUpperCase()}
                            </h1>
                        </div>
                        
                        <div className="flex gap-4 items-center">
                             <div className="bg-brand-card/80 backdrop-blur-md border border-white/10 px-5 py-2.5 rounded-2xl flex items-center gap-4 shadow-xl group hover:border-brand-orange/30 transition-all cursor-help">
                                <div className="relative">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,1)]"></div>
                                    <div className="absolute inset-0 rounded-full bg-green-500/50 animate-ping"></div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest block">System Live</span>
                                    <span className="text-[8px] text-gray-500 font-mono uppercase tracking-tighter">Lat: 24ms</span>
                                </div>
                             </div>
                        </div>
                    </header>

                    <div className={`transition-all duration-500 transform ${isTransitioning ? 'opacity-0 translate-y-10 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'}`}>
                        {renderActiveModule()}
                    </div>
                </div>
            </main>

            {/* --- SIDEBAR NAV (RIGHT SIDE) --- */}
            <aside 
                className={`fixed lg:sticky top-0 right-0 h-screen w-72 lg:w-[350px] bg-brand-card/40 backdrop-blur-3xl border-l border-white/5 z-50 flex flex-col transition-all duration-500 transform lg:translate-x-0 order-1 lg:order-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Sidebar Header */}
                <div className="p-10 border-b border-white/5 bg-black/40 shrink-0">
                    <div className="flex items-center gap-5 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,95,31,0.4)] rotate-2 hover:rotate-0 transition-transform cursor-pointer active:scale-90">
                            <Box size={30} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-2xl leading-none tracking-tighter">SOLO COMMAND</h3>
                            <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.25em] mt-1.5 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-brand-orange animate-ping"></div> V 3.0 GOLD
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="h-1 bg-brand-orange w-1/4 rounded-full shadow-[0_0_5px_#FF5F1F]"></div>
                        <div className="h-1 bg-white/10 w-1/4 rounded-full"></div>
                        <div className="h-1 bg-white/10 w-1/4 rounded-full"></div>
                        <div className="h-1 bg-white/10 w-1/4 rounded-full"></div>
                    </div>
                </div>

                {/* Sidebar Menu - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
                    {MENU_GROUPS.map(group => (
                        <div key={group.id} className="mb-6">
                            <SidebarGroupHeader label={group.label} />
                            <div className="space-y-1.5">
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
                    
                    <div className="mt-10 mb-4">
                        <SystemHealthWidget />
                        <SystemLogWidget />
                    </div>
                </div>

                {/* Sidebar Footer - Fixed */}
                <div className="p-8 border-t border-white/5 bg-black/60 space-y-4 shrink-0">
                    <SidebarActionBtn 
                        onClick={() => window.open('/', '_blank')} 
                        icon={ArrowUpRight} 
                        label="Launch Platform" 
                    />
                    <SidebarActionBtn 
                        onClick={props.onLogout} 
                        icon={LogOut} 
                        label="Abort Mission" 
                        variant="danger" 
                    />
                    <div className="pt-6 flex justify-between items-center opacity-20 hover:opacity-100 transition-opacity duration-500">
                        <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.4em]">Proprietary OS © 2025</p>
                        <ShieldCheck size={14} className="text-brand-orange" />
                    </div>
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
