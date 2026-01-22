
import React from 'react';
import { TabProps } from './types';
import { SettingsTabWrapper, SettingsHeader, SettingsCard, SettingsField } from './ui-atoms';
import { Input, Button } from '../ui';
import { LineChart, Search, ShoppingBag, Rss, Copy, Check, Info } from 'lucide-react';
import { CONFIG } from '../../utils';

export const TabTracking = ({ config, setConfig }: TabProps) => {
    const [copied, setCopied] = React.useState(false);

    const projectUrl = CONFIG.SUPABASE_URL || "";
    const projectRef = projectUrl.split('//')[1]?.split('.')[0];
    const feedUrl = projectRef ? `https://${projectRef}.supabase.co/functions/v1/google-product-feed` : "Error: Supabase URL not found";

    const handleCopy = () => {
        navigator.clipboard.writeText(feedUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <SettingsTabWrapper>
            <SettingsHeader title="Radar & SEO Integration" desc="Dapetin data pengunjung biar lo gak jualan kayak orang buta." />
            
            <div className="grid md:grid-cols-2 gap-8">
                <SettingsCard title="Google Analytics 4" icon={LineChart} color="text-blue-400">
                    <SettingsField label="Measurement ID (GA4)" helper="Contoh: G-XXXXXXXXXX">
                        <Input 
                            value={config.google_analytics_id || ''} 
                            onChange={(e: any) => setConfig({...config, google_analytics_id: e.target.value})} 
                            className="bg-black/40 font-mono text-xs"
                        />
                    </SettingsField>
                    <p className="text-[9px] text-gray-600 leading-relaxed italic">Aktifkan ini buat monitor berapa orang yang masuk ke web lo tiap hari.</p>
                </SettingsCard>

                <SettingsCard title="Search Console" icon={Search} color="text-green-500">
                    <SettingsField label="Verification Code (Meta Tag)" helper="Kode unik dari Google Search Console.">
                        <Input 
                            value={config.google_search_console_code || ''} 
                            onChange={(e: any) => setConfig({...config, google_search_console_code: e.target.value})} 
                            className="bg-black/40 font-mono text-[10px]"
                        />
                    </SettingsField>
                    <p className="text-[9px] text-gray-600 leading-relaxed italic">Biar Google tau ruko digital lo valid dan didaftarin ke mesin pencari.</p>
                </SettingsCard>
            </div>

            <SettingsCard title="Google Merchant Center" icon={ShoppingBag} color="text-brand-orange">
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full">
                            <SettingsField label="Merchant ID" helper="ID unik dari dashboard Google Merchant Center.">
                                <Input 
                                    value={config.google_merchant_id || ''} 
                                    onChange={(e: any) => setConfig({...config, google_merchant_id: e.target.value})} 
                                    className="bg-black/40 font-mono"
                                    placeholder="123456789"
                                />
                            </SettingsField>
                        </div>
                        <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 flex gap-3 max-w-sm shrink-0">
                            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Masukkan Merchant ID lo biar sistem bisa ngarahin data traffic belanja ke akun yang bener.
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3 mb-4">
                            <Rss size={16} className="text-brand-orange" />
                            <h4 className="text-white font-bold text-xs uppercase tracking-widest">XML Product Feed</h4>
                        </div>
                        
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                Salin link di bawah dan tempel di bagian <strong>Feeds</strong> di Google Merchant Center lo buat sinkronisasi produk otomatis.
                            </p>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Input 
                                        value={feedUrl} 
                                        readOnly 
                                        className="bg-black/50 border-white/10 text-brand-orange font-mono text-[10px] pr-10 cursor-text h-10" 
                                    />
                                </div>
                                <Button onClick={handleCopy} className="bg-brand-orange hover:bg-brand-action text-white px-4 shrink-0 h-10">
                                    {copied ? <Check size={16}/> : <Copy size={16}/>}
                                </Button>
                            </div>
                            <p className="text-[8px] text-gray-600 italic">*Feed ini di-generate real-time dari database produk aktif.</p>
                        </div>
                    </div>
                </div>
            </SettingsCard>
        </SettingsTabWrapper>
    );
};
