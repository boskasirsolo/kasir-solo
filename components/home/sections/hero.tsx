
import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { Button } from '../../ui';
import { SiteConfig } from '../../../types';

export const HomeHero = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => {
  // Parsing judul biar bisa ada efek warna orange di kata terakhir atau sesuai input
  const title = config.hero_title || "AKHIRI ERA BONCOS";
  const subtitle = config.hero_subtitle || "Gue bantu rakit Sistem Kasir & Aset Digital yang bikin bisnis lo kerja sendiri.";

  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-brand-black">
      {/* DYNAMIC BACKGROUND ENGINE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-brand-orange/10 rounded-full blur-[120px] animate-pulse-slow -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-red-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/3"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative pt-10 flex flex-col items-center">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-orange/40 rounded-full bg-brand-orange/5 mb-8 backdrop-blur-md shadow-neon animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-brand-orange animate-ping"></div>
          <h2 className="text-brand-orange text-[10px] md:text-xs font-black tracking-[0.3em] uppercase whitespace-nowrap">
            Pusat Digitalisasi UMKM Terlengkap
          </h2>
        </div>
        
        <div className="space-y-6 max-w-5xl mb-12">
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[1.1] tracking-tighter drop-shadow-2xl animate-fade-in uppercase">
            {title}
          </h1>
          
          <p className="text-base md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed px-4 font-medium animate-fade-in whitespace-pre-line" style={{ animationDelay: '0.2s' }}>
            {subtitle}
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

        {/* Vertical Decor */}
        <div className="absolute hidden lg:block left-10 top-1/2 -translate-y-1/2 space-y-12 opacity-20">
           <div className="w-px h-32 bg-gradient-to-b from-transparent via-white to-transparent"></div>
           <p className="vertical-text text-[10px] font-black tracking-[0.5em] text-white uppercase">REBORN 2025</p>
           <div className="w-px h-32 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-[1px] h-12 bg-gradient-to-b from-brand-orange to-transparent"></div>
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Scroll</span>
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
