
import React, { useState } from 'react';
import { CheckCircle2, Link as LinkIcon, AlertCircle, Share2, MapPin, Phone, Compass, Save, Sparkles, TrendingUp } from 'lucide-react';
import { SiteConfig } from '../types';
import { Input, TextArea, Button, LoadingSpinner } from './ui';
import { supabase, callGeminiWithRotation } from '../utils';

export const AdminSettings = ({
  config,
  setConfig
}: {
  config: SiteConfig,
  setConfig: (c: SiteConfig) => void
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicContext, setMagicContext] = useState('');

  const saveSettings = async () => {
      if (!supabase) return alert("Koneksi Database bermasalah.");
      
      setIsSaving(true);
      try {
          const dbData = {
              id: 1, // Singleton row concept
              hero_title: config.heroTitle,
              hero_subtitle: config.heroSubtitle,
              sibos_url: config.sibosUrl,
              qalam_url: config.qalamUrl,
              whatsapp_number: config.whatsappNumber,
              address_solo: config.addressSolo,
              address_blora: config.addressBlora,
              map_solo_link: config.mapSoloLink,
              map_blora_link: config.mapBloraLink,
              instagram_url: config.instagramUrl,
              facebook_url: config.facebookUrl,
              youtube_url: config.youtubeUrl,
              tiktok_url: config.tiktokUrl,
              linkedin_url: config.linkedinUrl
          };
          
          const { error } = await supabase.from('site_settings').upsert(dbData);
          if(error) throw error;
          alert("Konfigurasi berhasil disimpan! Refresh halaman depan untuk melihat perubahan.");
      } catch(e: any) {
          alert("Gagal menyimpan: " + e.message);
      } finally {
          setIsSaving(false);
      }
  };

  const generateHeroContent = async () => {
    setIsGenerating(true);
    try {
        const prompt = `
        Role: Senior SEO Strategist & Conversion Copywriter (Indonesian Market Expert).
        Task: Generate a high-converting Hero Section for 'PT MESIN KASIR SOLO'.
        
        Business Context: 
        - Selling: Mesin Kasir (POS), Software (SIBOS, QALAM), Web Development.
        - Target: UMKM, Cafe, Retail, Corporate.
        - User Input Context: "${magicContext || "General Promotion"}"

        SEO STRATEGY (Modern & Trending):
        1. Analyze predicted trending keywords for 2024/2025 in Indonesia (e.g., 'Kasir Android', 'Digitalisasi UMKM', 'Omnichannel POS').
        2. Focus on "Transactional Intent" (keywords that drive sales).
        3. Use "Semantic SEO" to include related terms naturally in the subtitle.
        
        OUTPUT RULES:
        - Hero Title: Maximum 6 words. Powerful, keyword-rich, attention-grabbing.
        - Hero Subtitle: Maximum 25 words. Explains the value proposition + solves a pain point + includes secondary keywords.
        - Language: Indonesian (Professional, Persuasive, Trustworthy).
        
        STRICT JSON OUTPUT FORMAT:
        {
            "heroTitle": "YOUR TITLE HERE",
            "heroSubtitle": "YOUR SUBTITLE HERE"
        }
        `;
        
        // USE CENTRALIZED ROTATION CALLER
        const result = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const text = result.text || "{}";
        const data = JSON.parse(text);
        
        if(data.heroTitle && data.heroSubtitle) {
            setConfig({ 
                ...config, 
                heroTitle: data.heroTitle, 
                heroSubtitle: data.heroSubtitle 
            });
        }
    } catch(e: any) {
        alert("Gagal generate AI: " + e.message);
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Header with Save Button */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 sticky top-0 bg-brand-dark z-10 py-2">
            <div>
                <h3 className="text-white font-bold text-lg">Konfigurasi Umum</h3>
                <p className="text-gray-500 text-xs">Pengaturan global website.</p>
            </div>
            <Button onClick={saveSettings} disabled={isSaving} className="px-6">
                {isSaving ? <LoadingSpinner size={16}/> : <><Save size={16} /> SIMPAN PERUBAHAN</>}
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUMN 1: General & Contact */}
        <div className="space-y-8">
            {/* General Config */}
            <div className="space-y-4">
                <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-2">Hero Section</h4>
                
                {/* AI MAGIC BOX */}
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-lg p-4 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Sparkles size={40} className="text-white"/>
                    </div>
                    <label className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                        <TrendingUp size={12}/> SEO Magic Writer
                    </label>
                    <div className="flex gap-2">
                        <input 
                            value={magicContext}
                            onChange={(e) => setMagicContext(e.target.value)}
                            placeholder="Target: 'Promo Lebaran', 'Kasir Cafe', 'Jasa Web'..."
                            className="bg-black/40 border border-white/10 rounded px-3 text-xs w-full focus:outline-none focus:border-blue-400 text-white placeholder-gray-500"
                        />
                        <button 
                            onClick={generateHeroContent}
                            disabled={isGenerating}
                            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold px-4 py-2 rounded flex items-center gap-2 whitespace-nowrap transition-all shadow-lg"
                        >
                            {isGenerating ? <LoadingSpinner size={14}/> : <><Sparkles size={14}/> RESEARCH & WRITE</>}
                        </button>
                    </div>
                    <p className="text-[9px] text-gray-400 mt-2 italic">*AI akan meriset keyword populer terbaru sebelum menulis.</p>
                </div>

                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Title (H1)</label>
                    <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1 block">Hero Subtitle</label>
                    <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-28" />
                </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
            <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                <MapPin size={14} /> Alamat & Kontak
            </h4>
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
            <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                <LinkIcon size={14} /> Software Links
            </h4>
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
            <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-2 flex items-center gap-2">
                <Share2 size={14} /> Sosial Media
            </h4>
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
    </div>
  );
};
