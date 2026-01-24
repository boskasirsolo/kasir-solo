
import React from 'react';
import { PIPELINE_STAGES, Customer, LeadStatus } from '../types';
import { Zap, Activity, Ghost, Box, MessageSquare, Sparkles, Loader2 } from 'lucide-react';
import { parseIntel } from '../shared/utils';

const LeadCard: React.FC<{ 
    customer: Customer, 
    onOpenDetail: () => void, 
    onStatusUpdate: (phone: string, status: LeadStatus) => void,
    onRescue: (c: Customer) => void,
    isRescuing: boolean
}> = ({ customer, onOpenDetail, onStatusUpdate, onRescue, isRescuing }) => {
    const intel = parseIntel(customer.last_notes);
    const radar = customer.intelligence;

    // Badge Logic based on source_origin
    const renderSourceBadge = () => {
        if (customer.source_origin === 'shadow') {
            return (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[8px] font-black uppercase">
                    <Ghost size={8} /> SHADOW
                </div>
            );
        }
        if (customer.source_origin === 'simulasi') {
            return (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[8px] font-black uppercase">
                    <Box size={8} /> SIMULASI
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-brand-card p-4 rounded-2xl border border-white/5 transition-all hover:border-brand-orange/50 cursor-pointer relative overflow-hidden group shadow-lg" onClick={onOpenDetail}>
            {/* CARD HEADER */}
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-wrap gap-1">
                    {renderSourceBadge()}
                    {customer.detected_category && (
                        <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[8px] text-gray-500 font-bold uppercase tracking-tighter">{customer.detected_category}</span>
                    )}
                </div>
                {customer.is_indecisive_buyer && (
                    <div className="bg-red-500/20 text-red-500 p-1 rounded border border-red-500/30 animate-pulse shadow-neon-text/20">
                        <Zap size={10} />
                    </div>
                )}
            </div>

            {/* CUSTOMER IDENTITY */}
            <h5 className="font-bold text-white text-sm truncate mb-0.5 pr-4 group-hover:text-brand-orange transition-colors">{customer.name}</h5>
            <p className="text-[9px] text-gray-600 font-mono mb-3">{customer.phone}</p>
            
            {/* RADAR PATH INTEL */}
            {radar && radar.most_visited_path && (
                <div className="mb-3 px-2 py-1.5 bg-black/40 border border-white/5 rounded-xl">
                    <p className="text-[7px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1 flex items-center gap-1">
                        <Activity size={8} className="text-blue-400"/> Monitoring Path
                    </p>
                    <p className="text-[9px] text-gray-400 line-clamp-1 italic font-medium">
                        {radar.most_visited_path.split('/').pop() || 'Home'}
                    </p>
                </div>
            )}

            {/* PACKAGE INTEL */}
            {intel.paket && (
                <div className="bg-white/5 p-2 rounded-xl border border-white/5 mb-4 text-[10px] text-gray-400 italic line-clamp-2 leading-relaxed">
                    "{intel.paket}"
                </div>
            )}

            {/* ACTION AREA: SAPA AI & STATUS */}
            <div className="space-y-3">
                <button 
                    onClick={(e) => { e.stopPropagation(); onRescue(customer); }}
                    disabled={isRescuing}
                    className={`w-full py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-neon transition-all border ${
                        customer.is_indecisive_buyer 
                        ? 'bg-blue-600/10 border-blue-500/40 text-blue-400 hover:bg-blue-600 hover:text-white' 
                        : 'bg-brand-orange/10 border-brand-orange/40 text-brand-orange hover:bg-brand-orange hover:text-white'
                    }`}
                >
                    {isRescuing ? (
                        <Loader2 size={12} className="animate-spin" />
                    ) : (
                        <><Sparkles size={12}/> SAPA SIBOS AI</>
                    )}
                </button>

                <div className="flex justify-between items-center pt-3 border-t border-white/5">
                    <select 
                        value={customer.lead_status} 
                        onClick={e => e.stopPropagation()} 
                        onChange={(e) => onStatusUpdate(customer.phone, e.target.value as LeadStatus)} 
                        className="bg-transparent text-[8px] font-black text-gray-600 uppercase outline-none cursor-pointer hover:text-brand-orange transition-colors"
                    >
                        {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label.split(' ')[1]}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                         <span className="text-[8px] font-bold text-gray-700 uppercase tracking-tighter">{customer.lead_temperature}</span>
                         <span className={`w-2 h-2 rounded-full ${customer.lead_temperature === 'hot' || customer.is_indecisive_buyer ? 'bg-red-500 animate-ping shadow-[0_0_8px_#ef4444]' : 'bg-blue-500'}`}></span>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface PipelineModuleProps {
    customers: Customer[];
    onOpenDetail: (c: Customer) => void;
    onStatusUpdate: (phone: string, status: LeadStatus) => void;
    onRescue: (c: Customer) => void;
    isRescuingId: string | null;
}

export const PipelineModule = ({ customers, onOpenDetail, onStatusUpdate, onRescue, isRescuingId }: PipelineModuleProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {PIPELINE_STAGES.map(stage => {
                const stageCustomers = customers.filter(c => c.lead_status === stage.id);
                return (
                    <div key={stage.id} className="flex flex-col h-[750px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                        <div className={`p-4 border-b-2 bg-brand-card/50 ${stage.color} flex justify-between items-center`}>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{stage.label}</h4>
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">{stageCustomers.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {stageCustomers.map(customer => (
                                <LeadCard 
                                    key={customer.phone} 
                                    customer={customer} 
                                    onOpenDetail={() => onOpenDetail(customer)} 
                                    onStatusUpdate={onStatusUpdate}
                                    onRescue={onRescue}
                                    isRescuing={isRescuingId === customer.phone}
                                />
                            ))}
                            {stageCustomers.length === 0 && (
                                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                                    <Box size={32} className="text-gray-500 mb-2" />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Kosong, Bos</p>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
