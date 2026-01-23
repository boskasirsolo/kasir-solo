import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/cart-context';
import { Layout } from './components/layout/index';
import { HomePage } from './pages/home';
import { LoadingSpinner } from './components/ui';
import { supabase } from './utils'; 
import { Product, GalleryItem, Article, Testimonial, JobOpening } from './types';
import './index.css';

// Lazy Pages
const ShopPage = lazy(() => import('./pages/shop').then(m => ({ default: m.ShopPage })));
const GalleryPage = lazy(() => import('./pages/gallery').then(m => ({ default: m.GalleryPage })));
const ArticlesPage = lazy(() => import('./pages/articles').then(m => ({ default: m.ArticlesPage })));
const AboutPage = lazy(() => import('./pages/about').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/contact').then(m => ({ default: m.ContactPage })));
const CheckoutPage = lazy(() => import('./pages/checkout').then(m => ({ default: m.CheckoutPage })));
const AdminPage = lazy(() => import('./pages/admin'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <LoadingSpinner size={32} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Menghubungkan ke Radar...</p>
  </div>
);

const AppContent = () => {
  const [session, setSession] = useState<any>(null);
  const [config, setConfig] = useState({
    hero_title: "AKHIRI ERA {BONCOS}",
    hero_subtitle: "Gue bantu rakit [Sistem Kasir] & Aset Digital yang bikin bisnis lo kerja sendiri.",
    company_legal_name: "PT MESIN KASIR SOLO",
    whatsapp_number: "628816566935",
    is_maintenance_mode: false
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [jobs, setJobs] = useState<JobOpening[]>([]);

  // --- KABEL DATA UTAMA ---
  const fetchAllData = async () => {
    if (!supabase) return;
    try {
        const [prod, gal, art, testi] = await Promise.all([
            supabase.from('products').select('*').order('created_at', { ascending: false }),
            supabase.from('gallery').select('*').order('created_at', { ascending: false }),
            supabase.from('articles').select('*').eq('status', 'published').order('created_at', { ascending: false }),
            supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
            supabase.from('site_settings').select('*').eq('id', 1).single()
        ]);

        if (prod.data) setProducts(prod.data.map(p => ({ ...p, image: p.image_url })));
        if (gal.data) setGallery(gal.data);
        if (art.data) setArticles(art.data.map(a => ({ ...a, image: a.image_url, readTime: a.read_time })));
        if (testi.data) setTestimonials(testi.data);
        // Special case for settings
        const settings = await supabase.from('site_settings').select('*').eq('id', 1).single();
        if (settings.data) setConfig(settings.data);
    } catch (e) { console.error("Global Fetch Error", e); }
  };

  useEffect(() => {
    // 1. Cek sesi
    if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    }
    // 2. Tarik data biar halaman publik gak zonk
    fetchAllData();
  }, []);

  return (
    <CartProvider>
      <Layout setPage={(p) => window.location.pathname = p} currentPage={window.location.pathname.split('/')[1] || 'home'} config={config} setConfig={setConfig} session={session}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage setPage={(p) => window.location.href = p} config={config} gallery={gallery} testimonials={testimonials} />} />
            <Route path="/shop" element={<ShopPage products={products} gallery={gallery} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/articles" element={<ArticlesPage articles={articles} products={products} config={config} />} />
            <Route path="/about" element={<AboutPage config={config} />} />
            <Route path="/contact" element={<ContactPage config={config} />} />
            <Route path="/checkout" element={<CheckoutPage setPage={(p) => window.location.href = p} config={config} />} />
            <Route path="/admin" element={<AdminPage 
                session={session} 
                products={products} setProducts={setProducts} 
                gallery={gallery} setGallery={setGallery} 
                testimonials={testimonials} setTestimonials={setTestimonials} 
                articles={articles} setArticles={setArticles} 
                jobs={jobs} setJobs={setJobs} 
                config={config} setConfig={setConfig} 
            />} />
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

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}