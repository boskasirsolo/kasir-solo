
import React from 'react';
import { Search, Plus, Trash2, Monitor, ChevronLeft, ChevronRight } from 'lucide-react';
import { DownloadItem } from '../../types';
import { getFileIcon } from './utils';

export const DownloadList = ({ 
    state, 
    onEdit, 
    onDelete, 
    onReset 
}: { 
    state: any, 
    onEdit: (item: DownloadItem) => void, 
    onDelete: (id: string) => void, 
    onReset: () => void 
}) => {
    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3">
                <div className="relative flex-grow">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                    <input 
                        type="text" 
                        value={state.searchTerm} 
                        onChange={(e) => state.setSearchTerm(e.target.value)} 
                        placeholder="Cari file..." 
                        className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange" 
                    />
                </div>
                <button onClick={onReset} className="bg-brand-orange text-white p-2 rounded-lg hover:bg-brand-action"><Plus size={16}/></button>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {state.paginated.map((item: DownloadItem) => {
                        const Icon = getFileIcon(item.category);
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => onEdit(item)}
                                className="bg-brand-card border border-white/5 rounded-lg p-3 cursor-pointer group transition-all flex flex-col h-full relative hover:border-brand-orange/50"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center shrink-0 text-gray-400 group-hover:text-brand-orange group-hover:bg-brand-orange/10 transition-colors">
                                        <Icon size={16}/>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase bg-black/40 border border-white/10 px-1.5 py-0.5 rounded text-gray-500">{item.category}</span>
                                </div>
                                <h5 className="text-[11px] font-bold text-white leading-snug line-clamp-2 mb-1 group-hover:text-brand-orange transition-colors">{item.title}</h5>
                                <div className="mt-auto pt-2 border-t border-white/5 flex justify-between items-center text-[9px] text-gray-500">
                                    <span className="flex items-center gap-1"><Monitor size={8}/> {item.os_support}</span>
                                    <span>{item.file_size}</span>
                                </div>
                                
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} 
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition-all"
                                >
                                    <Trash2 size={12}/>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
            {state.totalPages > 1 && (
                <div className="p-2 border-t border-white/10 flex justify-center gap-2">
                    <button onClick={() => state.setPage(Math.max(1, state.page-1))} className="p-1.5 bg-white/5 rounded text-white disabled:opacity-30"><ChevronLeft size={16}/></button>
                    <span className="text-xs text-gray-400 py-1.5">{state.page} / {state.totalPages}</span>
                    <button onClick={() => state.setPage(Math.min(state.totalPages, state.page+1))} className="p-1.5 bg-white/5 rounded text-white disabled:opacity-30"><ChevronRight size={16}/></button>
                </div>
            )}
        </div>
    );
};
