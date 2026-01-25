
import React, { useState, useMemo, useEffect } from 'react';
import { useCRMLogic } from './logic';
import { Box } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { BriefingRoom } from './sections/briefing-room';
import { TacticalToolbar } from './sections/tactical-toolbar';
import { CustomerDetailModal } from './customer-detail';
import { RadarJuraganCard } from './shared/radar-card';
import { OrdersPanel } from '../admin-orders/orders-panel';

export const AdminCRM = () => {
    const { state, filteredCustomers, aiRecommendation, setAiRecommendation, selectedCustomer, setSelectedCustomer, setSearchTerm, refresh } = useCRMLogic();
    const [viewMode, setViewMode] = useState<'radar' | 'orders'>('radar');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    useEffect(() => {
        const handleRefresh = (e: any) => (e.detail?.tab === 'sales' || !e.detail?.tab) && refresh();
        window.addEventListener('mks:refresh-module', handleRefresh);
        return () => window.removeEventListener('mks:refresh-module', handleRefresh);
    }, [refresh]);

    return (
        <div className="space-y-6 relative animate-fade-in">
            <BriefingRoom insight={aiRecommendation} onClear={() => setAiRecommendation(null)} />
            
            <TacticalToolbar 
                viewMode={viewMode} setViewMode={setViewMode} 
                searchTerm={state.searchTerm} setSearchTerm={setSearchTerm}
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
                filterCount={0}
            />

            <div className="min-h-[600px] px-1">
                {state.loading ? (
                    <div className="flex justify-center py-24"><LoadingSpinner size={32} /></div>
                ) : viewMode === 'radar' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredCustomers.length === 0 ? (
                            <div className="col-span-full py-24 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                <Box size={48} className="mx-auto mb-4" /><p className="text-xs font-bold uppercase tracking-widest">Radar Bersih, Bos.</p>
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
