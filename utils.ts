
// --- AGGREGATOR / BARREL FILE ---

// Config
export { getEnv, CONFIG } from './config/env';

// Clients
export { supabase } from './lib/supabase-client';

// Core Libs
export { formatRupiah, formatNumberInput, cleanNumberInput, slugify, renameFile, normalizePhone } from './lib/formatters';
export { optimizeImage, addWatermarkToFile } from './lib/image-processing';
export { injectGoogleTags } from './lib/dom-utils';
export { getTimezoneOffset, convertLocalToUTC, convertUTCToLocal } from './lib/date-utils';
export { getCityData } from './lib/geo-utils';

// Services
// UPDATED: Now pointing to the new AI Core
export { ensureAPIKey, callGeminiWithRotation } from './services/ai/core'; 
export { uploadToSupabase, uploadToCloudinary, deleteFromSupabase, processBackgroundMigration, getSignedUrl } from './services/storage-service';

// Data Constants (Re-exporting for easy access)
export { TARGET_CITIES, INDONESIA_TIMEZONES } from './data/constants';
export { 
    INITIAL_PRODUCTS, 
    INITIAL_ARTICLES, 
    INITIAL_GALLERY, 
    INITIAL_TESTIMONIALS, 
    INITIAL_JOBS,
    INITIAL_DOWNLOADS,
    INITIAL_TUTORIALS,
    INITIAL_FAQS 
} from './data/mocks';
