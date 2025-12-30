
import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Lock, ChevronRight, Instagram, Facebook, Youtube, Linkedin, Video, ArrowUp } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { SiteConfig } from '../types';
import { SibosWidget } from './sibos-core/index';
import { INITIAL_PRODUCTS } from '../utils';

// Import Atomic Header Components
import { 
  Logo, 
  DesktopMenu, 
  CartIcon, 
  CTAButton, 
  MenuToggle, 
  MobileMenu,
  NavItem 
} from './header-parts';

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

// --- ATOMS: Footer Atoms ---

const SocialButton = ({ icon: Icon, href }: { icon: any, href?: string }) => {
  if (!href) return null;
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon"
    >
      <Icon size={20} />
    </a>
  );
};

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

  // Logic: Close menu when page changes (handled inside components) or reset state on route change
  // For now, the components handle close on click.

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

const Footer = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => (
  <footer className="bg-brand-dark border-t border-white/5 py-16 mt-20 relative overflow-hidden">
    {/* Decorative Top Line */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent shadow-neon opacity-70"></div>
    
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-12">
        {/* Brand Section */}
        <div className="md:col-span-1 space-y-6">
          <div>
            <h3 className="text-2xl font-display font-bold text-white mb-2">PT MESIN KASIR SOLO</h3>
            <div className="h-1 w-12 bg-brand-orange rounded-full"></div>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Mitra teknologi terpercaya untuk digitalisasi bisnis di Indonesia. Menyediakan solusi Hardware POS, Software SaaS, dan Jasa Pengembangan Website sejak 2015.
          </p>
          <div className="flex gap-3 flex-wrap">
            <SocialButton icon={Instagram} href={config.instagramUrl} />
            <SocialButton icon={Facebook} href={config.facebookUrl} />
            <SocialButton icon={Youtube} href={config.youtubeUrl} />
            <SocialButton icon={Linkedin} href={config.linkedinUrl} />
            <SocialButton icon={Video} href={config.tiktokUrl} /> 
          </div>
        </div>
        
        {/* Solusi Bisnis Section */}
        <div className="md:col-span-1">
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-l-2 border-brand-orange pl-3">Solusi Digital</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><button onClick={() => setPage('shop')} className="hover:text-brand-orange transition-colors flex items-center gap-2"><ChevronRight size={12}/> Hardware Kasir</button></li>
            <li><button onClick={() => setPage('innovation')} className="hover:text-brand-orange transition-colors flex items-center gap-2"><ChevronRight size={12}/> Inovasi Aplikasi</button></li>
            <li><button onClick={() => setPage('services/website')} className="hover:text-brand-orange transition-colors flex items-center gap-2"><ChevronRight size={12}/> Jasa Website</button></li>
            <li><button onClick={() => setPage('services/seo')} className="hover:text-brand-orange transition-colors flex items-center gap-2"><ChevronRight size={12}/> Jasa SEO</button></li>
            <li><button onClick={() => setPage('services/maintenance')} className="hover:text-brand-orange transition-colors flex items-center gap-2"><ChevronRight size={12}/> Maintenance</button></li>
          </ul>
        </div>

        {/* Perusahaan & Legal Section */}
        <div className="md:col-span-1">
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-l-2 border-brand-orange pl-3">Perusahaan</h4>
          <ul className="space-y-3 text-gray-400 text-sm">
            <li><button onClick={() => setPage('about')} className="hover:text-brand-orange transition-colors">Tentang Kami</button></li>
            <li><button onClick={() => setPage('gallery')} className="hover:text-brand-orange transition-colors">Klien & Portfolio</button></li>
            <li><button onClick={() => setPage('career')} className="hover:text-brand-orange transition-colors">Karir</button></li>
            <li><button onClick={() => setPage('contact')} className="hover:text-brand-orange transition-colors">Hubungi Kami</button></li>
          </ul>
        </div>

        {/* Contact Section */}
        <div className="md:col-span-1">
          <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-l-2 border-brand-orange pl-3">Hubungi Kami</h4>
          <ul className="space-y-5 text-gray-400 text-sm">
            
            {/* HEAD OFFICE (SOLO) */}
            <li className="flex items-start gap-3 group cursor-pointer" onClick={() => window.open(config.mapSoloLink, '_blank')}>
                <div className="p-2 bg-white/5 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <MapPin size={18} />
                </div>
                <div>
                    <span className="text-white font-bold text-xs block mb-1">HEAD OFFICE (SOLO)</span>
                    <span className="leading-tight block">{config.addressSolo || "Perum Graha Tiara 2 B1, Kartasura"}</span>
                </div>
            </li>

            {/* OPERATIONAL OFFICE (BLORA) */}
            <li className="flex items-start gap-3 group cursor-pointer" onClick={() => window.open(config.mapBloraLink, '_blank')}>
                <div className="p-2 bg-white/5 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <MapPin size={18} />
                </div>
                <div>
                    <span className="text-white font-bold text-xs block mb-1">KANTOR OPERASIONAL</span>
                    <span className="leading-tight block">{config.addressBlora || "Gumiring 04/04, Banjarejo"}</span>
                </div>
            </li>

            {/* HOTLINE */}
            <li className="flex items-start gap-3 group cursor-pointer" onClick={() => window.open(`https://wa.me/${config.whatsappNumber}`, '_blank')}>
              <div className="p-2 bg-white/5 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                  <Phone size={18} />
              </div>
              <div>
                  <span className="text-white font-bold text-xs block mb-1">HOTLINE (24/7)</span>
                  <span className="text-lg font-bold text-gray-400 group-hover:text-brand-orange transition-colors">
                    {config.whatsappNumber ? (config.whatsappNumber.startsWith('62') ? `+${config.whatsappNumber}` : config.whatsappNumber) : "0823 2510 3336"}
                  </span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright & Legal - UPDATED LAYOUT */}
      <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
            <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} <strong className="text-gray-500">PT Mesin Kasir Solo</strong>. All Rights Reserved.
            </p>
            {/* NEW LEGAL LINKS PLACEMENT */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <button onClick={() => setPage('legal/refund')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Kebijakan Refund & Garansi</button>
                <button onClick={() => setPage('legal/privacy')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Kebijakan Privasi</button>
                <button onClick={() => setPage('legal/terms')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Syarat dan Ketentuan</button>
            </div>
        </div>

        <div className="flex items-center gap-4">
            <button onClick={() => setPage('admin')} className="text-gray-800 hover:text-brand-orange transition-colors p-2" title="Admin Login">
                <Lock size={12} />
            </button>
        </div>
      </div>
    </div>
  </footer>
);

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
