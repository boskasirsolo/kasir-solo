
import React from 'react';
import { Eye, Users, MousePointer, TrendingUp, Smartphone, Monitor, Tablet, Globe, Clock, Zap } from 'lucide-react';
import { AnalyticsStats } from './types';

export const StatCard = ({ label, value, sub, icon: Icon, color }: { label: string, value: string | number, sub?: string, icon: any, color: string }) => (
  <div className="bg-brand-card border border-white/5 p-4 md:p-5 rounded-xl flex flex-col justify-between hover:border-brand-orange/30 transition-all group relative overflow-hidden h-full">
    <div className={`absolute -right-6 -top-6 w-20 h-20 md:w-24 md:h-24 rounded-full opacity-5 ${color.replace('text-', 'bg-')}`}></div>
    <div className="flex justify-between items-start mb-2">
       <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center bg-white/5 ${color} border border-white/5 shadow-lg shrink-0`}>
          <Icon size={18} />
       </div>
    </div>
    <div>
      <h3 className="text-xl md:text-3xl font-display font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
      <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1 truncate">{label}</p>
      {sub && <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 md:mt-1 truncate">{sub}</p>}
    </div>
  </div>
);

export const KPIGrid = ({ stats }: { stats: AnalyticsStats }) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard label="Total Radar" value={stats.totalViews} sub="Page hits" icon={Eye} color="text-blue-500" />
        <StatCard label="Juragan Unik" value={stats.uniqueVisitors} sub="Unique Visitors" icon={Users} color="text-purple-500" />
        <StatCard label="Napsu Beli" value={`${stats.conversionRate}%`} sub="Conversion Rate" icon={TrendingUp} color="text-brand-orange" />
        <StatCard label="Durasi Betah" value={stats.avgEngagementTime} sub="Avg. Engagement" icon={Clock} color="text-green-500" />
    </div>
);

export const DeviceStats = ({ devices, totalViews }: { devices: AnalyticsStats['devices'], totalViews: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-5 md:p-6 flex flex-col">
        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
            <Smartphone size={16} className="text-brand-orange"/> Perangkat Juragan
        </h4>
        <div className="flex-grow space-y-4">
            <DeviceBar label="HP (Mobile)" count={devices.mobile} total={totalViews} icon={Smartphone} color="bg-brand-orange" />
            <DeviceBar label="PC (Desktop)" count={devices.desktop} total={totalViews} icon={Monitor} color="bg-blue-500" />
            <DeviceBar label="Tablet" count={devices.tablet} total={totalViews} icon={Tablet} color="bg-purple-500" />
        </div>
    </div>
);

const DeviceBar = ({ label, count, total, icon: Icon, color }: any) => (
    <div>
        <div className="flex justify-between items-center text-xs mb-1">
            <span className="text-gray-400 flex items-center gap-2"><Icon size={14}/> {label}</span>
            <span className="text-white font-bold">{count}</span>
        </div>
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div className={`${color} h-full transition-all duration-1000`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}></div>
        </div>
    </div>
);

export const ReferrerList = ({ referrers, totalViews }: { referrers: [string, number][], totalViews: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-2xl p-4 md:p-6 flex flex-col h-full shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5"><Globe size={100} /></div>
        
        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2 relative z-10">
            <Globe size={16} className="text-blue-400"/> Pintu Masuk
        </h4>
        
        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1 relative z-10">
            {referrers.map(([ref, count], idx) => {
                const percent = totalViews > 0 ? ((count / totalViews) * 100).toFixed(1) : "0";
                return (
                    <div key={idx} className="flex flex-col p-2 bg-white/[0.02] rounded-lg border border-white/5 hover:border-blue-500/30 transition-all group">
                        <div className="flex justify-between items-center mb-1">
                             <span className="text-[10px] text-gray-400 truncate font-bold group-hover:text-white transition-colors">{ref}</span>
                             <span className="text-[10px] font-bold text-white font-mono">{count}</span>
                        </div>
                        <div className="w-full bg-black/40 h-[2px] rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
                        </div>
                    </div>
                );
            })}
            {referrers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-20">
                    <p className="text-[10px] italic">No data.</p>
                </div>
            )}
        </div>
    </div>
);
