
import React from 'react';
import { Search, List, Filter, Plus, Crown, Network, HelpCircle, ChevronUp, ChevronDown, Trash2, Edit, User, Users } from 'lucide-react';
import { Article } from '../../types';
import { FilterType } from './types';

// --- ATOM: Filter Tab ---
interface FilterTabProps {
    type: FilterType;
    active: boolean;
    onClick: () => void;
}

const FilterTab: React.FC<FilterTabProps> = ({ 
    type, 
    active, 
    onClick 
}) => (
    <button
        onClick={onClick}
        className={`flex-1 px-3 py-1.5 rounded text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
            active 
            ? 'bg-brand-orange text-white border-brand-orange shadow-md' 
            : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-white'
        }`}
    >
        {type === 'all' ? 'Semua' : type}
    </button>
);

// --- ATOM: Persona Switcher (Global) ---
const PersonaSwitcher = ({ persona, setPersona }: { persona: any, setPersona: any }) => (
    <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-3">
        <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Penulis Aktif</span>
            <span className={`text-[9px] px-2 py-0.5 rounded border ${persona.mode === 'personal' ? 'bg-brand-orange/10 border-brand-orange text-brand-orange' : 'bg-purple-500/10 border-purple-500 text-purple-400'}`}>
                {persona.mode === 'personal' ? 'PERSONAL' : 'REDAKSI'}
            </span>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setPersona({ name: 'Amin Maghfuri', role: 'Founder, CEO', mode: 'personal' })}
                className={`flex-1 p-2 rounded border transition-all flex flex-col items-center gap-1 ${persona.mode === 'personal' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-black/20 text-gray-500 border-white/10 hover:bg-white/5'}`}
            >
                <User size={14} />
                <span className="text-[9px] font-bold">Gue (Amin)</span>
            </button>
            <button 
                onClick={() => setPersona({ name: 'Tim Redaksi', role: 'Content Team', mode: 'team' })}
                className={`flex-1 p-2 rounded border transition-all flex flex-col items-center gap-1 ${persona.mode === 'team' ? 'bg-purple-600 text-white border-purple-600' : 'bg-black/20 text-gray-500 border-white/10 hover:bg-white/5'}`}
            >
                <Users size={14} />
                <span className="text-[9px] font-bold">Tim Redaksi</span>
            </button>
        </div>
        <input 
            type="text" 
            value={persona.name}
            onChange={(e) => setPersona({...persona, name: e.target.value})}
            className="w-full mt-2 bg-black/30 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-white/30 text-center"
            placeholder="Custom Name..."
        />
    </div>
);

// --- MOLECULE: Article Card ---
const ArticleCard = ({ 
    article, 
    activeId,
    expandedId,
    onExpand,
    onEdit,
    onDelete,
    canExpand,
    linkedClusters
}: {
    article: Article,
    activeId: number | null,
    expandedId: number | null,
    onExpand: () => void,
    onEdit: (a: Article) => void,
    onDelete: (id: number) => void,
    canExpand: boolean,
    linkedClusters: Article[]
}) => {
    const isPillar = article.type === 'pillar';
    const isCluster = article.type === 'cluster' && article.pillar_id;
    const isOrphan = !isPillar && (!isCluster || !article.pillar_id);
    const isExpanded = expandedId === article.id;

    return (
        <div className={`rounded-lg border transition-all overflow-hidden mb-2 ${isExpanded ? 'border-brand-orange/50 bg-white/5' : 'border-white/5 bg-brand-card'}`}>
            <div className="p-3 cursor-pointer flex gap-3 items-center" onClick={() => { 
                if (canExpand) onExpand(); 
                else onEdit(article); 
            }}>
                <img src={article.image} className="w-10 h-10 rounded object-cover bg-black shrink-0" />
                <div className="flex-1 min-w-0">
                    <h5 className={`text-[11px] font-bold truncate leading-tight ${isExpanded || activeId === article.id ? 'text-brand-orange' : 'text-white'}`}>{article.title}</h5>
                    <div className="flex items-center gap-2 mt-1">
                        {isPillar && (
                            <span className="text-[9px] text-yellow-500 border border-yellow-500/30 bg-yellow-500/10 px-1.5 rounded-full flex items-center gap-1"><Crown size={8}/> PILAR</span>
                        )}
                        {isCluster && (
                            <span className="text-[9px] text-blue-400 border border-blue-400/30 bg-blue-400/10 px-1.5 rounded-full flex items-center gap-1"><Network size={8}/> CLUSTER</span>
                        )}
                        {isOrphan && (
                            <span className="text-[9px] text-gray-400 border border-white/10 bg-white/5 px-1.5 rounded-full flex items-center gap-1"><HelpCircle size={8}/> ORPHAN</span>
                        )}
                        <span className="text-[9px] text-gray-500 ml-auto">{article.category}</span>
                    </div>
                </div>
                
                {canExpand ? (
                    <button className="p-1 text-gray-500 hover:text-white">
                        {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    </button>
                ) : (
                    <button onClick={(e) => { e.stopPropagation(); onDelete(article.id); }} className="p-1.5 text-gray-500 hover:text-red-500"><Trash2 size={12}/></button>
                )}
            </div>
            
            {/* Expanded Content */}
            {canExpand && isExpanded && (
                <div className="bg-black/20 border-t border-white/5 p-3 animate-fade-in">
                    <div className="flex gap-2 mb-3">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(article); }} className="flex-1 py-1.5 text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 rounded flex items-center justify-center gap-1 transition-colors"><Edit size={10} /> Edit Pilar</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(article.id); }} className="py-1.5 px-3 text-[10px] font-bold text-red-400 bg-red-900/20 hover:bg-red-900/40 rounded border border-red-900/30 transition-colors"><Trash2 size={10} /></button>
                    </div>
                    
                    <h6 className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Network size={10}/> Cluster ({linkedClusters.length})</h6>
                    
                    <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                        {linkedClusters.length === 0 && <p className="text-[10px] text-gray-600 italic">Belum ada artikel cluster.</p>}
                        {linkedClusters.map(cluster => (
                            <div key={cluster.id} onClick={(e) => { e.stopPropagation(); onEdit(cluster); }} className={`p-2 rounded border border-white/5 cursor-pointer flex gap-2 items-center group hover:bg-white/5 ${activeId === cluster.id ? 'bg-brand-orange/10 border-brand-orange' : ''}`}>
                                <p className="text-[10px] text-gray-300 truncate flex-1 group-hover:text-white">{cluster.title}</p>
                                <button onClick={(e) => { e.stopPropagation(); onDelete(cluster.id); }} className="p-1 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={10} /></button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- ORGANISM: List Panel ---
export const ListPanel = ({
    articles,
    logic,
    onReset,
    personaState 
}: {
    articles: Article[],
    logic: any,
    onReset: () => void,
    personaState: any 
}) => {
    return (
        <div className="flex flex-col h-full bg-brand-dark/50">
            {/* Header with Persona Switcher */}
            <div className="p-4 border-b border-white/5 space-y-3 bg-brand-dark sticky top-0 z-10">
                <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2"><List size={12}/> Arsip Artikel</h4>
                    <button onClick={onReset} className="text-[10px] font-bold text-brand-orange border border-brand-orange/30 hover:bg-brand-orange hover:text-white transition-all px-2 py-1 rounded flex items-center gap-1"><Plus size={10} /> BARU</button>
                </div>

                {/* GLOBAL PERSONA SETTINGS (Moved here as requested) */}
                <PersonaSwitcher 
                    persona={personaState.authorPersona} 
                    setPersona={personaState.setAuthorPersona} 
                />
                
                {/* Filter Tabs */}
                <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5 overflow-x-auto custom-scrollbar">
                    {(['all', 'pillar', 'cluster', 'orphan'] as FilterType[]).map((type) => (
                        <FilterTab
                            key={type}
                            type={type}
                            active={logic.filterType === type}
                            onClick={() => logic.setFilterType(type)}
                        />
                    ))}
                </div>

                {/* Search */}
                <div className="relative group">
                    <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500 group-focus-within:text-brand-orange" />
                    <input 
                        type="text" 
                        value={logic.searchTerm} 
                        onChange={(e: any) => logic.setSearchTerm(e.target.value)} 
                        placeholder="Cari artikel..." 
                        className="w-full bg-brand-card border border-white/10 rounded-full pl-8 pr-3 py-1.5 text-[10px] text-white focus:outline-none focus:border-brand-orange transition-colors"
                    />
                </div>
            </div>

            {/* List Content */}
            <div className="flex-grow overflow-y-auto p-2 custom-scrollbar">
                {logic.paginatedList.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 text-[10px] opacity-60">
                        <Filter size={24} className="mx-auto mb-2"/>
                        <p>Tidak ada artikel di kategori ini.</p>
                    </div>
                ) : logic.paginatedList.map((article: Article) => {
                    const isPillar = article.type === 'pillar';
                    const canExpand = isPillar && logic.filterType === 'all';
                    const linkedClusters = articles.filter(a => a.pillar_id === article.id);

                    return (
                        <ArticleCard 
                            key={article.id}
                            article={article}
                            activeId={null} 
                            expandedId={logic.expandedPillarId}
                            onExpand={() => logic.setExpandedPillarId(logic.expandedPillarId === article.id ? null : article.id)}
                            onEdit={(a) => { /* passed from parent logic */ }}
                            onDelete={(id) => { /* passed from parent logic */ }}
                            canExpand={canExpand}
                            linkedClusters={linkedClusters}
                            {...logic.actions} 
                        />
                    );
                })}
            </div>
        </div>
    );
};
