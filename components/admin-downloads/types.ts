
import { DownloadItem, Tutorial, FAQ } from '../../types';

export interface ResearchResult {
    title: string;
    volume: string;
    competition: 'Low' | 'Medium' | 'High';
}

export interface DownloadFormState {
    id: string;
    title: string;
    category: 'driver' | 'manual' | 'software' | 'tools';
    description: string;
    file_url: string;
    version: string;
    file_size: string;
    os_support: 'Windows' | 'Android' | 'iOS' | 'All';
}

export interface DownloadAiLoading {
    research: boolean;
    desc: boolean;
}

export const DOWNLOAD_CATEGORIES = [
    { id: 'driver', label: 'Driver' },
    { id: 'manual', label: 'Manual' },
    { id: 'software', label: 'Software' },
    { id: 'tools', label: 'Tools' }
];
