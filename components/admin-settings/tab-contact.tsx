
import React, { useState } from 'react';
import { TabProps } from './types';
import { SettingsSection, ImageUploader } from './ui-atoms';
import { Input, TextArea } from '../ui';
import { Smartphone, Mail, Building, ShieldCheck, MapPin } from 'lucide-react';
import { MediaLibraryModal } from '../admin/media-library';

export const TabContact = ({ config, setConfig, state, actions }: TabProps) => {
    const [showMediaLib, setShowMediaLib] = useState(false);
    const [targetField, setTargetField] = useState<'about' | 'founder'>('about');

    const openMediaLib = (target: 'about' | 'founder') => {
        setTargetField(target);
        setShowMediaLib(true);
    };

    const handleMediaSelect = (url: string) => {
        actions.handleUrlSelect(targetField, url);
        setShowMediaLib(false);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {showMediaLib && (
                <MediaLibraryModal 
                    onSelect={handleMediaSelect} 
                    onClose={() => setShowMediaLib(false)} 
                />
            )}

            {/* 1. IDENTITAS & KONTAK */}
            <SettingsSection title="Identitas & Kontak" desc="Data resmi perusahaan dan jalur komunikasi utama.">
                <div className="bg-brand-dark/30 p-5 rounded-2xl border border-white/5 space-y-6">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest flex items-center gap-1"><Building size={10}/> Nama Resmi Perusahaan (PT)</label>
                        <Input value={config.company_legal_name || ''} onChange={(e) => setConfig({...config, company_legal_name: e.target.value})} placeholder="PT MESIN KASIR SOLO" className="bg-black/40 font-bold" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><Smartphone size={10}/> WhatsApp Business</label>
                            <Input value={config.whatsapp_number || ''} onChange={(e) => setConfig({...config, whatsapp_number: e.target.value})} placeholder="628xxx" className="bg-black/40" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><Mail size={10}/> Email Support</label>
                            <Input value={config.email_address || ''} onChange={(e) => setConfig({...config, email_address: e.target.value})} placeholder="admin@kasirsolo.my.id" className="bg-black/40" />
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* 2. ASET VISUAL */}
            <SettingsSection title="Aset Visual" desc="Foto representatif perusahaan dan personal branding.">
                <div className="grid md:grid-cols-2 gap-6 bg-brand-dark/30 p-5 rounded-2xl border border-white/5">
                    <ImageUploader 
                        label="Foto Kantor (Landscape)" 
                        previewUrl={state.aboutImagePreview} 
                        onSelect={(f) => actions.handleImageSelect('about', f)}
                        onGalleryPick={() => openMediaLib('about')}
                        helperText="Akan muncul di halaman About & Contact."
                    />
                    <ImageUploader 
                        label="Foto Founder (Portrait)" 
                        previewUrl={state.founderImagePreview} 
                        onSelect={(f) => actions.handleImageSelect('founder', f)}
                        onGalleryPick={() => openMediaLib('founder')}
                        aspect="portrait"
                        helperText="Digunakan untuk seksi personal branding."
                    />
                </div>
            </SettingsSection>

            {/* 3. LEGALITAS (COMPACT GRID) */}
            <SettingsSection title="Legalitas Hukum" desc="Nomor izin resmi yang valid di sistem pemerintahan.">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><ShieldCheck size={10}/> NIB</label>
                            <Input value={config.nib_number || ''} onChange={(e) => setConfig({...config, nib_number: e.target.value})} placeholder="1234xxx" className="bg-brand-dark/50 text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><ShieldCheck size={10}/> SK AHU</label>
                            <Input value={config.ahu_number || ''} onChange={(e) => setConfig({...config, ahu_number: e.target.value})} placeholder="AHU-xxx" className="bg-brand-dark/50 text-xs" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><ShieldCheck size={10}/> NPWP</label>
                            <Input value={config.npwp_number || ''} onChange={(e) => setConfig({...config, npwp_number: e.target.value})} placeholder="XX.XXX..." className="bg-brand-dark/50 text-xs" />
                        </div>
                    </div>
                </div>
            </SettingsSection>

            {/* 4. LOKASI FISIK */}
            <SettingsSection title="Lokasi Markas" desc="Titik koordinat dan alamat fisik kantor.">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* SOLO */}
                    <div className="space-y-4 p-5 bg-brand-dark/30 rounded-2xl border border-white/5">
                        <h4 className="text-brand-orange font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2"><MapPin size={14}/> Solo Raya (HQ)</h4>
                        <div>
                            <label className="text-[10px] text-gray-600 font-bold mb-1 block uppercase">Alamat Lengkap</label>
                            <Input value={config.address_solo || ''} onChange={(e) => setConfig({...config, address_solo: e.target.value})} className="text-xs bg-black/20" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 font-bold mb-1 block uppercase">Link Google Maps</label>
                            <Input value={config.map_solo_link || ''} onChange={(e) => setConfig({...config, map_solo_link: e.target.value})} className="text-[10px] bg-black/20" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 font-bold mb-1 block uppercase">Embed Map (Iframe)</label>
                            <TextArea value={config.map_solo_embed || ''} onChange={(e) => setConfig({...config, map_solo_embed: e.target.value})} className="h-16 text-[9px] font-mono bg-black/20" placeholder="<iframe src=...>" />
                        </div>
                    </div>

                    {/* BLORA */}
                    <div className="space-y-4 p-5 bg-brand-dark/30 rounded-2xl border border-white/5">
                        <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2"><MapPin size={14}/> Blora (Workshop)</h4>
                        <div>
                            <label className="text-[10px] text-gray-600 font-bold mb-1 block uppercase">Alamat Lengkap</label>
                            <Input value={config.address_blora || ''} onChange={(e) => setConfig({...config, address_blora: e.target.value})} className="text-xs bg-black/20" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 font-bold mb-1 block uppercase">Link Google Maps</label>
                            <Input value={config.map_blora_link || ''} onChange={(e) => setConfig({...config, map_blora_link: e.target.value})} className="text-[10px] bg-black/20" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-600 font-bold mb-1 block uppercase">Embed Map (Iframe)</label>
                            <TextArea value={config.map_blora_embed || ''} onChange={(e) => setConfig({...config, map_blora_embed: e.target.value})} className="h-16 text-[9px] font-mono bg-black/20" placeholder="<iframe src=...>" />
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
