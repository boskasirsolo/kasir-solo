
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase, INITIAL_PRODUCTS, INITIAL_GALLERY, INITIAL_ARTICLES, INITIAL_TESTIMONIALS } from './utils';
import { Product, Article, GalleryItem, SiteConfig, Testimonial } from './types';
import { CartProvider } from './context/cart-context';

// Component Imports
import { Layout } from './components/layout';
import { HomePage } from './pages/home';
import { ShopPage } from './pages/shop';
import { GalleryPage } from './pages/gallery';
import { ArticlesPage } from './pages/articles';
import { AboutPage } from './pages/about';
import { AdminDashboard, AdminLogin } from './pages/admin';
import { CheckoutPage } from './pages/checkout';
import { InnovationPage } from './pages/innovation';
import { NotFoundPage } from './pages/not-found';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [session, setSession] = useState<any>(null);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);

  // Config State
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR DIGITAL",
    heroSubtitle: "Solusi kasir modern (POS) dan jasa pembuatan website profesional untuk UMKM Indonesia.",
    sibosUrl: "https://sibos.id",
    qalamUrl: "https://qalam.id",
    whatsappNumber: "6282325103336",
    instagramUrl: "https://instagram.com/",
    facebookUrl: "https://facebook.com/",
    youtubeUrl: "https://youtube.com/",
    tiktokUrl: "https://tiktok.com/",
    linkedinUrl: "https://linkedin.com/"
  });

  // --- Router Bridge ---
  // Convert URL path to a simplified "Page ID" string for Layout props
  const getCurrentPageId = () => {
    // Standardize path extraction for Layout active state
    // Splits /shop/detail -> returns 'shop' to keep nav active
    const path = location.pathname.split('/')[1] || 'home';
    return path;
  };

  // Convert old "setPage" calls to Router "navigate"
  const handleNavigation = (pageId: string) => {
    if (pageId === 'home') navigate('/');
    else navigate(`/${pageId}`);
    
    window.scrollTo(0, 0);
  };

  // --- Initial Data Fetching ---
  useEffect(() => {
    if (!supabase) return;

    const fetchData = async () => {
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData && prodData.length > 0) setProducts(prodData);

      const { data: galData } = await supabase.from('gallery').select('*');
      if (galData && galData.length > 0) setGallery(galData);

      const { data: artData } = await supabase.from('articles').select('*');
      if (artData && artData.length > 0) setArticles(artData);
      
      const { data: testiData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (testiData && testiData.length > 0) setTestimonials(testiData);
    };

    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <CartProvider>
      <Layout setPage={handleNavigation} currentPage={getCurrentPageId()} config={config}>
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
          <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
          <Route path="/articles" element={<ArticlesPage articles={articles} products={products} />} />
          <Route path="/about" element={<AboutPage />} />
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
