
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
            // 1. SAFE KPI CALCULATION (Fix Point 1)
            const visitors = Number(data.unique_visitors || 0);
            const conversions = Number(data.total_conversions || 0);
            const convRate = visitors > 0 ? ((conversions / visitors) * 100).toFixed(1) : '0.0';

            // 2. FUNNEL RECONSTRUCTION (Fix Point 3 & 4)
            const f = data.funnel_stats || {};
            const awareness = Number(f.awareness || data.unique_visitors || 0);
            const interest = Number(f.interest || 0);
            const intent = Number(f.intent || 0);
            const action = Number(f.action || data.total_conversions || 0);

            const stages = [
                { label: 'TAMU', count: awareness, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
                { label: 'KEPO', count: interest, percentage: awareness > 0 ? Math.round((interest/awareness)*100) : 0, dropOff: awareness > 0 ? Math.round(((awareness-interest)/awareness)*100) : 0, icon: BookOpen, color: 'text-purple-400' },
                { label: 'NAKSIR', count: intent, percentage: awareness > 0 ? Math.round((intent/awareness)*100) : 0, dropOff: interest > 0 ? Math.round(((interest-intent)/interest)*100) : 0, icon: ShoppingBag, color: 'text-yellow-500' },
                { label: 'DEAL', count: action, percentage: awareness > 0 ? Math.round((action/awareness)*100) : 0, dropOff: intent > 0 ? Math.round(((intent-action)/intent)*100) : 0, icon: DollarSign, color: 'text-green-500' }
            ];

            // 3. DATE SYNC FOR CHART (Fix Point 5)
            // Pastikan keys di trafficByDate match dengan apa yang di-render di ui-charts.tsx
            const processedTraffic: Record<string, number> = {};
            const today = new Date();
            for (let i = period - 1; i >= 0; i--) {
                const d = new Date();
                d.setDate(today.getDate() - i);
                const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                processedTraffic[key] = 0;
            }

            // Gabungkan data dari DB ke template tanggal
            if (data.traffic_by_date) {
                Object.entries(data.traffic_by_date).forEach(([dbDate, count]) => {
                    const d = new Date(dbDate);
                    const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                    if (processedTraffic.hasOwnProperty(key)) {
                        processedTraffic[key] = Number(count);
                    }
                });
            }

            setStats(prev => ({
                ...prev,
                totalViews: Number(data.total_views || 0),
                uniqueVisitors: visitors,
                totalActions: conversions,
                conversionRate: convRate,
                devices: {
                    mobile: Number(data.device_stats?.mobile || 0),
                    desktop: Number(data.device_stats?.desktop || 0),
                    tablet: Number(data.device_stats?.tablet || 0)
                },
                sortedPages: (data.top_pages || []).map((p: any) => ({
                    path: p.path,
                    hits: Number(p.hits || 0),
                    avgTime: '1m 20s'
                })),
                trafficByDate: processedTraffic,
                sortedReferrers: Object.entries(data.top_referrers || {}).map(([name, count]) => [name, Number(count)] as [string, number]),
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
