
import { useState, useEffect, useMemo } from 'react';
import { supabase, callGeminiWithRotation, formatRupiah } from '../../utils';
import { Customer, CRMState, LeadStatus } from './types';

// --- HELPER: Intel Parser (Membaca data tersembunyi dari Notes) ---
export const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = { addons: [] };
    const lines = notes.split('\n');
    lines.forEach(line => {
        if (line.includes('📦PAKET:')) data.paket = line.split('📦PAKET:')[1]?.trim();
        if (line.includes('📍ALAMAT:')) data.alamat = line.split('📍ALAMAT:')[1]?.trim();
        if (line.includes('💰ESTIMASI:')) data.estimasi = line.split('💰ESTIMASI:')[1]?.trim();
        if (line.includes('🏢USAHA:')) data.usaha = line.split('🏢USAHA:')[1]?.trim();
        if (line.includes('⚖️SKALA:')) data.skala = line.split('⚖️SKALA:')[1]?.trim();
        if (line.includes('🏷️KATEGORI:')) data.kategori = line.split('🏷️KATEGORI:')[1]?.trim();
        if (line.includes('🚀ADDONS:')) {
            const rawAddons = line.split('🚀ADDONS:')[1]?.trim();
            if (rawAddons && rawAddons !== '(Tanpa Addon)') {
                data.addons = rawAddons.split(',').map(a => a.trim());
            }
        }
    });
    return data;
};

export const useCRMLogic = () => {
    const [state, setState] = useState<CRMState>({
        customers: [],
        loading: true,
        searchTerm: '',
        activeView: 'pipeline'
    });

    const [isGeneratingScript, setIsGeneratingScript] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        if (!supabase) return;
        setState(p => ({ ...p, loading: true }));
        try {
            const { data, error } = await supabase.from('customers').select('*').order('last_interaction', { ascending: false });
            if (error) throw error;
            setState(p => ({ ...p, customers: data || [], loading: false }));
        } catch (e) {
            console.error(e);
            setState(p => ({ ...p, loading: false }));
        }
    };

    const updateStatus = async (customerId: string, status: LeadStatus) => {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('customers').update({ lead_status: status, last_interaction: new Date().toISOString() }).eq('id', customerId);
            if (error) throw error;
            setState(p => ({
                ...p,
                customers: p.customers.map(c => c.id === customerId ? { ...c, lead_status: status, last_interaction: new Date().toISOString() } : c)
            }));
        } catch (e) {
            alert("Gagal update status.");
        }
    };

    const generateAIScript = async (customer: Customer) => {
        setIsGeneratingScript(customer.id);
        const intel = parseIntel(customer.notes);
        
        try {
            const prompt = `
            Role: SIBOS AI (Alter-ego Amin Maghfuri). 
            Task: Tulis draf chat WhatsApp personal. 
            Info: Barusan gue bikinin PDF Proposal buat dia berdasarkan data simulasi: ${intel.paket || 'Umum'}.
            Data Customer:
            - Nama: ${customer.name}
            - Usaha: ${customer.company_name || intel.usaha || '-'}
            - Minat: ${intel.paket || 'Hardware/Software'}
            
            Rules:
            1. Pake bahasa "Gue/Lo" (Street-Smart). 
            2. Sebut kalau "Proposal resminya udah gue rapihin, ini gue lampirin ya Bos".
            3. Ajak diskusi kalau ada budget yang belum cocok.
            4. Jangan pake "Halo Kak". Pake "Juragan" atau "Bos".
            
            Output: JUST THE TEXT.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const script = res.text?.trim() || "";
            
            const waUrl = `https://wa.me/${customer.phone}?text=${encodeURIComponent(script)}`;
            window.open(waUrl, '_blank');
        } catch (e) {
            alert("SIBOS lagi pusing, buka WA manual aja dulu Bos.");
        } finally {
            setIsGeneratingScript(null);
        }
    };

    // --- SALES SNIPER: PDF PROPOSAL GENERATOR ---
    const generateProposal = (customer: Customer, config: any) => {
        const intel = parseIntel(customer.notes);
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert("Pop-up diblokir!");

        const companyName = config.company_legal_name || "PT MESIN KASIR SOLO";
        const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>PROPOSAL - ${customer.name}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Space+Grotesk:wght@700&display=swap');
                @page { size: A4; margin: 20mm; }
                body { font-family: 'Outfit', sans-serif; color: #333; background: #fff; }
                .header { border-bottom: 4px solid #FF5F1F; padding-bottom: 20px; margin-bottom: 40px; }
                .text-brand { color: #FF5F1F; }
                .bg-brand { background-color: #FF5F1F; }
            </style>
        </head>
        <body class="p-10">
            <div class="header flex justify-between items-center">
                <div>
                    <h1 class="text-3xl font-bold text-brand uppercase tracking-tighter">${companyName}</h1>
                    <p class="text-xs text-gray-500 uppercase tracking-widest mt-1">Digital Architecture & POS Specialist</p>
                </div>
                <div class="text-right">
                    <h2 class="text-2xl font-bold">DRAFT PROPOSAL</h2>
                    <p class="text-sm text-gray-600">No: MKS/PROP/${customer.id.toString().slice(-4)}</p>
                    <p class="text-sm text-gray-600">${dateStr}</p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-10 mb-10">
                <div class="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 class="text-[10px] font-black text-brand uppercase tracking-widest mb-3">Tujuan Penawaran:</h3>
                    <p class="font-bold text-lg uppercase">${customer.name}</p>
                    <p class="text-sm text-gray-600">${customer.company_name || intel.usaha || 'UMKM Juragan'}</p>
                    <p class="text-sm text-gray-600">${customer.phone}</p>
                    <p class="text-xs text-gray-400 mt-2 italic">${intel.alamat || 'Lokasi Terlampir'}</p>
                </div>
                <div class="flex flex-col justify-center">
                    <h3 class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 text-right">Status Analisa AI:</h3>
                    <div class="text-right">
                        <span class="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold border border-red-200">PRIORITAS TINGGI</span>
                        <p class="text-[10px] text-gray-400 mt-2 leading-relaxed">Proposal ini diracik otomatis oleh sistem intelijen SIBOS berdasarkan simulasi kebutuhan yang dilakukan di platform kami.</p>
                    </div>
                </div>
            </div>

            <div class="mb-10">
                <h3 class="text-sm font-bold mb-4 bg-gray-900 text-white px-4 py-2 rounded">RANCANGAN INVESTASI SOLUSI</h3>
                <table class="w-full text-left border-collapse border border-gray-200">
                    <thead>
                        <tr class="bg-gray-50 text-[10px] uppercase font-bold text-gray-500">
                            <th class="p-4 border-b">Item Layanan / Perangkat</th>
                            <th class="p-4 border-b text-right">Estimasi Mahar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="p-4 border-b">
                                <p class="font-bold text-sm text-gray-800">${intel.paket || 'Custom Digital Strategy'}</p>
                                <p class="text-[10px] text-gray-500">Paket Utama (Base Solution)</p>
                            </td>
                            <td class="p-4 border-b text-right font-bold text-gray-800">${intel.estimasi || 'TBD'}</td>
                        </tr>
                        ${intel.addons?.map((a: string) => `
                            <tr>
                                <td class="p-4 border-b">
                                    <p class="text-xs font-medium text-gray-700">${a}</p>
                                    <p class="text-[9px] text-gray-400">Modul Tambahan (Add-on)</p>
                                </td>
                                <td class="p-4 border-b text-right text-gray-400 text-xs">Included in Estimate</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot class="bg-brand text-white">
                        <tr>
                            <td class="p-4 font-bold uppercase tracking-widest">Total Estimasi Awal</td>
                            <td class="p-4 text-right font-bold text-xl">${intel.estimasi || 'Negosiasi'}</td>
                        </tr>
                    </tfoot>
                </table>
                <p class="text-[9px] text-gray-400 mt-3 italic">*PENTING: Harga di atas adalah angka simulasi awal. Angka final bisa berubah setelah sesi bedah teknis mendalam bersama Founder.</p>
            </div>

            <div class="grid grid-cols-2 gap-8 mb-12">
                <div class="space-y-4">
                    <h4 class="text-xs font-bold text-brand uppercase tracking-widest">KENAPA SAMA KAMI?</h4>
                    <ul class="space-y-2">
                        <li class="text-xs flex gap-2">✅ <strong>Anti-Tuyul System:</strong> Audit log tiap transaksi.</li>
                        <li class="text-xs flex gap-2">✅ <strong>Hybrid Mode:</strong> Internet mati, jualan jalan terus.</li>
                        <li class="text-xs flex gap-2">✅ <strong>Direct Support:</strong> Jalur khusus ke Founder.</li>
                    </ul>
                </div>
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h4 class="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">KONSULTASI LANJUTAN</h4>
                    <p class="text-[10px] text-gray-500 leading-relaxed">Silakan konfirmasi ke WhatsApp Mas Amin (Founder) untuk booking jadwal bedah blueprint bisnis Anda (Via Zoom/Meet).</p>
                </div>
            </div>

            <div class="mt-20 flex justify-between items-end">
                <div class="w-1/3 text-center opacity-30">
                    <p class="text-[10px] mb-16 uppercase font-bold">Diterima Oleh,</p>
                    <div class="h-px bg-black w-full mb-1"></div>
                    <p class="text-xs font-bold uppercase">${customer.name}</p>
                </div>
                <div class="w-1/3 text-center">
                    <p class="text-[10px] mb-4 uppercase font-bold text-gray-400">Hormat Kami,</p>
                    <div class="w-20 h-20 mx-auto border-2 border-brand rounded flex items-center justify-center mb-2">
                        <span class="text-brand font-bold text-3xl">MKS</span>
                    </div>
                    <p class="text-sm font-bold">Amin Maghfuri</p>
                    <p class="text-[9px] text-gray-500 uppercase font-black">Founder & Lead Architect</p>
                </div>
            </div>

            <script>window.onload = () => { setTimeout(() => window.print(), 800); }</script>
        </body>
        </html>`;
        printWindow.document.write(html);
        printWindow.document.close();
    };

    const filteredCustomers = useMemo(() => {
        return state.customers.filter(c => 
            c.name.toLowerCase().includes(state.searchTerm.toLowerCase()) || 
            c.phone.includes(state.searchTerm) ||
            c.company_name?.toLowerCase().includes(state.searchTerm.toLowerCase())
        );
    }, [state.customers, state.searchTerm]);

    return { 
        state, 
        setSearchTerm: (s: string) => setState(p => ({ ...p, searchTerm: s })),
        setActiveView: (v: 'pipeline' | 'list') => setState(p => ({ ...p, activeView: v })),
        filteredCustomers,
        updateStatus,
        generateAIScript,
        generateProposal,
        isGeneratingScript,
        refresh: fetchCustomers
    };
};
