
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ShoppingBag, Package, LayoutGrid, Image, Settings, 
    Layers, LogOut, FileText, Home, Briefcase, 
    BarChart, Download, Share2, Globe, Zap, Cpu, 
    Bot, BookOpen, Users, LayoutDashboard, Menu, X, ArrowUpRight
} from 'lucide-react';
import { DashboardProps, MenuCategory } from '../types';
import { useAdminDashboard } from '../logic';
import { SidebarTabButton, SidebarGroupHeader, StoreSubTabBtn, SidebarActionBtn } from '../ui-parts';

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
        label: 'Radar Bisnis',
        items: ['analytics', 'crm', 'seo']
    },
    {
        id: 'ops',
        label: 'Operasional',
        items: ['store']
    },
    {
        id: 'content',
        label: 'Aset Digital',
        items: ['articles', 'gallery', 'downloads']
    },
    {
        id: 'growth',
        label: 'Ekspansi & Tim',
        items: ['social', 'career']
    },
    {
        id: 'core',
        label: 'Kontrol Sistem',
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
    analytics: 'Traffic',
    crm: 'War Room',
    seo: 'SEO Engine',
    store: 'Manajemen Toko',
    articles: 'Artikel',
    gallery: 'Galeri',
    downloads: 'File Center',
    social: 'Social Studio',
    career: 'Manajemen Karir',
    siboy: 'Training AI',
    documentation: 'War Manual',
    settings: 'Pengaturan'
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
                        <div className="bg-brand-dark p-1 rounded-xl inline-flex border border-white/10 w-full mb-4">
                            <StoreSubTabBtn active={storeSubTab === 'orders'} onClick={() => setStoreSubTab('orders')} icon={Package} label="PESANAN" />
                            <StoreSubTabBtn active={storeSubTab === 'catalog'} onClick={() => setStoreSubTab('catalog')} icon={LayoutGrid} label="PRODUK" />
                            <StoreSubTabBtn active={storeSubTab === 'services'} onClick={() => setStoreSubTab('services')} icon={Cpu} label="LAYANAN" />
                        </div>
                        {storeSubTab === 'orders' ? <AdminOrders config={props.config} /> : 
                         storeSubTab === 'catalog' ? <AdminProducts products={props.products} setProducts={props.setProducts} /> : 
                         <AdminServices config={props.config} />}
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
        <div className="min-h-screen bg-brand-black flex flex-col lg:flex-row relative">
            
            {/* --- MOBILE TOP HEADER --- */}
            <div className="lg:hidden h-16 bg-brand-card border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-[60] backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-brand-orange flex items-center justify-center text-white">
                        <LayoutDashboard size={18} />
                    </div>
                    <span className="font-display font-bold text-white uppercase tracking-widest text-sm">SIBOS ADMIN</span>
                </div>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 text-brand-orange">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* --- MAIN CONTENT (LEFT SIDE) --- */}
            <main className="flex-1 min-h-screen overflow-y-auto custom-scrollbar p-4 lg:p-8 order-2 lg:order-1 pb-24 lg:pb-8">
                <div className="max-w-[1400px] mx-auto animate-fade-in">
                    <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-display font-bold text-white">
                                {LABEL_MAP[activeTab]}
                            </h1>
                            <p className="text-gray-500 text-xs mt-1 uppercase tracking-widest font-bold">
                                Control Center &gt; {activeTab}
                            </p>
                        </div>
                        <div className="hidden md:flex gap-3">
                             <div className="bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-500/20 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                SYSTEM ONLINE
                             </div>
                        </div>
                    </header>

                    {renderActiveModule()}
                </div>
            </main>

            {/* --- SIDEBAR NAV (RIGHT SIDE) --- */}
            <aside 
                className={`fixed lg:sticky top-0 right-0 h-screen w-72 lg:w-[320px] bg-brand-card border-l border-white/5 z-50 flex flex-col transition-transform duration-300 transform lg:translate-x-0 order-1 lg:order-2 shadow-2xl ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/5 bg-black/20 shrink-0">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-neon">
                            <LayoutDashboard size={22} />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-base leading-tight">SOLO COMMAND</h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Admin Dashboard</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Menu - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                    {MENU_GROUPS.map(group => (
                        <div key={group.id} className="mb-4">
                            <SidebarGroupHeader label={group.label} />
                            <div className="space-y-1">
                                {group.items.map(tabId => (
                                    <SidebarTabButton 
                                        key={tabId}
                                        id={tabId}
                                        label={LABEL_MAP[tabId]}
                                        icon={ICON_MAP[tabId]}
                                        isActive={activeTab === tabId}
                                        onClick={() => {
                                            setActiveTab(tabId);
                                            setIsSidebarOpen(false);
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sidebar Footer - Fixed */}
                <div className="p-6 border-t border-white/5 bg-black/40 space-y-3 shrink-0">
                    <SidebarActionBtn 
                        onClick={() => window.open('/', '_blank')} 
                        icon={ArrowUpRight} 
                        label="Lihat Website" 
                    />
                    <SidebarActionBtn 
                        onClick={props.onLogout} 
                        icon={LogOut} 
                        label="Logout" 
                        variant="danger" 
                    />
                    <div className="pt-4 text-center">
                        <p className="text-[9px] text-gray-700 font-bold uppercase tracking-widest">PT MESIN KASIR SOLO © 2025</p>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};
