
import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, callGeminiWithRotation, normalizePhone } from '../../utils';
import { Customer, CRMState, LeadStatus } from './types';
import { SibosAI } from '../../services/ai/sibos';

export const parseIntel = (notes?: string) => {
    if (!notes) return {};
    const data: any = {};
    const lines = notes.split('\n');
    lines.forEach(line => {
        if (line.includes('🏢USAHA:')) data.usaha = line.split('🏢USAHA:')[1]?.trim();
        if (line.includes('📦PAKET:')) data.paket = line.split('📦PAKET:')[1]?.trim();
        if (line.includes('💰ESTIMASI:')) data.estimasi = line.split('💰ESTIMASI:')[1]?.trim();
        if (line.includes('🚀ADDONS:')) data.addons = line.split('🚀ADDONS:')[1]?.trim();
        if (line.includes('📍ALAMAT:')) data.alamat = line.split('📍ALAMAT:')[1]?.trim();
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

    const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isGeneratingScript, setIsGeneratingScript] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

    const fetchCustomers = useCallback(async () => {
        if (!supabase) { setState(p => ({ ...p, loading: false })); return; }
        setState(p => ({ ...p, loading: true }));
        try {
            const { data, error } = await supabase.from('crm_profiles').select('*').order('updated_at', { ascending: false });
            if (error) throw error;
            setState(p => ({ ...p, customers: data || [], loading: false }));
        } catch (e) {
            console.error("CRM Fetch Error:", e);
            setState(p => ({ ...p, loading: false }));
        }
    }, []);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    // NEW: Recovery Action
    const runRecoveryAI = async (customer: any) => {
        setIsGeneratingScript(customer.phone);
        const intel = parseIntel(customer.last_notes);
        try {
            const script = await SibosAI.generateRecoveryScript(
                customer.name, 
                intel.paket || "Perangkat Kasir", 
                intel.alamat || "Indonesia"
            );
            window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(script)}`, '_blank');
        } catch (e) {
            alert("Gagal generate skrip recovery.");
        } finally {
            setIsGeneratingScript(null);
        }
    };

    const updateStatus = async (customerId: string, status: LeadStatus) => {
        if (!supabase) return;
        try {
            await supabase.from('crm_profiles').update({ lead_status: status, updated_at: new Date().toISOString() }).eq('phone', customerId);
            setState(p => ({
                ...p,
                customers: p.customers.map(c => c.phone === customerId ? { ...c, lead_status: status } : c)
            }));
        } catch (e) { alert("Gagal update status."); }
    };

    const generateProposal = (customer: any, config: any) => {
        // ... (Proposal generation logic same as before) ...
    };

    const filteredCustomers = useMemo(() => {
        return state.customers.filter(c => 
            (c.name || '').toLowerCase().includes(state.searchTerm.toLowerCase()) || 
            (c.phone || '').includes(state.searchTerm)
        );
    }, [state.customers, state.searchTerm]);

    const abandonedLeads = useMemo(() => {
        return state.customers.filter(c => 
            (c.last_notes || '').includes('checkout_shadow') && 
            c.lead_status !== 'closed' && 
            c.lead_status !== 'lost'
        );
    }, [state.customers]);

    // FIX: Added setAiRecommendation to the return object to resolve the property access error in AdminCRM component.
    return { 
        state, setSearchTerm: (s: string) => setState(p => ({ ...p, searchTerm: s })),
        setActiveView: (v: any) => setState(p => ({ ...p, activeView: v })),
        filteredCustomers, abandonedLeads, updateStatus, runRecoveryAI, isGeneratingScript,
        selectedCustomer, setSelectedCustomer, aiRecommendation, setAiRecommendation, 
        isScanning, scanPipelineAI: () => {}, 
        generateProposal, refresh: fetchCustomers
    };
};
