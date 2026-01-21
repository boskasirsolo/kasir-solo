
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { AnalyticsStats } from './types';

// Helper: Format detik jadi "1m 30s"
const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
};

export const useAnalyticsData = () => {
  const [logs, setLogs] = useState<AnalyticsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(7); 

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
    const totalActions = logs.filter(l => l.event_type === 'click_action' || l.event_type === 'contact_wa').length; 
    const conversionRate = totalViews > 0 ? ((totalActions / totalViews) * 100).toFixed(1) : '0';
    
    const trafficByDate: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    
    // Logic Durasi & Sesi
    const visitorSessions: Record<string, AnalyticsLog[]> = {};
    const pageDurations: Record<string, number[]> = {}; 
    let totalEngagementSeconds = 0;
    let engagementCount = 0;

    logs.forEach(log => {
        if (!visitorSessions[log.visitor_id]) visitorSessions[log.visitor_id] = [];
        visitorSessions[log.visitor_id].push(log);
    });

    Object.values(visitorSessions).forEach(sessionLogs => {
        sessionLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());

        for (let i = 0; i < sessionLogs.length; i++) {
            const current = sessionLogs[i];
            if (current.event_type === 'page_view') {
                const nextEvent = sessionLogs[i+1];
                if (nextEvent) {
                    const startTime = new Date(current.created_at!).getTime();
                    const endTime = new Date(nextEvent.created_at!).getTime();
                    const diff = (endTime - startTime) / 1000;

                    // Timeout check: 30 menit ga gerak = sesi dianggap beres
                    if (diff < 1800 && diff > 0) {
                        const path = current.page_path.split('?')[0];
                        if (!pageDurations[path]) pageDurations[path] = [];
                        pageDurations[path].push(diff);
                        totalEngagementSeconds += diff;
                        engagementCount++;
                    }
                }
            }
        }
    });

    // Inisialisasi tanggal kosong biar chart gak bolong
    const today = new Date();
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    const visitorHistory: Record<string, string[]> = {}; 

    logs.forEach(log => {
      const d = new Date(log.created_at!);
      const dateKey = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (trafficByDate.hasOwnProperty(dateKey) && log.event_type === 'page_view') {
        trafficByDate[dateKey]++;
      }

      if (log.event_type === 'page_view') {
        const path = log.page_path.split('?')[0]; 
        pageViews[path] = (pageViews[path] || 0) + 1;
        
        if (log.device_type === 'mobile') devices.mobile++;
        else if (log.device_type === 'desktop') devices.desktop++;
        else devices.tablet++;

        let ref = log.referrer || 'Direct';
        const lowerRef = ref.toLowerCase();
        
        if (lowerRef.includes('google')) ref = 'Google Search';
        else if (lowerRef.includes('facebook') || lowerRef.includes('fb')) ref = 'Facebook';
        else if (lowerRef.includes('instagram')) ref = 'Instagram';
        else if (lowerRef.includes('whatsapp') || lowerRef.includes('wa.me')) ref = 'WhatsApp';
        else if (lowerRef === 'direct' || lowerRef === '') ref = 'Direct Traffic';
        else {
            try { ref = new URL(ref).hostname.replace('www.', ''); } catch(e) {}
        }
        referrers[ref] = (referrers[ref] || 0) + 1;

        const hour = new Date(log.created_at!).getHours();
        hours[hour]++;

        if (!visitorHistory[log.visitor_id]) visitorHistory[log.visitor_id] = [];
        visitorHistory[log.visitor_id].push(path);
      }
    });

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
    const avgEngagementTime = engagementCount > 0 ? formatDuration(totalEngagementSeconds / engagementCount) : "0s";

    const sortedPages = Object.entries(pageViews)
        .map(([path, hits]) => {
            const durations = pageDurations[path] || [];
            const avgSec = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
            return { path, hits, avgTime: avgSec > 0 ? formatDuration(avgSec) : '-' };
        })
        .sort((a, b) => b.hits - a.hits); 
    
    const sortedReferrers = Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 10);
    const sortedExitPages = Object.entries(exitPages).sort(([,a], [,b]) => b - a).slice(0, 5);

    return { 
        totalViews, uniqueVisitors, totalActions, conversionRate,
        trafficByDate, sortedPages, devices, sortedReferrers, hours,
        newVisitors, returningVisitors, bounceRate, avgPagesPerSession, sortedExitPages,
        avgEngagementTime
    };
  }, [logs, period]);

  return { stats, loading, period, setPeriod };
};
