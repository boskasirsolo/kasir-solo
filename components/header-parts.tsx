import React, { useEffect } from 'react';
import { Monitor, ShoppingCart, ChevronDown, ChevronRight, FileText, Menu, X } from 'lucide-react';

// --- TYPES ---
export interface NavItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

// --- ATOMS ---

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

export const CartIcon = ({ count, onClick, mobile = false }: { count: number, onClick: () => void, mobile?: boolean }) => (
  <button 
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
    <FileText size={16} /> MINTA PENAWARAN
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

// --- MOLECULES (Desktop) ---

const DesktopDropdown = ({ 
  item, 
  current, 
  onNavigate 
}: { 
  item: NavItem, 
  current: string, 
  onNavigate: (id: string) => void 
}) => {
  const isActive = item.children?.some(child => current === child.id || current.startsWith(child.id));

  return (
    <div className="relative group">
      <button className={`flex items-center gap-1 text-sm font-bold tracking-wide transition-all duration-300 py-4 ${
        isActive ? 'text-brand-orange' : 'text-gray-400 hover:text-white'
      }`}>
        {item.label.toUpperCase()} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
      </button>
      
      {/* Dropdown Content */}
      <div className="absolute left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 z-50 min-w-[260px]">
         <div className="bg-brand-dark/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2 flex flex-col gap-1 overflow-hidden ring-1 ring-black/5">
            {item.children?.map((child, idx) => (
              <button 
                key={idx}
                onClick={() => onNavigate(child.id)}
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
  );
};

export const DesktopMenu = ({ 
  items, 
  current, 
  onNavigate 
}: { 
  items: NavItem[], 
  current: string, 
  onNavigate: (id: string) => void 
}) => (
  <div className="hidden lg:flex items-center gap-6 xl:gap-8">
    {items.map((item) => (
      <React.Fragment key={item.id}>
        {item.children ? (
          <DesktopDropdown item={item} current={current} onNavigate={onNavigate} />
        ) : (
          <button
            onClick={() => onNavigate(item.id)}
            className={`text-sm font-bold tracking-wide transition-all duration-300 ${
              current === item.id 
                ? 'text-brand-orange drop-shadow-[0_0_8px_rgba(255,95,31,0.8)] scale-105' 
                : 'text-gray-400 hover:text-white hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]'
            }`}
          >
            {item.label.toUpperCase()}
          </button>
        )}
      </React.Fragment>
    ))}
  </div>
);

// --- ORGANISMS (Mobile) ---

const MobileNavItem: React.FC<{ 
  item: NavItem; 
  current: string; 
  onNavigate: (id: string) => void;
}> = ({ 
  item, 
  current, 
  onNavigate 
}) => {
  if (item.children) {
    return (
      <div className="flex flex-col gap-2 bg-white/5 rounded-xl p-4 border border-white/5">
         <div className="text-left text-brand-orange text-xs font-bold uppercase tracking-widest px-2 flex items-center gap-2 mb-2">
            {item.label}
         </div>
         <div className="flex flex-col gap-1 pl-2 border-l-2 border-white/10">
           {item.children.map((child, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(child.id)}
                className={`text-left font-bold p-3 rounded-lg hover:bg-white/5 transition-all flex items-center justify-between w-full group pl-4 text-sm ${
                  current === child.id ? 'text-brand-orange bg-brand-orange/10 border-l-2 border-brand-orange' : 'text-gray-300 font-normal'
                }`}
              >
                {child.label}
              </button>
           ))}
         </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={`text-left font-bold p-3 rounded-lg hover:bg-white/5 transition-all flex items-center justify-between w-full group text-base ${
        current === item.id ? 'text-brand-orange bg-brand-orange/10 border-l-2 border-brand-orange pl-3' : 'text-gray-300 border-l-2 border-transparent'
      }`}
    >
      {item.label}
      {current === item.id && <ChevronRight size={16} />}
    </button>
  );
};

export const MobileMenu = ({ 
  isOpen, 
  items, 
  current, 
  onNavigate, 
  onClose,
  onContactClick
}: { 
  isOpen: boolean, 
  items: NavItem[], 
  current: string, 
  onNavigate: (id: string) => void, 
  onClose: () => void,
  onContactClick: () => void
}) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;
  
  return (
    <div className="lg:hidden fixed inset-0 z-40 bg-brand-black/95 backdrop-blur-xl overflow-y-auto animate-fade-in">
      <div className="min-h-screen pt-24 pb-12 px-6 flex flex-col gap-6">
        {items.map((item) => (
          <MobileNavItem 
            key={item.id} 
            item={item} 
            current={current} 
            onNavigate={(id) => { onNavigate(id); onClose(); }} 
          />
        ))}
        
        <div className="mt-6 pt-6 border-t border-white/10">
           <p className="text-gray-500 text-xs mb-3 text-center uppercase tracking-widest font-bold">Layanan Korporat</p>
           <button
              onClick={() => { onContactClick(); onClose(); }}
              className="flex w-full items-center justify-center gap-2 bg-brand-gradient text-white py-4 rounded-xl font-bold shadow-neon text-sm hover:bg-brand-gradient-hover transition-colors"
           >
              <FileText size={18} /> MINTA PENAWARAN RESMI
           </button>
        </div>
      </div>
    </div>
  );
};