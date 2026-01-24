
import React, { useState } from 'react';
import { useCRMLogic } from './logic';
import { LeadStatus } from './types';
import { Search, RefreshCw, ShoppingCart, Zap, List, X, LayoutDashboard, Sparkles } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';
import { CustomerDetailModal } from './customer-detail';
import { RecoveryPanel } from './recovery-panel';
import { PipelinePanel } from './pipeline-panel';
import { CustomerTable } from './customer-table';
import { OrdersPanel } from '../admin-orders/orders-panel';
import { LeadsPanel } from '../admin-orders/leads-panel';
import { SimulationsPanel } from '../admin-orders/simulations-panel';

export const AdminCRM = ({ config }: { config: any }) => {
    const { 
        state, setSearchTerm, filteredCustomers, abandonedLeads,
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, refresh,
        selectedCustomer, setSelectedCustomer
    } = useCRMLogic();

    const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'orders' | 'simulations' | 'shadow' | 'list'>('pipeline');

    const handleStatusUpdate = (phone: string, status: LeadStatus) => {
        updateStatus(phone, status);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* AI RECOMMENDATION BOX */}
            {aiRecommendation && (
                <div className="bg-brand-orange/10 border border-brand-orange/30 p-6 rounded-3xl relative animate-fade-in shadow-neon-text/5">
                    <button onClick={() => setAiRecommendation(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X size={18}/></button>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-brand-orange" size={24} />
                        <h3 className="text-white font-black text-sm uppercase tracking-widest">Radar Strategic MKS (AI)</h3>
                    </div>
                    <div className="prose prose-invert prose-sm max-w-none">
                        <SimpleMarkdown content={aiRecommendation} />
                    </div>
                </div>
            )}

            {/* SALES MODULE SUB-TABS */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-card/30 p-4 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full overflow-x-auto custom-scrollbar-hide">
                    <button onClick={() => setActiveSubTab('pipeline')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'pipeline' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}><LayoutDashboard size={14}/> PIPELINE</button>
                    <button onClick={() => setActiveSubTab('orders')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'orders' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}><ShoppingCart size={14}/> TRANSAKSI</button>
                    <button onClick={() => setActiveSubTab('simulations')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'simulations' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}><Zap size={14}/> SIMULASI</button>
                    <button onClick={() => setActiveSubTab('shadow')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'shadow' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}><Zap size={14}/> SHADOW</button>
                    <button onClick={() => setActiveSubTab('list')} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'list' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}><List size={14}/> DATABASE</button>
                </div>
                
                <div className="flex items-center gap-3 shrink-0">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-600" />
                        <input value={state.searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Cari..." className="bg-brand-dark border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-brand-orange w-40"/>
                    </div>
                    <button onClick={refresh} className="p-2 bg-white/5 rounded-lg border border-white/5 text-gray-500 hover:text-white"><RefreshCw size={16}/></button>
                </div>
            </div>

            {state.loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
            ) : (
                <div className="animate-fade-in">
                    {activeSubTab === 'pipeline' && (
                        <PipelinePanel 
                            customers={filteredCustomers} 
                            onOpenDetail={setSelectedCustomer} 
                            onStatusUpdate={handleStatusUpdate} 
                        />
                    )}
                    
                    {activeSubTab === 'orders' && <OrdersPanel config={config} />}
                    {activeSubTab === 'simulations' && <SimulationsPanel config={config} />}
                    {activeSubTab === 'shadow' && <RecoveryPanel leads={abandonedLeads} onRescue={runRecoveryAI} isRescuingId={isGeneratingScript} />}
                    
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
