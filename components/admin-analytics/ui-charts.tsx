import React from 'react';
import { Calendar, Activity, Flame, TrendingUp } from 'lucide-react';

export const TrafficChart = ({ data, period }: { data: Record<string, number>, period: number }) => {
    const values = Object.values(data);
    const maxValue = Math.max(...values, 1); 
  
    return (
      <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col shadow-2xl min-h-[360px]">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80}/></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
            <div>
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Calendar size={16} className="text-brand-orange"/> Grafik Gentayangan
                </h4>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">Audit Intensitas {period} Hari Terakhir</p>
            </div>
            <div className="flex items-center gap-2 bg-brand-orange/10 px-3 py-1 rounded-full border border-brand-orange/20">
                <Flame size={12} className="text-brand-orange animate-pulse" />
                <span className="text-[9px] font-black text-brand-orange uppercase tracking-tighter">Heatmap Mode Active</span>
            </div>
        </div>
        
        <div className={`bg-black/20 rounded-2xl p-4 border border-white/5 flex-1 ${period > 7 ? 'overflow-x-auto custom-scrollbar' : 'overflow-hidden'}`}>
            <div className={`h-40 flex items-end justify-between gap-1.5 pt-10 pb-2 relative ${period > 7 ? 'min-w-[600px]' : 'w-full min-w-0'}`}>
                {/* Horizontal Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 z-0 pb-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full h-px border-t border-dashed border-white"></div>
                    ))}
                </div>
        
                {Object.entries(data).map(([date, count], idx) => {
                    const intensity = count / maxValue;
                    const isPeak = count === maxValue && count > 0;
                    const isZero = count === 0;
                    const barHeight = isZero ? '4px' : `${Math.max(intensity * 100, 8)}%`;
                    
                    return (
                        <div key={idx} className="flex-1 group h-full flex flex-col justify-end min-w-0 cursor-pointer z-10">
                            <div className="w-full px-0.5 h-full flex items-end relative">
                                {/* Hover Tooltip */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 pointer-events-none">
                                    <div className="bg-white text-black text-[10px] font-black px-2 py-1 rounded shadow-neon whitespace-nowrap">
                                        {date}: {count} Hits
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-white rotate-45 mx-auto -mt-1"></div>
                                </div>

                                {/* Peak Indicator */}
                                {isPeak && (
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 animate-bounce">
                                        <TrendingUp size={12} className="text-brand-orange" />
                                    </div>
                                )}

                                {/* Main Bar with Intensity Color */}
                                <div 
                                    className={`w-full rounded-t-md transition-all duration-700 relative ${
                                        isPeak ? 'shadow-[0_0_15px_rgba(255,95,31,0.5)]' : ''
                                    }`}
                                    style={{ 
                                        height: barHeight,
                                        backgroundColor: !isZero ? '#FF5F1F' : 'rgba(255,255,255,0.05)',
                                        opacity: !isZero ? (0.2 + (intensity * 0.8)) : 0.1,
                                        borderTop: !isZero ? `2px solid rgba(255, 255, 255, ${intensity})` : 'none'
                                    }}
                                >
                                    {isPeak && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/20 rounded-t-md"></div>
                                    )}
                                </div>
                            </div>

                            <span className={`text-[8px] mt-3 truncate w-full text-center font-bold uppercase tracking-tighter transition-colors ${isPeak ? 'text-brand-orange' : 'text-gray-600 group-hover:text-white'}`}>
                                {date}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
        
        <div className="mt-4 flex justify-center gap-6 text-[8px] font-black uppercase tracking-widest text-gray-700">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-brand-orange opacity-20"></div> Low</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-brand-orange opacity-100 shadow-neon"></div> Peak</div>
        </div>
      </div>
    );
};

export const PeakHoursHeatmap = ({ hours }: { hours: number[] }) => {
    const maxVal = Math.max(...hours, 1);
    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col shadow-2xl min-h-[360px]">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Flame size={80} /></div>
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <Flame size={16} className="text-red-500"/> Jam Sibuk Pasar (WIB)
            </h4>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 flex-1 flex flex-col overflow-hidden">
                <div className="w-full flex items-end gap-1 h-full pt-10 pb-2">
                    {hours.map((count, h) => {
                        const intensity = count / maxVal;
                        const isHighest = count === maxVal && count > 0;
                        return (
                            <div 
                                key={h} 
                                className={`flex-1 rounded-t-sm group relative transition-all duration-500 ${isHighest ? 'shadow-[0_0_10px_rgba(255,95,31,0.3)]' : ''}`}
                                style={{ 
                                    height: `${Math.max(intensity * 100, 4)}%`, 
                                    backgroundColor: count > 0 ? '#FF5F1F' : 'rgba(255,255,255,0.05)',
                                    opacity: count > 0 ? 0.3 + (intensity * 0.7) : 0.2
                                }}
                            >
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 bg-white text-black text-[9px] px-2 py-1 rounded shadow-xl font-black whitespace-nowrap z-50 transition-all pointer-events-none">
                                    {h}:00 - {count} View
                                </div>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[7px] text-gray-600 font-bold group-hover:text-brand-orange transition-colors">
                                    {h.toString().padStart(2, '0')}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <p className="text-[9px] text-gray-700 mt-6 text-center italic uppercase tracking-widest font-bold">Waktu Lokal Browser (Local Browser Time)</p>
        </div>
    );
};

export const RetentionChart = ({ newUsers, returningUsers }: { newUsers: number, returningUsers: number }) => {
    return null; 
};