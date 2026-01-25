import React from 'react';
import { Search, Filter, ChevronDown, Radar, Package } from 'lucide-react';

export const TacticalToolbar = ({ viewMode, setViewMode, searchTerm, setSearchTerm, isFilterOpen, setIsFilterOpen, filterCount }: any) => {
    const TABS = [
        { id: 'radar', label: 'Radar Juragan', desc: 'Intel View', icon: Radar },
        { id: 'orders', label: 'Logistik Order', desc: 'Physical View', icon: Package },
    ];

    return (
        <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md -mx-4 px-4 border-b border-white/5 shadow-xl py-4 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide shrink-0 pb-1">
                    {TABS.map((tab) => (
                        <button 
                            key={tab.id} 
                            onClick={() => setViewMode(tab.id)} 
                            className={`flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all shrink-0 active:scale-95 ${viewMode === tab.id ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
                        >
                            <tab.icon size={18} className={viewMode === tab.id ? 'text-white' : 'text-gray-600'} />
                            <div className="text-left">
                                <p className="text-xs font-black uppercase tracking-wider leading-none">{tab.label}</p>
                                <p className={`text-[10px] mt-1 font-bold ${viewMode === tab.id ? 'text-white/70' : 'text-gray-700'}`}>{tab.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3 flex-1 md:max-w-xl">
                    <div className="relative flex-1 group">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
                        <input 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Cari Nama / WA..." 
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white outline-none focus:border-brand-orange focus:bg-black/60 transition-all h-12 placeholder:text-gray-700" 
                        />
                    </div>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        className={`h-12 flex items-center gap-2 px-6 py-2 rounded-xl border font-black text-[11px] uppercase tracking-wider transition-all relative active:scale-95 ${isFilterOpen || filterCount > 0 ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-neon-text/10' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white'}`}
                    >
                        <Filter size={18} />
                        <span className="hidden sm:inline">Filter</span>
                        {filterCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-orange text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-brand-black shadow-lg">
                                {filterCount}
                            </span>
                        )}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};