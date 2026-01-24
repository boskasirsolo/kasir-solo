import { AnalyticsLog } from '../../types';
import { AnalyticsStats, FunnelStage, MetricTrend } from './types';
import { Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';

const formatDuration = (seconds: number) => {
    if (seconds < 1) return "0s";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
};

const calculateTrend = (current: number, previous: number): number => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Math.round(((current - previous) / previous) * 100);
};

/**
 * RADAR PROCESSOR V3.2: Normalisasi OS & City Detection
 */
export const processAnalyticsLogs = (logs: AnalyticsLog[], period: number): AnalyticsStats => {
    const now = new Date();
    const midPoint = new Date(now.getTime() - (period * 24 * 60 * 60 * 1000));
    
    const currentLogs = logs.filter(l => new Date(l.created_at!).getTime() >= midPoint.getTime());
    const prevLogs = logs.filter(l => new Date(l.created_at!).getTime() < midPoint.getTime());

    const getKPI = (data: AnalyticsLog[]): { views: number, visitors: number, actions: number, conv: number } => {
        const views = data.filter(l => l.event_type === 'page_view').length;
        const visitors = new Set(data.map(l => l.visitor_id)).size;
        const actions = data.filter(l => ['contact_wa', 'click_action'].includes(l.event_type)).length;
        const conv = visitors > 0 ? (actions / visitors) * 100 : 0;
        return { views, visitors, actions, conv };
    };

    const currKPI = getKPI(currentLogs);
    const prevKPI = getKPI(prevLogs);

    const trafficByDate: Record<string, number> = {};
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[dateKey] = 0;
    }

    const pageViews: Record<string, number> = {};
    const exitCounts: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const osDist: Record<string, number> = {};
    const cities: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    const referrers: Record<string, number> = {};
    const pageDurations: Record<string, number[]> = {};
    let totalEngagementSeconds = 0;
    let engagementCount = 0;

    const visitorSessions: Record<string, AnalyticsLog[]> = {};
    const funnelCounts = { awareness: new Set<string>(), interest: new Set<string>(), intent: new Set<string>(), action: new Set<string>() };

    currentLogs.forEach(log => {
        if (!visitorSessions[log.visitor_id]) visitorSessions[log.visitor_id] = [];
        visitorSessions[log.visitor_id].push(log);

        if (log.event_type === 'page_view') {
            const d = new Date(log.created_at!);
            const h = d.getHours();
            const p = log.page_path.split('?')[0];
            const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            
            if (trafficByDate[dateKey] !== undefined) trafficByDate[dateKey]++;
            hours[h]++;
            
            // OS Normalization: Unify Other/Unknown
            const rawOS = (log as any).os_name || 'Lainnya';
            const normalizedOS = (rawOS === 'Other' || rawOS === 'Unknown') ? 'Lainnya' : rawOS;
            osDist[normalizedOS] = (osDist[normalizedOS] || 0) + 1;

            const cityLabel = (log as any).location_city || 'Unknown';
            cities[cityLabel] = (cities[cityLabel] || 0) + 1;
            
            if (log.device_type === 'mobile') devices.mobile++;
            else if (log.device_type === 'desktop') devices.desktop++;
            else devices.tablet++;
            
            pageViews[p] = (pageViews[p] || 0) + 1;

            let ref = log.referrer || 'direct';
            if (ref.includes('google')) ref = 'Google Search';
            else if (ref.includes('facebook')) ref = 'Facebook';
            else if (ref.includes('wa.me')) ref = 'WhatsApp';
            referrers[ref] = (referrers[ref] || 0) + 1;
        }
    });

    Object.entries(visitorSessions).forEach(([vid, sLogs]) => {
        sLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
        const views = sLogs.filter(l => l.event_type === 'page_view');
        
        if (views.length > 0) {
            const lastView = views[views.length - 1];
            const exitPath = lastView.page_path.split('?')[0];
            exitCounts[exitPath] = (exitCounts[exitPath] || 0) + 1;
        }

        sLogs.forEach(l => {
            const p = l.page_path.split('?')[0];
            if (p === '/' || p.includes('/jual-mesin-kasir-di')) funnelCounts.awareness.add(vid);
            if (p.includes('/articles/') || p.includes('/gallery/')) funnelCounts.interest.add(vid);
            if (p.includes('/shop') || p.includes('/services/')) funnelCounts.intent.add(vid);
            if (l.event_type === 'contact_wa' || l.event_type === 'click_action') funnelCounts.action.add(vid);

            if (l.event_type === 'page_view') {
                const leave = sLogs.find(le => le.event_type === 'page_leave' && le.page_path === l.page_path);
                if (leave) {
                    const diff = (new Date(leave.created_at!).getTime() - new Date(l.created_at!).getTime()) / 1000;
                    if (diff > 1 && diff < 1800) {
                        totalEngagementSeconds += diff;
                        engagementCount++;
                        if (!pageDurations[p]) pageDurations[p] = [];
                        pageDurations[p].push(diff);
                    }
                }
            }
        });
    });

    const funnelStages: FunnelStage[] = [
        { label: 'TAMU', count: funnelCounts.awareness.size, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
        { label: 'KEPO', count: funnelCounts.interest.size, percentage: 0, dropOff: 0, icon: BookOpen, color: 'text-purple-400' },
        { label: 'NAKSIR', count: funnelCounts.intent.size, percentage: 0, dropOff: 0, icon: ShoppingBag, color: 'text-yellow-500' },
        { label: 'DEAL', count: funnelCounts.action.size, percentage: 0, dropOff: 0, icon: DollarSign, color: 'text-green-500' }
    ];

    const totalV = funnelStages[0].count || currKPI.visitors || 1;
    for (let i = 1; i < funnelStages.length; i++) {
        funnelStages[i].percentage = Math.round((funnelStages[i].count / totalV) * 100);
        funnelStages[i].dropOff = funnelStages[i-1].count > 0 ? Math.max(0, Math.round(((funnelStages[i-1].count - funnelStages[i].count) / funnelStages[i-1].count) * 100)) : 0;
    }

    return {
        totalViews: { value: currKPI.views, percentage: calculateTrend(currKPI.views, prevKPI.views) },
        uniqueVisitors: { value: currKPI.visitors, percentage: calculateTrend(currKPI.visitors, prevKPI.visitors) },
        totalActions: { value: currKPI.actions, percentage: calculateTrend(currKPI.actions, prevKPI.actions) },
        conversionRate: { value: currKPI.conv.toFixed(1), percentage: calculateTrend(currKPI.conv, prevKPI.conv) },
        trafficByDate, devices, osDist,
        sortedCities: Object.entries(cities).sort(([,a], [,b]) => b - a).slice(0, 8),
        demographics: { age: { "18-24": 25, "25-34": 45, "35-44": 20, "45+": 10 }, gender: { male: 65, female: 35 } },
        sortedPages: Object.entries(pageViews).map(([path, hits]) => ({ 
            path, hits, 
            avgTime: formatDuration((pageDurations[path] || []).reduce((a, b) => a + b, 0) / (pageDurations[path]?.length || 1)) 
        })).sort((a, b) => b.hits - a.hits),
        sortedReferrers: Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 15), 
        hours, newVisitors: 0, returningVisitors: 0, 
        bounceRate: currKPI.visitors > 0 ? Math.round((currKPI.visitors - funnelCounts.interest.size) / currKPI.visitors * 100) : 0, 
        avgPagesPerSession: currKPI.visitors > 0 ? (Object.keys(pageViews).length / currKPI.visitors).toFixed(1) : "0",
        sortedExitPages: Object.entries(exitCounts).sort(([,a], [,b]) => b - a).slice(0, 15), 
        avgEngagementTime: formatDuration(totalEngagementSeconds / (engagementCount || 1)),
        funnel: { stages: funnelStages, topPaths: [], conversionRate: currKPI.visitors > 0 ? (currKPI.actions / currKPI.visitors) * 100 : 0 }
    };
};