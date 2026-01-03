
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS, INITIAL_JOBS, injectGoogleTags } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial, JobOpening } from './types';
import { CartProvider } from './context/cart-context';
import { LoadingSpinner } from './components/ui';

// Component Imports (Eager Load Core Layout)
import { Layout } from './components/layout';

// Lazy Load Pages to optimize initial bundle size
const HomePage = lazy(() => import('./pages/home').then(module => ({ default: module.HomePage })));
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
const NotFoundPage = lazy(() => import('./pages/not-found').then(module => ({ default: module.NotFoundPage })));

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} className="text-brand-orange" />
  </div>
);

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // --- Global Scroll To Top ---
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [session, setSession] = useState<any>(null);
  
  // GLOBAL LOADING STATE
  const [isInitializing, setIsInitializing] = useState(true);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]); 
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  
  // LIVE CLOCK for Scheduled Posts
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Config State
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR SOLO",
    heroSubtitle: "Pusat penjualan mesin kasir (POS) dan jasa arsitek sistem digital untuk UMKM. Dibangun oleh praktisi, bukan sekadar penjual.",
    aboutImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", 
    sibosUrl: "https://sibos.id",
    qalamUrl: "https://qalam.id",
    companyLegalName: "PT MESIN KASIR SOLO",
    nibNumber: "",
    ahuNumber: "",
    npwpNumber: "",
    whatsappNumber: "6282325103336",
    emailAddress: "admin@kasirsolo.com",
    addressSolo: "Perum Graha Tiara 2 B1, Kartasura",
    addressBlora: "Gumiring 04/04, Banjarejo",
    mapSoloLink: "https://maps.google.com/?q=Perum+Graha+Tiara+2+B1+Kartasura",
    mapBloraLink: "https://maps.google.com/?q=Gumiring+Banjarejo+Blora",
    mapSoloEmbed: "",
    mapBloraEmbed: "",
    instagramUrl: "https://instagram.com/",
    facebookUrl: "https://facebook.com/",
    youtubeUrl: "https://youtube.com/",
    tiktokUrl: "https://tiktok.com/",
    linkedinUrl: "https://linkedin.com/",
    googleAnalyticsId: "",
    googleSearchConsoleCode: "",
    timezone: "Asia/Jakarta"
  });

  // --- Router Bridge ---
  const getCurrentPageId = () => {
    const path = location.pathname.substring(1) || 'home';
    return path;
  };

  const handleNavigation = (pageId: string) => {
    if (pageId === 'home') navigate('/');
    else navigate(`/${pageId}`);
  };

  // --- Helper: Smart Date Parser ---
  const parseDate = (dateStr: string) => {
    if (!dateStr) return new Date(0);
    const stdDate = new Date(dateStr);
    if (!isNaN(stdDate.getTime())) return stdDate;
    
    // Fallback for manual date strings
    const months: {[key: string]: number} = {
      'Januari': 0, 'Jan': 0, 'Februari': 1, 'Feb': 1, 'Maret': 2, 'Mar': 2,
      'April': 3, 'Apr': 3, 'Mei': 4, 'May': 4, 'Juni': 5, 'Jun': 5,
      'Juli': 6, 'Jul': 6, 'Agustus': 7, 'Agu': 7, 'Aug': 7, 'September': 8, 'Sep': 8,
      'Oktober': 9, 'Okt': 9, 'Oct': 9, 'November': 10, 'Nov': 10, 'Desember': 11, 'Des': 11
    };

    try {
      const parts = dateStr.split(' ');
      if (parts.length >= 3) {
        const day = parseInt(parts[0]);
        const monthStr = parts[1];
        const year = parseInt(parts[2]);
        const monthIndex = months[monthStr];
        if (monthIndex !== undefined) return new Date(year, monthIndex, day);
      }
    } catch (e) { return new Date(0); }
    return new Date(0);
  };

  // --- EFFECT: Live Clock Ticker (Check every 10s) ---
  useEffect(() => {
    const timer = setInterval(() => {
        setCurrentTime(Date.now());
    }, 10000); 
    return () => clearInterval(timer);
  }, []);

  // --- Data Fetching & Realtime ---
  useEffect(() => {
    const fetchArticles = async () => {
        if (!supabase) return;
        const { data: artData } = await supabase.from('articles').select('*');
        if (artData) {
            const mappedArticles = artData.map((item: any) => ({
                ...item,
                image: item.image_url || item.image || 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200',
                readTime: item.read_time || item.readTime || '5 min read',
                author_avatar: item.author_avatar,
                date: item.date || new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
                status: (item.status || 'draft').toLowerCase().trim()
            })).sort((a: any, b: any) => {
                const dateA = a.created_at ? new Date(a.created_at) : parseDate(a.date);
                const dateB = b.created_at ? new Date(b.created_at) : parseDate(b.date);
                return dateB.getTime() - dateA.getTime();
            });
            setArticles(mappedArticles);
        }
    };

    const initializeData = async () => {
        if (!supabase) {
            console.warn("Supabase not connected. Loading mock data.");
            setProducts(INITIAL_PRODUCTS);
            setGallery(INITIAL_GALLERY);
            setArticles(INITIAL_ARTICLES);
            setTestimonials(INITIAL_TESTIMONIALS);
            setJobs(INITIAL_JOBS);
            setIsInitializing(false);
            return;
        }

        try {
            const { data: settingsData } = await supabase.from('site_settings').select('*').single();
            if (settingsData) {
                const newConfig = {
                    ...config,
                    heroTitle: settingsData.hero_title || config.heroTitle,
                    heroSubtitle: settingsData.hero_subtitle || config.heroSubtitle,
                    aboutImage: settingsData.about_image || config.aboutImage,
                    sibosUrl: settingsData.sibos_url || config.sibosUrl,
                    qalamUrl: settingsData.qalam_url || config.qalamUrl,
                    companyLegalName: settingsData.company_legal_name || config.companyLegalName,
                    nibNumber: settingsData.nib_number || config.nibNumber,
                    ahuNumber: settingsData.ahu_number || config.ahuNumber,
                    npwpNumber: settingsData.npwp_number || config.npwpNumber,
                    whatsappNumber: settingsData.whatsapp_number || config.whatsappNumber,
                    emailAddress: settingsData.email_address || config.emailAddress,
                    addressSolo: settingsData.address_solo || config.addressSolo,
                    addressBlora: settingsData.address_blora || config.addressBlora,
                    mapSoloLink: settingsData.map_solo_link || config.mapSoloLink,
                    mapBloraLink: settingsData.map_blora_link || config.mapBloraLink,
                    mapSoloEmbed: settingsData.map_solo_embed || config.mapSoloEmbed,
                    mapBloraEmbed: settingsData.map_blora_embed || config.mapBloraEmbed,
                    instagramUrl: settingsData.instagram_url || config.instagramUrl,
                    facebookUrl: settingsData.facebook_url || config.facebookUrl,
                    youtubeUrl: settingsData.youtube_url || config.youtubeUrl,
                    tiktokUrl: settingsData.tiktok_url || config.tiktokUrl,
                    linkedinUrl: settingsData.linkedin_url || config.linkedinUrl,
                    googleAnalyticsId: settingsData.google_analytics_id || '',
                    googleSearchConsoleCode: settingsData.google_search_console_code || '',
                    timezone: settingsData.timezone || config.timezone
                };
                setConfig(newConfig);
                injectGoogleTags(newConfig.googleAnalyticsId, newConfig.googleSearchConsoleCode);
            }

            const [prodRes, galRes, testiRes, jobsRes] = await Promise.all([
                supabase.from('products').select('*').order('id', { ascending: true }),
                supabase.from('gallery').select('*').order('id', { ascending: false }),
                supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
                supabase.from('jobs').select('*').order('created_at', { ascending: false })
            ]);

            if (prodRes.data) {
                const mappedProducts = prodRes.data.map((item: any) => ({
                ...item,
                image: item.image_url || item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800'
                }));
                setProducts(mappedProducts);
            }
            if (galRes.data) setGallery(galRes.data);
            if (testiRes.data) setTestimonials(testiRes.data);
            if (jobsRes.data) setJobs(jobsRes.data);

            await fetchArticles();

        } catch (e) {
            console.error("Data Fetch Error:", e);
        } finally {
            setIsInitializing(false);
        }
    };

    initializeData();

    let articlesChannel: any;
    if (supabase) {
        articlesChannel = supabase
            .channel('public:articles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
                console.log("Realtime: Article update detected!");
                fetchArticles();
            })
            .subscribe();
            
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => {
            subscription.unsubscribe();
            if (articlesChannel) supabase.removeChannel(articlesChannel);
        };
    }
  }, []);

  if (isInitializing) {
      return (
          <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
              <LoadingSpinner size={48} className="text-brand-orange" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">Memuat Sistem...</p>
          </div>
      );
  }

  // --- FILTER: AUTO-PUBLISH LOGIC (Uses Live `currentTime`) ---
  const publishedArticles = articles.filter(a => {
      if (a.status === 'published') return true;
      if (a.status === 'scheduled' && a.scheduled_for) {
          const scheduleTime = new Date(a.scheduled_for).getTime();
          // Safety: If date parsing failed (NaN), don't show
          if (isNaN(scheduleTime)) return false;
          
          // Use live currentTime state instead of static `new Date()`
          return currentTime >= scheduleTime;
      }
      return false;
  });

  return (
    <CartProvider>
      <Layout 
        setPage={handleNavigation} 
        currentPage={getCurrentPageId()} 
        config={config} 
        setConfig={setConfig}
        session={session} 
      >
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={
              <HomePage 
                setPage={handleNavigation} 
                config={config} 
                gallery={gallery} 
                testimonials={testimonials} 
              />
            } />
            <Route path="/home" element={
              <HomePage 
                setPage={handleNavigation} 
                config={config} 
                gallery={gallery} 
                testimonials={testimonials} 
              />
            } />
            
            <Route path="/shop" element={<ShopPage products={products} />} />
            <Route path="/shop/:slug" element={<ProductDetailPage products={products} />} />
            
            <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/gallery/:slug" element={<ProjectDetailPage gallery={gallery} testimonials={testimonials} />} />
            
            {/* ARTICLES: Pass the time-filtered list */}
            <Route path="/articles" element={<ArticlesPage articles={publishedArticles} products={products} />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage articles={publishedArticles} products={products} />} />
            
            <Route path="/services/website" element={<WebsiteServicePage />} />
            <Route path="/services/webapp" element={<WebAppServicePage />} />
            <Route path="/services/seo" element={<SeoServicePage />} />
            <Route path="/services/maintenance" element={<MaintenanceServicePage />} />

            <Route path="/legal/:type" element={<LegalPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} /> 

            <Route path="/about" element={<AboutPage config={config} />} />
            <Route path="/about/vision" element={<VisionPage />} /> 
            <Route path="/career" element={<CareerPage jobs={jobs} />} />
            <Route path="/contact" element={<ContactPage config={config} />} /> 
            
            <Route path="/checkout" element={<CheckoutPage setPage={handleNavigation} />} />
            <Route path="/innovation" element={<InnovationPage config={config} />} />
            
            <Route path="/admin" element={
              session ? (
                <AdminDashboard 
                  products={products} setProducts={setProducts}
                  gallery={gallery} setGallery={setGallery}
                  testimonials={testimonials} setTestimonials={setTestimonials}
                  articles={articles} setArticles={setArticles}
                  jobs={jobs} setJobs={setJobs}
                  config={config} setConfig={setConfig}
                  onLogout={() => supabase?.auth.signOut()}
                />
              ) : (
                <AdminLogin />
              )
            } />

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
