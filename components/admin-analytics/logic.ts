
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
    osDist: {},
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
            { label: 'TAMU', count: 0, percentage: 0, dropOff: 0, icon: Search, color: 'text-blue-400' },
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
    // FIX: Set loading false if supabase is missing to prevent infinite spinner
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
            setStats(prev => ({
                ...prev,
                totalViews: data.total_views || 0,
                uniqueVisitors: data.unique_visitors || 0,
                totalActions: data.total_conversions || 0,
                conversionRate: data.unique_visitors > 0 ? ((data.total_conversions / data.unique_visitors) * 100).toFixed(1) : '0',
                devices: {
                    mobile: data.device_stats?.mobile || 0,
                    desktop: data.device_stats?.desktop || 0,
                    tablet: data.device_stats?.tablet || 0
                },
                osDist: data.os_stats || {},
                sortedPages: data.top_pages || [],
                // Mapping extra fields with safety
                trafficByDate: data.traffic_by_date || {},
                sortedReferrers: data.top_referrers ? Object.entries(data.top_referrers) : [],
                avgEngagementTime: data.avg_session_duration || "0s"
            }));
        }
    } catch (e) {
        console.error("Analytics Error (Check if RPC exists):", e);
        // On error, we still need to stop loading
    } finally {
        setLoading(false);
    }
  };

  return { stats, loading, period, setPeriod, refresh: fetchStats };
};
