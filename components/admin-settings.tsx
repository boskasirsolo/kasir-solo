
import React, { useState } from 'react';
import { 
    Layout, MapPin, Share2, Settings as SettingsIcon, 
    Save, UploadCloud, Image as ImageIcon, Sparkles, 
    TrendingUp, Monitor, Globe, BarChart, Clock, 
    Smartphone, Mail, Compass, ShieldCheck 
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Input, TextArea, Button, LoadingSpinner } from './ui';
import { supabase, callGeminiWithRotation, CONFIG, renameFile, INDONESIA_TIMEZONES, normalizePhone } from '../utils';

// --- MENU TABS ---
const TABS = [
    { id: 'general', label: 'Umum & Hero', icon: Layout },
    { id: 'contact', label: 'Kontak & Lokasi', icon: MapPin },
    { id: 'social', label: 'Sosial & Link', icon: Share2 },
    { id: 'system', label: 'Sistem & Timezone', icon: SettingsIcon },
];

export const AdminSettings = ({
  config,
  setConfig
}: {
  config: SiteConfig,
  setConfig: (c: SiteConfig) => void
}) => {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [magicContext, setMagicContext] = useState('');
  
  // Image Upload State
  const [aboutImageFile, setAboutImageFile] = useState<File | null>(null);
  const [aboutImagePreview, setAboutImagePreview] = useState(config.aboutImage || '');

  const saveSettings = async () => {
      if (!supabase) return alert("Koneksi Database bermasalah.");
      
      // STRICT PHONE VALIDATION FOR ADMIN
      if (config.whatsappNumber) {
          const cleanPhone = normalizePhone(config.whatsappNumber);
          if (!cleanPhone) {
              return alert("Format WhatsApp Error. Gunakan format internasional '628xxx' atau lokal '08xxx' (Min 10 digit).");
          }
          // Auto update config state with cleaned number if valid, but let's just proceed with save for now if clean works
          // Ideally we update the object before sending
          config.whatsappNumber = cleanPhone; 
      }

      setIsSaving(true);
      try {
          let finalAboutImage = aboutImagePreview;

          // 1. Handle Upload if file selected
          if (aboutImageFile && CONFIG.CLOUDINARY_CLOUD_NAME) {
              const seoName = 'kantor-mesin-kasir-solo-hq-about';
              const fileToUpload = renameFile(aboutImageFile, seoName);

              const formData = new FormData();
              formData.append('file', fileToUpload);
              formData.append('upload_preset', CONFIG.CLOUDINARY_PRESET);
              const res = await fetch(`https://api.cloudinary.com/v1_1/${CONFIG.CLOUDINARY_CLOUD_NAME}/image/upload`, { method: 'POST', body: formData });
              const data = await res.json();
              if (data.secure_url) {
                  finalAboutImage = data.secure_url;
                  setConfig({ ...config, aboutImage: finalAboutImage });
              }
          }

          const dbData = {
              id: 1, // Singleton row
              hero_title: config.heroTitle,
              hero_subtitle: config.heroSubtitle,
              about_image: finalAboutImage,
              sibos_url: config.sibosUrl,
              qalam_url: config.qalamUrl,
              // LEGAL DATA
              company_legal_name: config.companyLegalName,
              nib_number: config.nibNumber,
              ahu_number: config.ahuNumber,
              npwp_number: config.npwpNumber,
              
              whatsapp_number: config.whatsappNumber,
              email_address: config.emailAddress, 
              address_solo: config.addressSolo,
              address_blora: config.addressBlora,
              map_solo_link: config.mapSoloLink,
              map_blora_link: config.mapBloraLink,
              map_solo_embed: config.mapSoloEmbed, 
              map_blora_embed: config.mapBloraEmbed, 
              instagram_url: config.instagramUrl,
              facebook_url: config.facebookUrl,
              youtube_url: config.youtubeUrl,
              tiktok_url: config.tiktokUrl,
              linkedin_url: config.linkedinUrl,
              google_analytics_id: config.googleAnalyticsId,
              google_search_console_code: config.googleSearchConsoleCode,
              timezone: config.timezone
          };
          
          const { error } = await supabase.from('site_settings').upsert(dbData);
          if(error) throw error;
          alert("Pengaturan berhasil disimpan.");
          setAboutImageFile(null); 
      } catch(e: any) {
          // Robust Error Handling for Schema Mismatch
          if (e.message && (e.message.includes('column') || e.message.includes('timezone'))) {
             alert("Gagal menyimpan: Struktur Database belum update. Harap jalankan script SQL 'ADD COLUMN timezone' di Supabase.");
          } else {
             alert("Gagal menyimpan: " + e.message);
          }
      } finally {
          setIsSaving(false);
      }
  };

  const generateHeroContent = async () => {
    setIsGenerating(true);
    try {
        const prompt = `
        Role: Senior Copywriter. Task: Generate Hero Section for 'PT MESIN KASIR SOLO'.
        Context: "${magicContext || "General Promotion"}"
        Output JSON: { "heroTitle": "...", "heroSubtitle": "..." }
        `;
        const result = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        const data = JSON.parse(result.text || "{}");
        if(data.heroTitle) setConfig({ ...config, heroTitle: data.heroTitle, heroSubtitle: data.heroSubtitle });
    } catch(e: any) { alert("Gagal generate: " + e.message); } 
    finally { setIsGenerating(false); }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 h-full min-h-[600px] animate-fade-in">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
            <div className="p-4 mb-4 bg-brand-orange/10 border border-brand-orange/20 rounded-xl">
                <h3 className="text-white font-bold text-lg">Konfigurasi</h3>
                <p className="text-xs text-gray-400">Pusat kontrol website.</p>
            </div>
            
            {TABS.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                        activeTab === tab.id 
                        ? 'bg-brand-card text-white border-l-4 border-brand-orange shadow-lg' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                >
                    <tab.icon size={18} className={activeTab === tab.id ? 'text-brand-orange' : ''} />
                    {tab.label}
                </button>
            ))}

            <Button onClick={saveSettings} disabled={isSaving} className="w-full mt-8 shadow-neon py-3 text-sm">
                {isSaving ? <LoadingSpinner size={16}/> : <><Save size={16} /> SIMPAN SEMUA</>}
            </Button>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 bg-brand-card border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>

            {/* TAB: GENERAL */}
            {activeTab === 'general' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Tampilan Utama (Hero)</h3>
                        <p className="text-gray-400 text-xs">Mengatur teks utama yang muncul di halaman depan.</p>
                    </div>

                    {/* AI Generator */}
                    <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                                <Sparkles size={12}/> AI Writer
                            </label>
                            <Input 
                                value={magicContext}
                                onChange={(e) => setMagicContext(e.target.value)}
                                placeholder="Konteks: 'Promo Lebaran', 'Kasir Cafe'..."
                                className="bg-black/40 text-xs"
                            />
                        </div>
                        <Button onClick={generateHeroContent} disabled={isGenerating} variant="outline" className="w-full md:w-auto h-[42px] text-xs px-8">
                            {isGenerating ? <LoadingSpinner size={14}/> : 'GENERATE'}
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Judul Besar (H1)</label>
                            <Input value={config.heroTitle} onChange={(e) => setConfig({...config, heroTitle: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Sub-Judul</label>
                            <TextArea value={config.heroSubtitle} onChange={(e) => setConfig({...config, heroSubtitle: e.target.value})} className="h-24" />
                        </div>
                    </div>

                    {/* LEGALITAS SECTION (NEW) */}
                    <div className="pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-brand-orange mb-4 flex items-center gap-2"><ShieldCheck size={16}/> Legalitas Perusahaan (Footer & About)</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Nama Resmi (PT)</label>
                                <Input value={config.companyLegalName || ''} onChange={(e) => setConfig({...config, companyLegalName: e.target.value})} placeholder="PT MESIN KASIR SOLO" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">NIB (Nomor Induk Berusaha)</label>
                                <Input value={config.nibNumber || ''} onChange={(e) => setConfig({...config, nibNumber: e.target.value})} placeholder="1234xxx" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">SK Kemenkumham (AHU)</label>
                                <Input value={config.ahuNumber || ''} onChange={(e) => setConfig({...config, ahuNumber: e.target.value})} placeholder="AHU-00123.AH.01.01..." />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">NPWP Perusahaan</label>
                                <Input value={config.npwpNumber || ''} onChange={(e) => setConfig({...config, npwpNumber: e.target.value})} placeholder="XX.XXX.XXX.X-XXX.XXX" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><ImageIcon size={16}/> Foto Kantor (About Page)</h3>
                        <div className="flex gap-6 items-start">
                            <div className="w-40 h-24 bg-black rounded-lg overflow-hidden border border-white/10 shrink-0">
                                <img src={aboutImagePreview || "https://via.placeholder.com/150"} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-brand-orange/50 transition-colors cursor-pointer relative bg-white/5">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={(e) => {
                                            const file = e.target.files ? e.target.files[0] : null;
                                            if(file) {
                                                setAboutImageFile(file);
                                                setAboutImagePreview(URL.createObjectURL(file));
                                            }
                                        }} 
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                                    />
                                    <div className="flex flex-col items-center gap-1 pointer-events-none">
                                        <UploadCloud size={20} className="text-gray-400" />
                                        <span className="text-gray-300 font-bold text-xs">{aboutImageFile ? aboutImageFile.name : "Upload Foto Baru"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: CONTACT */}
            {activeTab === 'contact' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Kontak & Alamat</h3>
                        <p className="text-gray-400 text-xs">Informasi yang ditampilkan di Footer dan Halaman Kontak.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block flex items-center gap-1"><Smartphone size={12}/> WhatsApp (Tanpa +62)</label>
                            <Input value={config.whatsappNumber || ''} onChange={(e) => setConfig({...config, whatsappNumber: e.target.value})} placeholder="812xxxx" />
                            <p className="text-[10px] text-gray-500 mt-1">Gunakan format 08xx atau 628xx (Min 10 digit).</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold uppercase mb-1 block flex items-center gap-1"><Mail size={12}/> Email Resmi</label>
                            <Input value={config.emailAddress || ''} onChange={(e) => setConfig({...config, emailAddress: e.target.value})} placeholder="admin@..." />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2">Kantor Legal (Solo)</h4>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Alamat Lengkap</label>
                                <Input value={config.addressSolo || ''} onChange={(e) => setConfig({...config, addressSolo: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Link Google Maps</label>
                                <Input value={config.mapSoloLink || ''} onChange={(e) => setConfig({...config, mapSoloLink: e.target.value})} className="text-xs" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Embed HTML Map</label>
                                <TextArea value={config.mapSoloEmbed || ''} onChange={(e) => setConfig({...config, mapSoloEmbed: e.target.value})} className="h-20 text-[10px] font-mono" placeholder="<iframe src=...>" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2">Kantor Blora (Cabang)</h4>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Alamat Lengkap</label>
                                <Input value={config.addressBlora || ''} onChange={(e) => setConfig({...config, addressBlora: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Link Google Maps</label>
                                <Input value={config.mapBloraLink || ''} onChange={(e) => setConfig({...config, mapBloraLink: e.target.value})} className="text-xs" />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Embed HTML Map</label>
                                <TextArea value={config.mapBloraEmbed || ''} onChange={(e) => setConfig({...config, mapBloraEmbed: e.target.value})} className="h-20 text-[10px] font-mono" placeholder="<iframe src=...>" />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: SOCIALS */}
            {activeTab === 'social' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Sosial Media & Link</h3>
                        <p className="text-gray-400 text-xs">Tautan eksternal ke platform lain.</p>
                    </div>

                    <div className="bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-xl space-y-4">
                        <h4 className="text-brand-orange font-bold text-sm">Software Links (Inovasi)</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Link SIBOS</label>
                                <Input value={config.sibosUrl || ''} onChange={(e) => setConfig({...config, sibosUrl: e.target.value})} />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 font-bold mb-1 block">Link QALAM</label>
                                <Input value={config.qalamUrl || ''} onChange={(e) => setConfig({...config, qalamUrl: e.target.value})} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm border-b border-white/10 pb-2">Akun Sosmed</h4>
                        {['Instagram', 'Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((platform) => {
                            const key = `${platform.toLowerCase()}Url` as keyof SiteConfig;
                            return (
                                <div key={platform}>
                                    <label className="text-xs text-gray-500 font-bold mb-1 block">{platform} URL</label>
                                    <Input 
                                        value={String(config[key] || '')} 
                                        onChange={(e) => setConfig({...config, [key]: e.target.value})} 
                                        placeholder={`https://${platform.toLowerCase()}.com/...`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: SYSTEM & TIMEZONE */}
            {activeTab === 'system' && (
                <div className="space-y-8 animate-fade-in">
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Sistem & Integrasi</h3>
                        <p className="text-gray-400 text-xs">Pengaturan teknis dan tracking.</p>
                    </div>

                    {/* TIMEZONE SECTION */}
                    <div className="bg-brand-dark/50 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/10 rounded-full blur-xl pointer-events-none"></div>
                        <h4 className="text-brand-orange font-bold text-sm mb-4 flex items-center gap-2">
                            <Clock size={16}/> Zona Waktu (Timezone)
                        </h4>
                        <div className="max-w-md">
                            <label className="text-xs text-gray-500 font-bold uppercase mb-2 block">Pilih Zona Waktu Kantor</label>
                            <select 
                                value={config.timezone || 'Asia/Jakarta'}
                                onChange={(e) => setConfig({...config, timezone: e.target.value})}
                                className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white focus:border-brand-orange outline-none cursor-pointer hover:border-white/30 transition-colors"
                            >
                                {INDONESIA_TIMEZONES.map(tz => (
                                    <option key={tz.value} value={tz.value}>{tz.label} (GMT {tz.offset > 0 ? '+' : ''}{tz.offset})</option>
                                ))}
                            </select>
                            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed">
                                *Pengaturan ini akan mempengaruhi jadwal posting artikel otomatis. Pastikan sesuai dengan lokasi operasional Anda agar artikel terbit tepat waktu.
                            </p>
                        </div>
                    </div>

                    {/* GOOGLE INTEGRATION */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm mb-2 flex items-center gap-2 border-b border-white/10 pb-2">
                            <Globe size={16}/> Google Integration
                        </h4>
                        <div>
                            <label className="text-xs text-gray-500 font-bold mb-1 block flex items-center gap-1"><BarChart size={12}/> Google Analytics 4 (GA4)</label>
                            <Input 
                                value={config.googleAnalyticsId || ''} 
                                onChange={(e) => setConfig({...config, googleAnalyticsId: e.target.value})} 
                                placeholder="G-XXXXXXXXXX" 
                                className="font-mono text-xs"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 font-bold mb-1 block flex items-center gap-1"><Monitor size={12}/> Search Console Verification</label>
                            <Input 
                                value={config.googleSearchConsoleCode || ''} 
                                onChange={(e) => setConfig({...config, googleSearchConsoleCode: e.target.value})} 
                                placeholder="Paste meta tag content here" 
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>
            )}

        </div>
    </div>
  );
};
