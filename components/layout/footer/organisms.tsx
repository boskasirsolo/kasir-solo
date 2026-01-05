
import React from 'react';
import { BadgeCheck, Lock } from 'lucide-react';
import { SiteConfig } from '../../types';
import { SocialButton } from './atoms';

export const BrandColumn = ({ 
  description, 
  socials,
  config
}: { 
  description: string, 
  socials: { icon: any, url?: string }[],
  config: SiteConfig
}) => (
  <div className="col-span-2 lg:col-span-1 space-y-6">
    <div>
      <h3 className="text-2xl font-display font-bold text-white mb-2">PT MESIN KASIR SOLO</h3>
      <div className="h-1 w-12 bg-brand-orange rounded-full"></div>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed">
      {description}
    </p>
    
    {/* LEGALITAS SECTION */}
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
