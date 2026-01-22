
import React from 'react';
import { Monitor, ArrowRight, Layers, TrendingUp, Cpu, Heart, UtensilsCrossed } from 'lucide-react';
import { Button } from '../../ui';

export const InnovationTeaser = ({ setPage }: { setPage: (p: string) => void }) => (
  <section className="py-24 relative overflow-hidden bg-[#050505]">
     {/* Background Elements */}
     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
     <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
     
     <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
           
           {/* Content */}
           <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
                 <Monitor size={14} className="text-blue-400" />
                 <span className="text-xs font-bold text-blue-200 tracking-[0.2em] uppercase">R&D Division 2025</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                 Gue Gak Cuma Jual <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Mesin Kasir Besi.</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-10">
                 Gue rakit **Otak Digital** buat bisnis lo. Pilih solusi yang paling pas buat industri lo:
              </p>
              
              {/* Portal Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <button 
                    onClick={() => setPage('inovasi/sibos')}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-orange hover:bg-brand-orange/5 transition-all group text-left"
                 >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-colors">
                            <Cpu size={20} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">SIBOS AI</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Smart Kasir & ERP</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-700 group-hover:text-brand-orange group-hover:translate-x-1 transition-all" />
                 </button>

                 <button 
                    onClick={() => setPage('inovasi/qalam')}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-teal-500 hover:bg-teal-500/5 transition-all group text-left"
                 >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-500/10 rounded-lg text-teal-500 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                            <Heart size={20} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">QALAM</p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Sistem Sekolah / TPA</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-700 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
                 </button>

                 <button 
                    onClick={() => setPage('inovasi/dapur-sppg-mbg')}
                    className="sm:col-span-2 flex items-center justify-between p-4 bg-green-900/10 border border-green-500/20 rounded-2xl hover:border-green-500 hover:bg-green-500/5 transition-all group text-left"
                 >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                            <UtensilsCrossed size={20} />
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">DAPUR SPPG (MBG) <span className="ml-2 text-[8px] bg-green-600 text-white px-1.5 py-0.5 rounded-full animate-pulse">NEW</span></p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Manajemen Makan Bergizi Gratis</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-gray-700 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                 </button>
              </div>
           </div>

           {/* Visuals */}
           <div className="lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              <div className="relative z-10 transform md:rotate-y-12 md:rotate-x-6 transition-transform duration-700 group-hover:rotate-0">
                 <div className="absolute top-[-20px] right-[-20px] w-full h-full bg-brand-dark border border-brand-orange/30 rounded-2xl p-6 opacity-60 scale-95 transform translate-x-4 -translate-y-4">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-3 h-3 rounded-full bg-red-500"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                       <div className="h-20 bg-brand-orange/10 rounded-lg w-full"></div>
                       <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                 </div>

                 <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-2">
                          <Layers className="text-blue-400" size={24} />
                          <span className="text-white font-bold tracking-widest uppercase text-xs">SYSTEM_DASHBOARD_LIVE</span>
                       </div>
                       <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold">STABLE</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                          <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Success Rate</p>
                          <p className="text-white font-bold text-xl">99.9%</p>
                          <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1"><TrendingUp size={10}/> OPTIMIZED</div>
                       </div>
                       <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                          <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">Total Logic</p>
                          <p className="text-white font-bold text-xl">8.2M+</p>
                          <div className="mt-2 text-[10px] text-blue-300">Lines of Code</div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div className="h-2 bg-gray-700 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[85%]"></div>
                       </div>
                       <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          <span>AI Processing</span>
                          <span>85%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
     </div>
  </section>
);
