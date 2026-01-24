import React from 'react';
import { ShoppingCart, Ghost, Zap, MapPin, Loader2, Sparkles, AlertCircle, Eye } from 'lucide-react';
import { Customer } from '../types';
import { parseIntel } from '../shared/utils';

interface ShadowModuleProps {
    leads: Customer[];
    onRescue: (c: Customer) => void;
    isRescuingId: string | null;
}

export const ShadowModule = ({ leads, onRescue, isRescuingId }: ShadowModuleProps) => {
    if (leads.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-black/20 rounded-3xl border-2 border-dashed border-white/5 opacity-50">
                <Ghost size={48} className="mb-4 text-gray-700" />
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Semua Juragan Udah Checkout. Aman!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map(lead => {
                    const intel = parseIntel(lead.last_notes);
                    const isHot = lead.lead_temperature === 'hot' || lead.is_indecisive_buyer;

                    return (
                        <div key={lead.phone} className={`bg-brand-card border rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-neon-strong group ${isHot ? 'border-red-600/40 bg-red-600/5' : 'border-white/5'}`}>
                            {lead.is_indecisive_buyer && (
                                <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg animate-pulse flex items-center gap-1 z-10">
                                    <Eye size={8} /> RADAR_STUCK
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate">{lead.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{lead.phone}</p>
                                </div>
                                <div className={`p-2 rounded-lg ${lead.is_indecisive_buyer ? 'bg-blue-500/20 text-blue-400' : 'bg-black/40 text-gray-600'}`}>
                                    <ShoppingCart size={14} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Status Terakhir:</p>
                                    <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                                        {lead.is_indecisive_buyer 
                                            ? `Diem di ${lead.intelligence?.most_visited_path?.split('/').pop()} > 3 menit.` 
                                            : (intel.paket || "Lirik-lirik produk...")}
                                    </p>
                                    <p className="text-[10px] text-brand-orange font-bold mt-2">{intel.estimasi || `${Math.round((lead.intelligence?.avg_engagement_sec || 0)/60)} menit aktif`}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <MapPin size={10} className="text-gray-700"/>
                                    <span className="truncate">{intel.alamat || 'Lokasi tidak terlacak'}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onRescue(lead)}
                                disabled={isRescuingId === lead.phone}
                                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-neon transition-all ${lead.is_indecisive_buyer ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-brand-orange hover:bg-brand-action text-white'}`}
                            >
                                {isRescuingId === lead.phone ? <Loader2 size={14} className="animate-spin"/> : <><Sparkles size={14}/> {lead.is_indecisive_buyer ? 'SURVEILLANCE RESCUE' : 'RESCUE WITH AI'}</>}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 items-center">
                 <Zap size={20} className="text-brand-orange animate-pulse" />
                 <p className="text-[10px] text-gray-400 leading-relaxed italic">
                    <strong>Surveillance Mode:</strong> SIBOS AI sekarang memantau orang yang 'bertapa' terlalu lama di checkout. Langsung sapa pake jurus maut (Diskon tipis) biar mereka gak kabur ke toko sebelah.
                 </p>
            </div>
        </div>
    );
};