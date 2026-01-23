import React from 'react';
import { ArrowRight, Zap, Target } from 'lucide-react';
import { Button } from '../../ui';
import { SiteConfig } from '../../../types';

export const HomeHero = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => {
  const title = config.hero_title || "AKHIRI ERA {BONCOS}";
  const subtitle = config.hero_subtitle || "Gue bantu rakit [Sistem Kasir] & Aset Digital yang bikin bisnis lo kerja sendiri.";

  const parseHeroText = (text: string) => {
    const parts = text.split(/(\{.*?\}|\[.*?\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('{') && part.endsWith('}')) {
        return <span key={i} className="text-brand-orange drop-shadow-neon-text">{part.slice(1, -1)}</span>;
      }
      if (part.startsWith('[') && part.endsWith(']')) {
        return <span key={i} className="text-transparent bg-clip-text bg-brand-gradient drop-shadow-2xl">{part.slice(1, -1)}</span>;
      }
      return part;
    });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-brand-black">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[70vw] h-[70vw] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse-slow -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-red-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center pt-20">
        <div className="inline-flex items-center gap-2 px-5 py-2 border border-brand-orange/40 rounded-full bg-brand-orange/5 mb-8 backdrop-blur-md shadow-neon animate-fade-in">
          <Target size={14} className="text-brand-orange" />
          <h2 className="text-brand-orange text-[10px] font-black tracking-[0.3em] uppercase">
            Official Site: PT Mesin Kasir Solo
          </h2>
        </div>
        
        <div className="max-w-5xl mx-auto mb-12">
          <h1 className="text-5xl md:text-8xl font-display font-black text-white leading-[1.05] tracking-tighter drop-shadow-2xl animate-fade-in uppercase whitespace-pre-line">
            {parseHeroText(title)}
          </h1>
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mt-6 leading-relaxed font-medium animate-fade-in whitespace-pre-line opacity-80">
            {parseHeroText(subtitle)}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button onClick={() => setPage('shop')} className="h-16 px-10 shadow-neon-strong text-xs font-black uppercase tracking-widest">
            SIKAT ALAT TEMPUR <ArrowRight size={18} className="ml-2" />
          </Button>
          <Button variant="outline" onClick={() => setPage('contact')} className="h-16 px-10 text-xs font-black uppercase tracking-widest">
            CURHAT SAMA GUE <Zap size={18} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};