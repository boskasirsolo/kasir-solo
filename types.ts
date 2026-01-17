
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  gallery_images?: string[]; 
  video_url?: string;
  affiliate_link?: string;
  cta_text?: string;
  specs?: {
    [key: string]: string;
  };
  package_includes?: string[];
  why_buy?: string[];
}

export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  category: string; 
  author: string;   
  author_avatar?: string;
  readTime: string; 
  tags?: string[];
  status?: 'published' | 'draft' | 'scheduled';
  scheduled_for?: string;
  type?: 'pillar' | 'cluster'; 
  pillar_id?: number; 
  cluster_ideas?: string[]; 
  related_pillars?: number[];
  created_at?: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  gallery_images?: string[];
  description?: string;     
  type?: 'image' | 'video'; 
  video_url?: string;
  category_type: 'physical' | 'digital';
  platform?: 'web' | 'mobile' | 'desktop';
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
  created_at?: string;
}

export interface JobOpening {
  id: number;
  title: string;
  division: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance';
  location: string;
  description: string;
  requirements: string;
  is_active: boolean;
  created_at?: string;
}

export interface DownloadItem {
  id: string;
  title: string;
  category: 'driver' | 'manual' | 'software' | 'tools';
  description: string;
  file_url: string; 
  file_size?: string;
  version?: string;
  os_support?: 'Windows' | 'Android' | 'iOS' | 'All';
  updated_at: string;
  access_key?: string;
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

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  aboutImage?: string; 
  founderPortrait?: string;
  sibosUrl?: string; 
  qalamUrl?: string; 
  companyLegalName?: string;
  nibNumber?: string;
  ahuNumber?: string;
  npwpNumber?: string;
  whatsappNumber?: string;
  emailAddress?: string; 
  addressSolo?: string;
  addressBlora?: string;
  mapSoloLink?: string; 
  mapBloraLink?: string; 
  mapSoloEmbed?: string; 
  mapBloraEmbed?: string; 
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  linkedinUrl?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleCode?: string;
  googleMerchantId?: string;
  timezone?: string;
  quotaOnsiteMax?: number;
  quotaOnsiteUsed?: number;
  quotaDigitalMax?: number;
  quotaDigitalUsed?: number;
}

// --- NEW SERVICE TYPES ---

export interface ServicePageData {
  id: number;
  slug: string;
  title: string;
  highlight: string;
  subtitle: string;
  icon_name: string;
  features: { title: string; desc: string; icon: string }[];
  steps: { step: string; title: string; desc: string }[];
  calc_data: any; // CalcData interface
}

export interface ServiceSimulation {
  id: number;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  company_name?: string;
  address?: string;
  business_category?: string;
  business_scale?: string; // NEW COLUMN
  service_slug: string;
  service_name: string;
  base_option_label: string;
  base_option_price: number;
  selected_addons: { label: string; price: number }[];
  total_min: number;
  total_max: number;
  status: 'new' | 'contacted' | 'proposed' | 'closed';
  notes?: string;
}

// --- E-Commerce Types ---
export interface CartItem extends Product {
  quantity: number;
}

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
  tracking_number?: string;
  courier?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface AnalyticsLog {
  id?: number;
  visitor_id: string;
  event_type: 'page_view' | 'click_action' | 'contact_wa' | 'page_leave';
  page_path: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  referrer: string;
  created_at?: string;
}

export interface Lead {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  source: string;
  interest: string;
  status: 'new' | 'followup' | 'converted' | 'junk';
  notes?: string;
}

export interface ScheduledPost {
  day: string;
  theme: string;
  hook: string;
  caption: string;
  image_idea: string;
  status: 'pending' | 'posted';
}
