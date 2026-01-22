
import React, { lazy, Suspense } from 'react';
import { AdminTabId } from '../types';
import { LoadingSpinner } from '../../ui';
import { Package, LayoutGrid, Cpu } from 'lucide-react';
import { StoreSubTabBtn } from '../ui-parts';

// LAZY IMPORTS
const AnalyticsDashboard = lazy(() => import('../../admin-analytics/index').then(m => ({ default: m.AnalyticsDashboard })));
const AdminCRM = lazy(() => import('../../admin-crm/index').then(m => ({ default: m.AdminCRM })));
const AdminSEO = lazy(() => import('../../admin-seo/index').then(m => ({ default: m.AdminSEO })));
const AdminRMA = lazy(() => import('../../admin-rma/index').then(m => ({ default: m.AdminRMA })));
const AdminOrders = lazy(() => import('../../admin-orders/index').then(m => ({ default: m.AdminOrders })));
const AdminProducts = lazy(() => import('../../admin-products/index').then(m => ({ default: m.AdminProducts })));
const AdminServices = lazy(() => import('../../admin-services/index').then(m => ({ default: m.AdminServices })));
const AdminArticles = lazy(() => import('../../admin-articles/index').then(m => ({ default: m.AdminArticles })));
const AdminGallery = lazy(() => import('../../admin-gallery/index').then(m => ({ default: m.AdminGallery })));
const AdminCareer = lazy(() => import('../../admin-career/index').then(m => ({ default: m.AdminCareer })));
const AdminDownloads = lazy(() => import('../../admin-downloads/index').then(m => ({ default: m.AdminDownloads })));
const AdminSocialStudio = lazy(() => import('../../admin-social/index').then(m => ({ default: m.AdminSocialStudio })));
const AdminMedia = lazy(() => import('../../admin-media/index').then(m => ({ default: m.AdminMedia })));
const SibosTrainer = lazy(() => import('../sibos-trainer/index').then(m => ({ default: m.SibosTrainer })));
const AdminDocumentation = lazy(() => import('../documentation/index').then(m => ({ default: m.AdminDocumentation })));
const AdminSettings = lazy(() => import('../../admin-settings/index').then(m => ({ default: m.AdminSettings })));

const ModuleLoader = () => (
    <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
        <LoadingSpinner size={32} className="text-brand-orange" />
        <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Memanggil Modul...</p>
    </div>
);

export const ModuleRenderer = ({ 
    activeTab, 
    storeSubTab, 
    setStoreSubTab,
    props 
}: { 
    activeTab: AdminTabId, 
    storeSubTab: any, 
    setStoreSubTab: any,
    props: any 
}) => {
    return (
        <Suspense fallback={<ModuleLoader />}>
            {(() => {
                switch (activeTab) {
                    case 'analytics': return <AnalyticsDashboard />;
                    case 'crm': return <AdminCRM config={props.config} />;
                    case 'seo': return <AdminSEO />;
                    case 'store':
                        return (
                            <div className="space-y-6">
                                <div className="bg-brand-dark/40 p-1.5 rounded-2xl inline-flex border border-white/5 w-full mb-6 shadow-inner backdrop-blur-sm">
                                    <StoreSubTabBtn active={storeSubTab === 'orders'} onClick={() => setStoreSubTab('orders')} icon={Package} label="ORDERS" />
                                    <StoreSubTabBtn active={storeSubTab === 'catalog'} onClick={() => setStoreSubTab('catalog')} icon={LayoutGrid} label="CATALOG" />
                                    <StoreSubTabBtn active={storeSubTab === 'services'} onClick={() => setStoreSubTab('services')} icon={Cpu} label="SERVICES" />
                                </div>
                                <Suspense fallback={<ModuleLoader />}>
                                    {storeSubTab === 'orders' ? <AdminOrders config={props.config} /> : 
                                     storeSubTab === 'catalog' ? <AdminProducts products={props.products} setProducts={props.setProducts} /> : 
                                     <AdminServices config={props.config} />}
                                </Suspense>
                            </div>
                        );
                    case 'rma': return <AdminRMA />;
                    case 'gallery': return <AdminGallery gallery={props.gallery} setGallery={props.setGallery} testimonials={props.testimonials} setTestimonials={props.setTestimonials} />;
                    case 'articles': return <AdminArticles articles={props.articles} setArticles={props.setArticles} gallery={props.gallery} config={props.config} products={props.products} />;
                    case 'career': return <AdminCareer jobs={props.jobs} setJobs={props.setJobs} />;
                    case 'media': return <AdminMedia />;
                    case 'downloads': return <AdminDownloads />;
                    case 'social': return <AdminSocialStudio products={props.products} articles={props.articles} gallery={props.gallery} />;
                    case 'siboy': return <SibosTrainer />;
                    case 'documentation': return <AdminDocumentation />;
                    case 'settings': return <AdminSettings config={props.config} setConfig={props.setConfig} />;
                    default: return <AnalyticsDashboard />;
                }
            })()}
        </Suspense>
    );
};
