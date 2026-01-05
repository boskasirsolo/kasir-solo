
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { NavItem } from '../types';

export const DesktopDropdown = ({ 
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
