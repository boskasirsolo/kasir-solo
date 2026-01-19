
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
                const prods = JSON.parse(productsJson);
                if (prods.length) text += `\n[RECOMMENDED PRODUCTS]\n` + prods.map((p:any) => `- ${p.name} (Rp ${p.price}) -> [PRODUCT: ${p.name} | ${p.price} | ${p.image} | ${p.desc}]`).join('\n');
            }
            if (galleryJson) {
                const projs = JSON.parse(galleryJson);
                if (projs.length) text += `\n[PORTFOLIO REFERENCES]\n` + projs.map((p:any) => `- ${p.title} -> [PROJECT: ${p.title} | /gallery/${p.slug} | ${p.image} | ${p.desc}]`).join('\n');
            }
        } catch (e) { console.warn("Asset parse error", e); }
        return text ? text + "\nRule: Insert these assets strictly where relevant." : "";
    },

    getCrossLinking: (pillars?: { title: string; slug: string }[]) => {
        if (!pillars || !pillars.length) return "";
        return `\n[CROSS-LINKING MANDATORY]\nWeave links to these topics: \n` + 
               pillars.map(p => `- "${p.title}" -> [${p.title}](/articles/${p.slug})`).join('\n');
    }
};
