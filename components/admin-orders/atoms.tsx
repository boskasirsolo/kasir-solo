import React from 'react';
import { getStatusColor } from './utils';

export const StatusBadge = ({ status, className = "" }: { status: string, className?: string }) => (
    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${getStatusColor(status)} ${className}`}>
        {status}
    </span>
);

export const ActionBtn = ({ 
    onClick, 
    children, 
    variant = "default", 
    disabled = false,
    title = ""
}: { 
    onClick: (e: any) => void, 
    children?: React.ReactNode, 
    variant?: "default" | "success" | "ghost",
    disabled?: boolean,
    title?: string
}) => {
    let classes = "px-3 py-1.5 rounded text-[10px] font-bold transition-all flex items-center gap-2 ";
    
    if (variant === "default") classes += "bg-white/5 hover:bg-white/10 border border-white/10 text-white";
    if (variant === "success") classes += "bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400";
    if (variant === "ghost") classes += "text-gray-500 hover:text-white hover:bg-white/10 p-1";

    return (
        <button onClick={onClick} disabled={disabled} className={classes} title={title}>
            {children}
        </button>
    );
};

export const InfoRow = ({ icon: Icon, label, value, href }: { icon: any, label?: string, value: string, href?: string }) => (
    <div className="flex items-center gap-3 text-gray-400 text-sm">
        <Icon size={14} className="text-gray-500 shrink-0"/>
        {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="hover:text-brand-orange transition-colors">
                {value}
            </a>
        ) : (
            <span className={label ? "font-bold text-white" : ""}>{value}</span>
        )}
    </div>
);