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
        <div className="space-y-6 relative animate-fade-in">
            <BriefingRoom insight={aiRecommendation} onClear={() => setAiRecommendation(null)} />
            
            <TacticalToolbar 
                viewMode={viewMode} setViewMode={setViewMode} 
                searchTerm={state.searchTerm} setSearchTerm={setSearchTerm}
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                filterCount={activeFilterCount}
            />

            {/* FILTER UI DRAWER/PANEL */}
            {isFilterOpen && (
                <div className="animate-fade-in px-1 mb-6">
                    <div className="bg-brand-card/20 p-5 rounded-3xl border border-white/10 shadow-inner flex flex-col gap-6">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Status Filter Group */}
                            <div className="space-y-2 flex-1">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <Zap size={10} className="text-blue-400" /> Filter Progres Prospek
                                </p>
                                <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                                    {STATUS_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setStatusFilter(opt.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                                                state.statusFilter === opt.id
                                                ? 'bg-white/10 text-white border-white/20 shadow-sm'
                                                : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden md:block h-10 w-px bg-white/5"></div>

                            {/* Temperature Filter Group */}
                            <div className="space-y-2 flex-1">
                                <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                    <MapPin size={10} className="text-brand-orange" /> Filter Suhu Radar
                                </p>
                                <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                                    {TEMPERATURE_OPTIONS.map(opt => (
                                        <button
                                            key={opt.id}
                                            onClick={() => setTempFilter(opt.id)}
                                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                                                state.tempFilter === opt.id
                                                ? 'bg-brand-orange/20 text-brand-orange border-brand-orange/40 shadow-neon-text/5'
                                                : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300'
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="h-px w-full bg-white/5"></div>

                        {/* Source Origin Filter Group (NEW/RESTORED) */}
                        <div className="space-y-2">
                            <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Globe size={10} className="text-green-500" /> Filter Asal Leads (Interest)
                            </p>
                            <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full pb-1">
                                {SOURCE_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setSourceFilter(opt.id)}
                                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                                            state.sourceFilter === opt.id
                                            ? 'bg-green-500/20 text-green-400 border-green-500/40 shadow-neon-text/5'
                                            : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300'
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

            <div className="min-h-[600px] px-1">
                {state.loading ? (
                    <div className="flex justify-center py-24"><LoadingSpinner size={32} /></div>
                ) : viewMode === 'radar' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredCustomers.length === 0 ? (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                <Box size={48} className="mx-auto mb-4" />
                                <p className="text-xs font-bold uppercase tracking-widest">
                                    Radar Bersih, Bos. Tidak ada juragan yang cocok.
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