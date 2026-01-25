
import { Product } from '../../types';

export interface ProductFormState {
    id: number | null;
    name: string;
    category: string;
    price: string;
    weight_grams: string; 
    length_cm: string; 
    width_cm: string;  
    height_cm: string; 
    desc: string;
    shortDesc: string; // Keywords for AI context
    specsStr: string;
    includesStr: string;
    whyBuyStr: string;
    imagePreview: string; // Cover
    uploadFile: File | null;
    // New Media Fields
    galleryImages: string[];
    newGalleryFiles: File[];
    videoUrl: string;
    // Affiliate Fields
    affiliateLink: string;
    ctaText: string;
}

export interface LoadingState {
    generatingTitle: boolean;
    generatingDesc: boolean;
    generatingSpecs: boolean;
    generatingIncludes: boolean;
    generatingWhyBuy: boolean;
    generatingImage: boolean;
    uploading: boolean;
    processingImage: boolean;
}

export const PRODUCT_CATEGORIES = [
    "Android POS",
    "Windows POS",
    "Smart Kiosk",
    "Retail POS",
    "Hardware",
    "Software",
    "Accessories"
];
