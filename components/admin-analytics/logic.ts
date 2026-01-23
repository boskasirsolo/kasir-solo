
import { useState, useEffect } from 'react';
import { supabase } from '../../utils';
import { AnalyticsStats } from './types';
import { Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';

const INITIAL_STATS: AnalyticsStats = {
    totalViews: 0,
    uniqueVisitors: 0,
    totalActions: 0,
    conversionRate: '0.0',
    trafficByDate: {},
    sortedPages: [],
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    osDist: { "Windows": 0, "Android": 0, "iOS": 0 },
    sortedCities: [],
    demographics: {
        age: { "18-24": 0, "25-34": 0, "35-44": 0, "45+": 0 },
        gender: { male: 0, female: 0 }
    },
    sortedReferrers: [],
    hours: new Array(24).fill(0),
    newVisitors: 0,
    returningVisitors: 0,
    bounceRate: 0,
    avgPagesPerSession: "0",
    sortedExitPages: [],
    avgEngagementTime: "0s",
    funnel: {
        stages: [
            { label: 'TAMU', count: 0, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
            { label: 'KEPO', count: 0, percentage: 0, dropOff: 0, icon: BookOpen, color: 'text-purple-400' },
            { label: 'NAKSIR', count: 0, percentage: 0, dropOff: 0, icon: ShoppingBag, color: 'text-yellow-500' },
            { label: 'DEAL', count: 0, percentage: 0, dropOff: 0, icon: DollarSign, color: 'text-green-500' }
        ],
        topPaths: [],
        conversionRate: 0
    }
};

export const useAnalyticsData = () => {
  const [stats, setStats] = useState<AnalyticsStats>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7); 

  const fetchStats = async () => {
    if (!supabase) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
        const { data, error } = await supabase.rpc('get_analytics_summary', { 
            p_days: period 
        });

        if (error) throw error;

        if (data) {
            // 1. SAFE KPI CALCULATION
            const visitors = Number(data.unique_visitors || 0);
            const conversions = Number(data.total_conversions || 0);
            const convRate = visitors > 0 ? ((conversions / visitors) * 100).toFixed(1) : '0.0';

            // 2. ROBUST FUNNEL RECONSTRUCTION
            // Kita pastiin awareness minimal sama dengan unique visitors biar gak aneh di UI
            const f = data.funnel_stats || {};
            const awareness = Math.max(visitors, Number(f.awareness || 0));
            const interest = Number(f.interest || 0);
            const intent = Number(f.intent || 0);
            const action = Math.max(conversions, Number(f.action || 0));

            const stages = [
                { label: 'TAMU', count: awareness, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
                { label: 'KEPO', count: interest, percentage: awareness > 0 ? Math.round((interest/awareness)*100) : 0, dropOff: awareness > 0 ? Math.max(0, Math.round(((awareness-interest)/awareness)*100)) : 0, icon: BookOpen, color: 'text-purple-400' },
                { label: 'NAKSIR', count: intent, percentage: awareness > 0 ? Math.round((intent/awareness)*100) : 0, dropOff: interest > 0 ? Math.max(0, Math.round(((interest-intent)/interest)*100)) : 0, icon: ShoppingBag, color: 'text-yellow-500' },
                { label: 'DEAL', count: action, percentage: awareness > 0 ? Math.round((action/awareness)*100) : 0, dropOff: intent > 0 ? Math.max(0, Math.round(((intent-action)/intent)*100)) : 0, icon: DollarSign, color: 'text-green-500' }
            ];

            // 3. ROBUST DATE MAPPING FOR CHART
            const processedTraffic: Record<string, number> = {};
            const today = new Date();
            
            // Create template based on ISO Date key for stability
            const dateTemplate: Record<string, { label: string, count: number }> = {};
            for (let i = period - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const isoKey = d.toISOString().split('T')[0];
                const displayLabel = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                dateTemplate[isoKey] = { label: displayLabel, count: 0 };
            }

            // Fill template with data from DB
            if (data.traffic_by_date) {
                Object.entries(data.traffic_by_date).forEach(([dbDate, count]) => {
                    // dbDate bisa format "2024-03-20" atau full ISO
                    const isoKey = dbDate.split('T')[0];
                    if (dateTemplate[isoKey]) {
                        dateTemplate[isoKey].count = Number(count);
                    }
                });
            }

            // Reconstruct processedTraffic for the UI
            Object.values(dateTemplate).forEach(item => {
                processedTraffic[item.label] = item.count;
            });

            // 4. ROBUST REFERRER MAPPING
            let mappedReferrers: [string, number][] = [];
            if (data.top_referrers) {
                if (Array.isArray(data.top_referrers)) {
                    mappedReferrers = data.top_referrers.map((r: any) => [r.source || 'Direct', Number(r.count || 0)]);
                } else {
                    mappedReferrers = Object.entries(data.top_referrers).map(([name, count]) => [name, Number(count)]);
                }
            }

            setStats(prev => ({
                ...prev,
                totalViews: Number(data.total_views || 0),
                uniqueVisitors: visitors,
                totalActions: action,
                conversionRate: convRate,
                devices: {
                    mobile: Number(data.device_stats?.mobile || 0),
                    desktop: Number(data.device_stats?.desktop || 0),
                    tablet: Number(data.device_stats?.tablet || 0)
                },
                sortedPages: (data.top_pages || []).map((p: any) => ({
                    path: p.path,
                    hits: Number(p.hits || 0),
                    avgTime: p.avg_time || '1m 20s'
                })),
                trafficByDate: processedTraffic,
                sortedReferrers: mappedReferrers.sort((a, b) => b[1] - a[1]),
                funnel: {
                    stages: stages,
                    topPaths: (data.top_pages || []).slice(0, 3).map((p: any) => ({ path: p.path, count: Number(p.hits || 0) })),
                    conversionRate: awareness > 0 ? (action / awareness) * 100 : 0
                }
            }));
        }
    } catch (e) {
        console.error("Gagal ambil data analitik:", e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return { stats, loading, period, setPeriod, refresh: fetchStats };
};
