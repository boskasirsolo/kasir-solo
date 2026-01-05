
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SectionTitle, FooterLink } from './atoms';

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
  <div className="col-span-1">
    <SectionTitle>{title}</SectionTitle>
    <ul className="space-y-3">
      {links.map((link, idx) => (
        <FooterLink key={idx} label={link.label} onClick={link.action} />
      ))}
    </ul>
  </div>
);
