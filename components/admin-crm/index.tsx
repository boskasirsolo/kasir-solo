
import React, { useState } from 'react';
import { useCRMLogic, parseIntel } from './logic';
import { PIPELINE_STAGES, Customer, LeadStatus } from './types';
import { Search, RefreshCw, LayoutGrid, List, MessageCircle, Zap, Sparkles, X, LayoutDashboard, ShoppingCart } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';
import { CustomerDetailModal } from './customer-detail';
import { RecoveryPanel } from './recovery-panel';
import { OrdersPanel } from '../admin-orders/orders-panel';
import { LeadsPanel } from '../admin-orders/leads-panel';
import { SimulationsPanel } from '../admin-orders/simulations-panel';

export const AdminCRM = ({ config }: { config: any }) => {
    const { 
        state, setSearchTerm, setActiveView, filteredCustomers, abandonedLeads,
        updateStatus, runRecoveryAI, isGeneratingScript, 
        aiRecommendation, setAiRecommendation, refresh,
        selectedCustomer, setSelectedCustomer
    } = useCRMLogic();

    const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'orders' | 'simulations' | 'shadow' | 'list'>('pipeline');

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
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
                            {PIPELINE_STAGES.map(stage => (
                                <div key={stage.id} className="flex flex-col h-[700px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                                    <div className={`p-4 border-b-2 bg-brand-card/50 ${stage.color} flex justify-between items-center`}>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{stage.label}</h4>
                                        <span className="text-[10px] text-gray-500 font-mono">{filteredCustomers.filter(c => c.lead_status === stage.id).length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        {filteredCustomers.filter(c => c.lead_status === stage.id).map(customer => (
                                            <LeadCard key={customer.phone} customer={customer} onOpenDetail={() => setSelectedCustomer(customer)} onStatusUpdate={updateStatus} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {activeSubTab === 'orders' && <OrdersPanel config={config} />}
                    {activeSubTab === 'simulations' && <SimulationsPanel config={config} />}
                    {activeSubTab === 'shadow' && <RecoveryPanel leads={abandonedLeads} onRescue={runRecoveryAI} isRescuingId={isGeneratingScript} />}
                    
                    {activeSubTab === 'list' && (
                        <div className="bg-brand-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-black/40 text-gray-500 font-bold uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4 border-b border-white/5">Juragan</th>
                                        <th className="p-4 border-b border-white/5">Status</th>
                                        <th className="p-4 border-b border-white/5">Total Belanja</th>
                                        <th className="p-4 border-b border-white/5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCustomers.map(customer => (
                                        <tr key={customer.phone} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => setSelectedCustomer(customer)}>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{customer.name}</div>
                                                <div className="text-[10px] text-gray-500">{customer.phone}</div>
                                            </td>
                                            <td className="p-4"><span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-bold uppercase text-gray-400">{customer.lead_status}</span></td>
                                            <td className="p-4 font-bold text-brand-orange">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(customer.total_spent)}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={(e) => { e.stopPropagation(); runRecoveryAI(customer); }} className="p-2 text-brand-orange hover:bg-brand-orange hover:text-white rounded-lg transition-all"><MessageCircle size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        </div>
    );
};

const LeadCard = ({ customer, onOpenDetail, onStatusUpdate }: any) => {
    const intel = parseIntel(customer.last_notes);
    return (
        <div className="bg-brand-card p-4 rounded-2xl border border-white/5 transition-all hover:border-brand-orange cursor-pointer" onClick={onOpenDetail}>
            <h5 className="font-bold text-white text-sm truncate mb-1">{customer.name}</h5>
            <p className="text-[10px] text-gray-500 font-mono mb-3">{customer.phone}</p>
            {intel.paket && (
                <div className="bg-black/30 p-2 rounded-xl border border-white/5 mb-3 text-[10px] text-gray-400">
                    {intel.paket}
                </div>
            )}
            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                 <select value={customer.lead_status} onClick={e => e.stopPropagation()} onChange={(e) => onStatusUpdate(customer.phone, e.target.value)} className="bg-transparent text-[8px] font-black text-gray-600 uppercase outline-none">
                    {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                 </select>
                 <span className={`w-2 h-2 rounded-full ${customer.lead_temperature === 'hot' ? 'bg-red-500 animate-ping' : 'bg-blue-500'}`}></span>
            </div>
        </div>
    );
};
