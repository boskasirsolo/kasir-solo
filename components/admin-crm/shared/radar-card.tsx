import React from 'react';
import { ShoppingCart, Cpu, MessageSquare, Zap, Clock, MapPin, DollarSign, Eye, Activity, Target } from 'lucide-react';
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
    const radar = customer.intelligence;
    
    // Status color mapping - High Contrast Tactical Mode
    const auraClass = isHot 
        ? 'border-red-500/40 bg-gradient-to-br from-[#1a0505] to-[#050505] shadow-[0_10px_30px_rgba(239,68,68,0.1)]' 
        : isWarm 
            ? 'border-brand-orange/40 bg-gradient-to-br from-[#1a1005] to-[#050505] shadow-[0_10px_30px_rgba(255,95,31,0.05)]' 
            : 'border-white/10 bg-gradient-to-br from-[#0c0e12] to-[#050505]';

    const getSourceIcon = () => {
        if (customer.source_origin === 'shadow') return <ShoppingCart size={12} />;
        if (customer.source_origin === 'simulasi') return <Cpu size={12} />;
        return <MessageSquare size={12} />;
    };

    return (
        <div 
            onClick={onClick}
            className={`group relative p-5 rounded-[2rem] border backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex flex-col h-full ${auraClass} hover:border-brand-orange shadow-2xl`}
        >
            {/* TOP HEADER: STATUS & PING */}
            <div className="flex justify-between items-start mb-5">
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-400' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' :
                    'bg-white/5 border-white/10 text-gray-500'
                }`}>
                    {customer.lead_temperature === 'hot' ? '🔥 PRIORITY' : customer.lead_temperature.toUpperCase()}
                </div>
                {isHot && (
                    <div className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </div>
                )}
            </div>

            {/* CORE INFO */}
            <div className="flex items-center gap-4 mb-5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shrink-0 border transition-all ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-neon-text/10' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' : 
                    'bg-white/10 border-white/20 text-gray-400'
                }`}>
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-base font-bold text-white truncate group-hover:text-brand-orange transition-colors font-display tracking-tight">
                        {customer.name}
                    </h4>
                    <p className="text-xs text-gray-500 font-mono mt-0.5 tracking-tighter">
                        **** {customer.phone.slice(-4)}
                    </p>
                </div>
            </div>

            {/* RADAR INTEL GRID (Micro Stats) */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-black/60 p-2.5 rounded-xl border border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Eye size={12} className="text-blue-400 shrink-0" />
                        <span className="text-xs font-black text-white">{radar?.total_views || 0}</span>
                    </div>
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Views</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Clock size={12} className="text-purple-400 shrink-0" />
                        <span className="text-xs font-black text-white">{Math.round((radar?.avg_engagement_sec || 0)/60)}m</span>
                    </div>
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Time</span>
                </div>
            </div>

            {/* ESTIMATION BOX */}
            {intel.estimasi ? (
                <div className={`mb-5 p-3 rounded-2xl flex items-center justify-between group-hover:border-opacity-100 transition-colors border ${
                    isHot ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/5 border-green-500/10'
                }`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isHot ? 'text-red-400' : 'text-green-600'}`}>Est. Mahar</span>
                    <span className={`text-xs font-black font-mono ${isHot ? 'text-white' : 'text-green-400'}`}>{intel.estimasi}</span>
                </div>
            ) : (
                <div className="mb-5 p-3 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-between italic">
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Interest</span>
                    <span className="text-[10px] text-gray-500 truncate max-w-[100px]">Analyzing...</span>
                </div>
            )}

            {/* FOOTER INFO */}
            <div className="mt-auto pt-4 border-t border-white/[0.08] flex justify-between items-center">
                <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/60 border border-white/5 text-[9px] font-black text-gray-400 uppercase tracking-[0.1em]">
                    {getSourceIcon()} {customer.source_origin || 'DIRECT'}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold truncate max-w-[100px]">
                    <MapPin size={10} className="text-gray-600" /> {customer.location || 'Unknown'}
                </div>
            </div>

            {/* STUCK DETECTION OVERLAY */}
            {customer.is_indecisive_buyer && (
                <div className="absolute top-0 right-0 p-1.5">
                    <div className="bg-blue-600 text-white p-1.5 rounded-bl-xl shadow-neon animate-pulse" title="Target Stuck di Checkout">
                        <Activity size={12} />
                    </div>
                </div>
            )}
        </div>
    );
};