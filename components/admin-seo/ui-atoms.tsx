
import React from 'react';
import { CityType } from './types';

// --- ATOM: Status Badge ---
export const CityTypeBadge = ({ type }: { type: CityType }) => {
    const styles = type === 'Kandang' 
        ? 'bg-brand-orange/10 text-brand-orange border-brand-orange/20' 
        : 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        
    return (
        <span className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${styles}`}>
            {type}
        </span>
    );
};

// --- ATOM: Type Selector Button ---
export const TypeSelectorButton = ({ 
    active, 
    onClick, 
    label, 
    icon 
}: { 
    active: boolean, 
    onClick: () => void, 
    label: string, 
    icon: string 
}) => {
    const activeClass = label.includes('Kandang') 
        ? 'bg-brand-orange text-white border-brand-orange' 
        : 'bg-blue-600 text-white border-blue-600';

    return (
        <button 
            onClick={onClick}
            className={`p-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                active ? activeClass : 'bg-black/20 text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'
            }`}
        >
            <span>{icon}</span> {label}
        </button>
    );
};
