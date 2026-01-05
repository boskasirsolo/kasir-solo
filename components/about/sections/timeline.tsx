
import React from 'react';
import { History, Rocket, Skull, Sunrise } from 'lucide-react';

export const AboutTimeline = () => (
    <div className="container mx-auto px-4 py-20 relative border-t border-white/5 bg-brand-dark/30 mt-10">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-orange/50 to-transparent hidden md:block"></div>
      
      <div className="space-y-24 relative z-10 max-w-6xl mx-auto">
        
        {/* CHAPTER 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 1</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2015: Sales Jalanan</h3>
              <p className="text-gray-400 leading-relaxed">
                Tanpa tim, tanpa investor. Gue jalan kaki <em>door-to-door</em> nawarin mesin kasir di Solo Raya. Diusir satpam, diketawain owner toko, itu sarapan pagi gue. Di fase ini gue belajar satu hal: <strong>Pedagang butuh solusi praktis, bukan teori teknis ribet.</strong>
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-brand-dark border-2 border-brand-orange rounded-full flex items-center justify-center text-brand-orange shadow-neon z-20 group-hover:scale-110 transition-transform duration-500">
                <History size={28} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-3 hidden md:block"></div>
        </div>

        {/* CHAPTER 2 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 order-3 md:order-1 hidden md:block"></div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-brand-dark border-2 border-white/10 group-hover:border-blue-500 rounded-full flex items-center justify-center text-white group-hover:text-blue-500 transition-colors z-20 shadow-lg">
                <Rocket size={28} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2 md:order-3">
              <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 2</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2019: Raja Kecil</h3>
              <p className="text-gray-400 leading-relaxed">
                Kerja keras gue kebayar. 500+ outlet pake alat gue. Gue ngerasa di atas angin. Tim makin gede, omzet naik. Tapi gue lengah. Gue lupa kalau <strong>Sistem Kontrol Internal</strong> itu lebih penting daripada omzet.
              </p>
           </div>
        </div>

        {/* CHAPTER 3 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 3</span>
              <h3 className="text-3xl font-display font-bold text-red-500 mb-4">2022: Kiamat Kecil</h3>
              <p className="text-gray-400 leading-relaxed">
                Cashflow macet, infrastruktur digital runtuh. Domain legendaris hangus dan diambil orang karena keteledoran manajemen aset. Reputasi nasional lenyap sekejap. Gue balik ke titik nol. Sendirian lagi.
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-red-900/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] z-20 animate-pulse">
                <Skull size={28} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-3 hidden md:block"></div>
        </div>

        {/* CHAPTER 4 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 order-3 md:order-1 hidden md:block"></div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center text-white shadow-neon-strong z-20">
                <Sunrise size={32} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2 md:order-3">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 4</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2025: Mode Perang</h3>
              <div className="bg-brand-orange/10 border-l-4 border-brand-orange p-4 rounded-r-lg mb-4">
                 <p className="text-gray-300 italic">"Gue balik bukan buat main-main. Gue balik buat ngasih lo senjata biar bisnis lo gak ancur kayak gue dulu."</p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Dengan pondasi <strong>SIBOS</strong> & <strong>QALAM</strong> yang jauh lebih kuat. Gue bukan lagi sekadar vendor mesin kasir. Gue partner yang jagain benteng pertahanan bisnis lo.
              </p>
           </div>
        </div>

      </div>
    </div>
);
