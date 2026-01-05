
import { callGeminiWithRotation } from './core';

const SUPPORT_PERSONA = `
Role: Senior Technical Support for POS Systems.
Expertise: Hardware drivers, Software troubleshooting, Windows/Android configuration.
Tone: Helpful, Clear, Technical but easy to understand.
Language: Indonesian.
`;

export const SupportAI = {
    // 1. Research Download Titles (SEO)
    researchDownloadKeywords: async (context: string, category: string) => {
        const prompt = `
        ${SUPPORT_PERSONA}
        Task: Generate 5 High-Potential SEO Titles for a download file.
        Input Context: "${context}".
        Category: ${category}.
        Goal: Target users searching for drivers/manuals on Google.
        Format: JSON Array of Objects. Example: [{"title": "Driver Epson L3210 Windows 10", "volume": "1.2k/mo", "competition": "Low"}].
        Output: JUST the JSON Array.
        `;
        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt, 
            config: { responseMimeType: "application/json" } 
        });
        return JSON.parse(res.text || '[]');
    },

    // 2. Generate Download Description
    generateDownloadDesc: async (title: string, category: string) => {
        const prompt = `
        ${SUPPORT_PERSONA}
        Task: Write a concise file description for: "${title}".
        Category: ${category}.
        Content: Mention what this file does, OS compatibility, and safety warning if needed.
        Length: 2-3 sentences. No markdown formatting.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    // 3. Generate FAQ Answer
    generateFaqAnswer: async (question: string) => {
        const prompt = `
        ${SUPPORT_PERSONA}
        Task: Answer this FAQ: "${question}".
        Context: POS System Product (Hardware/Software).
        Style: Direct solution. Step-by-step if necessary.
        Length: Short paragraph (max 3 sentences).
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
