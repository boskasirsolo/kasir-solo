
import React, { useState } from 'react';
import { TabProps } from './types';
import { SettingsSection, ImageUploader } from './ui-atoms';
import { Input, TextArea } from '../ui';
import { Smartphone, Mail, Building, ShieldCheck, MapPin, CreditCard, Landmark, UserCheck } from 'lucide-react';
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

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-10 items-start">
                {/* 1. KOLOM KIRI (30%) - ASET VISUAL VERTIKAL */}
                <div className="lg:col-span-3 space-y-8">
                    <SettingsSection title="Aset Visual" desc="Branding Kantor & Founder.">
                        <div className="flex flex-col gap-8 bg-brand-dark/30 p-5 rounded-2xl border border-white/5">
                            <ImageUploader 
                                label="Foto Kantor" 
                                previewUrl={state.aboutImagePreview} 
                                onSelect={(f) => actions.handleImageSelect('about', f)}
                                onGalleryPick={() => openMediaLib('about')}
                                helperText="Ratio: Landscape (Halaman About)"
                            />
                            <div className="h-px bg-white/5 w-full"></div>
                            <ImageUploader 
                                label="Foto Founder" 
                                previewUrl={state.founderImagePreview} 
                                onSelect={(f) => actions.handleImageSelect('founder', f)}
                                onGalleryPick={() => openMediaLib('founder')}
                                aspect="portrait"
                                helperText="Ratio: Portrait (Section Trust)"
                            />
                        </div>
                    </SettingsSection>
                </div>

                {/* 2. KOLOM KANAN (70%) - DATA BISNIS */}
                <div className="lg:col-span-7 space-y-8">
                    {/* IDENTITAS */}
                    <div className="bg-brand-dark/30 p-6 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                           <Building size={12}/> Identitas Bisnis
                        </h4>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Nama Resmi Perusahaan (PT)</label>
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

                    {/* LEGALITAS */}
                    <div className="bg-brand-dark/30 p-6 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                           <ShieldCheck size={12}/> Dokumen Hukum
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">NIB</label>
                                <Input value={config.nib_number || ''} onChange={(e) => setConfig({...config, nib_number: e.target.value})} placeholder="1234xxx" className="bg-black/40 text-xs" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">SK AHU</label>
                                <Input value={config.ahu_number || ''} onChange={(e) => setConfig({...config, ahu_number: e.target.value})} placeholder="AHU-xxx" className="bg-black/40 text-xs" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">NPWP</label>
                                <Input value={config.npwp_number || ''} onChange={(e) => setConfig({...config, npwp_number: e.target.value})} placeholder="XX.XXX..." className="bg-black/40 text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* REKENING */}
                    <div className="bg-brand-dark/30 p-6 rounded-2xl border border-white/5 space-y-6">
                        <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                           <CreditCard size={12}/> Rekening Perusahaan
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><Landmark size={10}/> Bank</label>
                                <Input value={config.bank_name || ''} onChange={(e) => setConfig({...config, bank_name: e.target.value})} placeholder="BNC, BCA, Mandiri..." className="bg-black/40 text-xs font-bold" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block">Nomor Rekening</label>
                                <Input value={config.bank_account_number || ''} onChange={(e) => setConfig({...config, bank_account_number: e.target.value})} placeholder="5859xxx" className="bg-black/40 text-xs font-mono" />
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block flex items-center gap-1"><UserCheck size={10}/> Atas Nama</label>
                                <Input value={config.bank_account_name || ''} onChange={(e) => setConfig({...config, bank_account_name: e.target.value})} placeholder="PT MESIN KASIR SOLO" className="bg-black/40 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. LOKASI FISIK (BAWAH, TETAP) */}
            <div className="h-px bg-white/5 w-full"></div>
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
