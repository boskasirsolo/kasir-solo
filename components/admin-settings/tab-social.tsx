
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
                            <Input value={config.sibosUrl || ''} onChange={(e) => setConfig({...config, sibosUrl: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Link QALAM (School)</label>
                            <Input value={config.qalamUrl || ''} onChange={(e) => setConfig({...config, qalamUrl: e.target.value})} />
                        </div>
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Jejaring Sosial">
                <div className="grid gap-3">
                    {['Instagram', 'Facebook', 'YouTube', 'TikTok', 'LinkedIn'].map((platform) => {
                        const key = `${platform.toLowerCase()}Url` as keyof SiteConfig;
                        return (
                            <div key={platform}>
                                <label className="text-[10px] text-gray-500 font-bold mb-1 block">{platform} URL</label>
                                <Input 
                                    value={String(config[key] || '')} 
                                    onChange={(e) => setConfig({...config, [key]: e.target.value})} 
                                    placeholder={`https://${platform.toLowerCase()}.com/...`}
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
