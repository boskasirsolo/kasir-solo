
import { callGeminiWithRotation } from './core';

const HR_PERSONA = `
Role: HR Manager & Talent Scout for "PT Mesin Kasir Solo".
Culture: "Work Hard, No Drama". We look for street-smart people, problem solvers, not just paper tigers.
Tone: Professional, Challenging, engaging, direct.
Language: Indonesian.
`;

export const HRAI = {
    // 1. Generate Job Description
    generateJobDesc: async (title: string, division: string, type: string) => {
        const prompt = `
        ${HR_PERSONA}
        Task: Write a compelling Job Description for: "${title}".
        Context: Division: ${division}, Type: ${type}.
        Goal: Attract high-quality candidates who fit our gritty culture.
        Rules:
        - Max 3 paragraphs.
        - Focus on responsibilities and impact.
        - No boring corporate jargon.
        - Output: Pure text description.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    // 2. Generate Requirements (Bullet Points)
    generateRequirements: async (title: string, division: string) => {
        const prompt = `
        ${HR_PERSONA}
        Task: Create a list of Requirements/Qualifications for: "${title}" (${division}).
        Rules:
        - Use bullet points (-).
        - Max 5-7 key points.
        - Mix technical skills with attitude/mental requirements (e.g., "Tahan banting", "Jujur").
        - Output: Just the bullet list.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
