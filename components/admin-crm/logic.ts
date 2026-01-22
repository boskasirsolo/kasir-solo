
import { useState, useEffect, useMemo } from 'react';
import { supabase, callGeminiWithRotation, slugify } from '../../utils';
import { Customer, CRMState, LeadStatus } from './types';

export const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = { addons: [] };
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

    useEffect(() => {
        fetchCustomers();
        fetchSummary();
    }, []);

    const fetchSummary = async () => {
        if (!supabase) return;
        const { data } = await supabase.rpc('get_crm_summary');
        if (data) setSummary(data);
    };

    const fetchCustomers = async () => {
        if (!supabase) { setState(p => ({ ...p, loading: false })); return; }
        setState(p => ({ ...p, loading: true }));
        try {
            const { data, error } = await supabase.from('customers').select('*').order('last_interaction', { ascending: false });
            if (error) throw error;
            setState(p => ({ ...p, customers: data || [], loading: false }));
        } catch (e) {
            setState(p => ({ ...p, loading: false }));
        }
    };

    const scanPipelineAI = async () => {
        if (state.customers.length === 0) return;
        setIsScanning(true);
        try {
            const leadsData = state.customers.filter(c => c.lead_status !== 'closed').map(c => ({
                name: c.name,
                temp: c.lead_temperature,
                status: c.lead_status,
                last: c.last_interaction
            }));

            const prompt = `
                Role: Senior Sales Strategist PT Mesin Kasir Solo.
                Data Leads: ${JSON.stringify(leadsData)}
                Task: Analisa siapa 3 orang paling potensial buat dapet deal hari ini.
                Kasih alasan singkat gaya "Gue/Lo".
                Output: Markdown list.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            setAiRecommendation(res.text || null);
        } catch (e) {
            alert("Gagal scan AI.");
        } finally {
            setIsScanning(false);
        }
    };

    const updateStatus = async (customerId: string, status: LeadStatus) => {
        if (!supabase) return;
        try {
            await supabase.from('customers').update({ lead_status: status, last_interaction: new Date().toISOString() }).eq('id', customerId);
            setState(p => ({
                ...p,
                customers: p.customers.map(c => c.id === customerId ? { ...c, lead_status: status, last_interaction: new Date().toISOString() } : c)
            }));
            fetchSummary(); 
        } catch (e) { alert("Gagal update status."); }
    };

    const generateAIScript = async (customer: Customer) => {
        setIsGeneratingScript(customer.id);
        const intel = parseIntel(customer.notes);
        try {
            const prompt = `Role: SIBOS AI. Task: Tulis draf chat WA personal buat Juragan ${customer.name}. Topik: Follow up minat ${intel.paket || 'sistem kasir'}. Gunakan bahasa Gue/Lo.`;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(res.text || '')}`, '_blank');
        } finally { setIsGeneratingScript(null); }
    };

    const filteredCustomers = useMemo(() => {
        return state.customers.filter(c => 
            c.name.toLowerCase().includes(state.searchTerm.toLowerCase()) || 
            c.phone.includes(state.searchTerm)
        );
    }, [state.customers, state.searchTerm]);

    return { 
        state, summary, isGeneratingScript, isScanning, aiRecommendation,
        setSearchTerm: (s: string) => setState(p => ({ ...p, searchTerm: s })),
        setActiveView: (v: 'pipeline' | 'list') => setState(p => ({ ...p, activeView: v })),
        filteredCustomers, updateStatus, generateAIScript, scanPipelineAI,
        setAiRecommendation,
        generateProposal: (customer: Customer, config: any) => {
             // Implementation remains same
        },
        refresh: () => { fetchCustomers(); fetchSummary(); }
    };
};
