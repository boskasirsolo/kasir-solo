
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
                const prods = JSON.parse(productsJson).slice(0, 3);
                if (prods.length) text += `\n[AVAILABLE PRODUCTS]\n` + prods.map((p:any) => `- ${p.name} (Rp ${p.price}) -> [PRODUCT: ${p.name} | ${p.price} | ${p.image} | ${p.desc}]`).join('\n');
            }
            if (galleryJson) {
                const projs = JSON.parse(galleryJson).slice(0, 3);
                if (projs.length) text += `\n[PORTFOLIO REFERENCES]\n` + projs.map((p:any) => `- ${p.title} -> [PROJECT: ${p.title} | /gallery/${p.slug} | ${p.image} | ${p.desc}]`).join('\n');
            }
        } catch (e) { console.warn("Asset parse error", e); }
        
        return text ? `
            ${text}
            
            [STRICT CARD PLACEMENT RULES]
            1. JANGAN PERNAH taruh tag [PRODUCT:...] atau [PROJECT:...] di tengah kalimat atau di dalam paragraf.
            2. Kartu WAJIB berdiri sendiri di baris baru. Harus ada baris kosong di atas dan di bawah tag kartu tersebut.
            3. Jika lo mutusin buat pasang kartu, pasang setelah lo selesai ngejelasin satu poin bahasan, atau di akhir seksi ini.
            4. JANGAN tumpuk kartu berdekatan. Jika sudah pasang 1 kartu di seksi ini, jangan pasang lagi kecuali sangat relevan.
        ` : "";
    },

    getCrossLinking: (pillars?: { title: string; slug: string }[]) => {
        if (!pillars || !pillars.length) return "";
        return `\n[CROSS-LINKING MANDATORY]\nWeave links to these topics: \n` + 
               pillars.map(p => `- "${p.title}" -> [${p.title}](/articles/${p.slug})`).join('\n');
    }
};
