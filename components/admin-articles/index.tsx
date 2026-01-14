
import React, { useState } from 'react';
import { Article, GalleryItem, SiteConfig } from '../../types';
import { Image as ImageIcon, Sparkles, Loader2, UploadCloud, Save, List, Settings, PenTool, Wand2 } from 'lucide-react';
import { useArticleManager } from './logic';
import { ListPanel } from './list-panel';
import { EditorPanel } from './editor-panel';
import { LiveEditor } from './live-editor';
import { Button, LoadingSpinner } from '../ui';

export const AdminArticles = ({ 
    articles, 
    setArticles,
    gallery,
    config
}: { 
    articles: Article[], 
    setArticles: (a: Article[]) => void,
    gallery: GalleryItem[],
    config: SiteConfig
}) => {
  const manager = useArticleManager(articles, setArticles, gallery, config);
  const { form, filterLogic, aiLogic, aiState, actions, personas, activePersonaId, setActivePersonaId, updatePersonaAvatar, activeMobilePane, setActiveMobilePane } = manager;
  const availablePillars = articles.filter(a => a.type === 'pillar');

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
          manager.setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
      }
  };

  return (
    /* FIX: Gunakan tinggi tetap (max-height) yang lebih bersahabat di mobile agar child panel bisa mengaktifkan overflow scroll */
    <div className="flex flex-col lg:flex-row h-[75vh] lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden lg:rounded-xl border-b shadow-2xl relative">
      
      {/* 1. LEFT PANEL: List (25%) */}
      <div className={`w-full lg:w-[25%] lg:block border-r-0 lg:border-r border-white/5 min-w-[280px] h-full ${activeMobilePane === 'LIST' ? 'block' : 'hidden'}`}>
         <ListPanel 
            articles={articles}
            logic={{ ...filterLogic, actions: { 
                handleEditClick: (a: Article) => { actions.handleEditClick(a); }, 
                deleteItem: actions.deleteItem,
                runClusterResearch: actions.runClusterResearch 
            } }}
            onReset={actions.resetForm}
            personaState={{ personas, activePersonaId, setActivePersonaId, updatePersonaAvatar }}
            form={form} 
         />
      </div>

      {/* 2. MIDDLE PANEL: Config (25%) */}
      <div className={`w-full lg:w-[25%] lg:block border-r-0 lg:border-r border-white/5 min-w-[300px] h-full ${activeMobilePane === 'CONFIG' ? 'block' : 'hidden'}`}>
         <EditorPanel 
            form={form}
            setForm={manager.setForm}
            loading={aiLogic.loading}
            aiState={{ ...aiState, keywords: aiLogic.keywords }}
            actions={{
                ...actions,
                runResearch: manager.actions.runResearch,
                runWrite: manager.actions.runWrite,
                runImage: manager.actions.runImage
            }}
            socialState={manager.socialState}
            availablePillars={availablePillars}
         />
      </div>

      {/* 3. RIGHT PANEL: Canvas (50%) */}
      <div className={`w-full lg:w-[50%] lg:flex h-full bg-black flex-col relative overflow-hidden ${activeMobilePane === 'WRITE' ? 'flex' : 'hidden'}`}>
         
         {/* Top Bar Editor */}
         <div className="p-4 md:p-6 border-b border-white/10 bg-brand-dark/50 backdrop-blur-sm z-10 sticky top-0 flex flex-col gap-4 md:gap-6 shrink-0">
            <input 
                type="text" 
                value={form.title}
                onChange={(e) => manager.setForm((p:any) => ({...p, title: e.target.value}))}
                placeholder="Judul Artikel..."
                className="w-full bg-transparent text-lg md:text-3xl font-display font-bold text-white placeholder-gray-600 outline-none"
            />

            <div className="flex flex-row gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                    <img src={form.authorAvatar || 'https://via.placeholder.com/30'} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                    <div className="hidden sm:block">
                        <p className="text-xs font-bold text-gray-300 leading-none">{form.author}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{form.readTime}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* NEW: AI IMAGE BUTTON */}
                    <button 
                        onClick={manager.actions.runImage}
                        disabled={aiLogic.loading.generatingImage || !form.title}
                        className={`p-2 h-9 rounded-lg transition-all border flex items-center justify-center ${aiLogic.loading.generatingImage ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-white/5 border-white/10 text-gray-400 hover:text-brand-orange hover:border-brand-orange/50'}`}
                        title="Generate AI Cover"
                    >
                        {aiLogic.loading.generatingImage ? <Loader2 size={18} className="animate-spin"/> : <ImageIcon size={18} />}
                    </button>

                    {form.content.length > 50 && (
                        <button 
                            onClick={manager.actions.runWrite} 
                            disabled={aiLogic.loading.generatingText}
                            className="p-2 h-9 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
                            title="Regenerate AI"
                        >
                            {aiLogic.loading.generatingText ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />}
                        </button>
                    )}
                    <Button onClick={actions.saveArticle} disabled={aiLogic.loading.uploading} className="px-5 py-2 h-9 text-xs shadow-neon whitespace-nowrap">
                        {aiLogic.loading.uploading ? <LoadingSpinner size={14}/> : <><Save size={14}/> Simpan</>}
                    </Button>
                </div>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative bg-black pb-24 lg:pb-8">
            <LiveEditor 
                content={form.content} 
                onChange={(newContent) => manager.setForm((prev: any) => ({ ...prev, content: newContent }))}
                onRegenerate={manager.actions.runWrite}
                isGenerating={aiLogic.loading.generatingText}
            />
            {(aiLogic.loading.generatingText || aiLogic.loading.generatingImage) && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-fade-in backdrop-blur-md">
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-orange blur-xl opacity-20 animate-pulse"></div>
                        <Loader2 size={48} className="text-brand-orange animate-spin mb-4 relative"/>
                    </div>
                    <p className="text-white font-bold text-lg animate-pulse text-center px-6 leading-relaxed">
                        {aiLogic.loading.progressMessage || 'Gemini lagi mikir...'}
                    </p>
                </div>
            )}
         </div>

         {/* Meta Bar Bottom */}
         <div className="p-3 bg-brand-dark border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 px-4 shrink-0">
            <div className="flex gap-4">
                <span className="font-mono">{form.content.split(/\s+/).length} Kata</span>
                <span className="bg-white/5 px-2 rounded">{form.status.toUpperCase()}</span>
            </div>
            <div className="flex items-center gap-4">
                {form.imagePreview && (
                    <div className="w-8 h-8 rounded border border-white/10 overflow-hidden bg-black shrink-0">
                        <img src={form.imagePreview} className="w-full h-full object-cover" />
                    </div>
                )}
                <label className="text-brand-orange flex items-center gap-1 cursor-pointer hover:text-white">
                    <ImageIcon size={14}/> Cover
                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
            </div>
         </div>
      </div>

      {/* MOBILE FLOATING NAV TAB */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-card/90 backdrop-blur-xl border-t border-white/10 z-[100] flex justify-around items-center px-6">
          <button onClick={() => setActiveMobilePane('LIST')} className={`flex flex-col items-center gap-1 transition-all ${activeMobilePane === 'LIST' ? 'text-brand-orange scale-110' : 'text-gray-500'}`}>
              <List size={20}/>
              <span className="text-[9px] font-bold uppercase">Arsip</span>
          </button>
          <button onClick={() => setActiveMobilePane('CONFIG')} className={`flex flex-col items-center gap-1 transition-all ${activeMobilePane === 'CONFIG' ? 'text-brand-orange scale-110' : 'text-gray-500'}`}>
              <Settings size={20}/>
              <span className="text-[9px] font-bold uppercase">Setting</span>
          </button>
          <button onClick={() => setActiveMobilePane('WRITE')} className={`flex flex-col items-center gap-1 transition-all ${activeMobilePane === 'WRITE' ? 'text-brand-orange scale-110' : 'text-gray-500'}`}>
              <PenTool size={20}/>
              <span className="text-[9px] font-bold uppercase">Nulis</span>
          </button>
      </div>

    </div>
  );
};
