
import React, { useState } from 'react';
import { Article, GalleryItem, SiteConfig, Product } from '../../types';
import { Image as ImageIcon, Sparkles, Loader2, UploadCloud, Save, List, Settings, PenTool, Wand2, Clock, FolderOpen, Calendar, Check, Send, X } from 'lucide-react';
import { useArticleManager } from './logic';
import { ListPanel } from './list-panel';
import { EditorPanel } from './editor-panel';
import { LiveEditor } from './live-editor';
import { Button, LoadingSpinner } from '../ui';
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
  const { form, filterLogic, aiLogic, aiState, actions, activeMobilePane, setActiveMobilePane } = manager;
  const availablePillars = articles.filter(a => a.type === 'pillar');
  
  const [showMediaLib, setShowMediaLib] = useState(false);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files ? e.target.files[0] : null;
      if (file) {
          manager.setForm((prev: any) => ({ ...prev, uploadFile: file, imagePreview: URL.createObjectURL(file) }));
      }
  };

  const handleMediaSelect = (url: string) => {
      manager.setForm((prev: any) => ({ ...prev, imagePreview: url, uploadFile: null }));
      setShowMediaLib(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[75vh] lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden lg:rounded-xl border-b shadow-2xl relative">
      
      {showMediaLib && <MediaLibraryModal onSelect={handleMediaSelect} onClose={() => setShowMediaLib(false)} />}

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
            actions={{
                ...actions,
                runResearch: manager.actions.runResearch,
                runWrite: manager.actions.runWrite,
                runImage: manager.actions.runImage
            }}
            availablePillars={availablePillars}
         />
      </div>

      {/* 3. RIGHT PANEL: Canvas (50%) */}
      <div className={`w-full lg:w-[50%] lg:flex h-full bg-black flex-col relative overflow-hidden ${activeMobilePane === 'WRITE' ? 'flex' : 'hidden'}`}>
         
         {/* Top Bar Editor - Control Center */}
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
                    {/* COVER CONTROLS (Small Header Display) */}
                    <div className="flex items-center gap-3">
                        <div className="relative w-20 h-12 md:w-24 md:h-14 bg-black rounded-lg border border-white/10 overflow-hidden group/cover shadow-lg shrink-0">
                            {form.imagePreview ? (
                                <img src={form.imagePreview} className="w-full h-full object-cover" alt="Cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
                                    <ImageIcon size={16} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                                <label className="p-1.5 bg-white/10 hover:bg-white/20 rounded cursor-pointer transition-colors" title="Upload">
                                    <UploadCloud size={12} className="text-white"/>
                                    <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                                </label>
                                <button onClick={() => setShowMediaLib(true)} className="p-1.5 bg-brand-orange/20 hover:bg-brand-orange/40 rounded transition-colors" title="Media">
                                    <FolderOpen size={12} className="text-brand-orange" />
                                </button>
                                <button onClick={manager.actions.runImage} disabled={aiLogic.loading.generatingImage} className="p-1.5 bg-blue-500/20 hover:bg-blue-500/40 rounded transition-colors" title="AI Gen">
                                    {aiLogic.loading.generatingImage ? <Loader2 size={12} className="animate-spin text-blue-400"/> : <Sparkles size={12} className="text-blue-400"/>}
                                </button>
                            </div>
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Set Visual Cover</p>
                            <p className="text-[9px] text-brand-orange font-mono leading-none">{form.readTime}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* STATUS SWITCHER (Moved from Left Panel) */}
                        <div className="flex bg-black/40 p-1 rounded-lg border border-white/5 mr-1">
                            {[
                                { id: 'draft', label: 'DRAFT', icon: PenTool, color: 'text-gray-400' },
                                { id: 'published', label: 'TAYANG', icon: Send, color: 'text-green-400' },
                                { id: 'scheduled', label: 'JADWAL', icon: Calendar, color: 'text-blue-400' }
                            ].map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => manager.setForm((p:any) => ({...p, status: s.id}))}
                                    className={`px-2 py-1.5 rounded-md text-[9px] font-black tracking-widest transition-all flex items-center gap-1.5 ${
                                        form.status === s.id 
                                        ? 'bg-white/10 text-white shadow-inner' 
                                        : 'text-gray-600 hover:text-gray-400'
                                    }`}
                                    title={s.label}
                                >
                                    <s.icon size={12} className={form.status === s.id ? s.color : ''} />
                                    <span className="hidden xl:inline">{s.label}</span>
                                </button>
                            ))}
                        </div>

                        {form.content.length > 50 && (
                            <button 
                                onClick={manager.actions.runWrite} 
                                disabled={aiLogic.loading.generatingText}
                                className="p-2 h-9 text-blue-400 bg-blue-500/10 hover:bg-blue-500 hover:text-white rounded-lg transition-all border border-blue-500/20"
                                title="Regenerate Artikel (AI)"
                            >
                                {aiLogic.loading.generatingText ? <Loader2 size={18} className="animate-spin"/> : <Sparkles size={18} />}
                            </button>
                        )}

                        <button 
                            onClick={actions.saveArticle} 
                            disabled={aiLogic.loading.uploading} 
                            className="w-10 h-10 bg-brand-orange hover:bg-brand-action text-white rounded-lg shadow-neon flex items-center justify-center transition-all active:scale-90"
                            title="Simpan Strategi"
                        >
                            {aiLogic.loading.uploading ? <LoadingSpinner size={18}/> : <Save size={20} />}
                        </button>
                    </div>
                </div>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar p-4 md:p-8 relative bg-black pb-24 lg:pb-8">
            
            {/* BIG COVER PREVIEW (Just for display) */}
            {form.imagePreview && (
                <div className="w-full mb-10 group/bigcover relative">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-gray-900 shadow-2xl relative">
                        <img src={form.imagePreview} className="w-full h-full object-cover" alt="Large Preview" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                        <div className="absolute bottom-4 left-6">
                            <span className="text-[10px] font-black text-white bg-brand-orange px-2 py-1 rounded shadow-neon uppercase tracking-[0.2em]">Visual Utama</span>
                        </div>
                        <button 
                            onClick={() => manager.setForm((p:any) => ({...p, imagePreview: '', uploadFile: null}))}
                            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500 text-white rounded-full opacity-0 group-hover/bigcover:opacity-100 transition-all"
                            title="Hapus Cover"
                        >
                            <X size={16}/>
                        </button>
                    </div>
                </div>
            )}

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
                        {aiLogic.loading.progressMessage || 'Gemini lagi ngeracik...'}
                    </p>
                </div>
            )}
         </div>

         {/* Meta Bar Bottom */}
         <div className="p-3 bg-brand-dark border-t border-white/5 flex justify-between items-center text-[10px] text-gray-500 px-4 shrink-0">
            <div className="flex gap-4 items-center">
                <span className="font-mono">{form.content.split(/\s+/).length} Kata</span>
                <span className="text-gray-600">|</span>
                <span className="font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
                    {form.status === 'published' && <><Check size={10} className="text-green-500"/> Live di Web</>}
                    {form.status === 'draft' && <><PenTool size={10}/> Draft Konsep</>}
                    {form.status === 'scheduled' && <><Clock size={10} className="text-blue-400"/> Terjadwal</>}
                </span>
                {form.status === 'scheduled' && form.scheduled_for && (
                    <span className="text-blue-400 flex items-center gap-1 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 font-mono">
                        {new Date(form.scheduled_for).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'})}
                    </span>
                )}
            </div>
            <div className="flex items-center gap-4">
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest italic">Solo Intel Engine v3.2</p>
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
