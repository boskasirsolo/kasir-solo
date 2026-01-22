
import { callGeminiWithRotation } from '../../core';
import { BRAND_CONTEXT, GOV_CRITIQUE_RULE, CLOSING_RULE } from '../config';
import { Taxonomy } from '../taxonomy';
import { ContextBuilder } from '../context-builder';
import { WriterConfig } from '../types';

export const PillarEngine = {
    async execute(title: string, config: WriterConfig) {
        // 1. COLLECT LORE & ASSETS
        const loreContext = ContextBuilder.getAssetContext(config.productsJson, config.galleryJson);
        
        // 2. DEFINE STRUCTURE (Pillar biasanya 5-8 seksi)
        const sectionsCount = Math.max(5, Math.min(8, Math.ceil(config.wordCount / 500)));
        const outline = await Taxonomy.createOutline(title, sectionsCount, loreContext);
        
        // 3. BASE CONTEXT SETUP
        const baseContext = `
            ${BRAND_CONTEXT}
            ${ContextBuilder.getPersona(config.authorName)}
            ${ContextBuilder.getLocalSEO(config.city)}
            ${ContextBuilder.getCrossLinking(config.relatedPillars)}
            ${GOV_CRITIQUE_RULE}
            ${config.userNotes ? `[USER NOTES]: ${config.userNotes}` : ""}
        `;

        let fullContent = "";
        let memoryBuffer = "";

        // 4. SECTIONAL WRITING LOOP
        for (let i = 0; i < outline.length; i++) {
            const isLast = i === outline.length - 1;
            const currentHeading = outline[i];
            
            const prompt = `
            [MODE: LONG-FORM AUTHORITY WRITER - SECTION ${i + 1}/${outline.length}]
            Article Title: "${title}"
            Full Strategy Roadmap: [${outline.join(' -> ')}]
            TARGET SUB-HEADING: "## ${currentHeading}"
            
            [CONTINUITY MEMORY]
            ${i === 0 
                ? "Bikin pembukaan yang provokatif. Tampar ego pembaca biar sadar pentingnya topik ini." 
                : `Barusan lo bahas tentang: "${memoryBuffer}". JANGAN ULANG poin itu. Sekarang lanjutin ke target heading di atas.`}

            [WEBSITE LORE (REFERENSI NYATA)]
            ${loreContext}

            [WRITING RULES]
            1. Gaya: Street-smart, gritty, prioritaskan "Gue/Lo".
            2. Ceritakan Produk/Project dari Lore secara naratif (misal: "Gue pernah pasang alat ini di...").
            3. Jika ada tag [PRODUCT] atau [PROJECT], selipkan di baris baru setelah narasi pendukung.
            4. ${isLast ? CLOSING_RULE : "JANGAN tulis closing. Langsung cut di bahasan terakhir."}

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
