import React from 'react';
import { Search, Filter, ChevronDown, Radar, Package } from 'lucide-react';

export const TacticalToolbar = ({ viewMode, setViewMode, searchTerm, setSearchTerm, isFilterOpen, setIsFilterOpen, filterCount }: any) => {
    const TABS = [
        { id: 'radar', label: 'Radar Juragan', desc: 'Intel View', icon: Radar },
        { id: 'orders', label: 'Logistik Order', desc: 'Fisik View', icon: Package },
    ];

    return (
        <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md -mx-4 px-4 border-b border-white/5 shadow-xl py-6 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex gap-3 overflow-x-auto custom-scrollbar-hide shrink-0 pb-1">
                    {TABS.map((tab) => (
                        <button 
                            key={tab.id} 
                            onClick={() => setViewMode(tab.id)} 
                            className={`flex items-center gap-4 px-8 py-4 rounded-[1.5rem] border transition-all shrink-0 active:scale-95 ${viewMode === tab.id ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}
                        >
                            <tab.icon size={22} className={viewMode === tab.id ? 'text-white' : 'text-gray-600'} />
                            <div className="text-left">
                                <p className="text-sm font-black uppercase tracking-widest leading-none">{tab.label}</p>
                                <p className={`text-xs mt-1.5 font-bold ${viewMode === tab.id ? 'text-white/70' : 'text-gray-700'}`}>{tab.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 flex-1 md:max-w-2xl">
                    <div className="relative flex-1 group">
                        <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
                        <input 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            placeholder="Cari Nama / No. WA Juragan..." 
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-base font-bold text-white outline-none focus:border-brand-orange focus:bg-black/60 transition-all h-14 placeholder:text-gray-700" 
                        />
                    </div>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)} 
                        className={`h-14 flex items-center gap-3 px-8 py-2 rounded-2xl border font-black text-sm uppercase tracking-widest transition-all relative active:scale-95 ${isFilterOpen || filterCount > 0 ? 'bg-brand-orange/10 border-brand-orange text-brand-orange shadow-neon-text/10' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white'}`}
                    >
                        <Filter size={20} />
                        <span className="hidden sm:inline">Filter</span>
                        {filterCount > 0 && (
                            <span className="absolute -top-2 -right-2 w-6 h-6 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-black border-2 border-brand-black shadow-lg">
                                {filterCount}
                            </span>
                        )}
                        <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};