
import React, { useEffect } from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { NavItem } from '../types';

export const MobileNavItem: React.FC<{ 
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
