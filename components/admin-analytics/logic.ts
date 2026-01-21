
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { AnalyticsStats, FunnelStage } from './types';
import { Eye, BookOpen, ShoppingBag, DollarSign, Search } from 'lucide-react';

const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
};

export const useAnalyticsData = () => {
  const [logs, setLogs] = useState<AnalyticsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7); 

  useEffect(() => {
    fetchLogs();
  }, [period]);

  const fetchLogs = async () => {
    if (!supabase) return;
    setLoading(true);
    
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

  const stats: AnalyticsStats = useMemo(() => {
    const uniqueVisitors = new Set(logs.map(l => l.visitor_id)).size;
    const totalViews = logs.filter(l => l.event_type === 'page_view').length;
    
    const trafficByDate: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
    const exitPoints: Record<string, number> = {}; 
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const osDist: Record<string, number> = {};
    const cities: Record<string, number> = {};
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    
    const pageDurations: Record<string, number[]> = {}; 
    const visitorSessions: Record<string, AnalyticsLog[]> = {};
    let totalEngagementSeconds = 0;
    let engagementCount = 0;

    const funnelCounts = { awareness: new Set<string>(), interest: new Set<string>(), intent: new Set<string>(), action: new Set<string>() };
    const userPaths: Record<string, string[]> = {};

    // --- PROBABILISTIC DEMOGRAPHICS (SIBOS ESTIMATOR) ---
    // Logic: Kita estimasi berdasarkan jam kunjung & device
    let estimatedMale = 0;
    let estimatedFemale = 0;
    const estimatedAge = { "18-24": 0, "25-34": 0, "35-44": 0, "45+": 0 };

    logs.forEach(log => {
        if (!visitorSessions[log.visitor_id]) visitorSessions[log.visitor_id] = [];
        visitorSessions[log.visitor_id].push(log);

        if (log.event_type === 'page_view') {
            const h = new Date(log.created_at!).getHours();
            const p = log.page_path.split('?')[0];

            // 1. OS & City
            const os = (log as any).os_name || 'Lainnya';
            osDist[os] = (osDist[os] || 0) + 1;
            
            const city = (log as any).location_city || 'Luar Negeri / VPN';
            cities[city] = (cities[city] || 0) + 1;

            // 2. DEMO ESTIMATOR (STREET-SMART LOGIC)
            // Jam begadang (00-04) & Mobile -> Biasanya gen-z (18-24)
            if (h >= 0 && h <= 4) estimatedAge["18-24"]++;
            // Jam kerja (08-17) & Desktop -> Biasanya 25-44 (Owner Bisnis)
            else if (h >= 8 && h <= 17 && log.device_type === 'desktop') estimatedAge["35-44"]++;
            else estimatedAge["25-34"]++;

            // Kelamin (Heuristic berdasarkan minat konten)
            if (p.includes('/fashion') || p.includes('/beauty')) estimatedFemale++;
            else if (p.includes('/bengkel') || p.includes('/hardware')) estimatedMale++;
            else { estimatedMale += 0.6; estimatedFemale += 0.4; } // Default MKS bias male
        }
    });

    Object.entries(visitorSessions).forEach(([vid, sLogs]) => {
        sLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
        const path: string[] = [];
        sLogs.forEach((l, idx) => {
            const p = l.page_path.split('?')[0];
            if (path[path.length - 1] !== p) path.push(p);
            if (p === '/' || p.includes('/jual-mesin-kasir-di')) funnelCounts.awareness.add(vid);
            if (p.includes('/articles/') || p.includes('/gallery/')) funnelCounts.interest.add(vid);
            if (p.includes('/shop') || p.includes('/services/')) funnelCounts.intent.add(vid);
            if (l.event_type === 'contact_wa' || l.event_type === 'click_action' || p.includes('/checkout')) funnelCounts.action.add(vid);

            if (l.event_type === 'page_view') {
                const next = sLogs[idx+1];
                if (next) {
                    const diff = (new Date(next.created_at!).getTime() - new Date(l.created_at!).getTime()) / 1000;
                    if (diff < 1800 && diff > 2) { 
                        if (!pageDurations[p]) pageDurations[p] = [];
                        pageDurations[p].push(diff);
                        totalEngagementSeconds += diff;
                        engagementCount++;
                    }
                }
                hours[new Date(l.created_at!).getHours()]++;
                if (l.device_type === 'mobile') devices.mobile++;
                else if (l.device_type === 'desktop') devices.desktop++;
                else devices.tablet++;
                pageViews[p] = (pageViews[p] || 0) + 1;
            }
        });
        userPaths[vid] = path;
    });

    const funnelStages: FunnelStage[] = [
        { label: 'TAMU', count: funnelCounts.awareness.size, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
        { label: 'KEPO', count: funnelCounts.interest.size, percentage: 0, dropOff: 0, icon: BookOpen, color: 'text-purple-400' },
        { label: 'NAKSIR', count: funnelCounts.intent.size, percentage: 0, dropOff: 0, icon: ShoppingBag, color: 'text-yellow-500' },
        { label: 'DEAL', count: funnelCounts.action.size, percentage: 0, dropOff: 0, icon: DollarSign, color: 'text-green-500' }
    ];

    const totalTraffic = funnelStages[0].count || uniqueVisitors || 1;
    for (let i = 1; i < funnelStages.length; i++) {
        funnelStages[i].percentage = Math.round((funnelStages[i].count / totalTraffic) * 100);
        funnelStages[i].dropOff = funnelStages[i-1].count > 0 ? Math.max(0, Math.round(((funnelStages[i-1].count - funnelStages[i].count) / funnelStages[i-1].count) * 100)) : 0;
    }

    const today = new Date();
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date(); d.setDate(today.getDate() - i);
        trafficByDate[d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })] = 0;
    }
    logs.forEach(log => {
      if (log.event_type === 'page_view') {
        const dateKey = new Date(log.created_at!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        if (trafficByDate.hasOwnProperty(dateKey)) trafficByDate[dateKey]++;
      }
    });

    return { 
        totalViews, uniqueVisitors, totalActions: funnelCounts.action.size, 
        conversionRate: uniqueVisitors > 0 ? ((funnelCounts.action.size / uniqueVisitors) * 100).toFixed(1) : '0',
        trafficByDate, devices, osDist,
        sortedCities: Object.entries(cities).sort(([,a], [,b]) => b - a).slice(0, 8),
        demographics: {
            age: estimatedAge,
            gender: { male: Math.round(estimatedMale), female: Math.round(estimatedFemale) }
        },
        sortedPages: Object.entries(pageViews).map(([path, hits]) => ({ path, hits, avgTime: formatDuration((pageDurations[path] || []).reduce((a, b) => a + b, 0) / (pageDurations[path]?.length || 1)) })).sort((a, b) => b.hits - a.hits),
        sortedReferrers: Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 10), 
        hours, newVisitors: Object.values(userPaths).filter(p => p.length === 1).length, returningVisitors: Object.values(userPaths).filter(p => p.length > 1).length,
        bounceRate: uniqueVisitors > 0 ? Math.round((Object.values(userPaths).filter(p => p.length === 1).length / uniqueVisitors) * 100) : 0,
        avgPagesPerSession: uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : "0",
        sortedExitPages: Object.entries(exitPoints).sort(([,a], [,b]) => b - a).slice(0, 5),
        avgEngagementTime: engagementCount > 0 ? formatDuration(totalEngagementSeconds / engagementCount) : "0s",
        funnel: { stages: funnelStages, topPaths: [], conversionRate: uniqueVisitors > 0 ? (funnelCounts.action.size / uniqueVisitors) * 100 : 0 }
    };
  }, [logs, period]);

  return { stats, loading, period, setPeriod, refresh: fetchLogs };
};
