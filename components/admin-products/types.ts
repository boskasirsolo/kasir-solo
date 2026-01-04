
import { Product } from '../../types';

export interface ProductFormState {
    id: number | null;
    name: string;
    category: string;
    price: string;
    desc: string;
    shortDesc: string; // Keywords for AI context
    specsStr: string;
    includesStr: string;
    whyBuyStr: string;
    imagePreview: string;
    uploadFile: File | null;
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
