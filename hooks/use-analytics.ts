
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
  // Logic ini harus jalan SEBELUM tracking
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'ghost_access') {
      localStorage.setItem(GHOST_KEY, 'true');
      alert("👻 GHOST MODE ACTIVATED! Perangkat ini aman dari tracking.");
      
      // Clean up URL agar rapi (hapus parameter mode=ghost_access)
      // Kita pakai navigate dengan replace: true agar tidak merusak history back button
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  // 2. Tracking Logic
  useEffect(() => {
    // Delay sedikit untuk memastikan logic Ghost Mode (efek di atas) selesai dijalankan dulu
    const timer = setTimeout(() => {
        // Cek status Ghost Mode SAAT INI
        const isGhost = localStorage.getItem(GHOST_KEY) === 'true';
        const isAdminRoute = location.pathname.startsWith('/admin');

        if (isGhost) return; // Silent return for ghost
        if (isAdminRoute) return; // Silent return for admin page

        if (!supabase) return;

        // Prevent double tracking same path (React.StrictMode mitigation)
        if (trackedPath.current === location.pathname) return;
        trackedPath.current = location.pathname;

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
                console.error("Analytics Error", e);
            }
        };

        trackPageView();
    }, 1500); // 1.5 detik delay cukup

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
