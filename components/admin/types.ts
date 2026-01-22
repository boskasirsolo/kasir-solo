
import { Product, Article, GalleryItem, Testimonial, JobOpening, SiteConfig } from '../../types';

export type AdminTabId = 'analytics' | 'store' | 'crm' | 'gallery' | 'articles' | 'seo' | 'career' | 'downloads' | 'social' | 'siboy' | 'settings' | 'documentation' | 'rma' | 'media';

export interface MenuCategory {
    id: string;
    label: string;
    items: AdminTabId[];
}

export interface DashboardProps {
    products: Product[];
    setProducts: any;
    gallery: GalleryItem[];
    setGallery: any;
    testimonials: Testimonial[];
    setTestimonials: any;
    articles: Article[];
    setArticles: any;
    jobs: JobOpening[];
    setJobs: any;
    config: SiteConfig;
    setConfig: any;
    onLogout: () => void;
}

export interface AdminModuleProps extends Partial<DashboardProps> {
    session: any;
}
