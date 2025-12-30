
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS, INITIAL_JOBS } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial, JobOpening } from './types';
import { CartProvider } from './context/cart-context';
import { LoadingSpinner } from './components/ui'; // Import Loader

// Component Imports
import { Layout } from './components/layout';
import { HomePage } from './pages/home';
import { ShopPage, ProductDetailPage } from './pages/shop';
import { GalleryPage, ProjectDetailPage } from './pages/gallery';
import { ArticlesPage, ArticleDetailPage } from './pages/articles';
import { AboutPage } from './pages/about';
import { VisionPage } from './pages/vision'; 
import { CareerPage } from './pages/career';
import { ContactPage } from './pages/contact';
import { AdminDashboard, AdminLogin } from './pages/admin';
import { CheckoutPage } from './pages/checkout';
import { InnovationPage } from './pages/innovation';
import { WebsiteServicePage, WebAppServicePage, SeoServicePage, MaintenanceServicePage } from './pages/services';
import { LegalPage } from './pages/legal'; 
import { NotFoundPage } from './pages/not-found';

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

  // Data State - Initialize with EMPTY ARRAYS to prevent flash of mock data
  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]); 
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);

  // Config State
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR DIGITAL",
    heroSubtitle: "Solusi kasir modern (POS) dan jasa pembuatan website profesional untuk UMKM Indonesia.",
    aboutImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", 
    sibosUrl: "https://sibos.id",
    qalamUrl: "https://qalam.id",
    whatsappNumber: "6282325103336",
    emailAddress: "admin@kasirsolo.com",
    addressSolo: "Perum Graha Tiara 2 B1, Kartasura",
    addressBlora: "Gumiring 04/04, Banjarejo",
    mapSoloLink: "https://maps.google.com/?q=Perum+Graha+Tiara+2+B1+Kartasura",
    mapBloraLink: "https://maps.google.com/?q=Gumiring+Banjarejo+Blora",
    mapSoloEmbed: "", // Default empty
    mapBloraEmbed: "", // Default empty
    instagramUrl: "https://instagram.com/",
    facebookUrl: "https://facebook.com/",
    youtubeUrl: "https://youtube.com/",
    tiktokUrl: "https://tiktok.com/",
    linkedinUrl: "https://linkedin.com/"
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

  // --- Data Fetching & Realtime ---
  useEffect(() => {
    const initializeData = async () => {
        // 1. CHECK CONNECTION
        if (!supabase) {
            // Fallback for Demo Mode (No DB Connection)
            console.warn("Supabase not connected. Loading mock data.");
            setProducts(INITIAL_PRODUCTS);
            setGallery(INITIAL_GALLERY);
            setArticles(INITIAL_ARTICLES);
            setTestimonials(INITIAL_TESTIMONIALS);
            setJobs(INITIAL_JOBS);
            setIsInitializing(false);
            return;
        }

        // 2. FETCH REAL DATA (If connected)
        try {
            // Fetch Products
            const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: true });
            if (prodData) {
                const mappedProducts = prodData.map((item: any) => ({
                ...item,
                image: item.image_url || item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800'
                }));
                setProducts(mappedProducts);
            }

            // Fetch Gallery
            const { data: galData } = await supabase.from('gallery').select('*').order('id', { ascending: false });
            if (galData) setGallery(galData);

            // Fetch Articles
            const { data: artData } = await supabase.from('articles').select('*');
            if (artData) {
                const mappedArticles = artData.map((item: any) => ({
                    ...item,
                    image: item.image_url || item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800',
                    readTime: item.read_time || item.readTime || '5 min read',
                    date: item.date || new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                })).sort((a: any, b: any) => {
                    const dateA = a.created_at ? new Date(a.created_at) : parseDate(a.date);
                    const dateB = b.created_at ? new Date(b.created_at) : parseDate(b.date);
                    return dateB.getTime() - dateA.getTime();
                });
                setArticles(mappedArticles);
            }

            // Fetch Testimonials
            const { data: testiData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (testiData) setTestimonials(testiData);

            // Fetch Jobs
            const { data: jobsData } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
            if (jobsData) setJobs(jobsData);

            // Fetch Site Settings
            const { data: settingsData } = await supabase.from('site_settings').select('*').single();
            if (settingsData) {
                setConfig(prev => ({
                    ...prev,
                    heroTitle: settingsData.hero_title || prev.heroTitle,
                    heroSubtitle: settingsData.hero_subtitle || prev.heroSubtitle,
                    aboutImage: settingsData.about_image || prev.aboutImage,
                    sibosUrl: settingsData.sibos_url || prev.sibosUrl,
                    qalamUrl: settingsData.qalam_url || prev.qalamUrl,
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
                }));
            }
        } catch (e) {
            console.error("Data Fetch Error:", e);
        } finally {
            setIsInitializing(false); // STOP LOADING
        }
    };

    initializeData();

    // --- REALTIME SUBSCRIPTIONS ---
    let articlesChannel: any;
    if (supabase) {
        articlesChannel = supabase
            .channel('public:articles')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
                // Simplified refresh logic or recall initializeData
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

  // --- RENDER LOADING SCREEN ---
  if (isInitializing) {
      return (
          <div className="min-h-screen bg-brand-black flex flex-col items-center justify-center gap-4">
              <LoadingSpinner size={48} className="text-brand-orange" />
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest animate-pulse">Memuat Data...</p>
          </div>
      );
  }

  return (
    <CartProvider>
      <Layout 
        setPage={handleNavigation} 
        currentPage={getCurrentPageId()} 
        config={config} 
        setConfig={setConfig}
        session={session} 
      >
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
          
          <Route path="/articles" element={<ArticlesPage articles={articles} products={products} />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage articles={articles} products={products} />} />
          
          <Route path="/services/website" element={<WebsiteServicePage />} />
          <Route path="/services/webapp" element={<WebAppServicePage />} />
          <Route path="/services/seo" element={<SeoServicePage />} />
          <Route path="/services/maintenance" element={<MaintenanceServicePage />} />

          <Route path="/legal/:type" element={<LegalPage />} />

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
