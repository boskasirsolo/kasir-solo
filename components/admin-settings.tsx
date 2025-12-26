
import React from 'react';
import { CheckCircle2, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { SiteConfig } from '../types';
import { Input, TextArea } from './ui';

export const AdminSettings = ({
  config,
  setConfig
}: {
  config: SiteConfig,
  setConfig: (c: SiteConfig) => void
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* General Config */}
      <div className="space-y-6">
         <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">Konfigurasi Umum</h3>
         <div>
           <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Title</label>
           <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
         </div>
         <div>
           <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Subtitle</label>
           <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-32" />
         </div>
         <div className="p-4 bg-brand-dark rounded border border-white/10 flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle2 size={16} /> System Operational
         </div>
      </div>

      {/* Dynamic Links Management */}
      <div className="space-y-6">
         <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2 flex items-center gap-2">
            <LinkIcon size={18} /> Link Management
         </h3>
         
         <div className="bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-lg">
            <h4 className="text-brand-orange font-bold text-sm mb-2 flex items-center gap-2"><AlertCircle size={14}/> Petunjuk</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Jika link diisi, tombol di halaman Inovasi akan mengarah ke URL tersebut. 
              Jika dikosongkan, tombol otomatis mengarah ke WhatsApp Admin (Mode Waitlist).
            </p>
         </div>

         <div>
           <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">SIBOS Landing Page URL</label>
           <Input 
              value={config.sibosUrl || ''} 
              onChange={(e) => setConfig({...config, sibosUrl: e.target.value})} 
              placeholder="https://sibos.id atau kosongkan"
           />
         </div>
         
         <div>
           <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">QALAM Web App URL</label>
           <Input 
              value={config.qalamUrl || ''} 
              onChange={(e) => setConfig({...config, qalamUrl: e.target.value})} 
              placeholder="https://app.qalam.id atau kosongkan"
           />
         </div>
      </div>
    </div>
  );
};
