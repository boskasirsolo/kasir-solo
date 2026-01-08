
import { callGeminiWithRotation } from '../../core';
import { SALES_PERSONA, COPYWRITING_RULES } from './config';

// --- MODULE: COPYWRITER (CREATIVE SALES) ---

export const Copywriter = {
    /**
     * Bikin Nama Produk yang Clickbait & SEO Friendly
     */
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

    /**
     * Bikin Deskripsi Produk yang Menghipnotis (Sales Letter)
     */
    generateSalesCopy: async (productName: string, features: string) => {
        const prompt = `
        ${SALES_PERSONA}
        Task: Write a persuasive product description for "${productName}".
        Features/Keywords to highlight: "${features}".
        
        ${COPYWRITING_RULES}

        Structure:
        1. Hook (Problem awareness - pake bahasa "Gue/Lo").
        2. Solution (How this product fixes it).
        3. Benefit (Not just features, but business impact/profit).
        4. Closing (Urgency).
        
        Example tone: "Lo capek dicolong karyawan? Pake alat ini, tidur lo nyenyak."
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim().replace(/\*\*/g, '') || "";
    },

    /**
     * Bikin Poin-Poin USP (Kenapa Harus Beli)
     */
    generateWhyBuy: async (productName: string) => {
        const prompt = `
        ${SALES_PERSONA}
        Task: Write 3-5 strong reasons "Why Buy This" for "${productName}".
        Focus: Business safety, speed, or profit.
        Output Format: One reason per line. Short sentences. Use "Gue/Lo" style if possible to sound authentic.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
