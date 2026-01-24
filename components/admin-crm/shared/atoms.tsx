import React from 'react';
// Added Search to the imports from lucide-react
import { LucideIcon, Search } from 'lucide-react';

export const NavTabButton = ({ 
  active, 
  onClick, 
  icon: Icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: LucideIcon; 
  label: string 
}) => (
  <button 
    onClick={onClick} 
    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
      active 
        ? 'bg-brand-orange text-white shadow-neon' 
        : 'text-gray-500 hover:text-gray-300'
    }`}
  >
    <Icon size={14}/> {label}
  </button>
);

export const StatusIndicator = ({ color }: { color: string }) => (
  <div className={`w-1.5 h-1.5 rounded-full ${color} animate-pulse shadow-[0_0_8px_currentColor]`}></div>
);

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Cari Juragan..." 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  placeholder?: string 
}) => {
  // Removed require call to fix "Cannot find name 'require'" error and used imported Search icon instead
  return (
    <div className="relative group">
      <Search size={14} className="absolute left-3 top-2.5 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
      <input 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="bg-brand-dark border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white outline-none focus:border-brand-orange w-40 transition-all focus:w-52"
      />
    </div>
  );
};