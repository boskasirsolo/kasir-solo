
import React from 'react';
import { TabProps } from './types';
import { SettingsTabWrapper, SettingsHeader, SettingsCard, SettingsField, SettingsAiBox, HeroCheatSheet } from './ui-atoms';
import { TextArea } from '../ui';
import { Layout } from 'lucide-react';

export const TabGeneral = ({ config, setConfig, state, actions }: TabProps) => (
    <SettingsTabWrapper>
        <SettingsHeader title="Hero Experience" desc="Atur aura ruko digital lo di halaman paling depan." />
        
        <div className="grid lg:grid-cols-12 gap-8">
            {/* SISI KIRI: TOOLS */}
            <div className="lg:col-span-4 space-y-6">
                <HeroCheatSheet />
                <div className="bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10">
                    <h5 className="text-[9px] font-black text-blue-400 uppercase mb-2 flex items-center gap-1.5"><Layout size={12}/> Info Layout</h5>
                    <p className="text-[10px] text-gray-500 leading-relaxed italic">
                        Perubahan di sini bakal langsung ngerubah "First Impression" calon pembeli. Pake kata-kata yang provokatif tapi jujur.
                    </p>
                </div>
            </div>

            {/* SISI KANAN: EDITOR */}
            <div className="lg:col-span-8 space-y-6">
                <SettingsAiBox 
                    context={state.magicContext} 
                    setContext={actions.setMagicContext} 
                    onGenerate={actions.generateHeroContent} 
                    isGenerating={state.isGenerating} 
                />

                <SettingsCard>
                    <SettingsField label="Judul Utama (H1)" helper="Gunakan {} untuk aksen orange, [] untuk gradasi.">
                        <TextArea 
                            value={config.hero_title} 
                            onChange={(e: any) => setConfig({...config, hero_title: e.target.value})} 
                            className="h-32 font-bold bg-black/40 text-sm"
                            placeholder="Contoh: AKHIRI ERA {BONCOS}"
                        />
                    </SettingsField>

                    <SettingsField label="Sub-Headline (Penjelasan Singkat)">
                        <TextArea 
                            value={config.hero_subtitle} 
                            onChange={(e: any) => setConfig({...config, hero_subtitle: e.target.value})} 
                            className="h-24 bg-black/40 text-xs"
                        />
                    </SettingsField>
                </SettingsCard>
            </div>
        </div>
    </SettingsTabWrapper>
);
