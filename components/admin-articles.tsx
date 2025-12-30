
import React from 'react';
import { Article } from '../types';
import { Eye } from 'lucide-react';
import { SimpleMarkdown } from './admin-articles/markdown';
import { useArticleManager } from './admin-articles/logic';
import { ListPanel } from './admin-articles/list-panel';
import { EditorPanel } from './admin-articles/editor-panel';

export const AdminArticles = ({ articles, setArticles }: { articles: Article[], setArticles: (a: Article[]) => void }) => {
  // Use the Centralized Logic Hook
  const manager = useArticleManager(articles, setArticles);
  const { form, filterLogic, aiLogic, aiState, actions, authorPersona, setAuthorPersona } = manager;

  // Filter out the Pillars for the Select Dropdown
  const availablePillars = articles.filter(a => a.type === 'pillar');

  // Handling List Item Actions Wrapper
  const listActions = {
      onEdit: actions.handleEditClick,
      onDelete: actions.deleteItem
  };

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
      
      {/* 1. LEFT PANEL: List & Filter & Persona */}
      <div className="w-[30%] border-r border-white/5 min-w-[300px]">
         <ListPanel 
            articles={articles}
            logic={{
                ...filterLogic,
                actions: listActions
            }}
            onReset={actions.resetForm}
            personaState={{ authorPersona, setAuthorPersona }} // Pass Persona State
         />
      </div>

      {/* 2. MIDDLE PANEL: Editor & AI */}
      <div className="w-[30%] border-r border-white/5 min-w-[350px]">
         <EditorPanel 
            form={form}
            setForm={manager.setForm}
            loading={aiLogic.loading}
            aiState={{
                ...aiState,
                keywords: aiLogic.keywords
            }}
            actions={{
                ...actions,
                runResearch: manager.actions.runResearch,
                runWrite: manager.actions.runWrite,
                runImage: manager.actions.runImage
            }}
            availablePillars={availablePillars}
         />
      </div>

      {/* 3. RIGHT PANEL: Live Preview */}
      <div className="w-[40%] bg-black flex flex-col relative overflow-hidden">
         <div className="p-4 border-b border-white/10 bg-brand-dark/50 flex justify-between items-center backdrop-blur-sm z-10 sticky top-0">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Eye size={12} /> Live Preview</h4>
            <span className="text-[9px] text-gray-600 bg-white/5 px-2 py-1 rounded">Markdown Mode</span>
         </div>
         <div className="flex-grow overflow-y-auto custom-scrollbar p-8 relative">
            <SimpleMarkdown content={form.content} />
         </div>
      </div>

    </div>
  );
};
