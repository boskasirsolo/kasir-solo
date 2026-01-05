
import React from 'react';
import { ChevronRight } from 'lucide-react';

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
