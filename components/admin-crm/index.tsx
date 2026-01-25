
import React, { useState, useMemo } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus, LeadTemperature } from './types';
import { LayoutGrid, Kanban, Sparkles, X, Filter } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';

// Feature Modules
import { CustomerDetailModal } from './customer-detail';
import { PipelineModule } from './pipeline';
import { RadarJuraganCard } from './shared/radar-card';

export const AdminCRM = () => {
    const { 
        state, filteredCustomers, 
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, 
        selectedCustomer, setSelectedCustomer
    } = useCRMLogic();

    const [viewMode, setViewMode] = useState<'radar' | 'board'>('radar');
    const [tempFilter, setTempFilter] = useState<LeadTemperature | 'all'>('all');
    const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');

    const finalFiltered = useMemo(() => {
        return filteredCustomers.filter(c => {
            const matchesTemp = tempFilter === 'all' || c.lead_temperature === tempFilter;
            const matchesStatus = statusFilter === 'all' || c.lead_status === statusFilter;
            return matchesTemp && matchesStatus;
        });
    }, [filteredCustomers, tempFilter, statusFilter]);

    return (
        <div className="space-y-6">
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

            {/* QUICK-SWITCH TACTICAL HEADER */}
            <div className="bg-brand-card/30 border border-white/5 p-4 rounded-3xl flex flex-col lg:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto custom-scrollbar-hide pb-2 lg:pb-0">
                    {/* View Switcher */}
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5 shrink-0">
                        <button onClick={() => setViewMode('radar')} className={`p-2 rounded-lg transition-all ${viewMode === 'radar' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-600'}`} title="Radar View (Grid)"><LayoutGrid size={18}/></button>
                        <button onClick={() => setViewMode('board')} className={`p-2 rounded-lg transition-all ${viewMode === 'board' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-600'}`} title="Strategy Board (Kanban)"><Kanban size={18}/></button>
                    </div>
                    
                    <div className="h-6 w-px bg-white/10 hidden md:block"></div>

                    {/* Quick Temp Filters */}
                    <div className="flex gap-1 shrink-0">
                        {['all', 'hot', 'warm', 'cold'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTempFilter(t as any)}
                                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all border ${tempFilter === t ? 'bg-white/10 text-white border-white/20' : 'text-gray-600 border-transparent hover:text-gray-400'}`}
                            >
                                {t === 'all' ? 'SEMUA SUHU' : t === 'hot' ? '🔥 HOT' : t === 'warm' ? '🟠 WARM' : '🔵 COLD'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <Filter size={14} className="text-gray-600 hidden md:block" />
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-black/40 border border-white/10 text-[9px] font-black uppercase rounded-xl px-4 py-2 outline-none focus:border-brand-orange text-white w-full lg:w-48"
                    >
                        <option value="all">SEMUA STATUS</option>
                        <option value="new">🆕 BARU</option>
                        <option value="contacted">📞 DISAPA</option>
                        <option value="negotiating">📑 NEGO</option>
                        <option value="closed">🤝 DEAL</option>
                        <option value="lost">❌ BATAL</option>
                    </select>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="animate-fade-in min-h-[600px]">
                {state.loading ? (
                    <div className="flex justify-center py-24"><LoadingSpinner size={32} /></div>
                ) : finalFiltered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-black/20 rounded-[2.5rem] border-2 border-dashed border-white/5">
                        <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">Radar Bersih, Bos.</p>
                    </div>
                ) : viewMode === 'radar' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {finalFiltered.map(c => (
                            <RadarJuraganCard 
                                key={c.phone} 
                                customer={c} 
                                onClick={() => setSelectedCustomer(c)} 
                            />
                        ))}
                    </div>
                ) : (
                    <PipelineModule 
                        customers={finalFiltered} 
                        onOpenDetail={setSelectedCustomer} 
                        onStatusUpdate={updateStatus}
                        onRescue={runRecoveryAI}
                        isRescuingId={isGeneratingScript}
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
