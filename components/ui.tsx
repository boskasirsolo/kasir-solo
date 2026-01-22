
import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, AlertTriangle, Sparkles } from 'lucide-react';

// --- Atoms ---

// FIX: Added missing Input component to resolve export errors in multiple files
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = "", ...props }, ref) => (
    <input 
      ref={ref}
      className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 ${className}`}
      {...props}
    />
  )
);
Input.displayName = 'Input';

// FIX: Added missing TextArea component to resolve export errors in multiple files
export const TextArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className = "", ...props }, ref) => (
    <textarea 
      ref={ref}
      className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 resize-none custom-scrollbar ${className}`}
      {...props}
    />
  )
);
TextArea.displayName = 'TextArea';

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = "", 
  disabled = false,
  type = 'button',
  ...props
}: { 
  children?: React.ReactNode, 
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success', 
  onClick?: () => void, 
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit',
  [key: string]: any
}) => {
  const baseStyles = "relative overflow-hidden rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-90 select-none group h-12 px-6";
  
  const variants = {
    primary: "bg-brand-gradient text-white shadow-action hover:shadow-action-strong border-none",
    outline: "bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white shadow-neon-text/10",
    ghost: "text-gray-500 hover:text-white hover:bg-white/5 border-none",
    danger: "bg-red-600/10 text-red-500 border-2 border-red-500/20 hover:bg-red-600 hover:text-white",
    success: "bg-green-600/10 text-green-500 border-2 border-green-500/20 hover:bg-green-600 hover:text-white"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {/* Subtle Shine Effect on Hover */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] pointer-events-none"></div>
    </button>
  );
};

// FIX: Updated Card typing to React.FC to allow standard attributes like 'key' in list rendering
export const Card: React.FC<{ 
    children?: React.ReactNode, 
    className?: string, 
    hover?: boolean,
    glass?: boolean
}> = ({ 
    children, 
    className = "", 
    hover = true,
    glass = false 
}) => (
  <div className={`
    ${glass ? 'glass-v2' : 'bg-brand-card border border-white/5'} 
    rounded-3xl overflow-hidden transition-all duration-500 
    ${hover ? 'hover:border-brand-orange/40 hover:shadow-neon hover:-translate-y-2' : ''} 
    ${className}
  `}>
    {children}
  </div>
);

export const SectionHeader = ({ title, subtitle, highlight, align = "center" }: { title: string, subtitle?: string, highlight: string, align?: "center" | "left" }) => (
  <div className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}>
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 mb-4 ${align === 'center' ? 'mx-auto' : ''}`}>
        <Sparkles size={12} className="text-brand-orange animate-pulse" />
        <span className="text-[10px] font-black text-brand-orange uppercase tracking-widest">Premium Solutions</span>
    </div>
    <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-4 leading-tight">
      {title} <span className="text-brand-orange relative">
        {highlight}
        <div className="absolute -bottom-2 left-0 w-full h-1 bg-brand-orange/30 blur-sm"></div>
      </span>
    </h2>
    {subtitle && <p className="text-gray-500 text-base md:text-lg max-w-2xl leading-relaxed italic">{subtitle}</p>}
  </div>
);

export const LoadingSpinner = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 size={size} className="animate-spin text-brand-orange" />
  </div>
);

export const Badge = ({ children, color = "orange", className = "" }: { children?: React.ReactNode, color?: "orange" | "blue" | "green" | "red", className?: string }) => {
    const colors = {
        orange: "text-brand-orange border-brand-orange/30 bg-brand-orange/10",
        blue: "text-blue-400 border-blue-400/30 bg-blue-400/10",
        green: "text-green-400 border-green-500/30 bg-green-500/10",
        red: "text-red-400 border-red-500/30 bg-red-500/10"
    };
    return (
        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${colors[color]} ${className}`}>
            {children}
        </span>
    );
};
