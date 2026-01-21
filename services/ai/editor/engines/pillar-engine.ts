
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
        let prevSectionEnd = "";

        for (let i = 0; i < outline.length; i++) {
            const isLast = i === outline.length - 1;
            
            // STRATEGY: Only inject assets in specific sections
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
            1. Fokus HANYA pada sub-judul: "${outline[i]}".
            2. Kedalaman: Bahas tuntas. Pake bullet points/tabel kalau perlu.
            3. Flow & Anti-Repetisi: 
               ${i === 0 ? 
                 "Mulai dengan Hook yang nendang. JANGAN pake basa-basi standar AI." : 
                 `REFERENSI KONTEKS: Gue kasih 100 karakter terakhir dari bagian sebelumnya biar lo nyambung: "...${prevSectionEnd}...". 
                  PENTING: JANGAN ULANGI, JANGAN TULIS ULANG, dan JANGAN RE-PHRASE kalimat referensi tersebut. 
                  Tugas lo adalah: LANGSUNG LANJUT ke kalimat atau paragraf berikutnya seolah-olah lo cuma lanjut ngetik.`
               }
            4. ${isLast ? CLOSING_RULE : "JANGAN tulis kesimpulan/closing dulu. Langsung berhenti di poin terakhir seksi ini."}

            Output: Markdown murni.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text?.trim() || "";
            
            // Tambahkan spacing antar seksi
            fullContent += text + "\n\n";
            
            // Simpan ujung teks buat referensi seksi berikutnya
            prevSectionEnd = text.slice(-150);
        }
        return fullContent;
    }
};
