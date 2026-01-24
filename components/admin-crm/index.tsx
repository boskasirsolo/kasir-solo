
import React, { useState, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus } from './types';
import { RefreshCw, ShoppingCart, X, LayoutDashboard, Sparkles, Ghost, Database, Cpu, Search } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';

// Shared Components
import { NavTabButton } from './shared/atoms';
import { BriefingHeader } from './shared/briefing-header';

// Feature Modules (Now Modular)
import { CustomerDetailModal } from './customer-detail';
import { ShadowModule } from './shadow';
import { PipelineModule } from './pipeline';
import { DatabaseModule } from './database';

// Global Shared Admin Features
import { OrdersPanel } from '../admin-orders/orders-panel';
import { SimulationsPanel } from '../admin-orders/simulations-panel';
import { LeadsPanel } from '../admin-orders/leads-panel';

export const AdminCRM = ({ config }: { config: any }) => {
    const { 
        state, setSearchTerm, filteredCustomers, abandonedLeads,
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, refresh,
        selectedCustomer, setSelectedCustomer
    } = useCRMLogic();

    const [activeSubTab, setActiveSubTab] = useState<'shadow' | 'simulations' | 'pipeline' | 'orders' | 'list'>('shadow');

    // Menerima signal refresh KHUSUS dari header utama
    useEffect(() => {
        const onHeaderRefresh = (e: any) => {
            // Hanya refresh jika modul aktif adalah 'sales' (War Room)
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

    const BRIEFING_DATA = {
        shadow: {
            icon: Ghost,
            color: "text-brand-orange",
            label: "Mata-Mata Radar",
            text: "Ciduk juragan yang nyaris beli (stuck di checkout) tapi ragu. Gunakan SIBOS AI buat sapa duluan lewat WhatsApp sebelum mereka lari ke kompetitor."
        },
        simulations: {
            icon: Cpu,
            color: "text-blue-400",
            label: "Arsitek Proyek",
            text: "Berisi blueprint budget dari juragan yang mainan kalkulator layanan. Mereka punya duit tapi butuh edukasi teknis. Kirim Proposal PDF buat ngetes keseriusannya."
        },
        pipeline: {
            icon: LayoutDashboard,
            color: "text-brand-orange",
            label: "Papan Strategi",
            text: "Pusat kendali negosiasi. Geser kartu prospek dari kiri ke kanan. Pantau suhu leads: Merah (Hot) berarti prioritas tinggi, Biru (Warm) butuh dipanasin."
        },
        orders: {
            icon: ShoppingCart,
            color: "text-green-500",
            label: "Gudang Duit",
            text: "Rekaman pesanan hardware yang udah sah (sahur/deal). Fokus di sini buat urusan packing barang, atur kurir, dan input nomor resi biar juragan bisa lacak."
        },
        list: {
            icon: Database,
            color: "text-purple-400",
            label: "Arsip Intelijen",
            text: "Master database seluruh juragan. Satu nomor WA merekam semua jejak (Simulasi, Order, Chat). Gunakan buat analisa loyalitas dan strategi repeat order."
        }
    };

    const currentBrief = BRIEFING_DATA[activeSubTab];

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

            {/* WAR ROOM NAVIGATION & INTERNAL SEARCH */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-card/30 p-4 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 flex-1 overflow-x-auto custom-scrollbar-hide">
                    <NavTabButton active={activeSubTab === 'shadow'} onClick={() => setActiveSubTab('shadow')} icon={Ghost} label="SHADOW" />
                    <NavTabButton active={activeSubTab === 'simulations'} onClick={() => setActiveSubTab('simulations')} icon={Cpu} label="SIMULASI" />
                    <NavTabButton active={activeSubTab === 'pipeline'} onClick={() => setActiveSubTab('pipeline')} icon={LayoutDashboard} label="PIPELINE" />
                    <NavTabButton active={activeSubTab === 'orders'} onClick={() => setActiveSubTab('orders')} icon={ShoppingCart} label="TRANSAKSI" />
                    <NavTabButton active={activeSubTab === 'list'} onClick={() => setActiveSubTab('list')} icon={Database} label="DATABASE" />
                </div>

                {/* ITEM 2: INTERNAL SEARCH MODUL (Dinamis sesuai Tab) */}
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
            <BriefingHeader {...currentBrief} />

            {state.loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
            ) : (
                <div className="animate-fade-in">
                    {activeSubTab === 'shadow' && (
                        <ShadowModule 
                            leads={abandonedLeads.filter(c => 
                                (c.name || '').toLowerCase().includes(state.searchTerm.toLowerCase()) || 
                                (c.phone || '').includes(state.searchTerm)
                            )} 
                            onRescue={runRecoveryAI} 
                            isRescuingId={isGeneratingScript} 
                        />
                    )}
                    {activeSubTab === 'simulations' && <SimulationsPanel config={config} searchTerm={state.searchTerm} />}
                    {activeSubTab === 'pipeline' && (
                        <PipelineModule 
                            customers={filteredCustomers} 
                            onOpenDetail={setSelectedCustomer} 
                            onStatusUpdate={handleStatusUpdate} 
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
