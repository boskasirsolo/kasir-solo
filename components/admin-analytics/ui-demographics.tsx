
import React from 'react';
import { MapPin, Monitor, Users, Shield, Target } from 'lucide-react';

export const CityDistribution = ({ cities, total }: { cities: [string, number][], total: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 shadow-xl h-full">
        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
            <MapPin size={16} className="text-brand-orange"/> Peta Kandang (Kota Asal)
        </h4>
        <div className="space-y-4">
            {cities.map(([city, count], idx) => {
                const percent = Math.round((count / total) * 100);
                return (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                            <span className="text-gray-300 font-bold group-hover:text-brand-orange transition-colors">{city}</span>
                            <span className="text-gray-500 font-mono">{count} Juragan</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                            <div className="bg-brand-orange h-full rounded-full transition-all duration-1000 shadow-neon" style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export const OSDistribution = ({ data }: { data: Record<string, number> }) => {
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    return (
        <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 shadow-xl">
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <Monitor size={16} className="text-blue-400"/> Sistem Operasi (OS)
            </h4>
            <div className="grid grid-cols-2 gap-4">
                {Object.entries(data).map(([os, count], idx) => {
                    const percent = Math.round((count / total) * 100);
                    return (
                        <div key={idx} className="bg-black/20 p-3 rounded-xl border border-white/5">
                            <p className="text-[10px] text-gray-500 font-black uppercase mb-1">{os}</p>
                            <div className="flex justify-between items-end">
                                <h3 className="text-xl font-bold text-white leading-none">{percent}%</h3>
                                <span className="text-[9px] text-gray-600 font-mono">{count} Hits</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const DemographicEstimator = ({ data }: { data: any }) => (
    <div className="bg-brand-dark border border-white/5 rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-start mb-8">
            <div>
                <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Users size={16} className="text-purple-400"/> SIBOS Demo-Estimator
                </h4>
                <p className="text-[10px] text-gray-500 mt-1 italic">Prediksi profil berdasarkan pattern kunjung.</p>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg"><Shield size={14} className="text-purple-400"/></div>
        </div>

        <div className="space-y-8">
            {/* GENDER */}
            <div>
                <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest">
                    <span className="text-blue-400">Pria ({data.gender.male})</span>
                    <span className="text-pink-400">Wanita ({data.gender.female})</span>
                </div>
                <div className="w-full h-3 bg-black rounded-full overflow-hidden flex border border-white/10 shadow-inner">
                    <div className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${(data.gender.male / (data.gender.male + data.gender.female)) * 100}%` }}></div>
                    <div className="bg-pink-500 h-full transition-all duration-1000 shadow-[0_0_10px_rgba(236,72,153,0.5)]" style={{ width: `${(data.gender.female / (data.gender.male + data.gender.female)) * 100}%` }}></div>
                </div>
            </div>

            {/* AGE BRACKETS */}
            <div className="grid grid-cols-4 gap-2">
                {Object.entries(data.age).map(([range, count]: [string, any], i) => (
                    <div key={i} className="text-center">
                        <div className="h-16 bg-white/5 rounded-t-lg relative flex items-end justify-center overflow-hidden border-x border-t border-white/5">
                            <div className="bg-purple-500 w-full transition-all duration-1000" style={{ height: `${Math.min((count / data.gender.male) * 100, 100)}%`, opacity: 0.6 }}></div>
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">{count}</span>
                        </div>
                        <p className="text-[9px] font-black text-gray-500 mt-2 uppercase">{range}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
);
