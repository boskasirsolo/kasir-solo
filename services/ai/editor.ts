
// --- EDITOR AI FACADE ---
// This file aggregates the atomic modules to maintain backward compatibility
// with existing components that import EditorAI.

import { Researcher } from './editor/research';
import { Taxonomy } from './editor/taxonomy';
import { Writer } from './editor/writer';

export const EditorAI = {
    // Research Module
    researchTopics: Researcher.researchTopics,
    generateMeta: Researcher.generateMeta,

    // Taxonomy/Structure Module
    generateClusters: Taxonomy.generateClusters,
    suggestCategories: Taxonomy.suggestCategories,

    // Writer Module
    writeArticle: Writer.writeArticle
};
