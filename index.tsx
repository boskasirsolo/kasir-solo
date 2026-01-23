import React, { useState, useEffect, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/cart-context';
import { Layout } from './components/layout/index';
import { HomePage } from './pages/home';
import { LoadingSpinner } from './components/ui';
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
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Menyiapkan Amunisi...</p>
  </div>
);

const AppContent = () => {
  const [config, setConfig] = useState({
    hero_title: "AKHIRI ERA {BONCOS}",
    hero_subtitle: "Gue bantu rakit [Sistem Kasir] & Aset Digital yang bikin bisnis lo kerja sendiri.",
    company_legal_name: "PT MESIN KASIR SOLO",
    whatsapp_number: "628816566935",
    is_maintenance_mode: false
  });

  // Mock data for initial render
  const [products] = useState([]);
  const [gallery] = useState([]);
  const [articles] = useState([]);
  const [testimonials] = useState([]);
  const [jobs] = useState([]);

  return (
    <CartProvider>
      <Layout setPage={() => {}} currentPage="" config={config} session={null}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage setPage={(p) => window.location.pathname = p} config={config} gallery={gallery} testimonials={testimonials} />} />
            <Route path="/shop" element={<ShopPage products={products} gallery={gallery} />} />
            <Route path="/gallery" element={<GalleryPage gallery={gallery} testimonials={testimonials} />} />
            <Route path="/articles" element={<ArticlesPage articles={articles} products={products} config={config} />} />
            <Route path="/about" element={<AboutPage config={config} />} />
            <Route path="/contact" element={<ContactPage config={config} />} />
            <Route path="/checkout" element={<CheckoutPage setPage={() => {}} config={config} />} />
            <Route path="/admin" element={<AdminPage session={null} products={products} setProducts={() => {}} gallery={gallery} setGallery={() => {}} testimonials={testimonials} setTestimonials={() => {}} articles={articles} setArticles={() => {}} jobs={jobs} setJobs={() => {}} config={config} setConfig={setConfig} />} />
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