
import { callGeminiWithRotation } from '../core';

// --- MODULE: RESEARCHER (SEO & TOPICS) ---

export const Researcher = {
    /**
     * Cari ide judul artikel berdasarkan tren & volume
     */
    researchTopics: async (type: 'pillar' | 'cluster', topic?: string) => {
        const industryContext = "Retail Technology, Point of Sale (POS), Business Management, UMKM Indonesia";
        const topicContext = topic 
            ? `FOCUS TOPIC: "${topic}". Find keywords specifically related to this topic within the context of ${industryContext}.`
            : `BROAD SCOPE: Find general trending topics in ${industryContext}.`;

        const prompt = `
        Act as a Senior SEO Strategist for the Indonesian Market.
        ${topicContext}
        Task: Identify ${type === 'pillar' ? '10 Broad, High-Volume "Ultimate Guide"' : '15 Specific, Long-tail, Problem-Solving'} Article Titles.
        **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition.
        Strict Output Format: JSON Array of Objects.
        Example: [{"keyword": "Judul", "volume": "12k/mo", "competition": "Medium", "type": "${type === 'pillar' ? 'Pillar' : 'Cluster'}"}]
        `;

        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
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
