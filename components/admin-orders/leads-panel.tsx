import React, { useState } from 'react';
import { Target, Phone, MessageCircle, Building, Package, Clock, Trash2, Cpu, Globe, ArrowRight, MousePointer2, ChevronDown, ChevronUp, User, MapPin, Tag, BarChart3, Zap } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { useLeadLogic } from './logic';
import { Lead } from '../../types';

// --- HELPER: Intel Parser (Membedah data dari string notes) ---
const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = {};
    const lines = notes.split('\n');
    lines.forEach(line => {
        if (line.includes('🏢USAHA:')) data.usaha = line.split('🏢USAHA:')[1]?.trim();
        if (line.includes('⚖️SKALA:')) data.skala = line.split('⚖️SKALA:')[1]?.trim();
        if (line.includes('📍ALAMAT:')) data.alamat = line.split('📍ALAMAT:')[1]?.trim();
        if (line.includes('📦PAKET:')) data.paket = line.split('📦PAKET:')[1]?.trim();
        if (line.includes('🚀ADDONS:')) data.addons = line.split('🚀ADDONS:')[1]?.trim();
        if (line.includes('💰ESTIMASI:')) data.estimasi = line.split('💰ESTIMASI:')[1]?.trim();
        if (line.includes('🏷️KATEGORI:')) data.kategori = line.split('🏷️KATEGORI:')[1]?.trim();
    });
    return data;
};

// --- COMPONENT: Hardware Lead Card (Accordion Industrial) ---
// FIX: Using React.FC to handle 'key' prop and allowing Promise/any for callbacks
const HardwareLeadCard: React.FC<{ 
    lead: Lead, 
    onDelete: (id: number) => void | Promise<void>,
    isExpanded: boolean,
    onToggle: () => void | any
}> = ({ 
    lead, 
    onDelete, 
    isExpanded, 
    onToggle 
}) => {
    const intel = parseIntel(lead.notes);
    
    return (
        <div className={`bg-brand-card border-l-4 transition-all duration-300 overflow-hidden rounded-r-xl mb-3 ${
            isExpanded ? 'border-brand-orange shadow-neon-strong' : 'border-brand-orange/40 border-y border-r border-white/5 hover:border-brand-orange/60'
        }`}>
            {/* ACCORDION HEADER */}
            <div 
                onClick={onToggle}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-brand-orange/5 group"
            >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${isExpanded ? 'bg-brand-orange text-white' : 'bg-black/40 text-brand-orange border border-brand-orange/20'}`}>
                        <Package size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h4 className={`font-bold text-sm truncate ${isExpanded ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>{lead.name}</h4>
                            <span className="text-[8px] px-1.5 py-0.5 rounded bg-brand-orange/10 text-brand-orange border border-brand-orange/20 font-black uppercase">Arsenal</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                            <Clock size={10}/> {new Date(lead.created_at!).toLocaleString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Est. Budget</span>
                        <span className="text-xs font-bold text-brand-orange font-mono">{intel.estimasi || '-'}</span>
                    </div>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
                        className="p-1.5 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded transition-all"
                    >
                        <Trash2 size={14}/>
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-brand-orange" /> : <ChevronDown size={18} className="text-gray-600" />}
                </div>
            </div>

            {/* ACCORDION CONTENT */}
            {isExpanded && (
                <div className="p-5 border-t border-white/5 bg-black/40 animate-fade-in">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {/* IDENTITAS */}
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={12} className="text-brand-orange"/> Profil Juragan
                            </h5>
                            <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 flex items-center gap-1"><Building size={10}/> Usaha:</span>
                                    <span className="text-xs text-white font-bold text-right">{intel.usaha || '-'}</span>
                                </div>
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 flex items-center gap-1"><BarChart3 size={10}/> Skala:</span>
                                    <span className="text-xs text-brand-orange font-bold text-right">{intel.skala || '-'}</span>
                                </div>
                                <div className="flex justify-between items-start gap-4">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0 flex items-center gap-1"><MapPin size={10}/> Lokasi:</span>
                                    <span className="text-xs text-gray-300 text-right">{intel.alamat || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* PILIHAN BARANG */}
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                                <Zap size={12} className="text-brand-orange"/> Senjata Pilihan
                            </h5>
                            <div className="bg-brand-dark/50 p-4 rounded-xl border border-white/5 space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold">Paket Utama:</span>
                                    <span className="text-xs text-white font-bold">{intel.paket || 'Custom Order'}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-gray-500 uppercase font-bold block">Add-ons:</span>
                                    <p className="text-[10px] text-gray-400 leading-relaxed italic">
                                        {intel.addons || 'Hanya paket dasar.'}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-dashed border-white/10 flex justify-between items-center">
                                    <span className="text-[10px] text-brand-orange font-black">ESTIMASI MAHAR:</span>
                                    <span className="text-sm text-brand-orange font-black font-mono">{intel.estimasi || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a 
                        href={`https://wa.me/${lead.phone}?text=Halo Juragan ${lead.name}, gue Amin dari Mesin Kasir Solo. Tadi liat lo lagi liat-liat paket *${intel.paket || 'kasir'}*. Unitnya ready di gudang nih, mau gue video call buat liat barangnya?`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-brand-orange hover:bg-brand-action text-white text-[11px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-neon transition-all"
                    >
                        <MessageCircle size={16}/> GAS FOLLOW UP VIA WHATSAPP
                    </a>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: Service Lead Card (Accordion Blueprint) ---
// FIX: Using React.FC to handle 'key' prop and allowing Promise/any for callbacks
const ServiceLeadCard: React.FC<{ 
    lead: Lead, 
    onDelete: (id: number) => void | Promise<void>,
    isExpanded: boolean,
    onToggle: () => void | any
}> = ({ 
    lead, 
    onDelete, 
    isExpanded, 
    onToggle 
}) => {
    const intel = parseIntel(lead.notes);
    const serviceType = lead.source.replace('sim_shadow_', '').toUpperCase();

    return (
        <div className={`transition-all duration-300 rounded-xl overflow-hidden mb-3 backdrop-blur-sm border ${
            isExpanded ? 'bg-brand-dark/95 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'bg-brand-dark/60 border-blue-500/20 hover:border-blue-500/40'
        }`}>
            {/* ACCORDION HEADER */}
            <div 
                onClick={onToggle}
                className="p-4 flex items-center justify-between cursor-pointer relative group"
            >
                {/* Background Grid Pattern (Blueprint) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:15px_15px]"></div>
                
                <div className="flex items-center gap-4 flex-1 min-w-0 relative z-10">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isExpanded ? 'bg-blue-600 text-white shadow-lg' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                        <Cpu size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                            <h4 className={`font-display font-bold text-sm truncate ${isExpanded ? 'text-white' : 'text-gray-300'}`}>{lead.name}</h4>
                            <span className="text-[7px] px-1.5 py-0.5 rounded border border-blue-500/30 text-blue-400 font-mono tracking-widest">{serviceType}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] text-gray-600 font-mono">
                            <span className="flex items-center gap-1"><Phone size={10}/> {lead.phone}</span>
                            <span className="flex items-center gap-1"><Clock size={10}/> {new Date(lead.created_at!).toLocaleDateString('id-ID')}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }}
                        className="p-1.5 text-gray-700 hover:text-red-400 transition-all"
                    >
                        <Trash2 size={14}/>
                    </button>
                    {isExpanded ? <ChevronUp size={18} className="text-blue-400" /> : <ChevronDown size={18} className="text-gray-600" />}
                </div>
            </div>

            {/* ACCORDION CONTENT */}
            {isExpanded && (
                <div className="p-6 border-t border-blue-500/10 relative animate-fade-in">
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:25px_25px]"></div>
                    
                    <div className="grid md:grid-cols-2 gap-8 mb-6 relative z-10">
                        {/* BLUEPRINT IDENTITY */}
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Building size={12}/> Client Architecture
                            </h5>
                            <div className="bg-black/40 p-4 rounded-xl border border-blue-500/10 space-y-4">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Business:</span>
                                    <span className="text-xs text-white font-bold">{intel.usaha || 'Unknown'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Scale:</span>
                                    <span className="text-xs text-blue-300 font-bold">{intel.skala || '-'}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Category:</span>
                                    <span className="text-xs text-gray-300">{intel.kategori || '-'}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Location:</span>
                                    <span className="text-xs text-gray-400 italic leading-relaxed">{intel.alamat || '-'}</span>
                                </div>
                            </div>
                        </div>

                        {/* SYSTEM SPECS */}
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Globe size={12}/> System Specs
                            </h5>
                            <div className="bg-black/40 p-4 rounded-xl border border-blue-500/10 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Base Module:</span>
                                    <span className="text-xs text-blue-400 font-black">{intel.paket || '-'}</span>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-[9px] text-gray-600 font-bold uppercase">Module Expansion:</span>
                                    <div className="p-3 bg-blue-500/5 rounded border border-blue-500/10">
                                        <p className="text-[10px] text-gray-400 leading-relaxed font-mono">
                                            {intel.addons || 'Standard components only.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-2 border-t border-blue-500/20 flex justify-between items-center">
                                    <span className="text-[9px] text-white font-black">ARCH. BUDGET:</span>
                                    <span className="text-sm text-green-400 font-black font-mono">{intel.estimasi || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a 
                        href={`https://wa.me/${lead.phone}?text=Halo Pak ${lead.name}, saya Amin dari Mesin Kasir Solo. Tadi sempat simulasi budget untuk *${serviceType}*. Desain sistemnya menarik, sudah ada gambaran teknisnya atau mau saya bantu bedah arsitekturnya?`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3 bg-blue-600/10 border border-blue-500/40 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg relative z-10"
                    >
                        <MousePointer2 size={16}/> ANALYZE BLUEPRINT
                    </a>
                </div>
            )}
        </div>
    );
};

export const LeadsPanel = () => {
    const { state, deleteLead } = useLeadLogic();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (state.loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    const hardwareLeads = state.leads.filter(l => l.source === 'checkout_page' || l.source.includes('hardware'));
    const serviceLeads = state.leads.filter(l => l.source.includes('sim_shadow') && !l.source.includes('hardware'));

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* COLUMN LEFT: HARDWARE ARSENAL */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 px-2">
                        <div className="flex items-center gap-2">
                            <Package size={16} className="text-brand-orange"/>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Hardware Arsenal</h3>
                        </div>
                        <span className="text-[10px] text-brand-orange font-mono bg-brand-orange/10 px-2 py-0.5 rounded">{hardwareLeads.length} Prospek</span>
                    </div>

                    {hardwareLeads.length === 0 ? (
                        <div className="py-20 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-xl bg-black/20">
                            <p className="text-xs italic">Radar sepi, belum ada pesanan ghaib.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {hardwareLeads.map(l => (
                                <HardwareLeadCard 
                                    key={l.id} 
                                    lead={l} 
                                    onDelete={deleteLead} 
                                    isExpanded={expandedId === l.id}
                                    onToggle={() => setExpandedId(expandedId === l.id ? null : l.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* COLUMN RIGHT: DIGITAL SOLUTIONS */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 px-2">
                        <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-blue-400"/>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Digital Solutions</h3>
                        </div>
                        <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">{serviceLeads.length} Arsitektur</span>
                    </div>

                    {serviceLeads.length === 0 ? (
                        <div className="py-20 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-xl bg-black/20">
                            <p className="text-xs italic">Belum ada blueprint sistem yang dirakit.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {serviceLeads.map(l => (
                                <ServiceLeadCard 
                                    key={l.id} 
                                    lead={l} 
                                    onDelete={deleteLead}
                                    isExpanded={expandedId === l.id}
                                    onToggle={() => setExpandedId(expandedId === l.id ? null : l.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-bold">
                    <Target size={12} className="text-brand-orange animate-pulse"/> Tracking Abandoned Cart & Simulations Aktif
                </p>
            </div>
        </div>
    );
};
