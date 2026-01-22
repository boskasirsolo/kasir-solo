
import React from 'react';
import { useCRMLogic, parseIntel } from './logic';
import { PIPELINE_STAGES, Customer, LeadStatus } from './types';
import { Search, RefreshCw, LayoutGrid, List, MessageCircle, Phone, MapPin, Building, Clock, Flame, Loader2, Sparkles, User, ArrowRight, FileText, Printer, Radar, X, Target, Info } from 'lucide-react';
import { formatRupiah } from '../../utils';
import { LoadingSpinner, Button } from '../ui';
import { SimpleMarkdown } from '../admin-articles/markdown';
import { CustomerDetailModal } from './customer-detail';

export const AdminCRM = ({ config }: { config: any }) => {
    const { 
        state, setSearchTerm, setActiveView, filteredCustomers, 
        updateStatus, generateAIScript, isGeneratingScript, 
        isScanning, aiRecommendation, scanPipelineAI, setAiRecommendation, refresh,
        deepAnalyzeLead, isAnalyzing, selectedCustomer, setSelectedCustomer,
        generateProposal
    } = useCRMLogic();

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
                    
                    <button 
                        onClick={scanPipelineAI} 
                        disabled={isScanning}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                    >
                        {isScanning ? <Loader2 size={14} className="animate-spin"/> : <Radar size={14}/>}
                        <span className="hidden sm:inline">Scan Peluang</span>
                    </button>
                    
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
                        <List size={14}/> Database
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
                                <div key={stage.id} className="flex flex-col h-[700px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                                    <div className={`p-4 border-b-2 bg-brand-card/50 ${stage.color} flex justify-between items-center`}>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{stage.label}</h4>
                                        <span className="text-[10px] text-gray-500 font-mono">{filteredCustomers.filter(c => c.lead_status === stage.id).length}</span>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                        {filteredCustomers.filter(c => c.lead_status === stage.id).map(customer => (
                                            <LeadCard 
                                                key={customer.phone} 
                                                customer={customer} 
                                                onOpenDetail={() => setSelectedCustomer(customer)}
                                                onStatusUpdate={updateStatus} 
                                                onAIScript={() => generateAIScript(customer)}
                                                onDeepAnalyze={() => deepAnalyzeLead(customer)}
                                                onGenerateProposal={() => generateProposal(customer, config)}
                                                isGenerating={isGeneratingScript === customer.phone}
                                                isAnalyzing={isAnalyzing === customer.phone}
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
                                        <th className="p-4 border-b border-white/5">Juragan</th>
                                        <th className="p-4 border-b border-white/5 text-center">Closing Prob.</th>
                                        <th className="p-4 border-b border-white/5">Status</th>
                                        <th className="p-4 border-b border-white/5">Total Belanja</th>
                                        <th className="p-4 border-b border-white/5 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCustomers.map(customer => (
                                        <tr key={customer.phone} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4" onClick={() => setSelectedCustomer(customer)}>
                                                <div className="flex items-center gap-3 cursor-pointer">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white border ${customer.lead_temperature === 'hot' ? 'bg-red-600/20 border-red-500 text-red-500' : 'bg-blue-600/20 border-blue-500 text-blue-500'}`}>
                                                        {customer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{customer.name}</p>
                                                        <p className="text-[10px] text-gray-500 font-mono">{customer.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-center">
                                                {customer.ai_probability ? (
                                                    <span className={`font-black text-sm ${customer.ai_probability > 70 ? 'text-green-500' : 'text-yellow-500'}`}>{customer.ai_probability}%</span>
                                                ) : <button onClick={() => deepAnalyzeLead(customer)} className="text-[8px] text-gray-600 hover:text-brand-orange uppercase font-black tracking-widest">Analyze</button>}
                                            </td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-bold uppercase text-gray-400">{customer.lead_status}</span>
                                            </td>
                                            <td className="p-4 font-bold text-brand-orange font-mono">
                                                {formatRupiah(customer.total_spent)}
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setSelectedCustomer(customer)} className="p-2 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"><Info size={16}/></button>
                                                    <button onClick={() => generateAIScript(customer)} className="p-2 text-brand-orange hover:bg-brand-orange hover:text-white rounded-lg transition-all"><MessageCircle size={16}/></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedCustomer && <CustomerDetailModal customer={selectedCustomer} onClose={() => setSelectedCustomer(null)} />}
        </div>
    );
};

const LeadCard: React.FC<any> = ({ customer, onOpenDetail, onStatusUpdate, onAIScript, onDeepAnalyze, onGenerateProposal, isGenerating, isAnalyzing }) => {
    const intel = parseIntel(customer.last_notes);
    
    return (
        <div className={`bg-brand-card p-4 rounded-2xl border transition-all hover:border-brand-orange relative group ${customer.lead_temperature === 'hot' ? 'border-red-600/30' : 'border-white/5'}`}>
            {/* Probability Badge */}
            {customer.ai_probability && (
                <div className="absolute -top-2 -right-2 bg-black border border-brand-orange text-brand-orange text-[9px] font-black px-2 py-0.5 rounded-full shadow-neon-text/20">
                    {customer.ai_probability}%
                </div>
            )}

            <div className="flex justify-between items-start mb-3" onClick={onOpenDetail}>
                <div className="min-w-0 flex-1 cursor-pointer">
                    <h5 className="font-bold text-white text-sm group-hover:text-brand-orange transition-colors truncate">{customer.name}</h5>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{customer.phone}</p>
                </div>
                <button onClick={onDeepAnalyze} disabled={isAnalyzing} className="p-1 text-gray-600 hover:text-brand-orange transition-colors">
                    {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <Radar size={12}/>}
                </button>
            </div>

            <div className="space-y-1 mb-4" onClick={onOpenDetail}>
                {intel.paket && (
                    <div className="bg-black/30 p-2 rounded-xl border border-white/5">
                        <p className="text-[10px] text-white font-bold truncate leading-tight">{intel.paket}</p>
                        <p className="text-[9px] text-brand-orange font-bold mt-0.5">{intel.estimasi}</p>
                    </div>
                )}
                {customer.ai_closing_strategy && (
                    <p className="text-[9px] text-gray-500 italic mt-2 line-clamp-2 leading-relaxed">
                        💡 {customer.ai_closing_strategy}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5 gap-2">
                <div className="flex gap-1 flex-1">
                    <button 
                        onClick={onGenerateProposal}
                        className="flex-1 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20 flex items-center justify-center gap-1"
                        title="Draft Proposal PDF"
                    >
                        <FileText size={12}/> <span className="text-[9px] font-bold">PDF</span>
                    </button>
                    <button 
                        onClick={onAIScript}
                        disabled={isGenerating}
                        className="flex-1 py-1.5 bg-brand-orange/10 text-brand-orange rounded-lg hover:bg-brand-orange hover:text-white transition-all shadow-sm border border-brand-orange/20 flex items-center justify-center gap-1"
                        title="Sapa Pake AI SIBOS"
                    >
                        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <><Sparkles size={12}/> <span className="text-[9px] font-bold">SAPA</span></>}
                    </button>
                </div>
                
                <select 
                    value={customer.lead_status}
                    onChange={(e) => onStatusUpdate(customer.phone, e.target.value as LeadStatus)}
                    className="bg-transparent text-[8px] font-black text-gray-600 hover:text-white outline-none cursor-pointer uppercase shrink-0"
                >
                    {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                </select>
            </div>
        </div>
    );
};
