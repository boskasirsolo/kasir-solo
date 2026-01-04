
import React from 'react';
import { Sparkles, Loader2, Wand2 } from 'lucide-react';

export const Label = ({ children, icon: Icon, className = "" }: { children: React.ReactNode, icon?: any, className?: string }) => (
    <label className={`text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block flex items-center gap-1 ${className}`}>
        {Icon && <Icon size={10} />}
        {children}
    </label>
);

export const AIButton = ({ 
    onClick, 
    loading, 
    label = "Auto-Gen", 
    variant = "blue" 
}: { 
    onClick: () => void, 
    loading: boolean, 
    label?: string,
    variant?: "blue" | "orange"
}) => {
    const colorClass = variant === 'orange' ? 'text-brand-orange' : 'text-blue-400';
    
    return (
        <button 
            onClick={onClick} 
            disabled={loading} 
            className={`text-[9px] ${colorClass} hover:text-white flex items-center gap-1 disabled:opacity-50 transition-colors`}
        >
            {loading ? <Loader2 size={10} className="animate-spin"/> : <><Wand2 size={10}/> {label}</>}
        </button>
    );
};

export const FieldHeader = ({ 
    label, 
    onAI, 
    loading 
}: { 
    label: string, 
    onAI?: () => void, 
    loading?: boolean 
}) => (
    <div className="flex justify-between items-center mb-1">
        <Label>{label}</Label>
        {onAI && <AIButton onClick={onAI} loading={loading || false} />}
    </div>
);
