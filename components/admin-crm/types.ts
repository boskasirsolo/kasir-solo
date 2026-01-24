
export type LeadTemperature = 'cold' | 'warm' | 'hot';
export type LeadStatus = 'new' | 'contacted' | 'negotiating' | 'closed' | 'lost';

export interface BehavioralIntel {
    total_views: number;
    most_visited_path: string;
    last_activity_desc: string;
    avg_engagement_sec: number;
    top_category: 'Hardware' | 'Software' | 'Article' | 'Service' | 'Unknown';
}

export interface Customer {
    phone: string; // Primary Key
    name: string;
    email?: string;
    location?: string;
    company_name?: string;
    business_category?: string;
    business_scale?: string;
    lead_status: LeadStatus;
    lead_temperature: LeadTemperature;
    total_spent: number;
    total_orders: number;
    interaction_history: any[];
    last_notes?: string;
    updated_at: string;
    created_at: string;
    visitor_id?: string;
    // AI & RADAR ENHANCEMENTS
    intelligence?: BehavioralIntel;
    is_indecisive_buyer?: boolean;
    ai_probability?: number; // 0 - 100
    ai_closing_strategy?: string;
    ai_buyer_persona?: string;
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
