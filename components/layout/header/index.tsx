
import React, { useState } from 'react';
import { useCart } from '../../../context/cart-context';
import { NAV_ITEMS } from '../constants';
import { Logo, CartIcon, CTAButton, MenuToggle } from './atoms';
import { DesktopMenu } from './desktop';
import { MobileMenu } from './mobile';

export const Header = ({ 
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
