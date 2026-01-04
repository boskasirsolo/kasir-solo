
import { DownloadItem, Tutorial, FAQ } from '../../types';

export const PAGE_SIZE_FILES = 9;
export const PAGE_SIZE_VIDEOS = 5;
export const PAGE_SIZE_FAQS = 5;

export interface SupportState {
    downloads: DownloadItem[];
    tutorials: Tutorial[];
    faqs: FAQ[];
    loading: boolean;
    searchTerm: string;
    activeDownloadTab: string;
    pageFiles: number;
    pageVideos: number;
    pageFaqs: number;
    selectedDownload: DownloadItem | null;
}

export interface SupportActions {
    setSearchTerm: (s: string) => void;
    setActiveDownloadTab: (t: string) => void;
    setPageFiles: (p: number) => void;
    setPageVideos: (p: number) => void;
    setPageFaqs: (p: number) => void;
    setSelectedDownload: (i: DownloadItem | null) => void;
}
