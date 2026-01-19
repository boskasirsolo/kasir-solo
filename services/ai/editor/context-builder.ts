
import { FOUNDER_ANECDOTES } from './config';

export const ContextBuilder = {
    getPersona: (author: string) => {
        const isFounder = author === 'Amin Maghfuri';
        const story = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
        return isFounder
            ? `[ROLE: FOUNDER] You are Amin Maghfuri. Tone: Street-smart, 'Gue/Lo', Gritty, Experienced. Insert this story naturally: ${story}`
            : `[ROLE: EXPERT TEAM] Tone: Professional, 'Kami', Trustworthy, Corporate but warm.`;
    },

    getLocalSEO: (city?: { name: string; type: string }) => {
        if (!city) return "";
        const isKandang = city.type === 'Kandang';
        return `
        [LOCAL SEO STRATEGY: ${city.name.toUpperCase()}]
        - Audience: Business owners in ${city.name}.
        - USP: ${isKandang ? "Founder handles installation directly (Hands-on)." : "Secure Wooden Crating + Video Call Setup."}
        - Mention '${city.name}' naturally in the introduction.
        `;
    },

    getAssetContext: (productsJson?: string, galleryJson?: string) => {
        let text = "";
        try {
            if (productsJson) {
                // LIMIT TO 3 ITEMS to prevent cognitive load on AI and overcrowding
                const prods = JSON.parse(productsJson).slice(0, 3);
                if (prods.length) text += `\n[RECOMMENDED PRODUCTS (Select Max 1)]\n` + prods.map((p:any) => `- ${p.name} (Rp ${p.price}) -> [PRODUCT: ${p.name} | ${p.price} | ${p.image} | ${p.desc}]`).join('\n');
            }
            if (galleryJson) {
                // LIMIT TO 3 ITEMS
                const projs = JSON.parse(galleryJson).slice(0, 3);
                if (projs.length) text += `\n[PORTFOLIO REFERENCES (Select Max 1)]\n` + projs.map((p:any) => `- ${p.title} -> [PROJECT: ${p.title} | /gallery/${p.slug} | ${p.image} | ${p.desc}]`).join('\n');
            }
        } catch (e) { console.warn("Asset parse error", e); }
        
        // STRICT CONSTRAINT
        return text ? text + "\n[CONSTRAINT] Insert MAXIMUM 1 Product OR Project Card in this generation. Do not force them if not relevant to the topic. Keep the content clean." : "";
    },

    getCrossLinking: (pillars?: { title: string; slug: string }[]) => {
        if (!pillars || !pillars.length) return "";
        return `\n[CROSS-LINKING MANDATORY]\nWeave links to these topics: \n` + 
               pillars.map(p => `- "${p.title}" -> [${p.title}](/articles/${p.slug})`).join('\n');
    }
};
