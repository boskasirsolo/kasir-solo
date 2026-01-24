import React from 'react';
import { Eye, MessageCircle } from 'lucide-react';
import { Customer } from '../types';

interface DatabaseModuleProps {
    customers: Customer[];
    onOpenDetail: (c: Customer) => void;
    onRescue: (c: Customer) => void;
}

export const DatabaseModule = ({ customers, onOpenDetail, onRescue }: DatabaseModuleProps) => {
    return (
        <div className="bg-brand-card/30 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-black/40 text-gray-500 font-bold uppercase tracking-widest">
                    <tr>
                        <th className="p-4 border-b border-white/5">Juragan</th>
                        <th className="p-4 border-b border-white/5">Radar Intel (Real-time)</th>
                        <th className="p-4 border-b border-white/5">Status</th>
                        <th className="p-4 border-b border-white/5">Engagement</th>
                        <th className="p-4 border-b border-white/5 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {customers.map(customer => (
                        <tr key={customer.phone} className="hover:bg-white/5 transition-colors group cursor-pointer" onClick={() => onOpenDetail(customer)}>
                            <td className="p-4">
                                <div className="font-bold text-white">{customer.name}</div>
                                <div className="text-[10px] text-gray-500">{customer.phone}</div>
                            </td>
                            <td className="p-4">
                                {customer.intelligence ? (
                                    <div className="flex items-center gap-2">
                                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase tracking-tighter flex items-center gap-1 ${customer.is_indecisive_buyer ? 'text-red-400 border-red-500/20 bg-red-500/10' : 'text-blue-400 border-blue-500/20 bg-blue-500/10'}`}>
                                            <Eye size={8}/> {customer.is_indecisive_buyer ? 'BUTUH DORONGAN' : 'MONITORING'}
                                        </span>
                                        <span className="text-[9px] text-gray-500 truncate max-w-[120px] italic">last: {customer.intelligence.most_visited_path}</span>
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
                                    className="p-2 text-brand-orange hover:bg-brand-orange hover:text-white rounded-lg transition-all"
                                >
                                    <MessageCircle size={16}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};