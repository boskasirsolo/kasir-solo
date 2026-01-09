
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { AnalyticsStats } from './types';

export const useAnalyticsData = () => {
  const [logs, setLogs] = useState<AnalyticsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7); // Default 7 days

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
    const totalActions = logs.filter(l => l.event_type !== 'page_view').length; 
    const conversionRate = totalViews > 0 ? ((totalActions / totalViews) * 100).toFixed(1) : '0';
    
    // 1. Traffic by Date
    const trafficByDate: Record<string, number> = {};
    const today = new Date();
    
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    // 2. Aggregators
    const pageViews: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    const visitorHistory: Record<string, string[]> = {}; 

    logs.forEach(log => {
      // Basic Date Map
      const d = new Date(log.created_at!);
      const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (trafficByDate.hasOwnProperty(dateKey) && log.event_type === 'page_view') {
        trafficByDate[dateKey]++;
      }

      if (log.event_type === 'page_view') {
        const path = log.page_path.split('?')[0]; 
        pageViews[path] = (pageViews[path] || 0) + 1;
        
        // Device
        if (log.device_type === 'mobile') devices.mobile++;
        else if (log.device_type === 'desktop') devices.desktop++;
        else devices.tablet++;

        // Referrer
        let ref = log.referrer || 'Direct';
        const lowerRef = ref.toLowerCase();
        if (lowerRef.includes('google')) ref = 'Google Search';
        else if (lowerRef.includes('facebook') || lowerRef.includes('fb')) ref = 'Facebook';
        else if (lowerRef.includes('instagram')) ref = 'Instagram';
        else if (lowerRef.includes('t.co') || lowerRef.includes('twitter')) ref = 'Twitter/X';
        else if (lowerRef.includes('tiktok')) ref = 'TikTok';
        else if (lowerRef === 'direct' || lowerRef === '') ref = 'Direct / WA';
        else {
            try {
                const url = new URL(ref);
                ref = url.hostname.replace('www.', '');
            } catch(e) { /* keep original */ }
        }
        referrers[ref] = (referrers[ref] || 0) + 1;

        // Hour
        const hour = new Date(log.created_at!).getHours();
        hours[hour]++;

        // Visitor Tracking
        if (!visitorHistory[log.visitor_id]) {
            visitorHistory[log.visitor_id] = [];
        }
        visitorHistory[log.visitor_id].push(path);
      }
    });

    // 3. Advanced Metrics
    let newVisitors = 0;
    let returningVisitors = 0;
    let singlePageVisits = 0;
    const exitPages: Record<string, number> = {};

    Object.entries(visitorHistory).forEach(([vid, pages]) => {
        if (pages.length === 1) {
            newVisitors++;
            singlePageVisits++;
        } else {
            returningVisitors++;
        }
        const lastPage = pages[pages.length - 1];
        exitPages[lastPage] = (exitPages[lastPage] || 0) + 1;
    });

    const bounceRate = uniqueVisitors > 0 ? Math.round((singlePageVisits / uniqueVisitors) * 100) : 0;
    const avgPagesPerSession = uniqueVisitors > 0 ? (totalViews / uniqueVisitors).toFixed(1) : "0";

    // UPDATED: No limit slice here, handled by UI pagination
    const sortedPages = Object.entries(pageViews).sort(([,a], [,b]) => b - a);
    
    const sortedReferrers = Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 5);
    const sortedExitPages = Object.entries(exitPages).sort(([,a], [,b]) => b - a).slice(0, 5);

    return { 
        totalViews, uniqueVisitors, totalActions, conversionRate,
        trafficByDate, sortedPages, devices, sortedReferrers, hours,
        newVisitors, returningVisitors, bounceRate, avgPagesPerSession, sortedExitPages
    };
  }, [logs, period]);

  return { stats, loading, period, setPeriod };
};
