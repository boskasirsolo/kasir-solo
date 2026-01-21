
import React from 'react';
import { Globe, Search, Plus, ChevronLeft, ChevronRight, MapPin, Rocket, Layers } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { CityCard } from './city-card';
import { CityTarget } from './types';

export const CityListPanel = ({ 
    state,
    setters,
    onEdit, 
    onDelete,
    onAdd
}: { 
    state: any,
    setters: any,
    onEdit: (c: CityTarget) => void, 
    onDelete: (id: number) => void,
    onAdd: () => void
}) => {
    return (
        <div className="flex flex-col h-full bg-brand-dark border border-white/5 rounded-2xl overflow-hidden shadow-xl lg:sticky lg:top-6">
            {/* List Header: Search & Buttons */}
            <div className="p-4 md:p-6 border-b border-white/10 bg-black/20 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        <Globe size={18} className="text-brand-orange"/> Inventori SEO <span className="text-gray-500 text-[10px] bg-white/5 px-2 py-0.5 rounded ml-1 font-mono">{state.totalCount} Kota</span>
                    </div>
                    <button 
                        onClick={onAdd}
                        className="p-2 bg-brand-orange text-white rounded-lg shadow-neon hover:bg-brand-action transition-all lg:hidden"
                        title="Tambah Wilayah"
                    >
                        <Plus size={18} />
                    </button>
                </div>
                
                <div className="relative">
                    <Search size={14} className="absolute left-3 top-3 text-gray-500"/>
                    <input 
                        value={state.searchTerm}
                        onChange={(e) => setters.setSearchTerm(e.target.value)}
                        placeholder="Cari kota / kabupaten..."
                        className="w-full bg-brand-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-orange transition-colors placeholder:text-gray-600"
                    />
                </div>

                {/* CATEGORY TABS */}
                <div className="flex gap-2 bg-black/40 p-1 rounded-xl border border-white/5">
                    <button 
                        onClick={() => setters.setActiveTab('All')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${state.activeTab === 'All' ? 'bg-white/10 text-white shadow-inner border border-white/10' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Layers size={14} /> Semua
                    </button>
                    <button 
                        onClick={() => setters.setActiveTab('Kandang')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${state.activeTab === 'Kandang' ? 'bg-brand-orange text-white shadow-neon' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <MapPin size={14} /> Kandang
                    </button>
                    <button 
                        onClick={() => setters.setActiveTab('Ekspansi')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${state.activeTab === 'Ekspansi' ? 'bg-blue-600 text-white shadow-neon' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <Rocket size={14} /> Ekspansi
                    </button>
                </div>
            </div>

            {/* List Grid: Content */}
            <div className="flex-grow overflow-y-auto p-4 md:p-6 custom-scrollbar bg-black/10 min-h-[400px] lg:min-h-0">
                {state.loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-20">
                        <LoadingSpinner size={32} className="text-brand-orange mb-2" />
                        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">Sinkronisasi Data...</p>
                    </div>
                ) : state.filteredCities.length === 0 ? (
                    <div className="text-center py-20 text-gray-600 text-sm italic">
                        Belum ada target wilayah yang cocok.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {state.filteredCities.map((city: CityTarget) => (
                            <CityCard 
                                key={city.id} 
                                city={city} 
                                onEdit={onEdit} 
                                onDelete={onDelete} 
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* PAGINATION FOOTER */}
            {state.totalPages > 1 && (
                <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center shrink-0">
                    <button 
                        onClick={() => setters.setPage(Math.max(1, state.page - 1))} 
                        disabled={state.page === 1} 
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
                    >
                        <ChevronLeft size={18}/>
                    </button>
                    
                    <div className="text-[10px] font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
                        Hal <span className="text-brand-orange">{state.page}</span> / {state.totalPages}
                    </div>

                    <button 
                        onClick={() => setters.setPage(Math.min(state.totalPages, state.page + 1))} 
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