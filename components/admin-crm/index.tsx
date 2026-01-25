import React, { useState, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { Box, Filter as FilterIcon, MapPin, Zap, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { BriefingRoom } from './sections/briefing-room';
import { TacticalToolbar } from './sections/tactical-toolbar';
import { CustomerDetailModal } from './customer-detail';
import { RadarJuraganCard } from './shared/radar-card';
import { OrdersPanel } from '../admin-orders/orders-panel';

const TEMPERATURE_OPTIONS = [
    { id: 'all', label: 'SEMUA SUHU' },
    { id: 'hot', label: '🔥 HOT' },
    { id: 'warm', label: '🟠 WARM' },
    { id: 'cold', label: '🔵 COLD' }
];

const STATUS_OPTIONS = [
    { id: 'all', label: 'SEMUA STATUS' },
    { id: 'new', label: '🆕 BARU' },
    { id: 'contacted', label: '📞 DISAPA' },
    { id: 'negotiating', label: '📑 NEGO' },
    { id: 'closed', label: '🤝 DEAL' },
    { id: 'lost', label: '❌ BATAL' }
];

const SOURCE_OPTIONS = [
    { id: 'all', label: 'SEMUA ASAL' },
    { id: 'hardware', label: '📦 PRODUK' },
    { id: 'web', label: '🌐 WEBSITE' },
    { id: 'webapp', label: '💻 WEBAPP' },
    { id: 'seo', label: '📈 SEO' }
];

export const AdminCRM = () => {
    const { 
        state, filteredCustomers, totalCount, aiRecommendation, setAiRecommendation, 
        selectedCustomer, setSelectedCustomer, setSearchTerm, 
        setTempFilter, setStatusFilter, setSourceFilter, setPage, refresh 
    } = useCRMLogic();
    
    const [viewMode, setViewMode] = useState<'radar' | 'orders'>('radar');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const handleRefresh = (e: any) => (e.detail?.tab === 'sales' || !e.detail?.tab) && refresh();
        window.addEventListener('mks:refresh-module', handleRefresh);
        return () => window.removeEventListener('mks:refresh-module', handleRefresh);
    }, [refresh]);

    const activeFilterCount = (state.tempFilter !== 'all' ? 1 : 0) + 
                             (state.statusFilter !== 'all' ? 1 : 0) + 
                             (state.sourceFilter !== 'all' ? 1 : 0);

    return (
        <div className="space-y-6 relative animate-fade-in px-1">
            <BriefingRoom insight={aiRecommendation} onClear={() => setAiRecommendation(null)} />
            
            <TacticalToolbar 
                viewMode={viewMode} setViewMode={setViewMode} 
                searchTerm={state.searchTerm} setSearchTerm={setSearchTerm}
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                filterCount={activeFilterCount}
            />

            {/* FILTER UI DRAWER/PANEL (CALIBRATED V3.5 EXTREME COMPACT) */}
            {isFilterOpen && (
                <div className="animate-fade-in px-1 mb-6">
                    <div className="bg-brand-card/40 p-4 rounded-[2rem] border border-white/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.5)] flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-start">
                            {/* Status Filter Group */}
                            <div className="space-y-1.5 flex-1 w-full">
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Zap size={8} className="text-blue-400" /> Filter Progres Prospek
                                </p>
                                <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setStatusFilter(opt.id)}
                                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap active:scale-95 ${
                                                state.statusFilter === opt.id
                                                ? 'bg-white/15 text-white border-white/30 shadow-md'
                                                : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-black/60'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden lg:block h-8 w-px bg-white/5 self-center"></div>

                            {/* Temperature Filter Group */}
                            <div className="space-y-1.5 flex-1 w-full">
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <MapPin size={8} className="text-brand-orange" /> Filter Suhu Radar
                                </p>
                                <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                                    {TEMPERATURE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setTempFilter(opt.id)}
                                            className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap active:scale-95 ${
                                                state.tempFilter === opt.id
                                                ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/40 shadow-neon-text/5'
                                                : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-black/60'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5"></div>

                        {/* Source Origin Filter Group */}
                        <div className="space-y-1.5">
                            <p className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Globe size={8} className="text-green-500" /> Filter Asal Leads (Interest)
                            </p>
                            <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                                {SOURCE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSourceFilter(opt.id)}
                                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap active:scale-95 ${
                                            state.sourceFilter === opt.id
                                            ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-neon-text/5'
                                            : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300 hover:bg-black/60'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-[600px] px-1 pb-20">
                {state.loading ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <LoadingSpinner size={40} />
                        <p className="text-xs font-black text-gray-600 uppercase tracking-[0.4em]">Menarik Data Intel...</p>
                    </div>
                ) : viewMode === 'radar' ? (
                    <div className="space-y-12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCustomers.length === 0 ? (
                                <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 flex flex-col items-center">
                                    <Box size={64} className="mb-6 text-gray-700" />
                                    <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">
                                        Radar Bersih, Bos. <br/> Gak nemu juragan yang pas.
                                    </p>
                                </div>
                            ) : filteredCustomers.map(c => <RadarJuraganCard key={c.phone} customer={c} onClick={() => setSelectedCustomer(c)} />)}
                        </div>

                        {/* PAGINATION UI */}
                        {state.totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 py-8 border-t border-white/5">
                                <button 
                                    onClick={() => setPage(Math.max(1, state.page - 1))}
                                    disabled={state.page === 1}
                                    className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
                                >
                                    <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                                <span className="text-brand-orange font-display font-bold px-4 py-2 bg-brand-orange/10 rounded-lg border border-brand-orange/20 text-xs">
                                    HALAMAN {state.page} / {state.totalPages}
                                </span>
                                <button 
                                    onClick={() => setPage(Math.min(state.totalPages, state.page + 1))}
                                    disabled={state.page === state.totalPages}
                                    className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
                                >
                                    <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <OrdersPanel config={{ whatsapp_number: "628816566935" } as any} searchTerm={state.searchTerm} />
                )}
            </div>

            {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        </div>
    );
};