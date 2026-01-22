
import { callGeminiWithRotation } from '../../core';
import { BRAND_CONTEXT, GOV_CRITIQUE_RULE, CLOSING_RULE } from '../config';

export const WritingParticles = {
    /**
     * Partikel paling dasar untuk mengeksekusi satu blok konten
     */
    executeSection: async (p_params: {
        article_title: string,
        current_heading: string,
        roadmap: string[],
        lore_context: string,
        persona_context: string,
        continuity_memory: string,
        specific_instruction: string,
        target_word_count: number
    }) => {
        const prompt = `
        [AGENT: ATOMIC WRITER PARTICLE]
        Context: "${p_params.article_title}"
        Task: Write ONLY the content for Sub-Heading: "## ${p_params.current_heading}"
        
        [FULL ROADMAP FOR CONTEXT]
        ${p_params.roadmap.join(' -> ')}

        [LORE & ASSETS]
        ${p_params.lore_context}

        [PERSONA & STYLE]
        ${p_params.persona_context}
        ${GOV_CRITIQUE_RULE}

        [CONTINUITY]
        ${p_params.continuity_memory}

        [PARTICLE SPECIFIC INSTRUCTION]
        ${p_params.specific_instruction}
        Target length for this section: ~${p_params.target_word_count} words.

        [RULES]
        1. NO generic intros.
        2. Use "Gue/Lo".
        3. If you mention products/projects, use the provided Lore naturally.
        4. Output: Markdown.
        `;

        const res = await callGeminiWithRotation({ 
            model: 'gemini-3-flash-preview', 
            contents: prompt 
        });
        return res.text?.trim() || "";
    }
};
