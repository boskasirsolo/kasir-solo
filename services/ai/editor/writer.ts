
import { callGeminiWithRotation } from '../core';
import { BRAND_CONTEXT, FOUNDER_ANECDOTES, GOV_CRITIQUE_RULE, INTERNAL_LINKING_RULES } from './config';
import { Taxonomy } from './taxonomy';

// --- MODULE: WRITER (CONTENT GENERATION) ---

// Helper: Bangun persona penulis
const buildPersona = (authorName: string) => {
    const isAmin = authorName === 'Amin Maghfuri';
    const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
    
    if (isAmin) {
        return `First Person Casual ('Gue'). You are Amin Maghfuri (Founder). Use 'Gue/Lo'. Be gritty, street-smart. Inject this story naturally: ${selectedAnecdote}`;
    }
    return "Professional ('Kami'). Trustworthy, Expert, Corporate Tone.";
};

// Helper: Bangun instruksi linking
const buildLinkingInstructions = (
    type: string, 
    pillarContext?: { title: string, slug: string },
    relatedPillarsData?: { title: string, slug: string }[],
    galleryContextString?: string,
    productContextString?: string
) => {
    let instructions = "";
    
    if (type === 'cluster' && pillarContext) {
        instructions += `[SEO]: Link back to [${pillarContext.title}](/articles/${pillarContext.slug}) in first 3 paragraphs.\n`;
    }
    
    if (relatedPillarsData && relatedPillarsData.length > 0) {
        instructions += `[SEO]: Weave links to these related pillars naturally:\n${relatedPillarsData.map(p => `- [${p.title}](/articles/${p.slug})`).join('\n')}\n`;
    }

    if (galleryContextString) {
        instructions += `\n[PORTFOLIO SHOWCASE STRATEGY]\nAvailable Projects:\n${galleryContextString}\nIF A PROJECT IS RELEVANT to a section: Insert a "Project Card" shortcode: [PROJECT: Name | /gallery/slug | ImageURL | Desc]\n`;
    }

    if (productContextString) {
        instructions += `\n[PRODUCT PLACEMENT STRATEGY]\nAvailable Products:\n${productContextString}\nIF A PRODUCT IS RELEVANT to the context: Insert a "Product Card" shortcode: [PRODUCT: Name | Price | ImageURL | Desc]\n`;
    }

    instructions += `\n[SERVICE LINKS]\nAvailable Services:\n- Website: /services/website\n- WebApp: /services/webapp\n- SEO: /services/seo\n- Maintenance: /services/maintenance\nIF RELEVANT: Use Service Card shortcode: [SERVICE: ServiceName | /services/slug | Desc]\n`;

    return instructions;
};

export const Writer = {
    /**
     * Tulis artikel utuh (Smart Router: Short vs Long)
     */
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
        const pov = buildPersona(authorName);
        const linking = buildLinkingInstructions(type, pillarContext, relatedPillarsData, galleryContextString, productContextString);
        
        let cityInstruction = "";
        if (cityContext) {
            const isKandang = cityContext.type === 'Kandang';
            cityInstruction = `
            [LOCAL SEO CONTEXT - ${cityContext.name.toUpperCase()}]
            - Target Location: ${cityContext.name}.
            - Strategy: ${cityContext.type}.
            ${isKandang ? 
                "- NARRATIVE: Mention that the Founder (Amin) will personally deliver, setup, and train the user on-site in this city. Emphasis on 'Local Priority'." : 
                "- NARRATIVE: Focus on SAFE SHIPPING (Packing Kayu + Asuransi) and dedicated PRIVATE VIDEO CALL for remote setup & training."}
            - Integrate local keywords like "Jual Mesin Kasir di ${cityContext.name}", "Paket Kasir ${cityContext.name}".
            `;
        }

        const userNotes = userContext ? `\n[ADDITIONAL CONTEXT FROM USER - STRICTLY FOLLOW]:\n"${userContext}"\n` : "";

        // MODE 1: SHORT FORM (< 2000 Words) - Single Shot
        if (wordCount < 2000) {
            const prompt = `
            Role: Expert Copywriter PT Mesin Kasir Solo.
            Task: Write Article "${title}".
            Length: Approx ${wordCount} words.
            POV: ${pov}
            Tone: ${tones.join(', ')}.
            Structure: Use Headers #, ##, ###, Lists, Bold.
            
            ${linking}
            
            ${cityInstruction}
            Brand Context: ${BRAND_CONTEXT}
            ${GOV_CRITIQUE_RULE}
            ${INTERNAL_LINKING_RULES}
            ${userNotes}
            
            CRITICAL RULES:
            - WEAVE THE SHORTCODES (PRODUCT/PROJECT/SERVICE) NATURALLY INTO THE FLOW. 
            - DO NOT JUST DUMP THEM AT THE END.
            - Ensure headers are engaging.
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            return res.text || '';
        }

        // MODE 2: LONG FORM (> 2000 Words) - Section by Section
        const sectionsCount = Math.ceil(wordCount / 1000);
        const sections = await Taxonomy.createOutline(title, sectionsCount);

        let fullContent = "";
        let previousContext = "";

        for (let i = 0; i < sections.length; i++) {
            const sectionTitle = sections[i];
            const sectionPrompt = `
            Role: Expert Writer. Task: Write Section ${i + 1}: ${sectionTitle} for "${title}".
            Target: 1000 words. POV: ${pov}.
            Context: ${BRAND_CONTEXT}
            ${cityInstruction}
            ${userNotes}
            ${INTERNAL_LINKING_RULES}
            ${i === 0 ? "Start with a hook." : `Connect to previous: "...${previousContext.slice(-200)}..."`}
            
            ${linking}
            
            OUTPUT: Markdown. Use shortcodes for relevant products/projects mentioned in this section.
            `;
            
            const secRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: sectionPrompt });
            const text = secRes.text || "";
            fullContent += text + "\n\n";
            previousContext = text;
        }
        return fullContent;
    }
};
