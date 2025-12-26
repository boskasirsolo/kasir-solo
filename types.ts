
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
  description?: string;     // Tambahan: Deskripsi panjang
  type?: 'image' | 'video'; // Tambahan: Tipe konten
  video_url?: string;       // Tambahan: Link video (jika type='video')
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
}