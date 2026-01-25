import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    X, Phone, MapPin, Building, History, Sparkles, Zap, 
    Trash2, MessageCircle, Clock, Target, BarChart3, 
    Smartphone, Monitor, Eye, Activity, ShieldAlert
} from 'lucide-react';
import { Customer, LeadStatus, LeadTemperature, PIPELINE_STAGES } from './types';
import { parseIntel } from './shared/utils';
import { useCRMLogic } from './logic';
import { LoadingSpinner } from '../ui';

const TEMPERATURE_CONFIG: { id: LeadTemperature; label: string; color: string }[] = [
    { id: 'hot', label: '🔥 HOT', color: 'text-red-500 border-red-500/30' },
    { id: 'warm', label: '🟠 WARM', color: 'text-brand-orange border-brand-orange/30' },
    { id: 'cold', label: '🔵 COLD', color: 'text-gray-400 border-white/10' }
];

export const CustomerDetailModal = ({ customer, onClose }: { customer: Customer, onClose: () => void }) => {
    const { updateStatus, updateTemperature, deleteCustomer, runRecoveryAI, isGeneratingScript } = useCRMLogic();
    const intel = parseIntel(customer.last_notes);
    const radar = customer.intelligence;
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = originalStyle; };
    }, []);

    const handleWaDirect = () => {
        window.open(`https://wa.me/${customer.phone}`, '_blank');
    };

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8">
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md animate-fade-in transition-all cursor-pointer" onClick={onClose}></div>
            
            <div className="relative w-full max-w-3xl bg-brand-dark border border-brand-orange/40 rounded-[3rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
                
                <div className="p-8 border-b border-white/10 bg-brand-card/50 flex justify-between items-center shrink-0 backdrop-blur-xl">
                    <div className="min-w-0 pr-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span className={`text-xs font-black px-4 py-1 rounded-full uppercase tracking-[0.2em] shadow-neon ${
                                customer.lead_temperature === 'hot' ? 'bg-red-600 text-white' : 'bg-brand-orange text-white'
                            }`}>
                                Surveillance Dossier
                            </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-white truncate font-display tracking-tight">{customer.name}</h3>
                    </div>
                    <div className="flex gap-3 shrink-0">
                        <button 
                            onClick={handleWaDirect}
                            className="p-4 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-2xl transition-all border border-green-500/20 active:scale-90"
                        >
                            <MessageCircle size={24} />
                        </button>
                        <button 
                            onClick={onClose} 
                            className="p-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl transition-all border border-red-500/20 active:scale-90"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-black/20">
                    <div className="space-y-10">
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-brand-card border border-white/5 p-5 rounded-[2rem] shadow-inner group hover:border-blue-500/30 transition-all">
                                <span className="text-gray-600 text-[11px] font-black uppercase tracking-widest block mb-3">Page Views</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-display font-black text-white group-hover:text-blue-400">{radar?.total_views || 0}</p>
                                    <Eye size={20} className="text-blue-500 opacity-40"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-5 rounded-[2rem] shadow-inner group hover:border-purple-500/30 transition-all">
                                <span className="text-gray-600 text-[11px] font-black uppercase tracking-widest block mb-3">Mins Active</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-display font-black text-white group-hover:text-purple-400">{Math.round((radar?.avg_engagement_sec || 0)/60)}</p>
                                    <Clock size={20} className="text-purple-500 opacity-40"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-5 rounded-[2rem] shadow-inner group hover:border-yellow-500/30 transition-all">
                                <span className="text-gray-600 text-[11px] font-black uppercase tracking-widest block mb-3">Confidence</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-display font-black text-white group-hover:text-yellow-500">{customer.lead_temperature === 'hot' ? '90%' : '45%'}</p>
                                    <Zap size={20} className="text-yellow-500 opacity-40"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-5 rounded-[2rem] shadow-inner group hover:border-brand-orange/30 transition-all">
                                <span className="text-gray-600 text-[11px] font-black uppercase tracking-widest block mb-3">ID_MARK</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-3xl font-display font-black text-white group-hover:text-brand-orange">{customer.phone.slice(-4)}</p>
                                    <Target size={20} className="text-brand-orange opacity-40"/>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-brand-card/40 border border-white/5 p-8 rounded-[2.5rem]">
                                <h4 className="text-sm font-black text-gray-500 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
                                    <Activity size={20} className="text-brand-orange"/> Perilaku Digital
                                </h4>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[11px] text-gray-600 font-black uppercase tracking-widest">Target Utama (Halaman)</label>
                                        <p className="text-sm text-white font-mono truncate bg-black/40 p-4 rounded-2xl mt-3 border border-white/5">{radar?.most_visited_path || '/'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <label className="text-[10px] text-gray-600 font-black uppercase block mb-1.5">Tipe Unit</label>
                                            <span className="text-sm text-blue-400 font-black uppercase">{radar?.top_category || 'General'}</span>
                                        </div>
                                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                            <label className="text-[10px] text-gray-600 font-black uppercase block mb-1.5">Pintu Masuk</label>
                                            <span className="text-sm text-green-400 font-black uppercase">{customer.source_origin?.toUpperCase() || 'DIRECT'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-card/40 border border-white/5 p-8 rounded-[2.5rem]">
                                <h4 className="text-sm font-black text-gray-500 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
                                    <BarChart3 size={20} className="text-blue-400"/> Business Blueprint
                                </h4>
                                <div className="space-y-5">
                                    <div className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-4">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Nama Toko</span>
                                        <span className="text-white font-black text-base">{intel.usaha || customer.company_name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-4">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Skala Unit</span>
                                        <span className="text-blue-300 font-black text-base">{intel.skala || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm border-b border-white/[0.03] pb-4">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Estimasi Mahar</span>
                                        <span className="text-green-400 font-black font-mono text-lg">{intel.estimasi || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-start text-sm">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider shrink-0">Lokasi</span>
                                        <span className="text-gray-300 text-right font-medium italic pl-6 leading-relaxed">{intel.alamat || customer.location || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-brand-card/40 border border-white/5 p-8 rounded-[2.5rem]">
                            <h4 className="text-sm font-black text-gray-500 mb-8 flex items-center gap-3 uppercase tracking-[0.2em]">
                                <History size={20} className="text-gray-500"/> Digital Footprint
                            </h4>
                            <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                                {(customer.interaction_history || []).length > 0 ? customer.interaction_history.slice(0, 15).map((event: any, i: number) => (
                                    <div key={i} className="flex gap-5 items-start border-l-2 border-white/10 pl-6 relative group/event">
                                        <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-brand-orange/40 group-hover/event:bg-brand-orange transition-colors"></div>
                                        <div className="flex-1">
                                            <p className="text-base text-gray-300 leading-snug group-hover/event:text-white transition-colors">{event.event}</p>
                                            <p className="text-xs text-gray-600 mt-2 font-mono uppercase font-bold tracking-tighter">{new Date(event.date).toLocaleTimeString('id-ID')} • SYNC_OK</p>
                                        </div>
                                    </div>
                                )) : <p className="text-sm text-gray-700 italic text-center py-10 font-bold uppercase tracking-widest">Belum ada jejak terekam.</p>}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="p-8 bg-brand-card border-t border-white/10 flex flex-col gap-6 shrink-0 z-50 backdrop-blur-xl">
                    <div className="flex gap-4">
                        <div className="flex-1 space-y-2.5">
                            <label className="text-[11px] text-gray-600 font-black uppercase tracking-widest ml-3">Pipeline Status</label>
                            <select 
                                value={customer.lead_status}
                                onChange={(e) => updateStatus(customer.phone, e.target.value as LeadStatus)}
                                className="w-full bg-black/60 border border-white/10 text-sm font-black uppercase tracking-widest rounded-2xl px-5 py-4 outline-none text-white appearance-none focus:border-brand-orange transition-all shadow-inner"
                            >
                                {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 space-y-2.5">
                            <label className="text-[11px] text-gray-600 font-black uppercase tracking-widest ml-3">Lead Temp</label>
                            <select 
                                value={customer.lead_temperature}
                                onChange={(e) => updateTemperature(customer.phone, e.target.value as LeadTemperature)}
                                className="w-full bg-black/60 border border-white/10 text-sm font-black uppercase tracking-widest rounded-2xl px-5 py-4 outline-none text-white appearance-none focus:border-brand-orange transition-all shadow-inner"
                            >
                                {TEMPERATURE_CONFIG.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => runRecoveryAI(customer)}
                            disabled={isGeneratingScript === customer.phone}
                            className="flex-1 bg-brand-gradient text-white rounded-[1.5rem] py-5 font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-neon active:scale-95 disabled:opacity-50 transition-all"
                        >
                            {isGeneratingScript === customer.phone ? <LoadingSpinner size={20}/> : <><Sparkles size={24}/> SAPA SIBOS AI</>}
                        </button>
                        <button 
                            onClick={() => deleteCustomer(customer.phone)}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-[1.5rem] px-6 py-5 transition-all active:scale-90"
                        >
                            <Trash2 size={24} />
                        </button>
                    </div>
                </div>
                
                <div className="p-4 bg-brand-dark text-center shrink-0 border-t border-white/[0.02]">
                    <p className="text-[9px] text-gray-800 font-black uppercase tracking-[0.5em]">Intellectual Property // PT MKS v3.2 PRO</p>
                </div>
            </div>
        </div>,
        document.body
    );
};