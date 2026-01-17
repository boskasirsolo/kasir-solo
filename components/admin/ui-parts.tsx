
import React from 'react';
import { AdminTabId } from './types';
import { ChevronRight } from 'lucide-react';

// --- ATOM: Sidebar Tab Button ---
/* FIX: Explicitly type as React.FC to handle 'key' prop correctly in TS when mapped in dashboard-shell.tsx */
export const SidebarTabButton: React.FC<{ 
    id: AdminTabId, 
    label: string, 
    icon: any, 
    isActive: boolean, 
    onClick: () => void 
}> = ({ 
    id, 
    label, 
    icon: Icon, 
    isActive, 
    onClick 
}) => (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all border group ${
        isActive 
          ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text/20 scale-[1.02]' 
          : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-gray-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={isActive ? 'text-white' : 'text-gray-600 group-hover:text-brand-orange transition-colors'} />
        <span className="uppercase tracking-wider">{label}</span>
      </div>
      {isActive && <ChevronRight size={14} className="animate-pulse" />}
    </button>
);

// --- ATOM: Sidebar Group Header ---
export const SidebarGroupHeader = ({ label }: { label: string }) => (
    <div className="px-4 mt-6 mb-2">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em]">
            {label}
        </p>
    </div>
);

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
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
        active
        ? 'bg-brand-orange text-white shadow-neon'
        : 'text-gray-500 hover:text-white'
        }`}
    >
        <Icon size={14} /> {label}
    </button>
);

// --- ATOM: Action Button Sidebar ---
export const SidebarActionBtn = ({ 
    onClick, 
    icon: Icon, 
    label,
    variant = 'default' 
}: { 
    onClick: () => void, 
    icon: any, 
    label: string,
    variant?: 'default' | 'danger'
}) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
            variant === 'danger' 
            ? 'bg-red-500/5 text-red-500 border-red-500/10 hover:bg-red-500 hover:text-white' 
            : 'bg-white/5 text-gray-400 border-white/5 hover:text-white hover:border-brand-orange/50'
        }`}
    >
        <Icon size={16} /> {label}
    </button>
);
