
import { Article } from '../../types';

export type FilterType = 'all' | 'pillar' | 'cluster' | 'orphan' | 'draft' | 'scheduled';

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
    id: string;
    name: string;
    role: string; // 'Founder' | 'Editor'
    mode: 'personal' | 'team';
    avatar: string; // New field for profile picture
}

export const AUTHOR_PRESETS: AuthorPersona[] = [
    {
        id: 'personal',
        name: 'Amin Maghfuri',
        role: 'Founder, CEO',
        mode: 'personal',
        avatar: '' // Will use upload or placeholder
    },
    {
        id: 'team',
        name: 'Tim Redaksi',
        role: 'Content Team',
        mode: 'team',
        avatar: ''
    }
];

export const NARRATIVE_TONES = [
    { id: 'story', label: 'Storytelling (Pengalaman)', desc: 'Bercerita dari sudut pandang pelaku (Gue/Saya).' },
    { id: 'opinion', label: 'Opini & Kritik', desc: 'Tajam, subjektif, dan berani mengambil sikap.' },
    { id: 'analysis', label: 'Analisis Mendalam', desc: 'Berbasis data, fakta, dan riset komprehensif.' },
    { id: 'tutorial', label: 'Tutorial / How-To', desc: 'Panduan teknis step-by-step yang jelas.' },
    { id: 'case_study', label: 'Studi Kasus', desc: 'Bedah masalah real dan solusi spesifik.' },
    { id: 'humor', label: 'Santai & Humoris', desc: 'Bahasa ringan, tidak kaku, menyisipkan jokes.' },
    { id: 'formal', label: 'Formal / Korporat', desc: 'Bahasa baku, profesional, dan objektif.' }
];

export interface ArticleFormState {
    id: number | null;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string; // Added author to form state for per-article override
    authorAvatar: string;
    readTime: string;
    imagePreview: string;
    uploadFile: File | null;
    status: 'published' | 'draft' | 'scheduled';
    scheduled_for: string;
    type: 'pillar' | 'cluster';
    pillar_id: number;
    cluster_ideas: string[];
    scheduleStart: string;
    uploadAuthorFile: File | null;
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
