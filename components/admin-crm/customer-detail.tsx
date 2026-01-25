import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
// FIX: Added missing MessageCircle import from lucide-react and removed unused MessageSquare
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
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-6 md:p-8">
            {/* BACKDROP */}
            <div className="fixed inset-0 bg-black/95 backdrop-blur-md animate-fade-in transition-all cursor-pointer" onClick={onClose}></div>
            
            {/* MODAL CONTAINER */}
            <div className="relative w-full max-w-2xl bg-brand-dark border border-brand-orange/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-fade-in">
                
                {/* HEADER (Compact & Analytics Style) */}
                <div className="p-4 border-b border-white/10 bg-brand-card flex justify-between items-center shrink-0">
                    <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest shadow-neon ${
                                customer.lead_temperature === 'hot' ? 'bg-red-600 text-white' : 'bg-brand-orange text-white'
                            }`}>
                                Juragan Intel
                            </span>
                        </div>
                        <h3 className="text-sm font-bold text-white truncate font-display opacity-80">{customer.name}</h3>
                    </div>
                    <div className="flex gap-1 shrink-0">
                        <button 
                            onClick={handleWaDirect}
                            className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-all"
                        >
                            <MessageCircle size={14} />
                        </button>
                        <button 
                            onClick={onClose} 
                            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-black/5">
                    <div className="space-y-6">
                        
                        {/* KPI GRID (Radar Stats) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Views</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-display font-black text-white">{radar?.total_views || 0}</p>
                                    <Eye size={12} className="text-blue-500 opacity-50"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Mins Active</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-display font-black text-white">{Math.round((radar?.avg_engagement_sec || 0)/60)}</p>
                                    <Clock size={12} className="text-purple-500 opacity-50"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">Probability</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-display font-black text-white">{customer.lead_temperature === 'hot' ? '90%' : '45%'}</p>
                                    <Zap size={12} className="text-yellow-500 opacity-50"/>
                                </div>
                            </div>
                            <div className="bg-brand-card border border-white/5 p-3 rounded-xl shadow-inner">
                                <span className="text-gray-600 text-[7px] font-black uppercase block mb-1.5">ID Scramble</span>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-display font-black text-white">{customer.phone.slice(-4)}</p>
                                    <Target size={12} className="text-brand-orange opacity-50"/>
                                </div>
                            </div>
                        </div>

                        {/* BEHAVIOR CHART & BLUEPRINT */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* RADAR INTEL */}
                            <div className="bg-brand-card/40 border border-white/5 p-4 rounded-2xl">
                                <h4 className="text-[8px] font-black text-gray-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                    <Activity size={10} className="text-brand-orange"/> Radar Perilaku
                                </h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[7px] text-gray-600 font-black uppercase">Obsesi Halaman</label>
                                        <p className="text-[10px] text-white font-mono truncate bg-black/40 p-2 rounded mt-1">{radar?.most_visited_path || '/'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                            <label className="text-[7px] text-gray-600 font-black uppercase block">Tipe Unit</label>
                                            <span className="text-[10px] text-blue-400 font-bold">{radar?.top_category || 'General'}</span>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                            <label className="text-[7px] text-gray-600 font-black uppercase block">Entry Point</label>
                                            <span className="text-[10px] text-green-400 font-bold">{customer.source_origin?.toUpperCase() || 'DIRECT'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* BUSINESS BLUEPRINT */}
                            <div className="bg-brand-card/40 border border-white/5 p-4 rounded-2xl">
                                <h4 className="text-[8px] font-black text-gray-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                    <BarChart3 size={10} className="text-blue-400"/> Business Blueprint
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[9px] border-b border-white/[0.03] pb-2">
                                        <span className="text-gray-500 font-bold uppercase">Nama Toko</span>
                                        <span className="text-white font-black">{intel.usaha || customer.company_name || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] border-b border-white/[0.03] pb-2">
                                        <span className="text-gray-500 font-bold uppercase">Skala Unit</span>
                                        <span className="text-blue-300 font-black">{intel.skala || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px] border-b border-white/[0.03] pb-2">
                                        <span className="text-gray-500 font-bold uppercase">Estimasi Cuan</span>
                                        <span className="text-green-400 font-black font-mono">{intel.estimasi || '-'}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[9px]">
                                        <span className="text-gray-500 font-bold uppercase">Lokasi</span>
                                        <span className="text-gray-300 max-w-[120px] truncate">{intel.alamat || customer.location || '-'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* DIGITAL FOOTPRINT (Simplified Timeline) */}
                        <div className="bg-brand-card/40 border border-white/5 p-4 rounded-2xl">
                            <h4 className="text-[8px] font-black text-gray-400 mb-5 flex items-center gap-2 uppercase tracking-widest">
                                <History size={10} className="text-gray-500"/> Digital Footprint
                            </h4>
                            <div className="space-y-4 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                                {(customer.interaction_history || []).length > 0 ? customer.interaction_history.slice(0, 10).map((event: any, i: number) => (
                                    <div key={i} className="flex gap-3 items-start border-l border-white/5 pl-3 relative">
                                        <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-brand-orange/40"></div>
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-300 leading-tight">{event.event}</p>
                                            <p className="text-[7px] text-gray-600 mt-1 font-mono">{new Date(event.date).toLocaleTimeString('id-ID')}</p>
                                        </div>
                                    </div>
                                )) : <p className="text-[9px] text-gray-700 italic text-center py-4">Belum ada jejak terekam.</p>}
                            </div>
                        </div>

                    </div>
                </div>

                {/* FOOTER ACTIONS (Command Center) */}
                <div className="p-4 bg-brand-card border-t border-white/10 flex flex-col gap-3 shrink-0 z-50">
                    <div className="flex gap-2">
                        <select 
                            value={customer.lead_status}
                            onChange={(e) => updateStatus(customer.phone, e.target.value as LeadStatus)}
                            className="flex-1 bg-black/40 border border-white/10 text-[9px] font-black uppercase rounded-lg px-3 py-2 outline-none text-white appearance-none"
                        >
                            {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                        <select 
                            value={customer.lead_temperature}
                            onChange={(e) => updateTemperature(customer.phone, e.target.value as LeadTemperature)}
                            className="flex-1 bg-black/40 border border-white/10 text-[9px] font-black uppercase rounded-lg px-3 py-2 outline-none text-white appearance-none"
                        >
                            {TEMPERATURE_CONFIG.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => runRecoveryAI(customer)}
                            disabled={isGeneratingScript === customer.phone}
                            className="flex-1 bg-brand-gradient text-white rounded-xl py-3 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-neon active:scale-95 disabled:opacity-50"
                        >
                            {isGeneratingScript === customer.phone ? <LoadingSpinner size={12}/> : <><Sparkles size={14}/> SAPA SIBOS AI</>}
                        </button>
                        <button 
                            onClick={() => deleteCustomer(customer.phone)}
                            className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white rounded-xl px-4 py-3 transition-all"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
                
                {/* SYSTEM ID */}
                <div className="p-2 bg-brand-dark text-center shrink-0 border-t border-white/[0.02]">
                    <p className="text-[6px] text-gray-800 font-black uppercase tracking-[0.4em]">Surveillance Dossier // PT MKS v3.2</p>
                </div>
            </div>
        </div>,
        document.body
    );
};