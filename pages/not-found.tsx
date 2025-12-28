
import React from 'react';
import { Home, AlertTriangle, Search, Terminal } from 'lucide-react';
import { Button } from '../components/ui';

export const NotFoundPage = ({ setPage }: { setPage: (p: string) => void }) => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4 animate-fade-in relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none"></div>

      {/* 404 Glitch Text */}
      <div className="relative mb-2">
         <h1 className="text-[120px] md:text-[180px] font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none select-none">
            404
         </h1>
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-display font-bold text-6xl md:text-8xl tracking-widest drop-shadow-neon">
            404
         </div>
      </div>

      {/* Error Badge */}
      <div className="flex items-center gap-3 text-red-500 font-bold text-sm md:text-base uppercase tracking-[0.2em] mb-8 border border-red-500/30 px-6 py-2 rounded-full bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
         <AlertTriangle size={18} className="animate-pulse" />
         <span>System Error: Page Not Found</span>
      </div>

      {/* Content */}
      <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-4">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-gray-400 max-w-lg mb-10 leading-relaxed text-base md:text-lg">
        Maaf Juragan, halaman yang Anda cari mungkin sudah dipindahkan, dihapus, atau sedang dalam perbaikan teknis.
      </p>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 z-10">
         <Button onClick={() => setPage('home')} className="px-8 py-4 shadow-neon hover:shadow-neon-strong">
            <Home size={20} /> KEMBALI KE BERANDA
         </Button>
         <Button variant="outline" onClick={() => setPage('shop')} className="px-8 py-4">
            <Search size={20} /> CARI PRODUK
         </Button>
      </div>

      {/* Terminal Decor */}
      <div className="mt-16 bg-black/40 border border-white/10 rounded-lg p-4 font-mono text-xs text-left max-w-md w-full backdrop-blur-sm text-gray-500">
         <div className="flex gap-1.5 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
         </div>
         <p className="flex gap-2"><span className="text-brand-orange">root@sibos:~#</span> <span className="text-white">locate page_requested</span></p>
         <p className="flex gap-2 text-red-400">Error: Directory not found.</p>
         <p className="flex gap-2"><span className="text-brand-orange">root@sibos:~#</span> <span className="animate-pulse">_</span></p>
      </div>

    </div>
  );
};
