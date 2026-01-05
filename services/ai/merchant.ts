
import { callGeminiWithRotation } from './core';

const SALES_PERSONA = `
Role: Senior Sales Manager for "Mesin Kasir Solo".
Persona: Amin Maghfuri (Founder).
Tone: Street-smart, Direct ("To the point"), Experienced, Honest (Jujur Brutal).
Language: Indonesian (Casual/Semi-formal). Use "Gue/Lo" for thoughts, but professional "Anda/Kakak" for direct product descriptions unless specified otherwise.
Focus: ROI (Return on Investment), Durability (Awet), Anti-Fraud (Anti Maling), Ease of Use (Gak Ribet).
`;

export const MerchantAI = {
    // 1. Generate Catchy Product Name
    generateProductName: async (keywords: string, category: string) => {
        const prompt = `
        ${SALES_PERSONA}
        Task: Create a short, punchy, high-converting Product Name.
        Context: Keywords: "${keywords}". Category: "${category}".
        Rule: Max 5-7 words. Must sound professional but catchy.
        Output: JUST the name text.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    // 2. Generate Hypnotic Sales Copy (Description)
    generateSalesCopy: async (productName: string, features: string) => {
        const prompt = `
        ${SALES_PERSONA}
        Task: Write a persuasive product description for "${productName}".
        Features to highlight: "${features}".
        Structure:
        1. Hook (Problem awareness).
        2. Solution (How this product fixes it).
        3. Benefit (Not just features, but business impact).
        4. Closing (Urgency).
        Style: No markdown bolding (**). Just clean paragraphs.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim().replace(/\*\*/g, '') || "";
    },

    // 3. Generate Tech Specs
    generateSpecs: async (productName: string) => {
        const prompt = `
        Task: Generate realistic technical specifications for POS Hardware: "${productName}".
        Output Format: Key: Value (One per line). Max 6 lines.
        Example:
        Processor: Intel Core i5
        RAM: 8GB DDR4
        Storage: 256GB SSD
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    // 4. Generate Package Includes
    generateIncludes: async (productName: string) => {
        const prompt = `
        Task: List "Package Includes" (Isi Dalam Kotak) for "${productName}".
        Output Format: One item per line. Max 5 items.
        Example:
        1x Unit Mesin Kasir
        1x Adaptor Power
        1x Roll Kertas Thermal
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    // 5. Generate "Why Buy" (USP)
    generateWhyBuy: async (productName: string) => {
        const prompt = `
        ${SALES_PERSONA}
        Task: Write 3-5 strong reasons "Why Buy This" for "${productName}".
        Focus: Business safety, speed, or profit.
        Output Format: One reason per line. Short sentences.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
