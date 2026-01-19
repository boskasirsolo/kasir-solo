
import React from 'react';
import { Search, PackageOpen, ChevronLeft, ChevronRight, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '../../ui';

export const ShopHero = () => (
  <div className="text-left mb-6 md:mb-0 max-w-xl">
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-orange/30 bg-brand-orange/10 mb-4">
        <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse"></span>
        <span className="text-[10px] font-bold text-brand-orange uppercase tracking-widest">Ready Stock</span>
    </div>
    <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-3">
      Pilih <span className="text-brand-orange">Senjata Lo.</span>
    </h2>
    <p className="text-gray-400 text-sm md:text-lg leading-relaxed">
      Jangan asal beli murah. Ini investasi jangka panjang. <br className="hidden md:block"/>
      Pilih mesin yang tahan banting buat ngadepin ribuan transaksi.
    </p>
  </div>
);

export const QuickActions = () => (
    <div className="flex gap-3 mt-4 justify-end w-full md:w-auto">
        <Link 
            to="/track-order" 
            state={{ from: 'shop' }}
            className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600 hover:text-white text-blue-400 text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-blue-500/20 group"
        >
            <Truck size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Lacak Paket
        </Link>
        <Link 
            to="/legal/refund" 
            state={{ from: 'shop', autoOpen: true }}
            className="flex-1 md:flex-none inline-flex justify-center items-center gap-2 px-5 py-3 rounded-xl bg-red-600/10 border border-red-500/30 hover:bg-red-600 hover:text-white text-red-500 text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-red-500/20 group"
        >
            <ShieldCheck size={16} /> 
            Klaim Garansi
        </Link>
    </div>
);

export const SearchWidget = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
  <div className="relative group w-full md:w-[400px]">
    <Input 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder="Cari alat tempur..." 
      className="pl-12 py-4 rounded-xl bg-brand-dark border-white/10 focus:border-brand-orange transition-all text-sm font-bold placeholder-gray-600 shadow-xl focus:shadow-neon/20"
    />
    <Search className="absolute left-4 top-4 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
  </div>
);

export const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-24 text-center border border-white/5 rounded-3xl bg-brand-dark/30">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/5">
        <PackageOpen size={40} className="text-gray-600" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">Barang Ghaib?</h3>
    <p className="text-gray-400 text-sm max-w-sm mx-auto leading-relaxed">
      Gue gak nemu barang yang lo cari. Coba ketik kata kunci lain atau chat admin kalau lo butuh spek khusus.
    </p>
  </div>
);

export const PaginationControl = ({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex justify-center items-center gap-4 py-8 border-t border-white/5 mt-8">
      <button 
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Halaman Sebelumnya"
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <span className="text-brand-orange font-display font-bold px-4 py-2 bg-brand-orange/10 rounded-lg border border-brand-orange/20">
        Halaman {page} / {totalPages}
      </span>
      <button 
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Halaman Selanjutnya"
        className="p-3 rounded-full bg-brand-card border border-white/10 hover:border-brand-orange disabled:opacity-30 disabled:hover:border-white/10 transition-all text-white group"
      >
        <ChevronRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};
