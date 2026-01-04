
import React from 'react';
import { AdminTabId } from './types';

// --- ATOM: Tab Button ---
export const TabButton = ({ 
    id, 
    label, 
    icon: Icon, 
    isActive, 
    onClick 
}: { 
    id: AdminTabId, 
    label: string, 
    icon: any, 
    isActive: boolean, 
    onClick: () => void 
}) => (
    <button 
      onClick={onClick} 
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-wide transition-all border ${
        isActive 
          ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text translate-y-[-1px]' 
          : 'bg-brand-card text-gray-400 border-white/5 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
);

// --- ATOM: Header Action Button ---
export const HeaderActionBtn = ({ 
    onClick, 
    icon: Icon, 
    variant = 'default',
    title 
}: { 
    onClick: () => void, 
    icon: any, 
    variant?: 'default' | 'danger' | 'info',
    title?: string
}) => {
    let baseClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-colors border ";
    if (variant === 'danger') baseClass += "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white";
    else if (variant === 'info') baseClass += "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500 hover:text-white";
    else baseClass += "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30";

    return (
        <button onClick={onClick} className={baseClass} title={title}>
            <Icon size={14} />
        </button>
    );
};

// --- ATOM: Store Sub-Tab ---
export const StoreSubTabBtn = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label 
}: { 
    active: boolean, 
    onClick: () => void, 
    icon: any, 
    label: string 
}) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${
        active
        ? 'bg-brand-orange text-white shadow-lg'
        : 'text-gray-400 hover:text-white'
        }`}
    >
        <Icon size={14} /> {label}
    </button>
);
