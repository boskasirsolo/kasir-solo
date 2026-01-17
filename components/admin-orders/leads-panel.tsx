
import React from 'react';
import { Target, Phone, MessageCircle, Building, Package, Clock, Trash2, Cpu, Globe, ArrowRight, MousePointer2 } from 'lucide-react';
import { LoadingSpinner } from '../ui';
import { useLeadLogic } from './logic';
import { Lead } from '../../types';

// --- HELPER: Parse Notes Report ---
const parseReport = (notes?: string) => {
    if (!notes) return {};
    const data: any = {};
    const lines = notes.split('\n');
    lines.forEach(line => {
        const [key, ...val] = line.split(':');
        if (key && val.length > 0) {
            const cleanKey = key.replace(/[^\w]/g, '').toLowerCase();
            data[cleanKey] = val.join(':').trim();
        }
    });
    return data;
};

// --- COMPONENT: Hardware Lead Card (Industrial Style) ---
// Fix: Updated prop type to allow async onDelete and added React.FC to handle key prop
const HardwareLeadCard: React.FC<{ lead: Lead, onDelete: (id: number) => any }> = ({ lead, onDelete }) => {
    const details = parseReport(lead.notes);
    return (
        <div className="bg-brand-card border-l-4 border-brand-orange border-y border-r border-white/5 p-4 rounded-r-xl hover:bg-brand-orange/5 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                <Package size={80} />
            </div>
            
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <span className="bg-brand-orange text-white text-[8px] font-black px-2 py-0.5 rounded tracking-tighter uppercase">Arsenal Order</span>
                    <span className="text-[9px] text-gray-500 font-mono"><Clock size={8} className="inline mr-1"/>{new Date(lead.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <button onClick={() => onDelete(lead.id)} className="p-1.5 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded transition-all">
                    <Trash2 size={14}/>
                </button>
            </div>

            <div className="mb-4">
                <h4 className="text-white font-bold text-base leading-none mb-1 uppercase tracking-tight">{lead.name}</h4>
                <div className="flex items-center gap-2 text-brand-orange font-mono text-sm font-bold">
                    <Phone size={12}/> {lead.phone}
                </div>
            </div>

            <div className="bg-black/40 p-3 rounded-lg border border-white/5 space-y-2 mb-4">
                <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500 font-bold">PAKET:</span>
                    <span className="text-white font-bold">{details.paket || 'Custom'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                    <span className="text-gray-500 font-bold">ESTIMASI:</span>
                    <span className="text-brand-orange font-bold font-mono">{details.estimasi || '-'}</span>
                </div>
            </div>

            <a 
                href={`https://wa.me/${lead.phone}?text=Halo Juragan ${lead.name}, gue Amin dari Mesin Kasir Solo. Tadi liat lo lagi liat-liat *${details.paket || 'paket kasir'}*. Unitnya ready di gudang nih, mau gue video call buat liat barangnya?`}
                target="_blank"
                className="w-full py-2.5 bg-brand-orange text-white text-[10px] font-black uppercase tracking-widest rounded flex items-center justify-center gap-2 shadow-neon hover:bg-brand-action transition-all"
            >
                <MessageCircle size={14}/> GAS FOLLOW UP
            </a>
        </div>
    );
};

// --- COMPONENT: Service Lead Card (Blueprint Style) ---
// Fix: Updated prop type to allow async onDelete and added React.FC to handle key prop
const ServiceLeadCard: React.FC<{ lead: Lead, onDelete: (id: number) => any }> = ({ lead, onDelete }) => {
    const details = parseReport(lead.notes);
    const serviceType = lead.source.replace('sim_shadow_', '').toUpperCase();
    
    return (
        <div className="bg-brand-dark/80 border border-blue-500/20 p-4 rounded-xl hover:border-blue-400/50 transition-all group relative overflow-hidden backdrop-blur-sm">
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_20px]"></div>
            
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Cpu size={14}/>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-blue-400 tracking-widest">{serviceType} BLUEPRINT</span>
                </div>
                <button onClick={() => onDelete(lead.id)} className="p-1.5 text-gray-700 hover:text-red-400 transition-all">
                    <Trash2 size={14}/>
                </button>
            </div>

            <div className="mb-4 relative z-10">
                <h4 className="text-gray-100 font-display font-bold text-base leading-none mb-1">{lead.name}</h4>
                <p className="text-[10px] text-gray-500 font-mono italic">{details.usaha || 'Unknown Client'}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 relative z-10">
                <div className="p-2 bg-black/20 rounded border border-white/5">
                    <p className="text-[8px] text-gray-600 font-bold uppercase mb-1">Scale</p>
                    <p className="text-[10px] text-blue-300 font-bold truncate">{details.skala || '-'}</p>
                </div>
                <div className="p-2 bg-black/20 rounded border border-white/5">
                    <p className="text-[8px] text-gray-600 font-bold uppercase mb-1">Budget</p>
                    <p className="text-[10px] text-green-400 font-bold font-mono">{details.estimasi || '-'}</p>
                </div>
            </div>

            <div className="mb-4 relative z-10">
                <p className="text-[8px] text-gray-600 font-bold uppercase mb-1">Architecture Note:</p>
                <p className="text-[10px] text-gray-400 line-clamp-2 italic leading-relaxed">
                    {details.addons || 'Basic configuration only.'}
                </p>
            </div>

            <a 
                href={`https://wa.me/${lead.phone}?text=Halo Pak ${lead.name}, saya Amin dari Mesin Kasir Solo. Tadi sempat simulasi budget untuk *${serviceType}*. Desain sistemnya menarik, sudah ada gambaran teknisnya atau mau saya bantu bedah arsitekturnya?`}
                target="_blank"
                className="w-full py-2.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all"
            >
                <MousePointer2 size={14}/> OPEN BLUEPRINT
            </a>
        </div>
    );
};

export const LeadsPanel = () => {
    const { state, deleteLead } = useLeadLogic();

    if (state.loading) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    const hardwareLeads = state.leads.filter(l => l.source === 'checkout_page' || l.source.includes('hardware'));
    const serviceLeads = state.leads.filter(l => l.source.includes('sim_shadow') && !l.source.includes('hardware'));

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-8">
                
                {/* COLUMN LEFT: HARDWARE */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 px-2">
                        <div className="flex items-center gap-2">
                            <Package size={16} className="text-brand-orange"/>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Hardware Arsenal</h3>
                        </div>
                        <span className="text-[10px] text-brand-orange font-mono bg-brand-orange/10 px-2 py-0.5 rounded">{hardwareLeads.length} Leads</span>
                    </div>

                    {hardwareLeads.length === 0 ? (
                        <div className="py-10 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-xl">No hardware leads.</div>
                    ) : (
                        <div className="grid gap-4">
                            {hardwareLeads.map(l => <HardwareLeadCard key={l.id} lead={l} onDelete={deleteLead} />)}
                        </div>
                    )}
                </div>

                {/* COLUMN RIGHT: SERVICES */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2 px-2">
                        <div className="flex items-center gap-2">
                            <Cpu size={16} className="text-blue-400"/>
                            <h3 className="text-xs font-black text-white uppercase tracking-widest">Digital Solutions</h3>
                        </div>
                        <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2 py-0.5 rounded">{serviceLeads.length} Leads</span>
                    </div>

                    {serviceLeads.length === 0 ? (
                        <div className="py-10 text-center text-gray-700 border-2 border-dashed border-white/5 rounded-xl">No service leads.</div>
                    ) : (
                        <div className="grid gap-4">
                            {serviceLeads.map(l => <ServiceLeadCard key={l.id} lead={l} onDelete={deleteLead} />)}
                        </div>
                    )}
                </div>

            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                <p className="text-[10px] text-gray-500 flex items-center justify-center gap-2 uppercase tracking-[0.2em] font-bold">
                    <Target size={12} className="text-brand-orange"/> Real-time Surveillance System Aktif
                </p>
            </div>
        </div>
    );
};
