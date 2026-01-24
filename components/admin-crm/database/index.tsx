
import React, { useState, useMemo } from 'react';
import { Eye, MessageCircle, Filter, Database, Search } from 'lucide-react';
import { Customer } from '../types';

interface DatabaseModuleProps {
    customers: Customer[];
    onOpenDetail: (c: Customer) => void;
    onRescue: (c: Customer) => void;
}

const CATEGORY_OPTIONS = [
    { id: 'all', label: 'SEMUA KATEGORI' },
    { id: 'hardware', label: 'HARDWARE KASIR' },
    { id: 'web', label: 'WEBSITE' },
    { id: 'webapp', label: 'WEB APP (SISTEM)' },
    { id: 'seo', label: 'SEO & TRAFFIC' }
];

export const DatabaseModule = ({ customers, onOpenDetail, onRescue }: DatabaseModuleProps) => {
    const [catFilter, setCatFilter] = useState<string>('all');

    const filteredList = useMemo(() => {
        if (catFilter === 'all') return customers;
        return customers.filter(c => c.detected_category === catFilter);
    }, [customers, catFilter]);

    return (
        <div className="space-y-4 animate-fade-in">
            {/* FILTER TOOLBAR */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-brand-card/20 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                        <Filter size={18} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest leading-none">Filter Intelijen</h4>
                        <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold">Segmentasi Prospek Juragan</p>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto custom-scrollbar-hide">
                    {CATEGORY_OPTIONS.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => setCatFilter(opt.id)}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all border whitespace-nowrap ${
                                catFilter === opt.id
                                ? 'bg-purple-600 text-white border-purple-500 shadow-neon'
                                : 'bg-black/40 text-gray-500 border-white/5 hover:border-purple-500/30 hover:text-gray-300'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* DATABASE TABLE */}
            <div className="bg-brand-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                    <thead className="bg-black/40 text-gray-500 font-bold uppercase tracking-widest">
                        <tr>
                            <th className="p-4 border-b border-white/5">Juragan</th>
                            <th className="p-4 border-b border-white/5">Kategori</th>
                            <th className="p-4 border-b border-white/5">Radar Intel (Real-time)</th>
                            <th className="p-4 border-b border-white/5">Status</th>
                            <th className="p-4 border-b border-white/5">Engagement</th>
                            <th className="p-4 border-b border-white/5 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredList.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-20 text-center text-gray-600 italic">
                                    <Database size={48} className="mx-auto mb-4 opacity-10" />
                                    Gak ada data di kategori ini, Bos.
                                </td>
                            </tr>
                        ) : (
                            filteredList.map(customer => (
                                <tr key={customer.phone} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onOpenDetail(customer)}>
                                    <td className="p-4">
                                        <div className="font-bold text-white group-hover:text-brand-orange transition-colors">{customer.name}</div>
                                        <div className="text-[10px] text-gray-500 font-mono">{customer.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                            customer.detected_category === 'hardware' ? 'text-green-400 border-green-500/20 bg-green-500/5' :
                                            customer.detected_category === 'web' ? 'text-blue-400 border-blue-500/20 bg-blue-500/5' :
                                            'text-purple-400 border-purple-500/20 bg-purple-500/5'
                                        }`}>
                                            {customer.detected_category || 'kontak'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {customer.intelligence ? (
                                            <div className="flex items-center gap-2">
                                                <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1 ${customer.is_indecisive_buyer ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-blue-400 border-blue-500/20 bg-blue-500/10'}`}>
                                                    <Eye size={8}/> {customer.is_indecisive_buyer ? 'BUTUH DORONGAN' : 'MONITORING'}
                                                </span>
                                                <span className="text-[9px] text-gray-500 truncate max-w-[120px] italic">last: {customer.intelligence.most_visited_path.split('/').pop() || 'Home'}</span>
                                            </div>
                                        ) : <span className="text-[9px] text-gray-700 italic">No radar data</span>}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-white/5 rounded border border-white/10 text-[9px] font-bold uppercase text-gray-400">
                                            {customer.lead_status}
                                        </span>
                                    </td>
                                    <td className="p-4 font-mono text-gray-400">
                                        {Math.round((customer.intelligence?.avg_engagement_sec || 0) / 60)} min
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); onRescue(customer); }} 
                                            className="p-2.5 bg-brand-orange/10 text-brand-orange border border-brand-orange/20 hover:bg-brand-orange hover:text-white rounded-xl transition-all shadow-neon-text/5"
                                            title="Sapa SIBOS AI"
                                        >
                                            <MessageCircle size={16}/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.3em]">Arsip Intelijen V3.1 // Database Juragan Terpusat</p>
            </div>
        </div>
    );
};
