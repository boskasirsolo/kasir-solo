
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../utils';
import { Customer, LeadTemperature } from '../types';

/**
 * Helper: Kalkulasi Label "Waktu Terakhir" (Street Smart Style)
 */
const getTimeLabel = (dateStr: string) => {
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
    // 1. Prioritas: Label Manual dari DB jika sudah diatur (Override)
    if (customer.lead_temperature === 'hot' || customer.lead_temperature === 'warm') {
        return customer.lead_temperature;
    }

    // 2. Logic Radar: Jika baru aktif < 1 jam dan banyak klik, auto HOT
    const isRecentlyActive = (Date.now() - new Date(customer.updated_at).getTime()) < 3600000;
    const highActivity = (customer.total_views || 0) > 10;
    
    if (customer.is_indecisive_buyer || (isRecentlyActive && highActivity)) return 'hot';
    if (customer.source_origin === 'simulasi' || highActivity) return 'warm';
    
    return 'cold';
};

export const useCRMData = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // Tarik data dari VIEW intelijen yang menggabungkan Profile + Log Analytics
            const { data, error } = await supabase
                .from('crm_intelligence_radar')
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (error) {
                console.warn("View radar access failed, falling back to raw profiles:", error);
                const { data: rawData, error: rawError } = await supabase
                    .from('crm_profiles')
                    .select('*')
                    .order('updated_at', { ascending: false });
                
                if (rawError) throw rawError;
                
                const mappedRaw = (rawData || []).map((p: any) => ({
                    ...p,
                    lead_temperature: detectTemperature(p),
                    last_seen_label: getTimeLabel(p.updated_at)
                } as Customer));
                
                setCustomers(mappedRaw);
                return;
            }

            // Map data dari view ke format Customer dengan agregasi intelijen
            const mapped = (data || []).map((p: any) => ({
                ...p,
                lead_temperature: detectTemperature(p),
                last_seen_label: getTimeLabel(p.updated_at),
                intelligence: {
                    most_visited_path: p.obsession_page || 'Home',
                    total_views: p.total_views || 0,
                    last_activity_desc: `Source: ${p.source_origin || 'Direct'}`,
                    avg_engagement_sec: p.avg_engagement_sec || 0, 
                    top_category: p.detected_category === 'hardware' ? 'Hardware' : 'Software',
                    last_seen_at: p.updated_at
                }
            } as Customer));

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
