
import React from 'react';
import { Article, GalleryItem, SiteConfig, Product } from '../../types';
import { Image as ImageIcon, Sparkles, Loader2, UploadCloud, Save, List, Settings, PenTool, Calendar, X, FolderOpen } from 'lucide-react';
import { useArticleManager } from './logic';
import { ListPanel } from './list-panel';
import { EditorPanel } from './editor-panel';
import { LiveEditor } from './live-editor';
import { LoadingSpinner } from '../ui';
import { MediaLibraryModal } from '../admin/media-library';

export const AdminArticles = ({ 
    articles, 
    setArticles,
    gallery,
    config,
    products
}: { 
    articles: Article[], 
    setArticles: (a: Article[]) => void,
    gallery: GalleryItem[],
    config: SiteConfig,
    products: Product[]
}) => {
  const manager = useArticleManager(articles, setArticles, gallery, config, products);
  const { form, filterLogic, aiLogic, aiState, uiState, actions, activeMobilePane, setActiveMobilePane } = manager;
  
  const availablePillars = articles.filter(a => a.type === 'pillar');

  return (
    <div className="flex flex-col lg:flex-row h-[75vh] lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden lg:rounded-xl border-b shadow-2xl relative">
      
      {uiState.showMediaLib && (
        <MediaLibraryModal 
            onSelect={actions.handleMediaSelect} 
            onClose={() => uiState.setShowMediaLib(false)} 
        />
      )}

      {/* 1. LEFT PANEL: List (25%) */}
      <div className={`w-full lg:w-[25%] lg:block border-r-0 lg:border-r border-white/5 min-w-[280px] h-full ${activeMobilePane === 'LIST' ? 'block' : 'hidden'}`}>
         <ListPanel 
            articles={articles}
            logic={{ 
                ...filterLogic, 
                actions: { 
                    handleEditClick: actions.handleEditClick, 
                    deleteItem: actions.deleteItem,
                    runClusterResearch: actions.runClusterResearch 
                } 
            }}
            onExpand={(id: number) => filterLogic.setExpandedPillarId(filterLogic.expandedPillarId === id ? null : id)}
            onReset={actions.resetForm}
            form={form} 
         />
      </div>

      {/* 2. MIDDLE PANEL: Strategic Config (25%) */}
      <div className={`w-full lg:w-[25%] lg:block border-r-0 lg:border-r border-white/5 min-w-[300px] h-full ${activeMobilePane === 'CONFIG' ? 'block' : 'hidden'}`}>
         <EditorPanel 
            form={form}
            setForm={manager.setForm}
            loading={aiLogic.loading}
            aiState={{ ...aiState, keywords: aiLogic.keywords }}
            actions={actions}
            availablePillars={availablePillars}
         />
      </div>

      {/* 3. RIGHT PANEL: Canvas (50%) */}
      <div className={`w-full lg:w-[50%] lg:flex h-full bg-black flex-col relative overflow-hidden ${activeMobilePane === 'WRITE' ? 'flex' : 'hidden'}`}>
         
         <div className="p-4 md:p-6 border-b border-white/10 bg-brand-dark/50 backdrop-blur-sm z-10 sticky top-0 shrink-0">
            <div className="flex flex-col gap-4">
                <input 
                    type="text" 
                    value={form.title}
                    onChange={(e) => manager.setForm((p:any) => ({...p, title: e.target.value}))}
                    placeholder="Judul Artikel..."
                    className="w-full bg-transparent text-xl md:text-3xl font-display font-bold text-white placeholder-gray-600 outline-none"
                />

                <div className="flex flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5">
                            {['draft', 'published', 'scheduled'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => manager.setForm((p:any) => ({...p, status: s}))}
                                    className={`px-3 py-1.5 rounded-md text-[9px] font-black tracking-widest transition-all ${
                                        form.status === s ? 'bg-white/10 text-white' : 'text-gray-600'
                                    }`}
                                >
                                    {s.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button 
                            onClick={actions.runWrite} 
                            disabled={aiLogic.loading.generatingText}
                            className="h-10 px-4 rounded-lg font-bold text-[10px] bg-brand-gradient text-white flex items-center gap-2 shadow-neon transition-all active:scale-95 disabled:opacity-50"
                        >
                            {aiLogic.loading.generatingText ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                            <span className="hidden md:inline uppercase tracking-widest">GENERATE (AI)</span>
                        </button>

                        <button 
                            onClick={actions.saveArticle} 
                            disabled={aiLogic.loading.uploading} 
                            className="w-10 h-10 bg-brand-orange hover:bg-brand-action text-white rounded-lg shadow-neon flex items-center justify-center transition-all active:scale-90"
                        >
                            {aiLogic.loading.uploading ? <LoadingSpinner size={18}/> : <Save size={20} />}
                        </button>
                    </div>
                </div>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative bg-black pb-24 lg:pb-8">
            <div className="w-full mb-10 group/cover relative">
                <div className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-white/5 bg-gray-900 shadow-2xl relative">
                    {form.imagePreview ? (
                        <img src={form.imagePreview} className="w-full h-full object-cover" alt="Large Preview" />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-700 bg-white/[0.02]">
                            <ImageIcon size={48} className="mb-4 opacity-20" />
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Belum Ada Cover</p>
                        </div>
                    )}

                    <div className={`absolute inset-0 bg-black/60 flex items-center justify-center gap-4 transition-opacity ${form.imagePreview ? 'opacity-0 group-hover/cover:opacity-100' : 'opacity-100'}`}>
                        <label className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition-all hover:-translate-y-1 w-24">
                            <UploadCloud size={24} className="text-white"/>
                            <span className="text-[10px] font-bold text-white uppercase tracking-tighter">Upload</span>
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && actions.handleCoverUpload(e.target.files[0])} />
                        </label>
                        <button onClick={() => uiState.setShowMediaLib(true)} className="flex flex-col items-center gap-2 p-4 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/20 rounded-2xl transition-all hover:-translate-y-1 w-24">
                            <FolderOpen size={24} className="text-brand-orange" />
                            <span className="text-[10px] font-bold text-brand-orange uppercase tracking-tighter">Media</span>
                        </button>
                    </div>
                </div>
            </div>

            <LiveEditor 
                content={form.content} 
                onChange={(newContent) => manager.setForm((prev: any) => ({ ...prev, content: newContent }))}
            />

            {(aiLogic.loading.generatingText || aiLogic.loading.generatingImage) && (
                <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 animate-fade-in backdrop-blur-md">
                    <Loader2 size={48} className="text-brand-orange animate-spin mb-4 relative"/>
                    <p className="text-white font-bold text-lg animate-pulse text-center px-6 leading-relaxed">
                        {aiLogic.loading.progressMessage || 'Gemini lagi ngeracik...'}
                    </p>
                </div>
            )}
         </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-card/90 backdrop-blur-xl border-t border-white/10 z-[100] flex justify-around items-center px-6">
          <button onClick={() => setActiveMobilePane('LIST')} className={`flex flex-col items-center gap-1 ${activeMobilePane === 'LIST' ? 'text-brand-orange' : 'text-gray-500'}`}>
              <List size={20}/><span className="text-[9px] font-bold uppercase">Arsip</span>
          </button>
          <button onClick={() => setActiveMobilePane('CONFIG')} className={`flex flex-col items-center gap-1 ${activeMobilePane === 'CONFIG' ? 'text-brand-orange' : 'text-gray-500'}`}>
              <Settings size={20}/><span className="text-[9px] font-bold uppercase">Setting</span>
          </button>
          <button onClick={() => setActiveMobilePane('WRITE')} className={`flex flex-col items-center gap-1 ${activeMobilePane === 'WRITE' ? 'text-brand-orange' : 'text-gray-500'}`}>
              <PenTool size={20}/><span className="text-[9px] font-bold uppercase">Nulis</span>
          </button>
      </div>
    </div>
  );
};
