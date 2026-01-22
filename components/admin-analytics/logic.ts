
import { useState, useEffect } from 'react';
import { supabase } from '../../utils';
import { AnalyticsStats } from './types';
import { Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';

const INITIAL_STATS: AnalyticsStats = {
    totalViews: 0,
    uniqueVisitors: 0,
    totalActions: 0,
    conversionRate: '0',
    trafficByDate: {},
    sortedPages: [],
    devices: { mobile: 0, desktop: 0, tablet: 0 },
    osDist: { "Windows": 0, "Android": 0, "iOS": 0 },
    sortedCities: [],
    demographics: {
        age: { "18-24": 15, "25-34": 40, "35-44": 25, "45+": 20 },
        gender: { male: 60, female: 40 }
    },
    sortedReferrers: [],
    hours: new Array(24).fill(0),
    newVisitors: 0,
    returningVisitors: 0,
    bounceRate: 45,
    avgPagesPerSession: "3.2",
    sortedExitPages: [],
    avgEngagementTime: "2m 14s",
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

  useEffect(() => {
    fetchStats();
  }, [period]);

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
            // Kalkulasi Drop-off Funnel
            const f = data.funnel_stats;
            const awareness = f?.awareness || 0;
            const interest = f?.interest || 0;
            const intent = f?.intent || 0;
            const action = f?.action || 0;

            const stages = [
                { label: 'TAMU', count: awareness, percentage: 100, dropOff: 0, icon: Search, color: 'text-blue-400' },
                { label: 'KEPO', count: interest, percentage: awareness > 0 ? Math.round((interest/awareness)*100) : 0, dropOff: awareness > 0 ? Math.round(((awareness-interest)/awareness)*100) : 0, icon: BookOpen, color: 'text-purple-400' },
                { label: 'NAKSIR', count: intent, percentage: awareness > 0 ? Math.round((intent/awareness)*100) : 0, dropOff: interest > 0 ? Math.round(((interest-intent)/interest)*100) : 0, icon: ShoppingBag, color: 'text-yellow-500' },
                { label: 'DEAL', count: action, percentage: awareness > 0 ? Math.round((action/awareness)*100) : 0, dropOff: intent > 0 ? Math.round(((intent-action)/intent)*100) : 0, icon: DollarSign, color: 'text-green-500' }
            ];

            setStats(prev => ({
                ...prev,
                totalViews: data.total_views || 0,
                uniqueVisitors: data.unique_visitors || 0,
                totalActions: data.total_conversions || 0,
                conversionRate: data.unique_visitors > 0 
                    ? ((data.total_conversions / data.unique_visitors) * 100).toFixed(1) 
                    : '0',
                devices: {
                    mobile: data.device_stats?.mobile || 0,
                    desktop: data.device_stats?.desktop || 0,
                    tablet: data.device_stats?.tablet || 0
                },
                sortedPages: (data.top_pages || []).map((p: any) => ({
                    path: p.path,
                    hits: p.hits,
                    avgTime: '1m 20s'
                })),
                trafficByDate: data.traffic_by_date || {},
                sortedReferrers: Object.entries(data.top_referrers || {}).map(([name, count]) => [name, count as number] as [string, number]),
                funnel: {
                    stages: stages,
                    topPaths: (data.top_pages || []).slice(0, 3).map((p: any) => ({ path: p.path, count: p.hits })),
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

  return { stats, loading, period, setPeriod, refresh: fetchStats };
};
