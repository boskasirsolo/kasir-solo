
import React, { useState } from 'react';
import { TabProps } from './types';
import { SettingsTabWrapper, SettingsHeader, SettingsCard, SettingsField, SettingsImageUploader } from './ui-atoms';
import { Input, TextArea } from '../ui';
// FIX: Added Image as ImageIcon to lucide-react imports
import { Building, ShieldCheck, CreditCard, MapPin, Code, UserCheck, Mail, Phone, Image as ImageIcon } from 'lucide-react';
import { MediaLibraryModal } from '../admin/media-library';

export const TabContact = ({ config, setConfig, state, actions }: TabProps) => {
    const [showMediaLib, setShowMediaLib] = useState(false);
    const [targetField, setTargetField] = useState<'about' | 'founder'>('about');

    const openMediaLib = (target: 'about' | 'founder') => {
        setTargetField(target);
        setShowMediaLib(true);
    };

    return (
        <SettingsTabWrapper>
            {showMediaLib && (
                <MediaLibraryModal 
                    onSelect={(url) => { actions.handleUrlSelect(targetField, url); setShowMediaLib(false); }} 
                    onClose={() => setShowMediaLib(false)} 
                />
            )}

            <SettingsHeader title="Profil Bisnis & Operasional" desc="Lengkapi identitas biar ruko lo dipercaya Google & Manusia." />

            <div className="grid lg:grid-cols-12 gap-8">
                {/* KOLOM 1: VISUAL (33%) */}
                <div className="lg:col-span-4 space-y-6">
                    <SettingsCard title="Wajah Bisnis" icon={ImageIcon}>
                        <SettingsImageUploader 
                            label="Foto Markas (Landscape)" 
                            previewUrl={state.aboutImagePreview} 
                            onSelect={(f:File) => actions.handleImageSelect('about', f)}
                            onGalleryPick={() => openMediaLib('about')}
                        />
                        <div className="h-px bg-white/5 w-full"></div>
                        <SettingsImageUploader 
                            label="Foto Founder (Portrait)" 
                            previewUrl={state.founderImagePreview} 
                            onSelect={(f:File) => actions.handleImageSelect('founder', f)}
                            onGalleryPick={() => openMediaLib('founder')}
                            aspect="portrait"
                        />
                    </SettingsCard>
                </div>

                {/* KOLOM 2: DATA & FORM (67%) */}
                <div className="lg:col-span-8 space-y-6">
                    {/* SEKSI: IDENTITAS */}
                    <SettingsCard title="Kontak Utama" icon={Building} color="text-brand-orange">
                        <SettingsField label="Nama Legal PT / Bisnis">
                            <Input value={config.company_legal_name || ''} onChange={(e: any) => setConfig({...config, company_legal_name: e.target.value})} className="bg-black/40 font-bold" />
                        </SettingsField>
                        <div className="grid grid-cols-2 gap-4">
                            <SettingsField label="No. WhatsApp">
                                <Input value={config.whatsapp_number || ''} onChange={(e: any) => setConfig({...config, whatsapp_number: e.target.value})} className="bg-black/40" />
                            </SettingsField>
                            <SettingsField label="Email Resmi">
                                <Input value={config.email_address || ''} onChange={(e: any) => setConfig({...config, email_address: e.target.value})} className="bg-black/40" />
                            </SettingsField>
                        </div>
                    </SettingsCard>

                    {/* SEKSI: LEGALITAS */}
                    <SettingsCard title="Sertifikasi & Pajak" icon={ShieldCheck} color="text-blue-400">
                        <div className="grid grid-cols-3 gap-3">
                            <SettingsField label="NIB">
                                <Input value={config.nib_number || ''} onChange={(e: any) => setConfig({...config, nib_number: e.target.value})} className="bg-black/40 text-[10px]" />
                            </SettingsField>
                            <SettingsField label="SK AHU">
                                <Input value={config.ahu_number || ''} onChange={(e: any) => setConfig({...config, ahu_number: e.target.value})} className="bg-black/40 text-[10px]" />
                            </SettingsField>
                            <SettingsField label="NPWP">
                                <Input value={config.npwp_number || ''} onChange={(e: any) => setConfig({...config, npwp_number: e.target.value})} className="bg-black/40 text-[10px]" />
                            </SettingsField>
                        </div>
                    </SettingsCard>

                    {/* SEKSI: BANK */}
                    <SettingsCard title="Data Rekening" icon={CreditCard} color="text-green-500">
                        <div className="bg-black/40 p-4 rounded-xl border border-green-500/10 grid grid-cols-12 gap-4">
                            <div className="col-span-3">
                                <SettingsField label="Bank"><Input value={config.bank_name || ''} onChange={(e: any) => setConfig({...config, bank_name: e.target.value})} className="bg-brand-dark h-8 text-xs font-bold" /></SettingsField>
                            </div>
                            <div className="col-span-5">
                                <SettingsField label="No. Rekening"><Input value={config.bank_account_number || ''} onChange={(e: any) => setConfig({...config, bank_account_number: e.target.value})} className="bg-brand-dark h-8 text-xs font-mono" /></SettingsField>
                            </div>
                            <div className="col-span-4">
                                <SettingsField label="Atas Nama"><Input value={config.bank_account_name || ''} onChange={(e: any) => setConfig({...config, bank_account_name: e.target.value})} className="bg-brand-dark h-8 text-xs" /></SettingsField>
                            </div>
                        </div>
                    </SettingsCard>
                </div>
            </div>

            {/* SEKSI: LOKASI (FULL WIDTH) */}
            <div className="pt-8 border-t border-white/5 grid md:grid-cols-2 gap-8">
                <SettingsCard title="Headquarters (Solo)" icon={MapPin}>
                    <SettingsField label="Alamat Lengkap">
                        <TextArea value={config.address_solo || ''} onChange={(e: any) => setConfig({...config, address_solo: e.target.value})} className="h-20 bg-black/20 text-xs" />
                    </SettingsField>
                    <SettingsField label="Iframe Google Maps" helper="Paste kode <iframe> di sini.">
                        <TextArea value={config.map_solo_embed || ''} onChange={(e: any) => setConfig({...config, map_solo_embed: e.target.value})} className="h-24 bg-black/40 font-mono text-[9px]" />
                    </SettingsField>
                </SettingsCard>

                <SettingsCard title="Workshop (Blora)" icon={MapPin} color="text-blue-400">
                    <SettingsField label="Alamat Lengkap">
                        <TextArea value={config.address_blora || ''} onChange={(e: any) => setConfig({...config, address_blora: e.target.value})} className="h-20 bg-black/20 text-xs" />
                    </SettingsField>
                    <SettingsField label="Iframe Google Maps" helper="Paste kode <iframe> di sini.">
                        <TextArea value={config.map_blora_embed || ''} onChange={(e: any) => setConfig({...config, map_blora_embed: e.target.value})} className="h-24 bg-black/40 font-mono text-[9px]" />
                    </SettingsField>
                </SettingsCard>
            </div>
        </SettingsTabWrapper>
    );
};
