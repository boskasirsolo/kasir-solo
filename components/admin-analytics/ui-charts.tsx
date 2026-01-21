
import React, { useState, useMemo } from 'react';
import { Calendar, Clock, Activity, Flame, RefreshCw } from 'lucide-react';

export const TrafficChart = ({ data, period }: { data: Record<string, number>, period: number }) => {
    const values = Object.values(data);
    const maxValue = Math.max(...values, 5); 
  
    return (
      <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80}/></div>
        <h4 className="text-white font-bold text-sm mb-4 md:mb-6 flex items-center gap-2">
            <Calendar size={16} className="text-brand-orange"/> Grafik Gentayangan ({period} Hari)
        </h4>
        
        <div className="bg-black/20 rounded-xl p-2 md:p-4 border border-white/5 overflow-x-auto custom-scrollbar">
            <div className="min-w-[500px] h-64 flex items-end justify-between gap-2 pt-10 pb-2 relative">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10 z-0">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-full h-px ${i === 4 ? 'border-t border-gray-500' : 'border-t border-dashed border-gray-500'}`}></div>
                    ))}
                </div>
        
                {Object.entries(data).map(([date, count], idx) => {
                    const heightPercent = (count / maxValue) * 100;
                    const isZero = count === 0;
                    
                    return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end min-w-[20px]">
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark border border-brand-orange/50 text-brand-orange text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-neon whitespace-nowrap z-20 pointer-events-none">
                                {count} Hits
                            </div>
                            <div className="w-full px-0.5 md:px-1 h-full flex items-end relative">
                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-1000 relative ${
                                        isZero 
                                        ? 'bg-white/5 h-[4px]' 
                                        : 'bg-gradient-to-t from-brand-orange/20 to-brand-orange border-t border-brand-orange group-hover:brightness-125 shadow-[0_0_10px_rgba(255,95,31,0.2)]'
                                    }`}
                                    style={{ height: isZero ? '4px' : `${heightPercent}%` }}
                                >
                                </div>
                            </div>
                            <span className="text-[8px] md:text-[9px] text-gray-500 mt-2 truncate w-full text-center font-mono group-hover:text-white transition-colors">
                                {date}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
      </div>
    );
};

export const PeakHoursHeatmap = ({ hours }: { hours: number[] }) => {
    const maxVal = Math.max(...hours, 1);
    const [hoveredHour, setHoveredHour] = useState<number | null>(null);

    // Hitung posisi absolut di dalam kontainer bar
    const tooltipData = useMemo(() => {
        if (hoveredHour === null) return null;
        const count = hours[hoveredHour];
        const intensity = count / maxVal;
        
        // Horizontal: Pake index bar (0-23) dibagi total
        const leftPos = (hoveredHour / 23) * 100; 
        // Vertical: Persentase tinggi bar
        const barHeightPercent = Math.max(intensity * 100, 5);

        return { hour: hoveredHour, count, barHeight: barHeightPercent, left: leftPos };
    }, [hoveredHour, hours, maxVal]);

    return (
        <div className="mt-6 pt-6 border-t border-white/5 relative">
            <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                <Flame size={14} className="text-red-500"/> Jam Sibuk Pasar (WIB)
            </h4>
            <p className="text-[10px] text-gray-500 mb-4">Sorot bar buat liat detail jam operasional.</p>
            
            <div className="relative bg-black/40 rounded-2xl p-4 md:p-6 border border-white/5 overflow-visible">
                {/* 
                    PT-16 di bawah ini krusial biar tooltip ada space di atas. 
                    PB-2 buat kasih jarak sama label jam.
                */}
                <div className="relative overflow-visible pb-2 pt-16">
                    <div className="overflow-x-auto custom-scrollbar-hide">
                        <div className="min-w-[500px] relative">
                            
                            {/* 
                                LAYER TOOLTIP: Sekarang nempel di kontainer bar.
                                Posisi bottom: 0 kontainer ini adalah baseline bar.
                            */}
                            {tooltipData && (
                                <div 
                                    className="absolute z-50 pointer-events-none transition-all duration-300 ease-out"
                                    style={{ 
                                        left: `${tooltipData.left}%`,
                                        bottom: `${tooltipData.barHeight}%`, // Start dari kepala bar
                                        marginBottom: '12px', // GAP tetap antara bar dan tooltip
                                        transform: `translateX(${tooltipData.hour < 3 ? '0%' : tooltipData.hour > 21 ? '-100%' : '-50%'})`
                                    }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-brand-dark/95 border border-brand-orange/50 px-3 py-1.5 rounded-xl shadow-neon-strong backdrop-blur-md flex items-center gap-2 whitespace-nowrap min-w-max">
                                            <span className="text-[11px] font-black text-brand-orange">{tooltipData.hour.toString().padStart(2, '0')}:00</span>
                                            <div className="w-px h-3 bg-white/20"></div>
                                            <span className="text-[11px] font-bold text-white">{tooltipData.count} Views</span>
                                        </div>
                                        {/* Caret / Panah */}
                                        <div 
                                            className={`w-2.5 h-2.5 bg-brand-dark border-r border-b border-brand-orange/40 rotate-45 -mt-1.5 shadow-neon ${
                                                tooltipData.hour < 3 ? 'mr-auto ml-3' : tooltipData.hour > 21 ? 'ml-auto mr-3' : ''
                                            }`}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {/* CONTAINER BAR */}
                            <div className="flex items-end gap-[2px] h-24 w-full relative z-10">
                                {hours.map((count, h) => {
                                    const intensity = count / maxVal;
                                    let bgClass = 'bg-white/5';
                                    if (count > 0) {
                                        if (intensity > 0.75) bgClass = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
                                        else if (intensity > 0.5) bgClass = 'bg-brand-orange shadow-[0_0_12px_rgba(255,95,31,0.25)]';
                                        else if (intensity > 0.25) bgClass = 'bg-yellow-500/80';
                                        else bgClass = 'bg-blue-500/80';
                                    }

                                    const isHovered = hoveredHour === h;

                                    return (
                                        <div 
                                            key={h} 
                                            className="flex-1 flex flex-col items-center group relative h-full justify-end min-w-[15px] cursor-pointer"
                                            onMouseEnter={() => setHoveredHour(h)}
                                            onMouseLeave={() => setHoveredHour(null)}
                                        >
                                            <div 
                                                className={`w-full rounded-sm ${bgClass} transition-all duration-300 min-h-[4px] relative z-10 ${isHovered ? 'brightness-150 scale-x-125 z-20' : ''}`} 
                                                style={{ height: `${Math.max(intensity * 100, 5)}%` }}
                                            ></div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* LABEL JAM */}
                            <div className="flex justify-between text-[9px] text-gray-600 mt-4 font-mono uppercase tracking-tighter px-1 border-t border-white/5 pt-2">
                                <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const RetentionChart = ({ newUsers, returningUsers }: { newUsers: number, returningUsers: number }) => {
    const total = newUsers + returningUsers;
    const returningPercent = total > 0 ? (returningUsers / total) * 100 : 0;

    return (
        <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6 flex flex-col h-full">
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <RefreshCw size={16} className="text-green-400"/> Radar Loyalitas
            </h4>
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-6"
                        style={{
                            background: `conic-gradient(#FF5F1F ${returningPercent}%, #222 0)`
                        }}>
                    <div className="absolute inset-3 bg-brand-dark rounded-full flex flex-col items-center justify-center border border-white/5">
                        <span className="text-2xl font-display font-black text-white">{total}</span>
                        <span className="text-[9px] text-gray-500 uppercase tracking-widest">Total Sesi</span>
                    </div>
                </div>
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="flex items-center gap-2 text-gray-400"><div className="w-2 h-2 rounded-full bg-brand-orange"></div> BALIK LAGI</span>
                        <span className="text-white">{Math.round(returningPercent)}%</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="flex items-center gap-2 text-gray-400"><div className="w-2 h-2 rounded-full bg-gray-700"></div> JURAGAN BARU</span>
                        <span className="text-white">{100 - Math.round(returningPercent)}%</span>
                    </div>
                </div>
            </div>
            <p className="text-[9px] text-gray-600 mt-6 text-center italic leading-relaxed">
                *Balik Lagi = Cookie deteksi user yang sama buka web &gt;1 kali.
            </p>
        </div>
    );
};
