
import React from 'react';
import { TabProps } from './types';
import { SettingsTabWrapper, SettingsHeader, SettingsCard, SettingsField } from './ui-atoms';
import { Input } from '../ui';
import { LineChart, Search, ShoppingBag, Info } from 'lucide-react';

export const TabTracking = ({ config, setConfig }: TabProps) => (
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

        <SettingsCard title="Google Merchant" icon={ShoppingBag} color="text-brand-orange">
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 w-full">
                    <SettingsField label="Merchant ID (Optional)">
                        <Input 
                            value={config.google_merchant_id || ''} 
                            onChange={(e: any) => setConfig({...config, google_merchant_id: e.target.value})} 
                            className="bg-black/40 font-mono"
                        />
                    </SettingsField>
                </div>
                <div className="bg-blue-500/5 p-4 rounded-xl border border-blue-500/10 flex gap-3 max-w-sm">
                    <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                        Data produk lo otomatis di-generate dlm format XML Feed. Link-nya ada di tab <strong>SISTEM</strong>.
                    </p>
                </div>
            </div>
        </SettingsCard>
    </SettingsTabWrapper>
);
