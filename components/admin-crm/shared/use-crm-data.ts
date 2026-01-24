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
            // Tarik data dari View Pintar 'crm_intelligence_radar'
            const { data, error } = await supabase
                .from('crm_intelligence_radar')
                .select('*');
            
            if (error) throw error;

            const mapped = (data || []).map((p: any) => ({
                ...p,
                intelligence: {
                    most_visited_path: p.obsession_page,
                    total_views: p.total_views || 0, 
                    last_activity_desc: p.obsession_page,
                    avg_engagement_sec: (p.total_engagement_minutes || 0) * 60,
                    top_category: (p.obsession_page || '').includes('/shop') ? 'Hardware' : 
                                  (p.obsession_page || '').includes('/services') ? 'Service' : 'Unknown'
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