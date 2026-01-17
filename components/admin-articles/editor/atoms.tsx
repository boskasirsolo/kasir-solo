import React from 'react';
import { LucideIcon } from 'lucide-react';

// Added optional children to resolve "Property 'children' is missing" errors in consumers
export const SectionLabel = ({ icon: Icon, children, className = "" }: { icon?: LucideIcon, children?: React.ReactNode, className?: string }) => (
    <label className={`text-[9px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-3 ${className}`}>
        {Icon && <Icon size={10} />}
        {children}
    </label>
);

// Added optional children to resolve "Property 'children' is missing" errors in consumers
export const EditorCard = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
    <div className={`bg-white/5 p-4 rounded-xl border border-white/10 ${className}`}>
        {children}
    </div>
);

export const IconButton = ({ icon: Icon, onClick, active, label, color = "brand-orange" }: any) => (
    <button
        onClick={onClick}
        className={`flex-1 py-2 rounded text-[9px] font-bold uppercase transition-all flex items-center justify-center gap-2 border ${
            active 
            ? `bg-${color} text-white border-${color} shadow-neon-text` 
            : 'bg-black/20 border-white/5 text-gray-500 hover:text-gray-300'
        }`}
    >
        {Icon && <Icon size={10} />}
        {label}
    </button>
);
