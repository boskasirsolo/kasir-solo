import React, { useState, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { Box, Filter as FilterIcon, MapPin, Zap, Globe } from 'lucide-react';
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
        state, filteredCustomers, aiRecommendation, setAiRecommendation, 
        selectedCustomer, setSelectedCustomer, setSearchTerm, 
        setTempFilter, setStatusFilter, setSourceFilter, refresh 
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

            {/* FILTER UI DRAWER/PANEL */}
            {isFilterOpen && (
                <div className="animate-fade-in px-1 mb-8">
                    <div className="bg-brand-card/30 p-6 rounded-[2.5rem] border border-white/10 shadow-[inner_0_0_20px_rgba(0,0,0,0.5)] flex flex-col gap-8">
                        <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center">
                            {/* Status Filter Group */}
                            <div className="space-y-3 flex-1 w-full">
                                <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Zap size={14} className="text-blue-400" /> Filter Progres Prospek
                                </p>
                                <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full pb-2">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setStatusFilter(opt.id)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap active:scale-95 ${
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

                            <div className="hidden lg:block h-12 w-px bg-white/5"></div>

                            {/* Temperature Filter Group */}
                            <div className="space-y-3 flex-1 w-full">
                                <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <MapPin size={14} className="text-brand-orange" /> Filter Suhu Radar
                                </p>
                                <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full pb-2">
                                    {TEMPERATURE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setTempFilter(opt.id)}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap active:scale-95 ${
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
                        <div className="space-y-3">
                            <p className="text-xs text-gray-500 font-black uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Globe size={14} className="text-green-500" /> Filter Asal Leads (Interest)
                            </p>
                            <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide max-w-full pb-2">
                                {SOURCE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSourceFilter(opt.id)}
                                        className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border whitespace-nowrap active:scale-95 ${
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredCustomers.length === 0 ? (
                            <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 flex flex-col items-center">
                                <Box size={64} className="mb-6 text-gray-700" />
                                <p className="text-sm font-black uppercase tracking-[0.3em] text-gray-500">
                                    Radar Bersih, Bos. <br/> Gak nemu juragan yang pas.
                                </p>
                            </div>
                        ) : filteredCustomers.map(c => <RadarJuraganCard key={c.phone} customer={c} onClick={() => setSelectedCustomer(c)} />)}
                    </div>
                ) : (
                    <OrdersPanel config={{ whatsapp_number: "628816566935" } as any} searchTerm={state.searchTerm} />
                )}
            </div>

            {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        </div>
    );
};