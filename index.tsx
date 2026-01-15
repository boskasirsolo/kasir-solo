
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS, INITIAL_JOBS, injectGoogleTags } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial, JobOpening } from './types';
import { CartProvider } from './context/cart-context';
import { LoadingSpinner } from './components/ui';
import './index.css'; 

// Component Imports
import { Layout } from './components/layout/index';
import { HomePage } from './pages/home';

// Lazy Load Other Pages
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
const AdminDashboard = lazy(() => import('./pages/admin').then(module => ({ default: module.AdminDashboard })));
const AdminLogin = lazy(() => import('./pages/admin').then(module => ({ default: module.AdminLogin })));
const CheckoutPage = lazy(() => import('./pages/checkout').then(module => ({ default: module.CheckoutPage })));
const InnovationPage = lazy(() => import('./pages/innovation').then(module => ({ default: module.InnovationPage })));
const WebsiteServicePage = lazy(() => import('./pages/services').then(module => ({ default: module.WebsiteServicePage })));
const WebAppServicePage = lazy(() => import('./pages/services').then(module => ({ default: module.WebAppServicePage })));
const SeoServicePage = lazy(() => import('./pages/services').then(module => ({ default: module.SeoServicePage })));
const MaintenanceServicePage = lazy(() => import('./pages/services').then(module => ({ default: module.MaintenanceServicePage })));
const LegalPage = lazy(() => import('./pages/legal').then(module => ({ default: module.LegalPage })));
const SupportPage = lazy(() => import('./pages/support').then(module => ({ default: module.SupportPage })));
const TrackOrderPage = lazy(() => import('./pages/track-order').then(module => ({ default: module.TrackOrderPage })));
const CityLandingPage = lazy(() => import('./pages/city-landing').then(module => ({ default: module.CityLandingPage }))); 
const NotFoundPage = lazy(() => import('./pages/not-found').then(module => ({ default: module.NotFoundPage })));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} className="text-brand-orange" />
  </div>
);

const SkeletonHome = () => (
  <div className="min-h-screen flex flex-col bg-brand-black text-white font-sans overflow-hidden">
    <nav className="h-[76px] border-b border-white/5 flex items-center justify-between px-5 fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-md">
       <div className="w-[160px] h-[40px] bg-white/10 rounded-lg animate-pulse"></div>
    </nav>
    <div className="flex-1 flex flex-col items-center justify-center text-center px-5 gap-6 mt-[60px] relative overflow-hidden min-h-[90vh]">
       <div className="w-[220px] h-[32px] bg-white/5 rounded-full animate-pulse mb-4"></div>
       <div className="w-[90%] max-w-[600px] h-[60px] md:h-[100px] bg-white/5 rounded-2xl animate-pulse"></div>
       <div className="w-[70%] max-w-[450px] h-[24px] bg-white/5 rounded animate-pulse mt-4"></div>
       <div className="flex gap-4 mt-8">
          <div className="w-[160px] h-[50px] bg-brand-orange/20 rounded-xl animate-pulse"></div>
          <div className="w-[160px] h-[50px] bg-white/5 rounded-xl animate-pulse"></div>
       </div>
    </div>
  </div>
);

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]); 
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Config State (with Fallbacks)
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR SOLO",
    heroSubtitle: "Pusat penjualan mesin kasir (POS) dan jasa arsitek sistem digital untuk UMKM.",
    aboutImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", 
    founderPortrait: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
    sibosUrl: "https://sibos.id",
    qalamUrl: "https://qalam.id",
    companyLegalName: "PT MESIN KASIR SOLO",
    whatsappNumber: "6282325103336",
    emailAddress: "admin@kasirsolo.com",
    addressSolo: "Perum Graha Tiara 2 B1, Kartasura",
    addressBlora: "Gumiring 04/04, Banjarejo",
    mapSoloLink: "https://maps.google.com/?q=Perum+Graha+Tiara+2+B1+Kartasura",
    mapBloraLink: "https://maps.google.com/?q=Gumiring+Banjarejo+Blora",
    quotaOnsiteMax: 4,
    quotaOnsiteUsed: 3,
    quotaDigitalMax: 2,
    quotaDigitalUsed: 0,
    googleMerchantId: ""
  });

  const getCurrentPageId = () => location.pathname.substring(1) || 'home';
  const handleNavigation = (pageId: string) => {
    if (pageId === 'home') navigate('/');
    else navigate(`/${pageId}`);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 10000); 
    return () => clearInterval(timer);
  }, []);

  // INIT AUTH LISTENER
  useEffect(() => {
    if (supabase) {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        
        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session);
        });
        return () => subscription.unsubscribe();
    }
  }, []);

  // DATA FETCHING (Triggered on mount AND when session changes)
  // Ini penting agar saat user login (Admin), data di-fetch ulang dengan hak akses penuh (Draft dll).
  useEffect(() => {
    const loadAppData = async () => {
        if (!supabase) {
            setProducts(INITIAL_PRODUCTS);
            setGallery(INITIAL_GALLERY);
            setArticles(INITIAL_ARTICLES);
            setTestimonials(INITIAL_TESTIMONIALS);
            setJobs(INITIAL_JOBS);
            setIsInitializing(false);
            return;
        }

        try {
            // 1. Config First
            const { data: settingsData } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
            
            if (settingsData) {
                setConfig(prev => ({
                    ...prev,
                    heroTitle: settingsData.hero_title || prev.heroTitle,
                    heroSubtitle: settingsData.hero_subtitle || prev.heroSubtitle,
                    aboutImage: settingsData.about_image || prev.aboutImage,
                    founderPortrait: settingsData.founder_portrait && settingsData.founder_portrait.length > 5 
                        ? settingsData.founder_portrait 
                        : "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800",
                    sibosUrl: settingsData.sibos_url || prev.sibosUrl,
                    qalamUrl: settingsData.qalam_url || prev.qalamUrl,
                    companyLegalName: settingsData.company_legal_name || prev.companyLegalName,
                    nibNumber: settingsData.nib_number || prev.nibNumber,
                    ahuNumber: settingsData.ahu_number || prev.ahuNumber,
                    npwpNumber: settingsData.npwp_number || prev.npwpNumber,
                    whatsappNumber: settingsData.whatsapp_number || prev.whatsappNumber,
                    emailAddress: settingsData.email_address || prev.emailAddress,
                    addressSolo: settingsData.address_solo || prev.addressSolo,
                    addressBlora: settingsData.address_blora || prev.addressBlora,
                    mapSoloLink: settingsData.map_solo_link || prev.mapSoloLink,
                    mapBloraLink: settingsData.map_blora_link || prev.mapBloraLink,
                    mapSoloEmbed: settingsData.map_solo_embed || prev.mapSoloEmbed,
                    mapBloraEmbed: settingsData.map_blora_embed || prev.mapBloraEmbed,
                    instagramUrl: settingsData.instagram_url || prev.instagramUrl,
                    facebookUrl: settingsData.facebook_url || prev.facebookUrl,
                    youtubeUrl: settingsData.youtube_url || prev.youtubeUrl,
                    tiktokUrl: settingsData.tiktok_url || prev.tiktokUrl,
                    linkedinUrl: settingsData.linkedin_url || prev.linkedinUrl,
                    googleAnalyticsId: settingsData.google_analytics_id || prev.googleAnalyticsId,
                    googleSearchConsoleCode: settingsData.google_search_console_code || prev.googleSearchConsoleCode,
                    googleMerchantId: settingsData.google_merchant_id || prev.googleMerchantId,
                    timezone: settingsData.timezone || prev.timezone,
                    quotaOnsiteMax: settingsData.quota_onsite_max ?? prev.quotaOnsiteMax,
                    quotaOnsiteUsed: settingsData.quota_onsite_used ?? prev.quotaOnsiteUsed,
                    quotaDigitalMax: settingsData.quota_digital_max ?? prev.quotaDigitalMax,
                    quotaDigitalUsed: settingsData.quota_digital_used ?? prev.quotaDigitalUsed
                }));
                injectGoogleTags(settingsData.google_analytics_id, settingsData.google_search_console_code);
            }

            // 2. Content Data (Products, Articles, etc.)
            // Promise.allSettled allows some to fail without breaking everything
            const results = await Promise.allSettled([
                supabase.from('products').select('*').order('id', { ascending: true }),
                supabase.from('gallery').select('*').order('id', { ascending: false }),
                supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
                supabase.from('jobs').select('*').order('created_at', { ascending: false }),
                supabase.from('articles').select('*') // If Admin, this returns drafts too. If Anon, only published.
            ]);

            if (results[0].status === 'fulfilled' && results[0].value.data) {
                const mappedProducts = results[0].value.data.map((item: any) => ({
                    ...item,
                    image: item.image_url || item.image || 'https://via.placeholder.com/400'
                }));
                setProducts(mappedProducts);
            }
            if (results[1].status === 'fulfilled' && results[1].value.data) setGallery(results[1].value.data);
            if (results[2].status === 'fulfilled' && results[2].value.data) setTestimonials(results[2].value.data);
            if (results[3].status === 'fulfilled' && results[3].value.data) setJobs(results[3].value.data);
            if (results[4].status === 'fulfilled' && results[4].value.data) {
                const artData = results[4].value.data;
                const mappedArticles = artData.map((item: any) => ({
                    ...item,
                    image: item.image_url || item.image || 'https://via.placeholder.com/800',
                    readTime: item.read_time || '5 min read',
                    date: item.date || new Date(item.created_at).toLocaleDateString('id-ID'),
                    status: (item.status || 'draft').toLowerCase().trim()
                })).sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                setArticles(mappedArticles);
            }

        } catch (e) {
            console.error("Background data fetch error:", e);
        } finally {
            setIsInitializing(false);
        }
    };

    loadAppData();
  }, [session]); // Depend on session to re-fetch when user logs in/out

  const publishedArticles = articles.filter(a => {
      if (a.status === 'published') return true;
      if (a.status === 'scheduled' && a.scheduled_for) {
          const scheduleTime = new Date(a.scheduled_for).getTime();
          return !isNaN(scheduleTime) && currentTime >= scheduleTime;
      }
      return false;
  });

  if (isInitializing) return <SkeletonHome />;

  return (
    <CartProvider>
      <Layout setPage={handleNavigation} currentPage={getCurrentPageId()} config={config} setConfig={setConfig} session={session}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage setPage={handleNavigation} config={config} gallery={gallery} testimonials={testimonials} />} />
            <Route path="/home" element={<HomePage setPage={handleNavigation} config={config} gallery={gallery} testimonials={testimonials} />} />
            <Route path="/shop" element={<ShopPage products={products} />} />
            <Route path="/shop/:slug" element={<ProductDetailPage products={products} config={config} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/gallery/:slug" element={<ProjectDetailPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/articles" element={<ArticlesPage articles={publishedArticles} products={products} config={config} />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage articles={publishedArticles} products={products} config={config} />} />
            <Route path="/services/website" element={<WebsiteServicePage config={config} />} />
            <Route path="/services/webapp" element={<WebAppServicePage config={config} />} />
            <Route path="/services/seo" element={<SeoServicePage config={config} />} />
            <Route path="/services/maintenance" element={<MaintenanceServicePage config={config} />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/support" element={<SupportPage config={config} />} />
            <Route path="/track-order" element={<TrackOrderPage />} /> 
            <Route path="/jual-mesin-kasir-di/:citySlug" element={<CityLandingPage config={config} />} />
            <Route path="/jual-mesin-kasir-di" element={<CityLandingPage config={config} />} />
            <Route path="/area-layanan" element={<CityLandingPage config={config} />} />
            <Route path="/about" element={<AboutPage config={config} />} />
            <Route path="/about/vision" element={<VisionPage />} /> 
            <Route path="/career" element={<CareerPage jobs={jobs} />} />
            <Route path="/contact" element={<ContactPage config={config} />} /> 
            <Route path="/checkout" element={<CheckoutPage setPage={handleNavigation} config={config} />} />
            <Route path="/innovation" element={<InnovationPage config={config} />} />
            <Route path="/admin" element={session ? <AdminDashboard products={products} setProducts={setProducts} gallery={gallery} setGallery={setGallery} testimonials={testimonials} setTestimonials={setTestimonials} articles={articles} setArticles={setArticles} jobs={jobs} setJobs={setJobs} config={config} setConfig={setConfig} onLogout={() => supabase?.auth.signOut()} /> : <AdminLogin />} />
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
