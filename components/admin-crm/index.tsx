
import React, { useState, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus } from './types';
import { ShoppingCart, X, LayoutDashboard, Sparkles, Database, Search } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';

// Shared Components
import { BriefingHeader } from './shared/briefing-header';

// Feature Modules
import { CustomerDetailModal } from './customer-detail';
import { PipelineModule } from './pipeline';
import { DatabaseModule } from './database';

// Global Shared Admin Features
import { OrdersPanel } from '../admin-orders/orders-panel';

type CRMTab = 'pipeline' | 'orders' | 'list';

export const AdminCRM = ({ config }: { config: any }) => {
    const { 
        state, setSearchTerm, filteredCustomers, 
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, refresh,
        selectedCustomer, setSelectedCustomer
    } = useCRMLogic();

    const [activeSubTab, setActiveSubTab] = useState<CRMTab>('pipeline');

    useEffect(() => {
        const onHeaderRefresh = (e: any) => {
            if (e.detail && e.detail.tab === 'sales') {
                refresh();
            }
        };
        window.addEventListener('mks:refresh-module', onHeaderRefresh);
        return () => window.removeEventListener('mks:refresh-module', onHeaderRefresh);
    }, [refresh]);

    const handleStatusUpdate = (phone: string, status: LeadStatus) => {
        updateStatus(phone, status);
    };

    const TABS = [
        { 
            id: 'pipeline', 
            label: 'Papan Strategi', 
            desc: 'Pipeline Prospek', 
            icon: LayoutDashboard,
            brief: "Pusat kendali perang. Semua leads (Shadow, Simulasi, & Kontak) kumpul di sini. Pantau suhu leads: Merah (Hot) pancing pake SIBOS AI, Biru (Warm) pelajari profilnya."
        },
        { 
            id: 'orders', 
            label: 'Gudang Duit', 
            desc: 'Order Hardware', 
            icon: ShoppingCart,
            brief: "Rekaman pesanan hardware yang udah deal. Fokus buat urusan logistik: packing barang, atur kurir, dan input resi biar juragan bisa lacak."
        },
        { 
            id: 'list', 
            label: 'Arsip Intelijen', 
            desc: 'Database Juragan', 
            icon: Database,
            brief: "Database master juragan. Satu nomor WA merekam semua jejak (Simulasi, Order, Chat). Gunakan buat analisa loyalitas dan strategi repeat order."
        }
    ];

    const currentTabInfo = TABS.find(t => t.id === activeSubTab);

    return (
        <div className="space-y-6 pb-20">
            {/* AI STRATEGIC OVERLAY */}
            {aiRecommendation && (
                <div className="bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-3xl relative animate-fade-in shadow-neon-text/5">
                    <button onClick={() => setAiRecommendation(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={18}/></button>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 bg-brand-orange/10 rounded-xl border border-brand-orange/30"><Sparkles className="text-brand-orange" size={20} /></span>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">Radar Strategic SIBOS</h3>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <SimpleMarkdown content={aiRecommendation} />
                    </div>
                </div>
            )}

            {/* STICKY NAV BAR (RADAR STYLE - NO CONTAINER) */}
            <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md py-3 -mx-4 px-4 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full">
                    {TABS.map((tab) => {
                        const isActive = activeSubTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveSubTab(tab.id as CRMTab)}
                                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all shrink-0 group ${
                                    isActive 
                                    ? 'bg-brand-orange border-brand-orange text-white shadow-neon' 
                                    : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'
                                }`}
                            >
                                <tab.icon size={16} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-brand-orange'} />
                                <div className="text-left">
                                    <p className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</p>
                                    <p className={`text-[8px] mt-0.5 font-bold ${isActive ? 'text-white/60' : 'text-gray-700'}`}>{tab.desc}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="relative group w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
                    <input 
                        type="text"
                        value={state.searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={`Filter data ${activeSubTab}...`}
                        className="w-full bg-brand-dark border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 shadow-inner"
                    />
                </div>
            </div>

            {/* COMMAND BRIEFING AREA */}
            {currentTabInfo && (
                <BriefingHeader 
                    icon={currentTabInfo.icon} 
                    color={activeSubTab === 'orders' ? 'text-green-500' : activeSubTab === 'list' ? 'text-purple-400' : 'text-brand-orange'} 
                    label={currentTabInfo.label} 
                    text={currentTabInfo.brief} 
                />
            )}

            {state.loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
            ) : (
                <div className="animate-fade-in">
                    {activeSubTab === 'pipeline' && (
                        <PipelineModule 
                            customers={filteredCustomers} 
                            onOpenDetail={setSelectedCustomer} 
                            onStatusUpdate={handleStatusUpdate}
                            onRescue={runRecoveryAI}
                            isRescuingId={isGeneratingScript}
                        />
                    )}
                    {activeSubTab === 'orders' && <OrdersPanel config={config} searchTerm={state.searchTerm} />}
                    {activeSubTab === 'list' && (
                        <DatabaseModule 
                            customers={filteredCustomers} 
                            onOpenDetail={setSelectedCustomer} 
                            onRescue={runRecoveryAI} 
                        />
                    )}
                </div>
            )}

            {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        </div>
    );
};
