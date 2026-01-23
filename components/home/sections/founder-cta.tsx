import React from 'react';
import { User, MessageCircle, AlertTriangle } from 'lucide-react';
import { SiteConfig } from '../../types';

export const FounderCTA = ({ 
    config, 
    onsiteRemaining, 
    digitalRemaining 
}: { 
    config: SiteConfig,
    onsiteRemaining: number,
    digitalRemaining: number
}) => (
  <section className="py-24 relative overflow-hidden bg-gradient-to-b from-brand-black to-brand-dark border-t border-white/5">
     <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none"></div>
     
     <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="w-20 h-20 rounded-full border-2 border-brand-orange p-1 mx-auto mb-6 shadow-neon-strong bg-brand-dark">
            <div className="w-full h-full rounded-full bg-brand-card flex items-center justify-center overflow-hidden">
                <User size={40} className="text-gray-400" />
            </div>
        </div>
        
        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
           Ngobrol Langsung sama <br/><span className="text-brand-orange">Arsitek Sistemnya</span>
        </h2>
        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-6">
           Lo gak bakal dilayani sama Chatbot atau Admin robot yang jawab pake template. 
           Gue, <strong>Amin Maghfuri</strong>, bakal langsung bedah kebutuhan bisnis lo dan kasih solusi <strong>mesin kasir</strong> yang paling efisien.
        </p>

        {/* LIMITED SLOT BADGE - DATA FROM DB */}
        <div className="mb-10 inline-flex flex-col sm:flex-row items-center gap-2 bg-red-500/5 border border-red-500/20 px-6 py-3 rounded-xl">
            <AlertTriangle size={18} className="text-red-500" />
            <span className="text-red-400 text-sm font-bold uppercase tracking-wide">
                INFO KUOTA BULAN INI:
            </span>
            <span className="text-white text-sm font-bold">
                {onsiteRemaining} Slot On-Site & {digitalRemaining} Slot Proyek Digital
            </span>
        </div>
        
        <div className="flex justify-center">
           <a 
              href={`https://wa.me/${config.whatsapp_number}?text=Halo Mas Amin, saya mau curhat masalah sistem mesin kasir saya.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-brand-gradient hover:bg-brand-gradient-hover text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:shadow-[0_0_30px_rgba(255,95,31,0.6)] transition-all transform hover:-translate-y-1"
           >
              <MessageCircle size={24} /> WhatsApp Mas Amin (Founder)
           </a>
        </div>
        <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
           Konsultasi Gratis • Respon Cepat • Tanpa Perantara
        </p>
     </div>
  </section>
);