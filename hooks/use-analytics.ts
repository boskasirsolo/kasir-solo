
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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

  // 1. Ghost Mode Logic (The Invisible Cloak)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'hantu') {
      localStorage.setItem(GHOST_KEY, 'true');
      alert("👻 GHOST MODE ACTIVATED! Traffic Anda tidak akan dilacak.");
    }
  }, [location.search]);

  // 2. Tracking Logic
  useEffect(() => {
    // Stop if Ghost Mode is active
    if (localStorage.getItem(GHOST_KEY) === 'true') {
      // console.log("👻 Analytics bypassed (Ghost Mode)");
      return;
    }

    if (!supabase) return;

    const trackPageView = async () => {
      try {
        await supabase.from('analytics_logs').insert([{
          visitor_id: getVisitorId(),
          event_type: 'page_view',
          page_path: location.pathname,
          device_type: getDeviceType(),
          referrer: document.referrer || 'direct'
        }]);
      } catch (e) {
        // Silent fail (jangan ganggu user experience)
        console.error("Analytics Error", e);
      }
    };

    trackPageView();
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
