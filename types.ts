

// --- CORE INTERFACES ---

export interface SiteConfig {
  hero_title: string;
  hero_subtitle: string;
  about_image?: string; 
  founder_portrait?: string;
  sibos_url?: string; 
  qalam_url?: string; 
  dapur_sppg_url?: string; 
  company_legal_name?: string;
  nib_number?: string;
  ahu_number?: string;
  npwp_number?: string;
  whatsapp_number?: string;
  email_address?: string; 
  address_solo?: string;
  address_blora?: string;
  map_solo_link?: string; 
  map_blora_link?: string; 
  map_solo_embed?: string; 
  map_blora_embed?: string; 
  instagram_url?: string;
  facebook_url?: string;
  youtube_url?: string;
  tiktok_url?: string;
  linkedin_url?: string;
  google_analytics_id?: string;
  google_search_console_code?: string;
  google_merchant_id?: string;
  is_maintenance_mode?: boolean;
  is_noindex?: boolean;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
  quota_onsite_max?: number;
  quota_onsite_used?: number;
  quota_digital_max?: number;
  quota_digital_used?: number;
  timezone?: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string; 
  image_url?: string; 
  gallery_images?: string[];
  video_url?: string;
  specs?: Record<string, any>;
  package_includes?: string[];
  why_buy?: string[];
  affiliate_link?: string;
  cta_text?: string;
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string; 
  image: string; 
  image_url?: string; 
  category: string;
  author: string;
  author_avatar?: string;
  read_time?: string;
  readTime?: string;
  status?: 'draft' | 'published' | 'scheduled';
  scheduled_for?: string;
  tags?: string[];
  type?: 'pillar' | 'cluster';
  pillar_id?: number;
  related_pillars?: number[];
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  slug?: string; // Pastikan ada buat routing
  image_url: string;
  gallery_images?: string[];
  category_type: 'physical' | 'digital';
  type?: 'image' | 'video';
  video_url?: string;
  platform?: 'web' | 'mobile' | 'desktop';
  description?: string;
  client_url?: string;
  tech_stack?: string[];
  case_study?: {
    challenge: string;
    solution: string;
    result: string;
  };
}

export interface Testimonial {
  id: number;
  client_name: string;
  business_name: string;
  content: string;
  rating: number;
  image_url?: string;
  is_featured: boolean;
}

export interface JobOpening {
  id: number;
  title: string;
  division: string;
  type: string;
  location: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

/**
 * FIX: Added missing exported members to resolve TypeScript errors across multiple files
 */

export interface Order {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  customer_note?: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'processed' | 'completed' | 'cancelled';
  payment_method: string;
  courier?: string;
  tracking_number?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  products?: {
    specs: any;
  };
}

export interface Lead {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  source: string;
  interest?: string;
  notes: string;
  status: 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost';
}

export interface DownloadItem {
  id: string;
  title: string;
  category: 'driver' | 'manual' | 'software' | 'tools';
  description: string;
  file_url: string;
  file_size: string;
  version: string;
  os_support: string;
  access_key?: string;
  updated_at?: string;
  created_at?: string;
}

export interface Tutorial {
  id: number;
  title: string;
  video_url: string;
  created_at?: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
}

export interface ScheduledPost {
  day: string;
  theme: string;
  hook: string;
  caption: string;
  image_idea: string;
  status: 'pending' | 'posted';
}

export interface ServicePageData {
  id: number;
  slug: string;
  title: string;
  highlight: string;
  subtitle: string;
  icon_name: string;
  features: any[];
  steps: any[];
  calc_data: any;
}

export interface AnalyticsLog {
  id?: string;
  visitor_id: string;
  event_type: string;
  page_path: string;
  device_type: string;
  referrer: string;
  location_city?: string;
  os_name?: string;
  created_at?: string;
}

export interface ServiceSimulation {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  service_slug: string;
  service_name: string;
  base_option_label: string;
  base_option_price: number;
  selected_addons: any[];
  total_min: number;
  total_max: number;
  status: 'new' | 'contacted' | 'proposed' | 'closed';
  company_name?: string;
  address?: string;
  business_category?: string;
  business_scale?: string;
  notes?: string;
}
