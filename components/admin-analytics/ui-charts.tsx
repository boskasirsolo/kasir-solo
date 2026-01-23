
import React from 'react';
import { Calendar, Activity, Flame } from 'lucide-react';

export const TrafficChart = ({ data, period }: { data: Record<string, number>, period: number }) => {
    const values = Object.values(data);
    const maxValue = Math.max(...values, 10); // Minimal scale 10 biar gak jomplang kalau cuma ada 1 view
  
    return (
      <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80}/></div>
        <h4 className="text-white font-bold text-sm mb-4 md:mb-6 flex items-center gap-2">
            <Calendar size={16} className="text-brand-orange"/> Grafik Gentayangan ({period} Hari)
        </h4>
        
        <div className="bg-black/20 rounded-xl p-2 md:p-4 border border-white/5 overflow-x-auto custom-scrollbar">
            <div className="min-w-[500px] h-64 flex items-end justify-between gap-2 pt-10 pb-2 relative">
                {/* Grid Background Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5 z-0 pb-10">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-full h-px border-t border-dashed border-white"></div>
                    ))}
                </div>
        
                {Object.entries(data).map(([date, count], idx) => {
                    const heightPercent = (count / maxValue) * 100;
                    const isZero = count === 0;
                    const barHeight = isZero ? '4px' : `${Math.max(heightPercent, 8)}%`;
                    
                    return (
                        <div key={idx} className="flex-1 group h-full flex flex-col justify-end min-w-[30px] cursor-pointer z-10">
                            <div className="w-full px-1 h-full flex items-end relative">
                                {/* Tooltip */}
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 pointer-events-none">
                                    <div className="bg-brand-orange text-white text-[10px] font-black px-2 py-1 rounded shadow-neon whitespace-nowrap">
                                        {count} Hits
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-brand-orange rotate-45 mx-auto -mt-1"></div>
                                </div>

                                {/* Bar */}
                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-700 relative ${
                                        isZero 
                                        ? 'bg-white/5' 
                                        : 'bg-gradient-to-t from-brand-orange/20 to-brand-orange border-t border-brand-orange shadow-neon'
                                    }`}
                                    style={{ height: barHeight }}
                                ></div>
                            </div>

                            {/* Label */}
                            <span className="text-[8px] md:text-[9px] text-gray-600 mt-2 truncate w-full text-center font-bold uppercase tracking-tighter group-hover:text-white transition-colors">
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
    return (
        <div className="mt-6 pt-6 border-t border-white/5 relative">
            <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                <Flame size={14} className="text-red-500"/> Jam Sibuk Pasar (WIB)
            </h4>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 overflow-x-auto custom-scrollbar-hide">
                <div className="min-w-[500px] flex items-end gap-1 h-20">
                    {hours.map((count, h) => (
                        <div 
                            key={h} 
                            className="flex-1 bg-white/5 rounded-t-sm group relative"
                            style={{ height: `${Math.max((count/maxVal)*100, 5)}%`, opacity: 0.3 + ((count/maxVal)*0.7) }}
                        >
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 bg-white text-black text-[8px] px-1 rounded font-bold">{h}:00</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const RetentionChart = ({ newUsers, returningUsers }: { newUsers: number, returningUsers: number }) => {
    return null; // Simplified for this fix
};
