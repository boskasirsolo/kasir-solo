import { useState, useEffect, useMemo, useCallback } from 'react';
import { supabase, callGeminiWithRotation, normalizePhone } from '../../utils';
import { Customer, CRMState, LeadStatus, BehavioralIntel } from './types';
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

    // --- STRATEGIC ACTION: SURVEILLANCE ALERT ---
    const generateSurveillanceAlert = async (targets: Customer[]) => {
        if (targets.length === 0) return;
        
        const targetList = targets.map(t => `- ${t.name} (${t.phone}) di halaman ${t.intelligence?.most_visited_path}`).join('\n');
        const prompt = `
            RADAR SURVEILLANCE AKTIF! Bos, ada beberapa calon pembeli yang stuck di checkout/layanan:
            ${targetList}
            
            TUGAS: Kasih instruksi strategi "Sikat Sekarang" buat Admin. Sebutkan siapa yang paling prioritas diselamatkan cuannya.
        `;
        
        try {
            const res = await SibosAI.getQuickInsight(prompt);
            setAiRecommendation(res || null);
        } catch(e) {}
    };

    const fetchCustomers = useCallback(async () => {
        if (!supabase) { setState(p => ({ ...p, loading: false })); return; }
        setState(p => ({ ...p, loading: true }));
        try {
            const { data: radarData, error } = await supabase
                .from('crm_intelligence_radar')
                .select('*');
            
            if (error) throw error;

            const mappedCustomers = (radarData || []).map((p: any) => ({
                ...p,
                intelligence: {
                    most_visited_path: p.obsession_page,
                    total_views: 0, 
                    last_activity_desc: p.obsession_page,
                    avg_engagement_sec: (p.total_engagement_minutes || 0) * 60,
                    top_category: (p.obsession_page || '').includes('/shop') ? 'Hardware' : 
                                  (p.obsession_page || '').includes('/services') ? 'Service' : 'Unknown'
                }
            } as Customer));

            setState(p => ({ ...p, customers: mappedCustomers, loading: false }));

            // Trigger Surveillance Alert if any indecisive buyers found
            const indecisive = mappedCustomers.filter(c => c.is_indecisive_buyer && c.lead_status === 'new');
            if (indecisive.length > 0) {
                generateSurveillanceAlert(indecisive);
            }
        } catch (e) {
            console.error("CRM Fetch Error:", e);
            setState(p => ({ ...p, loading: false }));
        }
    }, []);

    useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

    const runRecoveryAI = async (customer: Customer) => {
        setIsGeneratingScript(customer.phone);
        const intel = parseIntel(customer.last_notes);
        
        // Behavioral context injection
        const behaviorContext = customer.intelligence 
            ? `Tadi dia mantengin halaman ${customer.intelligence.most_visited_path} selama ${Math.round(customer.intelligence.avg_engagement_sec / 60)} menit tapi belum bayar.` 
            : "";

        try {
            const script = await SibosAI.generateRecoveryScript(
                customer.name, 
                intel.paket || "Perangkat Kasir", 
                intel.alamat || "Indonesia",
                behaviorContext,
                customer.is_indecisive_buyer // PASSING FLAG STEP 3
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

    const filteredCustomers = useMemo(() => {
        return state.customers.filter(c => 
            (c.name || '').toLowerCase().includes(state.searchTerm.toLowerCase()) || 
            (c.phone || '').includes(state.searchTerm)
        );
    }, [state.customers, state.searchTerm]);

    const abandonedLeads = useMemo(() => {
        return state.customers.filter(c => 
            ((c.last_notes || '').includes('checkout_shadow') || c.is_indecisive_buyer) && 
            c.lead_status !== 'closed' && 
            c.lead_status !== 'lost'
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