
import React from 'react';
import { Search, Filter, ChevronDown, Radar, Package } from 'lucide-react';

export const TacticalToolbar = ({ viewMode, setViewMode, searchTerm, setSearchTerm, isFilterOpen, setIsFilterOpen, filterCount }: any) => {
    const TABS = [
        { id: 'radar', label: 'Radar Juragan', desc: 'Insight View', icon: Radar },
        { id: 'orders', label: 'Logistik Order', desc: 'Fisik View', icon: Package },
    ];

    return (
        <div className="sticky top-0 z-30 bg-brand-black/80 backdrop-blur-md -mx-4 px-4 border-b border-white/5 shadow-xl py-3 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide shrink-0 pb-1">
                    {TABS.map((tab) => (
                        <button key={tab.id} onClick={() => setViewMode(tab.id)} className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all shrink-0 ${viewMode === tab.id ? 'bg-brand-orange border-brand-orange text-white shadow-neon' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white hover:border-white/20'}`}>
                            <tab.icon size={16} />
                            <div className="text-left"><p className="text-[9px] font-black uppercase tracking-widest leading-none">{tab.label}</p><p className={`text-[8px] mt-0.5 font-bold ${viewMode === tab.id ? 'text-white/60' : 'text-gray-700'}`}>{tab.desc}</p></div>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 flex-1 md:max-w-xl">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-3 text-gray-600" />
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Cari Nama/WA Juragan..." className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-[11px] font-bold text-white outline-none focus:border-brand-orange transition-all h-11" />
                    </div>
                    <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`h-11 flex items-center gap-2 px-5 py-2 rounded-xl border font-black text-[10px] uppercase tracking-widest transition-all relative ${isFilterOpen || filterCount > 0 ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-brand-card/50 border-white/5 text-gray-500 hover:text-white'}`}>
                        <Filter size={14} /><span className="hidden sm:inline">Filter</span>
                        {filterCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange text-white rounded-full flex items-center justify-center text-[8px]">{filterCount}</span>}
                        <ChevronDown size={12} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};
