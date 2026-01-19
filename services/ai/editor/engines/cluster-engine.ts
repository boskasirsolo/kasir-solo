
import { callGeminiWithRotation } from '../../core';
import { BRAND_CONTEXT, INTERNAL_LINKING_RULES, CLOSING_RULE } from '../config';
import { ContextBuilder } from '../context-builder';
import { WriterConfig } from '../types';

export const ClusterEngine = {
    async execute(title: string, config: WriterConfig) {
        if (!config.pillarParent) throw new Error("Cluster content MUST have a Parent Pillar.");

        const contextBlock = `
            ${BRAND_CONTEXT}
            ${ContextBuilder.getPersona(config.authorName)}
            ${ContextBuilder.getLocalSEO(config.city)}
            ${ContextBuilder.getAssetContext(config.productsJson, config.galleryJson)}
            ${INTERNAL_LINKING_RULES}
            ${config.userNotes ? `[USER NOTES]: ${config.userNotes}` : ""}
        `;

        const prompt = `
        [MODE: CLUSTER SPECIALIST]
        Title: "${title}"
        Target Length: ${config.wordCount} words.
        
        [SEO ARCHITECTURE RULE]
        Parent Pillar: "${config.pillarParent.title}"
        Action: You MUST mention and link to the parent pillar in the first 2 paragraphs.
        Format: [${config.pillarParent.title}](/articles/${config.pillarParent.slug})

        [CONTEXT]
        ${contextBlock}
        ${CLOSING_RULE}

        Task: Write a specific, problem-solving article. Don't be too broad. Go deep into the specific title topic.
        Output: Full Markdown Article.
        `;

        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    }
};
