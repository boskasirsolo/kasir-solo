import React from 'react';
import { Monitor, ShoppingCart, Menu, X, Rocket } from 'lucide-react';

export const Logo = ({ onClick, className = "" }: { onClick: () => void, className?: string }) => (
  <div onClick={onClick} className={`cursor-pointer flex items-center gap-3 group ${className}`}>
    <div className="w-10 h-10 border-2 border-brand-orange rounded bg-brand-dark flex items-center justify-center shadow-neon group-hover:shadow-neon-strong transition-all duration-300">
      <Monitor className="text-brand-orange w-6 h-6" />
    </div>
    <div>
      <h1 className="text-lg md:text-xl font-bold font-display tracking-wider text-white">MESIN KASIR <span className="text-brand-orange">SOLO</span></h1>
      <p className="text-[8px] md:text-[9px] text-gray-500 tracking-[0.2em] uppercase font-black">Digital Domination Partner</p>
    </div>
  </div>
);

export const CartIcon = ({ count, onClick, mobile = false, id }: { count: number, onClick: () => void, mobile?: boolean, id?: string }) => (
  <button 
    id={id}
    onClick={onClick}
    className={`relative p-2 transition-colors group ${mobile ? 'text-brand-orange' : 'text-gray-400 hover:text-brand-orange'}`}
  >
    <ShoppingCart size={22} className={!mobile ? "group-hover:drop-shadow-neon" : ""} />
    {count > 0 && (
      <span className={`absolute -top-1 -right-1 text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border shadow-neon ${mobile ? 'bg-white text-brand-orange border-brand-orange' : 'bg-brand-orange text-white border-black'}`}>
        {count}
      </span>
    )}
  </button>
);

export const CTAButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="hidden lg:flex bg-brand-gradient hover:bg-brand-gradient-hover text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-full shadow-neon hover:shadow-neon-strong transition-all items-center gap-2 transform hover:-translate-y-0.5"
  >
    <Rocket size={14} /> AMBIL PASUKAN
  </button>
);

export const MenuToggle = ({ isOpen, onClick }: { isOpen: boolean, onClick: () => void }) => (
  <button 
    className="lg:hidden text-brand-orange drop-shadow-neon p-2 rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
    onClick={onClick}
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
);