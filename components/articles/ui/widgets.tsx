
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, FolderOpen, ChevronDown, ChevronRight, Flame, TrendingUp, Sparkles, Hash, Layers } from 'lucide-react';
import { Input } from '../../ui';
import { CATEGORY_TREE } from '../constants';
import { FilterState } from '../types';
import { Product, Article } from '../../types';
import { SidebarProductCard } from './cards';
import { cleanId } from '../utils';

export const ArticleSearchWidget = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => (
  <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
     <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Search size={14} className="text-brand-orange"/> Cari Jawaban
     </h4>
     <div className="relative group">
        <Input 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="Ketik masalah lo..." 
          className="pl-10 py-2 text-sm bg-black/40 border-white/5 focus:border-brand-orange/50 placeholder-gray-600"
        />
        <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
     </div>
  </div>
);

export const CategorySidebar = ({ 
  selectedFilter, 
  onSelect,
  articles = [] 
}: { 
  selectedFilter: FilterState, 
  onSelect: (type: 'parent' | 'sub' | 'all', value: string) => void,
  articles?: Article[] 
}) => {
  const [expandedParents, setExpandedParents] = useState<string[]>(['business']);

  const toggleParent = (id: string) => {
    setExpandedParents(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  // --- SMART TREE BUILDER ---
  // Merges Static Constants + Dynamic Article Categories (Parent > Child)
  const mergedTree = useMemo(() => {
      // 1. Clone Static Tree to start
      // Use structuredClone or JSON parse/stringify for deep copy
      const tree = JSON.parse(JSON.stringify(CATEGORY_TREE));
      
      // 2. Scan articles for new structures
      articles.forEach(article => {
          if (article.status === 'published' && article.category) {
              const cats = article.category.split(',').map(c => c.trim());
              cats.forEach(catStr => {
                  // Case A: Hierarchical (Parent > Child)
                  if (catStr.includes('>')) {
                      const [parentName, childName] = catStr.split('>').map(x => x.trim());
                      const parentId = cleanId(parentName);
                      
                      // Check if parent exists in tree
                      let parentNode = tree.find((p: any) => p.id === parentId || p.label.toLowerCase().includes(parentName.toLowerCase()));
                      
                      if (parentNode) {
                          // Add child if not exists
                          if (!parentNode.subCategories.includes(childName)) {
                              parentNode.subCategories.push(childName);
                          }
                      } else {
                          // Create NEW Parent Node
                          tree.push({
                              id: parentId,
                              label: parentName, // Use raw name for label
                              subCategories: [childName]
                          });
                      }
                  } 
                  // Case B: Flat (Child only)
                  else {
                      // Check if this child belongs to any existing parent
                      const exists = tree.some((p: any) => p.subCategories.some((s: string) => s.toLowerCase() === catStr.toLowerCase()));
                      
                      if (!exists) {
                          // If truly orphan, put in "Topik Lainnya" or check if "Topik Lainnya" exists
                          let miscNode = tree.find((p: any) => p.id === 'misc');
                          if (!miscNode) {
                              tree.push({
                                  id: 'misc',
                                  label: 'Topik Spesifik',
                                  subCategories: []
                              });
                              miscNode = tree[tree.length - 1];
                          }
                          if (!miscNode.subCategories.includes(catStr)) {
                              miscNode.subCategories.push(catStr);
                          }
                      }
                  }
              });
          }
      });

      return tree;
  }, [articles]);

  return (
    <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
       <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
          <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} className="text-brand-orange"/> Arsip Taktis
          </h4>
          <button onClick={() => onSelect('all', '')} className={`text-[10px] px-2 py-1 rounded transition-colors ${selectedFilter.type === 'all' ? 'bg-brand-orange text-white' : 'text-gray-500 hover:text-white'}`}>RESET</button>
       </div>
       
       <div className="space-y-2">
          {mergedTree.map((parent: any) => {
             const isExpanded = expandedParents.includes(parent.id);
             const isActiveParent = selectedFilter.type === 'parent' && selectedFilter.value === parent.id;
             const hasChildren = parent.subCategories && parent.subCategories.length > 0;

             // Don't render empty parents
             if (!hasChildren) return null;

             return (
               <div key={parent.id} className="overflow-hidden">
                  <button onClick={() => toggleParent(parent.id)} className={`w-full flex items-center justify-between p-2 rounded-lg transition-all group ${isActiveParent ? 'bg-white/10 text-brand-orange' : 'hover:bg-white/5 text-gray-300'}`}>
                     <div className="flex items-center gap-2">
                        {parent.id === 'misc' ? <Sparkles size={16} className={isActiveParent ? "text-brand-orange" : "text-gray-500 group-hover:text-white"} /> : <FolderOpen size={16} className={isActiveParent ? "text-brand-orange" : "text-gray-500 group-hover:text-white"} />}
                        <span className="text-sm font-bold text-left leading-tight">{parent.label}</span>
                     </div>
                     {isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                  </button>
                  
                  <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] pt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                     {/* Show 'All' for this parent */}
                     {parent.id !== 'misc' && (
                         <button onClick={() => onSelect('parent', parent.id)} className={`w-full text-left text-xs py-1.5 px-3 rounded border-l-2 transition-all flex items-center gap-2 ${isActiveParent ? 'border-brand-orange text-white bg-brand-orange/5' : 'border-white/10 text-gray-500 hover:text-white hover:border-white/30'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${isActiveParent ? 'bg-brand-orange' : 'bg-transparent border border-gray-600'}`}></div>Semua {parent.label}
                         </button>
                     )}
                     
                     {parent.subCategories.sort().map((sub: string) => {
                        const isActiveSub = selectedFilter.type === 'sub' && selectedFilter.value === sub;
                        return (
                          <button key={sub} onClick={() => onSelect('sub', sub)} className={`w-full text-left text-xs py-1.5 px-3 rounded border-l-2 transition-all flex items-center gap-2 ${isActiveSub ? 'border-brand-orange text-brand-orange bg-brand-orange/5' : 'border-white/5 text-gray-500 hover:text-white hover:border-white/30'}`}>
                             <span className="text-[10px] opacity-50">#</span> {sub}
                          </button>
                        );
                     })}
                  </div>
               </div>
             );
          })}
       </div>
    </div>
  );
};

export const TagCloudWidget = ({ onSelectTag }: { onSelectTag: (tag: string) => void }) => (
  <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
     <h4 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
        <Flame size={14} className="text-red-500"/> Lagi Panas
     </h4>
     <div className="flex flex-wrap gap-2">
        {['Anti Fraud', 'Stok Opname', 'Tips Hemat', 'Promo', 'Tutorial', 'Google Maps'].map((tag, i) => (
           <button key={i} onClick={() => onSelectTag(tag)} className="text-[10px] bg-black/40 border border-white/10 hover:border-brand-orange/50 hover:text-brand-orange text-gray-400 px-2 py-1 rounded-md transition-all">#{tag}</button>
        ))}
     </div>
  </div>
);

export const ProductSidebarWidget = ({ products, onDetail, waNumber }: { products: Product[], onDetail: (p: Product) => void, waNumber?: string }) => (
  <div className="bg-brand-card border border-white/10 rounded-2xl p-5 shadow-lg">
     <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
        <TrendingUp size={16} className="text-green-500" />
        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Senjata Terlaris</h4>
     </div>
     <div className="space-y-4">
        {products.slice(0, 2).map((product) => (
           <React.Fragment key={product.id}>
              <SidebarProductCard product={product} onDetail={() => onDetail(product)} waNumber={waNumber} />
           </React.Fragment>
        ))}
     </div>
  </div>
);
