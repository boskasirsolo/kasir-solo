import React from 'react';
import { TrendingUp, AlertTriangle, ArrowDown, Target, Zap, Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';
import { FunnelStats } from './types';

// --- KOMPONEN 1: RADAR CORONG CUAN ---
export const FunnelVisual = ({ data }: { data: FunnelStats }) => {
    if (!data) return null;
    return (
        <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden h-full flex flex-col">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Target size={120} /></div>
            
            <h4 className="text-white font-bold text-sm mb-8 flex items-center gap-2">
                <TrendingUp size={16} className="text-brand-orange"/> Radar Corong Cuan
            </h4>

            <div className="space-y-4 flex-1">
                {data.stages.map((stage, idx) => {
                    const isLast = idx === data.stages.length - 1;
                    const width = `${Math.max(30, 100 - (idx * 20))}%`;
                    
                    return (
                        <div key={idx} className="relative group">
                            <div className="flex items-center gap-4 mb-1">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 border border-white/10 ${stage.color}`}>
                                    <stage.icon size={16} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stage.label}</span>
                                        <span className="text-sm font-bold text-white">{stage.count} <span className="text-gray-600 text-[10px] font-normal">User</span></span>
                                    </div>
                                    <div className="h-4 bg-black/40 rounded-full border border-white/5 overflow-hidden flex justify-center">
                                        <div 
                                            className={`h-full bg-gradient-to-r from-transparent via-current to-transparent transition-all duration-1000 ${stage.color.replace('text-', 'bg-')}`}
                                            style={{ width: width, opacity: 0.6 }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="w-16 text-right">
                                    <p className="text-xs font-black text-white">{stage.percentage}%</p>
                                    <p className="text-[8px] text-gray-600 uppercase">Survival</p>
                                </div>
                            </div>

                            {!isLast && (
                                <div className="flex justify-center py-2">
                                    <div className="flex flex-col items-center group-hover:scale-110 transition-transform">
                                        <ArrowDown size={12} className="text-gray-700" />
                                        <span className={`text-[8px] font-bold ${stage.dropOff > 50 ? 'text-red-500' : 'text-gray-600'}`}>
                                            -{stage.dropOff}% Kabur
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            <div className="mt-8 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-xl flex gap-4 items-center shrink-0">
                <div className="p-3 bg-brand-orange/10 rounded-full text-brand-orange animate-pulse">
                    <Zap size={20} />
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Success Rate</p>
                    <h3 className="text-xl font-display font-black text-white">{data.conversionRate.toFixed(1)}%</h3>
                </div>
            </div>
        </div>
    );
};

// --- KOMPONEN 2: JALUR PALING CUAN ---
export const GoldenPathsVisual = ({ data }: { data: FunnelStats }) => {
    if (!data) return null;
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 shadow-xl flex-1 flex flex-col">
                <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                    <ArrowDown size={16} className="text-blue-400 rotate-[-135deg]"/> Jalur Paling Cuan
                </h4>
                
                <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1">
                    {data.topPaths.map((pattern, idx) => (
                        <div key={idx} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-blue-500/30 transition-all group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Path #{idx+1}</span>
                                <span className="text-[10px] font-bold text-white font-mono">{pattern.count} Sesi</span>
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-mono line-clamp-2 group-hover:text-gray-200">
                                {pattern.path}
                            </p>
                        </div>
                    ))}
                    {data.topPaths.length === 0 && (
                        <div className="text-center py-10 opacity-30">
                            <p className="text-xs italic">Belum ada pola terdeteksi...</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 shrink-0">
                <h4 className="text-red-500 font-bold text-xs mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <AlertTriangle size={14}/> Radar Boncos
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                    Tahap <strong>KEPO → NAKSIR</strong> punya drop-off tinggi. 
                    <br/>
                    <span className="text-white font-bold">Saran SIBOS:</span> Tambahin tombol 'Cek Harga' di tengah artikel.
                </p>
            </div>
        </div>
    );
};

// --- LEGACY WRAPPER (FOR COMPATIBILITY IF NEEDED) ---
export const FunnelRadar = ({ data }: { data: FunnelStats }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <FunnelVisual data={data} />
            <GoldenPathsVisual data={data} />
        </div>
    );
};