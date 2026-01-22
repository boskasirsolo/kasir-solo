
import React from 'react';
import { LucideIcon } from 'lucide-react';

// --- DASHBOARD BADGE ---
export const CmdBadge = ({ 
  label, 
  variant = 'default',
  className = "" 
}: { 
  label: string, 
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info',
  className?: string
}) => {
  const styles = {
    default: 'bg-white/5 text-gray-400 border-white/10',
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    warning: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20',
    danger: 'bg-red-500/10 text-red-500 border-red-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border tracking-widest ${styles[variant]} ${className}`}>
      {label}
    </span>
  );
};

// --- COMMAND BUTTON (Dashboard Style) ---
export const CmdButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = 'ghost',
  disabled = false,
  className = ""
}: { 
  onClick: (e: any) => void, 
  icon?: any, 
  label?: string,
  variant?: 'primary' | 'ghost' | 'danger' | 'success',
  disabled?: boolean,
  className?: string
}) => {
  const base = "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-30";
  const variants = {
    primary: "bg-brand-orange text-white shadow-neon hover:bg-brand-action",
    ghost: "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/30",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white",
    success: "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white"
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={14} />}
      {label && <span>{label}</span>}
    </button>
  );
};

// --- STATUS DOT ---
export const StatusDot = ({ active = true }: { active?: boolean }) => (
  <div className="relative flex h-2 w-2">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${active ? 'bg-green-400' : 'bg-gray-400'}`}></span>
    <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-green-500' : 'bg-gray-500'}`}></span>
  </div>
);
