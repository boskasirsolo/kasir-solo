
import { useState, useEffect } from 'react';
import { supabase } from '../../utils';
import { AnalyticsStats } from './types';
import { Search, BookOpen, ShoppingBag, DollarSign } from 'lucide-react';
import { processAnalyticsLogs } from './processor'; // SAMBUNG KABEL KE PROCESSOR

const INITIAL_STATS: AnalyticsStats = {
    totalViews: 0,
    uniqueVisitors: 0,
    totalActions: 0,
    conversionRate: '0.0',
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
        // --- AUDIT KABEL: TARIK DATA MENTAH DARI TABEL SESUAI SKEMA ---
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - period);
        
        const { data: logs, error } = await supabase
            .from('analytics_logs')
            .select('*')
            .gte('created_at', dateThreshold.toISOString());
        
        if (error) throw error;

        if (logs && logs.length > 0) {
            // --- SAMBUNG KE MESIN PENGOLAH (PROCESSOR) ---
            const processedStats = processAnalyticsLogs(logs, period);
            setStats(processedStats);
        } else {
            setStats(INITIAL_STATS);
        }
    } catch (e) {
        console.error("Audit Kabel Gagal, Jalur Putus:", e);
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
