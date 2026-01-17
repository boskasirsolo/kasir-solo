
import React, { useState, useMemo } from 'react';
import { Search, Book, ChevronRight, Hash, Terminal, Info, Layout, Cpu, ShieldCheck } from 'lucide-react';
import { SimpleMarkdown } from '../../admin-articles/markdown';
import { DOCUMENTATION_CONTENT, DocItem } from './content';

export const AdminDocumentation = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDocId, setSelectedDocId] = useState(DOCUMENTATION_CONTENT[0].id);

    const filteredDocs = useMemo(() => {
        return DOCUMENTATION_CONTENT.filter(doc => 
            doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const activeDoc = DOCUMENTATION_CONTENT.find(d => d.id === selectedDocId) || DOCUMENTATION_CONTENT[0];

    // Group by category for sidebar
    const groupedDocs = useMemo(() => {
        const groups: Record<string, DocItem[]> = {};
        DOCUMENTATION_CONTENT.forEach(doc => {
            if (!groups[doc.category]) groups[doc.category] = [];
            groups[doc.category].push(doc);
        });
        return groups;
    }, []);

    const getCategoryIcon = (cat: string) => {
        if (cat.includes('Infrastructure')) return <Layout size={14} className="text-blue-400" />;
        if (cat.includes('Arsenal')) return <Cpu size={14} className="text-brand-orange" />;
        if (cat.includes('Brain')) return <Terminal size={14} className="text-purple-400" />;
        if (cat.includes('Intelligence')) return <ShieldCheck size={14} className="text-green-400" />;
        return <Book size={14} className="text-gray-500" />;
    };

    return (
        <div className="flex flex-col lg:flex-row h-[750px] bg-brand-black border border-white/5 rounded-xl overflow-hidden shadow-2xl">
            
            {/* SIDEBAR (25%) */}
            <div className="w-full lg:w-[300px] border-r border-white/5 bg-brand-dark/50 flex flex-col shrink-0">
                <div className="p-4 border-b border-white/10 bg-black/20">
                    <h3 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                        <Book size={18} className="text-brand-orange" /> MKS WAR MANUAL
                    </h3>
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-2.5 text-gray-500" />
                        <input 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Cari mantra sistem..."
                            className="w-full bg-brand-card border border-white/10 rounded-lg pl-9 pr-3 py-2 text-[10px] text-white focus:border-brand-orange outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
                    {Object.entries(groupedDocs).map(([category, items]) => (
                        <div key={category}>
                            <h4 className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 px-2">
                                {getCategoryIcon(category)} {category}
                            </h4>
                            <div className="space-y-1">
                                {/* FIX: Explicitly cast items to DocItem[] to fix 'Property map does not exist on unknown' error */}
                                {(items as DocItem[]).map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => setSelectedDocId(item.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between group ${
                                            selectedDocId === item.id 
                                            ? 'bg-brand-orange/10 text-brand-orange border border-brand-orange/20 shadow-neon-text/5' 
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        <span className="truncate">{item.title}</span>
                                        {selectedDocId === item.id && <ChevronRight size={10} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                    {filteredDocs.length === 0 && (
                        <div className="py-10 text-center text-gray-600 italic text-[10px]">
                            Keyword tidak ditemukan di manual.
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT AREA (75%) */}
            <div className="flex-1 flex flex-col bg-black overflow-hidden">
                {/* Internal Path Display */}
                <div className="px-6 py-3 bg-brand-dark border-b border-white/5 flex items-center gap-2 text-[10px] font-mono text-gray-500">
                    <Hash size={12} className="text-brand-orange" />
                    <span>system</span>
                    <ChevronRight size={10} />
                    <span>docs</span>
                    <ChevronRight size={10} />
                    <span className="text-gray-300">{activeDoc.category}</span>
                    <ChevronRight size={10} />
                    <span className="text-brand-orange font-bold">{activeDoc.id}</span>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 relative">
                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="max-w-3xl animate-fade-in">
                        <SimpleMarkdown content={activeDoc.content} />
                    </div>

                    {/* Footer Doc Suggestion */}
                    <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row gap-6 items-center justify-between">
                        <div className="flex items-center gap-4 text-gray-500 bg-white/5 p-4 rounded-xl border border-white/5">
                            <Info size={24} className="text-blue-400" />
                            <p className="text-xs leading-relaxed max-w-md">
                                Dokumentasi ini dibuat otomatis oleh SIBOS AI. Jika ada fitur baru yang lo buat tanpa manual, bilang ke SIBOS buat update manualnya.
                            </p>
                        </div>
                        <button 
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="text-[10px] font-bold text-brand-orange hover:underline uppercase tracking-widest"
                        >
                            Back to Top
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
