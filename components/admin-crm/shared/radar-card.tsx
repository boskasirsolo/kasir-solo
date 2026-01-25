import React from 'react';
import { ShoppingCart, Cpu, MessageSquare, Zap, Clock, MapPin, DollarSign } from 'lucide-react';
import { Customer } from '../types';
import { parseIntel } from './utils';

interface RadarJuraganCardProps {
    customer: Customer;
    onClick: () => void;
}

export const RadarJuraganCard: React.FC<RadarJuraganCardProps> = ({ customer, onClick }) => {
    const isHot = customer.lead_temperature === 'hot' || customer.is_indecisive_buyer;
    const isWarm = customer.lead_temperature === 'warm';
    const intel = parseIntel(customer.last_notes);
    
    // Aura Glow Logic
    let auraClass = "border-white/5";
    if (isHot) auraClass = "border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)] bg-red-600/[0.03]";
    else if (isWarm) auraClass = "border-brand-orange/40 shadow-[0_0_15px_rgba(255,95,31,0.1)] bg-brand-orange/[0.03]";

    const getSourceIcon = () => {
        if (customer.source_origin === 'shadow') return <ShoppingCart size={10} />;
        if (customer.source_origin === 'simulasi') return <Cpu size={10} />;
        return <MessageSquare size={10} />;
    };

    return (
        <div 
            onClick={onClick}
            className={`group relative p-4 rounded-2xl border transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${auraClass}`}
        >
            {/* Status Radar Pulsing (Only for Hot/Urgent) */}
            {isHot && (
                <div className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Avatar Bulat Inisial */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 border transition-colors ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-500' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' : 
                    'bg-white/5 border-white/10 text-gray-500 group-hover:text-gray-300'
                }`}>
                    {customer.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-orange transition-colors">
                        {customer.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500 font-mono">
                            **** {customer.phone.slice(-4)}
                        </span>
                        <span className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter flex items-center gap-1">
                            <Clock size={8} /> {customer.last_seen_label}
                        </span>
                    </div>
                    
                    {/* ESTIMASI NOMINAL (DI KARTU) */}
                    {intel.estimasi && (
                        <div className="mt-2 flex items-center gap-1 text-green-400 font-black text-[10px] font-mono">
                            <DollarSign size={10} className="opacity-50" /> {intel.estimasi}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Tambahan Bawah (Sangat Tipis/Minimal) */}
            <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[8px] font-black text-gray-500 uppercase flex items-center gap-1">
                        {getSourceIcon()} {customer.source_origin || 'Direct'}
                    </div>
                </div>
                {customer.location && (
                    <div className="flex items-center gap-1 text-[9px] text-gray-700 truncate max-w-[100px]">
                        <MapPin size={8} /> {customer.location}
                    </div>
                )}
            </div>

            {/* Surveillance Badge (Kecil di Pojok) */}
            {customer.is_indecisive_buyer && (
                <div className="absolute bottom-0 right-3 transform translate-y-1/2">
                    <span className="bg-blue-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full shadow-neon uppercase">
                        STUCK
                    </span>
                </div>
            )}
        </div>
    );
};