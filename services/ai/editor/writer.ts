
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
    galleryContextString?: string
) => {
    let instructions = "";
    
    if (type === 'cluster' && pillarContext) {
        instructions += `[SEO]: Link back to [${pillarContext.title}](/articles/${pillarContext.slug}) in first 3 paragraphs.\n`;
    }
    
    if (relatedPillarsData && relatedPillarsData.length > 0) {
        instructions += `[SEO]: Weave links to these related pillars naturally:\n${relatedPillarsData.map(p => `- [${p.title}](/articles/${p.slug})`).join('\n')}\n`;
    }

    if (galleryContextString) {
        instructions += `[PORTFOLIO SHOWCASE STRATEGY]\nAvailable Projects:\n${galleryContextString}\nIF MATCH FOUND: Insert a "Project Card" shortcode: [PROJECT: Name | /gallery/slug | ImageURL | Desc]\n`;
    }

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
        userContext?: string // NEW ARGUMENT
    ) => {
        const pov = buildPersona(authorName);
        const linking = buildLinkingInstructions(type, pillarContext, relatedPillarsData, galleryContextString);
        
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
            Brand Context: ${BRAND_CONTEXT}
            ${GOV_CRITIQUE_RULE}
            ${INTERNAL_LINKING_RULES}
            ${userNotes}
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
            ${userNotes}
            ${INTERNAL_LINKING_RULES}
            ${i === 0 ? "Start with a hook." : `Connect to previous: "...${previousContext.slice(-200)}..."`}
            ${linking}
            OUTPUT: Markdown.
            `;
            
            // Sequential generation with delay to respect rate limits if needed
            const secRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: sectionPrompt });
            const text = secRes.text || "";
            fullContent += text + "\n\n";
            previousContext = text;
        }
        return fullContent;
    }
};
