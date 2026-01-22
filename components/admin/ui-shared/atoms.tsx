
import React from 'react';
import { LucideIcon, Loader2, Sparkles } from 'lucide-react';

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

// --- COMMAND BUTTON ---
export const CmdButton = ({ 
  onClick, 
  icon: Icon, 
  label, 
  variant = 'ghost',
  disabled = false,
  className = "",
  type = "button"
}: { 
  onClick?: (e: any) => void, 
  icon?: any, 
  label?: string,
  variant?: 'primary' | 'ghost' | 'danger' | 'success',
  disabled?: boolean,
  className?: string,
  type?: "button" | "submit"
}) => {
  const base = "flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 disabled:opacity-30";
  const variants = {
    primary: "bg-brand-orange text-white shadow-neon hover:bg-brand-action border-none",
    ghost: "bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/30",
    danger: "bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white",
    success: "bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500 hover:text-white"
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={14} />}
      {label && <span>{label}</span>}
    </button>
  );
};

// --- ATOMIC FORM ELEMENTS ---

export const AdminInput = ({ className = "", ...props }: any) => (
  <input 
    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 ${className}`}
    {...props}
  />
);

export const AdminTextArea = ({ className = "", ...props }: any) => (
  <textarea 
    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 resize-none custom-scrollbar ${className}`}
    {...props}
  />
);

export const AdminSelect = ({ children, className = "", ...props }: any) => (
  <select 
    className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-all cursor-pointer appearance-none ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const AdminCheckbox = ({ checked, onChange, label, className = "" }: any) => (
  <label className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}>
    <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${checked ? 'bg-brand-orange border-brand-orange shadow-neon-text/20' : 'bg-black/40 border-white/10 group-hover:border-white/30'}`}>
      {checked && <div className="w-2 h-2 bg-white rounded-full animate-scale-in"></div>}
    </div>
    {label && <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${checked ? 'text-white' : 'text-gray-500 group-hover:text-gray-400'}`}>{label}</span>}
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
  </label>
);

export const StatusDot = ({ active = true }: { active?: boolean }) => (
  <div className="relative flex h-2 w-2">
    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${active ? 'bg-green-400' : 'bg-gray-400'}`}></span>
    <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-green-500' : 'bg-gray-500'}`}></span>
  </div>
);
