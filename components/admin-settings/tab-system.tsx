
import React from 'react';
import { TabProps } from './types';
import { SettingsSection } from './ui-atoms';
import { Input, Button } from '../ui';
import { Clock, BarChart, Monitor, Rss, Copy, ExternalLink, Check, ShoppingBag, Download, AlertTriangle } from 'lucide-react';
import { INDONESIA_TIMEZONES, CONFIG } from '../../utils';

export const TabSystem = ({ config, setConfig }: TabProps) => {
    const [copied, setCopied] = React.useState(false);
    
    // Construct Feed URL dynamically based on current Supabase Project
    const projectUrl = CONFIG.SUPABASE_URL || "";
    // Hacky way to get functions URL if not standard, but usually it follows this pattern for Supabase
    const projectRef = projectUrl.split('//')[1]?.split('.')[0];
    const feedUrl = projectRef ? `https://${projectRef}.supabase.co/functions/v1/google-product-feed` : "Error: Supabase URL not found";

    const handleCopy = () => {
        navigator.clipboard.writeText(feedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* GOOGLE MERCHANT FEED (UPDATED INSTRUCTIONS) */}
            <SettingsSection title="Google Merchant Center (Product Feed)" desc="Sinkronisasi produk otomatis ke Google Shopping (Free Listing/Ads).">
                <div className="bg-brand-orange/5 p-6 rounded-xl border border-brand-orange/20 relative">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-brand-orange/10 rounded-lg text-brand-orange shrink-0">
                            <Rss size={24} />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold text-sm mb-2">Link XML Feed Otomatis</h4>
                            
                            <div className="bg-brand-dark/50 p-3 rounded-lg border border-white/10 mb-4 text-xs text-gray-300 leading-relaxed">
                                <strong className="text-brand-orange flex items-center gap-2 mb-1"><AlertTriangle size={12}/> PENTING: Cara Setting di Google</strong>
                                <ol className="list-decimal pl-4 space-y-1 text-gray-400">
                                    <li>Buka Google Merchant Center.</li>
                                    <li>Pilih menu <strong>Products {'>'} Feeds</strong>.</li>
                                    <li>Klik tombol <strong>(+) Add Product Feed</strong>.</li>
                                    <li>Pilih metode <strong>"Scheduled Fetch"</strong> (Pengambilan Terjadwal). <span className="text-red-400 font-bold">JANGAN pilih "API".</span></li>
                                    <li>Paste URL di bawah ini ke kolom "File URL".</li>
                                </ol>
                            </div>
                            
                            <div className="flex gap-2 mb-2">
                                <div className="relative flex-1">
                                    <Input 
                                        value={feedUrl} 
                                        readOnly 
                                        onChange={() => {}}
                                        className="bg-black/50 border-brand-orange/30 text-brand-orange font-mono text-xs pr-10 cursor-text"
                                    />
                                </div>
                                <Button onClick={handleCopy} className="bg-brand-orange hover:bg-brand-action text-white px-4 shrink-0" title="Salin URL">
                                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                                </Button>
                                <Button onClick={() => window.open(feedUrl, '_blank')} variant="outline" className="px-4 border-brand-orange/30 text-brand-orange hover:bg-brand-orange/10 shrink-0" title="Tes Buka Link">
                                    <ExternalLink size={16}/>
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-500 italic">
                                *Link ini berisi data semua produk lo dalam format XML yang disukai Google. Update otomatis real-time.
                            </p>
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Konfigurasi Server & Waktu">
                <div className="bg-brand-dark/50 p-6 rounded-xl border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-brand-orange/10 rounded-full blur-xl pointer-events-none"></div>
                    <h4 className="text-brand-orange font-bold text-sm mb-4 flex items-center gap-2">
                        <Clock size={16}/> Zona Waktu (Timezone)
                    </h4>
                    <div className="max-w-md">
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Pilih Zona Waktu Kantor</label>
                        <select 
                            value={config.timezone || 'Asia/Jakarta'}
                            onChange={(e) => setConfig({...config, timezone: e.target.value})}
                            className="w-full bg-black border border-white/20 rounded-lg px-4 py-3 text-white text-xs focus:border-brand-orange outline-none cursor-pointer hover:border-white/30 transition-colors"
                        >
                            {INDONESIA_TIMEZONES.map(tz => (
                                <option key={tz.value} value={tz.value}>{tz.label} (GMT {tz.offset > 0 ? '+' : ''}{tz.offset})</option>
                            ))}
                        </select>
                        <p className="text-[9px] text-gray-500 mt-2 leading-relaxed">
                            *Pengaturan ini akan mempengaruhi jadwal posting artikel otomatis.
                        </p>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Integrasi Google (Analitik)">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold mb-1 block flex items-center gap-1"><BarChart size={12}/> Google Analytics 4 (GA4)</label>
                        <Input 
                            value={config.googleAnalyticsId || ''} 
                            onChange={(e) => setConfig({...config, googleAnalyticsId: e.target.value})} 
                            placeholder="G-XXXXXXXXXX" 
                            className="font-mono text-xs"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold mb-1 block flex items-center gap-1"><Monitor size={12}/> Search Console Verification</label>
                        <Input 
                            value={config.googleSearchConsoleCode || ''} 
                            onChange={(e) => setConfig({...config, googleSearchConsoleCode: e.target.value})} 
                            placeholder="Paste meta tag content here" 
                            className="font-mono text-xs"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold mb-1 block flex items-center gap-1"><ShoppingBag size={12}/> Google Merchant Center ID</label>
                        <Input 
                            value={config.googleMerchantId || ''} 
                            onChange={(e) => setConfig({...config, googleMerchantId: e.target.value})} 
                            placeholder="1234567890" 
                            className="font-mono text-xs"
                        />
                        <p className="text-[9px] text-gray-500 mt-1">ID Toko di Google Merchant. Biarkan kosong jika tidak punya.</p>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
