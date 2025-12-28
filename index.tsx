
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
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

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
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

  // --- Initial Data Fetching ---
  useEffect(() => {
    // Only attempt fetch if Supabase client exists
    if (!supabase) return;

    const fetchData = async () => {
      // Products
      const { data: prodData } = await supabase.from('products').select('*');
      if (prodData && prodData.length > 0) setProducts(prodData);

      // Gallery
      const { data: galData } = await supabase.from('gallery').select('*');
      if (galData && galData.length > 0) setGallery(galData);

      // Articles
      const { data: artData } = await supabase.from('articles').select('*');
      if (artData && artData.length > 0) setArticles(artData);
      
      // Testimonials
      const { data: testiData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (testiData && testiData.length > 0) setTestimonials(testiData);
    };

    fetchData();

    // Check Auth Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- Router ---
  const renderPage = () => {
    switch(currentPage) {
      case 'home': 
        return (
          <HomePage 
            setPage={setCurrentPage} 
            config={config} 
            gallery={gallery} 
            testimonials={testimonials} 
          />
        );
      case 'shop': return <ShopPage products={products} />;
      case 'gallery': return <GalleryPage gallery={gallery} testimonials={testimonials} />;
      case 'articles': return <ArticlesPage articles={articles} products={products} />;
      case 'about': return <AboutPage />;
      case 'checkout': return <CheckoutPage setPage={setCurrentPage} />;
      case 'innovation': return <InnovationPage config={config} />;
      case 'admin': 
        return session ? (
          <AdminDashboard 
            products={products} setProducts={setProducts}
            gallery={gallery} setGallery={setGallery}
            testimonials={testimonials} setTestimonials={setTestimonials}
            config={config} setConfig={setConfig}
            onLogout={() => supabase?.auth.signOut()}
          />
        ) : (
          <AdminLogin />
        );
      default: 
        return (
          <NotFoundPage setPage={setCurrentPage} />
        );
    }
  };

  return (
    <CartProvider>
      <Layout setPage={setCurrentPage} currentPage={currentPage} config={config}>
        {renderPage()}
      </Layout>
    </CartProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
