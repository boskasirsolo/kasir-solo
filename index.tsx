
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial } from './types';
import { CartProvider } from './context/cart-context';

// Component Imports
import { Layout } from './components/layout';
import { HomePage } from './pages/home';
import { ShopPage, ProductDetailPage } from './pages/shop';
import { GalleryPage, ProjectDetailPage } from './pages/gallery';
import { ArticlesPage, ArticleDetailPage } from './pages/articles';
import { AboutPage } from './pages/about';
import { VisionPage } from './pages/vision'; // NEW IMPORT
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
  
  // Data State - Initialize Articles empty to prevent ghosting
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [articles, setArticles] = useState<Article[]>([]); 
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  // Config State
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR DIGITAL",
    heroSubtitle: "Solusi kasir modern (POS) dan jasa pembuatan website profesional untuk UMKM Indonesia.",
    aboutImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200", // Default Fallback
    sibosUrl: "https://sibos.id",
    qalamUrl: "https://qalam.id",
    whatsappNumber: "6282325103336",
    addressSolo: "Perum Graha Tiara 2 B1, Kartasura",
    addressBlora: "Gumiring 04/04, Banjarejo",
    mapSoloLink: "https://maps.google.com/?q=Perum+Graha+Tiara+2+B1+Kartasura",
    mapBloraLink: "https://maps.google.com/?q=Gumiring+Banjarejo+Blora",
    instagramUrl: "https://instagram.com/",
    facebookUrl: "https://facebook.com/",
    youtubeUrl: "https://youtube.com/",
    tiktokUrl: "https://tiktok.com/",
    linkedinUrl: "https://linkedin.com/"
  });

  // --- Router Bridge ---
  const getCurrentPageId = () => {
    // Return path without leading slash
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
    
    // 1. Try standard parse
    const stdDate = new Date(dateStr);
    if (!isNaN(stdDate.getTime())) return stdDate;

    // 2. Manual parse for Indonesian formats
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
        
        if (monthIndex !== undefined) {
          return new Date(year, monthIndex, day);
        }
      }
    } catch (e) { return new Date(0); }
    
    return new Date(0);
  };

  // --- Data Fetching & Realtime ---
  useEffect(() => {
    if (!supabase) {
        // Fallback for Demo Mode (No DB Connection)
        setArticles(INITIAL_ARTICLES);
        return;
    }

    const fetchData = async () => {
      // 1. Fetch Products & Map Image URL
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData && prodData.length > 0) {
        const mappedProducts = prodData.map((item: any) => ({
          ...item,
          image: item.image_url || item.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800'
        }));
        setProducts(mappedProducts);
      }

      const { data: galData } = await supabase.from('gallery').select('*');
      if (galData && galData.length > 0) setGallery(galData);

      // 2. Fetch Articles & Sort
      const fetchArticles = async () => {
        const { data: artData } = await supabase.from('articles').select('*');
        if (artData && artData.length > 0) {
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
      };
      
      fetchArticles();

      const { data: testiData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (testiData && testiData.length > 0) setTestimonials(testiData);

      // 3. Fetch Site Settings
      const { data: settingsData } = await supabase.from('site_settings').select('*').single();
      if (settingsData) {
         setConfig({
             heroTitle: settingsData.hero_title || config.heroTitle,
             heroSubtitle: settingsData.hero_subtitle || config.heroSubtitle,
             aboutImage: settingsData.about_image || config.aboutImage, // ADDED
             sibosUrl: settingsData.sibos_url || config.sibosUrl,
             qalamUrl: settingsData.qalam_url || config.qalamUrl,
             whatsappNumber: settingsData.whatsapp_number || config.whatsappNumber,
             addressSolo: settingsData.address_solo || config.addressSolo,
             addressBlora: settingsData.address_blora || config.addressBlora,
             mapSoloLink: settingsData.map_solo_link || config.mapSoloLink,
             mapBloraLink: settingsData.map_blora_link || config.mapBloraLink,
             instagramUrl: settingsData.instagram_url || config.instagramUrl,
             facebookUrl: settingsData.facebook_url || config.facebookUrl,
             youtubeUrl: settingsData.youtube_url || config.youtubeUrl,
             tiktokUrl: settingsData.tiktok_url || config.tiktokUrl,
             linkedinUrl: settingsData.linkedin_url || config.linkedinUrl,
         });
      }

      // --- REALTIME SUBSCRIPTIONS ---
      const articlesChannel = supabase
        .channel('public:articles')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
          fetchArticles(); // Refetch articles when DB changes
        })
        .subscribe();

      // Cleanup
      return () => {
        supabase.removeChannel(articlesChannel);
      };
    };

    const cleanupPromise = fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
        subscription.unsubscribe();
        // Since cleanupPromise returns a promise that resolves to a cleanup function (which removes channel)
        cleanupPromise.then((cleanup) => cleanup && cleanup());
    };
  }, []);

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
          
          {/* New Service Routes */}
          <Route path="/services/website" element={<WebsiteServicePage />} />
          <Route path="/services/webapp" element={<WebAppServicePage />} />
          <Route path="/services/seo" element={<SeoServicePage />} />
          <Route path="/services/maintenance" element={<MaintenanceServicePage />} />

          {/* Legal Pages */}
          <Route path="/legal/:type" element={<LegalPage />} />

          <Route path="/about" element={<AboutPage config={config} />} />
          <Route path="/about/vision" element={<VisionPage />} /> 
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
