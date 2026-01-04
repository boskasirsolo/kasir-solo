
import { Product, GalleryItem, Testimonial, Article, JobOpening, SiteConfig } from '../../types';

export type AdminTabId = 'analytics' | 'store' | 'gallery' | 'articles' | 'seo' | 'career' | 'downloads' | 'social' | 'settings';

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
