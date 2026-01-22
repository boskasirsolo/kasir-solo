
import { callGeminiWithRotation } from '../../core';
import { BRAND_CONTEXT, INTERNAL_LINKING_RULES, CLOSING_RULE, GOV_CRITIQUE_RULE } from '../config';
import { Taxonomy } from '../taxonomy';
import { ContextBuilder } from '../context-builder';
import { WriterConfig } from '../types';

export const ClusterEngine = {
    async execute(title: string, config: WriterConfig) {
        if (!config.pillarParent) throw new Error("Artikel Cluster butuh Parent Pillar buat arah serangan SEO.");

        // 1. COLLECT LORE (Data Senjata & Rekam Jejak)
        const loreContext = ContextBuilder.getAssetContext(config.productsJson, config.galleryJson);

        // 2. CREATE CLUSTER BLUEPRINT (Lebih ringkas dari Pillar)
        const sectionsCount = Math.max(3, Math.ceil(config.wordCount / 350));
        const outline = await Taxonomy.createOutline(title, sectionsCount, loreContext);

        // 3. CONTEXT SETUP
        const baseContext = `
            ${BRAND_CONTEXT}
            ${ContextBuilder.getPersona(config.authorName)}
            ${ContextBuilder.getLocalSEO(config.city)}
            ${GOV_CRITIQUE_RULE}
            [SEO TARGET]: Artikel ini adalah CLUSTER yang mendukung Pillar: "${config.pillarParent.title}".
            [MANDATORY LINK]: Lo WAJIB sisipkan link ini di paragraf awal: [${config.pillarParent.title}](/articles/${config.pillarParent.slug})
        `;

        let fullContent = "";
        let memoryBuffer = "";

        // 4. WRITING LOOP (Step-by-Step execution)
        for (let i = 0; i < outline.length; i++) {
            const isLast = i === outline.length - 1;
            const currentHeading = outline[i];

            const prompt = `
            [MODE: CLUSTER SPECIALIST - DEEP DIVE SECTION ${i + 1}/${outline.length}]
            Topic: "${title}"
            Current Heading: "## ${currentHeading}"
            Full Blueprint: [${outline.join(' -> ')}]

            [CONTINUITY]
            ${i === 0 
                ? "Mulai dengan gaya 'Straight to the point'. Jelaskan masalah spesifik yang mau kita beresin." 
                : `Seksi sebelumnya bahas: "${memoryBuffer}". Jangan diulang, langsung gas ke poin baru.`}

            [WEBSITE LORE & STRATEGIC ASSETS]
            ${loreContext}

            [INSTRUCTIONS]
            1. Gaya: Street-smart, gritty, prioritaskan "Gue/Lo".
            2. Gunakan data Lore secara natural buat bukti (Case study atau Spek alat).
            3. ${isLast ? CLOSING_RULE : "Berhenti di poin terakhir seksi ini. JANGAN bikin kesimpulan."}

            Output: Markdown.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const sectionText = res.text?.trim() || "";
            
            const formattedSection = sectionText.startsWith('##') ? sectionText : `## ${currentHeading}\n\n${sectionText}`;
            fullContent += formattedSection + "\n\n";
            memoryBuffer = sectionText.slice(-500);
        }

        return fullContent;
    }
};
