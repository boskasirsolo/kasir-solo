
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils';

const GHOST_KEY = 'mks_ghost_mode';
const VISITOR_KEY = 'mks_visitor_id';

// Helper to check device type
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
};

// Helper to get or create visitor ID
const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

// --- MAIN HOOK ---
export const useAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Use a ref to ensure we only track once per page load/change, preventing strict mode double firing
  const trackedPath = useRef<string | null>(null);

  // 1. Ghost Mode Logic (The Invisible Cloak)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'ghost_access') {
      localStorage.setItem(GHOST_KEY, 'true');
      alert("👻 GHOST MODE ACTIVATED! Perangkat ini aman dari tracking.");
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  // 2. Tracking Logic (View & Leave)
  useEffect(() => {
    // Delay to let Ghost Mode logic settle
    const timer = setTimeout(() => {
        const isGhost = localStorage.getItem(GHOST_KEY) === 'true';
        const isAdminRoute = location.pathname.startsWith('/admin');

        if (isGhost) return;
        if (isAdminRoute) return;
        if (!supabase) return;

        // Prevent double tracking same path in React StrictMode
        if (trackedPath.current === location.pathname) return;
        trackedPath.current = location.pathname;

        const visitorId = getVisitorId();
        const deviceType = getDeviceType();
        const currentPath = location.pathname;

        // A. TRACK PAGE VIEW (Entry)
        const trackPageView = async () => {
            try {
                await supabase.from('analytics_logs').insert([{
                    visitor_id: visitorId,
                    event_type: 'page_view',
                    page_path: currentPath,
                    device_type: deviceType,
                    referrer: document.referrer || 'direct'
                }]);
            } catch (e) {
                console.error("Analytics Error", e);
            }
        };

        trackPageView();

        // B. TRACK PAGE LEAVE (Exit - For Duration Calculation)
        return () => {
            if (isGhost || isAdminRoute || !supabase) return;
            // Fire and forget 'page_leave' event
            // Note: This relies on component unmount (route change).
            // For tab close, 'navigator.sendBeacon' is ideal but requires a dedicated API endpoint.
            // Using supabase.insert here works for SPA navigation (90% of cases).
            supabase.from('analytics_logs').insert([{
                visitor_id: visitorId,
                event_type: 'page_leave',
                page_path: currentPath,
                device_type: deviceType,
                referrer: 'internal_exit'
            }]).then(() => {}); 
        };

    }, 1000); 

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 3. Manual Event Trigger (untuk tombol WA/Beli)
  const trackEvent = async (eventName: 'click_action' | 'contact_wa', details?: string) => {
    if (localStorage.getItem(GHOST_KEY) === 'true' || !supabase) return;
    
    try {
      await supabase.from('analytics_logs').insert([{
        visitor_id: getVisitorId(),
        event_type: eventName,
        page_path: location.pathname + (details ? `?details=${details}` : ''),
        device_type: getDeviceType(),
        referrer: document.referrer || 'direct'
      }]);
    } catch (e) { console.error("Event Error", e); }
  };

  return { trackEvent };
};

// Helper untuk mengaktifkan ghost mode saat login admin
export const activateGhostMode = () => {
  localStorage.setItem(GHOST_KEY, 'true');
};
