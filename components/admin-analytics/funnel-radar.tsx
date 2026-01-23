
import React from 'react';
import { TrendingUp, AlertTriangle, ArrowDown, Target, Zap, Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';
import { FunnelStats } from './types';

export const FunnelVisual = ({ data }: { data: FunnelStats }) => {
    if (!data) return null;
    return (
        <div className="bg-brand-dark border border-white/5 rounded-2xl p-4 md:p-6 shadow-xl relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={120} /></div>
            
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-orange"/> Radar Corong
            </h4>

            <div className="space-y-1 flex-1">
                {data.stages.map((stage, idx) => {
                    const isLast = idx === data.stages.length - 1;
                    const width = `${Math.max(30, 100 - (idx * 20))}%`;
                    
                    return (
                        <div key={idx} className="relative group">
                            <div className="flex items-center gap-3 py-1">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 shrink-0 ${stage.color}`}>
                                    <stage.icon size={14} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest truncate">{stage.label}</span>
                                        <span className="text-[11px] font-bold text-white">{stage.count} <span className="text-gray-600 text-[8px] font-normal">User</span></span>
                                    </div>
                                    <div className="h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden flex justify-center">
                                        <div 
                                            className={`h-full bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-1000 ${stage.color.replace('text-', 'bg-')}`}
                                            style={{ width: width, opacity: 0.6 }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="w-12 text-right shrink-0">
                                    <p className="text-[10px] font-black text-white">{stage.percentage}%</p>
                                </div>
                            </div>

                            {!isLast && (
                                <div className="flex justify-center -my-1">
                                    <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                                        <ArrowDown size={10} className="text-gray-700" />
                                        <span className={`text-[7px] font-bold ${stage.dropOff > 50 ? 'text-red-500' : 'text-gray-600'}`}>
                                            -{stage.dropOff}% Kabur
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-4 p-3 bg-brand-orange/5 border border-brand-orange/20 rounded-xl flex gap-3 items-center shrink-0">
                <Zap size={16} className="text-brand-orange animate-pulse" />
                <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Success Rate</p>
                    <h3 className="text-lg font-display font-black text-white leading-none">{data.conversionRate.toFixed(1)}%</h3>
                </div>
            </div>
        </div>
    );
};

export const GoldenPathsVisual = ({ data }: { data: FunnelStats }) => {
    if (!data) return null;
    return (
        <div className="flex flex-col gap-4 h-full">
            <div className="bg-brand-dark border border-white/5 rounded-2xl p-4 md:p-6 shadow-xl flex-1 flex flex-col">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <Zap size={16} className="text-blue-400"/> Jalur Paling Cuan
                </h4>
                
                <div className="space-y-1.5 flex-1 overflow-y-auto custom-scrollbar pr-1">
                    {data.topPaths.map((pattern, idx) => (
                        <div key={idx} className="p-2 bg-white/[0.02] rounded-lg border border-white/5 hover:border-blue-500/20 transition-all flex items-center gap-3 group">
                            <span className="text-[9px] font-black text-blue-400 bg-blue-500/10 w-5 h-5 flex items-center justify-center rounded border border-blue-500/20 shrink-0">#{idx+1}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] text-gray-400 truncate group-hover:text-gray-200 font-mono">
                                    {pattern.path}
                                </p>
                            </div>
                            <span className="text-[10px] font-bold text-white font-mono shrink-0">{pattern.count}x</span>
                        </div>
                    ))}
                    {data.topPaths.length === 0 && (
                        <div className="text-center py-6 opacity-30">
                            <p className="text-[10px] italic">No data.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 shrink-0">
                <p className="text-[9px] text-gray-400 leading-relaxed">
                    <span className="text-red-400 font-bold uppercase mr-1">Radar Boncos:</span>
                    Tahap <strong>KEPO → NAKSIR</strong> drop-off tinggi. Perlu push tombol 'Cek Harga'.
                </p>
            </div>
        </div>
    );
};
