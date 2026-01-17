
import React from 'react';
import { useCRMLogic } from './logic';
// Fix: Added LeadStatus to the import list to resolve "Cannot find name 'LeadStatus'" errors.
import { PIPELINE_STAGES, Customer, LeadStatus } from './types';
import { Search, RefreshCw, LayoutGrid, List, MessageCircle, Phone, MapPin, Building, Clock, Flame, Loader2, Sparkles, User, ArrowRight } from 'lucide-react';
import { formatRupiah } from '../../utils';
import { LoadingSpinner } from '../ui';

export const AdminCRM = ({ config }: { config: any }) => {
    const { state, setSearchTerm, setActiveView, filteredCustomers, updateStatus, generateAIScript, isGeneratingScript, refresh } = useCRMLogic();

    return (
        <div className="space-y-6">
            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-brand-card/30 p-4 rounded-2xl border border-white/5 shadow-lg">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                        <input 
                            value={state.searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari Juragan / No WA..."
                            className="w-full bg-brand-dark border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white outline-none focus:border-brand-orange transition-all"
                        />
                    </div>
                    <button onClick={refresh} className="p-2 text-gray-500 hover:text-white transition-colors bg-white/5 rounded-lg"><RefreshCw size={18}/></button>
                </div>

                <div className="flex bg-black/40 p-1 rounded-xl border border-white/10 w-full md:w-auto">
                    <button 
                        onClick={() => setActiveView('pipeline')}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${state.activeView === 'pipeline' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}
                    >
                        <LayoutGrid size={14}/> Pipeline
                    </button>
                    <button 
                        onClick={() => setActiveView('list')}
                        className={`flex-1 md:flex-none flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${state.activeView === 'list' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500'}`}
                    >
                        <List size={14}/> Identitas
                    </button>
                </div>
            </div>

            {state.loading ? (
                <div className="flex justify-center py-20"><LoadingSpinner size={32} /></div>
            ) : (
                <div className="animate-fade-in">
                    {state.activeView === 'pipeline' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
                            {PIPELINE_STAGES.map(stage => (
                                <div key={stage.id} className="flex flex-col h-[700px] bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                                    <div className={`p-4 border-b-2 bg-brand-card/50 ${stage.color} flex justify-between items-center`}>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{stage.label}</h4>
                                        <span className="text-[10px] text-gray-500 font-mono">{filteredCustomers.filter(c => c.lead_status === stage.id).length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        {filteredCustomers.filter(c => c.lead_status === stage.id).map(customer => (
                                            <LeadCard 
                                                key={customer.id} 
                                                customer={customer} 
                                                onStatusUpdate={updateStatus} 
                                                onAIScript={() => generateAIScript(customer)}
                                                isGenerating={isGeneratingScript === customer.id}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-brand-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-black/40 text-gray-500 font-bold uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4 border-b border-white/5">Customer</th>
                                        <th className="p-4 border-b border-white/5">Suhu</th>
                                        <th className="p-4 border-b border-white/5">Status</th>
                                        <th className="p-4 border-b border-white/5">Last Touch</th>
                                        <th className="p-4 border-b border-white/5">Total Spent</th>
                                        <th className="p-4 border-b border-white/5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCustomers.map(customer => (
                                        <tr key={customer.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white border ${customer.lead_temperature === 'hot' ? 'bg-red-600/20 border-red-500 text-red-500' : customer.lead_temperature === 'warm' ? 'bg-orange-600/20 border-orange-500 text-orange-500' : 'bg-blue-600/20 border-blue-500 text-blue-500'}`}>
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{customer.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-mono">{customer.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <TempBadge temp={customer.lead_temperature} />
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-bold uppercase text-gray-400">
                                                    {customer.lead_status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-500">
                                                {new Date(customer.last_interaction).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="p-4 font-bold text-brand-orange font-mono">
                                                {formatRupiah(customer.total_spent)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <button 
                                                    onClick={() => generateAIScript(customer)}
                                                    className="p-2 text-brand-orange hover:bg-brand-orange hover:text-white rounded-lg transition-all"
                                                >
                                                    <MessageCircle size={16}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Fix: Updated prop types to use 'any' return for functions and utilize imported LeadStatus. 
// This resolves the type mismatch on line 60 and "Cannot find name 'LeadStatus'" errors.
const LeadCard = ({ customer, onStatusUpdate, onAIScript, isGenerating }: { customer: Customer, onStatusUpdate: (id: string, s: LeadStatus) => any, onAIScript: () => any, isGenerating: boolean }) => {
    return (
        <div className={`bg-brand-card p-4 rounded-xl border-l-4 transition-all hover:border-brand-orange hover:shadow-neon-text/5 group ${customer.lead_temperature === 'hot' ? 'border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.1)]' : customer.lead_temperature === 'warm' ? 'border-orange-500' : 'border-blue-500'}`}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h5 className="font-bold text-white text-sm group-hover:text-brand-orange transition-colors">{customer.name}</h5>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1 font-mono"><Phone size={8}/> {customer.phone}</p>
                </div>
                <TempBadge temp={customer.lead_temperature} />
            </div>

            <div className="space-y-2 mb-4">
                {customer.company_name && <p className="text-[10px] text-gray-400 flex items-center gap-1"><Building size={10}/> {customer.company_name}</p>}
                {customer.location && <p className="text-[10px] text-gray-500 flex items-center gap-1"><MapPin size={10}/> {customer.location}</p>}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex gap-1">
                    <button 
                        onClick={onAIScript}
                        disabled={isGenerating}
                        className="p-1.5 bg-brand-orange/10 text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all shadow-sm flex items-center gap-1"
                        title="Sapa Pake AI SIBOS"
                    >
                        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <><Sparkles size={12}/> <span className="text-[9px] font-bold">SAPA AI</span></>}
                    </button>
                </div>
                
                <select 
                    value={customer.lead_status}
                    onChange={(e) => onStatusUpdate(customer.id, e.target.value as LeadStatus)}
                    className="bg-transparent text-[9px] font-bold text-gray-500 hover:text-white outline-none cursor-pointer uppercase"
                >
                    {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                </select>
            </div>
        </div>
    );
};

const TempBadge = ({ temp }: { temp: string }) => {
    let color = "bg-blue-500 text-blue-500";
    if (temp === 'hot') color = "bg-red-500 text-red-500";
    if (temp === 'warm') color = "bg-orange-500 text-orange-500";

    return (
        <div className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase border ${color.replace('bg-', 'border-')} ${color.replace('bg-', 'bg-opacity-10 text-')}`}>
            {temp}
        </div>
    );
};
