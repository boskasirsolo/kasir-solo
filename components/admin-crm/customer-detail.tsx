
import React from 'react';
import { 
    X, Phone, MapPin, Building, History, Sparkles, Zap, 
    ShieldCheck, AlertTriangle, Briefcase, Trash2, 
    MessageSquare, Clock, Target, BarChart3, ChevronRight 
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

    const handleWaDirect = () => {
        window.open(`https://wa.me/${customer.phone}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md animate-fade-in" onClick={onClose}></div>
            
            {/* Modal Dossier */}
            <div className="relative w-full max-w-4xl bg-brand-dark border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col h-[90vh] overflow-hidden animate-scale-up">
                
                {/* --- A. HEADER: PROFIL TEMPUR --- */}
                <div className="p-8 bg-brand-card border-b border-white/5 shrink-0">
                    <button onClick={onClose} className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    
                    <div className="flex items-center gap-8">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl shrink-0 border-4 transition-all ${
                            customer.lead_temperature === 'hot' ? 'bg-red-500/20 border-red-500/40 text-red-500 shadow-neon-text/20' : 
                            'bg-white/5 border-white/10 text-gray-500'
                        }`}>
                            {customer.name.charAt(0)}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-display font-black text-white truncate">{customer.name}</h2>
                                {customer.is_indecisive_buyer && (
                                    <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse shadow-neon">
                                        STUCK IN CHECKOUT
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
                                <span className="flex items-center gap-1.5"><Phone size={14} className="text-brand-orange"/> {customer.phone}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14}/> Joined {new Date(customer.created_at).toLocaleDateString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- B. BODY: INTELLIGENCE FILE (Scrollable) --- */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-black/20">
                    <div className="grid md:grid-cols-2 gap-10">
                        
                        {/* LEFT COL: RADAR & BEHAVIOR */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                                    <Target size={14} className="text-brand-orange" /> Radar Intelligence
                                </h4>
                                <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.03]">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Halaman Terlama</span>
                                        <span className="text-xs text-brand-orange font-bold font-mono">/{radar?.most_visited_path.split('/').pop()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-white/[0.03]">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Total Klik</span>
                                        <span className="text-xs text-white font-black">{radar?.total_views || 0} Aktivitas</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-gray-500 font-bold uppercase">Lama Aktif</span>
                                        <span className="text-xs text-blue-400 font-bold">{Math.round((radar?.avg_engagement_sec || 0)/60)} Menit</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                                    <History size={14} className="text-gray-600" /> Digital Footprint
                                </h4>
                                <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                                    {(customer.interaction_history || []).length > 0 ? customer.interaction_history.map((event: any, i: number) => (
                                        <div key={i} className="relative group">
                                            <div className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full bg-brand-dark border-2 border-brand-orange group-hover:scale-110 transition-transform"></div>
                                            <p className="text-[9px] text-gray-600 font-mono mb-1">{new Date(event.date).toLocaleTimeString('id-ID')}</p>
                                            <div className="text-xs text-gray-300 font-medium">{event.event}</div>
                                        </div>
                                    )) : <p className="text-xs text-gray-700 italic">Belum ada jejak terekam...</p>}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: BUSINESS BLUEPRINT */}
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-5 flex items-center gap-2">
                                    <Briefcase size={14} className="text-blue-400" /> Business Blueprint
                                </h4>
                                <div className="bg-blue-500/[0.02] border border-blue-500/10 rounded-3xl p-6 space-y-5">
                                    <div className="space-y-1">
                                        <span className="text-[8px] text-gray-600 font-black uppercase">Usaha / Toko</span>
                                        <p className="text-sm text-white font-bold">{intel.usaha || customer.company_name || '-'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[8px] text-gray-600 font-black uppercase">Skala</span>
                                            <p className="text-xs text-blue-300 font-bold">{intel.skala || '-'}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <span className="text-[8px] text-gray-600 font-black uppercase">Estimasi Budget</span>
                                            <p className="text-xs text-green-400 font-black font-mono">{intel.estimasi || '-'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 pt-4 border-t border-white/[0.03]">
                                        <span className="text-[8px] text-gray-600 font-black uppercase">Target Paket</span>
                                        <p className="text-xs text-gray-300 leading-relaxed italic">"{intel.paket || 'Belum pilih paket spesifik'}"</p>
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[8px] text-gray-600 font-black uppercase">Lokasi</span>
                                        <p className="text-xs text-gray-400 flex items-center gap-1.5"><MapPin size={10}/> {intel.alamat || customer.location || 'Indonesia'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-5 bg-brand-orange/5 border border-brand-orange/20 rounded-2xl">
                                <h5 className="text-brand-orange font-black text-[9px] uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles size={12}/> Strategy Insight</h5>
                                <p className="text-xs text-gray-300 leading-relaxed">
                                    {customer.is_indecisive_buyer 
                                        ? "⚠️ Juragan ini lagi ragu di checkout. Kasih pancingan 'Diskon Ongkir' atau 'Bonus Kertas Roll' pasti luluh." 
                                        : "Tawarin Paket Hardware PRO karena skala usahanya Menengah. Dia butuh printer dapur tambahan."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- C. FOOTER: COMMAND CENTER (Sticky) --- */}
                <div className="p-6 md:p-8 bg-brand-card border-t border-white/10 flex flex-col md:flex-row items-center gap-4 md:gap-6 shrink-0 z-20">
                    
                    {/* Status & Temp Controls */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <select 
                            value={customer.lead_status}
                            onChange={(e) => updateStatus(customer.phone, e.target.value as LeadStatus)}
                            className="bg-black/40 border border-white/10 text-[10px] font-black uppercase rounded-xl px-4 py-3 outline-none focus:border-brand-orange transition-all text-white"
                        >
                            {PIPELINE_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                        <select 
                            value={customer.lead_temperature}
                            onChange={(e) => updateTemperature(customer.phone, e.target.value as LeadTemperature)}
                            className="bg-black/40 border border-white/10 text-[10px] font-black uppercase rounded-xl px-4 py-3 outline-none focus:border-brand-orange transition-all text-white"
                        >
                            {TEMPERATURE_CONFIG.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                        </select>
                    </div>

                    <div className="h-10 w-px bg-white/5 hidden md:block"></div>

                    {/* Execution Actions */}
                    <div className="flex-1 flex gap-3 w-full">
                        <button 
                            onClick={() => runRecoveryAI(customer)}
                            disabled={isGeneratingScript === customer.phone}
                            className="flex-1 bg-brand-gradient text-white rounded-xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-neon-strong active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGeneratingScript === customer.phone ? <LoadingSpinner size={16}/> : <><Sparkles size={18}/> SAPA SIBOS AI</>}
                        </button>
                        <button 
                            onClick={handleWaDirect}
                            className="bg-green-600/10 text-green-500 border-2 border-green-500/20 hover:bg-green-600 hover:text-white rounded-xl px-6 py-4 transition-all active:scale-95"
                            title="WhatsApp Langsung"
                        >
                            <MessageSquare size={20} />
                        </button>
                        <button 
                            onClick={() => deleteCustomer(customer.phone)}
                            className="bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600 hover:text-white rounded-xl px-6 py-4 transition-all"
                            title="Buang Lead"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
