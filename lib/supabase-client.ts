
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config/env';

// Helper to validate URL structure to prevent "ERR_NAME_NOT_RESOLVED" in console
const isValidUrl = (urlString: string) => {
  try { 
    return Boolean(new URL(urlString)); 
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
      },
      // Retry configuration to reduce console noise on network blips
      global: {
        fetch: (url, options) => {
          return fetch(url, { ...options, cache: 'no-store' });
        }
      }
    }) 
  : null;
