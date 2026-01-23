
import React from 'react';
import { ShoppingCart, Ghost, Zap, MessageCircle, MapPin, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { Customer } from './types';
import { parseIntel } from './logic';
import { formatRupiah } from '../../utils';

export const RecoveryPanel = ({ leads, onRescue, isRescuingId }: { leads: Customer[], onRescue: (c: Customer) => void, isRescuingId: string | null }) => {
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
            <div className="flex items-center gap-3 px-2">
                <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
                    <AlertCircle size={20} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Abandoned Carts (Penyelamatan Cuan)</h3>
                    <p className="text-[10px] text-gray-500 uppercase font-black">Data Juragan yang batal checkout tengah jalan</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads.map(lead => {
                    const intel = parseIntel(lead.last_notes);
                    // Fix: Changed lead_temperature to temperature to match Customer interface
                    const isHot = lead.temperature === 'hot';

                    return (
                        <div key={lead.phone} className={`bg-brand-card border rounded-2xl p-5 relative overflow-hidden transition-all hover:shadow-neon-strong group ${isHot ? 'border-red-600/40 bg-red-600/5' : 'border-white/5'}`}>
                            {isHot && (
                                <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-bl-lg animate-pulse">
                                    HOT LEAD
                                </div>
                            )}

                            <div className="flex items-start justify-between mb-4">
                                <div className="min-w-0">
                                    <h4 className="text-white font-bold text-sm truncate">{lead.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{lead.phone}</p>
                                </div>
                                <div className="p-2 bg-black/40 rounded-lg text-gray-600">
                                    <ShoppingCart size={14} />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-gray-500 uppercase font-bold mb-1">Barang Yang Ditinggal:</p>
                                    <p className="text-xs text-white font-medium line-clamp-2 leading-relaxed">
                                        {intel.paket || "Cek Detail..."}
                                    </p>
                                    <p className="text-[10px] text-brand-orange font-bold mt-2">{intel.estimasi}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 text-[10px] text-gray-500">
                                    <MapPin size={10} className="text-gray-700"/>
                                    <span className="truncate">{intel.alamat || 'Lokasi tidak terlacak'}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => onRescue(lead)}
                                disabled={isRescuingId === lead.phone}
                                className="w-full py-3 bg-brand-orange hover:bg-brand-action text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-neon transition-all"
                            >
                                {isRescuingId === lead.phone ? <Loader2 size={14} className="animate-spin"/> : <><Sparkles size={14}/> RESCUE WITH AI</>}
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex gap-4 items-center">
                 <Zap size={20} className="text-brand-orange animate-pulse" />
                 <p className="text-[10px] text-gray-400 leading-relaxed italic">
                    <strong>Tips Penyelamatan:</strong> Jangan tunda lebih dari 2x24 jam. Biasanya mereka cuma butuh "disapa" dan dikasih diskon ongkir biar berani transfer.
                 </p>
            </div>
        </div>
    );
};
