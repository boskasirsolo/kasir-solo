
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Package, LayoutGrid, Image, Settings, Layers, LogOut, FileText, Home, Briefcase, BarChart, Download, Share2, Globe, Zap } from 'lucide-react';
import { DashboardProps } from '../types';
import { useAdminDashboard } from '../logic';
import { TabButton, HeaderActionBtn, StoreSubTabBtn } from '../ui-parts';

// Sub-Modules Imports
import { AdminProducts } from '../../admin-products/index'; 
import { AdminGallery } from '../../admin-gallery/index'; 
import { AdminSettings } from '../../admin-settings/index'; 
import { AdminOrders } from '../../admin-orders/index'; 
import { AdminArticles } from '../../admin-articles/index'; // Updated import to be explicit
import { AdminCareer } from '../../admin-career/index'; 
import { AdminDownloads } from '../../admin-downloads/index'; 
import { AdminSocialStudio } from '../../admin-social/index'; 
import { AdminSEO } from '../../admin-seo/index'; 
import { AnalyticsDashboard } from '../../admin-analytics/index';

export const DashboardShell = (props: DashboardProps) => {
    const navigate = useNavigate();
    const { activeTab, setActiveTab, storeSubTab, setStoreSubTab, showConnectAI, connectAI } = useAdminDashboard();

    return (
        <div className="container mx-auto px-4 py-6 animate-fade-in">
            {/* --- HEADER --- */}
            <div className="flex flex-col xl:flex-row items-center justify-between mb-4 pb-4 border-b border-white/10 gap-4">
                <div className="flex items-center gap-4 w-full xl:w-auto justify-between xl:justify-start">
                    <div>
                        <h2 className="text-xl font-bold text-white font-display">Dashboard Admin</h2>
                        <p className="text-gray-400 text-[10px] mt-0.5">Kelola konten dan operasional bisnis.</p>
                    </div>
                    <div className="xl:hidden">
                        <button onClick={props.onLogout} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><LogOut size={16}/></button>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto justify-center xl:justify-end">
                    <div className="flex flex-wrap justify-center gap-1.5">
                        <TabButton id="analytics" label="TRAFFIC" icon={BarChart} isActive={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
                        <TabButton id="store" label="TOKO" icon={ShoppingBag} isActive={activeTab === 'store'} onClick={() => setActiveTab('store')} />
                        <TabButton id="seo" label="SEO KOTA" icon={Globe} isActive={activeTab === 'seo'} onClick={() => setActiveTab('seo')} />
                        <TabButton id="gallery" label="GALERI" icon={Image} isActive={activeTab === 'gallery'} onClick={() => setActiveTab('gallery')} />
                        <TabButton id="articles" label="ARTIKEL" icon={FileText} isActive={activeTab === 'articles'} onClick={() => setActiveTab('articles')} />
                        <TabButton id="career" label="KARIR" icon={Briefcase} isActive={activeTab === 'career'} onClick={() => setActiveTab('career')} /> 
                        <TabButton id="downloads" label="FILE" icon={Download} isActive={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')} />
                        <TabButton id="social" label="STUDIO" icon={Share2} isActive={activeTab === 'social'} onClick={() => setActiveTab('social')} />
                        <TabButton id="settings" label="SETTING" icon={Settings} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                    </div>
                    
                    <div className="w-px h-6 bg-white/10 hidden xl:block mx-2"></div>
                    
                    <div className="flex items-center gap-2 hidden xl:flex">
                        <HeaderActionBtn onClick={() => navigate('/')} icon={Home} title="Lihat Website" />
                        {showConnectAI && (
                            <HeaderActionBtn onClick={connectAI} icon={Zap} variant="info" title="Hubungkan ulang API Key Gemini (IDX Only)" />
                        )}
                        <HeaderActionBtn onClick={props.onLogout} icon={LogOut} variant="danger" title="Keluar Dashboard" />
                    </div>
                </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="bg-brand-card border border-white/10 rounded-xl min-h-[600px] shadow-2xl relative overflow-hidden">
                
                {/* 1. ANALYTICS */}
                {activeTab === 'analytics' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AnalyticsDashboard />
                    </div>
                )}

                {/* 2. STORE (Orders & Products) */}
                {activeTab === 'store' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
                            <div className="bg-brand-dark p-1 rounded-lg inline-flex border border-white/10">
                                <StoreSubTabBtn active={storeSubTab === 'orders'} onClick={() => setStoreSubTab('orders')} icon={Package} label="Pesanan Masuk" />
                                <StoreSubTabBtn active={storeSubTab === 'catalog'} onClick={() => setStoreSubTab('catalog')} icon={LayoutGrid} label="Katalog Produk" />
                            </div>
                            <div className="text-gray-500 text-xs flex items-center gap-2 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                                <Layers size={12} className="text-brand-orange"/>
                                Mode Aktif: <span className="text-gray-300 font-bold">{storeSubTab === 'orders' ? 'Manajemen Pesanan' : 'Editor Produk'}</span>
                            </div>
                        </div>

                        {storeSubTab === 'orders' ? (
                            <AdminOrders config={props.config} /> 
                        ) : (
                            <AdminProducts products={props.products} setProducts={props.setProducts} />
                        )}
                    </div>
                )}

                {/* 3. SEO */}
                {activeTab === 'seo' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AdminSEO />
                    </div>
                )}

                {/* 4. GALLERY */}
                {activeTab === 'gallery' && (
                    <div className="animate-fade-in relative z-10 h-full">
                        <AdminGallery 
                            gallery={props.gallery} setGallery={props.setGallery} 
                            testimonials={props.testimonials} setTestimonials={props.setTestimonials}
                        />
                    </div>
                )}

                {/* 5. ARTICLES */}
                {activeTab === 'articles' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AdminArticles 
                            articles={props.articles} setArticles={props.setArticles} 
                            gallery={props.gallery} config={props.config} 
                        />
                    </div>
                )}

                {/* 6. CAREER */}
                {activeTab === 'career' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AdminCareer jobs={props.jobs} setJobs={props.setJobs} />
                    </div>
                )}

                {/* 7. DOWNLOADS */}
                {activeTab === 'downloads' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AdminDownloads />
                    </div>
                )}

                {/* 8. SOCIAL STUDIO */}
                {activeTab === 'social' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AdminSocialStudio 
                            products={props.products} 
                            articles={props.articles} 
                            gallery={props.gallery} 
                        />
                    </div>
                )}

                {/* 9. SETTINGS */}
                {activeTab === 'settings' && (
                    <div className="animate-fade-in relative z-10 p-4 md:p-6">
                        <AdminSettings config={props.config} setConfig={props.setConfig} />
                    </div>
                )}
            </div>
        </div>
    );
};
