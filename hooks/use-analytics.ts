import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../utils';

const GHOST_KEY = 'mks_ghost_mode';
const VISITOR_KEY = 'mks_visitor_id';

// --- HELPER: DETEKSI OS ---
const getOS = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/iPad|iPhone|iPod/.test(ua)) return 'iOS';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Mac/i.test(ua)) return 'MacOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Lainnya';
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return 'tablet';
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return 'mobile';
  return 'desktop';
};

const getVisitorId = () => {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
};

export const useAnalytics = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trackedPath = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('mode') === 'ghost_access') {
      localStorage.setItem(GHOST_KEY, 'true');
      alert("👻 GHOST MODE ACTIVATED! Perangkat ini aman dari tracking.");
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);

  useEffect(() => {
    const isGhost = localStorage.getItem(GHOST_KEY) === 'true';
    const isAdminRoute = location.pathname.startsWith('/admin');
    
    // CRITICAL: Exit early if ghost
    if (isGhost || isAdminRoute || !supabase) return;

    const timer = setTimeout(async () => {
        if (trackedPath.current === location.pathname) return;
        trackedPath.current = location.pathname;

        const visitorId = getVisitorId();
        const deviceType = getDeviceType();
        const osName = getOS();
        const currentPath = location.pathname;

        // --- GEO LOCATION DETECTION (IP-BASED) ---
        let city = 'Unknown';
        try {
            const geoRes = await fetch('https://ipapi.co/json/');
            const geoData = await geoRes.json();
            city = geoData.city || 'Unknown';
        } catch (e) {
            console.warn("Geo lookup failed, using fallback.");
        }

        const params = new URLSearchParams(location.search);
        const urlSource = params.get('utm_source') || params.get('source') || params.get('ref');
        
        let finalReferrer = document.referrer;
        if (urlSource) finalReferrer = urlSource;
        else if (!finalReferrer) finalReferrer = 'direct';

        // A. TRACK PAGE VIEW (ENTRY)
        try {
            await supabase.from('analytics_logs').insert([{
                visitor_id: visitorId,
                event_type: 'page_view',
                page_path: currentPath,
                device_type: deviceType,
                referrer: finalReferrer,
                location_city: city,
                os_name: osName
            }]);
        } catch (e) { console.error("Analytics Error", e); }

    }, 1000); 

    // B. CLEANUP TRACKING (LEAVE)
    return () => {
        clearTimeout(timer);
        // CRITICAL: Double check ghost mode before cleanup execution
        const ghostActive = localStorage.getItem(GHOST_KEY) === 'true';
        if (ghostActive || isAdminRoute || !supabase) return;

        const currentPath = location.pathname;
        const visitorId = getVisitorId();
        const deviceType = getDeviceType();
        const osName = getOS();

        supabase.from('analytics_logs').insert([{
            visitor_id: visitorId,
            event_type: 'page_leave',
            page_path: currentPath,
            device_type: deviceType,
            referrer: 'internal_exit',
            os_name: osName
        }]).then(() => {}); 
    };
  }, [location.pathname]);

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

export const activateGhostMode = () => {
  localStorage.setItem(GHOST_KEY, 'true');
};