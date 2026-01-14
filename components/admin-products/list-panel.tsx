
import React from 'react';
import { Search, ChevronLeft, ChevronRight, Trash2, Package, Plus } from 'lucide-react';
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
        <div className="bg-brand-dark rounded-2xl border border-white/5 flex flex-col h-full overflow-hidden shadow-2xl">
            {/* Header: Search & Category */}
            <div className="p-4 md:p-6 border-b border-white/10 bg-black/20 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <Package size={18} className="text-brand-orange" /> Inventory Produk
                    </h3>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-2 py-1 rounded hidden sm:inline">Total: {state.totalItems}</span>
                        <button 
                            onClick={actions.openNewProduct}
                            className="p-1.5 bg-brand-orange text-white rounded-lg shadow-neon hover:bg-brand-action transition-all xl:hidden"
                            title="Tambah Produk Baru"
                        >
                            <Plus size={18} />
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-gray-500" />
                    <input 
                        type="text" 
                        value={state.searchTerm}
                        onChange={(e) => state.setSearchTerm(e.target.value)}
                        placeholder="Cari nama produk..." 
                        className="w-full bg-brand-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange transition-all placeholder:text-gray-600"
                    />
                </div>
                
                <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide pb-1 -mx-2 px-2">
                    <button 
                        onClick={() => state.setSelectedCategory('All')} 
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${state.selectedCategory === 'All' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'}`}
                    >
                        SEMUA
                    </button>
                    {PRODUCT_CATEGORIES.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => state.setSelectedCategory(cat)}
                            className={`px-4 py-1.5 rounded-full text-[10px] font-bold border whitespace-nowrap transition-all ${state.selectedCategory === cat ? 'bg-brand-orange text-white border-brand-orange' : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30'}`}
                        >
                            {cat.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* List Content */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-3 bg-black/10 min-h-[500px] xl:min-h-0">
                {state.paginatedProducts.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-sm italic">
                        Belum ada produk yang cocok.
                    </div>
                ) : (
                    state.paginatedProducts.map((p: Product) => (
                        <div 
                            key={p.id} 
                            onClick={() => actions.handleEditClick(p)}
                            className="group relative bg-brand-card/40 border border-white/5 rounded-xl p-3 flex gap-4 hover:border-brand-orange/40 hover:bg-brand-card transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                        >
                            <div className="w-16 h-16 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0">
                                <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <div className="flex justify-between items-start gap-2">
                                    <h5 className="text-sm font-bold text-white truncate group-hover:text-brand-orange transition-colors">{p.name}</h5>
                                    <span className="text-[8px] font-bold text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 shrink-0 uppercase">{p.category}</span>
                                </div>
                                <p className="text-brand-orange font-bold text-base mt-1 font-display">{formatRupiah(p.price)}</p>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); actions.deleteProduct(p.id); }} 
                                className="p-2 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all md:opacity-0 md:group-hover:opacity-100"
                                title="Hapus Produk"
                            >
                                <Trash2 size={16}/>
                            </button>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination: Sticky Bottom */}
            {state.totalPages > 1 && (
                <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center shrink-0">
                    <button 
                        onClick={() => state.setPage(Math.max(1, state.page - 1))} 
                        disabled={state.page === 1} 
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
                    >
                        <ChevronLeft size={18}/>
                    </button>
                    <div className="text-[10px] font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                        HALAMAN <span className="text-brand-orange">{state.page}</span> / {state.totalPages}
                    </div>
                    <button 
                        onClick={() => state.setPage(Math.min(state.totalPages, state.page + 1))} 
                        disabled={state.page === state.totalPages} 
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
                    >
                        <ChevronRight size={18}/>
                    </button>
                </div>
            )}
        </div>
    );
};
