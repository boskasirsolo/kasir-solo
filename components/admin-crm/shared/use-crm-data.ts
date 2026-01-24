
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
            // Tarik data dari VIEW intelijen yang sudah mencakup deteksi otomatis
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
                setCustomers(rawData || []);
                return;
            }

            // Map data dari view ke format Customer
            const mapped = (data || []).map((p: any) => ({
                ...p,
                source_origin: p.source_origin,
                detected_category: p.detected_category,
                intelligence: {
                    most_visited_path: p.obsession_page || 'Home',
                    total_views: p.total_views || 0,
                    last_activity_desc: `Source: ${p.source_origin || 'Direct'}`,
                    avg_engagement_sec: 0, 
                    top_category: p.detected_category === 'hardware' ? 'Hardware' : 'Software'
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
