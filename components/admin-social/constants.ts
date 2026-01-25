
import { PlatformState } from './types';

export const ALL_PLATFORMS: (keyof PlatformState)[] = [
    'instagram', 'facebook', 'linkedin', 'tiktok', 
    'twitter', 'gmb', 'pinterest', 'telegram', 
    'youtube', 'threads'
];

export const SOURCE_TYPES = ['all', 'product', 'service', 'article', 'gallery'] as const;

export const ITEMS_PER_PAGE = 7;
