
import React, { useState } from 'react';
import { Article, GalleryItem, SiteConfig } from '../../types';
import { Image as ImageIcon, Sparkles, Loader2, UploadCloud, Save } from 'lucide-react';
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
  // Pass config (with timezone) to the manager hook
  const manager = useArticleManager(articles, setArticles, gallery, config);
  const { form, filterLogic, aiLogic, aiState, actions, personas, activePersonaId, setActivePersonaId, updatePersonaAvatar } = manager;
  const availablePillars = articles.filter(a => a.type === 'pillar');

  // Handle uploading cover image directly from right panel
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
          manager.setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-auto lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
      
      {/* 1. LEFT PANEL: List & Filter & Persona (25%) */}
      <div className="w-full lg:w-[25%] h-[500px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 min-w-[280px]">
         <ListPanel 
            articles={articles}
            logic={{ ...filterLogic, actions: { 
                handleEditClick: actions.handleEditClick, 
                deleteItem: actions.deleteItem,
                runClusterResearch: actions.runClusterResearch // NEW
            } }}
            onReset={actions.resetForm}
            personaState={{ personas, activePersonaId, setActivePersonaId, updatePersonaAvatar }}
            form={form} 
         />
      </div>

      {/* 2. MIDDLE PANEL: Command Center (25%) */}
      <div className="w-full lg:w-[25%] h-[400px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 min-w-[300px]">
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

      {/* 3. RIGHT PANEL: The Canvas & Publishing (50%) */}
      <div className="w-full lg:w-[50%] h-[700px] lg:h-full bg-black flex flex-col relative overflow-hidden">
         
         {/* Top Bar: Title & Meta Controls */}
         <div className="p-4 md:p-6 border-b border-white/5 bg-brand-dark/50 backdrop-blur-sm z-10 sticky top-0 flex flex-col gap-4 md:gap-6 shrink-0">
            
            {/* Title Editor */}
            <input 
                type="text" 
                value={form.title}
                onChange={(e) => manager.setForm((p:any) => ({...p, title: e.target.value}))}
                placeholder="Judul Artikel (H1)..."
                className="w-full bg-transparent text-xl md:text-3xl font-display font-bold text-white placeholder-gray-600 outline-none"
            />

            {/* Meta Row: Image & Author */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                
                {/* Cover Image Control */}
                <div className="group relative w-32 h-20 bg-black/40 rounded-lg overflow-hidden border border-white/10 shrink-0 hidden sm:block">
                    {form.imagePreview ? (
                        <img src={form.imagePreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                            <ImageIcon size={16} />
                            <span className="text-[8px] uppercase mt-1">Cover</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                        <button onClick={actions.runImage} disabled={aiLogic.loading.generatingImage} className="text-[8px] font-bold text-blue-400 hover:text-white flex items-center gap-1">
                            {aiLogic.loading.generatingImage ? <Loader2 size={10} className="animate-spin"/> : <><Sparkles size={10}/> AI Gen</>}
                        </button>
                        <label className="text-[8px] font-bold text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer">
                            <UploadCloud size={10}/> Upload
                            <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        </label>
                    </div>
                </div>

                {/* Author Info */}
                <div className="flex-1 w-full sm:w-auto">
                    <div className="flex items-center gap-2 mb-1">
                        <img src={form.authorAvatar || 'https://via.placeholder.com/30'} className="w-6 h-6 rounded-full border border-white/20 object-cover" />
                        <span className="text-sm font-bold text-gray-300">{form.author}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500 w-full">
                        {/* EDITABLE PUBLISH DATE */}
                        <input 
                            value={form.date} 
                            onChange={(e) => manager.setForm((p:any) => ({...p, date: e.target.value}))}
                            placeholder="Tanggal Publish"
                            className="bg-transparent border-b border-white/10 w-24 focus:border-brand-orange outline-none text-gray-400 hover:text-white transition-colors"
                        />
                        <span>•</span>
                        <input 
                            value={form.readTime} 
                            onChange={e => manager.setForm((p:any) => ({...p, readTime: e.target.value}))}
                            className="bg-transparent border-b border-white/10 w-16 focus:border-brand-orange outline-none text-gray-400 hover:text-white transition-colors"
                        />
                    </div>
                </div>

                {/* Publish Controls (Top Right) */}
                <div className="flex flex-col gap-2 items-end w-full sm:w-auto">
                    
                    <div className="flex items-center gap-2 justify-end w-full">
                        {/* SCHEDULE INPUT */}
                        {form.status === 'scheduled' && (
                            <input 
                                type="datetime-local" 
                                value={form.scheduled_for} 
                                onChange={(e) => manager.setForm((p:any) => ({...p, scheduled_for: e.target.value}))}
                                className="bg-black/40 text-[10px] text-gray-300 border border-white/10 rounded px-2 py-1.5 outline-none focus:border-brand-orange w-32 h-[30px]"
                            />
                        )}

                        <div className="flex items-center bg-black/40 rounded-lg p-1 border border-white/10 h-[30px]">
                            <select 
                                value={form.status} 
                                onChange={(e) => manager.setForm((p:any) => ({...p, status: e.target.value}))} 
                                className={`bg-transparent text-[10px] font-bold uppercase outline-none px-2 rounded cursor-pointer h-full ${
                                    form.status === 'published' ? 'text-green-400' : 
                                    form.status === 'scheduled' ? 'text-purple-400' : 'text-gray-400'
                                }`}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end w-full">
                        {/* REGENERATE BUTTON (AI) */}
                        {form.content.length > 50 && (
                            <button 
                                onClick={manager.actions.runWrite} 
                                disabled={aiLogic.loading.generatingText}
                                className="px-3 py-2 h-9 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1 shadow-lg"
                                title="Regenerate Content"
                            >
                                {aiLogic.loading.generatingText ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14} />}
                            </button>
                        )}

                        <Button onClick={actions.saveArticle} disabled={aiLogic.loading.uploading} className="px-6 py-2 h-9 text-xs shadow-neon">
                            {aiLogic.loading.uploading ? <LoadingSpinner size={14}/> : <><Save size={14}/> Simpan</>}
                        </Button>
                    </div>
                </div>
            </div>
         </div>
         
         {/* Live Editor Area */}
         <div id="live-editor-area" className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative">
            <LiveEditor 
                content={form.content} 
                onChange={(newContent) => manager.setForm((prev: any) => ({ ...prev, content: newContent }))}
                onRegenerate={manager.actions.runWrite}
                isGenerating={aiLogic.loading.generatingText}
            />
            {/* PROGRESS OVERLAY */}
            {aiLogic.loading.generatingText && aiLogic.loading.progressMessage && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 animate-fade-in backdrop-blur-sm">
                    <Loader2 size={40} className="text-brand-orange animate-spin mb-4"/>
                    <p className="text-white font-bold text-lg animate-pulse text-center px-4">{aiLogic.loading.progressMessage}</p>
                    <p className="text-gray-500 text-xs mt-2">Generating deep long-form content...</p>
                </div>
            )}
         </div>

         {/* Bottom Status Bar */}
         <div className="p-2 bg-brand-dark border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 px-4 shrink-0">
            <div className="flex gap-4">
                <span>Words: {form.content.split(/\s+/).length}</span>
                <span className="hidden sm:inline">Blocks: {form.content.split('\n\n').length}</span>
                {config.timezone && <span className="text-brand-orange hidden sm:inline">Timezone: {config.timezone}</span>}
            </div>
            {form.status === 'draft' && (
                <div className="flex items-center gap-2 text-yellow-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                    Unpublished Draft
                </div>
            )}
         </div>

      </div>

    </div>
  );
};
