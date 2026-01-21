
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { AnalyticsStats, FunnelStage } from './types';
import { Eye, BookOpen, ShoppingBag, DollarSign, TrendingUp, Search, Layers } from 'lucide-react';

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
    const totalActions = logs.filter(l => l.event_type === 'click_action' || l.event_type === 'contact_wa').length; 
    
    const trafficByDate: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
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

    // --- FUNNEL LOGIC (MARKETING RADAR) ---
    const funnelCounts = {
        awareness: new Set<string>(), // Home, City, Landing
        interest: new Set<string>(),  // Articles, Gallery
        intent: new Set<string>(),    // Shop, Simulation
        action: new Set<string>()     // Checkout Success, Contact WA
    };

    const userPaths: Record<string, string[]> = {};

    Object.entries(visitorSessions).forEach(([vid, sLogs]) => {
        sLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
        
        const path: string[] = [];
        sLogs.forEach(l => {
            const p = l.page_path.split('?')[0];
            
            // Track path sequence
            if (path[path.length - 1] !== p) path.push(p);

            // Group into Stages
            if (p === '/' || p.includes('/jual-mesin-kasir-di')) funnelCounts.awareness.add(vid);
            if (p.includes('/articles/') || p.includes('/gallery/')) funnelCounts.interest.add(vid);
            if (p.includes('/shop') || p.includes('/services/')) funnelCounts.intent.add(vid);
            if (l.event_type === 'contact_wa' || p.includes('/checkout')) funnelCounts.action.add(vid);

            // Standard duration logic
            if (l.event_type === 'page_view') {
                const idx = sLogs.indexOf(l);
                const next = sLogs[idx+1];
                if (next) {
                    const diff = (new Date(next.created_at!).getTime() - new Date(l.created_at!).getTime()) / 1000;
                    if (diff < 1800 && diff > 0) {
                        if (!pageDurations[p]) pageDurations[p] = [];
                        pageDurations[p].push(diff);
                        totalEngagementSeconds += diff;
                        engagementCount++;
                    }
                }
            }
        });
        userPaths[vid] = path;
    });

    const funnelStages: FunnelStage[] = [
        { label: 'TAMU (Awareness)', count: funnelCounts.awareness.size, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
        { label: 'KEPO (Interest)', count: funnelCounts.interest.size, percentage: 0, dropOff: 0, icon: BookOpen, color: 'text-purple-400' },
        { label: 'NAKSIR (Intent)', count: funnelCounts.intent.size, percentage: 0, dropOff: 0, icon: ShoppingBag, color: 'text-yellow-500' },
        { label: 'DEAL (Conversion)', count: funnelCounts.action.size, percentage: 0, dropOff: 0, icon: DollarSign, color: 'text-green-500' }
    ];

    // Calculate Percentages and Drop-offs
    for (let i = 1; i < funnelStages.length; i++) {
        const prev = funnelStages[i-1];
        const curr = funnelStages[i];
        curr.percentage = prev.count > 0 ? Math.round((curr.count / prev.count) * 100) : 0;
        curr.dropOff = 100 - curr.percentage;
    }

    // Path Pattern Analysis (Golden Paths)
    const pathPatterns: Record<string, number> = {};
    Object.values(userPaths).forEach(p => {
        if (p.length < 2) return;
        const key = p.join(' → ');
        pathPatterns[key] = (pathPatterns[key] || 0) + 1;
    });
    const sortedPaths = Object.entries(pathPatterns)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));

    // Standard metric inits
    const today = new Date();
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    logs.forEach(log => {
      const d = new Date(log.created_at!);
      const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (trafficByDate.hasOwnProperty(dateKey) && log.event_type === 'page_view') trafficByDate[dateKey]++;

      if (log.event_type === 'page_view') {
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
        totalViews, uniqueVisitors, totalActions, 
        conversionRate: uniqueVisitors > 0 ? ((funnelCounts.action.size / uniqueVisitors) * 100).toFixed(1) : '0',
        trafficByDate, sortedPages, devices, 
        sortedReferrers: Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 10), 
        hours,
        newVisitors: Object.values(userPaths).filter(p => p.length === 1).length,
        returningVisitors: Object.values(userPaths).filter(p => p.length > 1).length,
        bounceRate: uniqueVisitors > 0 ? Math.round((Object.values(userPaths).filter(p => p.length === 1).length / uniqueVisitors) * 100) : 0,
        avgPagesPerSession: uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : "0",
        sortedExitPages: Object.entries(pageViews).sort(([,a], [,b]) => b - a).slice(0, 5), // Placeholder
        avgEngagementTime: engagementCount > 0 ? formatDuration(totalEngagementSeconds / engagementCount) : "0s",
        funnel: {
            stages: funnelStages,
            topPaths: sortedPaths,
            conversionRate: uniqueVisitors > 0 ? (funnelCounts.action.size / uniqueVisitors) * 100 : 0
        }
    };
  }, [logs, period]);

  return { stats, loading, period, setPeriod };
};
