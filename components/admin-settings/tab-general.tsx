
import React from 'react';
import { TabProps } from './types';
import { AIGeneratorBox, HeroCheatSheet } from './ui-atoms';
import { TextArea } from '../ui';

export const TabGeneral = ({ config, setConfig, state, actions }: TabProps) => {
    return (
        <div className="space-y-10 animate-fade-in relative">
            {/* HERO SECTION - GRID 25/75 */}
            <div className="space-y-6">
                <div className="border-b border-white/5 pb-2 mb-6">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Pengaturan Tampilan Utama</h3>
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
            
            <div className="p-4 bg-brand-orange/5 border border-brand-orange/20 rounded-xl">
                <p className="text-[10px] text-gray-400 italic">
                    *Gunakan area ini khusus untuk memoles kata-kata 'maut' di halaman depan website Anda.
                </p>
            </div>
        </div>
    );
};
