
import { callGeminiWithRotation } from '../core';
import { EXISTING_CATEGORIES } from './config';

// --- MODULE: ARCHITECT (STRUCTURE & CATEGORY) ---

export const Taxonomy = {
    /**
     * Kembangkan ide cluster dari topik pilar utama
     */
    generateClusters: async (pillarTitle: string) => {
        const prompt = `
        Act as SEO Specialist. Context: We have a Pillar Page titled "${pillarTitle}".
        Task: Generate 15 Specific Cluster Content Ideas (Sub-topics) that link back to this pillar.
        STRICT JSON Output Format: Array of objects with keys: "keyword", "volume", "competition", "type".
        Example: [{"keyword": "Strategi X", "volume": "2.5k", "competition": "Low", "type": "Cluster"}]
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '[]');
    },

    /**
     * Tentukan kategori Hierarkis (Parent > Child) secara cerdas
     */
    suggestCategories: async (context: string) => {
        const prompt = `
        Role: SEO & Information Architect for "Kasir Solo".
        Task: Analyze the content below and suggest 3-5 Hierarchical Categories.
        
        [EXISTING CATEGORY TREE]:
        ${EXISTING_CATEGORIES}

        [RULES]
        1. **MANDATORY FORMAT**: "Parent Category > Child Category" (e.g. "Marketing Jalanan > Google Ads").
        2. **Intelligence**: 
           - If the topic fits an EXISTING Parent (Biz/Tech/Marketing), use that Parent.
           - If the topic is NEW/TRENDING (e.g. Cyber Security, AI, Import Laws) and doesn't fit, **CREATE A NEW PARENT** that makes sense (e.g. "Regulasi & Hukum > Pajak").
        3. Output: Just the comma-separated list. No explanations.

        Context: "${context}"
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim().replace(/['"]/g, '') || "";
    },

    /**
     * Buat outline artikel untuk Long-Form content
     */
    createOutline: async (title: string, sectionsCount: number) => {
        const prompt = `Task: Create Table of Contents for "${title}". Target: ${sectionsCount} Sections. Output: JSON Array of Strings (Section Titles).`;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '[]');
    }
};
