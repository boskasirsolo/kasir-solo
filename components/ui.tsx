
import React from 'react';
import { createPortal } from 'react-dom';
import { Loader2, AlertTriangle } from 'lucide-react';

// --- Atoms ---

export const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '', 
  disabled = false,
  type = 'button'
}: { 
  children?: React.ReactNode, 
  variant?: 'primary' | 'outline' | 'ghost' | 'danger', 
  onClick?: () => void, 
  className?: string,
  disabled?: boolean,
  type?: 'button' | 'submit'
}) => {
  const baseStyles = "rounded-lg font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // UPDATED: Use brand-gradient (Orange-Red) for primary buttons
    primary: "bg-brand-gradient text-white hover:bg-brand-gradient-hover shadow-action hover:shadow-action-strong transform hover:-translate-y-1",
    // UPDATED: Outline now uses brand-orange border by default
    outline: "border-2 border-brand-orange text-white hover:bg-brand-orange hover:text-white shadow-[0_0_15px_rgba(255,95,31,0.15)] hover:shadow-action",
    ghost: "text-gray-400 hover:text-brand-orange hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-neon-text/20"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className = ""
}: {
  value: string | number,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  placeholder?: string,
  type?: string,
  className?: string
}) => (
  // Use brand-orange for focus state borders
  <input 
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white w-full focus:border-brand-orange outline-none transition-colors focus:shadow-neon-text/20 ${className}`} 
  />
);

export const TextArea = ({
  value,
  onChange,
  placeholder,
  className = ""
}: {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  placeholder?: string,
  className?: string
}) => (
  <textarea 
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`bg-brand-card border border-white/10 rounded-lg px-4 py-3 text-white w-full focus:border-brand-orange outline-none transition-colors focus:shadow-neon-text/20 ${className}`} 
  />
);

export const Badge = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  // Badge uses solid orange for visibility
  <span className={`px-3 py-1 rounded-full text-xs font-bold text-brand-orange border border-brand-orange/30 bg-black/60 backdrop-blur-sm ${className}`}>
    {children}
  </span>
);

export const SectionHeader = ({ title, subtitle, highlight }: { title: string, subtitle?: string, highlight: string }) => (
  <div className="text-center mb-12">
    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
      {title} <span className="text-brand-orange">{highlight}</span>
    </h2>
    {subtitle && <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

export const LoadingSpinner = ({ size = 24, className = '' }: { size?: number, className?: string }) => (
  <Loader2 size={size} className={`animate-spin ${className}`} />
);

// --- Molecules ---

export const Card: React.FC<{ children?: React.ReactNode, className?: string, hoverEffect?: boolean }> = ({ children, className = '', hoverEffect = true }) => (
  <div className={`bg-brand-card border border-white/5 rounded-2xl overflow-hidden ${hoverEffect ? 'hover:border-brand-orange transition-all duration-300 hover:shadow-neon hover:-translate-y-2 group' : ''} ${className}`}>
    {children}
  </div>
);

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya, Lanjutkan",
  cancelText = "Batal",
  variant = 'danger'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'primary' | 'danger';
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fade-in">
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden z-[10000]">
         {/* Glow Effect */}
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px] opacity-20 pointer-events-none ${variant === 'danger' ? 'bg-red-500' : 'bg-brand-orange'}`}></div>
         
         {/* Icon */}
         <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border ${variant === 'danger' ? 'bg-red-500/10 border-red-500/30' : 'bg-brand-orange/10 border-brand-orange/30'}`}>
            <AlertTriangle className={variant === 'danger' ? 'text-red-500' : 'text-brand-orange'} size={32} />
         </div>

         <h3 className="text-xl font-display font-bold text-white mb-3 relative z-10">{title}</h3>
         <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">{message}</p>
         
         <div className="grid grid-cols-2 gap-4 relative z-10">
            <Button variant="outline" onClick={onClose} className="border-white/10 hover:bg-white/5 w-full py-3">{cancelText}</Button>
            <Button variant={variant} onClick={onConfirm} className="w-full py-3">{confirmText}</Button>
         </div>
      </div>
    </div>,
    document.body
  );
};
