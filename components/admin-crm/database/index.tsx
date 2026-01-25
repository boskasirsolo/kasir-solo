
import React, { useState, useMemo } from 'react';
import { Filter, Database, Search, LayoutGrid, List } from 'lucide-react';
import { Customer, LeadTemperature } from '../types';
import { RadarJuraganCard } from '../shared/radar-card';

interface DatabaseModuleProps {
    customers: Customer[];
    onOpenDetail: (c: Customer) => void;
    onRescue: (c: Customer) => void;
}

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

export const DatabaseModule = ({ customers, onOpenDetail }: DatabaseModuleProps) => {
    const [tempFilter, setTempFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    const filteredList = useMemo(() => {
        return customers.filter(c => {
            const matchesTemp = tempFilter === 'all' || c.lead_temperature === tempFilter;
            const matchesStatus = statusFilter === 'all' || c.lead_status === statusFilter;
            return matchesTemp && matchesStatus;
        });
    }, [customers, tempFilter, statusFilter]);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* MULTI-FILTER RADAR */}
            <div className="flex flex-col gap-4 bg-brand-card/20 p-5 rounded-3xl border border-white/5 shadow-inner">
                <div className="flex flex-wrap items-center gap-6">
                    {/* Status Filter Group */}
                    <div className="space-y-2">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest ml-1">Filter Progres</p>
                        <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full">
                            {STATUS_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setStatusFilter(opt.id)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                                        statusFilter === opt.id
                                        ? 'bg-white/10 text-white border-white/20 shadow-sm'
                                        : 'bg-black/40 text-gray-500 border-white/5 hover:text-gray-300'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/5 hidden md:block"></div>

                    {/* Temperature Filter Group */}
                    <div className="space-y-2">
                        <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest ml-1">Filter Suhu</p>
                        <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide max-w-full">
                            {TEMPERATURE_OPTIONS.map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setTempFilter(opt.id)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                                        tempFilter === opt.id
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
            </div>

            {/* RADAR GRID (Replacing Table) */}
            <div className="min-h-[500px]">
                {filteredList.length === 0 ? (
                    <div className="p-20 text-center text-gray-600 italic bg-black/10 rounded-3xl border-2 border-dashed border-white/5">
                        <Database size={48} className="mx-auto mb-4 opacity-10" />
                        Gak ada juragan yang cocok sama filter lo, Bos.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredList.map(customer => (
                            <RadarJuraganCard 
                                key={customer.phone} 
                                customer={customer} 
                                onClick={() => onOpenDetail(customer)} 
                            />
                        ))}
                    </div>
                )}
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">Arsip Intelijen V3.1 // Mode Radar Card Aktif</p>
            </div>
        </div>
    );
};
