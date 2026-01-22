
import React, { useState } from 'react';
import { TabProps } from './types';
import { SettingsSection, ImageUploader, AIGeneratorBox, HeroCheatSheet } from './ui-atoms';
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
        <div className="space-y-12 animate-fade-in relative">
            {showMediaLib && (
                <MediaLibraryModal 
                    onSelect={handleMediaSelect} 
                    onClose={() => setShowMediaLib(false)} 
                />
            )}

            {/* HERO SECTION - GRID 25/75 */}
            <div className="space-y-6">
                <div className="border-b border-white/5 pb-2 mb-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Tampilan Utama (Hero)</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* COL 1: CHEAT SHEET (25%) */}
                    <div className="lg:col-span-3">
                        <HeroCheatSheet />
                    </div>

                    {/* COL 2: GENERATOR & INPUTS (75%) */}
                    <div className="lg:col-span-9 space-y-8">
                        <AIGeneratorBox 
                            context={state.magicContext} 
                            setContext={actions.setMagicContext} 
                            onGenerate={actions.generateHeroContent} 
                            isGenerating={state.isGenerating} 
                        />
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Judul Besar (H1)</label>
                                <TextArea 
                                    value={config.hero_title} 
                                    onChange={(e) => setConfig({...config, hero_title: e.target.value})} 
                                    placeholder="Gunakan {} untuk Orange, [] untuk Gradasi, dan Enter untuk baris baru."
                                    className="h-32 font-bold bg-black/40 border-white/10"
                                />
                                <p className="text-[9px] text-gray-600 mt-2 italic">Contoh: PUSAT [MESIN KASIR]\nDI {"{SOLO RAYA}"}</p>
                            </div>
                            <div>
                                <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Sub-Judul</label>
                                <TextArea 
                                    value={config.hero_subtitle} 
                                    onChange={(e) => setConfig({...config, hero_subtitle: e.target.value})} 
                                    className="h-24 bg-black/40 border-white/10" 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* IMAGES */}
            <SettingsSection title="Aset Visual">
                <div className="grid md:grid-cols-2 gap-8">
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
                <div className="bg-brand-dark/30 p-6 rounded-2xl border border-white/5 space-y-6">
                    <div className="md:col-span-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">Nama Resmi (PT)</label>
                        <Input value={config.company_legal_name || ''} onChange={(e) => setConfig({...config, company_legal_name: e.target.value})} placeholder="PT MESIN KASIR SOLO" className="bg-black/40" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">NIB</label>
                            <Input value={config.nib_number || ''} onChange={(e) => setConfig({...config, nib_number: e.target.value})} placeholder="1234xxx" className="bg-black/40" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">SK Kemenkumham (AHU)</label>
                            <Input value={config.ahu_number || ''} onChange={(e) => setConfig({...config, ahu_number: e.target.value})} placeholder="AHU-xxx" className="bg-black/40" />
                        </div>
                        <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase mb-2 block tracking-widest">NPWP</label>
                            <Input value={config.npwp_number || ''} onChange={(e) => setConfig({...config, npwp_number: e.target.value})} placeholder="XX.XXX..." className="bg-black/40" />
                        </div>
                    </div>
                </div>
            </SettingsSection>
        </div>
    );
};
