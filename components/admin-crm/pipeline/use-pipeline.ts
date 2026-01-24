import { supabase } from '../../../utils';
import { Customer, LeadStatus } from '../types';

export const usePipelineLogic = (onDataUpdate: () => void) => {
    const updateLeadStatus = async (phone: string, status: LeadStatus) => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from('crm_profiles')
                .update({ 
                    lead_status: status, 
                    updated_at: new Date().toISOString() 
                })
                .eq('phone', phone);
            
            if (error) throw error;
            onDataUpdate(); // Refresh global data
        } catch (e) {
            alert("Gagal geser kartu prospek.");
        }
    };

    return { updateLeadStatus };
};