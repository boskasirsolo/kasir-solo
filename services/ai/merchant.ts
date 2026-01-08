
// --- MERCHANT AI FACADE ---
// Aggregates Sales Copywriter & Technical Modules

import { Copywriter } from './merchant/copywriter';
import { Technical } from './merchant/technical';

export const MerchantAI = {
    // Creative / Copywriting
    generateProductName: Copywriter.generateProductName,
    generateSalesCopy: Copywriter.generateSalesCopy,
    generateWhyBuy: Copywriter.generateWhyBuy,

    // Technical / Structured Data
    generateSpecs: Technical.generateSpecs,
    generateIncludes: Technical.generateIncludes
};
