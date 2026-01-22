
import { useState, useEffect } from 'react';
import { supabase } from '../../utils';
import { AnalyticsStats } from './types';

export const useAnalyticsData = () => {
  const [stats, setStats] = useState<Partial<AnalyticsStats>>({});
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7); 

  useEffect(() => {
    fetchStats();
  }, [period]);

  const fetchStats = async () => {
    if (!supabase) return;
    setLoading(true);
    
    try {
        // MANGGIL MANTRA DATABASE (RPC)
        const { data, error } = await supabase.rpc('get_analytics_summary', { 
            p_days: period 
        });

        if (error) throw error;

        // Map data dari database (snake_case) ke state (sesuai UI)
        if (data) {
            setStats({
                totalViews: data.total_views,
                uniqueVisitors: data.unique_visitors,
                totalActions: data.total_conversions,
                conversionRate: data.unique_visitors > 0 ? ((data.total_conversions / data.unique_visitors) * 100).toFixed(1) : '0',
                devices: {
                    mobile: data.device_stats?.mobile || 0,
                    desktop: data.device_stats?.desktop || 0,
                    tablet: data.device_stats?.tablet || 0
                },
                osDist: data.os_stats || {},
                sortedPages: data.top_pages || [],
                // Trend harian tetap bisa ditarik lewat RPC jika dibutuhkan detail grafisnya
                trafficByDate: {} 
            } as any);
        }
    } catch (e) {
        console.error("Gagal ambil statistik via RPC:", e);
    } finally {
        setLoading(false);
    }
  };

  return { stats: stats as AnalyticsStats, loading, period, setPeriod, refresh: fetchStats };
};
