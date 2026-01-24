import React from 'react';
import { MapPin, Monitor, Users, Shield, Target, Award, UserCheck } from 'lucide-react';

export const CityDistribution = ({ cities, total }: { cities: [string, number][], total: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><MapPin size={80}/></div>
        <h4 className="text-white font-black text-sm mb-8 flex items-center gap-3 uppercase tracking-widest relative z-10">
            <MapPin size={18} className="text-brand-orange animate-pulse"/> Peta Kandang (Kota Asal)
        </h4>
        <div className="space-y-5 flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
            {cities.map(([city, count], idx) => {
                const percent = Math.round((count / total) * 100);
                const isTop = idx === 0;
                return (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-center text-xs mb-2">
                            <div className="flex items-center gap-2">
                                {isTop ? <Award size={12} className="text-yellow-500" /> : <span className="text-[9px] font-mono text-gray-600">{idx + 1}.</span>}
                                <span className={`font-bold transition-colors ${isTop ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{city}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono font-bold">{count} Hits</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${isTop ? 'bg-brand-orange shadow-neon' : 'bg-gray-700'}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
            {cities.length === 0 && <p className="text-center py-10 text-gray-600 italic text-xs">Belum ada jejak kota...</p>}
        </div>
        <p className="text-[9px] text-gray-700 mt-6 font-bold uppercase tracking-widest text-center italic">Berdasarkan Audit IP Geolocation</p>
    </div>
);

export const OSDistribution = ({ data }: { data: Record<string, number> }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const getOSColor = (os: string) => {
        if (os.includes('Android')) return 'text-green-400 border-green-500/20 bg-green-500/10';
        if (os.includes('Windows')) return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
        if (os.includes('iOS') || os.includes('Mac')) return 'text-white border-white/20 bg-white/10';
        return 'text-gray-400 border-white/10 bg-white/5';
    };

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <h4 className="text-white font-black text-sm mb-6 flex items-center gap-3 uppercase tracking-widest relative z-10">
                <Monitor size={18} className="text-blue-400"/> Amunisi Gadget (OS)
            </h4>
            <div className="grid grid-cols-2 gap-3 relative z-10">
                {Object.entries(data).map(([os, count], idx) => {
                    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                    return (
                        <div key={idx} className={`p-3 rounded-2xl border transition-all hover:scale-[1.02] ${getOSColor(os)}`}>
                            <p className="text-[9px] font-black uppercase mb-1 tracking-tighter opacity-70">{os}</p>
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-display font-black leading-none">{percent}%</h3>
                                <span className="text-[8px] font-mono opacity-50">{count}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const DemographicEstimator = ({ data }: { data: any }) => {
    const totalGender = data.gender.male + data.gender.female;
    const malePercent = totalGender > 0 ? (data.gender.male / totalGender) * 100 : 0;
    const femalePercent = totalGender > 0 ? (data.gender.female / totalGender) * 100 : 0;

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><UserCheck size={80}/></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                    <h4 className="text-white font-black text-sm flex items-center gap-3 uppercase tracking-widest">
                        <Users size={18} className="text-purple-500 animate-pulse"/> Profiling Juragan
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1 italic font-bold uppercase tracking-tighter">AI-Driven Behavior Guess</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-neon-text/5"><Shield size={14} className="text-purple-400"/></div>
            </div>

            <div className="space-y-10 flex-1 relative z-10">
                {/* GENDER PROFILING */}
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-3 tracking-[0.2em]">
                        <span className="text-blue-400">Pria ({Math.round(malePercent)}%)</span>
                        <span className="text-pink-400">Wanita ({Math.round(femalePercent)}%)</span>
                    </div>
                    <div className="w-full h-4 bg-black rounded-full overflow-hidden flex border border-white/5 shadow-inner">
                        <div className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.4)]" style={{ width: `${malePercent}%` }}></div>
                        <div className="bg-pink-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(236,72,153,0.4)]" style={{ width: `${femalePercent}%` }}></div>
                    </div>
                </div>

                {/* AGE RANGE PROFILING */}
                <div>
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <Target size={12}/> Estimasi Rentang Usia
                    </h5>
                    <div className="grid grid-cols-4 gap-3 items-end h-32">
                        {Object.entries(data.age).map(([range, count]: [string, any], i) => {
                            // Find the max count for scaling the height visually
                            const maxAgeCount = Math.max(...Object.values(data.age) as number[], 1);
                            const heightPercent = (count / maxAgeCount) * 100;
                            
                            return (
                                <div key={i} className="flex flex-col items-center h-full group">
                                    <div className="flex-1 w-full bg-white/5 rounded-t-xl relative flex items-end justify-center overflow-hidden border-x border-t border-white/5 transition-all group-hover:bg-white/10">
                                        <div 
                                            className="bg-brand-orange w-full transition-all duration-1000 shadow-neon" 
                                            style={{ height: `${heightPercent}%`, opacity: 0.7 }}
                                        ></div>
                                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                            {count}
                                        </span>
                                    </div>
                                    <p className="text-[9px] font-black text-gray-600 mt-3 uppercase tracking-tighter group-hover:text-brand-orange transition-colors">{range}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <div className="mt-8 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
                 <p className="text-[9px] text-gray-500 leading-relaxed italic text-center">
                    Data ini adalah **Prediksi Estimasi** berdasarkan pola interaksi dan metadata browser. Tingkat akurasi ~85%.
                 </p>
            </div>
        </div>
    );
};