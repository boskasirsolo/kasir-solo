
import React, { useState } from 'react';
import { TabProps } from './types';
import { SettingsSection, ImageUploader, AIGeneratorBox } from './ui-atoms';
import { Input, TextArea } from '../ui';
import { MediaLibraryModal } from '../admin/media-library';

export const TabGeneral = ({ config, setConfig, state, actions }: TabProps) => {
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
        <div className="space-y-8 animate-fade-in relative">
            {showMediaLib && (
                <MediaLibraryModal 
                    onSelect={handleMediaSelect} 
                    onClose={() => setShowMediaLib(false)} 
                />
            )}

            {/* HERO SECTION */}
            <SettingsSection title="Tampilan Utama (Hero)" desc="Konten yang muncul paling depan di website.">
                <AIGeneratorBox 
                    context={state.magicContext} 
                    setContext={actions.setMagicContext} 
                    onGenerate={actions.generateHeroContent} 
                    isGenerating={state.isGenerating} 
                />
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Judul Besar (H1)</label>
                        <Input value={config.hero_title} onChange={(e) => setConfig({...config, hero_title: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Sub-Judul</label>
                        <TextArea value={config.hero_subtitle} onChange={(e) => setConfig({...config, hero_subtitle: e.target.value})} className="h-24" />
                    </div>
                </div>
            </SettingsSection>

            {/* IMAGES */}
            <SettingsSection title="Aset Visual">
                <div className="grid md:grid-cols-2 gap-6">
                    <ImageUploader 
                        label="Foto Kantor (Landscape)" 
                        previewUrl={state.aboutImagePreview} 
                        onSelect={(f) => actions.handleImageSelect('about', f)}
                        onGalleryPick={() => openMediaLib('about')}
                        helperText="Muncul di halaman About & Contact."
                    />
                    <ImageUploader 
                        label="Foto Founder (Portrait)" 
                        previewUrl={state.founderImagePreview} 
                        onSelect={(f) => actions.handleImageSelect('founder', f)}
                        onGalleryPick={() => openMediaLib('founder')}
                        aspect="portrait"
                        helperText="Muncul di section 'Jujur-jujuran'."
                    />
                </div>
            </SettingsSection>

            {/* LEGALITY */}
            <SettingsSection title="Legalitas Perusahaan">
                <div className="bg-brand-dark/30 p-4 rounded-xl border border-white/5 space-y-4">
                    <div className="md:col-span-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">Nama Resmi (PT)</label>
                        <Input value={config.company_legal_name || ''} onChange={(e) => setConfig({...config, company_legal_name: e.target.value})} placeholder="PT MESIN KASIR SOLO" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">NIB</label>
                            <Input value={config.nib_number || ''} onChange={(e) => setConfig({...config, nib_number: e.target.value})} placeholder="1234xxx" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">SK Kemenkumham (AHU)</label>
                            <Input value={config.ahu_number || ''} onChange={(e) => setConfig({...config, ahu_number: e.target.value})} placeholder="AHU-xxx" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-1 block">NPWP</label>
                            <Input value={config.npwp_number || ''} onChange={(e) => setConfig({...config, npwp_number: e.target.value})} placeholder="XX.XXX..." />
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
