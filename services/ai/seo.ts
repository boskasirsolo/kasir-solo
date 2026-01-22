
import { callGeminiWithRotation } from './core';

const SEO_PERSONA = `
Role: Senior Local SEO Strategist for "PT Mesin Kasir Solo".
Persona: Aggressive, data-driven, street-smart. Use "Gue/Lo".
Goal: Dominasi halaman 1 Google untuk keyword mesin kasir di seluruh Indonesia.
`;

export const SEOAI = {
    // 1. Keyword Research Lab
    researchKeywords: async (topic: string, region: string) => {
        const prompt = `
        ${SEO_PERSONA}
        TUGAS: Riset 10 kata kunci (LSI & Long-tail) untuk topik "${topic}" di wilayah "${region}".
        Fokus: Cari keyword dengan "Buying Intent" tinggi (orang yang siap transfer).
        
        Format Output: JSON Array of Objects.
        Schema: [{"keyword": "...", "intent": "Informational/Commercial/Transactional", "difficulty": "Low/Med/High", "potensi_cuan": "1-10"}]
        `;
        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(res.text || '[]');
    },

    // 2. Search Intent Analyzer
    analyzeIntent: async (keyword: string) => {
        const prompt = `
        ${SEO_PERSONA}
        TUGAS: Bedah isi kepala orang yang ngetik "${keyword}" di Google.
        Apa yang mereka cari? Apa ketakutan mereka (pain points)? Apa yang bikin mereka langsung beli?
        
        Output: Markdown pendek, padat, nendang. Pake poin-poin.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text || "";
    },

    // 3. Traffic Predictor
    predictTraffic: async (keywords: string[]) => {
        const prompt = `
        ${SEO_PERSONA}
        TUGAS: Ramal potensi traffic jika kita ranking 1 untuk list keyword ini: ${keywords.join(', ')}.
        Kasih estimasi klik per bulan dan potensi omzet kasar jika konversi 1%.
        
        Output: JSON Object { "est_monthly_clicks": number, "est_conversion": number, "insight": "..." }
        `;
        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        return JSON.parse(res.text || '{}');
    }
};
