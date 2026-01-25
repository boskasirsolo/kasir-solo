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
        ? 'border-red-500/40 bg-gradient-to-br from-[#1a0505] to-[#050505] shadow-[0_10px_30px_rgba(239,68,68,0.1)]' 
        : isWarm 
            ? 'border-brand-orange/40 bg-gradient-to-br from-[#1a1005] to-[#050505] shadow-[0_10px_30px_rgba(255,95,31,0.05)]' 
            : 'border-white/10 bg-gradient-to-br from-[#0c0e12] to-[#050505]';

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'new': return { label: '🆕 BARU', color: 'text-blue-400 border-blue-400/30 bg-blue-400/5' };
            case 'contacted': return { label: '📞 DISAPA', color: 'text-yellow-400 border-yellow-400/30 bg-yellow-500/5' };
            case 'negotiating': return { label: '📑 NEGO', color: 'text-orange-400 border-orange-400/30 bg-brand-orange/5' };
            case 'closed': return { label: '🤝 DEAL', color: 'text-green-400 border-green-400/30 bg-green-500/5' };
            case 'lost': return { label: '❌ BATAL', color: 'text-red-400 border-red-400/30 bg-red-500/5' };
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
            className={`group relative p-6 rounded-[2rem] border backdrop-blur-md transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex flex-col h-full ${auraClass} hover:border-brand-orange shadow-2xl`}
        >
            <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-400' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' :
                    'bg-white/5 border-white/10 text-gray-500'
                }`}>
                    {customer.lead_temperature === 'hot' ? '🔥 PRIORITY' : customer.lead_temperature.toUpperCase()}
                </div>
                {isHot && (
                    <div className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 border transition-all ${
                    isHot ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-neon-text/10' : 
                    isWarm ? 'bg-brand-orange/20 border-brand-orange/40 text-brand-orange' : 
                    'bg-white/10 border-white/20 text-gray-400'
                }`}>
                    {customer.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-bold text-white truncate group-hover:text-brand-orange transition-colors font-display tracking-tight">
                        {customer.name}
                    </h4>
                    <p className="text-sm text-gray-500 font-mono mt-0.5">
                        **** {customer.phone.slice(-4)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-black/60 p-3 rounded-xl border border-white/[0.05] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Eye size={14} className="text-blue-400 shrink-0" />
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Views</span>
                    </div>
                    <span className="text-base font-black text-white ml-5">{radar?.total_views || 0}</span>
                </div>
                <div className="bg-black/60 p-3 rounded-xl border border-white/[0.05] flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                        <Clock size={14} className="text-purple-400 shrink-0" />
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">Time</span>
                    </div>
                    <span className="text-base font-black text-white ml-5">{Math.round((radar?.avg_engagement_sec || 0)/60)}m</span>
                </div>
            </div>

            {intel.estimasi ? (
                <div className={`mb-6 p-4 rounded-2xl flex flex-col group-hover:border-opacity-100 transition-colors border ${
                    isHot ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/5 border-green-500/10'
                }`}>
                    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isHot ? 'text-red-400' : 'text-green-600'}`}>Est. Mahar</span>
                    <span className={`text-base font-black font-mono ${isHot ? 'text-white' : 'text-green-400'}`}>{intel.estimasi}</span>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl flex items-center justify-between italic">
                    <span className="text-xs font-black text-gray-700 uppercase tracking-widest">Interest</span>
                    <span className="text-xs text-gray-500 truncate">Analyzing...</span>
                </div>
            )}

            <div className="mt-auto pt-5 border-t border-white/[0.08] flex justify-between items-center">
                <div className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase tracking-wider shadow-inner ${statusInfo.color}`}>
                    {statusInfo.label}
                </div>
                <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${sourceInfo.color} group-hover:scale-105 transition-transform`}>
                    <SourceIcon size={16} className="opacity-70" />
                    <span>{sourceInfo.label}</span>
                </div>
            </div>

            {customer.is_indecisive_buyer && (
                <div className="absolute top-0 right-0 p-2">
                    <div className="bg-blue-600 text-white p-2 rounded-bl-2xl shadow-neon animate-pulse" title="Target Stuck di Checkout">
                        <Activity size={16} />
                    </div>
                </div>
            )}
        </div>
    );
};