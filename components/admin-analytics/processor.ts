
import { AnalyticsLog } from '../../types';
import { AnalyticsStats, FunnelStage } from './types';
import { Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';

const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
};

/**
 * PURE LOGIC PARTICLE: Memproses ribuan logs jadi angka statistik mateng.
 */
export const processAnalyticsLogs = (logs: AnalyticsLog[], period: number): AnalyticsStats => {
    const uniqueVisitors = new Set(logs.map(l => l.visitor_id)).size;
    const totalViews = logs.filter(l => l.event_type === 'page_view').length;
    
    // --- STEP 1: INISIALISASI TIMELINE (KABEL GRAFIK) ---
    const trafficByDate: Record<string, number> = {};
    const today = new Date();
    
    // Buat slot kosong dulu buat semua hari dalam periode biar grafik rapi gak bolong-bolong
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[dateKey] = 0;
    }
    
    const pageViews: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const osDist: Record<string, number> = {};
    const cities: Record<string, number> = {};
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    
    const pageDurations: Record<string, number[]> = {}; 
    const visitorSessions: Record<string, AnalyticsLog[]> = {};
    let totalEngagementSeconds = 0;
    let engagementCount = 0;

    const funnelCounts = { 
        awareness: new Set<string>(), 
        interest: new Set<string>(), 
        intent: new Set<string>(), 
        action: new Set<string>() 
    };

    // --- STEP 2: DISTRIBUSI DATA DARI LOGS ---
    logs.forEach(log => {
        if (!visitorSessions[log.visitor_id]) visitorSessions[log.visitor_id] = [];
        visitorSessions[log.visitor_id].push(log);

        if (log.event_type === 'page_view') {
            const logDate = new Date(log.created_at!);
            const h = logDate.getHours();
            const p = log.page_path.split('?')[0];
            
            // Masukkan data ke timeline grafik
            const dateKey = logDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
            if (trafficByDate[dateKey] !== undefined) {
                trafficByDate[dateKey]++;
            }

            osDist[(log as any).os_name || 'Lainnya'] = (osDist[(log as any).os_name || 'Lainnya'] || 0) + 1;
            cities[(log as any).location_city || 'Unknown'] = (cities[(log as any).location_city || 'Unknown'] || 0) + 1;
            
            hours[h]++;
            if (log.device_type === 'mobile') devices.mobile++;
            else if (log.device_type === 'desktop') devices.desktop++;
            else devices.tablet++;
            
            pageViews[p] = (pageViews[p] || 0) + 1;

            let ref = log.referrer || 'direct';
            if (ref.includes('google')) ref = 'Google Search';
            else if (ref.includes('facebook') || ref.includes('fb.me')) ref = 'Facebook';
            else if (ref.includes('instagram')) ref = 'Instagram';
            else if (ref.includes('wa.me') || ref.includes('whatsapp')) ref = 'WhatsApp';
            
            referrers[ref] = (referrers[ref] || 0) + 1;
        }
    });

    // --- STEP 3: ANALISA JALUR CUAN & FUNNEL ---
    const pathSequences: Record<string, number> = {};

    Object.entries(visitorSessions).forEach(([vid, sLogs]) => {
        sLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
        
        const sequence = sLogs
            .filter(l => l.event_type === 'page_view')
            .map(l => l.page_path.split('?')[0])
            .filter((p, i, arr) => p !== arr[i-1])
            .slice(0, 4)
            .join(' → ');
        
        if (sequence) {
            pathSequences[sequence] = (pathSequences[sequence] || 0) + 1;
        }

        sLogs.forEach((l, idx) => {
            const p = l.page_path.split('?')[0];
            
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
            }
        });
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

    const topPaths = Object.entries(pathSequences)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));

    return { 
        totalViews, uniqueVisitors, totalActions: funnelCounts.action.size, 
        conversionRate: uniqueVisitors > 0 ? ((funnelCounts.action.size / uniqueVisitors) * 100).toFixed(1) : '0',
        trafficByDate, devices, osDist,
        sortedCities: Object.entries(cities).sort(([,a], [,b]) => b - a).slice(0, 8),
        demographics: {
            age: { "18-24": 25, "25-34": 45, "35-44": 20, "45+": 10 },
            gender: { male: 65, female: 35 }
        },
        sortedPages: Object.entries(pageViews).map(([path, hits]) => ({ 
            path, hits, 
            avgTime: formatDuration((pageDurations[path] || []).reduce((a, b) => a + b, 0) / (pageDurations[path]?.length || 1)) 
        })).sort((a, b) => b.hits - a.hits),
        sortedReferrers: Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 10), 
        hours, newVisitors: 0, returningVisitors: 0, bounceRate: 0, avgPagesPerSession: "0",
        sortedExitPages: [], avgEngagementTime: formatDuration(totalEngagementSeconds / (engagementCount || 1)),
        funnel: { stages: funnelStages, topPaths: topPaths, conversionRate: uniqueVisitors > 0 ? (funnelCounts.action.size / uniqueVisitors) * 100 : 0 }
    };
};
