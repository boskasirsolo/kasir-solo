
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../utils';
import { Customer, LeadTemperature } from '../types';

/**
 * Helper: Kalkulasi Label "Waktu Terakhir" (Street Smart Style)
 */
const getTimeLabel = (dateStr: string) => {
    if (!dateStr) return "Ghaib";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Baru saja";
    if (mins < 60) return `${mins}m lalu`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}j lalu`;
    return new Date(dateStr).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
};

/**
 * Helper: Deteksi Suhu Prospek Secara Otomatis Berdasarkan Aktivitas Radar
 */
const detectTemperature = (customer: any): LeadTemperature => {
    // 1. Prioritas: Label Manual dari DB (Override)
    if (customer.lead_temperature === 'hot' || customer.lead_temperature === 'warm') {
        return customer.lead_temperature as LeadTemperature;
    }

    // 2. Logic Radar: Jika interaksi tinggi atau terdeteksi galau di checkout
    const highActivity = (customer.total_views || 0) > 10;
    const isIndecisive = !!customer.calculated_indecisive;
    
    if (isIndecisive) return 'hot';
    if (highActivity) return 'warm';
    
    return 'cold';
};

export const useCRMData = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // Tarik data dari VIEW intelijen yang baru dibuat
            const { data, error } = await supabase
                .from('crm_intelligence_radar')
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.warn("View radar missing or broken, use fallback:", error);
                const { data: rawData } = await supabase.from('crm_profiles').select('*').order('updated_at', { ascending: false });
                setCustomers((rawData || []).map(p => ({ 
                    ...p, 
                    lead_temperature: p.lead_temperature || 'cold',
                    interaction_history: [],
                    intelligence: {
                        total_views: 0,
                        most_visited_path: 'Unknown',
                        avg_engagement_sec: 0,
                        last_activity_desc: 'Radar Offline',
                        top_category: 'Unknown',
                        last_seen_at: p.updated_at
                    }
                } as Customer)));
                return;
            }

            const mapped = (data || []).map((p: any) => {
                const customerObj: Customer = {
                    ...p,
                    is_indecisive_buyer: !!p.calculated_indecisive,
                    lead_temperature: detectTemperature(p),
                    last_seen_label: getTimeLabel(p.last_seen_at || p.updated_at),
                    interaction_history: p.interaction_history || [],
                    intelligence: {
                        most_visited_path: p.obsession_page || 'Home',
                        total_views: p.total_views || 0,
                        last_activity_desc: `Dilihat terakhir di ${p.obsession_page || 'Halaman Utama'}`,
                        avg_engagement_sec: p.avg_engagement_sec || 0, 
                        top_category: (p.obsession_page || '').includes('/shop') ? 'Hardware' : 'Software',
                        last_seen_at: p.last_seen_at || p.updated_at
                    }
                };
                
                return customerObj;
            });

            setCustomers(mapped);
        } catch (e) {
            console.error("CRM Radar Sync Failed:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return { customers, setCustomers, loading, refreshData };
};
