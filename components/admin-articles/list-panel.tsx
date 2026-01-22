
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Search, List, Filter, Plus, Clock, Edit, Sparkles, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Article } from '../../types';
import { FilterType } from './types';

// --- ATOM: Filter Tab ---
interface FilterTabProps {
    type: FilterType;
    active: boolean;
    onClick: () => void;
    label?: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ 
    type, 
    active, 
    onClick,
    label
}) => (
    <button
        onClick={onClick}
        className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
            active 
            ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
            : 'bg-black/20 text-gray-500 border-white/5 hover:bg-white/5 hover:text-white'
        }`}
    >
        {label || type}
    </button>
);

// --- MOLECULE: Article Card ---
const ArticleCard = ({ article, activeId, expandedId, onExpand, onEdit, onDelete, canExpand, linkedClusters, onAddCluster }: any) => {
    const isPillar = article.type === 'pillar';
    const isExpanded = expandedId === article.id;
    const isSelected = activeId === article.id;

    let borderClass = isSelected ? 'border-brand-orange shadow-neon-text/20 bg-brand-orange/5' : 'border-white/5 bg-brand-card/40';

    return (
        <div className={`rounded-xl border transition-all overflow-hidden mb-2 ${borderClass}`}>
            <div className="p-3 cursor-pointer flex gap-3 items-center" onClick={() => canExpand ? onExpand() : onEdit(article)}>
                <img src={article.image} className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 border border-white/5" loading="lazy" />
                <div className="flex-1 min-w-0">
                    <h5 className={`text-[11px] font-bold leading-tight line-clamp-1 ${isSelected ? 'text-brand-orange' : 'text-white'}`}>
                        {article.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-2">
                        {isPillar ? (
                            <span className="text-[8px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded font-bold uppercase">Pilar</span>
                        ) : (
                            <span className="text-[8px] text-blue-400 border border-blue-400/30 bg-blue-400/10 px-1.5 py-0.5 rounded font-bold uppercase">Cluster</span>
                        )}
                        <span className="text-[8px] text-gray-500 font-mono flex items-center gap-1 ml-auto">
                            <Clock size={8}/> {article.date}
                        </span>
                    </div>
                </div>
            </div>
            
            {canExpand && isExpanded && (
                <div className="bg-black/30 border-t border-white/5 p-3 animate-fade-in space-y-3">
                    <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(article); }} className="flex-1 py-2 text-[9px] font-bold text-white bg-blue-600 rounded-lg flex items-center justify-center gap-1"><Edit size={12} /> EDIT</button>
                        <button onClick={(e) => { e.stopPropagation(); onAddCluster(article); }} className="flex-1 py-2 text-[9px] font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-lg flex items-center justify-center gap-1"><Sparkles size={12} /> +CLUSTER</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(article.id); }} className="px-3 bg-red-900/20 text-red-500 rounded-lg border border-red-500/20"><Trash2 size={12}/></button>
                    </div>
                    <div className="space-y-1.5">
                        {linkedClusters.map((cluster: Article) => (
                            <div key={cluster.id} onClick={(e) => { e.stopPropagation(); onEdit(cluster); }} className={`p-2 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center ${activeId === cluster.id ? 'border-brand-orange' : ''}`}>
                                <p className="text-[10px] text-gray-300 truncate flex-1">{cluster.title}</p>
                                <ChevronRight size={10} className="text-gray-600" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: Virtual List Container ---
const VirtualArticleList = ({ items, ...props }: any) => {
    // Implementasi load-more berbasis scroll untuk menjaga performa DOM
    const [visibleCount, setVisibleCount] = useState(20);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleScroll = () => {
        if (!containerRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            setVisibleCount(prev => Math.min(prev + 20, items.length));
        }
    };

    return (
        <div 
            ref={containerRef} 
            onScroll={handleScroll}
            className="flex-grow overflow-y-auto p-3 custom-scrollbar pb-24"
        >
            {items.slice(0, visibleCount).map((article: Article) => (
                <ArticleCard 
                    key={article.id}
                    article={article}
                    {...props}
                    canExpand={article.type === 'pillar'}
                    linkedClusters={props.allArticles.filter((a: Article) => a.pillar_id === article.id)}
                />
            ))}
            {visibleCount < items.length && (
                <div className="py-4 text-center">
                    <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest animate-pulse">Loading more archives...</p>
                </div>
            )}
        </div>
    );
};

export const ListPanel = ({ articles, logic, onReset, form }: any) => {
    return (
        <div className="flex flex-col h-full bg-brand-black">
            <div className="p-4 border-b border-white/10 space-y-4 bg-brand-card/50">
                <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><List size={12}/> Intelijen Artikel</h4>
                    <button onClick={onReset} className="bg-brand-orange text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-neon flex items-center gap-1 transition-all active:scale-95"><Plus size={12} /> BARU</button>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="flex gap-1 overflow-x-auto custom-scrollbar-hide">
                        {(['all', 'pillar', 'cluster'] as FilterType[]).map((type) => (
                            <FilterTab key={type} type={type} active={logic.filterType === type} onClick={() => logic.setFilterType(type)} />
                        ))}
                    </div>
                    <div className="relative group">
                        <Search size={12} className="absolute left-3 top-2.5 text-gray-600" />
                        <input type="text" value={logic.searchTerm} onChange={(e) => logic.setSearchTerm(e.target.value)} placeholder="Cari strategi..." className="w-full bg-black border border-white/5 rounded-xl pl-9 pr-3 py-2 text-[10px] text-white focus:border-brand-orange transition-all outline-none" />
                    </div>
                </div>
            </div>

            {logic.paginatedList.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-gray-700">
                    <Filter size={32} className="mb-2 opacity-20"/>
                    <p className="text-xs italic">Belum ada konten...</p>
                </div>
            ) : (
                <VirtualArticleList 
                    items={logic.sortedList || logic.paginatedList} 
                    allArticles={articles}
                    activeId={form?.id}
                    expandedId={logic.expandedPillarId}
                    onExpand={() => logic.setExpandedPillarId(logic.expandedPillarId === form?.id ? null : logic.expandedPillarId)}
                    onEdit={logic.actions.handleEditClick}
                    onDelete={logic.actions.deleteItem}
                    onAddCluster={logic.actions.runClusterResearch}
                />
            )}
        </div>
    );
};
