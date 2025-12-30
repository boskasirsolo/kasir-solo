
import React, { useState, useEffect } from 'react';
import { Monitor, Menu, X, Instagram, Facebook, MapPin, Phone, Lock, ShoppingCart, Youtube, Linkedin, Video, ChevronDown, ArrowUp, FileText, ChevronRight } from 'lucide-react';
import { useCart } from '../context/cart-context';
import { SiteConfig, Product } from '../types';
import { SibosWidget } from './sibos-core/index'; // CRITICAL FIX: Specific import path
import { INITIAL_PRODUCTS } from '../utils';

// --- DATA & CONSTANTS ---
// Corporate Menu Structure - Refined Narrative
const NAV_ITEMS = [
  { id: 'home', label: 'Beranda' },
  { 
    id: 'company', 
    label: 'Tentang Kami',
    children: [
      { id: 'about', label: 'Profil Perusahaan' },
      { id: 'about/vision', label: 'Visi & Misi' }, 
      { id: 'career', label: 'Karir' }, // ADDED
      { id: 'gallery', label: 'Klien & Portfolio' },
      { id: 'contact', label: 'Hubungi Kami' }, // MOVED HERE
    ]
  },
  { 
    id: 'solutions', 
    label: 'Solusi Bisnis',
    children: [
      { id: 'shop', label: 'Hardware Kasir (POS)' },
      { id: 'innovation', label: 'Software Aplikasi (SaaS)' },
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

// --- ATOMS: Visual Components ---

const Logo = ({ onClick, className = "" }: { onClick: () => void, className?: string }) => (
  <div onClick={onClick} className={`cursor-pointer flex items-center gap-3 group ${className}`}>
    <div className="w-10 h-10 border-2 border-brand-orange rounded bg-brand-dark flex items-center justify-center shadow-neon group-hover:shadow-neon-strong transition-all duration-300">
      <Monitor className="text-brand-orange w-6 h-6" />
    </div>
    <div>
      <h1 className="text-xl font-bold font-display tracking-wider text-white">MESIN KASIR <span className="text-brand-orange">SOLO</span></h1>
      <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Digital Solutions Partner</p>
    </div>
  </div>
);

interface NavLinkProps {
  label: string;
  active: boolean;
  onClick: () => void;
  mobile?: boolean;
  isChild?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ 
  label, 
  active, 
  onClick, 
  mobile = false,
  isChild = false
}) => {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`text-left font-bold p-3 rounded-lg hover:bg-white/5 transition-all flex items-center justify-between w-full group ${
          active ? 'text-brand-orange bg-brand-orange/10 border-l-2 border-brand-orange pl-3' : 'text-gray-300 border-l-2 border-transparent'
        } ${isChild ? 'pl-8 text-sm font-normal' : 'text-base'}`}
      >
        {label}
        {mobile && !isChild && active && <ChevronRight size={16} />}
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`text-sm font-bold tracking-wide transition-all duration-300 ${
        active 
          ? 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,95,31,0.8)] scale-105' 
          : 'text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'
      }`}
    >
      {label.toUpperCase()}
    </button>
  );
};

const CartButton = ({ count, onClick, mobile = false, id }: { count: number, onClick: () => void, mobile?: boolean, id?: string }) => (
  <button 
    id={id}
    onClick={onClick}
    className={`relative p-2 transition-colors group ${mobile ? 'text-brand-orange' : 'text-gray-400 hover:text-brand-orange'}`}
  >
    <ShoppingCart size={24} className={!mobile ? "group-hover:drop-shadow-neon" : ""} />
    {count > 0 && (
      <span className={`absolute top-0 right-0 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border shadow-neon ${mobile ? 'bg-white text-brand-orange border-brand-orange' : 'bg-brand-orange text-white border-black'}`}>
        {count}
      </span>
    )}
  </button>
);

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

// --- MOLECULES: Grouped Components ---

const DesktopNav = ({ 
  current, 
  setPage, 
  cartCount 
}: { 
  current: string, 
  setPage: (id: string) => void, 
  cartCount: number 
}) => (
  <div className="hidden lg:flex items-center gap-6 xl:gap-8">
    {NAV_ITEMS.map((item) => (
      <React.Fragment key={item.id}>
        {item.children ? (
          // DROPDOWN MENU
          <div className="relative group">
            <button className={`flex items-center gap-1 text-sm font-bold tracking-wide transition-all duration-300 py-4 ${
              item.children.some(child => child.id === current || current.startsWith(child.id))
                ? 'text-brand-orange' 
                : 'text-gray-400 hover:text-white'
            }`}>
              {item.label.toUpperCase()} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
            </button>
            
            {/* Dropdown Content */}
            <div className="absolute left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 z-50 min-w-[260px]">
               <div className="bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1 overflow-hidden ring-1 ring-black/5">
                  {item.children.map((child, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setPage(child.id)}
                      className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between group/item ${
                        current === child.id 
                          ? 'bg-brand-orange text-white shadow-md' 
                          : 'text-gray-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {child.label}
                      {current !== child.id && <ChevronRight size={14} className="opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all text-brand-orange" />}
                    </button>
                  ))}
               </div>
            </div>
          </div>
        ) : (
          // STANDARD LINK
          <NavLink 
            label={item.label} 
            active={current === item.id} 
            onClick={() => setPage(item.id)} 
          />
        )}
      </React.Fragment>
    ))}
    
    <div className="h-6 w-px bg-white/10 mx-2"></div>
    
    <CartButton id="desktop-cart-btn" count={cartCount} onClick={() => setPage('checkout')} />
    
    {/* CTA Button */}
    <a 
      href="https://wa.me/6282325103336?text=Halo%20PT%20Mesin%20Kasir%20Solo,%20saya%20ingin%20minta%20penawaran%20harga%20untuk%20perusahaan."
      target="_blank"
      rel="noreferrer"
      className="bg-brand-gradient hover:bg-brand-gradient-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-neon hover:shadow-neon-strong transition-all flex items-center gap-2 transform hover:-translate-y-0.5"
    >
      <FileText size={16} /> MINTA PENAWARAN
    </a>
  </div>
);

const MobileNavToggle = ({ 
  isOpen, 
  onToggle, 
  cartCount, 
  onCartClick 
}: { 
  isOpen: boolean, 
  onToggle: () => void, 
  cartCount: number, 
  onCartClick: () => void 
}) => (
  <div className="flex items-center gap-4 lg:hidden relative z-50">
    <CartButton id="mobile-cart-btn" count={cartCount} onClick={onCartClick} mobile />
    <button 
      className="text-brand-orange drop-shadow-neon p-2 rounded-md hover:bg-white/10 transition-colors"
      onClick={onToggle}
      aria-label="Toggle Menu"
    >
      {isOpen ? <X size={28} /> : <Menu size={28} />}
    </button>
  </div>
);

const MobileMenuOverlay = ({ 
  isOpen, 
  current, 
  setPage, 
  onClose 
}: { 
  isOpen: boolean, 
  current: string, 
  setPage: (id: string) => void, 
  onClose: () => void 
}) => {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col gap-6">
        {NAV_ITEMS.map((item) => (
          <React.Fragment key={item.id}>
             {item.children ? (
                // Group Header & Children for Mobile
                <div className="flex flex-col gap-2 bg-white/5 rounded-xl p-4 border border-white/5">
                   <div className="text-left text-brand-orange text-xs font-bold uppercase tracking-widest px-2 flex items-center gap-2 mb-2">
                      {item.label}
                   </div>
                   <div className="flex flex-col gap-1 pl-2 border-l-2 border-white/10">
                     {item.children.map((child, idx) => (
                        <NavLink 
                          key={idx}
                          label={child.label} 
                          active={current === child.id} 
                          onClick={() => { setPage(child.id); onClose(); }} 
                          mobile
                          isChild
                        />
                     ))}
                   </div>
                </div>
             ) : (
                <NavLink 
                  label={item.label} 
                  active={current === item.id} 
                  onClick={() => { setPage(item.id); onClose(); }} 
                  mobile 
                />
             )}
          </React.Fragment>
        ))}
        
        <div className="mt-6 pt-6 border-t border-white/10">
           <p className="text-gray-500 text-xs mb-3 text-center uppercase tracking-widest font-bold">Layanan Korporat</p>
           <a 
              href="https://wa.me/6282325103336?text=Halo%20PT%20Mesin%20Kasir%20Solo,%20saya%20ingin%20minta%20penawaran%20harga."
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-center gap-2 bg-brand-gradient text-white py-4 rounded-xl font-bold shadow-neon text-sm hover:bg-brand-gradient-hover transition-colors"
           >
              <FileText size={18} /> MINTA PENAWARAN RESMI
           </a>
        </div>
      </div>
    </div>
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

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-50">
          <Logo onClick={() => { setPage('home'); setIsMenuOpen(false); }} />
          
          <DesktopNav 
            current={currentPage} 
            setPage={setPage} 
            cartCount={totalItems} 
          />
          
          <MobileNavToggle 
            isOpen={isMenuOpen} 
            onToggle={() => setIsMenuOpen(!isMenuOpen)} 
            cartCount={totalItems} 
            onCartClick={() => { setPage('checkout'); setIsMenuOpen(false); }}
          />
        </div>
      </nav>

      {/* Render overlay outside of nav structure for better stacking context management */}
      <MobileMenuOverlay 
        isOpen={isMenuOpen} 
        current={currentPage} 
        setPage={setPage} 
        onClose={() => setIsMenuOpen(false)} 
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
            <li><button onClick={() => setPage('innovation')} className="hover:text-brand-orange transition-colors flex items-center gap-2"><ChevronRight size={12}/> Software Aplikasi</button></li>
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
