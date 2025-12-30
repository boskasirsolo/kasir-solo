
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Instagram, Facebook, Youtube, Linkedin, Video, ArrowUp } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { SiteConfig } from '../types';
import { SibosWidget } from './sibos-core/index';
import { INITIAL_PRODUCTS } from '../utils';

// Import Header Parts
import { 
  Logo, 
  DesktopMenu, 
  CartIcon, 
  CTAButton, 
  MenuToggle, 
  MobileMenu,
  NavItem 
} from './header-parts';

// Import Footer Parts
import {
  FooterContainer,
  BrandColumn,
  FooterColumn,
  SectionTitle,
  ContactItem,
  FooterBottom
} from './footer-parts';

// --- DATA: NAVIGATION STRUCTURE ---
const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Beranda' },
  { 
    id: 'company', 
    label: 'Tentang Kami',
    children: [
      { id: 'about', label: 'Profil Perusahaan' },
      { id: 'about/vision', label: 'Visi & Misi' }, 
      { id: 'career', label: 'Karir' },
      { id: 'gallery', label: 'Klien & Portfolio' },
      { id: 'contact', label: 'Hubungi Kami' },
    ]
  },
  { 
    id: 'solutions', 
    label: 'Solusi Bisnis',
    children: [
      { id: 'shop', label: 'Hardware Kasir (POS)' },
      { id: 'innovation', label: 'Inovasi Aplikasi (SaaS)' },
      { id: 'services/website', label: 'Jasa Pembuatan Website' },
      { id: 'services/webapp', label: 'Custom Web App' },
      { id: 'services/seo', label: 'Optimasi SEO & Traffic' },
      { id: 'services/maintenance', label: 'Maintenance & Security' },
    ]
  },
  { 
    id: 'support', 
    label: 'Pusat Bantuan',
    children: [
      { id: 'legal/refund', label: 'Klaim Garansi & Retur' },
      { id: 'legal/privacy', label: 'Kebijakan Privasi' },
      { id: 'legal/terms', label: 'Syarat & Ketentuan' },
    ]
  },
  { id: 'articles', label: 'Wawasan' },
];

// --- ORGANISMS: Main Blocks ---

const Header = ({ 
  currentPage, 
  setPage 
}: { 
  currentPage: string, 
  setPage: (p: string) => void 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart(); 

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-50">
          
          <Logo onClick={() => { setPage('home'); setIsMenuOpen(false); }} />
          
          {/* Desktop Navigation */}
          <DesktopMenu 
            items={NAV_ITEMS} 
            current={currentPage} 
            onNavigate={setPage} 
          />
          
          {/* Action Group (Cart & Mobile Toggle) */}
          <div className="flex items-center gap-4">
             {/* Desktop Cart */}
             <div className="hidden lg:block">
                <CartIcon count={totalItems} onClick={() => setPage('checkout')} />
             </div>
             
             {/* Desktop CTA */}
             <CTAButton onClick={() => setPage('contact')} />

             {/* Mobile Cart & Toggle */}
             <div className="flex items-center gap-4 lg:hidden">
                <CartIcon count={totalItems} onClick={() => { setPage('checkout'); setIsMenuOpen(false); }} mobile />
                <MenuToggle isOpen={isMenuOpen} onClick={() => setIsMenuOpen(!isMenuOpen)} />
             </div>
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={isMenuOpen} 
        items={NAV_ITEMS}
        current={currentPage}
        onNavigate={setPage}
        onClose={() => setIsMenuOpen(false)}
        onContactClick={() => setPage('contact')}
      />
    </>
  );
};

const Footer = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => {
  
  // Logic: Prepare Data for Footer Columns
  const solutionsLinks = [
    { label: 'Hardware Kasir', action: () => setPage('shop') },
    { label: 'Inovasi Aplikasi', action: () => setPage('innovation') },
    { label: 'Jasa Website', action: () => setPage('services/website') },
    { label: 'Jasa SEO', action: () => setPage('services/seo') },
    { label: 'Maintenance', action: () => setPage('services/maintenance') },
  ];

  const companyLinks = [
    { label: 'Tentang Kami', action: () => setPage('about') },
    { label: 'Klien & Portfolio', action: () => setPage('gallery') },
    { label: 'Karir', action: () => setPage('career') },
    { label: 'Hubungi Kami', action: () => setPage('contact') },
  ];

  const socialLinks = [
    { icon: Instagram, url: config.instagramUrl },
    { icon: Facebook, url: config.facebookUrl },
    { icon: Youtube, url: config.youtubeUrl },
    { icon: Linkedin, url: config.linkedinUrl },
    { icon: Video, url: config.tiktokUrl },
  ];

  return (
    <FooterContainer>
      <div className="grid md:grid-cols-4 gap-12">
        
        {/* 1. Brand Section */}
        <BrandColumn 
          description="Mitra teknologi terpercaya untuk digitalisasi bisnis di Indonesia. Menyediakan solusi Hardware POS, Software SaaS, dan Jasa Pengembangan Website sejak 2015."
          socials={socialLinks}
        />
        
        {/* 2. Solusi Bisnis Section */}
        <FooterColumn title="Solusi Digital" links={solutionsLinks} />

        {/* 3. Perusahaan Section */}
        <FooterColumn title="Perusahaan" links={companyLinks} />

        {/* 4. Contact Section */}
        <div className="md:col-span-1">
          <SectionTitle>Hubungi Kami</SectionTitle>
          <ul className="space-y-5">
            <ContactItem 
              icon={MapPin}
              label="HEAD OFFICE (SOLO)"
              value={config.addressSolo || "Perum Graha Tiara 2 B1, Kartasura"}
              onClick={() => window.open(config.mapSoloLink, '_blank')}
            />
            <ContactItem 
              icon={MapPin}
              label="KANTOR OPERASIONAL"
              value={config.addressBlora || "Gumiring 04/04, Banjarejo"}
              onClick={() => window.open(config.mapBloraLink, '_blank')}
            />
            <ContactItem 
              icon={Phone}
              label="HOTLINE (24/7)"
              value={config.whatsappNumber ? (config.whatsappNumber.startsWith('62') ? `+${config.whatsappNumber}` : config.whatsappNumber) : "0823 2510 3336"}
              onClick={() => window.open(`https://wa.me/${config.whatsappNumber}`, '_blank')}
            />
          </ul>
        </div>
      </div>

      {/* 5. Bottom Bar */}
      <FooterBottom 
        year={new Date().getFullYear()} 
        onLegalClick={setPage}
        onAdminClick={() => setPage('admin')}
      />
    </FooterContainer>
  );
};

// --- ATOM: Scroll To Top Button ---
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-24 right-6 z-[9980] p-3 rounded-full bg-brand-dark border border-brand-orange text-brand-orange shadow-neon transition-all duration-300 transform hover:-translate-y-1 hover:bg-brand-orange hover:text-white ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp size={24} />
    </button>
  );
};

// --- TEMPLATE: Main Layout ---

export const Layout = ({ 
  children, 
  setPage, 
  currentPage,
  config,
  setConfig,
  session
}: { 
  children?: React.ReactNode, 
  setPage: (p: string) => void, 
  currentPage: string,
  config: SiteConfig,
  setConfig?: (c: SiteConfig) => void,
  session?: any
}) => {
  // Hide Header/Footer on Admin Page
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
        <main className="flex-grow">
          {children}
        </main>
        {/* SIBOS AI WIDGET (ADMIN MODE) */}
        <SibosWidget products={INITIAL_PRODUCTS} isAdmin={true} currentPage={currentPage} setConfig={setConfig} session={session} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
      <Header currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow pt-[76px]"> {/* Adjusted padding for fixed header */}
        {children}
      </main>

      <Footer setPage={setPage} config={config} />
      
      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTop />

      {/* SIBOS AI WIDGET (PUBLIC MODE) - Pass currentPage & session */}
      <SibosWidget products={INITIAL_PRODUCTS} isAdmin={false} currentPage={currentPage} setConfig={setConfig} session={session} />
    </div>
  );
};
