
import React from 'react';
import { FileText, Sparkles, Clock, Globe, Lock, Trash2, Edit3, Eye } from 'lucide-react';
import { Article } from '../../types';
import { CmdBadge, CmdButton } from '../admin/ui-shared/atoms';

// --- MOLEKUL: ARSIP ARTIKEL ---
export const ArticleMiniItem = ({ 
  article, 
  onEdit, 
  onDelete,
  active 
}: { 
  article: Article, 
  onEdit: (a: Article) => void, 
  onDelete: (id: number) => void,
  active: boolean 
}) => (
  <div 
    onClick={() => onEdit(article)}
    className={`p-3 rounded-xl border transition-all cursor-pointer group mb-2 flex items-center gap-3 ${
      active 
        ? 'bg-brand-orange/10 border-brand-orange' 
        : 'bg-brand-card/40 border-white/5 hover:border-white/20'
    }`}
  >
    <div className="w-10 h-10 rounded-lg bg-black border border-white/5 overflow-hidden shrink-0">
      <img src={article.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
    </div>
    <div className="flex-1 min-w-0">
      <h5 className={`text-[11px] font-bold truncate ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
        {article.title}
      </h5>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[8px] text-gray-600 font-mono">{article.date}</span>
        <CmdBadge label={article.status || 'draft'} variant={article.status === 'published' ? 'success' : 'default'} />
      </div>
    </div>
    <button 
      onClick={(e) => { e.stopPropagation(); onDelete(article.id); }}
      className="p-1.5 text-gray-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
    >
      <Trash2 size={14} />
    </button>
  </div>
);

// --- ORGANISME: EDITOR TOOLBAR ---
export const EditorToolbar = ({ 
  status, 
  onStatusChange, 
  onSave, 
  onAiGen, 
  loading 
}: any) => (
  <div className="p-4 bg-brand-dark border-b border-white/10 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
    <div className="flex items-center gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
      {['draft', 'published', 'scheduled'].map((s) => (
        <button
          key={s}
          onClick={() => onStatusChange(s)}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
            status === s ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {s}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <CmdButton 
        onClick={onAiGen} 
        disabled={loading} 
        variant="ghost" 
        icon={Sparkles} 
        label="RACIK AI" 
        className="text-blue-400 border-blue-500/20" 
      />
      <CmdButton 
        onClick={onSave} 
        disabled={loading} 
        variant="primary" 
        icon={Edit3} 
        label="SIMPAN" 
      />
    </div>
  </div>
);
