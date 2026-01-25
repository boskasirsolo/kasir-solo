
import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
    X, Phone, MapPin, Building, History, Sparkles, Zap, 
    Trash2, MessageCircle, Clock, Target, BarChart3, 
    Smartphone, Monitor, Eye, Activity, ShieldAlert, Globe 
} from 'lucide-react';
import { Customer, LeadStatus, LeadTemperature, PIPELINE_STAGES } from './types';
import { parseIntel } from './shared/utils';
import { LoadingSpinner } from '../ui';

const TEMPERATURE_CONFIG: { id: LeadTemperature; label: string; color: string }[] = [
    { id: 'hot', label: '🔥 HOT', color: 'text-red-500 border-red-500/30' },
    { id: 'warm', label: '🟠 WARM', color: 'text-brand-orange border-brand-orange/30' },
    { id: 'cold', label: '🔵 COLD', color: 'text-gray-400 border-white/10' }
];

interface CustomerDetailModalProps {
    customer: Customer;
    onClose: () => void;
    updateStatus: (phone: string, status: LeadStatus) => void | Promise<void>;
    updateTemperature: (phone: string, temp: LeadTemperature) => void | Promise<void>;
    deleteCustomer: (phone: string) => void | Promise<void>;
    runRecoveryAI: (customer: Customer) => void | Promise<void>;
    isGeneratingScript: string | null;
}

export const CustomerDetailModal = ({ 
    customer, 
    onClose,
    updateStatus,
    updateTemperature,
    deleteCustomer,
    runRecoveryAI,
    isGeneratingScript
}: CustomerDetailModalProps) => {
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
            
            <div className="relative w-full max-w-2xl bg-brand-dark border border-brand-orange/40 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.9)] flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
                
                {/* MODAL HEADER */}
                <div className="p-6 border-b border-white/10 bg-brand-card/50 flex justify-between items-center shrink-0 backdrop-blur-xl">
                    <div className="min-w-0 pr-6">
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-[0.2em] shadow-neon ${
                                customer.lead_temperature === 'hot' ? 'bg-red-600 text-white' : 'bg-brand-orange text-white'
                            }`}>
                                WA • {customer.phone}
                            </span>
                            {customer.is_indecisive_buyer && (
                                <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full animate-pulse">GALAU_MODE</span>
                            )}
                        </div>
                        <h3 className="text-xl md:text-2xl font-black text-white truncate font-display tracking-tight leading-none">{customer.name}</h3>
                    </div>
                    <div className="flex gap-2 shrink-0">
                        <button 
                            onClick={handleWaDirect}
                            className="p-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-xl transition-all border border-green-500/20 active:scale-90"
                        >
                            <MessageCircle size={20} />
                        </button>
                        <button 
                            onClick={onClose} 
                            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all border border-red-500/20 active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-black/20">
                    <div className="space-y-8">
                        
                        {/* KPI GRID */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-brand-card border border-white/5 p-4 rounded-2xl shadow-inner group transition-all">
                                <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-2">Total Hits</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-xl font-display font-black text-white group-hover:text-blue-400">{radar?.total_views || 0}</p>
                                    <Eye size={16} className="text-blue-500 opacity-40"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-4 rounded-2xl shadow-inner group transition-all">
                                <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-2">Asal Trafik</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-white truncate group-hover:text-purple-400 max-w-[60px]">{customer.source_origin?.toUpperCase() || 'DIRECT'}</p>
                                    <Globe size={16} className="text-purple-500 opacity-40"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-4 rounded-2xl shadow-inner group transition-all">
                                <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-2">Suhu Intel</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-white uppercase">{customer.lead_temperature}</p>
                                    <Zap size={16} className="text-yellow-500 opacity-40"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-4 rounded-2xl shadow-inner group transition-all">
                                <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest block mb-2">Status Radar</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-green-500">LIVE</p>
                                    <Target size={16} className="text-brand-orange opacity-40"/>
                                </div>
                            </div>
                        </div>

                        {/* ANALYTICS & DATA INPUT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-brand-card/40 border border-white/5 p-6 rounded-[2rem]">
                                <h4 className="text-[11px] font-black text-gray-500 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <Activity size={16} className="text-brand-orange"/> Analisa Perilaku
                                </h4>
                                <div className="space-y-5">
                                    <div>
                                        <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest">Halaman Favorit</label>
                                        <p className="text-xs text-white font-mono truncate bg-black/40 p-3 rounded-xl mt-2 border border-white/5" title={radar?.most_visited_path}>{radar?.most_visited_path || '/'}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <label className="text-[9px] text-gray-600 font-black uppercase block mb-1">Niat Utama Terdeteksi</label>
                                        <span className="text-xs text-blue-400 font-black uppercase">{customer.detected_category?.toUpperCase() || 'MENCARI SOLUSI'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-brand-card/40 border border-white/5 p-6 rounded-[2rem]">
                                <h4 className="text-[11px] font-black text-gray-500 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                    <BarChart3 size={16} className="text-blue-400"/> Data Input (Form)
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs border-b border-white/[0.03] pb-3">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Usaha</span>
                                        <span className="text-white font-black">{intel.usaha || customer.company_name || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs border-b border-white/[0.03] pb-3">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider">Estimasi</span>
                                        <span className="text-green-400 font-black font-mono text-sm">{intel.estimasi || 'Belum dihitung'}</span>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Lokasi Juragan</span>
                                        <span className="text-gray-300 font-medium italic bg-black/20 p-2 rounded leading-snug line-clamp-2">{intel.alamat || customer.location || 'Tidak tersedia'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* LIVE CHRONOLOGY */}
                        <div className="bg-brand-card/40 border border-white/5 p-6 rounded-[2rem]">
                            <h4 className="text-[11px] font-black text-gray-500 mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                                <History size={16} className="text-gray-500"/> Kronologi Aktivitas (Live)
                            </h4>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                                {(customer.interaction_history || []).length > 0 ? customer.interaction_history.map((event: any, i: number) => (
                                    <div key={i} className="flex gap-4 items-start border-l border-white/10 pl-4 relative group/event">
                                        <div className="absolute -left-[3px] top-1.5 w-1.5 h-1.5 rounded-full bg-brand-orange/40 group-hover/event:bg-brand-orange transition-colors"></div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-400 leading-snug group-hover/event:text-white transition-colors">{event.event}</p>
                                            <p className="text-[9px] text-gray-700 mt-1 font-mono uppercase font-bold tracking-tighter">
                                                {new Date(event.date).toLocaleString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="py-10 text-center opacity-30 flex flex-col items-center">
                                        <History size={32} className="mb-2" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada aktivitas terekam.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* MODAL FOOTER - ACTIONS */}
                <div className="p-6 bg-brand-card border-t border-white/10 flex flex-col gap-4 shrink-0 z-50 backdrop-blur-xl">
                    <div className="flex gap-3">
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest ml-1">Status Negosiasi</label>
                            <select 
                                value={customer.lead_status}
                                onChange={(e) => updateStatus(customer.phone, e.target.value as LeadStatus)}
                                className="w-full bg-black/60 border border-white/10 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 outline-none text-white appearance-none focus:border-brand-orange transition-all"
                            >
                                {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </select>
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <label className="text-[10px] text-gray-600 font-black uppercase tracking-widest ml-1">Label Prioritas</label>
                            <select 
                                value={customer.lead_temperature}
                                onChange={(e) => updateTemperature(customer.phone, e.target.value as LeadTemperature)}
                                className="w-full bg-black/60 border border-white/10 text-[11px] font-black uppercase tracking-widest rounded-xl px-4 py-3 outline-none text-white appearance-none focus:border-brand-orange transition-all"
                            >
                                {TEMPERATURE_CONFIG.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button 
                            onClick={() => runRecoveryAI(customer)}
                            disabled={isGeneratingScript === customer.phone}
                            className="flex-1 bg-brand-gradient text-white rounded-xl py-3.5 font-black text-xs uppercase tracking-[0.1em] flex items-center justify-center gap-3 shadow-neon active:scale-95 disabled:opacity-50 transition-all"
                        >
                            {isGeneratingScript === customer.phone ? <LoadingSpinner size={16}/> : <><Sparkles size={20}/> RAKIT PESAN AI</>}
                        </button>
                        <button 
                            onClick={() => deleteCustomer(customer.phone)}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-xl px-5 py-3.5 transition-all active:scale-90"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>
                
                <div className="p-3 bg-brand-dark text-center shrink-0 border-t border-white/[0.02]">
                    <p className="text-[8px] text-gray-800 font-black uppercase tracking-[0.4em]">Proprietary OS // PT MKS v3.5</p>
                </div>
            </div>
        </div>,
        document.body
    );
};
