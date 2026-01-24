import React from 'react';
import { X, User, Phone, MapPin, Building, Calendar, History, Sparkles, Zap, ArrowRight, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Customer } from './types';
import { formatRupiah } from '../../utils';

export const CustomerDetailModal = ({ customer, onClose }: { customer: Customer, onClose: () => void }) => {
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

                    {/* Intelligence Section */}
                    {customer.ai_probability && (
                        <div className="bg-brand-orange/5 border border-brand-orange/20 rounded-2xl p-6 relative overflow-hidden animate-fade-in">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><Zap size={80} /></div>
                            <h4 className="text-brand-orange font-black text-[10px] uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                                <Sparkles size={14} /> Intelligence Analysis
                            </h4>
                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-5xl font-display font-black text-white leading-none">{customer.ai_probability}%</span>
                                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1">Closing Prob.</span>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                    <p className="text-[9px] text-gray-500 uppercase font-black mb-1">Buyer Persona</p>
                                    <p className="text-sm text-gray-300 font-bold">"{customer.ai_buyer_persona}"</p>
                                </div>
                                <div className="p-3 bg-black/40 rounded-xl border border-brand-orange/20">
                                    <p className="text-[9px] text-brand-orange uppercase font-black mb-1">Winning Strategy</p>
                                    <p className="text-sm text-gray-200 italic leading-relaxed">{customer.ai_closing_strategy}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1"><Building size={10}/> Company</p>
                            <p className="text-sm text-white font-bold">{customer.company_name || '-'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest flex items-center gap-1"><MapPin size={10}/> Location</p>
                            <p className="text-sm text-white font-bold truncate">{customer.location || '-'}</p>
                        </div>
                    </div>

                    {/* Timeline Interaction */}
                    <div>
                        <h4 className="text-white font-bold text-sm mb-6 flex items-center gap-3">
                            <History size={18} className="text-gray-500" /> Digital Footprint
                        </h4>
                        <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-0.5 before:bg-white/5">
                            {customer.interaction_history?.map((event: any, i: number) => (
                                <div key={i} className="relative group">
                                    <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-brand-dark border-2 border-brand-orange group-hover:scale-150 transition-transform"></div>
                                    <p className="text-[10px] text-gray-500 font-mono mb-1">{new Date(event.date).toLocaleString('id-ID')}</p>
                                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/20 transition-all">
                                        <p className="text-xs text-white font-bold">{event.event}</p>
                                        {event.notes && <p className="text-[10px] text-gray-500 mt-1">{event.notes}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="p-8 border-t border-white/5 bg-brand-card flex gap-4">
                    <button className="flex-1 py-4 bg-brand-orange text-white rounded-xl font-bold text-sm shadow-neon hover:shadow-neon-strong transition-all flex items-center justify-center gap-2">
                        <Phone size={18} /> TELEPON SEKARANG
                    </button>
                    <button className="p-4 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:text-brand-orange transition-all">
                        <ShieldCheck size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};