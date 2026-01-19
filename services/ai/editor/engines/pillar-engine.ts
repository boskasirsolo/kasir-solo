
import { callGeminiWithRotation } from '../../core';
import { BRAND_CONTEXT, GOV_CRITIQUE_RULE, CLOSING_RULE } from '../config';
import { Taxonomy } from '../taxonomy';
import { ContextBuilder } from '../context-builder';
import { WriterConfig } from '../types';

export const PillarEngine = {
    async execute(title: string, config: WriterConfig) {
        const sectionsCount = Math.max(5, Math.ceil(config.wordCount / 700));
        const outline = await Taxonomy.createOutline(title, sectionsCount);
        
        // Base context without assets
        const baseContext = `
            ${BRAND_CONTEXT}
            ${ContextBuilder.getPersona(config.authorName)}
            ${ContextBuilder.getLocalSEO(config.city)}
            ${ContextBuilder.getCrossLinking(config.relatedPillars)}
            ${GOV_CRITIQUE_RULE}
            ${config.userNotes ? `[USER NOTES]: ${config.userNotes}` : ""}
        `;

        const assetContext = ContextBuilder.getAssetContext(config.productsJson, config.galleryJson);

        let fullContent = "";
        let prevSection = "";

        for (let i = 0; i < outline.length; i++) {
            const isLast = i === outline.length - 1;
            
            // STRATEGY: Only inject assets in specific sections (e.g. index 1 and 3)
            // This prevents every section from having a product card.
            // Index 1 = Section 2 (Early recommendation)
            // Index 3 = Section 4 (Mid-article proof)
            const shouldInjectAssets = (i === 1 || i === 3);

            const currentContext = `
                ${baseContext}
                ${shouldInjectAssets ? assetContext : ""}
            `;

            const prompt = `
            [MODE: PILLAR AUTHORITY WRITER]
            Article Title: "${title}"
            Current Section: "${outline[i]}" (${i + 1}/${outline.length})
            
            [CONTEXTUAL DATA]
            ${currentContext}

            [WRITING RULES]
            1. Focus ONLY on the current section "${outline[i]}".
            2. Depth: Be comprehensive. Use bullet points/tables if needed.
            3. Flow: ${i === 0 ? "Start with a strong Hook." : `Bridge smoothly from previous point: "...${prevSection.slice(-100)}..."`}
            4. ${isLast ? CLOSING_RULE : "Do NOT write a conclusion yet."}

            Output: Markdown.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text?.trim() || "";
            fullContent += text + "\n\n";
            prevSection = text;
        }
        return fullContent;
    }
};
