
import React from 'react';
import { PIPELINE_STAGES, Customer, LeadStatus } from '../types';
import { Box } from 'lucide-react';
import { RadarJuraganCard } from '../shared/radar-card';

interface PipelineModuleProps {
    customers: Customer[];
    onOpenDetail: (c: Customer) => void;
    onStatusUpdate: (phone: string, status: LeadStatus) => void;
    onRescue: (c: Customer) => void;
    isRescuingId: string | null;
}

export const PipelineModule = ({ customers, onOpenDetail }: PipelineModuleProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
            {PIPELINE_STAGES.map(stage => {
                const stageCustomers = customers.filter(c => c.lead_status === stage.id);
                return (
                    <div key={stage.id} className="flex flex-col h-[750px] bg-black/20 rounded-3xl border border-white/5 overflow-hidden">
                        <div className={`p-4 border-b-2 bg-brand-card/50 ${stage.color} flex justify-between items-center shrink-0`}>
                            <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{stage.label}</h4>
                            <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-0.5 rounded-full">{stageCustomers.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {stageCustomers.map(customer => (
                                <RadarJuraganCard 
                                    key={customer.phone} 
                                    customer={customer} 
                                    onClick={() => onOpenDetail(customer)} 
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
