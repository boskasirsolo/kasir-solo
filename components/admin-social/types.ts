
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
