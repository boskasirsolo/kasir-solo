
import React, { useState } from 'react';
import { Monitor, Menu, X, Instagram, Facebook, MapPin, Phone, Lock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cart-context';

// --- DATA & CONSTANTS ---
const NAV_ITEMS = [
  { id: 'home', label: 'Beranda' },
  { id: 'shop', label: 'Toko' },
  { id: 'gallery', label: 'Galeri' },
  { id: 'articles', label: 'Artikel' },
  { id: 'about', label: 'Tentang' },
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

const NavLink = ({ 
  label, 
  active, 
  onClick, 
  mobile = false 
}: { 
  label: string, 
  active: boolean, 
  onClick: () => void, 
  mobile?: boolean 
}) => {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`text-left text-lg font-bold p-2 rounded hover:bg-white/5 transition-all ${
          active ? 'text-brand-orange pl-4 border-l-2 border-brand-orange' : 'text-gray-400'
        }`}
      >
        {label}
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

const CartButton = ({ count, onClick, mobile = false }: { count: number, onClick: () => void, mobile?: boolean }) => (
  <button 
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

const SocialButton = ({ icon: Icon }: { icon: any }) => (
  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon">
    <Icon size={20} />
  </a>
);

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
  <div className="hidden md:flex items-center gap-8">
    {NAV_ITEMS.map((item) => (
      <NavLink 
        key={item.id} 
        label={item.label} 
        active={current === item.id} 
        onClick={() => setPage(item.id)} 
      />
    ))}
    <CartButton count={cartCount} onClick={() => setPage('checkout')} />
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
  <div className="flex items-center gap-4 md:hidden">
    <CartButton count={cartCount} onClick={onCartClick} mobile />
    <button 
      className="text-brand-orange drop-shadow-neon"
      onClick={onToggle}
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
  if (!isOpen) return null;
  return (
    <div className="md:hidden bg-brand-dark border-b border-brand-orange/20 p-4 absolute w-full shadow-2xl animate-fade-in z-40">
      <div className="flex flex-col gap-4">
        {NAV_ITEMS.map((item) => (
          <NavLink 
            key={item.id} 
            label={item.label} 
            active={current === item.id} 
            onClick={() => { setPage(item.id); onClose(); }} 
            mobile 
          />
        ))}
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
  const { totalItems } = useCart(); // Logic cart ada di sini

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-50">
        <Logo onClick={() => setPage('home')} />
        
        <DesktopNav 
          current={currentPage} 
          setPage={setPage} 
          cartCount={totalItems} 
        />
        
        <MobileNavToggle 
          isOpen={isMenuOpen} 
          onToggle={() => setIsMenuOpen(!isMenuOpen)} 
          cartCount={totalItems} 
          onCartClick={() => setPage('checkout')}
        />
      </div>

      <MobileMenuOverlay 
        isOpen={isMenuOpen} 
        current={currentPage} 
        setPage={setPage} 
        onClose={() => setIsMenuOpen(false)} 
      />
    </nav>
  );
};

const Footer = ({ setPage }: { setPage: (p: string) => void }) => (
  <footer className="bg-brand-dark border-t border-white/5 py-12 mt-20 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-brand-orange shadow-neon opacity-50"></div>
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-10">
        {/* Brand Section */}
        <div>
          <h3 className="text-2xl font-display font-bold text-white mb-4">PT MESIN KASIR SOLO</h3>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Mitra strategis digitalisasi bisnis Anda di Solo Raya. Solusi POS, Software, & Web Development.
          </p>
          <div className="flex gap-4">
            <SocialButton icon={Instagram} />
            <SocialButton icon={Facebook} />
          </div>
        </div>
        
        {/* Contact Section */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Kontak</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-start gap-3"><MapPin className="text-brand-orange shrink-0 mt-1" size={18} /><span>Gumpang, Kartasura, Sukoharjo</span></li>
            <li className="flex items-center gap-3"><Phone className="text-brand-orange shrink-0" size={18} /><span>0823 2510 3336</span></li>
          </ul>
        </div>

        {/* Menu Section */}
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Menu</h4>
          <ul className="space-y-2 text-gray-400 text-sm">
            {['shop', 'gallery', 'about'].map((link) => (
              <li key={link}>
                <button 
                  onClick={() => setPage(link)} 
                  className="hover:text-brand-orange capitalize transition-colors"
                >
                  {link === 'shop' ? 'Produk' : link === 'about' ? 'Kontak' : link}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright & Admin Trigger */}
      <div className="border-t border-white/5 mt-10 pt-6 flex flex-col items-center gap-2">
        <p className="text-center text-gray-600 text-xs">© {new Date().getFullYear()} PT Mesin Kasir Solo.</p>
        <button onClick={() => setPage('admin')} className="text-gray-800 hover:text-brand-orange transition-colors p-2">
          <Lock size={12} />
        </button>
      </div>
    </div>
  </footer>
);

// --- TEMPLATE: Main Layout ---

export const Layout = ({ 
  children, 
  setPage, 
  currentPage 
}: { 
  children?: React.ReactNode, 
  setPage: (p: string) => void, 
  currentPage: string 
}) => {
  // --- MODIFICATION: Hide Header/Footer on Admin Page ---
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
        <main className="flex-grow">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
      <Header currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow pt-24">
        {children}
      </main>

      <Footer setPage={setPage} />
    </div>
  );
};
