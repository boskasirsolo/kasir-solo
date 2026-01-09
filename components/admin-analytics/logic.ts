
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';
import { AnalyticsLog } from '../../types';
import { AnalyticsStats } from './types';

// Helper: Format seconds to "1m 30s" or "45s"
const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
};

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
      .order('created_at', { ascending: true }); // Penting: Ascending untuk urutan waktu

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
    
    // Data Structures
    const trafficByDate: Record<string, number> = {};
    const pageViews: Record<string, number> = {};
    const devices = { mobile: 0, desktop: 0, tablet: 0 };
    const referrers: Record<string, number> = {};
    const hours: number[] = new Array(24).fill(0);
    
    // Session & Duration Logic
    const visitorSessions: Record<string, AnalyticsLog[]> = {};
    const pageDurations: Record<string, number[]> = {}; // path -> array of seconds
    let totalEngagementSeconds = 0;
    let engagementCount = 0;

    // 1. Group Logs by Visitor
    logs.forEach(log => {
        if (!visitorSessions[log.visitor_id]) visitorSessions[log.visitor_id] = [];
        visitorSessions[log.visitor_id].push(log);
    });

    // 2. Process Durations (Now utilizing page_leave)
    Object.values(visitorSessions).forEach(sessionLogs => {
        // Sort by time just in case
        sessionLogs.sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());

        for (let i = 0; i < sessionLogs.length; i++) {
            const current = sessionLogs[i];
            
            // Only calc duration for page views
            if (current.event_type === 'page_view') {
                let duration = 0;
                
                // Look ahead for the immediate next event (leave or next view)
                const nextEvent = sessionLogs[i+1];

                if (nextEvent) {
                    const startTime = new Date(current.created_at!).getTime();
                    const endTime = new Date(nextEvent.created_at!).getTime();
                    const diff = (endTime - startTime) / 1000;

                    // Logic: 
                    // If next event is 'page_leave' of SAME path, use it.
                    // If next event is 'page_view' of DIFFERENT path, use it as exit time.
                    // Timeout check: 30 mins (1800s).
                    if (diff < 1800 && diff > 0) {
                        duration = diff;
                    }
                }

                // If duration found, record it
                if (duration > 0) {
                    const path = current.page_path.split('?')[0];
                    if (!pageDurations[path]) pageDurations[path] = [];
                    pageDurations[path].push(duration);
                    
                    totalEngagementSeconds += duration;
                    engagementCount++;
                }
            }
        }
    });

    // 3. General Aggregation
    const today = new Date();
    for (let i = period - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        trafficByDate[key] = 0;
    }

    const visitorHistory: Record<string, string[]> = {}; 

    logs.forEach(log => {
      // Date Map
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

    // 4. Advanced Metrics
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
    
    const avgEngagementTime = engagementCount > 0 
        ? formatDuration(totalEngagementSeconds / engagementCount) 
        : "0s";

    // 5. Final Sorting for Top Pages (With Duration)
    const sortedPages = Object.entries(pageViews)
        .map(([path, hits]) => {
            const durations = pageDurations[path] || [];
            const avgSec = durations.length > 0 
                ? durations.reduce((a, b) => a + b, 0) / durations.length 
                : 0;
            return {
                path,
                hits,
                avgTime: avgSec > 0 ? formatDuration(avgSec) : '-'
            };
        })
        .sort((a, b) => b.hits - a.hits); // Tetap sort by hits
    
    const sortedReferrers = Object.entries(referrers).sort(([,a], [,b]) => b - a).slice(0, 5);
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
