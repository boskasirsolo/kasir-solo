
import React from 'react';
import { ChevronRight, MapPin, Phone, Lock, LucideIcon, BadgeCheck } from 'lucide-react';
import { SiteConfig } from '../types';

// --- ATOMS ---

export const SectionTitle: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-xs border-l-2 border-brand-orange pl-3">
    {children}
  </h4>
);

interface FooterLinkProps {
  label: string;
  onClick: () => void;
}

export const FooterLink: React.FC<FooterLinkProps> = ({ label, onClick }) => (
  <li>
    <button 
      onClick={onClick} 
      className="text-gray-400 hover:text-brand-orange transition-colors flex items-center gap-2 text-sm group"
    >
      <ChevronRight size={12} className="text-gray-600 group-hover:text-brand-orange transition-colors" /> 
      {label}
    </button>
  </li>
);

interface SocialButtonProps {
  icon: any;
  href?: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon: Icon, href }) => {
  if (!href) return null;
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-orange hover:text-white transition-colors hover:shadow-neon text-gray-400"
    >
      <Icon size={18} />
    </a>
  );
};

// --- MOLECULES ---

interface ContactItemProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onClick: () => void;
}

export const ContactItem: React.FC<ContactItemProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  onClick 
}) => (
  <li className="flex items-start gap-3 group cursor-pointer" onClick={onClick}>
    <div className="p-2 bg-white/5 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
      <Icon size={18} />
    </div>
    <div>
      <span className="text-white font-bold text-xs block mb-1">{label}</span>
      <span className="text-sm text-gray-400 group-hover:text-brand-orange transition-colors leading-tight block">
        {value}
      </span>
    </div>
  </li>
);

export const FooterColumn = ({ 
  title, 
  links 
}: { 
  title: string, 
  links: { label: string, action: () => void }[] 
}) => (
  // Update: Only allow 1 column span on all breakpoints (allows side-by-side on mobile)
  <div className="col-span-1">
    <SectionTitle>{title}</SectionTitle>
    <ul className="space-y-3">
      {links.map((link, idx) => (
        <FooterLink key={idx} label={link.label} onClick={link.action} />
      ))}
    </ul>
  </div>
);

// --- ORGANISMS ---

export const BrandColumn = ({ 
  description, 
  socials,
  config // ACCEPT CONFIG
}: { 
  description: string, 
  socials: { icon: any, url?: string }[],
  config: SiteConfig
}) => (
  // Update: Span 2 cols on mobile (full width top), 1 col on desktop
  <div className="col-span-2 lg:col-span-1 space-y-6">
    <div>
      <h3 className="text-2xl font-display font-bold text-white mb-2">PT MESIN KASIR SOLO</h3>
      <div className="h-1 w-12 bg-brand-orange rounded-full"></div>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">
      {description}
    </p>
    
    {/* LEGALITAS SECTION (NEW) */}
    {(config.nibNumber || config.ahuNumber || config.npwpNumber) && (
      <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-xs space-y-1">
         {config.companyLegalName && (
            <div className="flex items-center gap-2 text-white font-bold mb-1">
               <BadgeCheck size={14} className="text-blue-400" />
               {config.companyLegalName}
            </div>
         )}
         {config.ahuNumber && (
            <div className="flex justify-between text-gray-500">
               <span>AHU:</span> <span className="font-mono text-gray-400">{config.ahuNumber}</span>
            </div>
         )}
         {config.nibNumber && (
            <div className="flex justify-between text-gray-500">
               <span>NIB:</span> <span className="font-mono text-gray-400">{config.nibNumber}</span>
            </div>
         )}
         {config.npwpNumber && (
            <div className="flex justify-between text-gray-500">
               <span>NPWP:</span> <span className="font-mono text-gray-400">{config.npwpNumber}</span>
            </div>
         )}
      </div>
    )}

    <div className="flex gap-3 flex-wrap">
      {socials.map((s, idx) => (
        <SocialButton key={idx} icon={s.icon} href={s.url} />
      ))}
    </div>
  </div>
);

export const FooterBottom = ({ 
  year, 
  onLegalClick, 
  onAdminClick 
}: { 
  year: number, 
  onLegalClick: (page: string) => void, 
  onAdminClick: () => void 
}) => (
  <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-center md:text-left">
      <p className="text-gray-600 text-xs">
        © {year} <strong className="text-gray-500">PT Mesin Kasir Solo</strong>. All Rights Reserved.
      </p>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        <button onClick={() => onLegalClick('area-layanan')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Area Layanan</button>
        <button onClick={() => onLegalClick('legal/refund')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Kebijakan Refund</button>
        <button onClick={() => onLegalClick('legal/privacy')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Privasi</button>
        <button onClick={() => onLegalClick('legal/terms')} className="text-xs text-gray-500 hover:text-brand-orange transition-colors">Syarat & Ketentuan</button>
      </div>
    </div>

    <div className="flex items-center gap-4">
      <button onClick={onAdminClick} className="text-gray-800 hover:text-brand-orange transition-colors p-2" title="Admin Login">
        <Lock size={12} />
      </button>
    </div>
  </div>
);

// --- TEMPLATE ---

export const FooterContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <footer className="bg-brand-dark border-t border-white/5 py-16 mt-20 relative overflow-hidden">
    {/* Decorative Top Line */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent shadow-neon opacity-70"></div>
    
    <div className="container mx-auto px-4">
        {children}
    </div>
  </footer>
);
