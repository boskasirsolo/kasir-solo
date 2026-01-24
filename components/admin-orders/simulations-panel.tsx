
import React, { useState, useEffect } from 'react';
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
    
    // Grouping for PDF
    const basicAddons = sim.selected_addons?.filter((a: any) => !a.tier || a.tier === 'basic') || [];
    const advancedAddons = sim.selected_addons?.filter((a: any) => a.tier === 'advanced') || [];

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
                <p class="text-sm text-gray-600">Ref: ${displayId}-${new Date().getTime().toString().slice(-4)}</p>
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
                                <p class="text-[10px] text-gray-400">${addon.tier === 'advanced' ? '🚀 Advanced Module' : '🛠️ Basic Support'}</p>
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
            <p class="text-[10px] text-gray-400 mt-2 italic">*Catatan: Estimasi di atas belum termasuk pajak dan biaya operasional lapangan (akomodasi) jika diperlukan instalasi on-site.</p>
        </div>

        <div class="grid grid-cols-2 gap-10 mb-10 text-sm">
            <div>
                <h4 class="font-bold mb-2 uppercase text-xs text-brand">Pengerjaan & Support</h4>
                <ul class="list-disc pl-5 space-y-1 text-xs text-gray-600">
                    <li>Estimasi pengerjaan: 7-21 hari kerja (sesuai antrian).</li>
                    <li>Gratis maintenance & backup data selama 1 bulan pertama.</li>
                    <li>Sesi training privat untuk Juragan & Staff.</li>
                    <li>Support teknis prioritas via WhatsApp 24/7.</li>
                </ul>
            </div>
            <div>
                <h4 class="font-bold mb-2 uppercase text-xs text-brand">Metode Pembayaran</h4>
                <div class="bg-gray-50 p-4 rounded border border-gray-200">
                    <p class="font-bold">Bank Neo Commerce (BNC)</p>
                    <p class="font-mono text-lg my-1">5859 4594 0674 0414</p>
                    <p class="text-[10px] text-gray-500 uppercase">a.n PT MESIN KASIR SOLO</p>
                </div>
            </div>
        </div>

        <div class="mt-20 flex justify-between items-end">
            <div class="w-1/3 text-center">
                <p class="text-xs text-gray-400 mb-16">Penerima Proposal,</p>
                <div class="h-px bg-gray-300 w-full mb-2"></div>
                <p class="font-bold uppercase">${sim.customer_name}</p>
            </div>
            <div class="w-1/3 text-center">
                <p class="text-xs text-gray-400 mb-4">Hormat Kami,</p>
                <div class="w-24 h-24 mx-auto border-2 border-brand rounded flex items-center justify-center mb-2">
                    <span class="text-brand font-bold text-4xl">MKS</span>
                </div>
                <p class="font-bold">Amin Maghfuri</p>
                <p class="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Founder / CEO</p>
            </div>
        </div>

        <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
    </body>
    </html>`;
    printWindow.document.write(html);
    printWindow.document.close();
};

export const SimulationsPanel = ({ config, refreshKey }: { config: SiteConfig, refreshKey?: number }) => {
    const [sims, setSims] = useState<ServiceSimulation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { fetchSims(); }, []);

    // Sinyal Refresh dari Header Utama (Logic Spesifik Modul)
    useEffect(() => {
        const onHeaderRefresh = (e: any) => {
            // Modul ini berada di bawah tab 'sales'
            if (e.detail.tab === 'sales') {
                fetchSims();
            }
        };

        window.addEventListener('mks:refresh-module', onHeaderRefresh);
        return () => window.removeEventListener('mks:refresh-module', onHeaderRefresh);
    }, []);

    const fetchSims = async () => {
        if (!supabase) return;
        setLoading(true);
        // Dispatch loading ke header
        window.dispatchEvent(new CustomEvent('mks:loading', { detail: true }));
        try {
            const { data } = await supabase.from('service_simulations').select('*').order('created_at', { ascending: false });
            if (data) setSims(data);
        } catch (e) { console.error(e); } finally { 
            setLoading(false); 
            window.dispatchEvent(new CustomEvent('mks:loading', { detail: false }));
        }
    };

    const updateStatus = async (id: number, status: string) => {
        if (!supabase) return;
        try {
            await supabase.from('service_simulations').update({ status }).eq('id', id);
            setSims(prev => prev.map(s => s.id === id ? { ...s, status: status as any } : s));
        } catch (e) { alert("Gagal update status"); }
    };

    const deleteSim = async (id: number) => {
        if(!confirm("Hapus data simulasi ini?")) return;
        await supabase?.from('service_simulations').delete().eq('id', id);
        setSims(prev => prev.filter(s => s.id !== id));
    };

    const filtered = sims.filter(s => 
        s.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.customer_phone.includes(searchTerm) ||
        formatOrderId(s.id, 'SIM').includes(searchTerm)
    );

    if (loading && sims.length === 0) return <div className="flex justify-center p-10"><LoadingSpinner /></div>;

    return (
        <div className="space-y-4">
            {/* SEARCH BAR INTERNAL (Khusus Simulasi) */}
            <div className="flex justify-end px-2 mb-2">
                <div className="relative group w-full md:w-80">
                    <Search size={14} className="absolute left-3 top-2.5 text-gray-600 group-focus-within:text-brand-orange transition-colors" />
                    <input 
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Filter simulasi (Nama/HP/ID)..."
                        className="w-full bg-brand-card/50 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-[10px] font-bold text-white outline-none focus:border-brand-orange transition-all placeholder:text-gray-700 shadow-inner"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="p-20 text-center text-gray-600 bg-black/20 rounded-2xl border-2 border-dashed border-white/5">
                    Belum ada simulasi yang sesuai kriteria pencarian.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filtered.map(sim => {
                        // GROUPING ADDONS FOR UI
                        const basicAddons = sim.selected_addons?.filter((a: any) => !a.tier || a.tier === 'basic') || [];
                        const advancedAddons = sim.selected_addons?.filter((a: any) => a.tier === 'advanced') || [];

                        return (
                            <div key={sim.id} className="bg-brand-card/50 border border-white/5 rounded-2xl p-6 hover:border-brand-orange transition-all group shadow-xl">
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    {/* LEFT: USER INFO */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                                sim.service_slug === 'website' ? 'text-blue-400 border-blue-500/20 bg-blue-500/10' :
                                                sim.service_slug === 'webapp' ? 'text-purple-400 border-purple-500/20 bg-purple-500/10' :
                                                'text-brand-orange border-brand-orange/20 bg-brand-orange/10'
                                            }`}>
                                                {sim.service_name.toUpperCase()}
                                            </span>
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1"><Calendar size={10}/> {new Date(sim.created_at).toLocaleString('id-ID')}</span>
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
                                            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">Solusi Utama</span>
                                                <span className="text-white font-bold text-sm">{sim.base_option_label}</span>
                                            </div>
                                            
                                            <div className="space-y-4">
                                                {/* BASIC GROUP */}
                                                {basicAddons.length > 0 && (
                                                    <div>
                                                        <span className="text-[9px] text-blue-400 font-black uppercase tracking-widest flex items-center gap-1 mb-2">
                                                            <ShieldCheck size={10}/> Basic Support
                                                        </span>
                                                        <div className="space-y-1">
                                                            {basicAddons.map((a: any, i: number) => (
                                                                <div key={i} className="flex justify-between items-center text-[10px]">
                                                                    <span className="text-gray-400">{a.label}</span>
                                                                    <span className="text-gray-500">{formatRupiah(a.price)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* ADVANCED GROUP */}
                                                {advancedAddons.length > 0 && (
                                                    <div>
                                                        <span className="text-[9px] text-brand-orange font-black uppercase tracking-widest flex items-center gap-1 mb-2">
                                                            <Zap size={10}/> Advanced Power-Ups
                                                        </span>
                                                        <div className="space-y-1">
                                                            {advancedAddons.map((a: any, i: number) => (
                                                                <div key={i} className="flex justify-between items-center text-[10px]">
                                                                    <span className="text-gray-400">{a.label}</span>
                                                                    <span className="text-gray-500">{formatRupiah(a.price)}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {!sim.selected_addons?.length && <span className="text-[10px] text-gray-600 italic">Tanpa Add-on</span>}
                                            </div>
                                        </div>
                                    </div>

                                    {/* RIGHT: TOTAL & ACTIONS */}
                                    <div className="lg:w-64 shrink-0 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-6">
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">Estimasi Budget</p>
                                            <p className="text-2xl font-display font-bold text-brand-orange leading-tight">{formatRupiah(sim.total_min)}</p>
                                            <p className="text-[10px] text-gray-400">s/d {formatRupiah(sim.total_max)}</p>
                                        </div>

                                        <div className="space-y-2 mt-6">
                                            <select 
                                                value={sim.status || 'new'}
                                                onChange={(e) => updateStatus(sim.id, e.target.value)}
                                                className={`w-full text-[10px] font-bold uppercase p-2 rounded-lg outline-none border transition-all ${
                                                    sim.status === 'new' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                    sim.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    sim.status === 'proposed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}
                                            >
                                                <option value="new">🆕 BARU</option>
                                                <option value="contacted">📞 SUDAH DISAPA</option>
                                                <option value="proposed">📑 PROPOSAL TERKIRIM</option>
                                                <option value="closed">🤝 DEAL / CLOSED</option>
                                            </select>

                                            <button 
                                                onClick={() => generateProposalPDF(sim, config)}
                                                className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-[10px] font-bold border border-white/10 flex items-center justify-center gap-2 transition-all"
                                            >
                                                <Printer size={14} className="text-brand-orange"/> GENERATE PROPOSAL (PDF)
                                            </button>

                                            <div className="flex gap-2">
                                                <a 
                                                    href={`https://wa.me/${sim.customer_phone}?text=Halo Juragan ${sim.customer_name}, gue dapet notifikasi lo baru aja simulasi budget buat *${sim.service_name}* paket *${sim.base_option_label}*. Mau lanjut diskusi atau mau gue kirimin PDF Proposal resminya?`}
                                                    target="_blank"
                                                    className="flex-1 py-2 bg-green-600/10 hover:bg-green-600 text-green-500 hover:text-white rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 border border-green-500/20 transition-all"
                                                >
                                                    SAPA WA
                                                </a>
                                                <button 
                                                    onClick={() => deleteSim(sim.id)}
                                                    className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-lg transition-all border border-red-500/20"
                                                >
                                                    <Trash2 size={14}/>
                                                </button>
                                            </div>
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
