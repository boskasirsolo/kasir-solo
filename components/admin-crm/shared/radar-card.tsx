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
    
    // Status color mapping
    const statusColor = isHot ? 'text-red-500' : isWarm ? 'text-brand-orange' : 'text-gray-400';
    const auraClass = isHot 
        ? 'border-red-500/30 bg-red-600/[0.03] shadow-[0_0_20px_rgba(239,68,68,0.1)]' 
        : isWarm 
            ? 'border-brand-orange/30 bg-brand-orange/[0.02]' 
            : 'border-white/5 bg-white/[0.01]';

    const getSourceIcon = () => {
        if (customer.source_origin === 'shadow') return <ShoppingCart size={10} />;
        if (customer.source_origin === 'simulasi') return <Cpu size={10} />;
        return <MessageSquare size={10} />;
    };

    return (
        <div 
            onClick={onClick}
            className={`group relative p-4 rounded-2xl border backdrop-blur-sm transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex flex-col h-full ${auraClass} hover:border-brand-orange/50`}
        >
            {/* TOP HEADER: STATUS & PING */}
            <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${isHot ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-black/40 border-white/10 text-gray-500'}`}>
                    {customer.lead_temperature === 'hot' ? '🔥 PRIORITY' : customer.lead_temperature.toUpperCase()}
                </div>
                {isHot && (
                    <div className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                )}
            </div>

            {/* CORE INFO */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-base shrink-0 border transition-all ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-neon-text/10' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' : 
                    'bg-white/5 border-white/10 text-gray-500'
                }`}>
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-orange transition-colors">
                        {customer.name}
                    </h4>
                    <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                        **** {customer.phone.slice(-4)}
                    </p>
                </div>
            </div>

            {/* RADAR INTEL GRID (Micro Stats) */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-black/40 p-2 rounded-lg border border-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <Eye size={10} className="text-blue-400 shrink-0" />
                        <span className="text-[9px] font-black text-white">{radar?.total_views || 0}</span>
                    </div>
                    <span className="text-[7px] text-gray-600 font-bold uppercase">Views</span>
                </div>
                <div className="bg-black/40 p-2 rounded-lg border border-white/[0.03] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <Clock size={10} className="text-purple-400 shrink-0" />
                        <span className="text-[9px] font-black text-white">{Math.round((radar?.avg_engagement_sec || 0)/60)}m</span>
                    </div>
                    <span className="text-[7px] text-gray-600 font-bold uppercase">Time</span>
                </div>
            </div>

            {/* ESTIMATION BOX */}
            {intel.estimasi ? (
                <div className="mb-4 p-2 bg-green-500/5 border border-green-500/10 rounded-lg flex items-center justify-between group-hover:border-green-500/30 transition-colors">
                    <span className="text-[8px] font-black text-green-600 uppercase tracking-tighter">Est. Mahar</span>
                    <span className="text-[10px] font-black text-green-400 font-mono">{intel.estimasi}</span>
                </div>
            ) : (
                <div className="mb-4 p-2 bg-white/[0.02] border border-white/[0.05] rounded-lg flex items-center justify-between italic">
                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-tighter">Interest</span>
                    <span className="text-[9px] text-gray-500 truncate max-w-[80px]">Scanning...</span>
                </div>
            )}

            {/* FOOTER INFO */}
            <div className="mt-auto pt-3 border-t border-white/[0.05] flex justify-between items-center">
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                    {getSourceIcon()} {customer.source_origin || 'DIRECT'}
                </div>
                <div className="flex items-center gap-1 text-[9px] text-gray-600 font-bold truncate max-w-[80px]">
                    <MapPin size={8} /> {customer.location || 'Unknown'}
                </div>
            </div>

            {/* STUCK DETECTION OVERLAY */}
            {customer.is_indecisive_buyer && (
                <div className="absolute top-0 right-0 p-1">
                    <div className="bg-blue-600 text-white p-1 rounded-bl-lg shadow-neon animate-pulse" title="Target Stuck di Checkout">
                        <Activity size={10} />
                    </div>
                </div>
            )}
        </div>
    );
};