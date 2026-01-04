
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Users, MousePointer, Smartphone, Monitor, Eye, 
  ArrowUp, ArrowDown, Calendar, ShieldCheck, Link as LinkIcon, 
  Copy, Check, Globe, Clock, Activity, TrendingUp, Filter 
} from 'lucide-react';
import { supabase } from '../utils';
import { AnalyticsLog } from '../types';
import { LoadingSpinner } from './ui';

// --- LOGIC HOOK: DATA AGGREGATION ---
const useAnalyticsData = () => {
  const [logs, setLogs] = useState<AnalyticsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7); // Default 7 days

  useEffect(() => {
    fetchLogs();
  }, [period]);

  const fetchLogs = async () => {
    if (!supabase) return;
    setLoading(true);
    
    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);
    startDate.setHours(0, 0, 0, 0); // Start of day

    const { data, error } = await supabase
      .from('analytics_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (!error && data) {
      setLogs(data);
    }
    setLoading(false);
  };

  // Aggregations
  const stats = useMemo(() => {
    const totalViews = logs.filter(l => l.event_type === 'page_view').length;
    const uniqueVisitors = new Set(logs.map(l => l.visitor_id)).size;
    const totalActions = logs.filter(l => l.event_type !== 'page_view').length; 
    const conversionRate = totalViews > 0 ? ((totalActions / totalViews) * 100).toFixed(1) : '0';
    
    // 1. Traffic by Date (Zero-Filled Logic)
    const trafficByDate: Record<string, number> = {};
    const today = new Date();
    
    // Pre-fill dates with 0 to ensure chart scale is correct
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    // Fill actual data
    logs.forEach(log => {
      const dateKey = new Date(log.created_at!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (trafficByDate.hasOwnProperty(dateKey) && log.event_type === 'page_view') {
        trafficByDate[dateKey]++;
      }
    });

    // 2. Page Views Ranking
    const pageViews: Record<string, number> = {};
    // 3. Device Breakdown
    const devices: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    // 4. Referrer Stats
    const referrers: Record<string, number> = {};
    // 5. Peak Hours
    const hours: number[] = new Array(24).fill(0);

    logs.forEach(log => {
      if (log.event_type === 'page_view') {
        // Page
        pageViews[log.page_path] = (pageViews[log.page_path] || 0) + 1;
        
        // Device
        if (log.device_type === 'mobile') devices.mobile++;
        else if (log.device_type === 'desktop') devices.desktop++;
        else devices.tablet++;

        // Referrer
        let ref = log.referrer || 'Direct';
        if (ref.includes('google')) ref = 'Google Search';
        else if (ref.includes('facebook') || ref.includes('fb')) ref = 'Facebook';
        else if (ref.includes('instagram')) ref = 'Instagram';
        else if (ref.includes('t.co')) ref = 'Twitter/X';
        else if (ref === 'direct' || ref === '') ref = 'Direct / WA';
        else ref = new URL(ref).hostname;
        
        referrers[ref] = (referrers[ref] || 0) + 1;

        // Hour
        const hour = new Date(log.created_at!).getHours();
        hours[hour]++;
      }
    });

    const sortedPages = Object.entries(pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    const sortedReferrers = Object.entries(referrers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);

    return { 
        totalViews, uniqueVisitors, totalActions, conversionRate,
        trafficByDate, sortedPages, devices, sortedReferrers, hours 
    };
  }, [logs, period]);

  return { stats, loading, period, setPeriod };
};

// --- ATOM: Stat Card ---
const StatCard = ({ label, value, sub, icon: Icon, color }: { label: string, value: string | number, sub?: string, icon: any, color: string }) => (
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

// --- MOLECULE: Improved Bar Chart ---
const EnhancedTrafficChart = ({ data }: { data: Record<string, number> }) => {
  const values = Object.values(data);
  const maxValue = Math.max(...values, 5); // Minimum scale of 5 to avoid flat charts on low data

  return (
    <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 relative">
      {/* Grid Lines (Visual Guide) */}
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
         <div className="border-t border-dashed border-gray-500 w-full h-px"></div>
         <div className="border-t border-dashed border-gray-500 w-full h-px"></div>
         <div className="border-t border-dashed border-gray-500 w-full h-px"></div>
         <div className="border-t border-dashed border-gray-500 w-full h-px"></div>
         <div className="border-t border-gray-500 w-full h-px"></div>
      </div>

      {Object.entries(data).map(([date, count], idx) => {
        const heightPercent = (count / maxValue) * 100;
        const isZero = count === 0;
        
        return (
          <div key={idx} className="flex-1 flex flex-col items-center group relative z-10 h-full justify-end">
            {/* Tooltip */}
            <div className="absolute -top-8 bg-brand-dark border border-brand-orange/50 text-brand-orange text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-neon whitespace-nowrap z-20">
               {count} View
            </div>
            
            {/* Bar */}
            <div className="w-full px-1 h-full flex items-end">
                <div 
                    className={`w-full rounded-t-sm transition-all duration-500 ${
                        isZero 
                        ? 'bg-white/5 h-[2px]' 
                        : 'bg-gradient-to-t from-brand-orange/20 to-brand-orange border-t border-brand-orange hover:bg-brand-orange/40 shadow-[0_0_10px_rgba(255,95,31,0.2)]'
                    }`}
                    style={{ height: isZero ? '4px' : `${heightPercent}%` }}
                ></div>
            </div>
            
            {/* Label */}
            <span className="text-[9px] text-gray-500 mt-2 truncate w-full text-center font-mono group-hover:text-white transition-colors">
                {date}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// --- MOLECULE: Peak Hours Heatmap ---
const PeakHoursChart = ({ hours }: { hours: number[] }) => {
    const maxVal = Math.max(...hours, 1);
    
    return (
        <div className="flex items-end gap-1 h-24 mt-4">
            {hours.map((count, h) => {
                const intensity = count / maxVal;
                let bgClass = 'bg-white/5';
                if (intensity > 0.75) bgClass = 'bg-red-500';
                else if (intensity > 0.5) bgClass = 'bg-brand-orange';
                else if (intensity > 0.25) bgClass = 'bg-yellow-500';
                else if (intensity > 0) bgClass = 'bg-blue-500';

                return (
                    <div key={h} className="flex-1 flex flex-col items-center group relative">
                        <div 
                            className={`w-full rounded-sm ${bgClass} transition-all hover:opacity-80`} 
                            style={{ height: `${Math.max(intensity * 100, 10)}%` }}
                        ></div>
                        {/* Hover Tooltip */}
                        <div className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-[9px] p-1 rounded z-20 border border-white/10 whitespace-nowrap">
                            {h}:00 - {count} hits
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

// --- MOLECULE: Device Progress Bar ---
const DeviceBar = ({ label, count, total, icon: Icon }: { label: string, count: number, total: number, icon: any }) => {
  const percent = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex justify-between items-center mb-1 text-xs">
        <span className="flex items-center gap-2 text-gray-300"><Icon size={14}/> {label}</span>
        <span className="font-bold text-white">{percent}% <span className="text-gray-500 font-normal">({count})</span></span>
      </div>
      <div className="w-full h-1.5 bg-black rounded-full overflow-hidden">
        <div className="h-full bg-brand-orange rounded-full transition-all duration-1000" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

// --- ATOM: Ghost Link Copier ---
const GhostLinkCopier = () => {
    const [copied, setCopied] = useState(false);
    const ghostLink = typeof window !== 'undefined' ? `${window.location.origin}/?mode=ghost_access` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(ghostLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6 p-4 bg-brand-dark border border-white/10 rounded-xl">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-orange"/> Ghost Access (Anti-Tracking)
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Gunakan link ini untuk akses admin/internal agar view <strong>TIDAK TERHITUNG</strong> di grafik.
            </p>
            <div className="flex gap-2">
                <input 
                    readOnly 
                    value={ghostLink} 
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none font-mono"
                />
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-all"
                >
                    {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                </button>
            </div>
        </div>
    );
};

// --- ORGANISM: Main Dashboard View ---
export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod } = useAnalyticsData();
  const isGhostMode = localStorage.getItem('mks_ghost_mode') === 'true';

  if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-brand-card/30 p-4 rounded-xl border border-white/5 gap-4">
         <div className="flex items-center gap-3">
            <div className="bg-brand-orange/10 p-2 rounded-lg text-brand-orange">
               <BarChart3 size={20} />
            </div>
            <div>
               <h3 className="font-bold text-white text-sm">Traffic Command Center</h3>
               <p className="text-xs text-gray-500">Live analytics pengunjung website.</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {isGhostMode && (
                <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-500/30 animate-pulse">
                    <ShieldCheck size={12}/> Ghost Mode Active
                </span>
            )}
            <div className="bg-black/40 rounded-lg p-1 border border-white/10 flex">
                {[7, 30].map(d => (
                    <button 
                      key={d}
                      onClick={() => setPeriod(d)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${period === d ? 'bg-brand-orange text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                    >
                      {d} Hari
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <StatCard 
            label="Total Views" 
            value={stats.totalViews} 
            sub="Halaman dilihat"
            icon={Eye} 
            color="text-blue-500" 
         />
         <StatCard 
            label="Unik Visitor" 
            value={stats.uniqueVisitors} 
            sub="Orang berbeda"
            icon={Users} 
            color="text-purple-500" 
         />
         <StatCard 
            label="Total Aksi" 
            value={stats.totalActions} 
            sub="Klik WA / Tombol"
            icon={MousePointer} 
            color="text-green-500" 
         />
         <StatCard 
            label="Konversi" 
            value={`${stats.conversionRate}%`} 
            sub="View to Action"
            icon={TrendingUp} 
            color="text-brand-orange" 
         />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5"><Activity size={80}/></div>
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <Calendar size={16} className="text-brand-orange"/> Tren Kunjungan ({period} Hari)
            </h4>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <EnhancedTrafficChart data={stats.trafficByDate} />
            </div>
            
            {/* Peak Hours Section */}
            <div className="mt-6 pt-6 border-t border-white/5">
                <h4 className="text-white font-bold text-xs mb-2 flex items-center gap-2">
                    <Clock size={14} className="text-yellow-500"/> Jam Sibuk (00:00 - 23:00)
                </h4>
                <p className="text-[10px] text-gray-500 mb-2">Warna lebih panas (Merah/Oranye) menandakan trafik tinggi di jam tersebut.</p>
                <PeakHoursChart hours={stats.hours} />
            </div>
         </div>

         {/* Device & Referrer */}
         <div className="space-y-6">
             <div className="bg-brand-dark border border-white/5 rounded-xl p-6 flex flex-col">
                <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                    <Smartphone size={16} className="text-brand-orange"/> Device User
                </h4>
                <div className="flex-grow">
                    <DeviceBar label="Mobile (HP)" count={stats.devices.mobile} total={stats.totalViews} icon={Smartphone} />
                    <DeviceBar label="Desktop (PC)" count={stats.devices.desktop} total={stats.totalViews} icon={Monitor} />
                    <DeviceBar label="Tablet" count={stats.devices.tablet} total={stats.totalViews} icon={Monitor} />
                </div>
             </div>

             <div className="bg-brand-dark border border-white/5 rounded-xl p-6">
                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                    <Globe size={16} className="text-blue-400"/> Sumber Trafik (Top 5)
                </h4>
                <div className="space-y-2">
                    {stats.sortedReferrers.map(([ref, count], idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs p-2 bg-white/5 rounded border border-white/5">
                            <span className="text-gray-300 truncate max-w-[150px]">{ref}</span>
                            <span className="font-bold text-white">{count}</span>
                        </div>
                    ))}
                    {stats.sortedReferrers.length === 0 && <p className="text-[10px] text-gray-500 italic">Belum ada data referer.</p>}
                </div>
             </div>
         </div>

      </div>

      {/* Top Pages Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-6">
             <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Konten Terlaris</h4>
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded">Top 6 Pages</span>
             </div>
             <div className="space-y-2">
                {stats.sortedPages.map(([page, count], idx) => {
                    const isProduct = page.includes('/shop/');
                    const isArticle = page.includes('/articles/');
                    const typeLabel = isProduct ? 'PRODUK' : isArticle ? 'ARTIKEL' : 'HALAMAN';
                    const typeColor = isProduct ? 'text-green-400 bg-green-500/10' : isArticle ? 'text-yellow-400 bg-yellow-500/10' : 'text-gray-400 bg-gray-500/10';

                    return (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-brand-orange/30 transition-all group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="w-6 h-6 rounded bg-black/50 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">{idx+1}</span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-white font-medium truncate max-w-[200px] md:max-w-sm group-hover:text-brand-orange transition-colors">{page}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded w-fit mt-0.5 font-bold ${typeColor}`}>{typeLabel}</span>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-white shrink-0 bg-black/40 px-3 py-1 rounded border border-white/10">{count} Hits</span>
                        </div>
                    )
                })}
                {stats.sortedPages.length === 0 && <p className="text-gray-500 text-xs italic">Belum ada data.</p>}
             </div>
          </div>

          <div className="lg:col-span-1">
             <GhostLinkCopier />
          </div>
      </div>

    </div>
  );
};
