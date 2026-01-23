import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { SiteConfig } from '../../types';
import { SocialButton } from './atoms';

export const BrandColumn = ({ 
  description, 
  socials,
  config
}: { 
  description: string, 
  socials: { icon: any, url?: string, label?: string }[],
  config: SiteConfig
}) => (
  <div className="col-span-2 lg:col-span-1 space-y-6">
    <div className="min-h-[50px] flex flex-col justify-center">
      <h3 className="text-2xl font-display font-bold text-white mb-2 leading-none uppercase tracking-tighter">PT MESIN KASIR SOLO</h3>
      <div className="h-1 w-12 bg-brand-orange rounded-full shadow-neon"></div>
    </div>
    <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
      {description}
    </p>
    
    {(config.nib_number || config.ahu_number || config.npwp_number) && (
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] space-y-2 shadow-inner">
         <div className="flex items-center gap-2 text-white font-black uppercase tracking-widest mb-1">
            <BadgeCheck size={14} className="text-blue-400" />
            Legalitas Terjamin
         </div>
         {config.ahu_number && (
            <div className="flex justify-between text-gray-500">
               <span>AHU:</span> <span className="font-mono text-gray-300">{config.ahu_number}</span>
            </div>
         )}
         {config.nib_number && (
            <div className="flex justify-between text-gray-500">
               <span>NIB:</span> <span className="font-mono text-gray-300">{config.nib_number}</span>
            </div>
         )}
         {config.npwp_number && (
            <div className="flex justify-between text-gray-500">
               <span>NPWP:</span> <span className="font-mono text-gray-300">{config.npwp_number}</span>
            </div>
         )}
      </div>
    )}

    <div className="flex gap-3 flex-wrap">
      {socials.map((s, idx) => (
        <SocialButton key={idx} icon={s.icon} href={s.url} label={s.label} />
      ))}
    </div>
  </div>
);

export const FooterBottom = ({ 
  year, 
  onLegalClick
}: { 
  year: number, 
  onLegalClick: (page: string) => void
}) => (
  <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
        © {year} <strong className="text-gray-300">PT Mesin Kasir Solo</strong>. Berdiri Sejak 2015.
      </p>
      <div className="flex flex-wrap justify-center gap-4 md:gap-6">
        {['area-layanan', 'legal/refund', 'legal/privacy', 'legal/terms'].map(path => (
          <button 
            key={path}
            onClick={() => onLegalClick(path)} 
            className="text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-brand-orange transition-colors"
          >
            {path.split('/').pop()?.replace('-', ' ')}
          </button>
        ))}
      </div>
    </div>
  </div>
);