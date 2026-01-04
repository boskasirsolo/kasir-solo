
import { GalleryItem, Testimonial } from '../../types';

export interface GalleryFormState {
    id: number | null;
    title: string;
    category_type: 'physical' | 'digital';
    platform: 'web' | 'mobile' | 'desktop';
    client_url: string;
    tech_stack_str: string;
    shortDesc: string;
    longDesc: string;
    cs_challenge: string;
    cs_solution: string;
    cs_result: string;
    imagePreview: string; // Cover Image
    uploadFile: File | null;
    galleryImages: string[]; // Existing URLs
    newGalleryFiles: File[]; // New files to upload
}

export interface TestimonialFormState {
    id: number | null;
    client_name: string;
    content: string;
    rating: number;
    imagePreview: string;
    uploadFile: File | null;
    hasTestimonial: boolean;
}

export interface LoadingState {
    generatingAI: boolean;
    uploading: boolean;
    generatingSpecific: 'challenge' | 'solution' | 'result' | null;
    processingImage: boolean;
}
