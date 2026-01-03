
import React, { useRef } from 'react';
import { useSocialStudio } from './logic';
import { SourceCard, CaptionEditor, PhoneMockup, PlatformIcon } from './ui-parts';
import { Product, Article, GalleryItem } from '../../types';
import { Search, UploadCloud, Rocket, Loader2, Image as ImageIcon } from 'lucide-react';
import { ActiveTab } from './types';

export const AdminSocialStudio = ({
    products, articles, gallery
}: {
    products: Product[], articles: Article[], gallery: GalleryItem[]
}) => {
    const { state, setters, actions } = useSocialStudio(products, articles, gallery);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- RENDER ---
    return (
        <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
            
            {/* PANE 1: SOURCE PICKER (25%) */}
            <div className="w-[25%] min-w-[280px] border-r border-white/5 bg-brand-dark/50 flex flex-col">
                {/* Header Filter */}
                <div className="p-4 border-b border-white/5 space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">1. Pilih Konten (Source)</h3>
                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                        {['all', 'product', 'service', 'article', 'gallery'].map(type => (
                            <button
                                key={type}
                                onClick={() => setters.setSelectedSourceType(type as any)}
                                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase whitespace-nowrap border transition-all ${
                                    state.selectedSourceType === type 
                                    ? 'bg-brand-orange text-white border-brand-orange' 
                                    : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input 
                            value={state.searchTerm}
                            onChange={(e) => setters.setSearchTerm(e.target.value)}
                            placeholder="Cari konten..."
                            className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                        />
                    </div>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                    {state.filteredItems.map(item => (
                        <SourceCard 
                            key={`${item.type}-${item.id}`} 
                            item={item} 
                            onClick={() => actions.selectItem(item)}
                            active={state.selectedItem?.id === item.id}
                        />
                    ))}
                </div>
            </div>

            {/* PANE 2: COMPOSER (45%) */}
            <div className="flex-1 border-r border-white/5 bg-brand-dark flex flex-col relative">
                {/* Overlay if no item selected */}
                {!state.selectedItem && (
                    <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
                        <p className="text-gray-500 text-sm">Pilih konten dari kiri untuk mulai meracik.</p>
                    </div>
                )}

                {/* Platform Toggles */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">2. The Composer</h3>
                    <div className="flex gap-2">
                        {['instagram', 'facebook', 'linkedin'].map(plat => (
                            <button
                                key={plat}
                                onClick={() => setters.setPlatforms(p => ({...p, [plat]: !p[plat as keyof typeof p]}))}
                                className={`p-2 rounded-lg border transition-all ${
                                    state.platforms[plat as keyof typeof state.platforms] 
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
                                    : 'bg-white/5 border-white/10 text-gray-600'
                                }`}
                                title={`Toggle ${plat}`}
                            >
                                <PlatformIcon id={plat} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                    
                    {/* Visual Canvas */}
                    <div className="bg-black/40 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
                        <div className="relative w-24 h-24 bg-black rounded-lg border border-white/10 overflow-hidden group shrink-0">
                            <img 
                                src={state.customImage || state.selectedItem?.image || ''} 
                                className="w-full h-full object-cover" 
                            />
                            <div 
                                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <UploadCloud size={20} className="text-white"/>
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && actions.handleImageUpload(e.target.files[0])}
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-white text-sm mb-1">{state.selectedItem?.title}</h4>
                            <p className="text-[10px] text-gray-500 line-clamp-2">{state.selectedItem?.description}</p>
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="mt-2 text-[10px] text-brand-orange hover:text-white flex items-center gap-1"
                            >
                                <ImageIcon size={12}/> Ganti Gambar
                            </button>
                        </div>
                    </div>

                    {/* Caption Tabs */}
                    <div className="flex flex-col h-[400px]">
                        <div className="flex gap-1 border-b border-white/10">
                            {['master', 'instagram', 'facebook', 'linkedin'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setters.setActiveTab(tab as ActiveTab)}
                                    className={`px-4 py-2 text-[10px] font-bold uppercase rounded-t-lg transition-all flex items-center gap-2 ${
                                        state.activeTab === tab 
                                        ? 'bg-brand-orange text-white' 
                                        : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                    }`}
                                >
                                    {tab === 'master' ? 'MASTER' : <PlatformIcon id={tab} size={12}/>}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 bg-black/20 p-2 rounded-b-xl border border-white/10 border-t-0">
                            <CaptionEditor 
                                value={state.captions[state.activeTab]}
                                onChange={(val) => setters.setCaptions(p => ({...p, [state.activeTab]: val}))}
                                onGenerate={() => actions.generateAICaption(state.activeTab as any)}
                                isGenerating={state.isLoading.ai}
                                platform={state.activeTab}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* PANE 3: PREVIEW (30%) */}
            <div className="w-[30%] min-w-[320px] bg-black/80 flex flex-col border-l border-white/5">
                <div className="p-4 border-b border-white/5 text-center">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">3. Preview & Launch</h3>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    {/* Toggle Preview View based on active tab or first active platform */}
                    <PhoneMockup 
                        image={state.customImage || state.selectedItem?.image || ''}
                        caption={state.captions[state.activeTab === 'master' ? 'instagram' : state.activeTab]} // Fallback to IG style for master preview
                        platform={state.activeTab === 'master' ? 'instagram' : state.activeTab}
                    />
                </div>

                <div className="p-6 border-t border-white/5 bg-brand-dark">
                    <button 
                        onClick={actions.broadcastPost}
                        disabled={state.isLoading.posting || !state.selectedItem}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold shadow-neon flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                        {state.isLoading.posting ? <Loader2 size={20} className="animate-spin"/> : <Rocket size={20} />}
                        BROADCAST SEKARANG
                    </button>
                    <p className="text-[10px] text-gray-500 text-center mt-3">
                        Akan diposting ke: {Object.entries(state.platforms).filter(([k,v])=>v).map(([k])=>k).join(', ')}
                    </p>
                </div>
            </div>

        </div>
    );
};
