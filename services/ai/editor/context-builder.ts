
import { FOUNDER_ANECDOTES } from './config';

export const ContextBuilder = {
    getPersona: (author: string) => {
        const isFounder = author === 'Amin Maghfuri';
        const storyIndex = Math.floor(Math.random() * FOUNDER_ANECDOTES.length);
        const story = FOUNDER_ANECDOTES[storyIndex];
        
        return isFounder
            ? `[ROLE: FOUNDER AMIN MAGHFURI] Tone: Street-smart, gritty, experienced. WAJIB selipkan cerita pribadi ini secara organik: ${story}`
            : `[ROLE: EXPERT TEAM MKS] Tone: Professional, trusted partner, proactive.`;
    },

    getLocalSEO: (city?: { name: string; type: string }) => {
        if (!city) return "";
        const isKandang = city.type === 'Kandang';
        return `
        [LOCAL SEO STRATEGY: ${city.name.toUpperCase()}]
        - Audience: Pebisnis di ${city.name}.
        - USP: ${isKandang ? "Gue bisa mampir langsung ke lokasi lo di ${city.name}." : "Gue kirim paket pake peti kayu biar aman sampe ${city.name}."}
        - Masukkan nama kota '${city.name}' minimal 2 kali.
        `;
    },

    getAssetContext: (productsJson?: string, galleryJson?: string) => {
        let text = "";
        try {
            if (productsJson) {
                const prods = JSON.parse(productsJson).slice(0, 4);
                if (prods.length) {
                    text += `\n[AVAILABLE WEAPONS (PRODUCTS)]\n` + prods.map((p:any) => 
                        `- "${p.name}" (Rp ${p.price}). Spek Kunci: ${JSON.stringify(p.specs || {})}. \n  Tag Kartu: [PRODUCT: ${p.name} | ${p.price} | ${p.image} | ${p.desc}]`
                    ).join('\n');
                }
            }
            if (galleryJson) {
                const projs = JSON.parse(galleryJson).slice(0, 4);
                if (projs.length) {
                    text += `\n[WAR RECORDS (PORTFOLIO)]\n` + projs.map((p:any) => 
                        `- Project "${p.title}" di ${p.platform}. Masalah: ${p.case_study?.challenge}. Solusi: ${p.case_study?.solution}. \n  Tag Kartu: [PROJECT: ${p.title} | /gallery/${p.slug} | ${p.image} | ${p.desc}]`
                    ).join('\n');
                }
            }
        } catch (e) { console.warn("Lore context error", e); }
        
        return text ? `
            ${text}
            
            [INSTRUCTION FOR LORE USAGE]
            Ceritakan item di atas seolah lo emang bangga sama hasilnya. Jangan cuma jualan, tapi kasih 'Wisdom' kenapa barang/proyek itu penting.
        ` : "";
    },

    getCrossLinking: (pillars?: { title: string; slug: string }[]) => {
        if (!pillars || !pillars.length) return "";
        return `\n[INTERNAL LINKING]\nHubungkan ke topik pilar ini: \n` + 
               pillars.map(p => `- "${p.title}" -> [${p.title}](/articles/${p.slug})`).join('\n');
    }
};
