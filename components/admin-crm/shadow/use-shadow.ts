import { useState, useMemo } from 'react';
import { Customer } from '../types';
import { SibosAI } from '../../../services/ai/sibos';
import { parseIntel } from '../shared/utils';

export const useShadowLogic = (customers: Customer[]) => {
    const [isRescuing, setIsRescuing] = useState<string | null>(null);

    const abandonedLeads = useMemo(() => {
        return customers.filter(c => {
            const notes = (c.last_notes || '').toLowerCase();
            const status = (c.lead_status || 'new').toLowerCase();
            
            // JARING RAKUS: Tangkap semua yang bau-bau checkout atau simulasi yang belum deal
            const hasCheckoutSignature = notes.includes('checkout') || 
                                         notes.includes('shadow') || 
                                         notes.includes('estimasi') ||
                                         notes.includes('paket');
            
            const isUrgent = c.is_indecisive_buyer === true;

            // Tampilkan kalau dia New atau Contacted (masih prospek)
            return (hasCheckoutSignature || isUrgent) && (status === 'new' || status === 'contacted');
        });
    }, [customers]);

    const runRecoveryAI = async (customer: Customer) => {
        setIsRescuing(customer.phone);
        const intel = parseIntel(customer.last_notes);
        
        const behaviorContext = customer.intelligence 
            ? `Terdeteksi naksir halaman ${customer.intelligence.most_visited_path}.` 
            : "";

        try {
            const script = await SibosAI.generateRecoveryScript(
                customer.name, 
                intel.paket || "Mesin Kasir Solo", 
                intel.alamat || "Indonesia",
                behaviorContext,
                customer.is_indecisive_buyer 
            );
            window.open(`https://wa.me/${customer.phone}?text=${encodeURIComponent(script)}`, '_blank');
        } catch (e) {
            alert("Gagal merakit pesan pancingan.");
        } finally {
            setIsRescuing(null);
        }
    };

    return { abandonedLeads, isRescuing, runRecoveryAI };
};