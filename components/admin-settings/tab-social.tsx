
import React from 'react';
import { TabProps } from './types';
import { SettingsSection } from './ui-atoms';
import { Input } from '../ui';
import { SiteConfig } from '../../types';

export const TabSocial = ({ config, setConfig }: TabProps) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <SettingsSection title="Tautan Ekosistem (Software)">
                <div className="bg-brand-orange/5 border border-brand-orange/20 p-4 rounded-xl">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Link SIBOS (App)</label>
                            <Input value={config.sibos_url || ''} onChange={(e) => setConfig({...config, sibos_url: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Link QALAM (School)</label>
                            <Input value={config.qalam_url || ''} onChange={(e) => setConfig({...config, qalam_url: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Link Dapur SPPG (MBG)</label>
                            <Input value={config.dapur_sppg_url || ''} onChange={(e) => setConfig({...config, dapur_sppg_url: e.target.value})} placeholder="https://..." />
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Jejaring Sosial">
                <div className="grid gap-3">
                    {[
                        { label: 'Instagram', key: 'instagram_url' },
                        { label: 'Facebook', key: 'facebook_url' },
                        { label: 'YouTube', key: 'youtube_url' },
                        { label: 'TikTok', key: 'tiktok_url' },
                        { label: 'LinkedIn', key: 'linkedin_url' }
                    ].map((platform) => {
                        return (
                            <div key={platform.key}>
                                <label className="text-[10px] text-gray-500 font-bold mb-1 block">{platform.label} URL</label>
                                <Input 
                                    // @ts-ignore
                                    value={String(config[platform.key] || '')} 
                                    // @ts-ignore
                                    onChange={(e) => setConfig({...config, [platform.key]: e.target.value})} 
                                    placeholder={`https://${platform.label.toLowerCase()}.com/...`}
                                    className="text-xs"
                                />
                            </div>
                        );
                    })}
                </div>
            </SettingsSection>
        </div>
    );
};
