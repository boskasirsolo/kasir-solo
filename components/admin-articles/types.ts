
import { Article } from '../../types';

export type FilterType = 'all' | 'pillar' | 'cluster' | 'orphan';

export interface KeywordData {
    keyword: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
    type: 'Trend' | 'Evergreen' | 'Niche';
}

export interface GenConfig {
    autoImage: boolean;
    autoCategory: boolean;
    autoAuthor: boolean;
    imageStyle: 'cinematic' | 'cyberpunk' | 'corporate' | 'studio' | 'minimalist';
    narrative: 'narsis' | 'umum'; 
}

export interface AuthorPersona {
    name: string;
    role: string; // 'Founder' | 'Editor'
    mode: 'personal' | 'team';
}

export interface ArticleFormState {
    id: number | null;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    // author field removed from form state, handled by global persona
    readTime: string;
    imagePreview: string;
    uploadFile: File | null;
    status: 'published' | 'draft' | 'scheduled';
    scheduled_for: string;
    type: 'pillar' | 'cluster';
    pillar_id: number;
    cluster_ideas: string[];
    scheduleStart: string;
}

export const PRESET_TOPICS = [
    { id: 'fnb', label: 'Bisnis Kuliner (F&B)' },
    { id: 'retail', label: 'Retail & Minimarket' },
    { id: 'tech', label: 'Teknologi Kasir (POS)' },
    { id: 'finance', label: 'Keuangan & Pajak' },
    { id: 'marketing', label: 'Digital Marketing' },
    { id: 'hr', label: 'Manajemen Karyawan' },
    { id: 'franchise', label: 'Sistem Franchise' },
    { id: 'scam', label: 'Keamanan & Fraud' }
];

// Sesuai dengan data frontend (Category Tree)
export const ARTICLE_CATEGORIES = [
    "Bisnis Tips", "Manajemen", "Keuangan", "HR", "Franchise", // Business
    "Hardware Review", "Android POS", "Windows POS", "Teknologi", "Tutorial", // Tech
    "Digital Marketing", "Branding", "Loyalty Program", "Promosi" // Marketing
];
