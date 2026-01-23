import React from 'react';
import { ArrowRight, Zap, MapPin, Monitor, AlertTriangle } from 'lucide-react';
import { Button } from '../../ui';
import { SiteConfig } from '../../../types';

export const HomeHero = ({ 
  setPage, 
  config,
  onsiteRemaining,
  digitalRemaining
}: { 
  setPage: (p: string) => void, 
  config: SiteConfig,
  onsiteRemaining: number,
  digitalRemaining: number
}) => {
  const title = config.hero_title || "AKHIRI ERA {BONCOS}";
  const subtitle = config.hero_subtitle || "Gue bantu rakit [Sistem Kasir] & Aset Digital yang bikin bisnis lo kerja sendiri.";

  const parseHeroText = (text: string) => {
    const parts = text.split(/(\{.*?\}|\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return <span key={i} className="text-brand-orange drop-shadow-neon-text inline-block">{part.slice(1, -1)}</span>;
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} className="text-transparent bg-clip-text bg-brand-gradient drop-shadow-2xl inline-block">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-brand-black">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse-slow -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-red-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative pt-20 flex flex-col items-center">
        {/* --- LIVE QUOTA RADAR (FOMO ENGINE) --- */}
        <div className="flex flex-col md:flex-row gap-3 mb-10 animate-fade-in">
           <div className="bg-red-500/10 border border-red-500/30 px-5 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <div className="relative">
                <MapPin size={18} className="text-red-500" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-red-400 uppercase tracking-widest leading-none mb-1">On-Site Setup</p>
                <p className="text-sm font-bold text-white leading-none">Sisa <span className="text-red-500">{onsiteRemaining}</span> / {config.quota_onsite_max} Slot</p>
              </div>
           </div>

           <div className="bg-blue-500/10 border border-blue-500/30 px-5 py-3 rounded-2xl backdrop-blur-md flex items-center gap-3 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
              <div className="relative">
                <Monitor size={18} className="text-blue-400" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-blue-300 uppercase tracking-widest leading-none mb-1">Digital Proyek</p>
                <p className="text-sm font-bold text-white leading-none">Sisa <span className="text-blue-400">{digitalRemaining}</span> / {config.quota_digital_max} Slot</p>
              </div>
           </div>
        </div>
        
        <div className="space-y-6 max-w-5xl mb-12">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl animate-fade-in uppercase whitespace-pre-line">
            {parseHeroText(title)}
          </h1>
          
          <p className="text-base md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 font-medium animate-fade-in whitespace-pre-line" style={{ animationDelay: '0.2s' }}>
            {parseHeroText(subtitle)}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center w-full px-6 sm:px-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Button onClick={() => setPage('shop')} className="w-full sm:w-auto h-16 px-12 shadow-neon-strong text-sm">
            BORONG ALAT TEMPUR <ArrowRight size={20} />
          </Button>
          <Button variant="outline" onClick={() => setPage('contact')} className="w-full sm:w-auto h-16 px-12 text-sm">
            CURHAT SAMA GUE <Zap size={18} />
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest animate-pulse">
            <AlertTriangle size={12} className="text-brand-orange" /> Kuota Update Per {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <style>{`
        .vertical-text {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
      `}</style>
    </section>
  );
};