
import React from 'react';
import { Monitor, ShoppingCart, FileText, Menu, X } from 'lucide-react';

export const Logo = ({ onClick, className = "" }: { onClick: () => void, className?: string }) => (
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

// FIX: Added 'id' to the props interface and destructuring, and applied it to the button element
export const CartIcon = ({ count, onClick, mobile = false, id }: { count: number, onClick: () => void, mobile?: boolean, id?: string }) => (
  <button 
    id={id}
    onClick={onClick}
    className={`relative p-2 transition-colors group ${mobile ? 'text-brand-orange' : 'text-gray-400 hover:text-brand-orange'}`}
    aria-label="Shopping Cart"
  >
    <ShoppingCart size={24} className={!mobile ? "group-hover:drop-shadow-neon" : ""} />
    {count > 0 && (
      <span className={`absolute top-0 right-0 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border shadow-neon ${mobile ? 'bg-white text-brand-orange border-brand-orange' : 'bg-brand-orange text-white border-black'}`}>
        {count}
      </span>
    )}
  </button>
);

export const CTAButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="hidden lg:flex bg-brand-gradient hover:bg-brand-gradient-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-neon hover:shadow-neon-strong transition-all items-center gap-2 transform hover:-translate-y-0.5"
  >
    <FileText size={16} /> HUBUNGI GUE
  </button>
);

export const MenuToggle = ({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) => (
  <button 
    className="lg:hidden text-brand-orange drop-shadow-neon p-2 rounded-md hover:bg-white/10 transition-colors"
    onClick={onClick}
    aria-label="Toggle Menu"
  >
    {isOpen ? <X size={28} /> : <Menu size={28} />}
  </button>
);
