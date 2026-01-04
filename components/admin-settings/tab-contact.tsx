
import React from 'react';
import { TabProps } from './types';
import { SettingsSection } from './ui-atoms';
import { Input, TextArea } from '../ui';
import { Smartphone, Mail } from 'lucide-react';

export const TabContact = ({ config, setConfig }: TabProps) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <SettingsSection title="Kontak Utama">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block flex items-center gap-1"><Smartphone size={10}/> WhatsApp (Tanpa +62)</label>
                        <Input value={config.whatsappNumber || ''} onChange={(e) => setConfig({...config, whatsappNumber: e.target.value})} placeholder="812xxxx" />
                        <p className="text-[9px] text-gray-500 mt-1">Gunakan format 08xx atau 628xx (Min 10 digit).</p>
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block flex items-center gap-1"><Mail size={10}/> Email Resmi</label>
                        <Input value={config.emailAddress || ''} onChange={(e) => setConfig({...config, emailAddress: e.target.value})} placeholder="admin@..." />
                    </div>
                </div>
            </SettingsSection>

            <SettingsSection title="Lokasi Kantor">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* SOLO */}
                    <div className="space-y-3 p-4 bg-brand-dark/30 rounded-xl border border-white/5">
                        <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2">Kantor Legal (Solo)</h4>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Alamat Lengkap</label>
                            <Input value={config.addressSolo || ''} onChange={(e) => setConfig({...config, addressSolo: e.target.value})} className="text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Link Google Maps</label>
                            <Input value={config.mapSoloLink || ''} onChange={(e) => setConfig({...config, mapSoloLink: e.target.value})} className="text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Embed HTML Map</label>
                            <TextArea value={config.mapSoloEmbed || ''} onChange={(e) => setConfig({...config, mapSoloEmbed: e.target.value})} className="h-20 text-[10px] font-mono" placeholder="<iframe src=...>" />
                        </div>
                    </div>

                    {/* BLORA */}
                    <div className="space-y-3 p-4 bg-brand-dark/30 rounded-xl border border-white/5">
                        <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2">Kantor Blora (Cabang)</h4>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Alamat Lengkap</label>
                            <Input value={config.addressBlora || ''} onChange={(e) => setConfig({...config, addressBlora: e.target.value})} className="text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Link Google Maps</label>
                            <Input value={config.mapBloraLink || ''} onChange={(e) => setConfig({...config, mapBloraLink: e.target.value})} className="text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold mb-1 block">Embed HTML Map</label>
                            <TextArea value={config.mapBloraEmbed || ''} onChange={(e) => setConfig({...config, mapBloraEmbed: e.target.value})} className="h-20 text-[10px] font-mono" placeholder="<iframe src=...>" />
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
