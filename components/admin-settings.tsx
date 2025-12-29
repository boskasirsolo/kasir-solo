
import React from 'react';
import { CheckCircle2, Link as LinkIcon, AlertCircle, Share2, MapPin, Phone, Compass } from 'lucide-react';
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* COLUMN 1: General & Contact */}
      <div className="space-y-8">
        {/* General Config */}
        <div className="space-y-4">
           <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2">Konfigurasi Umum</h3>
           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Title</label>
             <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
           </div>
           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Subtitle</label>
             <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-28" />
           </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
           <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2 flex items-center gap-2">
             <MapPin size={18} /> Alamat & Kontak
           </h3>
           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Alamat Kantor 1 (Solo)</label>
             <Input value={config.addressSolo || ''} onChange={(e) => setConfig({...config, addressSolo: e.target.value})} placeholder="Perum Graha Tiara..." />
           </div>
           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Alamat Kantor 2 (Blora)</label>
             <Input value={config.addressBlora || ''} onChange={(e) => setConfig({...config, addressBlora: e.target.value})} placeholder="Banjarejo..." />
           </div>
           
           {/* New Map Coordinates */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block flex items-center gap-1"><Compass size={12}/> Link Map Solo</label>
                <Input value={config.mapSoloLink || ''} onChange={(e) => setConfig({...config, mapSoloLink: e.target.value})} placeholder="https://maps.app.goo.gl/..." className="text-xs" />
              </div>
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block flex items-center gap-1"><Compass size={12}/> Link Map Blora</label>
                <Input value={config.mapBloraLink || ''} onChange={(e) => setConfig({...config, mapBloraLink: e.target.value})} placeholder="https://maps.app.goo.gl/..." className="text-xs" />
              </div>
           </div>

           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block flex items-center gap-1"><Phone size={12}/> No. WhatsApp Utama</label>
             <Input value={config.whatsappNumber || ''} onChange={(e) => setConfig({...config, whatsappNumber: e.target.value})} placeholder="08xxxx (Tanpa +62)" />
           </div>
        </div>
      </div>

      {/* COLUMN 2: Links & Social */}
      <div className="space-y-8">
        {/* Dynamic Links */}
        <div className="space-y-4">
           <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2 flex items-center gap-2">
              <LinkIcon size={18} /> Software Links
           </h3>
           <div className="bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-lg">
              <h4 className="text-brand-orange font-bold text-sm mb-2 flex items-center gap-2"><AlertCircle size={14}/> Petunjuk</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Jika link diisi, tombol di halaman Inovasi akan mengarah ke URL tersebut. 
                Jika dikosongkan, tombol otomatis mengarah ke WhatsApp Admin (Mode Waitlist).
              </p>
           </div>
           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">SIBOS URL</label>
             <Input value={config.sibosUrl || ''} onChange={(e) => setConfig({...config, sibosUrl: e.target.value})} placeholder="https://sibos.id" />
           </div>
           <div>
             <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">QALAM URL</label>
             <Input value={config.qalamUrl || ''} onChange={(e) => setConfig({...config, qalamUrl: e.target.value})} placeholder="https://app.qalam.id" />
           </div>
        </div>

        {/* Social Media */}
        <div className="space-y-4">
           <h3 className="text-white font-bold text-lg border-b border-white/10 pb-2 flex items-center gap-2">
              <Share2 size={18} /> Sosial Media
           </h3>
           <p className="text-gray-500 text-xs">Kosongkan kolom jika tidak ingin menampilkan ikon di footer.</p>
           
           <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-xs text-gray-400 font-bold mb-1 block">Instagram URL</label>
                <Input value={config.instagramUrl || ''} onChange={(e) => setConfig({...config, instagramUrl: e.target.value})} placeholder="https://instagram.com/..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold mb-1 block">Facebook URL</label>
                <Input value={config.facebookUrl || ''} onChange={(e) => setConfig({...config, facebookUrl: e.target.value})} placeholder="https://facebook.com/..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold mb-1 block">YouTube URL</label>
                <Input value={config.youtubeUrl || ''} onChange={(e) => setConfig({...config, youtubeUrl: e.target.value})} placeholder="https://youtube.com/..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold mb-1 block">LinkedIn URL</label>
                <Input value={config.linkedinUrl || ''} onChange={(e) => setConfig({...config, linkedinUrl: e.target.value})} placeholder="https://linkedin.com/..." />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-bold mb-1 block">TikTok URL</label>
                <Input value={config.tiktokUrl || ''} onChange={(e) => setConfig({...config, tiktokUrl: e.target.value})} placeholder="https://tiktok.com/..." />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
