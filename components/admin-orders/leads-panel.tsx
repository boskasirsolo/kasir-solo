
import React from 'react';
import { Target, Phone, MessageSquare } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { useLeadLogic } from './logic';

export const LeadsPanel = () => {
    const { state, updateLeadStatus } = useLeadLogic();

    if (state.loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    if (state.leads.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                <Target size={32} className="mx-auto mb-2 opacity-50"/>
                Belum ada Shadow Lead yang tertangkap.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {state.leads.map(lead => (
                <div key={lead.id} className="bg-brand-dark border border-white/5 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center hover:border-brand-orange/30 transition-all group">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${lead.source === 'checkout_page' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                {lead.source === 'checkout_page' ? 'CHECKOUT' : 'CONTACT'}
                            </span>
                            <span className="text-[10px] text-gray-500">{new Date(lead.created_at).toLocaleString('id-ID')}</span>
                        </div>
                        <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                        <div className="flex items-center gap-2 text-gray-400 text-xs mt-0.5">
                            <Phone size={12} /> 
                            <a href={`https://wa.me/${lead.phone}`} target="_blank" className="hover:text-brand-orange">{lead.phone}</a>
                        </div>
                        {lead.interest && (
                            <p className="text-[11px] text-gray-500 mt-2 bg-black/20 p-2 rounded line-clamp-1 border border-white/5">
                                <span className="text-gray-400 font-bold">Minat:</span> {lead.interest}
                            </p>
                        )}
                        {lead.notes && (
                            <p className="text-[10px] text-gray-600 mt-1 italic">Note: {lead.notes}</p>
                        )}
                    </div>
                    
                    <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                        <select 
                            value={lead.status || 'new'}
                            onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                            className={`text-[10px] font-bold uppercase p-2 rounded outline-none cursor-pointer border ${
                                lead.status === 'new' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                lead.status === 'followup' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                lead.status === 'converted' ? 'bg-green-500/10 text-green-500 border-green-500/30' :
                                'bg-gray-500/10 text-gray-500 border-gray-500/30'
                            }`}
                        >
                            <option value="new">NEW (Belum Sapa)</option>
                            <option value="followup">FOLLOW UP</option>
                            <option value="converted">DEAL (Closed)</option>
                            <option value="junk">SAMPAH</option>
                        </select>
                        
                        <a 
                            href={`https://wa.me/${lead.phone}?text=Halo Kak ${lead.name}, terima kasih sudah mampir ke website Mesin Kasir Solo. Ada yang bisa saya bantu untuk produk ${lead.interest ? lead.interest.substring(0, 20) + '...' : 'ini'}?`}
                            target="_blank"
                            className="bg-brand-orange hover:bg-brand-action text-white text-[10px] font-bold py-2 px-3 rounded flex items-center justify-center gap-1 shadow-neon"
                        >
                            <MessageSquare size={12}/> SAPA WA
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
};
