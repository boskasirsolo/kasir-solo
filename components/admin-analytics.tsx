
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, Users, MousePointer, Smartphone, Monitor, Eye, ArrowUp, ArrowDown, Calendar, ShieldCheck, Link as LinkIcon, Copy, Check } from 'lucide-react';
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
    const totalActions = logs.filter(l => l.event_type !== 'page_view').length; // Conversion
    
    // Group by Date (Chart Data)
    const trafficByDate: Record<string, number> = {};
    // Group by Page
    const pageViews: Record<string, number> = {};
    // Group by Device
    const devices: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };

    logs.forEach(log => {
      // Date
      const dateKey = new Date(log.created_at!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (log.event_type === 'page_view') {
        trafficByDate[dateKey] = (trafficByDate[dateKey] || 0) + 1;
        pageViews[log.page_path] = (pageViews[log.page_path] || 0) + 1;
        
        if (log.device_type === 'mobile') devices.mobile++;
        else if (log.device_type === 'desktop') devices.desktop++;
        else devices.tablet++;
      }
    });

    const sortedPages = Object.entries(pageViews)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5

    return { totalViews, uniqueVisitors, totalActions, trafficByDate, sortedPages, devices };
  }, [logs]);

  return { stats, loading, period, setPeriod };
};

// --- ATOM: Stat Card ---
const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: number, icon: any, color: string }) => (
  <div className="bg-brand-card border border-white/5 p-5 rounded-xl flex items-center justify-between hover:border-brand-orange/30 transition-all group">
    <div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-display font-bold text-white group-hover:scale-105 transition-transform origin-left">{value}</h3>
    </div>
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} bg-opacity-10 text-opacity-100`}>
      <Icon size={24} className={`text-opacity-100 ${color.replace('bg-', 'text-')}`} />
    </div>
  </div>
);

// --- MOLECULE: Simple Bar Chart (CSS Based) ---
const SimpleTrafficChart = ({ data }: { data: Record<string, number> }) => {
  const maxValue = Math.max(...Object.values(data), 1);
  
  return (
    <div className="h-48 flex items-end justify-between gap-2 pt-4">
      {Object.entries(data).map(([date, count], idx) => {
        const heightPercent = (count / maxValue) * 100;
        return (
          <div key={idx} className="flex-1 flex flex-col items-center group">
            <div className="relative w-full flex justify-center">
               <span className="absolute -top-6 text-[10px] font-bold text-brand-orange opacity-0 group-hover:opacity-100 transition-opacity mb-1">{count}</span>
               <div 
                  className="w-full max-w-[30px] bg-brand-orange/20 border-t-2 border-brand-orange rounded-t-sm hover:bg-brand-orange/50 transition-all"
                  style={{ height: `${Math.max(heightPercent, 5)}%`, minHeight: '4px' }}
               ></div>
            </div>
            <span className="text-[9px] text-gray-500 mt-2 rotate-0 md:rotate-0 truncate w-full text-center">{date}</span>
          </div>
        );
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
        <span className="font-bold text-white">{percent}% ({count})</span>
      </div>
      <div className="w-full h-2 bg-black rounded-full overflow-hidden">
        <div className="h-full bg-brand-orange rounded-full" style={{ width: `${percent}%` }}></div>
      </div>
    </div>
  );
};

// --- ATOM: Ghost Link Copier ---
const GhostLinkCopier = () => {
    const [copied, setCopied] = useState(false);
    // Use window.location.origin to get current domain (localhost or production)
    const ghostLink = typeof window !== 'undefined' ? `${window.location.origin}/?mode=ghost_access` : '';

    const handleCopy = () => {
        navigator.clipboard.writeText(ghostLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-6 p-4 bg-brand-dark border border-white/10 rounded-xl">
            <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-brand-orange"/> Ghost Access Link (Link Jimat)
            </h4>
            <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Buka link ini di browser/HP lain agar trafiknya <strong>TIDAK DIHITUNG</strong> di analitik. 
                Sistem akan menandai browser tersebut sebagai "Internal".
            </p>
            <div className="flex gap-2">
                <input 
                    readOnly 
                    value={ghostLink} 
                    className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 text-xs text-gray-300 focus:outline-none"
                />
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-white transition-all"
                >
                    {copied ? <Check size={14} className="text-green-500"/> : <Copy size={14}/>}
                    {copied ? "Disalin!" : "Copy"}
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
               <h3 className="font-bold text-white text-sm">Traffic Overview</h3>
               <p className="text-xs text-gray-500">Statistik pengunjung website Anda.</p>
            </div>
         </div>

         <div className="flex items-center gap-3">
            {isGhostMode ? (
                <span className="text-[10px] font-bold text-green-500 flex items-center gap-1 bg-green-900/20 px-3 py-1.5 rounded-full border border-green-500/30">
                    <ShieldCheck size={12}/> Ghost Mode Active
                </span>
            ) : (
                <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    <Eye size={12}/> Tracking Active
                </span>
            )}
            <div className="bg-black/40 rounded-lg p-1 border border-white/10 flex">
                {[7, 30].map(d => (
                    <button 
                      key={d}
                      onClick={() => setPeriod(d)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${period === d ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white'}`}
                    >
                      {d} Hari
                    </button>
                ))}
            </div>
         </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <StatCard label="Total Views" value={stats.totalViews} icon={Eye} color="bg-blue-500" />
         <StatCard label="Unik Visitor" value={stats.uniqueVisitors} icon={Users} color="bg-purple-500" />
         <StatCard label="Konversi (Klik WA)" value={stats.totalActions} icon={MousePointer} color="bg-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Main Chart */}
         <div className="lg:col-span-2 bg-brand-dark border border-white/5 rounded-xl p-6">
            <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-brand-orange"/> Tren Kunjungan
            </h4>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                <SimpleTrafficChart data={stats.trafficByDate} />
            </div>
         </div>

         {/* Device Breakdown */}
         <div className="bg-brand-dark border border-white/5 rounded-xl p-6 flex flex-col">
            <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                <Smartphone size={16} className="text-brand-orange"/> Device User
            </h4>
            <div className="flex-grow">
                <DeviceBar label="Mobile (HP)" count={stats.devices.mobile} total={stats.totalViews} icon={Smartphone} />
                <DeviceBar label="Desktop (PC/Laptop)" count={stats.devices.desktop} total={stats.totalViews} icon={Monitor} />
                <DeviceBar label="Tablet" count={stats.devices.tablet} total={stats.totalViews} icon={Monitor} />
            </div>
            
            {/* ADDED: Ghost Link Copier here for easy access */}
            <GhostLinkCopier />
         </div>

      </div>

      {/* Top Pages */}
      <div className="bg-brand-dark border border-white/5 rounded-xl p-6">
         <h4 className="text-white font-bold text-sm mb-4 uppercase tracking-widest border-b border-white/5 pb-2">Halaman Terpopuler</h4>
         <div className="space-y-3">
            {stats.sortedPages.map(([page, count], idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-brand-orange/30 transition-all">
                    <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-black/50 text-gray-500 flex items-center justify-center text-xs font-bold">{idx+1}</span>
                        <span className="text-sm text-gray-300 font-mono truncate max-w-[200px] md:max-w-md">{page}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{count} Views</span>
                </div>
            ))}
            {stats.sortedPages.length === 0 && <p className="text-gray-500 text-xs italic">Belum ada data.</p>}
         </div>
      </div>

    </div>
  );
};
