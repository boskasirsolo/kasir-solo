
export type SourceType = 'product' | 'article' | 'gallery' | 'service';

export interface SocialContentItem {
    id: string | number;
    type: SourceType;
    title: string;
    description: string;
    image: string;
    url: string;
    originalData?: any; // Keep ref to original object
}

export interface PlatformState {
    instagram: boolean;
    facebook: boolean;
    linkedin: boolean;
}

export interface CaptionState {
    master: string;
    instagram: string;
    facebook: string;
    linkedin: string;
}

export type ActiveTab = 'master' | 'instagram' | 'facebook' | 'linkedin';

export interface SocialTone {
    id: string;
    label: string;
    desc: string;
}

export const SOCIAL_TONES: SocialTone[] = [
    { id: 'gritty', label: 'Gritty & Raw', desc: 'Jujur brutal, tegas, "street-smart", tanpa filter.' },
    { id: 'visionary', label: 'Visionary', desc: 'Inspiratif, masa depan, semangat perubahan.' },
    { id: 'reflective', label: 'Reflektif', desc: 'Bijak, mengambil hikmah, tenang.' },
    { id: 'story', label: 'Storytelling', desc: 'Bercerita, emosional, mengalir seperti novel.' },
    { id: 'satire', label: 'Satire / Kritik', desc: 'Menyindir halus kesalahan umum, tajam.' },
    { id: 'educational', label: 'Edukatif & Taktis', desc: 'To-the-point, tips & trik, solutif.' },
    { id: 'hard-sell', label: 'Hard Sell (Promo)', desc: 'Mendesak, FOMO, fokus jualan.' },
    { id: 'humor', label: 'Humoris / Santai', desc: 'Receh, akrab, fun, banyak emoji.' }
];
