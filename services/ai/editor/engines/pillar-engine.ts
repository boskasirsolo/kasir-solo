
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
            [MODE: PILLAR AUTHORITY WRITER - SESSION CONTINUATION]
            Article Title: "${title}"
            Sub-Heading Target: "## ${outline[i]}" (${i + 1}/${outline.length})
            
            [CONTEXTUAL DATA]
            ${currentContext}

            [STRICT WRITING RULES]
            1. Fokus HANYA pada isi materi: "${outline[i]}".
            2. Flow Kontinuitas (ANTI-REPETISI): 
               ${i === 0 ? 
                 "Mulai dengan Hook yang nendang. JANGAN pake basa-basi standar AI." : 
                 `TEKS SEBELUMNYA BERAKHIR DI: "...${prevSectionEnd}...".
                  TUGAS LO: LANGSUNG MASUK KE MATERI BARU. 
                  - JANGAN tulis ulang kalimat referensi di atas.
                  - JANGAN bikin ringkasan atau transisi "Nah, setelah membahas...", "Seperti yang disebutkan sebelumnya...", atau "Selain hal itu...".
                  - ANGGAP pembaca sudah tahu apa yang lo tulis di atas, jadi gak perlu lo ingetin lagi.
                  - LANGSUNG GAS ke paragraf pertama seksi ini.`
               }
            3. Kedalaman: Bahas tuntas. Pake bullet points/tabel jika data mendukung.
            4. Asset Rule: Jika ada tag [PRODUCT] atau [PROJECT] di atas, gunakan MAKSIMAL 1 di seksi ini. Letakkan di baris kosong tersendiri SETELAH sebuah paragraf selesai.
            5. ${isLast ? CLOSING_RULE : "JANGAN tulis kesimpulan. Langsung berhenti di kalimat terakhir materi seksi ini."}

            Output: Markdown murni (Tanpa kata-kata pengantar AI).
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text?.trim() || "";
            
            // Tambahkan sub-heading jika belum ada (AI sering nulis sub-heading sendiri tapi kita mastiin)
            const formattedText = text.startsWith('##') ? text : `## ${outline[i]}\n\n${text}`;
            
            fullContent += formattedText + "\n\n";
            
            // Ambil 300 karakter terakhir buat konteks yang lebih solid tapi instruksi tetep galak
            prevSectionEnd = text.slice(-300);
        }
        return fullContent;
    }
};
