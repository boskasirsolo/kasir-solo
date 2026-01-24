import React from 'react';
import { PIPELINE_STAGES, Customer, LeadStatus } from './types';
import { Eye, Zap, Activity } from 'lucide-react';
import { parseIntel } from './logic';

interface PipelinePanelProps {
    customers: Customer[];
    onOpenDetail: (c: Customer) => void;
    onStatusUpdate: (phone: string, status: LeadStatus) => void;
}

export const PipelinePanel = ({ customers, onOpenDetail, onStatusUpdate }: PipelinePanelProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {PIPELINE_STAGES.map(stage => {
                const stageCustomers = customers.filter(c => c.lead_status === stage.id);
                return (
                    <div key={stage.id} className="flex flex-col h-[700px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                        <div className={`p-4 border-b-2 bg-brand-card/50 ${stage.color} flex justify-between items-center`}>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{stage.label}</h4>
                            <span className="text-[10px] text-gray-500 font-mono">{stageCustomers.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {stageCustomers.map(customer => (
                                <LeadCard 
                                    key={customer.phone} 
                                    customer={customer} 
                                    onOpenDetail={() => onOpenDetail(customer)} 
                                    onStatusUpdate={onStatusUpdate} 
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// --- ATOM: Lead Card ---
// Added React.FC type to handle standard props like 'key' in map functions
const LeadCard: React.FC<{ 
    customer: Customer, 
    onOpenDetail: () => void, 
    onStatusUpdate: (phone: string, status: LeadStatus) => void 
}> = ({ customer, onOpenDetail, onStatusUpdate }) => {
    const intel = parseIntel(customer.last_notes);
    const radar = customer.intelligence;

    return (
        <div className="bg-brand-card p-4 rounded-2xl border border-white/5 transition-all hover:border-brand-orange cursor-pointer relative overflow-hidden group" onClick={onOpenDetail}>
            {/* RADAR OVERLAY */}
            {radar && (
                <div className="absolute top-2 right-2 flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                    {customer.is_indecisive_buyer && (
                        <div className="bg-red-500/20 text-red-500 p-1 rounded border border-red-500/30 animate-pulse" title="LAGI GALAU (Diem di checkout > 3 menit)">
                            <Zap size={10} />
                        </div>
                    )}
                </div>
            )}

            <h5 className="font-bold text-white text-sm truncate mb-1 pr-12">{customer.name}</h5>
            <p className="text-[10px] text-gray-500 font-mono mb-3">{customer.phone}</p>
            
            {/* RADAR DESCRIPTION */}
            {radar && radar.most_visited_path && (
                <div className="mb-3 px-2 py-1 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest mb-0.5 flex items-center gap-1"><Activity size={8}/> Obsession Path</p>
                    <p className="text-[9px] text-gray-400 line-clamp-1 italic">{radar.most_visited_path.split('/').pop() || 'Home'}</p>
                </div>
            )}

            {intel.paket && (
                <div className="bg-black/30 p-2 rounded-xl border border-white/5 mb-3 text-[10px] text-gray-400">
                    {intel.paket}
                </div>
            )}

            <div className="flex justify-between items-center pt-3 border-t border-white/5">
                 <select 
                    value={customer.lead_status} 
                    onClick={e => e.stopPropagation()} 
                    onChange={(e) => onStatusUpdate(customer.phone, e.target.value as LeadStatus)} 
                    className="bg-transparent text-[8px] font-black text-gray-600 uppercase outline-none"
                 >
                    {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                 </select>
                 <span className={`w-2 h-2 rounded-full ${customer.lead_temperature === 'hot' || customer.is_indecisive_buyer ? 'bg-red-500 animate-ping' : 'bg-blue-500'}`}></span>
            </div>
        </div>
    );
};