
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { AnalyticsStats, FunnelStage } from './types';
import { Eye, BookOpen, ShoppingBag, DollarSign, TrendingUp, Search } from 'lucide-react';

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
    const totalViews = logs.filter(l => l.event_type === 'page_view').length;
    const uniqueVisitors = new Set(logs.map(l => l.visitor_id)).size;
    
    const trafficByDate: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
    const exitPoints: Record<string, number> = {}; 
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    
    const visitorSessions: Record<string, AnalyticsLog[]> = {};
    const pageDurations: Record<string, number[]> = {}; 
    let totalEngagementSeconds = 0;
    let engagementCount = 0;

    logs.forEach(log => {
        if (!visitorSessions[log.visitor_id]) visitorSessions[log.visitor_id] = [];
        visitorSessions[log.visitor_id].push(log);
    });

    const funnelCounts = {
        awareness: new Set<string>(),
        interest: new Set<string>(),
        intent: new Set<string>(),
        action: new Set<string>()
    };

    const userPaths: Record<string, string[]> = {};

    Object.entries(visitorSessions).forEach(([vid, sLogs]) => {
        sLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
        
        const path: string[] = [];
        const lastLog = sLogs[sLogs.length - 1];
        if (lastLog && lastLog.event_type === 'page_view') {
            const exitPath = lastLog.page_path.split('?')[0];
            exitPoints[exitPath] = (exitPoints[exitPath] || 0) + 1;
        }

        sLogs.forEach((l, idx) => {
            const p = l.page_path.split('?')[0];
            if (path[path.length - 1] !== p) path.push(p);

            // Sequential funnel check logic could be more complex, 
            // but for simple volume, we check if they hit specific areas
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
                const hour = new Date(l.created_at!).getHours();
                hours[hour]++;
            }
        });
        userPaths[vid] = path;
    });

    // FIXED FUNNEL CALCULATION
    const funnelStages: FunnelStage[] = [
        { label: 'TAMU (Awareness)', count: funnelCounts.awareness.size, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
        { label: 'KEPO (Interest)', count: funnelCounts.interest.size, percentage: 0, dropOff: 0, icon: BookOpen, color: 'text-purple-400' },
        { label: 'NAKSIR (Intent)', count: funnelCounts.intent.size, percentage: 0, dropOff: 0, icon: ShoppingBag, color: 'text-yellow-500' },
        { label: 'DEAL (Conversion)', count: funnelCounts.action.size, percentage: 0, dropOff: 0, icon: DollarSign, color: 'text-green-500' }
    ];

    // Math Fix: Percentage relative to total awareness (TOP OF FUNNEL)
    const totalTraffic = funnelStages[0].count || uniqueVisitors || 1;
    
    for (let i = 1; i < funnelStages.length; i++) {
        const prev = funnelStages[i-1];
        const curr = funnelStages[i];
        
        // Survival relative to Start
        curr.percentage = Math.round((curr.count / totalTraffic) * 100);
        
        // Drop-off relative to PREVIOUS stage (how much we lost in this specific step)
        const gap = prev.count - curr.count;
        curr.dropOff = prev.count > 0 ? Math.max(0, Math.round((gap / prev.count) * 100)) : 0;
    }

    const today = new Date();
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    logs.forEach(log => {
      if (log.event_type === 'page_view') {
        const d = new Date(log.created_at!);
        const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        if (trafficByDate.hasOwnProperty(dateKey)) trafficByDate[dateKey]++;

        const path = log.page_path.split('?')[0]; 
        pageViews[path] = (pageViews[path] || 0) + 1;
        
        if (log.device_type === 'mobile') devices.mobile++;
        else if (log.device_type === 'desktop') devices.desktop++;
        else devices.tablet++;

        let ref = log.referrer || 'Direct';
        const lowerRef = ref.toLowerCase();
        if (lowerRef.includes('google')) ref = 'Google';
        else if (lowerRef.includes('facebook')) ref = 'Facebook';
        else if (lowerRef.includes('instagram')) ref = 'Instagram';
        else if (lowerRef.includes('whatsapp')) ref = 'WhatsApp';
        else if (lowerRef === 'direct' || lowerRef === '') ref = 'Direct';
        referrers[ref] = (referrers[ref] || 0) + 1;
      }
    });

    const sortedPages = Object.entries(pageViews)
        .map(([path, hits]) => {
            const durations = pageDurations[path] || [];
            const avgSec = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
            return { path, hits, avgTime: avgSec > 0 ? formatDuration(avgSec) : '-' };
        })
        .sort((a, b) => b.hits - a.hits); 

    return { 
        totalViews, uniqueVisitors, totalActions: funnelCounts.action.size, 
        conversionRate: uniqueVisitors > 0 ? ((funnelCounts.action.size / uniqueVisitors) * 100).toFixed(1) : '0',
        trafficByDate, sortedPages, devices, 
        sortedReferrers: Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 10), 
        hours,
        newVisitors: Object.values(userPaths).filter(p => p.length === 1).length,
        returningVisitors: Object.values(userPaths).filter(p => p.length > 1).length,
        bounceRate: uniqueVisitors > 0 ? Math.round((Object.values(userPaths).filter(p => p.length === 1).length / uniqueVisitors) * 100) : 0,
        avgPagesPerSession: uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : "0",
        sortedExitPages: Object.entries(exitPoints).sort(([,a], [,b]) => b - a).slice(0, 5),
        avgEngagementTime: engagementCount > 0 ? formatDuration(totalEngagementSeconds / engagementCount) : "0s",
        funnel: {
            stages: funnelStages,
            topPaths: [], 
            conversionRate: uniqueVisitors > 0 ? (funnelCounts.action.size / uniqueVisitors) * 100 : 0
        }
    };
  }, [logs, period]);

  return { stats, loading, period, setPeriod, refresh: fetchLogs };
};
