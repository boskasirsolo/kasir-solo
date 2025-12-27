import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// Imports from modules
import { Layout } from './components/layout';
import { supabase, INITIAL_PRODUCTS, INITIAL_ARTICLES, INITIAL_GALLERY } from './utils';
import { Product, Article, GalleryItem, SiteConfig } from './types';
import { CartProvider } from './context/cart-context';
import { ConfirmModal } from './components/ui';

// Pages
import { HomePage } from './pages/home';
import { ShopPage } from './pages/shop';
import { GalleryPage } from './pages/gallery';
import { ArticlesPage } from './pages/articles';
import { AboutPage } from './pages/about';
import { AdminLogin, AdminDashboard } from './pages/admin';
import { CheckoutPage } from './pages/checkout';
import { InnovationPage } from './pages/innovation';

// --- Main App Controller ---

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Modal State
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  
  const [config, setConfig] = useState<SiteConfig>({
    heroTitle: "MESIN KASIR SOLO & DIGITAL AGENCY",
    heroSubtitle: "Pusat penjualan mesin kasir modern (POS) dan jasa pembuatan website profesional untuk digitalisasi bisnis UMKM hingga Korporasi di Seluruh Indonesia.",
    sibosUrl: "", 
    qalamUrl: "",
    // Default Contact & Footer
    whatsappNumber: "082325103336",
    addressSolo: "Perum Graha Tiara 2 B1, Kartasura",
    addressBlora: "Gumiring 04/04, Banjarejo",
    instagramUrl: "https://instagram.com",
    facebookUrl: "https://facebook.com",
    youtubeUrl: "",
    tiktokUrl: "",
    linkedinUrl: ""
  });

  // --- 1. NAVIGATION LOGIC (History API) ---
  const handlePageChange = (page: string) => {
    try {
      window.history.pushState({ page }, '', `?page=${page}`);
    } catch (e) {}
    
    setCurrentPage(page);
    try {
      window.scrollTo(0, 0);
    } catch (e) {}
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageParam = params.get('page');
    if (pageParam) {
      setCurrentPage(pageParam);
    } else if (window.location.pathname === '/master') {
      setCurrentPage('admin');
    }

    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        const p = new URLSearchParams(window.location.search).get('page');
        setCurrentPage(p || 'home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // --- 2. AUTH STATE LISTENER (Supabase) ---
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAdminLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAdminLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);


  // --- 3. DATA FETCHING & AUTO-SEEDING ---
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;
      try {
        // 1. PRODUCTS FETCH & SEED
        const { data: prodData } = await supabase.from('products').select('*').order('id', { ascending: false });
        
        if (prodData && prodData.length > 0) {
          setProducts(prodData.map(p => ({
            ...p, 
            image: p.image_url || 'https://via.placeholder.com/400'
          })));
        } else {
          // SEED PRODUCTS (Hapus ID biar auto-increment)
          console.log("Seeding Products...");
          const seedProducts = INITIAL_PRODUCTS.map(({id, ...p}) => ({
            name: p.name,
            price: p.price,
            category: p.category,
            description: p.description,
            image_url: p.image
          }));
          const { data: seededData } = await supabase.from('products').insert(seedProducts).select();
          if (seededData) setProducts(seededData.map(p => ({ ...p, image: p.image_url })));
        }

        // 2. ARTICLES FETCH
        const { data: artData } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
        if (artData && artData.length > 0) {
          setArticles(artData.map(a => ({
            ...a, 
            date: new Date(a.created_at).toLocaleDateString('id-ID'), 
            image: a.image_url || 'https://via.placeholder.com/400'
          })));
        }

        // 3. GALLERY FETCH & SEED
        const { data: galData } = await supabase.from('gallery').select('*').order('created_at', { ascending: false });
        if (galData && galData.length > 0) {
          setGallery(galData);
        } else {
          // SEED GALLERY (Hapus ID biar auto-increment)
          console.log("Seeding Gallery...");
          // IMPORTANT: Remove 'id' from seed data to prevent primary key conflicts with new schema
          const seedGallery = INITIAL_GALLERY.map(({ id, ...item }) => item);
          
          const { data: seededGallery, error: seedError } = await supabase.from('gallery').insert(seedGallery).select();
          
          if (seededGallery && !seedError) {
             setGallery(seededGallery);
          } else {
             console.error("Gallery seed error:", seedError);
          }
        }

      } catch (error) { console.error("Error fetching data:", error); }
    };
    fetchData();
  }, []);

  // --- LOGOUT LOGIC ---
  const handleLogoutClick = () => setShowLogoutConfirm(true);
  const performLogout = async () => {
    if (supabase) await supabase.auth.signOut();
    setShowLogoutConfirm(false);
    handlePageChange('home');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <HomePage setPage={handlePageChange} config={config} />;
      case 'shop': return <ShopPage products={products} />;
      case 'gallery': return <GalleryPage gallery={gallery} />;
      case 'articles': return <ArticlesPage articles={articles} products={products} />;
      case 'about': return <AboutPage />;
      case 'innovation': return <InnovationPage config={config} />; 
      case 'checkout': return <CheckoutPage setPage={handlePageChange} />;
      case 'admin': 
        return isAdminLoggedIn 
          ? <AdminDashboard 
              products={products} setProducts={setProducts}
              gallery={gallery} setGallery={setGallery}
              config={config} setConfig={setConfig}
              onLogout={handleLogoutClick}
            /> 
          : <AdminLogin />;
      default: return <HomePage setPage={handlePageChange} config={config} />;
    }
  };

  return (
    <CartProvider>
      <Layout setPage={handlePageChange} currentPage={currentPage} config={config}>
        {renderPage()}
        
        <ConfirmModal 
          isOpen={showLogoutConfirm}
          onClose={() => setShowLogoutConfirm(false)}
          onConfirm={performLogout}
          title="Konfirmasi Logout"
          message="Apakah Anda yakin ingin keluar dari Dashboard Admin?"
          confirmText="Ya, Logout"
          cancelText="Batal"
          variant="danger"
        />
      </Layout>
    </CartProvider>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);