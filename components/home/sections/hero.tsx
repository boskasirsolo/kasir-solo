
import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../ui';

export const HomeHero = ({ setPage }: { setPage: (p: string) => void }) => (
  <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0 pointer-events-none">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
    </div>

    <div className="container mx-auto px-4 z-10 text-center relative">
      <div className="inline-flex items-center gap-2 px-6 py-2 border border-brand-orange/50 rounded-full bg-brand-orange/10 mb-8 backdrop-blur-md shadow-neon hover:bg-brand-orange/20 transition-colors cursor-default">
        <ShieldCheck size={16} className="text-brand-orange" />
        <h2 className="text-brand-orange text-xs md:text-sm font-bold tracking-widest uppercase">
          Pusat Mesin Kasir Solo Raya & Jawa Tengah
        </h2>
      </div>
      
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">
        Revolusi <span className="text-brand-orange">Mesin Kasir.</span><br/>
        Bisnis Jalan, Lo Jalan-Jalan.
      </h1>
      
      <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
        Gue bukan sales bacot. Gue praktisi yang ngerti kalau <strong>Mesin Kasir</strong> itu jantungnya toko. Tanpa sistem yang bener, lo cuma "jaga warung", bukan "punya bisnis".
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        <Button onClick={() => setPage('shop')} className="px-10 py-4 text-base shadow-neon hover:shadow-neon-strong">
          LIHAT KATALOG MESIN KASIR <ArrowRight size={22} />
        </Button>
        <Button variant="outline" onClick={() => setPage('about')} className="px-10 py-4 text-base">
          KENAPA HARUS GUE?
        </Button>
      </div>
    </div>
  </section>
);
