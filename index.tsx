
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS, INITIAL_JOBS, injectGoogleTags } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial, JobOpening } from './types';
import { CartProvider } from './context/cart-context';
import { LoadingSpinner } from './components/ui';
import { MaintenancePage } from './pages/maintenance'; 
import './index.css'; 

// Component Imports
import { Layout } from './components/layout/index';
import { HomePage } from './pages/home';

// Lazy Load Pages
const ShopPage = lazy(() => import('./pages/shop').then(module => ({ default: module.ShopPage })));
const ProductDetailPage = lazy(() => import('./pages/shop').then(module => ({ default: module.ProductDetailPage })));
const GalleryPage = lazy(() => import('./pages/gallery').then(module => ({ default: module.GalleryPage })));
const ProjectDetailPage = lazy(() => import('./pages/gallery').then(module => ({ default: module.ProjectDetailPage })));
const ArticlesPage = lazy(() => import('./pages/articles').then(module => ({ default: module.ArticlesPage })));
const ArticleDetailPage = lazy(() => import('./pages/articles').then(module => ({ default: module.ArticleDetailPage })));
const AboutPage = lazy(() => import('./pages/about').then(module => ({ default: module.AboutPage })));
const VisionPage = lazy(() => import('./pages/vision').then(module => ({ default: module.VisionPage })));
const CareerPage = lazy(() => import('./pages/career').then(module => ({ default: module.CareerPage })));
const ContactPage = lazy(() => import('./pages/contact').then(module => ({ default: module.ContactPage })));
const AdminPage = lazy(() => import('./pages/admin')); 
const CheckoutPage = lazy(() => import('./pages/checkout').then(module => ({ default: module.CheckoutPage })));
const InnovationPage = lazy(() => import('./pages/innovation').then(module => ({ default: module.InnovationPage })));
const NotFoundPage = lazy(() => import('./pages/not-found').then(module => ({ default: module.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} className="text-brand-orange" />
  </div>
);

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]); 
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);

  // Config State (Raw Mapping ke Database)
  const [config, setConfig] = useState<SiteConfig>({
    hero_title: "MESIN KASIR SOLO",
    hero_subtitle: "Pusat penjualan mesin kasir (POS) dan jasa arsitek sistem digital untuk UMKM.",
    company_legal_name: "PT MESIN KASIR SOLO",
    whatsapp_number: "628816566935",
    is_maintenance_mode: false
  });

  const getCurrentPageId = () => location.pathname.substring(1) || 'home';
  const handleNavigation = (pageId: string) => {
    if (pageId === 'home') navigate('/');
    else navigate(`/${pageId}`);
  };

  // Auth Sync
  useEffect(() => {
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }
  }, []);

  // AUDIT KABEL DATABASE: Fetching & Mapping
  useEffect(() => {
    const loadAppData = async () => {
        if (!supabase) {
            setProducts(INITIAL_PRODUCTS);
            setGallery(INITIAL_GALLERY);
            setArticles(INITIAL_ARTICLES);
            setTestimonials(INITIAL_TESTIMONIALS);
            setIsInitializing(false);
            return;
        }

        try {
            // 1. Fetch Site Settings (Table: site_settings)
            const { data: settingsData } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
            if (settingsData) {
                setConfig(settingsData);
                injectGoogleTags(settingsData.google_analytics_id, settingsData.google_search_console_code);
            }

            // 2. Fetch Parallel Data
            const results = await Promise.allSettled([
                supabase.from('products').select('*').order('id', { ascending: true }),
                supabase.from('gallery').select('*').order('id', { ascending: false }),
                supabase.from('testimonials').select('*').order('id', { ascending: false }),
                supabase.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false }),
                supabase.from('jobs').select('*').order('created_at', { ascending: false })
            ]);

            // Mapping Hasil (Snake Case Audit)
            if (results[0].status === 'fulfilled' && results[0].value.data) {
                setProducts(results[0].value.data.map((p: any) => ({
                    ...p,
                    image: p.image_url || p.image || 'https://via.placeholder.com/400'
                })));
            }
            if (results[1].status === 'fulfilled' && results[1].value.data) setGallery(results[1].value.data);
            if (results[2].status === 'fulfilled' && results[2].value.data) setTestimonials(results[2].value.data);
            if (results[3].status === 'fulfilled' && results[3].value.data) {
                setArticles(results[3].value.data.map((a: any) => ({
                    ...a,
                    image: a.image_url || a.image || 'https://via.placeholder.com/800',
                    readTime: a.read_time || a.readTime || '3 min' // Sync Kabel: DB read_time -> UI readTime
                })));
            }
            if (results[4].status === 'fulfilled' && results[4].value.data) setJobs(results[4].value.data);

        } catch (e) {
            console.error("Audit Kabel Database Gagal:", e);
        } finally {
            setIsInitializing(false);
        }
    };

    loadAppData();
  }, [session]);

  if (isInitializing) return <PageLoader />;

  // Maintenance Gate
  const isGhost = localStorage.getItem('mks_ghost_mode') === 'true';
  const isAdminRoute = location.pathname.startsWith('/admin');
  if (config.is_maintenance_mode && !isGhost && !isAdminRoute) {
    return <MaintenancePage config={config} />;
  }

  return (
    <CartProvider>
      <Layout setPage={handleNavigation} currentPage={getCurrentPageId()} config={config} setConfig={setConfig} session={session}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage setPage={handleNavigation} config={config} gallery={gallery} testimonials={testimonials} />} />
            <Route path="/shop" element={<ShopPage products={products} gallery={gallery} />} />
            <Route path="/shop/:slug" element={<ProductDetailPage products={products} config={config} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/articles" element={<ArticlesPage articles={articles} products={products} config={config} />} />
            <Route path="/about" element={<AboutPage config={config} />} />
            <Route path="/about/vision" element={<VisionPage />} />
            <Route path="/career" element={<CareerPage jobs={jobs} />} />
            <Route path="/contact" element={<ContactPage config={config} />} /> 
            <Route path="/admin" element={
                <AdminPage 
                    session={session}
                    products={products} setProducts={setProducts}
                    gallery={gallery} setGallery={setGallery}
                    testimonials={testimonials} setTestimonials={setTestimonials}
                    articles={articles} setArticles={setArticles}
                    jobs={jobs} setJobs={setJobs}
                    config={config} setConfig={setConfig}
                />
            } />
            <Route path="*" element={<NotFoundPage setPage={handleNavigation} />} />
          </Routes>
        </Suspense>
      </Layout>
    </CartProvider>
  );
};

const App = () => (
  <HelmetProvider>
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  </HelmetProvider>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
