
export type KnowledgeCategory = 'pricing' | 'story' | 'policy' | 'technical' | 'behavior';

export interface AIKnowledge {
    id: string;
    created_at: string;
    category: KnowledgeCategory;
    title: string;
    content: string;
    is_active: boolean;
}

export const KNOWLEDGE_CATEGORIES: { id: KnowledgeCategory; label: string; icon: string }[] = [
    { id: 'pricing', label: 'Harga & Promo', icon: '💰' },
    { id: 'story', label: 'Cerita & Branding', icon: '📖' },
    { id: 'policy', label: 'Aturan & Garansi', icon: '📜' },
    { id: 'technical', label: 'Spek & Teknis', icon: '🛠️' },
    { id: 'behavior', label: 'Gaya Bicara', icon: '🎭' }
];
