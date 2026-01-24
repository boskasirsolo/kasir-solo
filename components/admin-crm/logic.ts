import { useState, useMemo } from 'react';
import { useCRMData } from './shared/use-crm-data';
import { useShadowLogic } from './shadow/use-shadow';
import { usePipelineLogic } from './pipeline/use-pipeline';
import { Customer } from './types';
import { SibosAI } from '../../services/ai/sibos';

export const useCRMLogic = () => {
    const { customers, loading, refreshData } = useCRMData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

    // Delegate specific logic to dedicated hooks
    const shadow = useShadowLogic(customers);
    const pipeline = usePipelineLogic(refreshData);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => 
            (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
            (c.phone || '').includes(searchTerm)
        );
    }, [customers, searchTerm]);

    const runSurveillanceCheck = async () => {
        const indecisive = customers.filter(c => c.is_indecisive_buyer && c.lead_status === 'new');
        if (indecisive.length === 0) return;

        const targetList = indecisive.map(t => `- ${t.name} (${t.phone}) di ${t.intelligence?.most_visited_path}`).join('\n');
        const prompt = `RADAR SURVEILLANCE AKTIF! Bos, ada beberapa calon pembeli yang stuck di checkout:\n${targetList}\n\nKasih strategi pancingan cuan.`;
        
        try {
            const res = await SibosAI.getQuickInsight(prompt);
            setAiRecommendation(res || null);
        } catch(e) {}
    };

    return {
        state: { loading, searchTerm },
        setSearchTerm,
        refresh: refreshData,
        filteredCustomers,
        abandonedLeads: shadow.abandonedLeads,
        runRecoveryAI: shadow.runRecoveryAI,
        isGeneratingScript: shadow.isRescuing,
        updateStatus: pipeline.updateLeadStatus,
        aiRecommendation,
        setAiRecommendation,
        selectedCustomer,
        setSelectedCustomer,
        runSurveillanceCheck
    };
};