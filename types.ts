
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
}

export interface SiteConfig {
  heroTitle: string;
  heroSubtitle: string;
}
