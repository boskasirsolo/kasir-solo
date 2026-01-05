
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config/env';

// Helper to validate URL structure
const isValidUrl = (urlString: string) => {
  try { 
    const url = new URL(urlString);
    // Basic check: must be http/https and have a hostname
    if (!url.protocol.startsWith('http') || !url.hostname) return false;
    // Filter out obvious placeholders
    if (url.hostname.includes('placeholder') || url.hostname.includes('your-project')) return false;
    return true; 
  } catch(e) { 
    return false; 
  }
};

// --- Clients ---
export const supabase = (
  CONFIG.SUPABASE_URL && 
  CONFIG.SUPABASE_KEY && 
  isValidUrl(CONFIG.SUPABASE_URL)
) 
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      },
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    }) 
  : null;
