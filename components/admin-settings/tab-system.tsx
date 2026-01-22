
import React from 'react';
import { TabProps } from './types';
import { SettingsSection } from './ui-atoms';
import { Input, Button } from '../ui';
import { Clock, Rss, Copy, Check, Eye, EyeOff, ShieldAlert, Zap, Loader2 } from 'lucide-react';
import { INDONESIA_TIMEZONES, CONFIG } from '../../utils';

export const TabSystem = ({ config, setConfig, state, actions }: TabProps) => {
    const [copied, setCopied] = React.useState(false);
    
    // Clean access thanks to updated interface
    const isToggling = state.isTogglingMaintenance;

    const projectUrl = CONFIG.SUPABASE_URL || "";
    const projectRef = projectUrl.split('//')[1]?.split('.')[0];
    const feedUrl = projectRef ? `https://${projectRef}.supabase.co/functions/v1/google-product-feed` : "Error: Supabase URL not found";

    const handleCopy = () => {
        navigator.clipboard.writeText(feedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* --- MAINTENANCE MODE SWITCH (INSTANT AUTO-SAVE) --- */}
            <SettingsSection title="Stealth & Maintenance Control" desc="Gembok ruko depan biar publik gak liat pas lo lagi ngelas sistem.">
                <div className={`p-6 rounded-2xl border transition-all duration-500 flex flex-col md:flex-row items-center gap-6 ${config.is_maintenance_mode ? 'bg-red-600/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-green-500/5 border-green-500/30'}`}>
                    <div className={`p-4 rounded-3xl transition-all duration-500 ${config.is_maintenance_mode ? 'bg-red-500 text-white shadow-neon-strong rotate-12' : 'bg-green-500/20 text-green-500 shadow-neon'}`}>
                        {isToggling ? <Loader2 className="animate-spin" size={32} /> : config.is_maintenance_mode ? <ShieldAlert size={32} /> : <Zap size={32} />}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            <h4 className="text-white font-black text-lg uppercase tracking-tighter">
                                {config.is_maintenance_mode ? 'MODE MAINTENANCE AKTIF' : 'WEBSITE STATUS: LIVE'}
                            </h4>
                            <div className={`w-2 h-2 rounded-full animate-ping ${config.is_maintenance_mode ? 'bg-red-500' : 'bg-green-500'}`}></div>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-md font-bold uppercase tracking-widest">
                            {config.is_maintenance_mode 
                                ? 'Publik cuma bisa liat halaman "Lagi Bongkar Mesin". Browser lo (Ghost Mode) tetep bisa liat web asli.' 
                                : 'Web lo kebuka lebar buat semua orang. Pastikan semua konten udah oke Bos!'}
                        </p>
                    </div>
                    <button 
                        onClick={() => actions.toggleMaintenanceInstant()}
                        disabled={isToggling}
                        className={`px-8 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all transform active:scale-95 disabled:opacity-50 flex items-center gap-2 ${config.is_maintenance_mode ? 'bg-green-600 hover:bg-green-500 text-white shadow-neon' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                    >
                        {isToggling ? (
                            <> <Loader2 size={14} className="animate-spin" /> SYNCHRONIZING...</>
                        ) : config.is_maintenance_mode ? (
                            'BUKA GEMBOK (GO LIVE)'
                        ) : (
                            'GEMBOK RUKO (AUTO-SAVE)'
                        )}
                    </button>
                </div>
            </SettingsSection>

            {/* VISIBILITY CONTROL */}
            <SettingsSection title="Indeks Mesin Pencari" desc="Atur apakah website boleh muncul di Google atau tidak.">
                <div className={`p-6 rounded-2xl border transition-all flex flex-col md:flex-row items-center gap-6 ${config.is_noindex ? 'bg-red-500/5 border-red-500/30' : 'bg-green-500/5 border-green-500/30'}`}>
                    <div className={`p-4 rounded-full ${config.is_noindex ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500 shadow-neon'}`}>
                        {config.is_noindex ? <EyeOff size={32} /> : <Eye size={32} />}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h4 className="text-white font-bold text-lg mb-1">
                            {config.is_noindex ? 'Website Sedang Disembunyikan' : 'Website Publik (Terindeks)'}
                        </h4>
                        <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                            {config.is_noindex 
                                ? 'Google dan mesin pencari lainnya diperintahkan untuk mengabaikan website ini. Cocok saat website masih dalam perbaikan.' 
                                : 'Website lo bisa dicari dan muncul di halaman Google. Pastikan konten sudah siap jualan sebelum tayang.'}
                        </p>
                    </div>
                    <button 
                        onClick={() => setConfig({...config, is_noindex: !config.is_noindex})}
                        className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${config.is_noindex ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white'}`}
                    >
                        {config.is_noindex ? 'Tampilkan ke Google' : 'Sembunyikan Sekarang'}
                    </button>
                </div>
            </SettingsSection>

            {/* GOOGLE MERCHANT FEED */}
            <SettingsSection title="Google Merchant Center (Product Feed)" desc="Sinkronisasi produk otomatis ke Google Shopping (Free Listing/Ads).">
                <div className="bg-brand-orange/5 p-6 rounded-xl border border-brand-orange/20 relative">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-brand-orange/10 rounded-lg text-brand-orange shrink-0">
                            <Rss size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-2">Link XML Feed Otomatis</h4>
                            <div className="flex gap-2 mb-2">
                                <div className="relative flex-1">
                                    <Input value={feedUrl} readOnly className="bg-black/50 border-brand-orange/30 text-brand-orange font-mono text-xs pr-10 cursor-text" />
                                </div>
                                <Button onClick={handleCopy} className="bg-brand-orange hover:bg-brand-action text-white px-4 shrink-0">
                                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Konfigurasi Server & Waktu">
                <div className="bg-brand-dark/50 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                    <h4 className="text-brand-orange font-bold text-sm mb-4 flex items-center gap-2">
                        <Clock size={16}/> Zona Waktu (Timezone)
                    </h4>
                    <div className="max-w-md">
                        <select 
                            value={config.timezone || 'Asia/Jakarta'}
                            onChange={(e) => setConfig({...config, timezone: e.target.value})}
                            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-xs focus:border-brand-orange outline-none cursor-pointer"
                        >
                            {INDONESIA_TIMEZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
