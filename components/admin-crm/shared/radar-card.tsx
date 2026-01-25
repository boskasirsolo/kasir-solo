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
    if (isHot) auraClass = "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.2)] bg-red-600/[0.04]";
    else if (isWarm) auraClass = "border-brand-orange/40 shadow-[0_0_15px_rgba(255,95,31,0.1)] bg-brand-orange/[0.03]";

    const getSourceIcon = () => {
        if (customer.source_origin === 'shadow') return <ShoppingCart size={12} />;
        if (customer.source_origin === 'simulasi') return <Cpu size={12} />;
        return <MessageSquare size={12} />;
    };

    return (
        <div 
            onClick={onClick}
            className={`group relative p-5 rounded-3xl border transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98] ${auraClass}`}
        >
            {/* Status Radar Pulsing */}
            {isHot && (
                <div className="absolute top-4 right-4 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </div>
            )}

            <div className="flex items-start gap-4">
                {/* Avatar Bulat Inisial */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border transition-all ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-neon-text/10' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' : 
                    'bg-white/5 border-white/10 text-gray-500 group-hover:text-gray-300'
                }`}>
                    {customer.name.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-white truncate group-hover:text-brand-orange transition-colors">
                        {customer.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500 font-mono font-medium">
                            **** {customer.phone.slice(-4)}
                        </span>
                        <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded">
                            <Clock size={10} /> {customer.last_seen_label}
                        </span>
                    </div>
                    
                    {/* ESTIMASI NOMINAL */}
                    {intel.estimasi && (
                        <div className="mt-3 flex items-center gap-1.5 text-green-400 font-black text-xs font-mono bg-green-500/10 w-fit px-2 py-1 rounded-lg border border-green-500/20">
                            <DollarSign size={12} className="opacity-70" /> {intel.estimasi}
                        </div>
                    )}
                </div>
            </div>

            {/* Info Tambahan Bawah */}
            <div className="mt-5 pt-4 border-t border-white/[0.05] flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-lg bg-black/40 border border-white/10 text-[10px] font-black text-gray-400 uppercase flex items-center gap-1.5">
                        {getSourceIcon()} {customer.source_origin || 'Direct'}
                    </div>
                </div>
                {customer.location && (
                    <div className="flex items-center gap-1 text-[11px] text-gray-600 truncate max-w-[120px] font-bold">
                        <MapPin size={10} className="text-gray-700" /> {customer.location}
                    </div>
                )}
            </div>

            {/* Surveillance Badge */}
            {customer.is_indecisive_buyer && (
                <div className="absolute bottom-0 right-5 transform translate-y-1/2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-full shadow-neon uppercase tracking-tighter">
                        STUCK_DETECTION
                    </span>
                </div>
            )}
        </div>
    );
};