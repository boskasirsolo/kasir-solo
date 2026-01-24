import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../../utils';
import { Customer } from '../types';

export const useCRMData = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    const refreshData = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            // Kita coba tarik dari VIEW radar yang barusan kita benerin SQL-nya
            const { data, error } = await supabase
                .from('crm_intelligence_radar')
                .select('*')
                .order('updated_at', { ascending: false });
            
            if (error) {
                // FALLBACK: Kalau view masih error (amit-amit), tarik dari tabel mentah
                console.warn("View access failed, falling back to raw table:", error);
                const { data: rawData, error: rawError } = await supabase
                    .from('crm_profiles')
                    .select('*')
                    .order('updated_at', { ascending: false });
                
                if (rawError) throw rawError;
                
                const fallbackMapped = (rawData || []).map((p: any) => ({
                    ...p,
                    intelligence: {
                        most_visited_path: p.last_notes?.includes('checkout') ? '/checkout' : 'General',
                        total_views: 0, 
                        last_activity_desc: 'Captured via Raw Table',
                        avg_engagement_sec: 0,
                        top_category: 'Hardware'
                    }
                } as Customer));
                setCustomers(fallbackMapped);
                return;
            }

            // Sukses dari View: Mapping data intelijennya
            const mapped = (data || []).map((p: any) => ({
                ...p,
                intelligence: {
                    most_visited_path: p.obsession_page || 'Home',
                    total_views: p.total_views || 0,
                    last_activity_desc: 'Detected via Radar',
                    avg_engagement_sec: 0, 
                    top_category: 'Hardware'
                }
            } as Customer));

            setCustomers(mapped);
        } catch (e) {
            console.error("CRM Data Sync Failed:", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    return { customers, setCustomers, loading, refreshData };
};