
// --- CORE INTERFACES ---

// RAW MAPPING: Sesuai kolom database Supabase
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
  timezone?: string;
  quota_onsite_max?: number;
  quota_onsite_used?: number;
  quota_digital_max?: number;
  quota_digital_used?: number;
  is_noindex?: boolean;
  is_maintenance_mode?: boolean;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_name?: string;
}

/**
 * Interface untuk produk fisik (Mesin Kasir / Hardware)
 */
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string; // Alias for UI
  image_url?: string; // Direct from DB
  gallery_images?: string[];
  video_url?: string;
  specs?: Record<string, any>;
  package_includes?: string[];
  why_buy?: string[];
  affiliate_link?: string;
  cta_text?: string;
}

/**
 * Interface untuk Artikel / Blog (Pillar & Cluster)
 */
export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string; // Formatting for UI
  image: string; // Alias for UI
  image_url?: string; // Direct from DB
  category: string;
  author: string;
  author_avatar?: string;
  readTime?: string;
  read_time?: string;
  status?: 'draft' | 'published' | 'scheduled';
  scheduled_for?: string;
  type?: 'pillar' | 'cluster';
  pillar_id?: number;
  cluster_ideas?: string[];
  related_pillars?: number[];
  generation_context?: string;
  target_city_id?: number;
  created_at?: string;
}

/**
 * Interface untuk Item Galeri / Portofolio
 */
export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  gallery_images?: string[];
  category_type: 'physical' | 'digital';
  platform?: 'web' | 'mobile' | 'desktop';
  description?: string;
  client_url?: string;
  tech_stack?: string[];
  case_study?: {
    challenge: string;
    solution: string;
    result: string;
  };
  type?: 'image' | 'video';
  video_url?: string;
}

/**
 * Interface untuk Testimoni Klien
 */
export interface Testimonial {
  id: number;
  client_name: string;
  business_name: string;
  content: string;
  rating: number;
  image_url?: string;
  is_featured: boolean;
}

/**
 * Interface untuk Lowongan Kerja (Career)
 */
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

/**
 * Interface untuk Item di Keranjang Belanja
 */
export interface CartItem extends Product {
  quantity: number;
}

/**
 * Interface untuk Transaksi Pesanan (Orders)
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
  payment_method?: string;
  courier?: string;
  tracking_number?: string;
}

/**
 * Interface untuk Item dalam satu Pesanan
 */
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

/**
 * Interface untuk Calon Pelanggan / Leads (CRM)
 */
export interface Lead {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  source?: string;
  interest?: string;
  notes?: string;
  status: string;
}

/**
 * Interface untuk File Download (Support)
 */
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

/**
 * Interface untuk Tutorial Video
 */
export interface Tutorial {
  id: number;
  title: string;
  video_url: string;
  created_at?: string;
}

/**
 * Interface untuk FAQ
 */
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
}

/**
 * Interface untuk Kalender Sosmed AI
 */
export interface ScheduledPost {
  day: string;
  theme: string;
  hook: string;
  caption: string;
  image_idea: string;
  status?: string;
}

/**
 * Interface untuk Logs Analytics
 */
export interface AnalyticsLog {
  id?: number;
  visitor_id: string;
  event_type: string;
  page_path: string;
  device_type: string;
  referrer?: string;
  location_city?: string;
  os_name?: string;
  created_at?: string;
}

/**
 * Interface untuk Simulasi Layanan Digital
 */
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
  status: string;
  company_name?: string;
  address?: string;
  business_category?: string;
  business_scale?: string;
  notes?: string;
}

/**
 * Interface untuk Halaman Layanan Jasa
 */
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
