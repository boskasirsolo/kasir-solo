
import React from 'react';
import { Article, GalleryItem, SiteConfig, Product } from '../../types';
import { List, Settings, PenTool } from 'lucide-react';
import { useArticleManager } from './logic';
import { ListPanel } from './list-panel';
import { StrategicConfig } from './sections/strategic-config';
import { CanvasEditor } from './sections/canvas-editor';
import { MediaLibraryModal } from '../admin/media-library';

export const AdminArticles = ({ 
    articles, setArticles, gallery, config, products
}: { 
    articles: Article[], setArticles: (a: Article[]) => void, gallery: GalleryItem[], config: SiteConfig, products: Product[]
}) => {
  const manager = useArticleManager(articles, setArticles, gallery, config, products);
  const { form, filterLogic, actions, uiState, activeMobilePane, setActiveMobilePane } = manager;
  const availablePillars = articles.filter(a => a.type === 'pillar');

  return (
    <div className="flex flex-col lg:flex-row h-[75vh] lg:h-[850px] border-t border-white/5 bg-brand-black overflow-hidden lg:rounded-xl border-b shadow-2xl relative">
      {uiState.showMediaLib && <MediaLibraryModal onSelect={actions.handleMediaSelect} onClose={() => manager.uiState.setShowMediaLib(false)} />}

      <div className={`w-full lg:w-[25%] lg:block border-r border-white/5 min-w-[280px] h-full ${activeMobilePane === 'LIST' ? 'block' : 'hidden'}`}>
         <ListPanel articles={articles} logic={{ ...filterLogic, actions: { handleEditClick: actions.handleEditClick, deleteItem: actions.deleteItem, runClusterResearch: actions.runClusterResearch } }} onExpand={(id: number) => filterLogic.setExpandedPillarId(filterLogic.expandedPillarId === id ? null : id)} onReset={actions.resetForm} form={form} />
      </div>

      <div className={`w-full lg:w-[25%] lg:block border-r border-white/5 min-w-[300px] h-full ${activeMobilePane === 'CONFIG' ? 'block' : 'hidden'}`}>
         <StrategicConfig manager={manager} availablePillars={availablePillars} />
      </div>

      <div className={`w-full lg:w-[50%] lg:flex h-full overflow-hidden ${activeMobilePane === 'WRITE' ? 'flex' : 'hidden'}`}>
         <CanvasEditor manager={manager} onMediaOpen={() => manager.uiState.setShowMediaLib(true)} />
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-brand-card/90 backdrop-blur-xl border-t border-white/10 z-[100] flex justify-around items-center px-6">
          <button onClick={() => setActiveMobilePane('LIST')} className={`flex flex-col items-center gap-1 ${activeMobilePane === 'LIST' ? 'text-brand-orange' : 'text-gray-500'}`}><List size={20}/><span className="text-[9px] font-bold uppercase">Arsip</span></button>
          <button onClick={() => setActiveMobilePane('CONFIG')} className={`flex flex-col items-center gap-1 ${activeMobilePane === 'CONFIG' ? 'text-brand-orange' : 'text-gray-500'}`}><Settings size={20}/><span className="text-[9px] font-bold uppercase">SEO</span></button>
          <button onClick={() => setActiveMobilePane('WRITE')} className={`flex flex-col items-center gap-1 ${activeMobilePane === 'WRITE' ? 'text-brand-orange' : 'text-gray-500'}`}><PenTool size={20}/><span className="text-[9px] font-bold uppercase">Canvas</span></button>
      </div>
    </div>
  );
};
