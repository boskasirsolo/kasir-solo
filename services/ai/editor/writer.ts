
import { WriterConfig } from './types';
import { Orchestrator } from './orchestrator';

export const Writer = {
    writeArticle: async (
        p_title: string,
        p_tones: string[],
        p_type: string,
        p_author_name: string,
        p_word_count: number,
        p_pillar_context?: { title: string; slug: string },
        p_related_pillars?: { title: string; slug: string }[],
        p_gallery_json?: string,
        p_user_context?: string,
        p_city_context?: { name: string; type: string },
        p_product_json?: string
    ) => {
        const config: WriterConfig = {
            author_name: p_author_name,
            selected_tones: p_tones,
            target_word_count: p_word_count,
            user_notes: p_user_context,
            city_context: p_city_context,
            pillar_parent: p_pillar_context,
            related_pillars: p_related_pillars,
            products_json: p_product_json,
            gallery_json: p_gallery_json
        };

        return await Orchestrator.assemble(p_title, config, p_type as 'pillar' | 'cluster');
    }
};
