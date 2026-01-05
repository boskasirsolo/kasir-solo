
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS, INITIAL_JOBS, injectGoogleTags } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial, JobOpening } from './types';
import { CartProvider } from './context/cart-context';
import { LoadingSpinner } from './components/ui';
import './index.css'; // Import compiled CSS

// Component Imports (Eager Load Core Layout)
import { Layout } from './components/layout/index';
import { HomePage } from './pages/home'; // EAGER LOAD HOME PAGE FOR LCP OPTIMIZATION

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

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} className="text-brand-orange" />
  </div>
);

// --- SKELETON HOME (Matches Hero Structure Exactly) ---
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

  // Config State (Default Values)
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR SOLO",
    heroSubtitle: "Pusat penjualan mesin kasir (POS) dan jasa arsitek sistem digital untuk UMKM.",
    aboutImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", 
    founderPortrait: "",
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
    quotaDigitalUsed: 0
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

  // --- OPTIMIZED DATA FETCHING (Parallel & Non-Blocking) ---
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

        // 1. Fetch Config First (Critical for Head/Meta/Contact)
        try {
            // Using maybeSingle() to avoid error if table is empty (0 rows)
            const { data: settingsData } = await supabase.from('site_settings').select('*').limit(1).maybeSingle();
            
            if (settingsData) {
                // ROBUST MAPPING: Check snake_case first, then camelCase, then fallback to current state (prev)
                // This handles both DB schema scenarios safely.
                setConfig(prev => ({
                    ...prev,
                    heroTitle: settingsData.hero_title ?? settingsData.heroTitle ?? prev.heroTitle,
                    heroSubtitle: settingsData.hero_subtitle ?? settingsData.heroSubtitle ?? prev.heroSubtitle,
                    aboutImage: settingsData.about_image ?? settingsData.aboutImage ?? prev.aboutImage,
                    founderPortrait: settingsData.founder_portrait ?? settingsData.founderPortrait ?? prev.founderPortrait,
                    sibosUrl: settingsData.sibos_url ?? settingsData.sibosUrl ?? prev.sibosUrl,
                    qalamUrl: settingsData.qalam_url ?? settingsData.qalamUrl ?? prev.qalamUrl,
                    companyLegalName: settingsData.company_legal_name ?? settingsData.companyLegalName ?? prev.companyLegalName,
                    nibNumber: settingsData.nib_number ?? settingsData.nibNumber ?? prev.nibNumber,
                    ahuNumber: settingsData.ahu_number ?? settingsData.ahuNumber ?? prev.ahuNumber,
                    npwpNumber: settingsData.npwp_number ?? settingsData.npwpNumber ?? prev.npwpNumber,
                    whatsappNumber: settingsData.whatsapp_number ?? settingsData.whatsappNumber ?? prev.whatsappNumber,
                    emailAddress: settingsData.email_address ?? settingsData.emailAddress ?? prev.emailAddress,
                    addressSolo: settingsData.address_solo ?? settingsData.addressSolo ?? prev.addressSolo,
                    addressBlora: settingsData.address_blora ?? settingsData.addressBlora ?? prev.addressBlora,
                    mapSoloLink: settingsData.map_solo_link ?? settingsData.mapSoloLink ?? prev.mapSoloLink,
                    mapBloraLink: settingsData.map_blora_link ?? settingsData.mapBloraLink ?? prev.mapBloraLink,
                    mapSoloEmbed: settingsData.map_solo_embed ?? settingsData.mapSoloEmbed ?? prev.mapSoloEmbed,
                    mapBloraEmbed: settingsData.map_blora_embed ?? settingsData.mapBloraEmbed ?? prev.mapBloraEmbed,
                    instagramUrl: settingsData.instagram_url ?? settingsData.instagramUrl ?? prev.instagramUrl,
                    facebookUrl: settingsData.facebook_url ?? settingsData.facebookUrl ?? prev.facebookUrl,
                    youtubeUrl: settingsData.youtube_url ?? settingsData.youtubeUrl ?? prev.youtubeUrl,
                    tiktokUrl: settingsData.tiktok_url ?? settingsData.tiktokUrl ?? prev.tiktokUrl,
                    linkedinUrl: settingsData.linkedin_url ?? settingsData.linkedinUrl ?? prev.linkedinUrl,
                    googleAnalyticsId: settingsData.google_analytics_id ?? settingsData.googleAnalyticsId ?? prev.googleAnalyticsId,
                    googleSearchConsoleCode: settingsData.google_search_console_code ?? settingsData.googleSearchConsoleCode ?? prev.googleSearchConsoleCode,
                    timezone: settingsData.timezone ?? prev.timezone,
                    quotaOnsiteMax: settingsData.quota_onsite_max ?? settingsData.quotaOnsiteMax ?? prev.quotaOnsiteMax,
                    quotaOnsiteUsed: settingsData.quota_onsite_used ?? settingsData.quotaOnsiteUsed ?? prev.quotaOnsiteUsed,
                    quotaDigitalMax: settingsData.quota_digital_max ?? settingsData.quotaDigitalMax ?? prev.quotaDigitalMax,
                    quotaDigitalUsed: settingsData.quota_digital_used ?? settingsData.quotaDigitalUsed ?? prev.quotaDigitalUsed
                }));
                injectGoogleTags(settingsData.google_analytics_id, settingsData.google_search_console_code);
            }
        } catch (e) {
            console.warn("Config fetch failed, using defaults", e);
        } finally {
            // UNBLOCK RENDER HERE: Allow UI to paint immediately after config check
            setIsInitializing(false);
        }

        // 2. Fetch Heavy Data in Background (Parallel)
        try {
            const results = await Promise.allSettled([
                supabase.from('products').select('*').order('id', { ascending: true }),
                supabase.from('gallery').select('*').order('id', { ascending: false }),
                supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
                supabase.from('jobs').select('*').order('created_at', { ascending: false }),
                supabase.from('articles').select('*')
            ]);

            // Products
            if (results[0].status === 'fulfilled' && results[0].value.data) {
                const mappedProducts = results[0].value.data.map((item: any) => ({
                    ...item,
                    image: item.image_url || item.image || 'https://via.placeholder.com/400'
                }));
                setProducts(mappedProducts);
            }
            // Gallery
            if (results[1].status === 'fulfilled' && results[1].value.data) setGallery(results[1].value.data);
            // Testimonials
            if (results[2].status === 'fulfilled' && results[2].value.data) setTestimonials(results[2].value.data);
            // Jobs
            if (results[3].status === 'fulfilled' && results[3].value.data) setJobs(results[3].value.data);
            // Articles
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
        }
    };

    loadAppData();

    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => setSession(session));
        return () => subscription.unsubscribe();
    }
  }, []);

  // Filter Articles
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
            <Route path="/shop/:slug" element={<ProductDetailPage products={products} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/gallery/:slug" element={<ProjectDetailPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/articles" element={<ArticlesPage articles={publishedArticles} products={products} />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage articles={publishedArticles} products={products} />} />
            <Route path="/services/website" element={<WebsiteServicePage config={config} />} />
            <Route path="/services/webapp" element={<WebAppServicePage config={config} />} />
            <Route path="/services/seo" element={<SeoServicePage />} />
            <Route path="/services/maintenance" element={<MaintenanceServicePage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} /> 
            <Route path="/jual-mesin-kasir-di/:citySlug" element={<CityLandingPage config={config} />} />
            <Route path="/jual-mesin-kasir-di" element={<CityLandingPage config={config} />} />
            <Route path="/area-layanan" element={<CityLandingPage config={config} />} />
            <Route path="/about" element={<AboutPage config={config} />} />
            <Route path="/about/vision" element={<VisionPage />} /> 
            <Route path="/career" element={<CareerPage jobs={jobs} />} />
            <Route path="/contact" element={<ContactPage config={config} />} /> 
            <Route path="/checkout" element={<CheckoutPage setPage={handleNavigation} />} />
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
  <BrowserRouter>
    <AppContent />
  </BrowserRouter>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
