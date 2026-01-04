
import React from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Product } from '../../types';
import { formatRupiah } from '../../utils';
import { PRODUCT_CATEGORIES } from './types';

export const ListPanel = ({ 
    state, 
    actions 
}: { 
    state: any, 
    actions: any 
}) => {
    return (
        <div className="bg-brand-dark rounded-xl border border-white/5 flex flex-col h-full overflow-hidden shadow-xl">
            {/* Header: Search & Category */}
            <div className="p-4 border-b border-white/10 bg-black/20 space-y-3">
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                    <input 
                        type="text" 
                        value={state.searchTerm}
                        onChange={(e) => state.setSearchTerm(e.target.value)}
                        placeholder="Cari produk..." 
                        className="w-full bg-brand-card border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-brand-orange"
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
                    <button onClick={() => state.setSelectedCategory('All')} className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${state.selectedCategory === 'All' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white/5 text-gray-400 border-white/10'}`}>Semua</button>
                    {PRODUCT_CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => state.setSelectedCategory(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold border whitespace-nowrap ${state.selectedCategory === cat ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white/5 text-gray-400 border-white/10'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="text-[10px] text-gray-500 text-right">Total: {state.totalItems} Produk</div>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar space-y-3">
                {state.paginatedProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 text-xs">Produk tidak ditemukan.</div>
                ) : (
                    state.paginatedProducts.map((p: Product) => (
                        <div 
                            key={p.id} 
                            onClick={() => actions.handleEditClick(p)}
                            className="group relative bg-brand-card border border-white/5 rounded-lg p-2 flex gap-3 hover:border-brand-orange transition-all cursor-pointer"
                        >
                            <img src={p.image} className="w-12 h-12 rounded bg-black object-cover border border-white/10" />
                            <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-white truncate group-hover:text-brand-orange transition-colors">{p.name}</h5>
                                <p className="text-[10px] text-gray-400">{p.category}</p>
                                <p className="text-xs font-bold text-brand-orange mt-0.5">{formatRupiah(p.price)}</p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); actions.deleteProduct(p.id); }} 
                                className="absolute top-2 right-2 p-1 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 size={12}/>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {state.totalPages > 1 && (
                <div className="p-3 border-t border-white/10 bg-black/20 flex justify-between items-center">
                    <button onClick={() => state.setPage(Math.max(1, state.page - 1))} disabled={state.page === 1} className="p-1.5 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30 text-white"><ChevronLeft size={14}/></button>
                    <span className="text-[10px] font-bold text-gray-400">{state.page} / {state.totalPages}</span>
                    <button onClick={() => state.setPage(Math.min(state.totalPages, state.page + 1))} disabled={state.page === state.totalPages} className="p-1.5 bg-white/5 rounded hover:bg-white/10 disabled:opacity-30 text-white"><ChevronRight size={14}/></button>
                </div>
            )}
        </div>
    );
};
