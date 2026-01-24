
import React, { useState, useEffect, useCallback } from 'react';
import { FileText, Phone, Calendar, Search, Filter, Trash2, Printer, Download, Eye, ArrowRight, User, BadgeCheck, ExternalLink, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import { ServiceSimulation, SiteConfig } from '../../types';
import { supabase, formatRupiah, formatOrderId } from '../../utils';
import { LoadingSpinner, Button } from '../ui';

// --- PROPOSAL GENERATOR HELPER ---
const generateProposalPDF = (sim: ServiceSimulation, config: SiteConfig) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Pop-up diblokir!");

    const companyName = config.company_legal_name || "PT MESIN KASIR SOLO";
    const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const displayId = formatOrderId(sim.id, 'SIM');
    
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>PROPOSAL - ${sim.customer_name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Space+Grotesk:wght@700&display=swap');
            @page { size: A4; margin: 20mm; }
            body { font-family: 'Outfit', sans-serif; color: #333; }
            .header { border-bottom: 3px solid #FF5F1F; padding-bottom: 20px; margin-bottom: 40px; }
            .font-display { font-family: 'Space Grotesk', sans-serif; }
            .bg-brand { background-color: #FF5F1F; }
            .text-brand { color: #FF5F1F; }
        </style>
    </head>
    <body class="p-10">
        <div class="header flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-display font-bold text-brand uppercase">${companyName}</h1>
                <p class="text-xs text-gray-500 uppercase tracking-widest mt-1">Digital Architecture & Solutions Partner</p>
            </div>
            <div class="text-right">
                <h2 class="text-2xl font-bold">PROPOSAL SOLUSI</h2>
                <p class="text-sm text-gray-600">Ref: ${displayId}</p>
                <p class="text-sm text-gray-600">${dateStr}</p>
            </div>
        </div>
        <div class="mb-10">
            <h3 class="text-lg font-bold mb-4 border-l-4 border-brand pl-4">DATA CALON MITRA</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <p><span class="text-gray-500 font-bold uppercase text-[10px] block">Nama Juragan:</span> ${sim.customer_name}</p>
                <p><span class="text-gray-500 font-bold uppercase text-[10px] block">Kontak WA:</span> ${sim.customer_phone}</p>
                <p><span class="text-gray-500 font-bold uppercase text-[10px] block">Jenis Layanan:</span> ${sim.service_name}</p>
            </div>
        </div>
        <div class="mb-10">
            <h3 class="text-lg font-bold mb-4 border-l-4 border-brand pl-4">RANCANGAN INVESTASI</h3>
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="bg-gray-100 text-[10px] uppercase font-bold">
                        <th class="p-3 border">Deskripsi Komponen</th>
                        <th class="p-3 border text-right">Estimasi Biaya (IDR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="p-3 border">
                            <p class="font-bold text-sm">${sim.base_option_label}</p>
                            <p class="text-xs text-gray-500 italic">Paket Utama / Base Solution</p>
                        </td>
                        <td class="p-3 border text-right font-mono text-sm">${formatRupiah(sim.base_option_price)}</td>
                    </tr>
                    ${sim.selected_addons?.map((addon: any) => `
                        <tr>
                            <td class="p-3 border">
                                <p class="font-bold text-xs">${addon.label}</p>
                            </td>
                            <td class="p-3 border text-right font-mono text-xs">${formatRupiah(addon.price)}</td>
                        </tr>
                    `).join('')}
                    <tr class="bg-brand text-white">
                        <td class="p-3 border font-bold">TOTAL ESTIMASI INVESTASI AWAL</td>
                        <td class="p-3 border text-right font-mono font-bold text-lg">${formatRupiah(sim.total_min)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
    </body>
    </html>`;
    printWindow.document.write(html);
    printWindow.document.close();
};

export const SimulationsPanel = ({ config, refreshKey, searchTerm = '' }: { config: SiteConfig, refreshKey?: number, searchTerm?: string }) => {
    const [sims, setSims] = useState<ServiceSimulation[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSims = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        window.dispatchEvent(new CustomEvent('mks:loading', { detail: true }));
        try {
            const { data } = await supabase.from('service_simulations').select('*').order('created_at', { ascending: false });
            if (data) setSims(data);
        } catch (e) { console.error(e); } finally { 
            setLoading(false); 
            window.dispatchEvent(new CustomEvent('mks:loading', { detail: false }));
        }
    }, []);

    useEffect(() => { fetchSims(); }, [fetchSims]);

    useEffect(() => {
        if (refreshKey !== undefined && refreshKey > 0) {
            fetchSims();
        }
    }, [refreshKey, fetchSims]);

    useEffect(() => {
        const onHeaderRefresh = (e: any) => {
            if (e.detail && (e.detail.tab === 'sales' || e.detail.tab === 'store')) {
                fetchSims();
            }
        };
        window.addEventListener('mks:refresh-module', onHeaderRefresh);
        return () => window.removeEventListener('mks:refresh-module', onHeaderRefresh);
    }, [fetchSims]);

    const updateStatus = async (id: number, status: string) => {
        if (!supabase) return;
        try {
            await supabase.from('service_simulations').update({ status: status }).eq('id', id);
            setSims(prev => prev.map(s => s.id === id ? { ...s, status: status as any } : s));
        } catch (e) { alert("Gagal update status"); }
    };

    const deleteSim = async (id: number) => {
        if(!confirm("Hapus data simulasi ini?")) return;
        await supabase?.from('service_simulations').delete().eq('id', id);
        setSims(prev => prev.filter(s => s.id !== id));
    };

    const filtered = sims.filter(s => 
        (s.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.customer_phone || '').includes(searchTerm) ||
        formatOrderId(s.id, 'SIM').includes(searchTerm.toUpperCase()) ||
        (s.service_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && sims.length === 0) return <div className="flex justify-center p-10"><LoadingSpinner size={32} /></div>;

    return (
        <div className="space-y-4">
            {filtered.length === 0 ? (
                <div className="p-20 text-center text-gray-600 bg-black/20 rounded-2xl border-2 border-dashed border-white/5">
                    {searchTerm ? `Pencarian "${searchTerm}" tidak ditemukan.` : 'Belum ada simulasi masuk.'}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(sim => {
                        const basicAddons = sim.selected_addons?.filter((a: any) => !a.tier || a.tier === 'basic') || [];
                        const advancedAddons = sim.selected_addons?.filter((a: any) => a.tier === 'advanced') || [];

                        return (
                            <div key={sim.id} className="bg-brand-card/50 border border-white/5 rounded-2xl p-6 hover:border-brand-orange transition-all group shadow-xl">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded border text-brand-orange border-brand-orange/20 bg-brand-orange/10">
                                                {sim.service_name.toUpperCase()}
                                            </span>
                                            <span className="text-[10px] text-gray-600 font-mono ml-auto">ID: #{formatOrderId(sim.id, 'SIM')}</span>
                                        </div>
                                        <h4 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                                            <User size={16} className="text-gray-500"/> {sim.customer_name}
                                        </h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-400">
                                            <Phone size={14} className="text-green-500"/> 
                                            <a href={`https://wa.me/${sim.customer_phone}`} target="_blank" className="hover:text-brand-orange font-mono">{sim.customer_phone}</a>
                                        </div>
                                        <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Paket Utama</p>
                                            <p className="text-white font-bold text-sm mb-4">{sim.base_option_label}</p>
                                            <div className="space-y-4">
                                                {basicAddons.length > 0 && (
                                                    <div>
                                                        <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1 mb-2"><ShieldCheck size={10}/> Basic</span>
                                                        <div className="space-y-1">{basicAddons.map((a: any, i: number) => (<div key={i} className="flex justify-between text-[10px] text-gray-400"><span>{a.label}</span></div>))}</div>
                                                    </div>
                                                )}
                                                {advancedAddons.length > 0 && (
                                                     <div>
                                                        <span className="text-[9px] text-brand-orange font-black uppercase tracking-widest flex items-center gap-1 mb-2"><Zap size={10}/> Advanced</span>
                                                        <div className="space-y-1">{advancedAddons.map((a: any, i: number) => (<div key={i} className="flex justify-between text-[10px] text-gray-400"><span>{a.label}</span></div>))}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6 text-right">
                                        <div>
                                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">Estimasi Budget</p>
                                            <p className="text-2xl font-display font-bold text-brand-orange">{formatRupiah(sim.total_min)}</p>
                                        </div>
                                        <div className="space-y-2 mt-6">
                                            <select 
                                                value={sim.status || 'new'}
                                                onChange={(e) => updateStatus(sim.id, e.target.value)}
                                                className="w-full text-[10px] font-bold uppercase p-2 rounded-lg bg-black text-white border border-white/10"
                                            >
                                                <option value="new">🆕 BARU</option>
                                                <option value="contacted">📞 DISAPA</option>
                                                <option value="closed">🤝 DEAL</option>
                                            </select>
                                            <button onClick={() => generateProposalPDF(sim, config)} className="w-full py-2 bg-white/5 text-white rounded-lg text-[10px] font-bold border border-white/10 flex items-center justify-center gap-2 transition-all"><Printer size={14}/> PRINT PROPOSAL</button>
                                            <button onClick={() => deleteSim(sim.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg w-full flex justify-center"><Trash2 size={14}/></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
