
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
        <div className="space-y-8 animate-fade-in">
            {showMediaLib && (
                <MediaLibraryModal 
                    onSelect={handleMediaSelect} 
                    onClose={() => setShowMediaLib(false)} 
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
                {/* 1. KOLOM KIRI (35%) - ASET VISUAL VERTIKAL */}
                <div className="lg:col-span-3.5 space-y-6">
                    <SettingsSection title="Aset Visual" desc="Branding Kantor & Founder.">
                        <div className="flex flex-col gap-6 bg-brand-dark/30 p-4 rounded-xl border border-white/5">
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

                {/* 2. KOLOM KANAN (65%) - DATA BISNIS */}
                <div className="lg:col-span-6.5 space-y-6 flex flex-col">
                    {/* IDENTITAS & KONTAK */}
                    <div className="bg-brand-dark/30 p-5 rounded-xl border border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                           <Building size={12}/> Identitas Bisnis
                        </h4>
                        <div>
                            <label className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 block tracking-widest">Nama Resmi Perusahaan (PT)</label>
                            <Input value={config.company_legal_name || ''} onChange={(e) => setConfig({...config, company_legal_name: e.target.value})} placeholder="PT MESIN KASIR SOLO" className="bg-black/40 font-bold h-10" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 block flex items-center gap-1"><Smartphone size={10}/> WhatsApp Business</label>
                                <Input value={config.whatsapp_number || ''} onChange={(e) => setConfig({...config, whatsapp_number: e.target.value})} placeholder="628xxx" className="bg-black/40 h-10" />
                            </div>
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 block flex items-center gap-1"><Mail size={10}/> Email Support</label>
                                <Input value={config.email_address || ''} onChange={(e) => setConfig({...config, email_address: e.target.value})} placeholder="admin@kasirsolo.my.id" className="bg-black/40 h-10" />
                            </div>
                        </div>
                    </div>

                    {/* LEGALITAS */}
                    <div className="bg-brand-dark/30 p-5 rounded-xl border border-white/5 space-y-4">
                        <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-1">
                           <ShieldCheck size={12}/> Dokumen Hukum
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 block">NIB</label>
                                <Input value={config.nib_number || ''} onChange={(e) => setConfig({...config, nib_number: e.target.value})} placeholder="1234xxx" className="bg-black/40 h-9 text-xs" />
                            </div>
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 block">SK AHU</label>
                                <Input value={config.ahu_number || ''} onChange={(e) => setConfig({...config, ahu_number: e.target.value})} placeholder="AHU-xxx" className="bg-black/40 h-9 text-xs" />
                            </div>
                            <div>
                                <label className="text-[9px] text-gray-500 font-bold uppercase mb-1.5 block">NPWP</label>
                                <Input value={config.npwp_number || ''} onChange={(e) => setConfig({...config, npwp_number: e.target.value})} placeholder="XX.XXX..." className="bg-black/40 h-9 text-xs" />
                            </div>
                        </div>
                    </div>

                    {/* REKENING - REWRITTEN TO BE SCALABLE LIST */}
                    <div className="bg-brand-dark/30 p-5 rounded-xl border border-white/5 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.2em] flex items-center gap-2">
                               <CreditCard size={12}/> Rekening Perusahaan
                            </h4>
                            <button className="text-[9px] font-black text-gray-600 hover:text-green-500 flex items-center gap-1 transition-colors">
                                <Plus size={10}/> TAMBAH LAGI
                            </button>
                        </div>
                        
                        <div className="space-y-3">
                            {/* Card Rekening 1 (Current Active) */}
                            <div className="bg-black/40 p-4 rounded-xl border border-green-500/20 relative group">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                                    <div className="md:col-span-4">
                                        <label className="text-[8px] text-gray-600 font-black uppercase mb-1 block">Nama Bank</label>
                                        <Input value={config.bank_name || ''} onChange={(e) => setConfig({...config, bank_name: e.target.value})} placeholder="BNC, BCA..." className="bg-brand-dark h-9 text-xs font-bold" />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="text-[8px] text-gray-600 font-black uppercase mb-1 block">No. Rekening</label>
                                        <Input value={config.bank_account_number || ''} onChange={(e) => setConfig({...config, bank_account_number: e.target.value})} placeholder="5859xxx" className="bg-brand-dark h-9 text-xs font-mono" />
                                    </div>
                                    <div className="md:col-span-4">
                                        <label className="text-[8px] text-gray-600 font-black uppercase mb-1 block">Atas Nama (A/N)</label>
                                        <Input value={config.bank_account_name || ''} onChange={(e) => setConfig({...config, bank_account_name: e.target.value})} placeholder="PT MKS" className="bg-brand-dark h-9 text-xs" />
                                    </div>
                                </div>
                                <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                     <button className="p-1.5 bg-red-600 text-white rounded-lg shadow-lg"><Trash2 size={12}/></button>
                                </div>
                            </div>

                            {/* Placeholder for future accounts */}
                            <div className="border border-dashed border-white/5 rounded-xl p-3 flex items-center justify-center">
                                <p className="text-[9px] text-gray-700 font-black uppercase tracking-widest italic">Seksi ini siap menampung lebih dari 1 rekening.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOKASI FISIK (BAWAH) */}
            <div className="h-px bg-white/5 w-full"></div>
            <SettingsSection title="Lokasi Markas" desc="Titik koordinat dan alamat fisik kantor.">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* SOLO */}
                    <div className="space-y-3 p-4 bg-brand-dark/30 rounded-xl border border-white/5">
                        <h4 className="text-brand-orange font-bold text-[10px] uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center gap-2"><MapPin size={12}/> Solo Raya (HQ)</h4>
                        <div>
                            <label className="text-[8px] text-gray-600 font-black mb-1 block uppercase">Alamat Lengkap</label>
                            <Input value={config.address_solo || ''} onChange={(e) => setConfig({...config, address_solo: e.target.value})} className="text-xs bg-black/20 h-9" />
                        </div>
                        <div>
                            <label className="text-[8px] text-gray-600 font-black mb-1 block uppercase">Link Google Maps</label>
                            <Input value={config.map_solo_link || ''} onChange={(e) => setConfig({...config, map_solo_link: e.target.value})} className="text-[9px] bg-black/20 h-8" />
                        </div>
                        <div>
                            <label className="text-[8px] text-gray-600 font-black mb-1 block uppercase">Embed Map (Iframe)</label>
                            <TextArea value={config.map_solo_embed || ''} onChange={(e) => setConfig({...config, map_solo_embed: e.target.value})} className="h-14 text-[8px] font-mono bg-black/20" placeholder="<iframe src=...>" />
                        </div>
                    </div>

                    {/* BLORA */}
                    <div className="space-y-3 p-4 bg-brand-dark/30 rounded-xl border border-white/5">
                        <h4 className="text-blue-400 font-bold text-[10px] uppercase tracking-widest border-b border-white/10 pb-1.5 flex items-center gap-2"><MapPin size={12}/> Blora (Workshop)</h4>
                        <div>
                            <label className="text-[8px] text-gray-600 font-black mb-1 block uppercase">Alamat Lengkap</label>
                            <Input value={config.address_blora || ''} onChange={(e) => setConfig({...config, address_blora: e.target.value})} className="text-xs bg-black/20 h-9" />
                        </div>
                        <div>
                            <label className="text-[8px] text-gray-600 font-black mb-1 block uppercase">Link Google Maps</label>
                            <Input value={config.map_blora_link || ''} onChange={(e) => setConfig({...config, map_blora_link: e.target.value})} className="text-[9px] bg-black/20 h-8" />
                        </div>
                        <div>
                            <label className="text-[8px] text-gray-600 font-black mb-1 block uppercase">Embed Map (Iframe)</label>
                            <TextArea value={config.map_blora_embed || ''} onChange={(e) => setConfig({...config, map_blora_embed: e.target.value})} className="h-14 text-[8px] font-mono bg-black/20" placeholder="<iframe src=...>" />
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
