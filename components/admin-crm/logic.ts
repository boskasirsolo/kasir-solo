
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, callGeminiWithRotation, slugify } from '../../utils';
import { Customer, CRMState, LeadStatus } from './types';

export const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = {};
    const lines = notes.split('\n');
    lines.forEach(line => {
        if (line.includes('🏢USAHA:')) data.usaha = line.split('🏢USAHA:')[1]?.trim();
        if (line.includes('📦PAKET:')) data.paket = line.split('📦PAKET:')[1]?.trim();
        if (line.includes('💰ESTIMASI:')) data.estimasi = line.split('💰ESTIMASI:')[1]?.trim();
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

    const [summary, setSummary] = useState<any>(null);
    const [isGeneratingScript, setIsGeneratingScript] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        if (!supabase) { setState(p => ({ ...p, loading: false })); return; }
        setState(p => ({ ...p, loading: true }));
        try {
            const { data, error } = await supabase
                .from('crm_profiles')
                .select('*')
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setState(p => ({ ...p, customers: data || [], loading: false }));
        } catch (e) {
            console.error("CRM Fetch Error:", e);
            setState(p => ({ ...p, loading: false }));
        }
    }, []);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const scanPipelineAI = async () => {
        if (state.customers.length === 0) return;
        setIsScanning(true);
        try {
            const leadsData = state.customers.filter(c => c.lead_status !== 'closed').map(c => ({
                name: c.name,
                temp: c.lead_temperature,
                status: c.lead_status,
                last: c.created_at
            }));

            const prompt = `
                Role: Senior Sales Strategist PT Mesin Kasir Solo.
                Data Unified CRM: ${JSON.stringify(leadsData)}
                Task: Analisa siapa 3 orang paling potensial buat dapet deal (closing) hari ini.
                Kasih alasan tajam pake gaya "Gue/Lo".
                Output: Markdown list. No intro.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setAiRecommendation(res.text || null);
        } catch (e) {
            alert("Gagal analisa AI.");
        } finally {
            setIsScanning(false);
        }
    };

    const updateStatus = async (customerId: string, status: LeadStatus) => {
        if (!supabase) return;
        try {
            await supabase.from('crm_profiles').update({ lead_status: status, updated_at: new Date().toISOString() }).eq('phone', customerId);
            setState(p => ({
                ...p,
                customers: p.customers.map(c => c.phone === customerId ? { ...c, lead_status: status, last_interaction: new Date().toISOString() } : c)
            }));
        } catch (e) { alert("Gagal update status."); }
    };

    const generateAIScript = async (customer: any) => {
        setIsGeneratingScript(customer.phone);
        const intel = parseIntel(customer.notes || customer.last_notes);
        try {
            const prompt = `Role: SIBOS AI. Task: Tulis draf chat WA personal buat Juragan ${customer.name}. Topik: Follow up minat ${intel.paket || 'sistem kasir'}. Gunakan data histori: ${JSON.stringify(customer.interaction_history)}. Gaya: Street-smart, akrab, ngebantu (Gue/Lo).`;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(res.text || '')}`, '_blank');
        } finally { setIsGeneratingScript(null); }
    };

    const generateProposal = useCallback((customer: any, config: any) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert("Pop-up diblokir! Izinkan pop-up untuk melihat proposal.");

        const companyName = config.company_legal_name || "PT MESIN KASIR SOLO";
        const dateStr = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        const intel = parseIntel(customer.notes || customer.last_notes);

        const html = `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>PROPOSAL - ${customer.name}</title>
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
                    <p class="text-xs text-gray-500 uppercase tracking-widest mt-1">Digital Solutions Partner</p>
                </div>
                <div class="text-right">
                    <h2 class="text-2xl font-bold">DRAFT PROPOSAL</h2>
                    <p class="text-sm text-gray-600">Ref: CRM-${customer.phone.slice(-6)}</p>
                    <p class="text-sm text-gray-600">${dateStr}</p>
                </div>
            </div>

            <div class="mb-10">
                <h3 class="text-lg font-bold mb-4 border-l-4 border-brand pl-4">DATA CALON MITRA</h3>
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <p><span class="text-gray-500 font-bold uppercase text-[10px] block">Nama Juragan:</span> ${customer.name}</p>
                    <p><span class="text-gray-500 font-bold uppercase text-[10px] block">Kontak WA:</span> ${customer.phone}</p>
                    <p><span class="text-gray-500 font-bold uppercase text-[10px] block">Lokasi:</span> ${customer.location || (intel as any).alamat || '-'}</p>
                </div>
            </div>

            <div class="mb-10">
                <h3 class="text-lg font-bold mb-4 border-l-4 border-brand pl-4">MINAT SOLUSI</h3>
                <div class="bg-gray-50 p-6 rounded border border-gray-200">
                    <p class="font-bold text-brand mb-2">Paket/Produk Yang Diminati:</p>
                    <p class="text-lg font-display">${intel.paket || 'Konsultasi Arsitektur Sistem'}</p>
                    ${intel.estimasi ? `<p class="mt-4 text-sm text-gray-500">Estimasi Nilai Investasi: <span class="font-bold text-gray-900">${intel.estimasi}</span></p>` : ''}
                </div>
            </div>

            <div class="mb-10">
                <h3 class="text-lg font-bold mb-4 border-l-4 border-brand pl-4">MENGAPA KAMI?</h3>
                <div class="grid grid-cols-2 gap-6 text-xs text-gray-600">
                    <div>
                        <p class="font-bold text-gray-900 mb-1">Anti Tuyul Digital</p>
                        <p>Sistem kami dirancang untuk menutup celah kebocoran uang di kasir dan stok gudang.</p>
                    </div>
                    <div>
                        <p class="font-bold text-gray-900 mb-1">Pendampingan Langsung</p>
                        <p>Training intensif untuk owner dan staff sampai benar-benar mahir menggunakan sistem.</p>
                    </div>
                </div>
            </div>

            <div class="mt-20 flex justify-between items-end">
                <div class="w-1/3 text-center">
                    <p class="text-xs text-gray-400 mb-16">Diterima Oleh,</p>
                    <div class="h-px bg-gray-300 w-full mb-2"></div>
                    <p class="font-bold uppercase">${customer.name}</p>
                </div>
                <div class="w-1/3 text-center">
                    <p class="text-xs text-gray-400 mb-4">Hormat Kami,</p>
                    <div class="w-20 h-20 mx-auto border-2 border-brand rounded flex items-center justify-center mb-2">
                        <span class="text-brand font-bold text-3xl">MKS</span>
                    </div>
                    <p class="font-bold">Amin Maghfuri</p>
                    <p class="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Founder / CEO</p>
                </div>
            </div>

            <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
        </body>
        </html>`;
        printWindow.document.write(html);
        printWindow.document.close();
    }, []);

    const filteredCustomers = useMemo(() => {
        return state.customers.filter(c => 
            (c.name || '').toLowerCase().includes(state.searchTerm.toLowerCase()) || 
            (c.phone || '').includes(state.searchTerm)
        );
    }, [state.customers, state.searchTerm]);

    return { 
        state, summary, isGeneratingScript, isScanning, aiRecommendation,
        setSearchTerm: (s: string) => setState(p => ({ ...p, searchTerm: s })),
        setActiveView: (v: 'pipeline' | 'list') => setState(p => ({ ...p, activeView: v })),
        filteredCustomers, updateStatus, generateAIScript, scanPipelineAI,
        generateProposal,
        setAiRecommendation,
        refresh: fetchCustomers
    };
};
