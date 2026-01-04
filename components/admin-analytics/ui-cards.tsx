
import React from 'react';
import { Eye, Users, MousePointer, TrendingUp, Smartphone, Monitor, Tablet, Globe } from 'lucide-react';
import { AnalyticsStats } from './types';

// --- ATOM: Stat Card ---
export const StatCard = ({ label, value, sub, icon: Icon, color }: { label: string, value: string | number, sub?: string, icon: any, color: string }) => (
  <div className="bg-brand-card border border-white/5 p-5 rounded-xl flex items-center justify-between hover:border-brand-orange/30 transition-all group relative overflow-hidden">
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-5 ${color.replace('text-', 'bg-')}`}></div>
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
         {label}
      </p>
      <h3 className="text-3xl font-display font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
      {sub && <p className="text-[10px] text-gray-400 mt-1">{sub}</p>}
    </div>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 ${color} border border-white/5 shadow-lg`}>
      <Icon size={24} />
    </div>
  </div>
);

// --- MOLECULE: KPI Grid ---
export const KPIGrid = ({ stats }: { stats: AnalyticsStats }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Views" value={stats.totalViews} sub="Halaman dilihat" icon={Eye} color="text-blue-500" />
        <StatCard label="Unik Visitor" value={stats.uniqueVisitors} sub="Orang berbeda" icon={Users} color="text-purple-500" />
        <StatCard label="Total Aksi" value={stats.totalActions} sub="Klik WA / Tombol" icon={MousePointer} color="text-green-500" />
        <StatCard label="Konversi" value={`${stats.conversionRate}%`} sub="View to Action" icon={TrendingUp} color="text-brand-orange" />
    </div>
);

// --- MOLECULE: Device Stats ---
export const DeviceStats = ({ devices, totalViews }: { devices: AnalyticsStats['devices'], totalViews: number }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-6 flex flex-col">
        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
            <Smartphone size={16} className="text-brand-orange"/> Device User
        </h4>
        <div className="flex-grow space-y-4">
            <DeviceBar label="Mobile" count={devices.mobile} total={totalViews} icon={Smartphone} color="bg-brand-orange" />
            <DeviceBar label="Desktop" count={devices.desktop} total={totalViews} icon={Monitor} color="bg-blue-500" />
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
            <div className={`${color} h-full`} style={{ width: `${total > 0 ? (count / total) * 100 : 0}%` }}></div>
        </div>
    </div>
);

// --- MOLECULE: Referrer List ---
export const ReferrerList = ({ referrers }: { referrers: [string, number][] }) => (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-6">
        <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
            <Globe size={16} className="text-blue-400"/> Sumber Trafik (Top 5)
        </h4>
        <div className="space-y-2">
            {referrers.map(([ref, count], idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5">
                    <span className="text-gray-300 truncate max-w-[150px]">{ref}</span>
                    <span className="font-bold text-white">{count}</span>
                </div>
            ))}
            {referrers.length === 0 && <p className="text-[10px] text-gray-500 italic">Belum ada data referer.</p>}
        </div>
    </div>
);
