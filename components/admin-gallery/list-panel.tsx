
import React from 'react';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types';

export const ListPanel = ({ state, actions, activeId }: { state: any, actions: any, activeId: number | null }) => {
    return (
        <div className="w-full h-full flex flex-col bg-brand-dark/50">
            <div className="p-4 border-b border-white/5 bg-brand-dark">
                <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                    <input 
                        type="text" 
                        value={state.searchTerm}
                        onChange={(e) => state.setSearchTerm(e.target.value)}
                        placeholder="Cari project..." 
                        className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                </div>
                <button 
                    onClick={actions.resetForm}
                    className="w-full py-2 border border-dashed border-white/10 rounded-lg text-gray-400 text-xs font-bold hover:bg-brand-orange/10 hover:text-brand-orange hover:border-brand-orange transition-all flex items-center justify-center gap-2"
                >
                    <Plus size={14} /> PROJECT BARU
                </button>
            </div>

            <div className="flex-grow overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {state.paginated.map((item: GalleryItem) => (
                    <div 
                        key={item.id} 
                        onClick={() => actions.handleEditClick(item)}
                        className={`flex gap-3 p-3 rounded-lg cursor-pointer border transition-all group ${
                            activeId === item.id 
                            ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/20' 
                            : 'bg-brand-card border-white/5 hover:border-white/20'
                        }`}
                    >
                        <img src={item.image_url} className="w-12 h-12 bg-black rounded object-cover border border-white/10" />
                        <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{item.title}</h5>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${item.category_type === 'digital' ? 'text-blue-400 bg-blue-400/10' : 'text-green-400 bg-green-400/10'}`}>
                                {item.category_type === 'digital' ? 'SOFTWARE' : 'HARDWARE'}
                            </span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); actions.deleteItem(item.id); }} className="text-gray-600 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {state.totalPages > 1 && (
                <div className="p-3 border-t border-white/5 flex justify-between items-center bg-brand-dark">
                    <button onClick={() => state.setPage(Math.max(1, state.page-1))} disabled={state.page===1} className="text-gray-400 disabled:opacity-30"><ChevronLeft size={16}/></button>
                    <span className="text-xs text-brand-orange font-bold">{state.page}/{state.totalPages}</span>
                    <button onClick={() => state.setPage(Math.min(state.totalPages, state.page+1))} disabled={state.page===state.totalPages} className="text-gray-400 disabled:opacity-30"><ChevronRight size={16}/></button>
                </div>
            )}
        </div>
    );
};
