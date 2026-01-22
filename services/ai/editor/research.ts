
import { callGeminiWithRotation } from '../core';

export const Researcher = {
    /**
     * Cari ide judul artikel berdasarkan tren & volume
     */
    researchTopics: async (type: 'pillar' | 'cluster', topic?: string) => {
        const industryContext = "Retail Technology, Point of Sale (POS), Business Management, UMKM Indonesia";
        
        let specificityInstruction = type === 'pillar' 
            ? 'Identify Broad, High-Volume "Ultimate Guide" concepts.' 
            : 'Identify highly specific, Long-tail, Problem-Solving sub-topics.';

        const topicContext = topic 
            ? `CONTEXT: Lo baru aja nulis artikel Pilar tentang "${topic}". TUGAS: Cari 15 judul artikel turunan (Cluster) yang lebih spesifik, teknis, atau berupa tips praktis yang mendukung pilar tersebut.`
            : `BROAD SCOPE: Cari topik trending umum di industri ${industryContext}.`;

        const prompt = `
        Role: Senior SEO Strategist & Content Architect for the Indonesian Market.
        Persona: Street-smart, aggressive, "Gue/Lo" style.
        
        ${topicContext}
        ${specificityInstruction}
        
        **CRITICAL SEO FILTER:** 
        1. Judul harus nendang, provokatif, dan bikin orang pengen klik (Click-worthy).
        2. Cari keyword dengan **LOW or MEDIUM** competition.
        3. Prioritaskan volume pencarian yang valid untuk UMKM Indonesia.
        
        Strict Output Format: JSON Array of Objects.
        Example: [{"keyword": "Cara Atasi Stok Selisih di Kasir Android", "volume": "1.2k/mo", "competition": "Low", "type": "Cluster"}]
        `;

        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt, 
            config: { responseMimeType: "application/json" } 
        });

        try {
            return JSON.parse(res.text || '[]');
        } catch (e) {
            console.error("[Researcher] JSON Parse Error", e);
            return [];
        }
    },

    /**
     * Riset Kata Kunci Lokal (Kota) - NEW
     */
    researchLocalKeywords: async (cityName: string) => {
        const prompt = `
        Role: Local SEO Expert Indonesia.
        Task: Cari 5 kata kunci paling banyak dicari pebisnis di kota "${cityName}" terkait mesin kasir dan sistem toko.
        Output: JSON Array of Strings. Just the keywords.
        `;
        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(res.text || '[]');
    },

    /**
     * Generate SEO Title & Meta Description
     */
    generateMeta: async (title: string, content: string) => {
        const prompt = `
        Role: Senior SEO Strategist for PT Mesin Kasir Solo.
        Task: Generate metadata for the article "${title}".
        Context Snippet: "${content.substring(0, 1000)}..."
        Output JSON: { "excerpt": "persuasive meta description max 150 chars", "category": "Parent > Child" }
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '{}');
    }
};
