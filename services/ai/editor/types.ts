
export interface WriterConfig {
    author_name: string;
    selected_tones: string[];
    target_word_count: number;
    user_notes?: string;
    city_context?: { name: string; type: string };
    pillar_parent?: { title: string; slug: string };
    related_pillars?: { title: string; slug: string }[];
    products_json?: string;
    gallery_json?: string;
}

export interface WritingParticle {
    type: 'hook' | 'bridge' | 'lore_injection' | 'technical_deep' | 'closing';
    heading: string;
    instruction: string;
}
