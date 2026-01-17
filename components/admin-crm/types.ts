
export type LeadTemperature = 'cold' | 'warm' | 'hot';
export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    email?: string;
    company_name?: string;
    business_category?: string;
    business_scale?: string;
    location?: string;
    source: string;
    lead_status: LeadStatus;
    lead_temperature: LeadTemperature;
    total_spent: number;
    last_interaction: string;
    notes?: string;
    created_at: string;
}

export interface CRMState {
    customers: Customer[];
    loading: boolean;
    searchTerm: string;
    activeView: 'pipeline' | 'list';
}

export const PIPELINE_STAGES: { id: LeadStatus; label: string; color: string }[] = [
    { id: 'new', label: '🆕 Baru Masuk', color: 'border-blue-500' },
    { id: 'contacted', label: '📞 Analisa Kebutuhan', color: 'border-yellow-500' },
    { id: 'negotiating', label: '📑 Kirim Penawaran', color: 'border-brand-orange' },
    { id: 'closed', label: '🤝 Deal (Mitra)', color: 'border-green-500' },
    { id: 'lost', label: '❌ Batal', color: 'border-gray-500' }
];
