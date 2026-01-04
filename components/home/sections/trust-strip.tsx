
import React from 'react';
import { User, MapPin, Activity, Clock } from 'lucide-react';

export const TrustStrip = () => (
  <div className="border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-20 overflow-hidden group">
    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s]"></div>
    <div className="container mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
         <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-brand-orange shadow-neon-text">
               <User size={24} />
            </div>
            <div>
               <h4 className="text-2xl md:text-3xl font-display font-bold text-white">500+</h4>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Mitra Mesin Kasir</p>
            </div>
         </div>
         <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-blue-400">
               <MapPin size={24} />
            </div>
            <div>
               <h4 className="text-2xl md:text-3xl font-display font-bold text-white">34</h4>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Kirim se-Indonesia</p>
            </div>
         </div>
         <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-green-400">
               <Activity size={24} />
            </div>
            <div>
               <h4 className="text-2xl md:text-3xl font-display font-bold text-white">99%</h4>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Uptime Server</p>
            </div>
         </div>
         <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-purple-400">
               <Clock size={24} />
            </div>
            <div>
               <h4 className="text-2xl md:text-3xl font-display font-bold text-white">24/7</h4>
               <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Support Teknis</p>
            </div>
         </div>
      </div>
    </div>
  </div>
);
