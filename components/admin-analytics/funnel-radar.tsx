
import React from 'react';
import { TrendingUp, ArrowDown, Target, Zap } from 'lucide-react';
import { FunnelStats } from './types';

export const FunnelVisual = ({ data }: { data: FunnelStats }) => {
    if (!data) return null;
    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 md:p-7 shadow-2xl relative overflow-hidden h-full flex flex-col min-h-[420px]">
            {/* Background Decoration: Target Circles */}
            <div className="absolute -top-10 -right-10 opacity-[0.03] pointer-events-none">
                <div className="relative flex items-center justify-center">
                    <Target size={300} className="text-white" />
                    <div className="absolute w-[200px] h-[200px] border-4 border-white rounded-full"></div>
                    <div className="absolute w-[100px] h-[100px] border-4 border-white rounded-full"></div>
                </div>
            </div>
            
            <h4 className="text-white font-black text-xs mb-6 flex items-center gap-2 uppercase tracking-widest relative z-10">
                <TrendingUp size={16} className="text-brand-orange animate-pulse"/> Radar Corong
            </h4>

            <div className="flex-1 flex flex-col justify-between relative z-10 px-1">
                {data.stages.map((stage, idx) => {
                    const isLast = idx === data.stages.length - 1;
                    const width = `${100 - (idx * 5)}%`;
                    
                    return (
                        <div key={idx} className="w-full">
                            <div className="flex items-center gap-3 group">
                                {/* Label & Icon */}
                                <div className="flex items-center gap-2 w-24 shrink-0">
                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 transition-transform group-hover:scale-110 ${stage.color}`}>
                                        <stage.icon size={14} />
                                    </div>
                                    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{stage.label}</span>
                                </div>

                                {/* Progress Bar Container */}
                                <div className="flex-1 flex flex-col items-center">
                                    <div className="w-full h-2 bg-black/40 rounded-full border border-white/5 overflow-hidden flex justify-center shadow-inner">
                                        <div 
                                            className={`h-full bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-1000 shadow-neon-text opacity-70 ${stage.color.replace('text-', 'bg-')}`}
                                            style={{ width: width }}
                                        ></div>
                                    </div>
                                    
                                    {!isLast && (
                                        <div className="h-6 flex flex-col items-center justify-center overflow-hidden">
                                            <div className="flex items-center gap-1 py-0.5">
                                                <ArrowDown size={8} className="text-gray-700 animate-bounce" />
                                                <span className={`text-[7px] font-black uppercase tracking-tighter ${stage.dropOff > 50 ? 'text-red-500' : 'text-gray-700'}`}>
                                                    -{stage.dropOff}%
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Stats Right */}
                                <div className="w-16 text-right shrink-0">
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-black text-white leading-none">
                                            {stage.count}
                                        </span>
                                        <span className="text-[8px] font-black text-gray-600 mt-0.5">{stage.percentage}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Bottom Status Summary */}
            <div className="mt-6 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl flex justify-between items-center shrink-0 shadow-inner group hover:border-brand-orange/40 transition-colors">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange border border-brand-orange/30">
                        <Zap size={16} className="animate-pulse" />
                    </div>
                    <div>
                        <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest mb-0.5">Cuan Rate</p>
                        <h3 className="text-2xl font-display font-black text-white leading-none group-hover:text-brand-orange transition-colors">
                            {data.conversionRate.toFixed(1)}%
                        </h3>
                    </div>
                </div>
                <div className="h-6 w-px bg-white/5"></div>
                <div className="text-right">
                    <p className="text-[8px] text-gray-700 font-black uppercase tracking-widest">Efficiency</p>
                    <p className="text-[10px] font-bold text-green-500 uppercase">OPTIMIZED</p>
                </div>
            </div>
        </div>
    );
};
