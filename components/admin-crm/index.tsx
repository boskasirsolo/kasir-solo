
import React, { useState, useMemo, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus, LeadTemperature } from './types';
import { LayoutGrid, Kanban, Sparkles, X, Filter, Package, Radar, Target, Box } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';

// Feature Modules
import { CustomerDetailModal } from './customer-detail';
import { PipelineModule } from './pipeline';
import { RadarJuraganCard } from './shared/radar-card';
import { OrdersPanel } from '../admin-orders/orders-panel';

type CRMViewMode = 'radar' | 'board' | 'orders';

export const AdminCRM = () => {
    const { 
        state, filteredCustomers, 
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, 
        selectedCustomer, setSelectedCustomer,
        refresh
    } = useCRMLogic();

    const [viewMode, setViewMode] = useState<CRMViewMode>('radar');
    const [tempFilter, setTempFilter] = useState<LeadTemperature | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

    const finalFiltered = useMemo(() => {
        return filteredCustomers.filter(c => {
            const matchesTemp = tempFilter === 'all' || c.lead_temperature === tempFilter;
            const matchesStatus = statusFilter === 'all' || c.lead_status === statusFilter;
            return matchesTemp && matchesStatus;
        });
    }, [filteredCustomers, tempFilter, statusFilter]);

    const TABS = [
        { id: 'radar', label: 'Radar Juragan', desc: 'Helicopter View', icon: Radar },
        { id: 'board', label: 'Strategy Board', desc: 'Pipeline Progres', icon: Kanban },
        { id: 'orders', label: 'Logistik Order', desc: 'Transaksi Fisik', icon: Package },
    ];

    return (
        <div className="space-y-6 relative">
            {/* STICKY TACTICAL HEADER (MATCHING RADAR ANALYTICS) */}
            <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md py-3 -mx-4 px-4 border-b border-white/5 shadow-xl transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* View Switcher Cards */}
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                        {TABS.map((tab) => {
                            const isActive = viewMode === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setViewMode(tab.id as CRMViewMode)}
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

                    {/* Quick Filters (Right Side) */}
                    <div className="flex items-center gap-3 self-end md:self-auto">
                        {viewMode !== 'orders' && (
                            <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                                {['all', 'hot', 'warm', 'cold'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTempFilter(t as any)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${
                                            tempFilter === t 
                                                ? 'bg-brand-orange text-white shadow-sm' 
                                                : 'text-gray-600 hover:text-white'
                                        }`}
                                    >
                                        {t === 'all' ? 'ALL' : t === 'hot' ? '🔥' : t === 'warm' ? '🟠' : '🔵'}
                                    </button>
                                ))}
                            </div>
                        )}
                        
                        {viewMode === 'orders' ? (
                            <button 
                                onClick={refresh}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-lg text-[10px] font-black text-brand-orange hover:bg-brand-orange hover:text-white transition-all shadow-lg"
                            >
                                <RefreshCw size={14} /> REFRESH DATA
                            </button>
                        ) : (
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as any)}
                                className="bg-black/60 border border-white/10 text-[9px] font-black uppercase rounded-xl px-4 py-2 outline-none focus:border-brand-orange text-white h-10"
                            >
                                <option value="all">SEMUA STATUS</option>
                                <option value="new">🆕 BARU</option>
                                <option value="contacted">📞 DISAPA</option>
                                <option value="negotiating">📑 NEGO</option>
                                <option value="closed">🤝 DEAL</option>
                                <option value="lost">❌ BATAL</option>
                            </select>
                        )}
                    </div>
                </div>
            </div>

            {/* AI STRATEGIC OVERLAY (Floating Style) */}
            {aiRecommendation && (
                <div className="mx-1 bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-3xl relative animate-fade-in shadow-neon-text/5">
                    <button onClick={() => setAiRecommendation(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X size={18}/></button>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="p-2 bg-brand-orange/10 rounded-xl border border-brand-orange/30"><Sparkles className="text-brand-orange" size={20} /></span>
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">Saran Strategi SIBOY</h3>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <SimpleMarkdown content={aiRecommendation} />
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <div className="animate-fade-in min-h-[600px] px-1">
                {state.loading ? (
                    <div className="flex justify-center py-24"><LoadingSpinner size={32} /></div>
                ) : viewMode === 'radar' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {finalFiltered.length === 0 ? (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                <Box size={48} className="mx-auto mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">Radar Bersih, Bos.</p>
                            </div>
                        ) : finalFiltered.map(c => (
                            <RadarJuraganCard 
                                key={c.phone} 
                                customer={c} 
                                onClick={() => setSelectedCustomer(c)} 
                            />
                        ))}
                    </div>
                ) : viewMode === 'board' ? (
                    <PipelineModule 
                        customers={finalFiltered} 
                        onOpenDetail={setSelectedCustomer} 
                        onStatusUpdate={updateStatus}
                        onRescue={runRecoveryAI}
                        isRescuingId={isGeneratingScript}
                    />
                ) : (
                    <OrdersPanel 
                        config={{ 
                            company_legal_name: "PT MESIN KASIR SOLO",
                            address_solo: "Perum Graha Tiara 2 B1, Kartasura",
                            whatsapp_number: "628816566935",
                            email_address: "admin@kasirsolo.my.id"
                        } as any} 
                        searchTerm={state.searchTerm}
                    />
                )}
            </div>

            {selectedCustomer && (
                <CustomerDetailModal 
                    customer={selectedCustomer} 
                    onClose={() => setSelectedCustomer(null)} 
                />
            )}
        </div>
    );
};

import { RefreshCw } from 'lucide-react';
