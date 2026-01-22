
import React from 'react';
import { Wrench, MessageCircle, AlertTriangle, Monitor, Zap } from 'lucide-react';
import { Button } from '../components/ui';
import { SiteConfig } from '../types';

export const MaintenancePage = ({ config }: { config: SiteConfig }) => {
  const waNumber = config.whatsapp_number || "6282325103336";
  
  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Noise & Grid */}
      <div className="absolute inset-0 opacity-[0.03] z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center relative z-10 animate-fade-in">
        
        {/* Animated Icon */}
        <div className="mb-10 relative inline-block">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-brand-dark border border-brand-orange/30 flex items-center justify-center text-brand-orange shadow-neon relative z-10 overflow-hidden">
                <Monitor size={48} className="md:size-64 opacity-20 absolute -right-4 -bottom-4" />
                <Wrench size={40} className="md:size-48 animate-pulse" />
            </div>
            {/* Ping dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-brand-orange rounded-full animate-ping"></div>
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6 leading-tight tracking-tighter">
            SORRY JURAGAN, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-red-600">RUKO LAGI TUTUP.</span>
        </h1>
        
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-10 backdrop-blur-md">
            <p className="text-gray-400 text-base md:text-lg leading-relaxed italic">
                "Gue lagi bongkar mesin bentar, nambahin fitur baru biar bisnis lo makin <span className="text-white font-bold">Sat-Set Wat-Wet</span>. Gak bakal lama kok, kalem aja."
            </p>
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Zap size={10} className="text-brand-orange"/> Optimize Cache</span>
                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                <span className="flex items-center gap-1"><Zap size={10} className="text-brand-orange"/> AI Syncing</span>
                <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                <span className="flex items-center gap-1"><Zap size={10} className="text-brand-orange"/> Core Update</span>
            </div>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
                href={`https://wa.me/${waNumber}?text=Halo Mas Amin, gue mau tanya-tanya nih selagi web maintenance...`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 bg-brand-orange text-white rounded-xl font-bold flex items-center justify-center gap-3 shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-1"
            >
                <MessageCircle size={20} /> CHAT GUE VIA WHATSAPP
            </a>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-bold uppercase tracking-widest bg-black/40 px-4 py-4 rounded-xl border border-white/5">
                <AlertTriangle size={16} className="text-yellow-500" /> Standby 24/7
            </div>
        </div>

        {/* System ID */}
        <p className="mt-16 text-[9px] text-gray-700 font-mono uppercase tracking-[0.4em]">
            SYSTEM_STATUS: UNDER_MAINTENANCE // PT_MESIN_KASIR_SOLO_V3.1
        </p>
      </div>
    </div>
  );
};
