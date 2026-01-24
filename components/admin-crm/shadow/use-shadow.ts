import { useState, useMemo } from 'react';
import { Customer } from '../types';
import { SibosAI } from '../../../services/ai/sibos';
import { parseIntel } from '../shared/utils';

export const useShadowLogic = (customers: Customer[]) => {
    const [isRescuing, setIsRescuing] = useState<string | null>(null);

    const abandonedLeads = useMemo(() => {
        return customers.filter(c => 
            ((c.last_notes || '').includes('checkout_shadow') || c.is_indecisive_buyer) && 
            c.lead_status !== 'closed' && 
            c.lead_status !== 'lost'
        );
    }, [customers]);

    const runRecoveryAI = async (customer: Customer) => {
        setIsRescuing(customer.phone);
        const intel = parseIntel(customer.last_notes);
        
        const behaviorContext = customer.intelligence 
            ? `Tadi dia mantengin halaman ${customer.intelligence.most_visited_path} selama ${Math.round(customer.intelligence.avg_engagement_sec / 60)} menit tapi belum bayar.` 
            : "";

        try {
            const script = await SibosAI.generateRecoveryScript(
                customer.name, 
                intel.paket || "Perangkat Kasir", 
                intel.alamat || "Indonesia",
                behaviorContext,
                customer.is_indecisive_buyer 
            );
            window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(script)}`, '_blank');
        } catch (e) {
            alert("Gagal rakit pesan recovery.");
        } finally {
            setIsRescuing(null);
        }
    };

    return { abandonedLeads, isRescuing, runRecoveryAI };
};