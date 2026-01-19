
import { callGeminiWithRotation } from '../core';
import { BRAND_CONTEXT, FOUNDER_ANECDOTES, GOV_CRITIQUE_RULE, INTERNAL_LINKING_RULES, CLOSING_RULE } from './config';
import { Taxonomy } from './taxonomy';

// --- SHARED UTILS ---

const buildPersona = (authorName: string) => {
    const isAmin = authorName === 'Amin Maghfuri';
    const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
    
    if (isAmin) {
        return `First Person Casual ('Gue'). You are Amin Maghfuri (Founder). Use 'Gue/Lo'. Be gritty, street-smart. Inject this story naturally: ${selectedAnecdote}`;
    }
    return "Professional ('Kami'). Trustworthy, Expert, Corporate Tone.";
};

const buildCommonContext = (cityContext?: { name: string, type: string }, userContext?: string) => {
    let cityInstruction = "";
    if (cityContext) {
        const isKandang = cityContext.type === 'Kandang';
        cityInstruction = `
        [LOCAL SEO STRATEGY: ${cityContext.name.toUpperCase()}]
        - Target Audience: Business owners in ${cityContext.name}.
        - ${isKandang ? "Mention Founder direct handling & local presence." : "Emphasize safe shipping (Wooden Crate) & Video Call Setup."}
        `;
    }
    const userNotes = userContext ? `\n[USER NOTES - HIGH PRIORITY]:\n"${userContext}"\n` : "";
    return { cityInstruction, userNotes };
};

// Helper: Build Internal Linking Instructions
const buildLinkingInstructions = (
    relatedPillarsData?: { title: string, slug: string }[]
) => {
    if (!relatedPillarsData || relatedPillarsData.length === 0) return "";

    let instructions = `\n[MANDATORY CROSS-LINKING STRATEGY]\n`;
    instructions += `You MUST mention and link to the following related topics naturally within the content body (Horizontal SEO Structure):\n`;
    
    relatedPillarsData.forEach(p => {
        instructions += `- Topic: "${p.title}" -> Link: [${p.title}](/articles/${p.slug})\n`;
    });
    
    instructions += `Rules for linking:\n`;
    instructions += `1. Do NOT just list them at the end.\n`;
    instructions += `2. Weave them into sentences where relevant contextually.\n`;
    instructions += `3. Use the exact markdown format provided.\n`;

    return instructions;
};

// Helper: Build Asset Instructions (Products & Projects)
const buildAssetInstructions = (productJson?: string, galleryJson?: string) => {
    let instructions = "";

    if (productJson) {
        try {
            const products = JSON.parse(productJson);
            if (products.length > 0) {
                instructions += `\n[AVAILABLE PRODUCTS TO RECOMMEND]\n`;
                instructions += `You have access to these specific products in our inventory:\n`;
                products.forEach((p: any) => {
                    instructions += `- Name: ${p.name}, Price: ${p.price}, Image: ${p.image}, Desc: ${p.desc}\n`;
                });
                instructions += `\n**STRATEGY:** If a section talks about a solution we sell, INSERT A PRODUCT CARD.\n`;
                instructions += `**STRICT FORMAT:** [PRODUCT: Name | Price | ImageURL | ShortDesc]\n`;
                instructions += `**RULE:** You MUST use the EXACT 'Image' URL provided above. Do NOT hallucinate URLs.\n`;
            }
        } catch (e) { console.warn("Failed to parse product context"); }
    }

    if (galleryJson) {
        try {
            const projects = JSON.parse(galleryJson);
            if (projects.length > 0) {
                instructions += `\n[PORTFOLIO SHOWCASE]\n`;
                instructions += `You can mention our real project experiences:\n`;
                projects.forEach((p: any) => {
                    instructions += `- Project: ${p.title}, Slug: /gallery/${p.slug}, Image: ${p.image}\n`;
                });
                instructions += `\n**STRATEGY:** Use this to prove credibility.\n`;
                instructions += `**STRICT FORMAT:** [PROJECT: Title | /gallery/slug | ImageURL | ShortDesc]\n`;
                instructions += `**RULE:** You MUST use the EXACT 'Image' URL provided above.\n`;
            }
        } catch (e) { console.warn("Failed to parse gallery context"); }
    }

    return instructions;
}

// --- ENGINE 1: PILLAR WRITER (The Authority) ---
// Fokus: Broad, Comprehensive, Definitive Guide, Struktur Rapi.

const PillarWriter = {
    generate: async (
        title: string,
        params: any
    ) => {
        const pov = buildPersona(params.authorName);
        const { cityInstruction, userNotes } = buildCommonContext(params.cityContext, params.userContext);
        
        // Generate Instructions
        const linkingInstructions = buildLinkingInstructions(params.relatedPillarsData);
        const assetInstructions = buildAssetInstructions(params.productContextString, params.galleryContextString);

        // Pillar Prompt Structure
        const sectionsCount = Math.max(5, Math.ceil(params.wordCount / 800)); // Pillars need more sections
        const sections = await Taxonomy.createOutline(title, sectionsCount);

        let fullContent = "";
        let previousContext = "";

        for (let i = 0; i < sections.length; i++) {
            const sectionTitle = sections[i];
            const isLastSection = i === sections.length - 1;
            
            const prompt = `
            [MODE: PILLAR CONTENT - THE ULTIMATE GUIDE]
            Role: Expert Industry Authority.
            Task: Write Section ${i + 1}/${sections.length}: "${sectionTitle}" for the article "${title}".
            Target Word Count for this section: 800 words.
            POV: ${pov}
            
            [PILLAR RULES]
            1. Be comprehensive. Cover the "What", "Why", and "How" deeply.
            2. Establish authority. You are defining the standard for this topic.
            3. Structure: Use H2, H3, Bullet points for readability.
            
            [CONTEXT]
            ${BRAND_CONTEXT}
            ${cityInstruction}
            ${userNotes}
            ${GOV_CRITIQUE_RULE}
            ${linkingInstructions}
            ${assetInstructions}
            
            ${isLastSection ? `[FINAL SUMMARY]: Wrap up everything. ${CLOSING_RULE}` : "Do NOT conclude yet. Continue to next topic."}
            ${i === 0 ? "Start with a strong hook defining the big problem." : `Bridge from previous: "...${previousContext.slice(-100)}..."`}

            OUTPUT: Markdown.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text || "";
            fullContent += text + "\n\n";
            previousContext = text;
        }
        return fullContent;
    }
};

// --- ENGINE 2: CLUSTER WRITER (The Supporter) ---
// Fokus: Specific, Long-tail, Internal Linking to Pillar, Niche Problem Solving.

const ClusterWriter = {
    generate: async (
        title: string,
        params: any
    ) => {
        const pov = buildPersona(params.authorName);
        const { cityInstruction, userNotes } = buildCommonContext(params.cityContext, params.userContext);
        const assetInstructions = buildAssetInstructions(params.productContextString, params.galleryContextString);
        
        // Validasi Parent Pillar
        if (!params.pillarContext || !params.pillarContext.title) {
            throw new Error("Cluster Content MUST have a Parent Pillar defined.");
        }

        const prompt = `
        [MODE: CLUSTER CONTENT - SPECIFIC SUPPORT]
        Role: Specialist Problem Solver.
        Task: Write Article "${title}".
        Target Word Count: ${params.wordCount} words.
        POV: ${pov}

        [THE GOLDEN RULE: PARENT LINKING]
        You are writing a supporting article for the main pillar: "${params.pillarContext.title}".
        **MANDATORY:** You MUST mention "${params.pillarContext.title}" and link to it using: [${params.pillarContext.title}](/articles/${params.pillarContext.slug}) 
        Place this link NATURALLY within the first 2 paragraphs. This is crucial for SEO structure.

        [CLUSTER RULES]
        1. Be specific. Don't be broad. Solve the specific problem in the title "${title}".
        2. Don't repeat general info found in the Pillar. Go deep into the niche details.
        
        [CONTEXT]
        ${BRAND_CONTEXT}
        ${cityInstruction}
        ${userNotes}
        ${INTERNAL_LINKING_RULES}
        ${CLOSING_RULE}
        ${assetInstructions}

        OUTPUT: Markdown.
        `;

        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text || "";
    }
};

// --- FACADE EXPORT ---

export const Writer = {
    writeArticle: async (
        title: string,
        tones: string[],
        type: string,
        authorName: string,
        wordCount: number,
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[], 
        galleryContextString?: string,
        userContext?: string,
        cityContext?: { name: string, type: string },
        productContextString?: string
    ) => {
        const params = {
            tones, authorName, wordCount, pillarContext, relatedPillarsData,
            galleryContextString, userContext, cityContext, productContextString
        };

        if (type === 'pillar') {
            return await PillarWriter.generate(title, params);
        } else {
            return await ClusterWriter.generate(title, params);
        }
    }
};
