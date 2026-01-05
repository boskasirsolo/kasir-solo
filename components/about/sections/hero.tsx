
import React from 'react';

export const AboutHero = () => (
  <div className="bg-brand-card py-24 border-b border-white/5 relative overflow-hidden">
    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
    <div className="absolute top-20 left-10 text-[200px] font-bold text-white/5 pointer-events-none select-none">
      STORY
    </div>
    <div className="container mx-auto px-4 text-center relative z-10">
      <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Gue Bukan <span className="text-brand-orange">Vendor.</span></h2>
      <p className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed font-light">
        Vendor biasa cuma peduli barang laku terus kabur. Gue peduli bisnis lo bertahan hidup. Di medan perang ritel yang kejam ini, lo butuh lebih dari sekadar penjual alat. <br/><span className="text-white font-bold">Gue Partner Perang lo.</span>
      </p>
    </div>
  </div>
);
