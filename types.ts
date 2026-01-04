
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  // NEW: Technical Specifications for Comparison
  specs?: {
    [key: string]: string; // Flexible key-value pairs (e.g., "RAM": "4GB")
  };
  // NEW: Package Includes list
  package_includes?: string[];
  // NEW: Reasons to Buy (Selling Points)
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
  author_avatar?: string; // New field for author profile picture
  readTime: string; 
  tags?: string[];
  status?: 'published' | 'draft' | 'scheduled';
  scheduled_for?: string;
  // SEO Strategy Fields
  type?: 'pillar' | 'cluster'; 
  pillar_id?: number; 
  // NEW: Stored AI suggestions for pillar pages
  cluster_ideas?: string[]; 
  // NEW: Manual links to other Pillar Pages (Inter-linking)
  related_pillars?: number[];
  created_at?: string; // Added to fix admin logic sorting
}

export interface GalleryItem {
  id: number;
  title: string;
  image_url: string; // Cover Image
  gallery_images?: string[]; // NEW: Array of additional images
  description?: string;     
  type?: 'image' | 'video'; 
  video_url?: string;
  
  // --- NEW PORTFOLIO FIELDS ---
  category_type: 'physical' | 'digital'; // Pemisah utama
  platform?: 'web' | 'mobile' | 'desktop'; // Khusus digital
  client_url?: string; // Link ke live site
  tech_stack?: string[]; // e.g., ['React', 'Supabase']
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
  requirements: string; // Markdown/Text formatting
  is_active: boolean;
  created_at?: string;
}

// --- SUPPORT CENTER TYPES ---
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
  founderPortrait?: string; // NEW: Founder Portrait Image
  sibosUrl?: string; 
  qalamUrl?: string; 
  // Legalitas
  companyLegalName?: string;
  nibNumber?: string;
  ahuNumber?: string;
  npwpNumber?: string;
  // Contact & Footer Config
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
  // Google Integration
  googleAnalyticsId?: string; // G-XXXXXXXXXX
  googleSearchConsoleCode?: string; // Verification meta content
  // Global Settings
  timezone?: string; // 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura'
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
  // NEW: Shipping Info
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

// --- ANALYTICS TYPES ---
export interface AnalyticsLog {
  id?: number;
  visitor_id: string;
  event_type: 'page_view' | 'click_action' | 'contact_wa';
  page_path: string;
  device_type: 'mobile' | 'desktop' | 'tablet';
  referrer: string;
  created_at?: string;
}

// --- SHADOW LEAD TYPES ---
export interface Lead {
  id: number;
  created_at: string;
  name: string;
  phone: string;
  source: string; // 'checkout', 'contact'
  interest: string;
  status: 'new' | 'followup' | 'converted' | 'junk';
  notes?: string;
}
