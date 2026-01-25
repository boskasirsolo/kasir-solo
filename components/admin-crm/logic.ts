import { useState, useMemo, useEffect } from 'react';
import { useCRMData } from './shared/use-crm-data';
import { useShadowLogic } from './shadow/use-shadow';
import { usePipelineLogic } from './pipeline/use-pipeline';
import { Customer, LeadStatus, LeadTemperature } from './types';
import { SibosAI } from '../../services/ai/sibos';
import { supabase } from '../../utils';

const ITEMS_PER_PAGE = 12;

export const useCRMLogic = () => {
    const { customers, loading, refreshData } = useCRMData();
    const [searchTerm, setSearchTerm] = useState('');
    const [tempFilter, setTempFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sourceFilter, setSourceFilter] = useState<string>('all');
    const [page, setPage] = useState(1);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);

    // Delegate specific logic to dedicated hooks
    const shadow = useShadowLogic(customers);
    const pipeline = usePipelineLogic(refreshData);

    // Reset ke halaman 1 tiap kali filter berubah
    useEffect(() => {
        setPage(1);
    }, [searchTerm, tempFilter, statusFilter, sourceFilter]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                                (c.phone || '').includes(searchTerm);
            
            const matchesTemp = tempFilter === 'all' || c.lead_temperature === tempFilter;
            const matchesStatus = statusFilter === 'all' || c.lead_status === statusFilter;
            const matchesSource = sourceFilter === 'all' || c.detected_category === sourceFilter;
            
            return matchesSearch && matchesTemp && matchesStatus && matchesSource;
        });
    }, [customers, searchTerm, tempFilter, statusFilter, sourceFilter]);

    const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
    
    const paginatedCustomers = useMemo(() => {
        const start = (page - 1) * ITEMS_PER_PAGE;
        return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredCustomers, page]);

    const deleteCustomer = async (phone: string) => {
        if (!confirm("Hapus juragan ini dari database? Tindakan ini gak bisa dibatalin.")) return;
        if (!supabase) return;
        try {
            const { error } = await supabase.from('crm_profiles').delete().eq('phone', phone);
            if (error) throw error;
            refreshData();
            setSelectedCustomer(null);
        } catch (e) {
            alert("Gagal hapus data juragan.");
        }
    };

    const updateTemperature = async (phone: string, temp: LeadTemperature) => {
        if (!supabase) return;
        try {
            const { error } = await supabase.from('crm_profiles').update({ lead_temperature: temp }).eq('phone', phone);
            if (error) throw error;
            refreshData();
        } catch (e) {
            alert("Gagal update suhu.");
        }
    };

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
        state: { loading, searchTerm, tempFilter, statusFilter, sourceFilter, page, totalPages },
        setSearchTerm,
        setTempFilter,
        setStatusFilter,
        setSourceFilter,
        setPage,
        refresh: refreshData,
        filteredCustomers: paginatedCustomers,
        totalCount: filteredCustomers.length,
        abandonedLeads: shadow.abandonedLeads,
        runRecoveryAI: shadow.runRecoveryAI,
        isGeneratingScript: shadow.isRescuing,
        updateStatus: pipeline.updateLeadStatus,
        deleteCustomer,
        updateTemperature,
        aiRecommendation,
        setAiRecommendation,
        selectedCustomer,
        setSelectedCustomer,
        runSurveillanceCheck
    };
};