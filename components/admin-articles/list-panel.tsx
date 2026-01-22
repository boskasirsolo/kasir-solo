
import React from 'react';
import { Search, List, Filter, Plus, Clock, Edit, Sparkles, Trash2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Article } from '../../types';
import { FilterType } from './types';

// --- ATOM: Filter Tab ---
interface FilterTabProps {
    p_type: FilterType;
    p_active: boolean;
    p_onClick: () => void;
    p_label?: string;
}

const FilterTab: React.FC<FilterTabProps> = ({ 
    p_type, 
    p_active, 
    p_onClick,
    p_label
}) => (
    <button
        onClick={p_onClick}
        className={`flex-1 px-3 py-2 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
            p_active 
            ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text' 
            : 'bg-black/20 text-gray-500 border-white/5 hover:bg-white/5 hover:text-white'
        }`}
    >
        {p_label || p_type}
    </button>
);

// --- MOLECULE: Article Card ---
const ArticleCard = ({ p_article, p_activeId, p_expandedId, p_onExpand, p_onEdit, p_onDelete, p_canExpand, p_linkedClusters, p_onAddCluster }: any) => {
    const is_pillar = p_article.type === 'pillar';
    const is_expanded = p_expandedId === p_article.id;
    const is_selected = p_activeId === p_article.id;

    let border_class = is_selected ? 'border-brand-orange shadow-neon-text/20 bg-brand-orange/5' : 'border-white/5 bg-brand-card/40';

    return (
        <div className={`rounded-xl border transition-all overflow-hidden mb-2 ${border_class}`}>
            <div className="p-3 cursor-pointer flex gap-3 items-center" onClick={() => p_canExpand ? p_onExpand(p_article.id) : p_onEdit(p_article)}>
                <img src={p_article.image} className="w-12 h-12 rounded-lg object-cover bg-black shrink-0 border border-white/5" loading="lazy" />
                <div className="flex-1 min-w-0">
                    <h5 className={`text-[11px] font-bold leading-tight line-clamp-1 ${is_selected ? 'text-brand-orange' : 'text-white'}`}>
                        {p_article.title}
                    </h5>
                    <div className="flex items-center gap-2 mt-2">
                        {is_pillar ? (
                            <span className="text-[8px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5 rounded font-bold uppercase">Pilar</span>
                        ) : (
                            <span className="text-[8px] text-blue-400 border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 rounded font-bold uppercase">Cluster</span>
                        )}
                        <span className="text-[8px] text-gray-500 font-mono flex items-center gap-1 ml-auto">
                            <Clock size={8}/> {p_article.date}
                        </span>
                    </div>
                </div>
            </div>
            
            {p_canExpand && is_expanded && (
                <div className="bg-black/30 border-t border-white/5 p-3 animate-fade-in space-y-3">
                    <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); p_onEdit(p_article); }} className="flex-1 py-2 text-[9px] font-bold text-white bg-blue-600 rounded-lg flex items-center justify-center gap-1"><Edit size={12} /> EDIT</button>
                        <button onClick={(e) => { e.stopPropagation(); p_onAddCluster(p_article); }} className="flex-1 py-2 text-[9px] font-bold text-brand-orange bg-brand-orange/10 border border-brand-orange/30 rounded-lg flex items-center justify-center gap-1"><Sparkles size={12} /> +CLUSTER</button>
                        <button onClick={(e) => { e.stopPropagation(); p_onDelete(p_article.id); }} className="px-3 bg-red-900/20 text-red-500 rounded-lg border border-red-500/20"><Trash2 size={12}/></button>
                    </div>
                    <div className="space-y-1.5">
                        {p_linkedClusters.map((cluster: Article) => (
                            <div key={cluster.id} onClick={(e) => { e.stopPropagation(); p_onEdit(cluster); }} className={`p-2 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center cursor-pointer hover:bg-white/5 ${p_activeId === cluster.id ? 'border-brand-orange' : ''}`}>
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

// --- COMPONENT: Pagination Footer ---
const PaginationFooter = ({ p_page, p_totalPages, p_onPageChange }: any) => {
    if (p_totalPages <= 1) return null;
    return (
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-between items-center shrink-0">
            <button 
                onClick={() => p_onPageChange(Math.max(1, p_page - 1))} 
                disabled={p_page === 1} 
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
            >
                <ChevronLeft size={18}/>
            </button>
            <div className="text-[10px] font-bold text-gray-500 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">
                Hal <span className="text-brand-orange">{p_page}</span> / {p_totalPages}
            </div>
            <button 
                onClick={() => p_onPageChange(Math.min(p_totalPages, p_page + 1))} 
                disabled={p_page === p_totalPages} 
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 text-white transition-colors"
            >
                <ChevronRight size={18}/>
            </button>
        </div>
    );
};

export const ListPanel = ({ articles, logic, onExpand, onReset, form }: any) => {
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
                            <FilterTab key={type} p_type={type} p_active={logic.filterType === type} p_onClick={() => logic.setFilterType(type)} />
                        ))}
                    </div>
                    <div className="relative group">
                        <Search size={12} className="absolute left-3 top-2.5 text-gray-600" />
                        <input type="text" value={logic.searchTerm} onChange={(e) => logic.setSearchTerm(e.target.value)} placeholder="Cari strategi..." className="w-full bg-black border border-white/5 rounded-xl pl-9 pr-3 py-2 text-[10px] text-white focus:border-brand-orange transition-all outline-none" />
                    </div>
                </div>
            </div>

            <div className="flex-grow overflow-y-auto p-3 custom-scrollbar pb-10">
                {logic.paginatedList.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-700 py-10">
                        <Filter size={32} className="mb-2 opacity-20"/>
                        <p className="text-xs italic">Belum ada konten...</p>
                    </div>
                ) : (
                    logic.paginatedList.map((article: Article) => (
                        <ArticleCard 
                            key={article.id}
                            p_article={article}
                            p_activeId={form?.id}
                            p_expandedId={logic.expandedPillarId}
                            p_onExpand={onExpand}
                            p_onEdit={logic.actions.handleEditClick}
                            p_onDelete={logic.actions.deleteItem}
                            p_canExpand={article.type === 'pillar'}
                            p_onAddCluster={logic.actions.runClusterResearch}
                            p_linkedClusters={articles.filter((a: Article) => a.pillar_id === article.id)}
                        />
                    ))
                )}
            </div>

            <PaginationFooter 
                p_page={logic.page} 
                p_totalPages={logic.totalPages} 
                p_onPageChange={logic.setPage} 
            />
        </div>
    );
};
