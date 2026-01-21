
import React, { useState, useRef } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{ x: number, y: number, hour: number, count: number, visible: boolean }>({
        x: 0, y: 0, hour: 0, count: 0, visible: false
    });

    const handleMouseMove = (e: React.MouseEvent, h: number, count: number) => {
        if (!containerRef.current) return;
        
        // Get relative position within container
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setTooltip({
            x,
            y,
            hour: h,
            count,
            visible: true
        });
    };

    return (
        <div className="mt-6 pt-6 border-t border-white/5 relative">
            <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                <Flame size={14} className="text-red-500"/> Jam Sibuk Pasar (WIB)
            </h4>
            <p className="text-[10px] text-gray-500 mb-6">Arahkan kursor buat liat detail jam gentayangan juragan.</p>
            
            <div 
                ref={containerRef}
                className="relative bg-black/20 rounded-2xl p-4 border border-white/5 overflow-hidden group/container"
                onMouseLeave={() => setTooltip(prev => ({ ...prev, visible: false }))}
            >
                {/* FLOATING DYNAMIC TOOLTIP */}
                {tooltip.visible && (
                    <div 
                        className="absolute pointer-events-none z-[100] transition-transform duration-75 ease-out"
                        style={{ 
                            left: `${tooltip.x}px`, 
                            top: `${tooltip.y}px`,
                            transform: `translate(${tooltip.x > 350 ? '-110%' : '10%'}, -110%)` 
                        }}
                    >
                        <div className="bg-brand-dark/95 backdrop-blur-md border border-brand-orange/50 px-3 py-2 rounded-xl shadow-neon flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse"></div>
                            <div className="text-left">
                                <p className="text-white font-bold text-[11px] leading-none">Jam {tooltip.hour.toString().padStart(2, '0')}:00</p>
                                <p className="text-brand-orange font-black text-[10px] mt-1">{tooltip.count} Views</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto custom-scrollbar-hide pb-2">
                    <div className="min-w-[500px]">
                        <div className="flex items-end gap-[2px] h-24 w-full">
                            {hours.map((count, h) => {
                                const intensity = count / maxVal;
                                let bgClass = 'bg-white/5';
                                if (count > 0) {
                                    if (intensity > 0.75) bgClass = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
                                    else if (intensity > 0.5) bgClass = 'bg-brand-orange shadow-[0_0_12px_rgba(255,95,31,0.3)]';
                                    else if (intensity > 0.25) bgClass = 'bg-yellow-500/80';
                                    else bgClass = 'bg-blue-500/80';
                                }

                                return (
                                    <div 
                                        key={h} 
                                        className="flex-1 flex flex-col items-center group relative h-full justify-end min-w-[15px]"
                                        onMouseMove={(e) => handleMouseMove(e, h, count)}
                                        onMouseEnter={(e) => handleMouseMove(e, h, count)}
                                    >
                                        <div 
                                            className={`w-full rounded-sm ${bgClass} transition-all duration-500 min-h-[4px] relative z-10 group-hover:brightness-125 group-hover:scale-x-110`} 
                                            style={{ height: `${Math.max(intensity * 100, 5)}%` }}
                                        ></div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="flex justify-between text-[8px] text-gray-600 mt-3 font-mono uppercase tracking-tighter px-1">
                            <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>23:00</span>
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
