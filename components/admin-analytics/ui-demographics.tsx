import React from 'react';
import { MapPin, Monitor, Users, Shield, Target, Award, UserCheck, Smartphone, Tablet, Cpu, Globe } from 'lucide-react';

export const CityDistribution = ({ cities, total }: { cities: [string, number][], total: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden min-h-[520px]">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><MapPin size={80}/></div>
        <h4 className="text-white font-black text-sm mb-8 flex items-center gap-3 uppercase tracking-widest relative z-10">
            <MapPin size={18} className="text-brand-orange animate-pulse"/> Peta Kandang (Kota Asal)
        </h4>
        <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 relative z-10">
            {cities.map(([locationLabel, count], idx) => {
                const percent = Math.round((count / total) * 100);
                
                // Parsing format "Kota, Negara"
                const [city, country] = locationLabel.includes(', ') 
                    ? locationLabel.split(', ') 
                    : [locationLabel, ''];

                return (
                    <div key={idx} className="group">
                        <div className="flex justify-between items-start text-xs mb-2">
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    {idx === 0 ? <Award size={12} className="text-yellow-500" /> : <span className="text-[9px] font-mono text-gray-600">{idx + 1}.</span>}
                                    <span className={`font-bold transition-colors ${idx === 0 ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                        {city === 'Unknown' ? 'Radar Terbatas' : city}
                                    </span>
                                </div>
                                {country && (
                                    <div className="flex items-center gap-1.5 ml-5 text-[8px] font-black text-gray-600 uppercase tracking-widest">
                                        <Globe size={8} /> {country}
                                    </div>
                                )}
                            </div>
                            <span className="text-[10px] text-gray-500 font-mono font-bold shrink-0">{count} Hits</span>
                        </div>
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5 shadow-inner">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-brand-orange shadow-neon' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-purple-500' : 'bg-gray-700'}`} 
                                style={{ width: `${percent}%` }}
                            ></div>
                        </div>
                    </div>
                );
            })}
            {cities.length === 0 && <p className="text-center py-10 text-gray-600 italic text-xs">Belum ada jejak kota...</p>}
        </div>
        <p className="text-[9px] text-gray-700 mt-6 font-bold uppercase tracking-widest text-center italic">Audit IP Geolocation Berhasil</p>
    </div>
);

export const TechIntelligence = ({ 
    devices, 
    osData, 
    totalViews 
}: { 
    devices: { mobile: number, desktop: number, tablet: number }, 
    osData: Record<string, number>,
    totalViews: number 
}) => {
    const totalOS = Object.values(osData).reduce((a, b) => a + b, 0);
    const getOSColor = (os: string) => {
        if (os.includes('Android')) return 'text-green-400 border-green-500/20 bg-green-500/10';
        if (os.includes('Windows')) return 'text-blue-400 border-blue-500/20 bg-blue-500/10';
        if (os.includes('iOS') || os.includes('Mac')) return 'text-white border-white/20 bg-white/10';
        return 'text-gray-400 border-white/10 bg-white/5';
    };

    const osEntries = Object.entries(osData).sort(([a], [b]) => {
        if (a === 'Lainnya') return 1;
        if (b === 'Lainnya') return -1;
        return 0;
    });

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden min-h-[520px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><Cpu size={80}/></div>
            
            <h4 className="text-white font-black text-sm mb-8 flex items-center gap-3 uppercase tracking-widest relative z-10">
                <Cpu size={18} className="text-blue-400"/> Teknologi Juragan
            </h4>

            <div className="space-y-8 flex-1 relative z-10">
                <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Smartphone size={12}/> Hardware Stats
                    </p>
                    <div className="space-y-4">
                        <DeviceBar label="HP (Mobile)" count={devices.mobile} total={totalViews} icon={Smartphone} color="bg-brand-orange" />
                        <DeviceBar label="PC (Desktop)" count={devices.desktop} total={totalViews} icon={Monitor} color="bg-blue-500" />
                        <DeviceBar label="Tablet" count={devices.tablet} total={totalViews} icon={Tablet} color="bg-purple-500" />
                    </div>
                </div>

                <div className="h-px bg-white/5"></div>

                <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Monitor size={12}/> Amunisi Gadget (OS)
                    </p>
                    <div className="grid grid-cols-2 gap-2.5">
                        {osEntries.slice(0, 4).map(([os, count], idx) => {
                            const percent = totalOS > 0 ? Math.round((count / totalOS) * 100) : 0;
                            return (
                                <div key={idx} className={`p-2.5 rounded-2xl border transition-all hover:scale-[1.02] ${getOSColor(os)}`}>
                                    <p className="text-[8px] font-black uppercase mb-1 tracking-tighter opacity-70 truncate">{os}</p>
                                    <div className="flex justify-between items-end">
                                        <h3 className="text-lg font-display font-black leading-none">{percent}%</h3>
                                        <span className="text-[7px] font-mono opacity-50">{count}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <p className="text-[9px] text-gray-700 mt-6 font-bold uppercase tracking-widest text-center italic">Metadata Browser Captured</p>
        </div>
    );
};

const DeviceBar = ({ label, count, total, icon: Icon, color }: any) => {
    const percent = total > 0 ? Math.round((count / total) * 100) : 0;
    return (
        <div className="group">
            <div className="flex justify-between items-center text-[10px] font-black uppercase mb-1.5 tracking-wider">
                <span className="text-gray-500 flex items-center gap-2 group-hover:text-white transition-colors"><Icon size={14}/> {label}</span>
                <span className="text-white font-mono">{percent}%</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                <div className={`${color} h-full transition-all duration-1000 shadow-neon`} style={{ width: `${percent}%` }}></div>
            </div>
        </div>
    );
};

export const DemographicEstimator = ({ data }: { data: any }) => {
    const totalGender = data.gender.male + data.gender.female;
    const malePercent = totalGender > 0 ? (data.gender.male / totalGender) * 100 : 0;
    const femalePercent = totalGender > 0 ? (data.gender.female / totalGender) * 100 : 0;

    return (
        <div className="bg-brand-dark border border-white/5 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden min-h-[520px]">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><UserCheck size={80}/></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h4 className="text-white font-black text-sm flex items-center gap-3 uppercase tracking-widest">
                        <Users size={18} className="text-purple-500 animate-pulse"/> Profiling Juragan
                    </h4>
                    <p className="text-[10px] text-gray-500 mt-1 italic font-bold uppercase tracking-tighter">AI-Driven Behavior Guess</p>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 shadow-neon-text/5"><Shield size={14} className="text-purple-400"/></div>
            </div>

            <div className="space-y-8 flex-1 relative z-10 flex flex-col justify-center">
                <div>
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-[0.2em]">
                        <span className="text-blue-400">Pria ({Math.round(malePercent)}%)</span>
                        <span className="text-pink-400">Wanita ({Math.round(femalePercent)}%)</span>
                    </div>
                    <div className="w-full h-8 bg-black rounded-2xl overflow-hidden flex border border-white/5 shadow-inner p-1">
                        <div className="bg-blue-500 h-full rounded-l-xl transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.4)]" style={{ width: `${malePercent}%` }}></div>
                        <div className="bg-pink-500 h-full rounded-r-xl transition-all duration-1000 shadow-[0_0_15px_rgba(236,72,153,0.4)]" style={{ width: `${femalePercent}%` }}></div>
                    </div>
                </div>

                <div>
                    <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Target size={12}/> Estimasi Rentang Usia
                    </h5>
                    <div className="grid grid-cols-4 gap-3 items-end h-36">
                        {Object.entries(data.age).map(([range, count]: [string, any], i) => {
                            const maxAgeCount = Math.max(...Object.values(data.age) as number[], 1);
                            const heightPercent = (count / maxAgeCount) * 100;
                            
                            return (
                                <div key={i} className="flex flex-col items-center h-full group">
                                    <div className="flex-1 w-full bg-white/5 rounded-2xl relative flex items-end justify-center overflow-hidden border border-white/5 transition-all group-hover:bg-white/10 shadow-inner">
                                        <div 
                                            className="bg-brand-orange w-full transition-all duration-1000 shadow-neon opacity-60 group-hover:opacity-100" 
                                            style={{ height: `${Math.max(heightPercent, 10)}%` }}
                                        ></div>
                                        <span className="absolute bottom-2 inset-x-0 flex items-center justify-center text-[10px] font-mono font-black text-white group-hover:scale-110 transition-transform">
                                            {count}
                                        </span>
                                    </div>
                                    <p className="text-[9px] font-black text-gray-600 mt-2 uppercase tracking-tighter group-hover:text-brand-orange transition-colors">{range}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            <div className="mt-4 p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl shadow-inner">
                 <p className="text-[11px] text-gray-400 leading-relaxed italic text-center font-medium">
                    Data adalah **Prediksi Estimasi** berdasarkan pola interaksi dan metadata browser. Akurasi tinggi.
                 </p>
            </div>
        </div>
    );
};