
import { createClient } from '@supabase/supabase-js';
import { CONFIG } from '../config/env';

// --- Clients ---
export const supabase = (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY) 
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY) 
  : null;
