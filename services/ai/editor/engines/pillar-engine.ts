
import { callGeminiWithRotation } from '../../core';
import { BRAND_CONTEXT, GOV_CRITIQUE_RULE, CLOSING_RULE } from '../config';
import { Taxonomy } from '../taxonomy';
import { ContextBuilder } from '../context-builder';
import { WriterConfig } from '../types';

export const PillarEngine = {
    async execute(title: string, config: WriterConfig) {
        const sectionsCount = Math.max(5, Math.ceil(config.wordCount / 700));
        const outline = await Taxonomy.createOutline(title, sectionsCount);
        
        // Base context
        const baseContext = `
            ${BRAND_CONTEXT}
            ${ContextBuilder.getPersona(config.authorName)}
            ${ContextBuilder.getLocalSEO(config.city)}
            ${ContextBuilder.getCrossLinking(config.relatedPillars)}
            ${GOV_CRITIQUE_RULE}
            ${config.userNotes ? `[USER NOTES]: ${config.userNotes}` : ""}
        `;

        let fullContent = "";
        let prevSectionEnd = "";

        for (let i = 0; i < outline.length; i++) {
            const isLast = i === outline.length - 1;
            
            // STRATEGY: Spread assets across different sections to ensure distancing
            // Section 1 (Index 1): Focused on Product
            // Section 3 (Index 3): Focused on Gallery/Project
            let specificAssetContext = "";
            if (i === 1) {
                specificAssetContext = ContextBuilder.getAssetContext(config.productsJson, undefined);
            } else if (i === 3) {
                specificAssetContext = ContextBuilder.getAssetContext(undefined, config.galleryJson);
            }

            const currentContext = `
                ${baseContext}
                ${specificAssetContext}
            `;

            const prompt = `
            [MODE: PILLAR AUTHORITY WRITER]
            Article Title: "${title}"
            Current Section: "${outline[i]}" (${i + 1}/${outline.length})
            
            [CONTEXTUAL DATA]
            ${currentContext}

            [WRITING RULES]
            1. Fokus HANYA pada sub-judul: "${outline[i]}".
            2. Kedalaman: Bahas tuntas. Pake bullet points/tabel kalau perlu.
            3. Flow & Anti-Repetisi: 
               ${i === 0 ? 
                 "Mulai dengan Hook yang nendang. JANGAN pake basa-basi standar AI." : 
                 `REFERENSI KONTEKS (100 char terakhir): "...${prevSectionEnd}...". 
                  JANGAN ULANGI kalimat tersebut. LANGSUNG LANJUT ke paragraf baru.`
               }
            4. Asset Rule: Jika ada data [PRODUCT] atau [PROJECT] di atas, gunakan MAKSIMAL 1 saja di seksi ini. 
               Letakkan kartu tersebut DI ANTARA paragraf (setelah paragraf selesai), JANGAN nyelip di dalam teks.
            5. ${isLast ? CLOSING_RULE : "JANGAN tulis kesimpulan/closing dulu. Langsung berhenti di poin terakhir seksi ini."}

            Output: Markdown murni.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text?.trim() || "";
            
            fullContent += text + "\n\n";
            prevSectionEnd = text.slice(-150);
        }
        return fullContent;
    }
};
