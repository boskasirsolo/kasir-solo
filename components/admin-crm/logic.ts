import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, callGeminiWithRotation, normalizePhone } from '../../utils';
import { Customer, CRMState, BehavioralIntel } from './types';
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
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

    const fetchIntelligenceForCustomer = async (visitorId?: string): Promise<BehavioralIntel | undefined> => {
        if (!visitorId || !supabase) return undefined;
        try {
            const { data: logs } = await supabase
                .from('analytics_logs')
                .select('page_path, created_at, event_type')
                .eq('visitor_id', visitorId)
                .order('created_at', { ascending: false });

            if (!logs || logs.length === 0) return undefined;

            const views = logs.filter(l => l.event_type === 'page_view');
            const paths = views.map(v => v.page_path);
            const counts: any = {};
            paths.forEach(p => counts[p] = (counts[p] || 0) + 1);
            const mostVisited = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];

            let topCat: any = 'Unknown';
            if (mostVisited.includes('/shop')) topCat = 'Hardware';
            else if (mostVisited.includes('/articles')) topCat = 'Article';
            else if (mostVisited.includes('/services')) topCat = 'Service';

            return {
                total_views: views.length,
                most_visited_path: mostVisited,
                last_activity_desc: views[0]?.page_path || 'Main Page',
                avg_engagement_sec: 0, 
                top_category: topCat
            };
        } catch (e) { return undefined; }
    };

    const fetchCustomers = useCallback(async () => {
        if (!supabase) { setState(p => ({ ...p, loading: false })); return; }
        setState(p => ({ ...p, loading: true }));
        try {
            const { data: profiles, error } = await supabase.from('crm_profiles').select('*').order('updated_at', { ascending: false });
            if (error) throw error;

            const customersWithIntel = await Promise.all((profiles || []).map(async (p: any) => {
                const intel = await fetchIntelligenceForCustomer(p.visitor_id);
                return { ...p, intelligence: intel } as Customer;
            }));

            setState(p => ({ ...p, customers: customersWithIntel, loading: false }));
        } catch (e) {
            console.error("CRM Fetch Error:", e);
            setState(p => ({ ...p, loading: false }));
        }
    }, []);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    const runRecoveryAI = async (customer: Customer) => {
        setIsGeneratingScript(customer.phone);
        const intel = parseIntel(customer.last_notes);
        const behaviorContext = customer.intelligence 
            ? `Baru saja mengunjungi ${customer.intelligence.most_visited_path} sebanyak ${customer.intelligence.total_views} kali.` 
            : "";

        try {
            const script = await SibosAI.generateRecoveryScript(
                customer.name, 
                intel.paket || "Perangkat Kasir", 
                intel.alamat || "Indonesia",
                behaviorContext
            );
            window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(script)}`, '_blank');
        } catch (e) {
            alert("Gagal generate skrip recovery.");
        } finally {
            setIsGeneratingScript(null);
        }
    };

    const updateStatus = async (customerId: string, status: string) => {
        if (!supabase) return;
        try {
            await supabase.from('crm_profiles').update({ status: status, updated_at: new Date().toISOString() }).eq('phone', customerId);
            setState(p => ({
                ...p,
                customers: p.customers.map(c => c.phone === customerId ? { ...c, status: status } : c)
            }));
        } catch (e) { alert("Gagal update status."); }
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
            c.status !== 'closed' && 
            c.status !== 'lost'
        );
    }, [state.customers]);

    return { 
        state, setSearchTerm: (s: string) => setState(p => ({ ...p, searchTerm: s })),
        setActiveView: (v: any) => setState(p => ({ ...p, activeView: v })),
        filteredCustomers, abandonedLeads, updateStatus, runRecoveryAI, isGeneratingScript,
        selectedCustomer, setSelectedCustomer, aiRecommendation, setAiRecommendation, 
        refresh: fetchCustomers
    };
};