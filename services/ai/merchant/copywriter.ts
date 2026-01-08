
import { callGeminiWithRotation } from '../core';
import { SALES_PERSONA, COPYWRITING_RULES } from './config';

// --- MODULE: COPYWRITER (CREATIVE SALES) ---

export const Copywriter = {
    /**
     * Bikin Nama Produk yang Clickbait & SEO Friendly
     */
    generateProductName: async (keywords: string, category: string) => {
        const prompt = `
        ${SALES_PERSONA}
        Task: Create a short, punchy Product Name.
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
        Features: "${features}".
        
        ${COPYWRITING_RULES}

        STRICT RULES:
        1. Keep it SHORT. Max 2-3 short paragraphs.
        2. Focus on "Problem -> Solution -> Benefit".
        3. No long intros. Start immediately with the hook.
        
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
        Task: Write 3 strong reasons "Why Buy This" for "${productName}".
        Focus: Safety, Speed, or Profit.
        Output Format: One reason per line. Short sentences (Max 10 words). Use "Gue/Lo" style.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
