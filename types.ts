
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
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
  readTime: string; 
  tags?: string[];  
}

export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
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

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  sibosUrl?: string; 
  qalamUrl?: string; 
  // Contact & Footer Config
  whatsappNumber?: string;
  addressSolo?: string;
  addressBlora?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  linkedinUrl?: string;
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
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}
