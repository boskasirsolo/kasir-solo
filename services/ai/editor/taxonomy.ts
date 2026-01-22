
import { callGeminiWithRotation } from '../core';
import { EXISTING_CATEGORIES } from './config';

export const Taxonomy = {
    /**
     * Kembangkan ide cluster dari topik pilar utama
     */
    generateClusters: async (pillarTitle: string) => {
        const prompt = `
        Act as SEO Specialist. Context: We have a Pillar Page titled "${pillarTitle}".
        Task: Generate 15 Specific Cluster Content Ideas (Sub-topics) that link back to this pillar.
        STRICT JSON Output Format: Array of objects with keys: "keyword", "volume", "competition", "type".
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '[]');
    },

    /**
     * Tentukan kategori Hierarkis
     */
    suggestCategories: async (context: string) => {
        const prompt = `
        Role: SEO & Information Architect for "Kasir Solo".
        Task: Analyze the content and suggest 3-5 Hierarchical Categories from: ${EXISTING_CATEGORIES}.
        Format: "Parent > Child". Just the list.
        Context: "${context}"
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim().replace(/['"]/g, '') || "";
    },

    /**
     * Buat blueprint strategis sebelum penulisan dimulai
     */
    createOutline: async (title: string, sectionsCount: number, loreContext: string) => {
        const prompt = `
        [ROLE: CHIEF STRATEGIST MKS]
        Task: Buat Master Blueprint/Outline untuk judul: "${title}".
        Target: ${sectionsCount} Sub-Heading.

        [WEBSITE LORE - SUMBER DATA NYATA]
        ${loreContext}

        [RULES]
        1. Gunakan data Lore di atas sebagai anchor tiap poin. 
        2. Alur: Masalah (Pain) -> Bukti (Gallery) -> Solusi (Products) -> Edukasi Strategis.
        3. Heading harus 'pedas' & street-smart (JANGAN pake "Pendahuluan" dkk).
        4. Output: JSON Array of Strings.
        `;
        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt, 
            config: { responseMimeType: "application/json" } 
        });

        try {
            // ROBUST JSON EXTRACTOR: Bersihkan kemungkinan pembungkus markdown dari AI
            let cleanJson = res.text?.trim() || '[]';
            if (cleanJson.includes('```')) {
                const match = cleanJson.match(/```(?:json)?([\s\S]*?)```/);
                if (match && match[1]) cleanJson = match[1].trim();
            }
            return JSON.parse(cleanJson);
        } catch (e) {
            console.error("[SIBOS] Outline Parse Error:", e);
            return ["Akar Masalah", "Bukti Lapangan", "Solusi Taktis", "Strategi Cuan", "Langkah Selanjutnya"];
        }
    }
};
