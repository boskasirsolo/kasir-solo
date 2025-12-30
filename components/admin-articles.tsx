
import React, { useState } from 'react';
import { Article } from '../types';
import { Eye, Edit3 } from 'lucide-react';
import { useArticleManager } from './admin-articles/logic';
import { ListPanel } from './admin-articles/list-panel';
import { EditorPanel } from './admin-articles/editor-panel';
import { LiveEditor } from './admin-articles/live-editor'; // NEW IMPORT

export const AdminArticles = ({ articles, setArticles }: { articles: Article[], setArticles: (a: Article[]) => void }) => {
  // Use the Centralized Logic Hook
  const manager = useArticleManager(articles, setArticles);
  const { form, filterLogic, aiLogic, aiState, actions, authorPersona, setAuthorPersona, updatePersonaAvatar } = manager;

  // Filter out the Pillars for the Select Dropdown
  const availablePillars = articles.filter(a => a.type === 'pillar');

  // Handling List Item Actions Wrapper
  const listActions = {
      handleEditClick: actions.handleEditClick,
      deleteItem: actions.deleteItem
  };

  return (
    <div className="flex h-[850px] border-t border-white/5 bg-brand-black overflow-hidden rounded-xl border-b shadow-2xl">
      
      {/* 1. LEFT PANEL: List & Filter & Persona */}
      <div className="w-[25%] border-r border-white/5 min-w-[280px]">
         <ListPanel 
            articles={articles}
            logic={{
                ...filterLogic,
                actions: listActions
            }}
            onReset={actions.resetForm}
            personaState={{ authorPersona, setAuthorPersona, updatePersonaAvatar }} // Pass Avatar Handler
            form={form} // Pass active form to highlight selection
         />
      </div>

      {/* 2. MIDDLE PANEL: Command Center (Configuration) */}
      <div className="w-[25%] border-r border-white/5 min-w-[300px]">
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

      {/* 3. RIGHT PANEL: The Canvas (Live Editor) */}
      <div className="w-[50%] bg-black flex flex-col relative overflow-hidden">
         <div className="p-4 border-b border-white/10 bg-brand-dark/95 flex justify-between items-center backdrop-blur-sm z-10 sticky top-0">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Edit3 size={12} /> Interactive Editor (WYSIWYG)</h4>
            <div className="flex items-center gap-2">
                <span className="text-[9px] text-gray-600 bg-white/5 px-2 py-1 rounded">Markdown Enabled</span>
                <span className="text-[9px] text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-1 rounded font-bold">Live Editing</span>
            </div>
         </div>
         
         <div className="flex-grow overflow-y-auto custom-scrollbar p-8 relative">
            <div className="max-w-3xl mx-auto">
                {/* Visual Header */}
                <h1 className="text-4xl font-display font-bold text-white mb-4 leading-tight">{form.title || "Judul Artikel..."}</h1>
                <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
                    {form.imagePreview && (
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                            <img src={form.authorAvatar || 'https://via.placeholder.com/50'} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-bold text-white">{form.author || "Penulis"}</p>
                        <p className="text-xs text-gray-500">{new Date().toLocaleDateString()} • {form.readTime}</p>
                    </div>
                </div>

                {/* Main Editor */}
                <LiveEditor 
                    content={form.content} 
                    onChange={(newContent) => manager.setForm((prev: any) => ({ ...prev, content: newContent }))}
                />
            </div>
         </div>
      </div>

    </div>
  );
};
