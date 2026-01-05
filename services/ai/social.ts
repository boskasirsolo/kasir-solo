
import { callGeminiWithRotation } from './core';
import { SocialTone } from '../../components/admin-social/types'; // Assuming types exist or will be adjusted

const SOCIAL_PERSONA = `
Role: Social Media Strategist for "PT Mesin Kasir Solo".
Persona: The Founder (Amin Maghfuri).
Voice: "Gue/Lo". Street-smart, gritty, experienced, "Teman Nongkrong".
Forbidden: Do not use "Halo Kak", "MinSay", or robotic corporate language.
Target Audience: UMKM Owners, Retailers, F&B Owners in Indonesia.
`;

export const SocialAI = {
    // 1. Generate Caption based on Platform & Item
    generateCaption: async (
        platform: string, 
        itemTitle: string, 
        itemDesc: string, 
        itemUrl: string, 
        tones: string[]
    ) => {
        let platformRules = "";
        switch (platform) {
            case 'instagram': platformRules = "Visual-first. Use line breaks. 20+ Hashtags at bottom."; break;
            case 'facebook': platformRules = "Community style. Shareable. 3-5 Hashtags."; break;
            case 'linkedin': platformRules = "Professional but bold. Focus on B2B value & ROI. 3 Hashtags. Slightly more formal but keep the 'Gritty' edge."; break;
            case 'tiktok': platformRules = "Viral Hook for video description. Short & Punchy. Trending hashtags."; break;
            case 'twitter': platformRules = "Thread-starter style. Under 280 chars for main hook."; break;
            case 'gmb': platformRules = "Local SEO focus. Call to Action: 'Kunjungi Toko'."; break;
            default: platformRules = "General social media best practices.";
        }

        const prompt = `
        ${SOCIAL_PERSONA}
        Task: Write a caption for ${platform}.
        Topic: ${itemTitle}
        Context: ${itemDesc}
        Link: ${itemUrl}
        Selected Tones: ${tones.join(', ')}.
        
        Rules:
        1. ${platformRules}
        2. Hook the reader instantly.
        3. Weave keywords naturally, don't just list them.
        4. End with a strong CTA pointing to the link.
        
        Output: JUST the caption text.
        `;

        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    // 2. Generate Weekly Content Plan
    generateWeeklyPlan: async (topic: string) => {
        const prompt = `
        ${SOCIAL_PERSONA}
        Task: Create a 7-Day Content Plan (Monday - Sunday) based on topic: "${topic}".
        Format: JSON Array of Objects.
        Schema: [{ "day": "Senin", "theme": "...", "hook": "...", "caption": "...", "image_idea": "..." }]
        
        Requirements:
        - "hook": Catchy opening sentence.
        - "caption": Short draft (max 200 chars).
        - "image_idea": Visual description for the designer/photographer.
        `;

        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        try {
            return JSON.parse(res.text || '[]');
        } catch (e) {
            console.error("Failed to parse weekly plan JSON", e);
            return [];
        }
    }
};
