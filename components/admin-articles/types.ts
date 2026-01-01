
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
    { id: 'gritty', label: 'Gritty & Raw (Jujur Brutal)', desc: 'Cerita kegagalan tanpa filter, emosional, "Gue" banget.' },
    { id: 'visionary', label: 'Visionary (Comeback)', desc: 'Fokus pada kebangkitan, masa depan, dan inovasi.' },
    { id: 'reflective', label: 'Reflektif (Bijak)', desc: 'Mengambil hikmah, nada tenang, seperti mentor.' },
    { id: 'story', label: 'Storytelling (Novel)', desc: 'Bercerita dengan alur plot yang menarik.' },
    { id: 'satire', label: 'Satire / Kritik', desc: 'Menyindir kesalahan umum pebisnis (termasuk diri sendiri).' },
    { id: 'tutorial', label: 'Edukatif & Taktis', desc: 'Fokus ke solusi teknis (How-to), minim drama.' },
    { id: 'formal', label: 'Formal Professional', desc: 'Bahasa baku korporat (Gunakan jarang-jarang).' }
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
    date: string; // Added editable date field
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

// Preset Topics for Research Context
export const RESEARCH_TOPICS = [
    "Android POS", "Windows POS", "Manajemen Stok", "Laporan Keuangan", 
    "Strategi Diskon", "Loyalty Member", "Cegah Fraud/Kecurangan", 
    "Omnichannel", "QRIS & E-Wallet", "Hardware Kasir", 
    "Tips Bisnis Kuliner", "Tips Bisnis Retail", "Manajemen Karyawan",
    "Digital Marketing UMKM", "Branding Usaha", "Software ERP", "Aplikasi Kasir Gratis"
];

// Sesuai dengan data frontend (Category Tree)
export const ARTICLE_CATEGORIES = [
    "Bisnis Tips", "Manajemen", "Keuangan", "HR", "Franchise", // Business
    "Hardware Review", "Android POS", "Windows POS", "Teknologi", "Tutorial", // Tech
    "Digital Marketing", "Branding", "Loyalty Program", "Promosi" // Marketing
];
