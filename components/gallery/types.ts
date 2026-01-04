
import { GalleryItem, Testimonial } from '../../types';

export type GalleryFilterType = 'all' | 'physical' | 'digital';

export interface GalleryState {
    activeFilter: GalleryFilterType;
    page: number;
    searchTerm: string;
}

export interface GalleryProps {
    gallery: GalleryItem[];
    testimonials: Testimonial[];
}

export interface ProjectDetailProps {
    item: GalleryItem;
    testimonials: Testimonial[];
    onClose: () => void;
    isModal?: boolean;
}
