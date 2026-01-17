
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingBag, Package, LayoutGrid, Image, Settings, 
    Layers, LogOut, FileText, Home, Briefcase, 
    BarChart, Download, Share2, Globe, Zap, Cpu, 
    Bot, BookOpen, Users, LayoutDashboard, Menu, X, ArrowUpRight,
    Terminal, ShieldCheck, Activity
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

const MENU_GROUPS: MenuCategory[] = [
    {
        id: 'radar',
        label: 'Intelligence',
        items: ['analytics', 'crm', 'seo']
    },
    {
        id: 'ops',
        label: 'Operations',
        items: ['store']
    },
    {
        id: 'content',
        label: 'Asset Library',
        items: ['articles', 'gallery', 'downloads']
    },
    {
        id: 'growth',
        label: 'Expansion',
        items: ['social', 'career']
    },
    {
        id: 'core',
        label: 'System Core',
        items: ['siboy', 'documentation', 'settings']
    }
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
        const timer = setTimeout(() => setIsTransitioning(false), 300);
        return () => clearTimeout(timer);
    }, [activeTab, storeSubTab]);

    const renderActiveModule = () => {
        switch (activeTab) {
            case 'analytics': return <AnalyticsDashboard />;
            case 'crm': return <AdminCRM config={props.config} />;
            case 'store':
                return (
                    <div className="space-y-6">
                        <div className="bg-brand-dark/50 p-1.5 rounded-2xl inline-flex border border-white/5 w-full mb-4 shadow-inner">
                            <StoreSubTabBtn active={storeSubTab === 'orders'} onClick={() => setStoreSubTab('orders')} icon={Package} label="ORDERS" />
                            <StoreSubTabBtn active={storeSubTab === 'catalog'} onClick={() => setStoreSubTab('catalog')} icon={LayoutGrid} label="CATALOG" />
                            <StoreSubTabBtn active={storeSubTab === 'services'} onClick={() => setStoreSubTab('services')} icon={Cpu} label="SERVICES" />
                        </div>
                        <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
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
        <div className="min-h-screen bg-brand-black flex flex-col lg:flex-row relative overflow-hidden">
            
            {/* --- MOBILE TOP HEADER --- */}
            <div className="lg:hidden h-16 bg-brand-card/95 border-b border-white/5 flex items-center justify-between px-6 sticky top-0 z-[60] backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white shadow-neon">
                        <Terminal size={18} />
                    </div>
                    <span className="font-display font-black text-white uppercase tracking-widest text-xs">SOLO_CMD_CENTER</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-brand-orange bg-brand-orange/10 rounded-lg">
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* --- MAIN CONTENT (LEFT SIDE) --- */}
            <main className="flex-1 min-h-screen overflow-y-auto custom-scrollbar p-4 lg:p-10 order-2 lg:order-1 pb-24 lg:pb-10 relative">
                {/* Background Accent */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-orange/5 to-transparent pointer-events-none -z-10"></div>
                
                <div className="max-w-[1500px] mx-auto">
                    <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-8">
                        <div>
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mb-2">
                                <Activity size={10} className="text-brand-orange" /> Control Center &gt; {activeTab}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-display font-black text-white tracking-tighter">
                                {LABEL_MAP[activeTab].toUpperCase()}
                            </h1>
                        </div>
                        <div className="flex gap-4 items-center">
                             <div className="bg-brand-card border border-white/10 px-4 py-2 rounded-xl flex items-center gap-3 shadow-lg">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">System Live</span>
                             </div>
                        </div>
                    </header>

                    <div className={`transition-all duration-300 transform ${isTransitioning ? 'opacity-0 translate-y-4 scale-[0.98]' : 'opacity-100 translate-y-0 scale-100'}`}>
                        {renderActiveModule()}
                    </div>
                </div>
            </main>

            {/* --- SIDEBAR NAV (RIGHT SIDE) --- */}
            <aside 
                className={`fixed lg:sticky top-0 right-0 h-screen w-72 lg:w-[340px] bg-brand-card/50 backdrop-blur-2xl border-l border-white/5 z-50 flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) transform lg:translate-x-0 order-1 lg:order-2 shadow-2xl ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Sidebar Header */}
                <div className="p-8 border-b border-white/5 bg-black/40 shrink-0">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-brand-gradient flex items-center justify-center text-white shadow-neon-strong rotate-3 hover:rotate-0 transition-transform">
                            <LayoutDashboard size={26} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-xl leading-none tracking-tighter">SOLO COMMAND</h3>
                            <p className="text-[10px] text-brand-orange font-black uppercase tracking-[0.2em] mt-1">V 3.0 REBORN</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-brand-orange w-1/3 shadow-neon-text"></div></div>
                        <div className="flex-1 h-1 bg-white/5 rounded-full"></div>
                        <div className="flex-1 h-1 bg-white/5 rounded-full"></div>
                    </div>
                </div>

                {/* Sidebar Menu - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
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
                    
                    <SystemHealthWidget />
                </div>

                {/* Sidebar Footer - Fixed */}
                <div className="p-8 border-t border-white/5 bg-black/60 space-y-3 shrink-0">
                    <SidebarActionBtn 
                        onClick={() => window.open('/', '_blank')} 
                        icon={ArrowUpRight} 
                        label="Launch Website" 
                    />
                    <SidebarActionBtn 
                        onClick={props.onLogout} 
                        icon={LogOut} 
                        label="Terminate Session" 
                        variant="danger" 
                    />
                    <div className="pt-6 flex justify-between items-center opacity-30 group hover:opacity-100 transition-opacity">
                        <p className="text-[8px] text-gray-400 font-black uppercase tracking-[0.3em]">MKS COMMAND CENTER</p>
                        <ShieldCheck size={12} className="text-brand-orange" />
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/90 backdrop-blur-md z-40 lg:hidden animate-fade-in"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
