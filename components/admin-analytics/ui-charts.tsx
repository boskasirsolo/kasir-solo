
import React from 'react';
import { Calendar, Clock, Activity, RefreshCw } from 'lucide-react';

// --- CHART 1: Traffic Bar Chart ---
export const TrafficChart = ({ data, period }: { data: Record<string, number>, period: number }) => {
    const values = Object.values(data);
    const maxValue = Math.max(...values, 5); 
  
    return (
      <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-4 md:p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80}/></div>
        <h4 className="text-white font-bold text-sm mb-4 md:mb-6 flex items-center gap-2">
            <Calendar size={16} className="text-brand-orange"/> Tren Kunjungan ({period} Hari)
        </h4>
        
        <div className="bg-black/20 rounded-xl p-2 md:p-4 border border-white/5 overflow-x-auto custom-scrollbar">
            {/* Scrollable Container with Min Width to prevent squishing */}
            <div className="min-w-[500px] h-64 flex items-end justify-between gap-2 pt-10 pb-2 relative">
                {/* Background Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
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
                                {count} View
                            </div>
                            <div className="w-full px-0.5 md:px-1 h-full flex items-end relative">
                                <div 
                                    className={`w-full rounded-t-sm transition-all duration-500 relative ${
                                        isZero 
                                        ? 'bg-white/5 h-[4px]' 
                                        : 'bg-gradient-to-t from-brand-orange/20 to-brand-orange border-t border-brand-orange group-hover:bg-brand-orange/40 shadow-[0_0_10px_rgba(255,95,31,0.2)]'
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

// --- CHART 2: Peak Hours Heatmap ---
export const PeakHoursHeatmap = ({ hours }: { hours: number[] }) => {
    const maxVal = Math.max(...hours, 1);
    
    return (
        <div className="mt-6 pt-6 border-t border-white/5">
            <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                <Clock size={14} className="text-yellow-500"/> Jam Sibuk (Waktu Server)
            </h4>
            <p className="text-[10px] text-gray-500 mb-2">Semakin tinggi bar, semakin ramai.</p>
            
            <div className="relative overflow-x-auto custom-scrollbar pb-2">
                {/* Scrollable Container */}
                <div className="min-w-[500px]">
                    <div className="flex items-end gap-[2px] h-24 mt-4 w-full">
                        {hours.map((count, h) => {
                            const intensity = count / maxVal;
                            let bgClass = 'bg-white/5';
                            if (count > 0) {
                                if (intensity > 0.75) bgClass = 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]';
                                else if (intensity > 0.5) bgClass = 'bg-brand-orange shadow-[0_0_5px_rgba(255,95,31,0.5)]';
                                else if (intensity > 0.25) bgClass = 'bg-yellow-500';
                                else bgClass = 'bg-blue-500';
                            }

                            return (
                                <div key={h} className="flex-1 flex flex-col items-center group relative h-full justify-end min-w-[15px]">
                                    <div 
                                        className={`w-full rounded-sm ${bgClass} transition-all hover:opacity-80 min-h-[4px]`} 
                                        style={{ height: `${Math.max(intensity * 100, 5)}%` }}
                                    ></div>
                                    <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black/90 text-white text-[9px] px-2 py-1 rounded z-20 border border-white/10 whitespace-nowrap -translate-x-1/2 left-1/2">
                                        <span className="font-bold text-brand-orange">{h}:00</span> • {count} view
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flex justify-between text-[8px] text-gray-500 mt-1 font-mono uppercase">
                        <span>00:00</span>
                        <span>06:00</span>
                        <span>12:00</span>
                        <span>18:00</span>
                        <span>23:00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CHART 3: Retention Donut ---
export const RetentionChart = ({ newUsers, returningUsers }: { newUsers: number, returningUsers: number }) => {
    const total = newUsers + returningUsers;
    const newPercent = total > 0 ? (newUsers / total) * 100 : 0;
    const returningPercent = total > 0 ? (returningUsers / total) * 100 : 0;

    return (
        <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6">
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <RefreshCw size={16} className="text-green-400"/> User Retention
            </h4>
            <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg shrink-0"
                        style={{
                            background: `conic-gradient(#FF5F1F ${returningPercent}%, #333 0)`
                        }}>
                    <div className="absolute inset-2 bg-brand-dark rounded-full flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white">{total}</span>
                        <span className="text-[10px] text-gray-500 uppercase">Users</span>
                    </div>
                </div>
                <div className="space-y-3 flex-1 w-full">
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-orange"></div> Returning</span>
                            <span className="text-white font-bold">{Math.round(returningPercent)}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-orange h-full" style={{ width: `${returningPercent}%` }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-gray-600"></div> New Visitor</span>
                            <span className="text-white font-bold">{Math.round(newPercent)}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-gray-600 h-full" style={{ width: `${newPercent}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-6 text-center italic">
                *Returning = Pengunjung &gt;1 kali.
            </p>
        </div>
    );
};
