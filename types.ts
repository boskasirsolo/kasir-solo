
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
}

export interface GalleryItem {
  id: number;
  title: string;
  image_url: string;
  description?: string;     
  type?: 'image' | 'video'; 
  video_url?: string;       
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
  sibosUrl?: string; // New: Dynamic Link for SIBOS
  qalamUrl?: string; // New: Dynamic Link for QALAM
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
