
import React from 'react';
import { X, User, Phone, MapPin, Building, Calendar, History, Sparkles, Zap, ArrowRight, ShieldCheck, AlertTriangle, Briefcase, DollarSign, Target } from 'lucide-react';
import { Customer } from './types';
import { parseIntel } from './shared/utils';

export const CustomerDetailModal = ({ customer, onClose }: { customer: Customer, onClose: () => void }) => {
    const intel = parseIntel(customer.last_notes);
    const radar = customer.intelligence;

    return (
        <div className="fixed inset-0 z-[10000] flex justify-end animate-fade-in">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-xl bg-brand-dark border-l border-white/10 h-full shadow-2xl flex flex-col animate-slide-in-right">
                
                {/* Header Profile */}
                <div className="p-8 bg-brand-card border-b border-white/5 relative shrink-0">
                    <button onClick={onClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-3xl bg-brand-orange/10 border-2 border-brand-orange/30 flex items-center justify-center text-brand-orange text-3xl font-black shadow-neon-text/10">
                            {customer.name.charAt(0)}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-2xl font-display font-black text-white">{customer.name}</h2>
                                {customer.is_indecisive_buyer && <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>}
                            </div>
                            <p className="text-gray-500 font-mono text-sm">{customer.phone}</p>
                            <div className="flex gap-2 mt-3">
                                <span className={`px-2 py-0.5 rounded text-[9px] font-black border ${
                                    customer.lead_temperature === 'hot' || customer.is_indecisive_buyer ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                } uppercase tracking-widest`}>{customer.is_indecisive_buyer ? 'URGENT' : customer.lead_temperature}</span>
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-black text-gray-400 uppercase tracking-widest">{customer.lead_status}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                    
                    {/* SURVEILLANCE ALERT */}
                    {customer.is_indecisive_buyer && (
                        <div className="bg-red-600/10 border border-red-600/30 p-6 rounded-2xl relative overflow-hidden animate-pulse">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><AlertTriangle size={80} /></div>
                            <h4 className="text-red-500 font-black text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                                <Zap size={14} /> Surveillance Intel
                            </h4>
                            <p className="text-sm text-gray-300 font-bold leading-relaxed mb-2">
                                "Bos, juragan ini udah nongkrong lama di checkout tapi belum bayar. Sepertinya butuh dorongan chat dari lo."
                            </p>
                            <span className="text-[10px] text-gray-500 font-mono italic">Detected: Stationary on /checkout for 3m+</span>
                        </div>
                    )}

                    {/* Business Intelligence Block */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm flex items-center gap-3 uppercase tracking-widest">
                            <Briefcase size={18} className="text-brand-orange" /> Business Specification
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Nama Usaha</p>
                                <p className="text-sm text-white font-bold truncate">{intel.usaha || customer.company_name || '-'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Skala Bisnis</p>
                                <p className="text-sm text-white font-bold">{intel.skala || customer.business_scale || '-'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Estimasi Budget</p>
                                <p className="text-sm text-green-400 font-black font-mono">{intel.estimasi || '-'}</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                                <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Lokasi Proyek</p>
                                <p className="text-sm text-white font-bold truncate">{intel.alamat || customer.location || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Radar Observation */}
                    {radar && (
                        <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
                            <h4 className="text-blue-400 font-black text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                                <Target size={14} /> Radar Observation
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Halaman Terlama:</span>
                                    <span className="text-xs text-white font-bold bg-white/5 px-2 py-0.5 rounded border border-white/10">/{radar.most_visited_path.split('/').pop()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Total Interaksi:</span>
                                    <span className="text-xs text-white font-bold">{radar.total_views} Klik</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Status Pipeline:</span>
                                    <span className="text-[10px] text-brand-orange font-black uppercase">{customer.lead_status}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Timeline Interaction */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-3 uppercase tracking-widest">
                            <History size={18} className="text-gray-500" /> Digital Footprint
                        </h4>
                        <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            {customer.interaction_history?.length > 0 ? customer.interaction_history.map((event: any, i: number) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-brand-dark border-2 border-brand-orange group-hover:scale-150 transition-transform"></div>
                                    <p className="text-[10px] text-gray-500 font-mono mb-1">{new Date(event.date).toLocaleString('id-ID')}</p>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/20 transition-all">
                                        <p className="text-xs text-white font-bold">{event.event}</p>
                                        {event.notes && <p className="text-[10px] text-gray-500 mt-1 italic">"{event.notes}"</p>}
                                    </div>
                                </div>
                            )) : (
                                <div className="py-4 text-center text-gray-600 text-xs italic">Belum ada histori terekam.</div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-white/5 bg-brand-card flex gap-4">
                    <button className="flex-1 py-4 bg-brand-orange text-white rounded-xl font-bold text-sm shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2 active:scale-95">
                        <Phone size={18} /> HUBUNGI JURAGAN
                    </button>
                    <button 
                        onClick={() => window.open(`https://wa.me/${customer.phone}`, '_blank')}
                        className="p-4 bg-green-600/10 text-green-500 border border-green-500/20 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                        <Briefcase size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};
