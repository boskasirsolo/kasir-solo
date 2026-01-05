
import React from 'react';
import { Monitor, ArrowRight, Layers, TrendingUp } from 'lucide-react';
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
              <p className="text-gray-400 text-lg leading-relaxed mb-8">
                 Gue jual <strong>Masa Depan</strong> bisnis lo. Perkenalkan <strong>SIBOS</strong> (ERP System) dan <strong>QALAM</strong> (Education App). 
                 Ekosistem digital yang dirancang buat lo yang mau bisnisnya <em>Auto-Pilot</em>, bukan <em>Auto-Pusing</em>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                 <Button onClick={() => setPage('innovation')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-none">
                    LIHAT INOVASI <ArrowRight size={18} />
                 </Button>
              </div>
           </div>

           {/* Visuals */}
           <div className="lg:w-1/2 relative group">
              {/* Decorative Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              
              {/* Cards Composition */}
              <div className="relative z-10 transform md:rotate-y-12 md:rotate-x-6 transition-transform duration-700 group-hover:rotate-0">
                 {/* Back Card (SIBOS) */}
                 <div className="absolute top-[-20px] right-[-20px] w-full h-full bg-brand-dark border border-brand-orange/30 rounded-2xl p-6 opacity-60 scale-95 transform translate-x-4 -translate-y-4">
                    <div className="flex items-center gap-2 mb-4">
                       <div className="w-3 h-3 rounded-full bg-red-500"></div>
                       <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                       <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="space-y-3">
                       <div className="h-20 bg-brand-orange/10 rounded-lg w-full"></div>
                       <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                       <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                 </div>

                 {/* Front Card (QALAM/DASHBOARD) */}
                 <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-2">
                          <Layers className="text-blue-400" size={24} />
                          <span className="text-white font-bold tracking-widest">DASHBOARD</span>
                       </div>
                       <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded">LIVE DATA</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                          <p className="text-gray-400 text-xs mb-1">Total Omzet</p>
                          <p className="text-white font-bold text-xl">Rp 45.2M</p>
                          <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1"><TrendingUp size={10}/> +12%</div>
                       </div>
                       <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                          <p className="text-gray-400 text-xs mb-1">Active User</p>
                          <p className="text-white font-bold text-xl">1,240</p>
                          {/* UPDATED: Contrast Fix -> text-blue-300 instead of text-blue-400 */}
                          <div className="mt-2 text-[10px] text-blue-300">Real-time</div>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <div className="h-2 bg-gray-700 rounded-full w-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[70%]"></div>
                       </div>
                       {/* UPDATED: Contrast Fix -> text-gray-400 instead of text-gray-500 */}
                       <div className="flex justify-between text-[10px] text-gray-400">
                          <span>System Load</span>
                          <span>70%</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

        </div>
     </div>
  </section>
);
