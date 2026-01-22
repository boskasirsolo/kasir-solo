
import React, { useState } from 'react';
import { TabProps } from './types';
import { SettingsSection, ImageUploader } from './ui-atoms';
import { Input, TextArea, Button } from '../ui';
import { Smartphone, Mail, Building, ShieldCheck, MapPin, CreditCard, Landmark, UserCheck, Plus, Trash2 } from 'lucide-react';
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
        <div className="space-y-6 animate-fade-in">
            {showMediaLib && (
                <MediaLibraryModal 
                    onSelect={handleMediaSelect} 
                    onClose={() => setShowMediaLib(false)} 
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* 1. KOLOM KIRI (33%) - ASET VISUAL */}
                <div className="lg:col-span-4 space-y-4">
                    <SettingsSection title="Visual Branding">
                        <div className="bg-brand-dark/30 p-3 rounded-xl border border-white/5 space-y-5">
                            <ImageUploader 
                                label="Foto Kantor" 
                                previewUrl={state.aboutImagePreview} 
                                onSelect={(f) => actions.handleImageSelect('about', f)}
                                onGalleryPick={() => openMediaLib('about')}
                                helperText="Ratio: Landscape"
                            />
                            <div className="h-px bg-white/5 w-full"></div>
                            <ImageUploader 
                                label="Foto Founder" 
                                previewUrl={state.founderImagePreview} 
                                onSelect={(f) => actions.handleImageSelect('founder', f)}
                                onGalleryPick={() => openMediaLib('founder')}
                                aspect="portrait"
                                helperText="Ratio: Portrait"
                            />
                        </div>
                    </SettingsSection>
                </div>

                {/* 2. KOLOM KANAN (67%) - DATA FORM */}
                <div className="lg:col-span-8 space-y-4">
                    {/* IDENTITAS */}
                    <div className="bg-brand-dark/30 p-4 rounded-xl border border-white/5 space-y-3">
                        <h4 className="text-[9px] font-black text-brand-orange uppercase tracking-[0.2em] flex items-center gap-1.5">
                           <Building size={12}/> Identitas & Kontak
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="md:col-span-2">
                                <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Nama PT / Bisnis</label>
                                <Input value={config.company_legal_name || ''} onChange={(e) => setConfig({...config, company_legal_name: e.target.value})} className="bg-black/40 h-8 text-xs font-bold" />
                            </div>
                            <div>
                                <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">WhatsApp</label>
                                <Input value={config.whatsapp_number || ''} onChange={(e) => setConfig({...config, whatsapp_number: e.target.value})} className="bg-black/40 h-8 text-xs" />
                            </div>
                            <div>
                                <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">Email</label>
                                <Input value={config.email_address || ''} onChange={(e) => setConfig({...config, email_address: e.target.value})} className="bg-black/40 h-8 text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* LEGALITAS */}
                    <div className="bg-brand-dark/30 p-4 rounded-xl border border-white/5 space-y-3">
                        <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                           <ShieldCheck size={12}/> Legalitas Resmi
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">NIB</label>
                                <Input value={config.nib_number || ''} onChange={(e) => setConfig({...config, nib_number: e.target.value})} className="bg-black/40 h-8 text-[10px]" />
                            </div>
                            <div>
                                <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">SK AHU</label>
                                <Input value={config.ahu_number || ''} onChange={(e) => setConfig({...config, ahu_number: e.target.value})} className="bg-black/40 h-8 text-[10px]" />
                            </div>
                            <div>
                                <label className="text-[8px] text-gray-500 font-black uppercase mb-1 block">NPWP</label>
                                <Input value={config.npwp_number || ''} onChange={(e) => setConfig({...config, npwp_number: e.target.value})} className="bg-black/40 h-8 text-[10px]" />
                            </div>
                        </div>
                    </div>

                    {/* REKENING (FUTURE PROOF LIST) */}
                    <div className="bg-brand-dark/30 p-4 rounded-xl border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-1.5">
                               <CreditCard size={12}/> Daftar Rekening
                            </h4>
                            <button className="text-[8px] font-black text-gray-600 hover:text-green-500 flex items-center gap-1 transition-colors">
                                <Plus size={10}/> TAMBAH BANK
                            </button>
                        </div>
                        
                        <div className="space-y-2">
                            {/* Rekening Utama */}
                            <div className="bg-black/40 p-3 rounded-lg border border-green-500/10 grid grid-cols-12 gap-3 relative group">
                                <div className="col-span-3">
                                    <label className="text-[7px] text-gray-600 font-black uppercase mb-0.5 block">Bank</label>
                                    <Input value={config.bank_name || ''} onChange={(e) => setConfig({...config, bank_name: e.target.value})} className="bg-brand-dark h-7 text-[10px] font-bold px-2" />
                                </div>
                                <div className="col-span-5">
                                    <label className="text-[7px] text-gray-600 font-black uppercase mb-0.5 block">No. Rekening</label>
                                    <Input value={config.bank_account_number || ''} onChange={(e) => setConfig({...config, bank_account_number: e.target.value})} className="bg-brand-dark h-7 text-[10px] font-mono px-2" />
                                </div>
                                <div className="col-span-4">
                                    <label className="text-[7px] text-gray-600 font-black uppercase mb-0.5 block">Atas Nama</label>
                                    <Input value={config.bank_account_name || ''} onChange={(e) => setConfig({...config, bank_account_name: e.target.value})} className="bg-brand-dark h-7 text-[10px] px-2" />
                                </div>
                            </div>
                            <p className="text-[7px] text-gray-700 italic font-bold">Seksi ini siap di-loop jika data rekening bertambah.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOKASI (FULL WIDTH) */}
            <div className="pt-4 border-t border-white/5">
                <SettingsSection title="Markas Operasional">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-brand-dark/30 rounded-xl border border-white/5 space-y-2">
                            <h4 className="text-brand-orange font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10}/> Solo (HQ)</h4>
                            <TextArea value={config.address_solo || ''} onChange={(e) => setConfig({...config, address_solo: e.target.value})} className="h-12 text-[10px] bg-black/20" placeholder="Alamat lengkap..." />
                            <Input value={config.map_solo_link || ''} onChange={(e) => setConfig({...config, map_solo_link: e.target.value})} className="text-[8px] bg-black/20 h-7" placeholder="Link G-Maps" />
                        </div>
                        <div className="p-3 bg-brand-dark/30 rounded-xl border border-white/5 space-y-2">
                            <h4 className="text-blue-400 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5"><MapPin size={10}/> Blora (Workshop)</h4>
                            <TextArea value={config.address_blora || ''} onChange={(e) => setConfig({...config, address_blora: e.target.value})} className="h-12 text-[10px] bg-black/20" placeholder="Alamat lengkap..." />
                            <Input value={config.map_blora_link || ''} onChange={(e) => setConfig({...config, map_blora_link: e.target.value})} className="text-[8px] bg-black/20 h-7" placeholder="Link G-Maps" />
                        </div>
                    </div>
                </SettingsSection>
            </div>
        </div>
    );
};
