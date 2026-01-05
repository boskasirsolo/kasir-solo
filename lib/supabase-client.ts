
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config/env';

// Helper to validate URL structure to prevent "ERR_NAME_NOT_RESOLVED" in console
// Also checks if it looks like a valid Supabase project URL or localhost
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
// Only initialize if config exists AND is a valid URL structure.
// This prevents the browser from trying to connect to "undefined" or placeholders.
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
      // Retry configuration to reduce console noise on network blips
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    }) 
  : null;
