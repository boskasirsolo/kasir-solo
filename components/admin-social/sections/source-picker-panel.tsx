
import React from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { SourceCard } from '../ui-parts';
import { SOURCE_TYPES } from '../constants';

export const SourcePickerPanel = ({ source, onSelect }: any) => (
    <div className="w-full lg:w-[25%] min-w-[280px] h-[400px] lg:h-full border-r-0 lg:border-r border-b lg:border-b-0 border-white/5 bg-brand-dark/50 flex flex-col">
        <div className="p-4 border-b border-white/5 space-y-3 shrink-0">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">1. Pilih Konten</h3>
            <div className="flex gap-2 overflow-x-auto custom-scrollbar-hide pb-1">
                {SOURCE_TYPES.map(type => (
                    <button key={type} onClick={() => source.setSelectedSourceType(type)} className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase border transition-all ${source.selectedSourceType === type ? 'bg-brand-orange text-white border-brand-orange' : 'text-gray-500 border-white/10 hover:border-white/30'}`}>{type}</button>
                ))}
            </div>
            <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                <input value={source.searchTerm} onChange={(e) => source.setSearchTerm(e.target.value)} placeholder="Cari konten..." className="w-full bg-brand-card border border-white/10 rounded-full pl-9 py-2 text-xs text-white outline-none focus:border-brand-orange" />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {source.paginatedItems.map((item: any) => (
                <SourceCard key={`${item.type}-${item.id}`} item={item} onClick={() => onSelect(item)} active={source.selectedItem?.id === item.id} />
            ))}
        </div>
        {source.totalSourcePages > 1 && (
            <div className="p-3 border-t border-white/5 flex justify-between bg-black/20 shrink-0">
                <button onClick={() => source.setSourcePage((p: number) => Math.max(1, p - 1))} disabled={source.sourcePage === 1} className="p-1.5 rounded bg-white/5 disabled:opacity-30"><ChevronLeft size={16}/></button>
                <span className="text-[10px] font-bold text-gray-400 py-1.5">Hal {source.sourcePage} / {source.totalSourcePages}</span>
                <button onClick={() => source.setSourcePage((p: number) => Math.min(source.totalSourcePages, p + 1))} disabled={source.sourcePage === source.totalSourcePages} className="p-1.5 rounded bg-white/5 disabled:opacity-30"><ChevronRight size={16}/></button>
            </div>
        )}
    </div>
);
