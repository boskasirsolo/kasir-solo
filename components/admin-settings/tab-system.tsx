
import React from 'react';
import { TabProps } from './types';
import { SettingsSection } from './ui-atoms';
import { Input } from '../ui';
import { Clock, Globe, BarChart, Monitor } from 'lucide-react';
import { INDONESIA_TIMEZONES } from '../../utils';

export const TabSystem = ({ config, setConfig }: TabProps) => {
    return (
        <div className="space-y-8 animate-fade-in">
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

            <SettingsSection title="Integrasi Google">
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
                </div>
            </SettingsSection>
        </div>
    );
};
