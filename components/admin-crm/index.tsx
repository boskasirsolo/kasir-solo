
import React, { useState } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus } from './types';
// Add missing ShoppingBag to imports
import { Search, RefreshCw, ShoppingCart, ShoppingBag, Zap, List, X, LayoutDashboard, Sparkles, Ghost, Database, Cpu, Info, Target, Box, History } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';
import { CustomerDetailModal } from './customer-detail';
import { RecoveryPanel } from './recovery-panel';
import { PipelinePanel } from './pipeline-panel';
import { CustomerTable } from './customer-table';
import { OrdersPanel } from '../admin-orders/orders-panel';
import { SimulationsPanel } from '../admin-orders/simulations-panel';

export const AdminCRM = ({ config }: { config: any }) => {
    const { 
        state, setSearchTerm, filteredCustomers, abandonedLeads,
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, refresh,
        selectedCustomer, setSelectedCustomer
    } = useCRMLogic();

    const [activeSubTab, setActiveSubTab] = useState<'shadow' | 'simulations' | 'pipeline' | 'orders' | 'list'>('shadow');

    const handleStatusUpdate = (phone: string, status: LeadStatus) => {
        updateStatus(phone, status);
    };

    // --- BRIEFING CONTENT DATA ---
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
            // FIX: Reference for ShoppingBag icon now valid after adding to imports
            icon: ShoppingBag,
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
                    <button onClick={() => setAiRecommendation(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={18}/></button>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-brand-orange" size={24} />
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">Radar Strategic SIBOS</h3>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <SimpleMarkdown content={aiRecommendation} />
                    </div>
                </div>
            )}

            {/* WAR ROOM NAVIGATION - ALUR SISTEM */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-card/30 p-4 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full overflow-x-auto custom-scrollbar-hide">
                    <button onClick={() => setActiveSubTab('shadow')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'shadow' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}>
                        <Ghost size={14}/> SHADOW
                    </button>
                    <button onClick={() => setActiveSubTab('simulations')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'simulations' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}>
                        <Cpu size={14}/> SIMULASI
                    </button>
                    <button onClick={() => setActiveSubTab('pipeline')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'pipeline' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}>
                        <LayoutDashboard size={14}/> PIPELINE
                    </button>
                    <button onClick={() => setActiveSubTab('orders')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'orders' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}>
                        <ShoppingCart size={14}/> TRANSAKSI
                    </button>
                    <button onClick={() => setActiveSubTab('list')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'list' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}>
                        <Database size={14}/> DATABASE
                    </button>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-600" />
                        <input value={state.searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari Juragan..." className="bg-brand-dark border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-brand-orange w-40"/>
                    </div>
                    <button onClick={refresh} className="p-2 bg-white/5 rounded-lg border border-white/5 text-gray-500 hover:text-white"><RefreshCw size={16}/></button>
                </div>
            </div>

            {/* --- COMMAND BRIEFING AREA (KOTAK BIRU JURAGAN) --- */}
            <div className="px-1 animate-fade-in">
                <div className="bg-brand-orange/5 border border-brand-orange/10 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 shadow-inner">
                    <div className={`p-3 rounded-xl bg-black/40 border border-white/5 ${currentBrief.color} shrink-0 shadow-lg`}>
                        <currentBrief.icon size={24} />
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{currentBrief.label}</span>
                            <div className={`w-1 h-1 rounded-full ${currentBrief.color.replace('text-', 'bg-')} animate-pulse`}></div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            {currentBrief.text}
                        </p>
                    </div>
                    <div className="hidden lg:flex items-center gap-3 pl-6 border-l border-white/5">
                        <div className="text-right">
                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">System Status</p>
                            <p className="text-[10px] text-green-500 font-bold uppercase">Ready to Sync</p>
                        </div>
                        <Zap size={14} className="text-brand-orange" />
                    </div>
                </div>
            </div>

            {state.loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
            ) : (
                <div className="animate-fade-in">
                    {activeSubTab === 'shadow' && <RecoveryPanel leads={abandonedLeads} onRescue={runRecoveryAI} isRescuingId={isGeneratingScript} />}
                    {activeSubTab === 'simulations' && <SimulationsPanel config={config} />}
                    {activeSubTab === 'pipeline' && (
                        <PipelinePanel 
                            customers={filteredCustomers} 
                            onOpenDetail={setSelectedCustomer} 
                            onStatusUpdate={handleStatusUpdate} 
                        />
                    )}
                    {activeSubTab === 'orders' && <OrdersPanel config={config} />}
                    {activeSubTab === 'list' && (
                        <CustomerTable 
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
