
import { useState, useEffect, useMemo } from 'react';
import { supabase, callGeminiWithRotation } from '../../utils';
import { Customer, CRMState, LeadStatus } from './types';

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
        try {
            const prompt = `
            Role: SIBOS AI (Alter-ego Amin Maghfuri). 
            Task: Tulis 1 paragraf skrip WhatsApp super personal buat menyapa customer ini.
            Data Customer:
            - Nama: ${customer.name}
            - Sumber: ${customer.source}
            - Catatan: ${customer.notes || 'Belum ada'}
            - Status Sekarang: ${customer.lead_status}
            - Skala Bisnis: ${customer.business_scale || '-'}
            
            Rules:
            1. Pake bahasa "Gue/Lo" yang sopan tapi akrab (Street-Smart).
            2. Jangan kaku kayak CS bank.
            3. Sebut spesifik apa yang dia lakuin (misal: "tadi liat lo simulasi paket Resto").
            4. Akhiri dengan ajakan diskusi santai.
            5. JANGAN pake kata "Halo Kak". Pake "Juragan" atau "Bos".
            
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
        isGeneratingScript,
        refresh: fetchCustomers
    };
};
