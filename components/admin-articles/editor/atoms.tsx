
import React from 'react';
import { LucideIcon } from 'lucide-react';

export const SectionLabel = ({ icon: Icon, children, className = "" }: { icon?: LucideIcon, children?: React.ReactNode, className?: string }) => (
    <label className={`text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-3 ${className}`}>
        {Icon && <Icon size={10} />}
        {children}
    </label>
);

export const EditorCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`bg-white/5 p-4 rounded-xl border border-white/10 ${className}`}>
        {children}
    </div>
);

export const ActionPill = ({ active, onClick, label, icon: Icon, color = "brand-orange" }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 px-2 rounded-lg text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-2 border ${
            active 
            ? `bg-${color}/20 border-${color} text-${color.includes('orange') ? 'brand-orange' : color} shadow-neon-text/10` 
            : 'bg-black/20 border-white/5 text-gray-500 hover:text-gray-300'
        }`}
    >
        {Icon && <Icon size={12} />}
        {label}
    </button>
);
