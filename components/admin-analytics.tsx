
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Users, MousePointer, Smartphone, Monitor, Eye, 
  ArrowUp, ArrowDown, Calendar, ShieldCheck, Link as LinkIcon, 
  Copy, Check, Globe, Clock, Activity, TrendingUp, Filter, Tablet,
  PieChart, LogOut, RefreshCw, Zap
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
    startDate.setHours(0, 0, 0, 0); 

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
    
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    logs.forEach(log => {
      const d = new Date(log.created_at!);
      const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (trafficByDate.hasOwnProperty(key) && log.event_type === 'page_view') {
        trafficByDate[key]++;
      }
    });

    // 2. Page & Referrer & Device
    const pageViews: Record<string, number> = {};
    const devices: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    
    // 3. ADVANCED: Visitor Behavior (Retention & Bounce)
    const visitorHistory: Record<string, string[]> = {}; // visitor_id -> [pages visited]

    logs.forEach(log => {
      if (log.event_type === 'page_view') {
        const path = log.page_path.split('?')[0]; 
        pageViews[path] = (pageViews[path] || 0) + 1;
        
        // Device
        if (log.device_type === 'mobile') devices.mobile++;
        else if (log.device_type === 'desktop') devices.desktop++;
        else devices.tablet++;

        // Referrer
        let ref = log.referrer || 'Direct';
        const lowerRef = ref.toLowerCase();
        if (lowerRef.includes('google')) ref = 'Google Search';
        else if (lowerRef.includes('facebook') || lowerRef.includes('fb')) ref = 'Facebook';
        else if (lowerRef.includes('instagram')) ref = 'Instagram';
        else if (lowerRef.includes('t.co') || lowerRef.includes('twitter')) ref = 'Twitter/X';
        else if (lowerRef.includes('tiktok')) ref = 'TikTok';
        else if (lowerRef === 'direct' || lowerRef === '') ref = 'Direct / WA';
        else {
            try {
                const url = new URL(ref);
                ref = url.hostname.replace('www.', '');
            } catch(e) { /* keep original */ }
        }
        referrers[ref] = (referrers[ref] || 0) + 1;

        // Hour
        const hour = new Date(log.created_at!).getHours();
        hours[hour]++;

        // Visitor Tracking
        if (!visitorHistory[log.visitor_id]) {
            visitorHistory[log.visitor_id] = [];
        }
        visitorHistory[log.visitor_id].push(path);
      }
    });

    // Calculate Retention & Bounce
    let newVisitors = 0;
    let returningVisitors = 0;
    let singlePageVisits = 0;
    const exitPages: Record<string, number> = {};

    Object.entries(visitorHistory).forEach(([vid, pages]) => {
        // If visited only 1 page ever in this period -> Bounce / New (Simplified logic)
        // If visited > 1 distinct pages or sessions -> Returning/Engaged
        if (pages.length === 1) {
            newVisitors++;
            singlePageVisits++;
        } else {
            returningVisitors++;
        }

        // The last page they visited is the "Exit Page"
        const lastPage = pages[pages.length - 1];
        exitPages[lastPage] = (exitPages[lastPage] || 0) + 1;
    });

    const bounceRate = uniqueVisitors > 0 ? Math.round((singlePageVisits / uniqueVisitors) * 100) : 0;
    const avgPagesPerSession = uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : "0";

    const sortedPages = Object.entries(pageViews).sort(([,a], [,b]) => b - a).slice(0, 6);
    const sortedReferrers = Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 5);
    const sortedExitPages = Object.entries(exitPages).sort(([,a], [,b]) => b - a).slice(0, 5);

    return { 
        totalViews, uniqueVisitors, totalActions, conversionRate,
        trafficByDate, sortedPages, devices, sortedReferrers, hours,
        // New Advanced Stats
        newVisitors, returningVisitors, bounceRate, avgPagesPerSession, sortedExitPages
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
  const maxValue = Math.max(...values, 5); 

  return (
    <div className="h-64 flex items-end justify-between gap-2 pt-10 pb-2 relative w-full">
      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20 z-0">
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
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-brand-dark border border-brand-orange/50 text-brand-orange text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-neon whitespace-nowrap z-20 pointer-events-none">
               {count} View
            </div>
            <div className="w-full px-1 h-full flex items-end relative">
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
        <div className="relative">
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
                        <div key={h} className="flex-1 flex flex-col items-center group relative h-full justify-end">
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
    );
};

// --- MOLECULE: Circular Retention Chart (CSS Only) ---
const RetentionDonut = ({ newUsers, returningUsers }: { newUsers: number, returningUsers: number }) => {
    const total = newUsers + returningUsers;
    const newPercent = total > 0 ? (newUsers / total) * 100 : 0;
    const returningPercent = total > 0 ? (returningUsers / total) * 100 : 0;

    return (
        <div className="flex items-center gap-6">
            <div className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-lg"
                 style={{
                     background: `conic-gradient(#FF5F1F ${returningPercent}%, #333 0)`
                 }}>
                <div className="absolute inset-2 bg-brand-dark rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{total}</span>
                    <span className="text-[10px] text-gray-500 uppercase">Users</span>
                </div>
            </div>
            <div className="space-y-3 flex-1">
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
    );
};

// --- ATOM: Ghost Link Copier ---
const GhostLinkCopier = () => {
  const [copied, setCopied] = useState(false);
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const ghostLink = `${origin}/?mode=ghost_access`;

  const copyLink = () => {
    navigator.clipboard.writeText(ghostLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-brand-dark border border-white/5 rounded-xl p-6 h-full flex flex-col justify-center items-center text-center">
       <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
          <ShieldCheck size={32} className="text-green-400" />
       </div>
       <h4 className="text-white font-bold text-sm mb-2">Ghost Access Link</h4>
       <p className="text-[10px] text-gray-500 mb-6 leading-relaxed max-w-[200px]">
          Gunakan link ini di device baru agar tidak terhitung dalam analytics (Admin Mode).
       </p>
       
       <button 
          onClick={copyLink}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold text-gray-300 transition-all w-full justify-center"
       >
          {copied ? <Check size={14} className="text-green-400"/> : <Copy size={14} />}
          {copied ? 'Link Disalin!' : 'Salin Ghost Link'}
       </button>
    </div>
  );
};

// --- ORGANISM: Main Dashboard View ---
export const AnalyticsDashboard = () => {
  const { stats, loading, period, setPeriod } = useAnalyticsData();
  const isGhostMode = localStorage.getItem('mks_ghost_mode') === 'true';

  if (loading) return <div className="flex justify-center p-20"><LoadingSpinner size={32} /></div>;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
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

      {/* Main Charts Row */}
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
                    <Clock size={14} className="text-yellow-500"/> Jam Sibuk (Waktu Server)
                </h4>
                <p className="text-[10px] text-gray-500 mb-2">Semakin tinggi bar (merah/oranye), semakin banyak pengunjung di jam tersebut.</p>
                <PeakHoursChart hours={stats.hours} />
            </div>
         </div>

         {/* Device & Referrer */}
         <div className="space-y-6">
             <div className="bg-brand-dark border border-white/5 rounded-xl p-6 flex flex-col">
                <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                    <Smartphone size={16} className="text-brand-orange"/> Device User
                </h4>
                <div className="flex-grow space-y-4">
                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-400 flex items-center gap-2"><Smartphone size={14}/> Mobile</span>
                        <span className="text-white font-bold">{stats.devices.mobile}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-brand-orange h-full" style={{ width: `${(stats.devices.mobile / stats.totalViews) * 100}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-400 flex items-center gap-2"><Monitor size={14}/> Desktop</span>
                        <span className="text-white font-bold">{stats.devices.desktop}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: `${(stats.devices.desktop / stats.totalViews) * 100}%` }}></div>
                    </div>

                    <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-gray-400 flex items-center gap-2"><Tablet size={14}/> Tablet</span>
                        <span className="text-white font-bold">{stats.devices.tablet}</span>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: `${(stats.devices.tablet / stats.totalViews) * 100}%` }}></div>
                    </div>
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

      {/* DEMOGRAPHICS & BEHAVIOR SECTION (NEW) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* RETENTION */}
          <div className="bg-brand-dark border border-white/5 rounded-xl p-6">
              <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-2">
                  <RefreshCw size={16} className="text-green-400"/> User Retention
              </h4>
              <RetentionDonut newUsers={stats.newVisitors} returningUsers={stats.returningVisitors} />
              <p className="text-[10px] text-gray-500 mt-6 text-center italic">
                  *Returning user = Pengunjung yang datang lebih dari 1 kali dalam periode ini.
              </p>
          </div>

          {/* ENGAGEMENT METRICS */}
          <div className="bg-brand-dark border border-white/5 rounded-xl p-6 flex flex-col justify-between">
              <div>
                  <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                      <Zap size={16} className="text-yellow-400"/> Quality Score
                  </h4>
                  <div className="space-y-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                              <p className="text-xs text-gray-400 mb-1">Bounce Rate</p>
                              <h3 className="text-2xl font-bold text-white">{stats.bounceRate}%</h3>
                          </div>
                          <div className={`text-[10px] px-2 py-1 rounded font-bold ${stats.bounceRate < 40 ? 'bg-green-500/20 text-green-400' : stats.bounceRate < 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                              {stats.bounceRate < 40 ? 'Excellent' : stats.bounceRate < 70 ? 'Normal' : 'High'}
                          </div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                          <div>
                              <p className="text-xs text-gray-400 mb-1">Avg. Pages/Visit</p>
                              <h3 className="text-2xl font-bold text-white">{stats.avgPagesPerSession}</h3>
                          </div>
                          <Activity size={20} className="text-blue-400"/>
                      </div>
                  </div>
              </div>
          </div>

          {/* EXIT PAGES */}
          <div className="bg-brand-dark border border-white/5 rounded-xl p-6">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                  <LogOut size={16} className="text-red-400"/> Top Exit Pages
              </h4>
              <p className="text-[10px] text-gray-500 mb-4">Halaman terakhir yang dilihat user sebelum pergi.</p>
              <div className="space-y-2">
                  {stats.sortedExitPages.map(([page, count], idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs border-b border-white/5 pb-2 last:border-0">
                          <span className="text-gray-300 truncate max-w-[180px]">{page}</span>
                          <span className="text-red-400 font-bold">{count} Exit</span>
                      </div>
                  ))}
                  {stats.sortedExitPages.length === 0 && <p className="text-[10px] text-gray-500 italic">Belum ada data.</p>}
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
                    const typeColor = isProduct ? 'text-green-400 bg-green-500/10 border-green-500/20' : isArticle ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 'text-gray-400 bg-gray-500/10 border-gray-500/20';

                    return (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/5 hover:border-brand-orange/30 transition-all group">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <span className="w-6 h-6 rounded bg-black/50 text-gray-500 flex items-center justify-center text-[10px] font-bold shrink-0">{idx+1}</span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs text-white font-medium truncate max-w-[200px] md:max-w-sm group-hover:text-brand-orange transition-colors">{page}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded w-fit mt-0.5 font-bold border ${typeColor}`}>{typeLabel}</span>
                                </div>
                            </div>
                            <span className="text-sm font-bold text-white shrink-0 bg-black/40 px-3 py-1 rounded border border-white/10 shadow-sm">{count} Hits</span>
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
