
import React, { useState } from 'react';
import { Target, Phone, MessageCircle, ChevronDown, ChevronUp, Building, MapPin, Tag, Package, Zap, Clock, BarChart3, User } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { useLeadLogic } from './logic';

export const LeadsPanel = () => {
    const { state, updateLeadStatus } = useLeadLogic();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (state.loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    if (state.leads.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                <Target size={32} className="mx-auto mb-2 opacity-50"/>
                Belum ada Shadow Lead yang tertangkap.
            </div>
        );
    }

    // Helper: Parse Notes (Formatted Report)
    const parseReport = (notes?: string) => {
        if (!notes) return {};
        const data: any = {};
        const lines = notes.split('\n');
        lines.forEach(line => {
            const [key, ...val] = line.split(':');
            if (key && val.length > 0) {
                const cleanKey = key.replace(/[^\w]/g, '').toLowerCase();
                data[cleanKey] = val.join(':').trim();
            }
        });
        return data;
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-2 px-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Database Shadow Leads (Abandoned simulations)</p>
                <span className="text-[10px] text-brand-orange font-mono">Total: {state.leads.length}</span>
            </div>

            {state.leads.map(lead => {
                const isExpanded = expandedId === lead.id;
                const details = parseReport(lead.notes);

                return (
                    <div key={lead.id} className={`bg-brand-dark border transition-all rounded-xl overflow-hidden ${isExpanded ? 'border-brand-orange shadow-neon-text/10' : 'border-white/5'}`}>
                        {/* Summary Bar */}
                        <div 
                            onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                            className="p-4 flex flex-col md:flex-row gap-4 items-start md:items-center cursor-pointer hover:bg-white/5 group"
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase border bg-orange-500/10 text-orange-400 border-orange-500/20`}>
                                        {lead.source.replace('sim_shadow_', '').toUpperCase()}
                                    </span>
                                    <span className="text-[9px] text-gray-600 flex items-center gap-1"><Clock size={10}/> {new Date(lead.created_at).toLocaleString('id-ID')}</span>
                                </div>
                                <h4 className={`font-bold text-sm transition-colors ${isExpanded ? 'text-brand-orange' : 'text-white'}`}>{lead.name}</h4>
                                <div className="flex items-center gap-2 text-gray-500 text-xs mt-0.5 font-mono">
                                    <Phone size={12} className="text-brand-orange" /> {lead.phone}
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 w-full md:w-auto shrink-0 border-t md:border-0 border-white/5 pt-3 md:pt-0">
                                <select 
                                    onClick={(e) => e.stopPropagation()}
                                    value={lead.status || 'new'}
                                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                    className={`text-[9px] font-bold uppercase p-1.5 rounded outline-none cursor-pointer border ${
                                        lead.status === 'new' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                        lead.status === 'followup' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                        lead.status === 'converted' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                        'bg-gray-500/10 text-gray-500 border-gray-500/30'
                                    }`}
                                >
                                    <option value="new">🆕 NEW</option>
                                    <option value="followup">🏃 FOLLOW UP</option>
                                    <option value="converted">🤝 DEAL</option>
                                    <option value="junk">🗑️ TRASH</option>
                                </select>
                                <div className="text-gray-600">
                                    {isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}
                                </div>
                            </div>
                        </div>

                        {/* Expanded Content (Details) */}
                        {isExpanded && (
                            <div className="p-5 bg-black/40 border-t border-white/5 animate-fade-in">
                                <div className="grid md:grid-cols-2 gap-8 mb-6">
                                    
                                    {/* INFO IDENTITAS */}
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Building size={12} className="text-brand-orange"/> Profil Bisnis
                                        </h5>
                                        <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
                                            <div className="flex justify-between items-start gap-4">
                                                <span className="text-[10px] text-gray-600 uppercase font-bold shrink-0">Usaha:</span>
                                                <span className="text-xs text-white font-bold text-right">{details.usaha || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-start gap-4">
                                                <span className="text-[10px] text-gray-600 uppercase font-bold shrink-0">Skala:</span>
                                                <span className="text-xs text-blue-400 font-bold">{details.skala || '-'}</span>
                                            </div>
                                            <div className="flex justify-between items-start gap-4">
                                                <span className="text-[10px] text-gray-600 uppercase font-bold shrink-0">Lokasi:</span>
                                                <span className="text-xs text-gray-300 text-right">{details.alamat || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* INFO PILIHAN ARSENAL */}
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                            <Package size={12} className="text-brand-orange"/> Senjata Pilihan
                                        </h5>
                                        <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
                                            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                                <span className="text-[10px] text-gray-600 uppercase font-bold">Paket Utama:</span>
                                                <span className="text-xs text-brand-orange font-bold">{details.paket || '-'}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-gray-600 uppercase font-bold block">Add-ons:</span>
                                                <p className="text-[11px] text-gray-300 leading-relaxed italic">
                                                    {details.addons || 'Tanpa addon tambahan'}
                                                </p>
                                            </div>
                                            <div className="pt-2 border-t border-dashed border-white/10 flex justify-between items-center">
                                                <span className="text-[10px] text-white font-bold">ESTIMASI:</span>
                                                <span className="text-sm text-brand-orange font-bold font-mono">{details.estimasi || '-'}</span>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex gap-2">
                                    <a 
                                        href={`https://wa.me/${lead.phone}?text=Halo Juragan ${lead.name}, gue Amin dari Mesin Kasir Solo. Tadi liat lo lagi simulasi buat *${details.paket || lead.interest}*. Kelihatannya bisnis lo butuh solusi yang sat-set ya? Mau gue bantu detailin speknya biar pas sama budget?`}
                                        target="_blank"
                                        className="flex-1 bg-brand-orange hover:bg-brand-action text-white text-[11px] font-bold py-3 rounded-lg flex items-center justify-center gap-2 shadow-neon transition-all"
                                    >
                                        <MessageCircle size={14}/> SAPA VIA WHATSAPP
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
