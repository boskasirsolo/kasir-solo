import React from 'react';
import { ShoppingCart, Cpu, Globe, Zap, Clock, MapPin, DollarSign, Eye, Activity, Target, TrendingUp, Laptop } from 'lucide-react';
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
    
    const auraClass = isHot 
        ? 'border-red-500/30 bg-gradient-to-br from-[#120404] to-[#050505] shadow-[0_5px_20px_rgba(239,68,68,0.08)]' 
        : isWarm 
            ? 'border-brand-orange/30 bg-gradient-to-br from-[#120b04] to-[#050505]' 
            : 'border-white/5 bg-gradient-to-br from-[#0a0c10] to-[#050505]';

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'new': return { label: '🆕 BARU', color: 'text-blue-400 border-blue-400/20 bg-blue-400/5' };
            case 'contacted': return { label: '📞 DISAPA', color: 'text-yellow-400 border-yellow-400/20 bg-yellow-500/5' };
            case 'negotiating': return { label: '📑 NEGO', color: 'text-orange-400 border-orange-400/20 bg-brand-orange/5' };
            case 'closed': return { label: '🤝 DEAL', color: 'text-green-400 border-green-400/20 bg-green-500/5' };
            case 'lost': return { label: '❌ BATAL', color: 'text-red-400 border-red-400/20 bg-red-500/5' };
            default: return { label: '⏳ RADAR', color: 'text-gray-500 border-white/5 bg-black/40' };
        }
    };

    const getSourceInfo = (source?: string, category?: string) => {
        const val = (category || source || '').toLowerCase();
        if (val.includes('hardware') || val.includes('produk')) return { label: 'PRODUK', color: 'text-red-400', icon: ShoppingCart };
        if (val.includes('webapp')) return { label: 'WEBAPP', color: 'text-blue-400', icon: Laptop };
        if (val.includes('seo')) return { label: 'SEO', color: 'text-purple-400', icon: TrendingUp };
        if (val.includes('web') || val.includes('website')) return { label: 'WEBSITE', color: 'text-green-400', icon: Globe };
        return { label: 'DIRECT', color: 'text-gray-500', icon: Zap };
    };

    const statusInfo = getStatusInfo(customer.lead_status);
    const sourceInfo = getSourceInfo(customer.source_origin, customer.detected_category);
    const SourceIcon = sourceInfo.icon;

    return (
        <div 
            onClick={onClick}
            className={`group relative p-5 rounded-[1.5rem] border backdrop-blur-md transition-all duration-300 cursor-pointer hover:border-brand-orange/50 flex flex-col h-full ${auraClass} shadow-xl active:scale-[0.98]`}
        >
            {/* Header Badge: text-[10px] */}
            <div className="flex justify-between items-start mb-4">
                <div className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    isHot ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                    isWarm ? 'bg-brand-orange/10 border-brand-orange/20 text-brand-orange' :
                    'bg-white/5 border-white/10 text-gray-600'
                }`}>
                    {customer.lead_temperature === 'hot' ? '🔥 PRIORITY' : customer.lead_temperature.toUpperCase()}
                </div>
                {isHot && (
                    <div className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </div>
                )}
            </div>

            {/* Profile: Avatar 12, Name base (16px), Phone xs (12px) */}
            <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg shrink-0 border transition-all ${
                    isHot ? 'bg-red-500/20 border-red-500/30 text-red-500' : 
                    isWarm ? 'bg-brand-orange/10 border-brand-orange/30 text-brand-orange' : 
                    'bg-white/5 border-white/10 text-gray-500'
                }`}>
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-bold text-white truncate group-hover:text-brand-orange transition-colors font-display tracking-tight leading-tight">
                        {customer.name}
                    </h4>
                    <p className="text-[11px] text-gray-600 font-mono mt-0.5 uppercase">
                        WA • {customer.phone.slice(-4)}
                    </p>
                </div>
            </div>

            {/* Intel Grid: text-[11px] and numbers sm (14px) */}
            <div className="grid grid-cols-2 gap-2 mb-5">
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.03] flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Eye size={12} className="text-blue-400/70" />
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Views</span>
                    </div>
                    <span className="text-sm font-black text-white ml-4">{radar?.total_views || 0}</span>
                </div>
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/[0.03] flex flex-col justify-center">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <Clock size={12} className="text-purple-400/70" />
                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Time</span>
                    </div>
                    <span className="text-sm font-black text-white ml-4">{Math.round((radar?.avg_engagement_sec || 0)/60)}m</span>
                </div>
            </div>

            {/* Mahar Box: text-[10px] & text-sm */}
            {intel.estimasi ? (
                <div className={`mb-5 p-3 rounded-xl flex flex-col border ${
                    isHot ? 'bg-red-500/5 border-red-500/10' : 'bg-green-500/5 border-green-500/10'
                }`}>
                    <span className={`text-[9px] font-black uppercase tracking-widest mb-0.5 ${isHot ? 'text-red-500/70' : 'text-green-600'}`}>Est. Mahar</span>
                    <span className={`text-sm font-black font-mono ${isHot ? 'text-white' : 'text-green-500'}`}>{intel.estimasi}</span>
                </div>
            ) : (
                <div className="mb-5 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl flex items-center justify-between italic">
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">Interest</span>
                    <span className="text-[10px] text-gray-600 truncate">Analyzing...</span>
                </div>
            )}

            {/* Footer: text-[10px] */}
            <div className="mt-auto pt-4 border-t border-white/[0.05] flex justify-between items-center">
                <div className={`px-2 py-0.5 rounded border text-[10px] font-black uppercase tracking-wider ${statusInfo.color}`}>
                    {statusInfo.label}
                </div>
                <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${sourceInfo.color} group-hover:scale-105 transition-transform`}>
                    <SourceIcon size={14} className="opacity-60" />
                    <span>{sourceInfo.label}</span>
                </div>
            </div>

            {/* Stuck Indicator */}
            {customer.is_indecisive_buyer && (
                <div className="absolute top-0 right-0 p-1.5">
                    <div className="bg-blue-600 text-white p-1 rounded-bl-xl shadow-neon animate-pulse" title="Target Stuck di Checkout">
                        <Activity size={12} />
                    </div>
                </div>
            )}
        </div>
    );
};