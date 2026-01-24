import React from 'react';
import { Calendar, Activity, Flame } from 'lucide-react';

export const TrafficChart = ({ data, period }: { data: Record<string, number>, period: number }) => {
    const values = Object.values(data);
    const maxValue = Math.max(...values, 10); 
  
    return (
      <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80}/></div>
        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
            <Calendar size={16} className="text-brand-orange"/> Grafik Gentayangan ({period} Hari)
        </h4>
        
        <div className="bg-black/20 rounded-2xl p-4 border border-white/5 overflow-x-auto custom-scrollbar flex-1">
            <div className="min-w-[500px] h-64 flex items-end justify-between gap-2 pt-10 pb-2 relative">
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
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-all duration-150 z-50 pointer-events-none">
                                    <div className="bg-brand-orange text-white text-[10px] font-black px-2 py-1 rounded shadow-neon whitespace-nowrap">
                                        {count} Hits
                                    </div>
                                    <div className="w-1.5 h-1.5 bg-brand-orange rotate-45 mx-auto -mt-1"></div>
                                </div>

                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-700 relative ${
                                        isZero 
                                        ? 'bg-white/5' 
                                        : 'bg-gradient-to-t from-brand-orange/20 to-brand-orange border-t border-brand-orange shadow-neon'
                                    }`}
                                    style={{ height: barHeight }}
                                ></div>
                            </div>

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
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 relative overflow-hidden h-full flex flex-col shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Flame size={80} /></div>
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <Flame size={16} className="text-red-500"/> Jam Sibuk Pasar (WIB)
            </h4>
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 overflow-x-auto custom-scrollbar-hide flex-1">
                <div className="min-w-[500px] flex items-end gap-1.5 h-full pt-10">
                    {hours.map((count, h) => {
                        const intensity = count / maxVal;
                        return (
                            <div 
                                key={h} 
                                className="flex-1 rounded-t-md group relative transition-all duration-500"
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
            <p className="text-[9px] text-gray-700 mt-8 text-center italic uppercase tracking-widest font-bold">Waktu Lokal Browser (Local Browser Time)</p>
        </div>
    );
};

export const RetentionChart = ({ newUsers, returningUsers }: { newUsers: number, returningUsers: number }) => {
    return null; 
};