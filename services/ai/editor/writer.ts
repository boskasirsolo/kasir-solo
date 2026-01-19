
import { callGeminiWithRotation } from '../core';
import { BRAND_CONTEXT, FOUNDER_ANECDOTES, GOV_CRITIQUE_RULE, INTERNAL_LINKING_RULES, CLOSING_RULE } from './config';
import { Taxonomy } from './taxonomy';

// --- TYPES ---
interface WriterParams {
    authorName: string;
    wordCount: number;
    tones: string[];
    cityContext?: { name: string; type: string };
    userContext?: string;
    pillarContext?: { title: string; slug: string }; // Parent for Cluster
    relatedPillars?: { title: string; slug: string }[]; // Cross-link for Pillar
    productJson?: string;
    galleryJson?: string;
}

// --- MODULE 1: CONTEXT BUILDER (LOGIC) ---
const ContextBuilder = {
    persona: (authorName: string) => {
        const isAmin = authorName === 'Amin Maghfuri';
        const anecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
        return isAmin 
            ? `POV: First Person ('Gue'). Identity: Amin Maghfuri (Founder). Tone: Street-smart, Gritty, Direct. Insert this story naturally: ${anecdote}`
            : "POV: Professional ('Kami'). Tone: Expert, Corporate, Trustworthy.";
    },

    localSEO: (city?: { name: string; type: string }) => {
        if (!city) return "";
        const isKandang = city.type === 'Kandang';
        return `[LOCAL SEO: ${city.name.toUpperCase()}]\nTarget: Business owners in ${city.name}.\nStrategy: ${isKandang ? "Highlight Founder direct handling & local presence." : "Emphasize safe shipping (Wooden Crate) & Video Call Setup."}`;
    },

    crossLinking: (pillars?: { title: string; slug: string }[]) => {
        if (!pillars || pillars.length === 0) return "";
        return `\n[CROSS-LINKING]\nMention & link to these topics naturally:\n` + 
               pillars.map(p => `- "${p.title}" -> [${p.title}](/articles/${p.slug})`).join('\n');
    },

    assets: (productJson?: string, galleryJson?: string) => {
        let instruction = "";
        try {
            if (productJson) {
                const products = JSON.parse(productJson);
                if (products.length > 0) {
                    instruction += `\n[PRODUCTS]\nRecommend these if relevant:\n` + products.map((p:any) => `- ${p.name} (Price: ${p.price})`).join('\n');
                    instruction += `\nFormat: [PRODUCT: Name | Price | ImageURL | Desc]\nRule: Use EXACT Image URL from context.`;
                }
            }
            if (galleryJson) {
                const projects = JSON.parse(galleryJson);
                if (projects.length > 0) {
                    instruction += `\n[PROJECTS]\nCite these examples:\n` + projects.map((p:any) => `- ${p.title}`).join('\n');
                    instruction += `\nFormat: [PROJECT: Title | /gallery/slug | ImageURL | Desc]\nRule: Use EXACT Image URL.`;
                }
            }
        } catch (e) { console.warn("Asset parse error", e); }
        return instruction;
    }
};

// --- MODULE 2: ENGINES (EXECUTION) ---

const PillarEngine = {
    async execute(title: string, params: WriterParams) {
        const context = {
            persona: ContextBuilder.persona(params.authorName),
            seo: ContextBuilder.localSEO(params.cityContext),
            links: ContextBuilder.crossLinking(params.relatedPillars),
            assets: ContextBuilder.assets(params.productJson, params.galleryJson),
            user: params.userContext ? `\n[USER NOTES]: ${params.userContext}` : ""
        };

        const sectionsCount = Math.max(5, Math.ceil(params.wordCount / 800));
        const sections = await Taxonomy.createOutline(title, sectionsCount);
        
        let fullContent = "";
        let prevContext = "";

        for (let i = 0; i < sections.length; i++) {
            const isLast = i === sections.length - 1;
            const prompt = `
            [MODE: PILLAR AUTHORITY]
            Task: Write Section ${i + 1}/${sections.length}: "${sections[i]}" for article "${title}".
            Length: ~800 words.
            
            [IDENTITY]
            ${context.persona}
            
            [CONTEXTUAL DATA]
            ${BRAND_CONTEXT}
            ${context.seo}
            ${context.user}
            ${context.links}
            ${context.assets}
            ${GOV_CRITIQUE_RULE}

            [FLOW CONTROL]
            ${i === 0 ? "Hook the reader immediately. Define the big problem." : `Bridge from: "...${prevContext.slice(-150)}..."`}
            ${isLast ? `Summarize and wrap up with a strong CTA. ${CLOSING_RULE}` : "Do NOT conclude yet."}
            
            OUTPUT: Markdown. Use H2, H3, Lists.
            `;

            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            const text = res.text || "";
            fullContent += text + "\n\n";
            prevContext = text;
        }
        return fullContent;
    }
};

const ClusterEngine = {
    async execute(title: string, params: WriterParams) {
        if (!params.pillarContext?.title) throw new Error("Cluster content requires a Parent Pillar.");

        const context = {
            persona: ContextBuilder.persona(params.authorName),
            seo: ContextBuilder.localSEO(params.cityContext),
            assets: ContextBuilder.assets(params.productJson, params.galleryJson),
            user: params.userContext ? `\n[USER NOTES]: ${params.userContext}` : ""
        };

        const prompt = `
        [MODE: CLUSTER SPECIFIC]
        Task: Write specific article "${title}".
        Target: ${params.wordCount} words.
        
        [IDENTITY]
        ${context.persona}

        [MANDATORY PARENT LINKING]
        Parent Pillar: "${params.pillarContext.title}"
        Rule: You MUST link to parent in the first 2 paragraphs using: [${params.pillarContext.title}](/articles/${params.pillarContext.slug}).
        
        [CONTEXTUAL DATA]
        ${BRAND_CONTEXT}
        ${context.seo}
        ${context.user}
        ${context.assets}
        ${INTERNAL_LINKING_RULES}
        ${CLOSING_RULE}

        OUTPUT: Markdown. Be specific, solve the niche problem.
        `;

        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text || "";
    }
};

// --- MODULE 3: FACADE (PUBLIC API) ---

export const Writer = {
    writeArticle: async (
        title: string,
        tones: string[],
        type: string,
        authorName: string,
        wordCount: number,
        pillarContext?: { title: string; slug: string },
        relatedPillarsData?: { title: string; slug: string }[],
        galleryContextString?: string,
        userContext?: string,
        cityContext?: { name: string; type: string },
        productContextString?: string
    ) => {
        // Normalize Params
        const params: WriterParams = {
            authorName,
            wordCount,
            tones,
            pillarContext,
            relatedPillars: relatedPillarsData,
            galleryJson: galleryContextString,
            userContext,
            cityContext,
            productJson: productContextString
        };

        if (type === 'pillar') {
            return await PillarEngine.execute(title, params);
        } else {
            return await ClusterEngine.execute(title, params);
        }
    }
};
