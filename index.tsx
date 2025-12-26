
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Imports from modules
import { Layout } from './components/layout';
import { supabase, INITIAL_PRODUCTS, INITIAL_ARTICLES, INITIAL_GALLERY } from './utils';
import { Product, Article, GalleryItem, SiteConfig } from './types';
import { CartProvider } from './context/cart-context';

// Pages
import { HomePage } from './pages/home';
import { ShopPage } from './pages/shop';
import { GalleryPage } from './pages/gallery';
import { ArticlesPage } from './pages/articles';
import { AboutPage } from './pages/about';
import { AdminLogin, AdminDashboard } from './pages/admin';
import { CheckoutPage } from './pages/checkout'; // New Page

// --- Main App Controller ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR SOLO & DIGITAL AGENCY",
    heroSubtitle: "Pusat penjualan mesin kasir modern (POS) dan jasa pembuatan website profesional untuk digitalisasi bisnis UMKM hingga Korporasi di Solo Raya."
  });

  // Admin Route Check
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (window.location.pathname === '/master' || params.get('page') === 'master') {
      setCurrentPage('admin');
    }
  }, []);

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      try {
        const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
        if (prodData && prodData.length > 0) setProducts(prodData.map(p => ({...p, image: p.image_url || 'https://via.placeholder.com/400'})));

        const { data: artData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (artData && artData.length > 0) setArticles(artData.map(a => ({...a, date: new Date(a.created_at).toLocaleDateString('id-ID'), image: a.image_url || 'https://via.placeholder.com/400'})));

        const { data: galData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galData && galData.length > 0) setGallery(galData);

      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchData();
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [currentPage]);

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage setPage={setCurrentPage} config={config} />;
      case 'shop': return <ShopPage products={products} />;
      case 'gallery': return <GalleryPage gallery={gallery} />;
      case 'articles': return <ArticlesPage articles={articles} />;
      case 'about': return <AboutPage />;
      case 'checkout': return <CheckoutPage setPage={setCurrentPage} />;
      case 'admin': 
        return isAdminLoggedIn 
          ? <AdminDashboard 
              products={products} setProducts={setProducts}
              gallery={gallery} setGallery={setGallery}
              config={config} setConfig={setConfig}
            /> 
          : <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />;
      default: return <HomePage setPage={setCurrentPage} config={config} />;
    }
  };

  return (
    <CartProvider>
      <Layout setPage={setCurrentPage} currentPage={currentPage}>
        {renderPage()}
      </Layout>
    </CartProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
