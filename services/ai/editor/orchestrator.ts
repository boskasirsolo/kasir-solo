
import { Taxonomy } from './taxonomy';
import { ContextBuilder } from './context-builder';
import { WritingParticles } from './particles/writing-particles';
import { WriterConfig } from './types';
import { BRAND_CONTEXT, CLOSING_RULE } from './config';

export const Orchestrator = {
    async assemble(p_title: string, p_config: WriterConfig, p_type: 'pillar' | 'cluster') {
        // 1. DATA HARVESTING (LORE)
        const lore_context = ContextBuilder.getAssetContext(p_config.products_json, p_config.gallery_json);
        const persona_context = `${BRAND_CONTEXT}\n${ContextBuilder.getPersona(p_config.author_name)}`;
        const local_seo = ContextBuilder.getLocalSEO(p_config.city_context);

        // 2. BLUEPRINTING
        const sections_count = p_type === 'pillar' 
            ? Math.max(5, Math.min(8, Math.ceil(p_config.target_word_count / 400)))
            : Math.max(3, 5);
        
        const outline = await Taxonomy.createOutline(p_title, sections_count, lore_context);
        
        let full_article = "";
        let last_snippet = "";

        // 3. ASSEMBLY LINE (Atomic Execution)
        for (let i = 0; i < outline.length; i++) {
            const current_heading = outline[i];
            const is_first = i === 0;
            const is_last = i === outline.length - 1;

            // Specialized instructions per particle type
            let specific_instruction = "Berikan analisa mendalam. Jangan cuma list, tapi kasih 'Why'.";
            if (is_first) specific_instruction = "Ini adalah pembuka. Hajar mental pembaca dengan hook yang gritty.";
            if (is_last) specific_instruction = `${CLOSING_RULE}\nBikin penutup yang memorable tanpa kata 'Kesimpulan'.`;

            const section_content = await WritingParticles.executeSection({
                article_title: p_title,
                current_heading: current_heading,
                roadmap: outline,
                lore_context: `${lore_context}\n${local_seo}`,
                persona_context: persona_context,
                continuity_memory: is_first ? "Mulai dari nol." : `Seksi sebelumnya berakhir di: "${last_snippet.slice(-300)}". Jangan mengulang, tapi buat transisinya smooth.`,
                specific_instruction: specific_instruction,
                target_word_count: Math.floor(p_config.target_word_count / outline.length)
            });

            // Formatting heading to ensure consistency
            const formatted = section_content.startsWith('##') 
                ? section_content 
                : `## ${current_heading}\n\n${section_content}`;

            full_article += formatted + "\n\n";
            last_snippet = section_content;
        }

        return full_article;
    }
};
