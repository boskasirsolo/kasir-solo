
import React, { useState, useEffect } from 'react';
import { Target, Phone, MessageCircle, Building, Package, Clock, Trash2, Cpu, ChevronDown, ChevronUp, User, MapPin, Tag, BarChart3, Zap, ShoppingBag, MousePointer2 } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { useLeadLogic } from './logic';
import { Lead } from '../../types';

// --- PARSER: Bedah Teks Notes ke Data Objek ---
const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = {};
    const lines = notes.split('\n');
    lines.forEach(line => {
        if (line.includes('📦PAKET:')) data.paket = line.split('📦PAKET:')[1]?.trim();
        if (line.includes('📍ALAMAT:')) data.alamat = line.split('📍ALAMAT:')[1]?.trim();
        if (line.includes('💰ESTIMASI:')) data.estimasi = line.split('💰ESTIMASI:')[1]?.trim();
        if (line.includes('🏢USAHA:')) data.usaha = line.split('🏢USAHA:')[1]?.trim();
        if (line.includes('⚖️SKALA:')) data.skala = line.split('⚖️SKALA:')[1]?.trim();
        if (line.includes('🏷️KATEGORI:')) data.kategori = line.split('🏷️KATEGORI:')[1]?.trim();
        if (line.includes('🚀ADDONS:')) data.addons = line.split('🚀ADDONS:')[1]?.trim();
        if (line.includes('📝CATATAN:')) data.catatan = line.split('📝CATATAN:')[1]?.trim();
    });
    return data;
};

// --- COMPONENT: Hardware Lead Card ---
const HardwareLeadCard: React.FC<{ 
    lead: Lead, 
    onDelete: (id: number) => void,
    isExpanded: boolean,
    onToggle: () => void
}> = ({ lead, onDelete, isExpanded, onToggle }) => {
    const intel = parseIntel(lead.notes);
    return (
        <div className={`bg-brand-card border-l-4 transition-all overflow-hidden rounded-r-xl mb-3 ${isExpanded ? 'border-brand-orange shadow-neon-strong' : 'border-brand-orange/40 border-y border-r border-white/5'}`}>
            <div onClick={onToggle} className="p-4 flex items-center justify-between cursor-pointer hover:bg-brand-orange/5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20"><ShoppingBag size={20}/></div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{lead.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono flex items-center gap-1"><Clock size={10}/> {new Date(lead.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} className="p-1.5 text-gray-700 hover:text-red-500"><Trash2 size={14}/></button>
                    {isExpanded ? <ChevronUp size={18} className="text-brand-orange"/> : <ChevronDown size={18} className="text-gray-600"/>}
                </div>
            </div>
            {isExpanded && (
                <div className="p-5 border-t border-white/5 bg-black/30 animate-fade-in space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <h5 className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2"><User size={12}/> Info Juragan</h5>
                            <div className="bg-brand-dark/50 p-3 rounded-lg border border-white/5 space-y-2">
                                <p className="text-xs text-white">WA: <span className="font-mono text-brand-orange">{lead.phone}</span></p>
                                <p className="text-xs text-gray-400">Lokasi: <span className="text-white">{intel.alamat || '-'}</span></p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h5 className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-2"><Package size={12}/> Isi Keranjang</h5>
                            <div className="bg-brand-dark/50 p-3 rounded-lg border border-white/5 space-y-2">
                                <p className="text-xs text-white leading-relaxed font-bold">{intel.paket || '-'}</p>
                                <p className="text-xs text-brand-orange font-bold pt-2 border-t border-white/5">Estimasi: {intel.estimasi || '-'}</p>
                            </div>
                        </div>
                    </div>
                    <a href={`https://wa.me/${lead.phone}?text=Halo Juragan ${lead.name}, gue Amin dari Mesin Kasir Solo. Tadi liat lo mau checkout *${intel.paket}*. Alamat kirim ke *${intel.alamat}* ya? Mau gue bantu cek ongkir termurah?`} target="_blank" className="w-full py-3 bg-brand-orange hover:bg-brand-action text-white text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 shadow-neon transition-all"><MessageCircle size={16}/> GAS FOLLOW UP VIA WHATSAPP</a>
                </div>
            )}
        </div>
    );
};

// --- COMPONENT: Service Lead Card ---
const ServiceLeadCard: React.FC<{ 
    lead: Lead, 
    onDelete: (id: number) => void,
    isExpanded: boolean,
    onToggle: () => void
}> = ({ lead, onDelete, isExpanded, onToggle }) => {
    const intel = parseIntel(lead.notes);
    return (
        <div className={`bg-brand-dark transition-all overflow-hidden rounded-xl mb-3 border ${isExpanded ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-blue-500/20'}`}>
            <div onClick={onToggle} className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-500/5">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20"><Cpu size={20}/></div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-white truncate">{lead.name}</h4>
                        <p className="text-[10px] text-gray-500 flex items-center gap-2"><span>{intel.usaha || 'Digital Project'}</span> • <span className="text-blue-400 font-bold">{intel.skala}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={(e) => { e.stopPropagation(); onDelete(lead.id); }} className="p-1.5 text-gray-700 hover:text-red-500"><Trash2 size={14}/></button>
                    {isExpanded ? <ChevronUp size={18} className="text-blue-400"/> : <ChevronDown size={18} className="text-gray-600"/>}
                </div>
            </div>
            {isExpanded && (
                <div className="p-6 border-t border-blue-500/10 bg-black/40 animate-fade-in space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Building size={12}/> Profil Bisnis</h5>
                            <div className="bg-brand-dark/50 p-4 rounded-xl border border-blue-500/10 space-y-3">
                                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[10px] text-gray-500 uppercase font-bold">Usaha:</span><span className="text-xs text-white font-bold">{intel.usaha || '-'}</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[10px] text-gray-500 uppercase font-bold">Skala:</span><span className="text-xs text-blue-300 font-bold">{intel.skala || '-'}</span></div>
                                <div className="flex justify-between border-b border-white/5 pb-2"><span className="text-[10px] text-gray-500 uppercase font-bold">Kategori:</span><span className="text-xs text-gray-300">{intel.kategori || '-'}</span></div>
                                <div className="flex flex-col gap-1"><span className="text-[10px] text-gray-500 uppercase font-bold">Lokasi:</span><span className="text-xs text-gray-400 italic">{intel.alamat || '-'}</span></div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2"><Zap size={12}/> Arsitektur Sistem</h5>
                            <div className="bg-brand-dark/50 p-4 rounded-xl border border-blue-500/10 space-y-3">
                                <div><span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Paket Utama:</span><span className="text-xs text-white font-black">{intel.paket || '-'}</span></div>
                                <div><span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Addons:</span><p className="text-[10px] text-gray-400 leading-relaxed italic">{intel.addons || 'Hanya paket dasar.'}</p></div>
                                <div className="pt-2 border-t border-blue-500/20 flex justify-between items-center"><span className="text-[10px] text-white font-black uppercase">Estimasi Budget:</span><span className="text-sm text-green-400 font-black font-mono">{intel.estimasi || '-'}</span></div>
                            </div>
                        </div>
                    </div>
                    <a href={`https://wa.me/${lead.phone}?text=Halo Pak ${lead.name}, saya Amin dari Mesin Kasir Solo. Tadi sempat simulasi budget arsitektur digital untuk *${intel.usaha}*. Profil bisnis bapak menarik, mau saya bantu bedah teknisnya via zoom atau telpon?`} target="_blank" className="w-full py-3 bg-blue-600/10 border border-blue-500/40 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-lg"><MousePointer2 size={16}/> BEDAH BLUEPRINT VIA WHATSAPP</a>
                </div>
            )}
        </div>
    );
};

export const LeadsPanel = ({ refreshKey }: { refreshKey?: number }) => {
    const { state, fetchLeads, deleteLead } = useLeadLogic();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    // Sinyal Refresh dari Parent
    useEffect(() => {
        if (refreshKey !== undefined && refreshKey > 0) {
            fetchLeads();
        }
    }, [refreshKey]);

    if (state.loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    // Filter leads dengan pengecekan safety untuk source yang null/undefined
    const hardwareLeads = state.leads.filter(l => (l.source || '').includes('checkout'));
    const serviceLeads = state.leads.filter(l => (l.source || '').includes('sim_shadow'));
    const contactLeads = state.leads.filter(l => (l.source || '').includes('contact_form'));

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="grid lg:grid-cols-2 gap-8">
                {/* KOLOM HARDWARE */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 px-2">
                        <div className="flex items-center gap-2"><ShoppingBag size={16} className="text-brand-orange"/><h3 className="text-xs font-black text-white uppercase tracking-widest">Hardware Arsenal</h3></div>
                        <span className="text-[10px] text-brand-orange font-mono bg-brand-orange/10 px-2 py-0.5 rounded">{hardwareLeads.length} Prospek</span>
                    </div>
                    {hardwareLeads.length === 0 ? <div className="py-20 text-center text-gray-700 border border-dashed border-white/5 rounded-xl bg-black/20 text-xs">Belum ada jejak checkout.</div> : 
                        hardwareLeads.map(l => <HardwareLeadCard key={l.id} lead={l} onDelete={deleteLead} isExpanded={expandedId === l.id} onToggle={() => setExpandedId(expandedId === l.id ? null : l.id)} />)
                    }
                </div>

                {/* KOLOM SERVICE */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 px-2">
                        <div className="flex items-center gap-2"><Cpu size={16} className="text-blue-400"/><h3 className="text-xs font-black text-white uppercase tracking-widest">Digital Solutions</h3></div>
                        <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">{serviceLeads.length} Blueprint</span>
                    </div>
                    {serviceLeads.length === 0 ? <div className="py-20 text-center text-gray-700 border border-dashed border-white/5 rounded-xl bg-black/20 text-xs">Belum ada simulasi masuk.</div> : 
                        serviceLeads.map(l => <ServiceLeadCard key={l.id} lead={l} onDelete={deleteLead} isExpanded={expandedId === l.id} onToggle={() => setExpandedId(expandedId === l.id ? null : l.id)} />)
                    }
                </div>
            </div>

            {/* BARIS EXTRA: CONTACT FORM LEADS */}
            {contactLeads.length > 0 && (
                <div className="pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-4 px-2">
                        <MessageCircle size={16} className="text-green-500"/>
                        <h3 className="text-xs font-black text-white uppercase tracking-widest">Pesan Dari Form Kontak</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {contactLeads.map(l => (
                            <div key={l.id} className="bg-brand-card p-4 rounded-xl border border-white/5 relative group">
                                <button onClick={() => deleteLead(l.id)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-500 transition-all"><Trash2 size={12}/></button>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 text-xs font-bold">{l.name.charAt(0)}</div>
                                    <div>
                                        <h5 className="text-xs font-bold text-white">{l.name}</h5>
                                        <p className="text-[9px] text-gray-500">{l.phone}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 line-clamp-2 italic">"{l.notes}"</p>
                                <a href={`https://wa.me/${l.phone}`} target="_blank" className="mt-3 block text-center py-2 bg-green-600/10 text-green-500 rounded-lg text-[9px] font-bold uppercase hover:bg-green-600 hover:text-white transition-all">Balas Pesan</a>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 text-center">
                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-bold"><Target size={12} className="text-brand-orange animate-pulse"/> Surveillance System Aktif: Menangkap Abandoned Data & Simulations</p>
            </div>
        </div>
    );
};
