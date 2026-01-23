
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
  const [period, setPeriod] = useState(30);

  const fetchStats = async () => {
    if (!supabase) {
        setLoading(false);
        return;
    }
    
    setLoading(true);
    try {
        // Set timeout manual biar gak nunggu selamanya
        const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Koneksi Supabase Kelamaan, Bos!')), 5000)
        );

        const rpcPromise = supabase.rpc('get_analytics_summary', { p_days: period });
        
        const { data, error }: any = await Promise.race([rpcPromise, timeoutPromise]);

        if (error) throw error;

        if (data) {
            const visitors = Number(data.unique_visitors || 0);
            const conversions = Number(data.total_conversions || 0);
            const convRate = visitors > 0 ? ((conversions / visitors) * 100).toFixed(1) : '0.0';

            setStats({
                ...INITIAL_STATS,
                totalViews: Number(data.total_views || 0),
                uniqueVisitors: visitors,
                totalActions: conversions,
                conversionRate: convRate,
                trafficByDate: data.traffic_by_date || {},
                sortedPages: (data.top_pages || []).map((p: any) => ({
                    path: p.path,
                    hits: Number(p.hits || 0),
                    avgTime: '2m'
                })),
                devices: {
                    mobile: Number(data.device_stats?.mobile || 0),
                    desktop: Number(data.device_stats?.desktop || 0),
                    tablet: Number(data.device_stats?.tablet || 0)
                },
                osDist: data.os_dist || INITIAL_STATS.osDist,
                sortedCities: data.city_dist ? Object.entries(data.city_dist) : []
            } as any);
        }
    } catch (e) {
        console.warn("Radar Analytics Gagal (Mungkin RPC Belum Dibuat):", e);
        // Jangan biarkan error bikin UI macet, kasih data kosong aja
        setStats(INITIAL_STATS);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [period]);

  return { stats, loading, period, setPeriod, refresh: fetchStats };
};
