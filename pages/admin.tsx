
import React from 'react';
import { supabase } from '../utils';
import { AdminModule } from '../components/admin';
import { Product, GalleryItem, Testimonial, Article, JobOpening, SiteConfig } from '../types';

export const AdminLogin = () => {
    // Re-export for compatibility if lazy loaded specifically (though mostly handled by module)
    return <AdminModule session={null} /> as any; 
};

export const AdminDashboard = (props: any) => {
    // Re-export wrapper
    return <AdminModule session={true} {...props} />;
};

export const AdminPage = ({
    session,
    products, setProducts,
    gallery, setGallery,
    testimonials, setTestimonials,
    articles, setArticles,
    jobs, setJobs,
    config, setConfig
}: {
    session: any;
    products: Product[]; setProducts: any;
    gallery: GalleryItem[]; setGallery: any;
    testimonials: Testimonial[]; setTestimonials: any;
    articles: Article[]; setArticles: any;
    jobs: JobOpening[]; setJobs: any;
    config: SiteConfig; setConfig: any;
}) => {
    const handleLogout = async () => {
        if (supabase) await supabase.auth.signOut();
    };

    return (
        <AdminModule 
            session={session}
            products={products} setProducts={setProducts}
            gallery={gallery} setGallery={setGallery}
            testimonials={testimonials} setTestimonials={setTestimonials}
            articles={articles} setArticles={setArticles}
            jobs={jobs} setJobs={setJobs}
            config={config} setConfig={setConfig}
            onLogout={handleLogout}
        />
    );
};

// Default export for Lazy Loading in index.tsx
// Maps the logic from original index.tsx to new structure
export default AdminPage;
