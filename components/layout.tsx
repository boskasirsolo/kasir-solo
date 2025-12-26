
import React, { useState } from 'react';
import { Monitor, Menu, X, Instagram, Facebook, MapPin, Phone, Lock, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/cart-context';

export const Layout = ({ 
  children, 
  setPage, 
  currentPage 
}: { 
  children?: React.ReactNode, 
  setPage: (p: string) => void, 
  currentPage: string 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useCart();

  const navItems = [
    { id: 'home', label: 'Beranda' },
    { id: 'shop', label: 'Toko' },
    { id: 'gallery', label: 'Galeri' },
    { id: 'articles', label: 'Artikel' },
    { id: 'about', label: 'Tentang' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-brand-black/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => setPage('home')} 
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 border-2 border-brand-orange rounded bg-brand-dark flex items-center justify-center shadow-neon group-hover:shadow-neon-strong transition-all duration-300">
              <Monitor className="text-brand-orange w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display tracking-wider text-white">MESIN KASIR <span className="text-brand-orange">SOLO</span></h1>
              <p className="text-[10px] text-gray-400 tracking-[0.2em] uppercase">Digital Solutions Partner</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`text-sm font-bold tracking-wide transition-all duration-300 ${
                  currentPage === item.id 
                    ? 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,95,31,0.8)] scale-105' 
                    : 'text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'
                }`}
              >
                {item.label.toUpperCase()}
              </button>
            ))}
            
            {/* Cart Button */}
            <button 
              onClick={() => setPage('checkout')}
              className="relative p-2 text-gray-400 hover:text-brand-orange transition-colors group"
            >
              <ShoppingCart size={24} className="group-hover:drop-shadow-neon" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-brand-orange text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-black shadow-neon">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Toggle & Cart */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={() => setPage('checkout')}
              className="relative p-2 text-brand-orange"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-white text-brand-orange text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-brand-orange">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              className="text-brand-orange drop-shadow-neon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-brand-dark border-b border-brand-orange/20 p-4 absolute w-full shadow-2xl animate-fade-in">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPage(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left text-lg font-bold p-2 rounded hover:bg-white/5 transition-all ${
                    currentPage === item.id ? 'text-brand-orange pl-4 border-l-2 border-brand-orange' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-24">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-brand-dark border-t border-white/5 py-12 mt-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-brand-orange shadow-neon opacity-50"></div>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-4">PT MESIN KASIR SOLO</h3>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Mitra strategis digitalisasi bisnis Anda di Solo Raya. Solusi POS, Software, & Web Development.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon"><Facebook size={20} /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Kontak</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3"><MapPin className="text-brand-orange shrink-0 mt-1" size={18} /><span>Gumpang, Kartasura, Sukoharjo</span></li>
                <li className="flex items-center gap-3"><Phone className="text-brand-orange shrink-0" size={18} /><span>0823 2510 3336</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm border-l-2 border-brand-orange pl-3">Menu</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><button onClick={() => setPage('shop')} className="hover:text-brand-orange">Produk</button></li>
                <li><button onClick={() => setPage('gallery')} className="hover:text-brand-orange">Galeri</button></li>
                <li><button onClick={() => setPage('about')} className="hover:text-brand-orange">Kontak</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-10 pt-6 flex flex-col items-center gap-2">
            <p className="text-center text-gray-600 text-xs">© {new Date().getFullYear()} PT Mesin Kasir Solo.</p>
            <button onClick={() => setPage('admin')} className="text-gray-800 hover:text-brand-orange transition-colors p-2"><Lock size={12} /></button>
          </div>
        </div>
      </footer>
    </div>
  );
};
