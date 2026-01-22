
import { FOUNDER_ANECDOTES } from './config';

export const ContextBuilder = {
    getPersona: (p_author: string) => {
        const is_founder = p_author === 'Amin Maghfuri';
        const story_index = Math.floor(Math.random() * FOUNDER_ANECDOTES.length);
        const story = FOUNDER_ANECDOTES[story_index];
        
        return is_founder
            ? `[ROLE: FOUNDER AMIN MAGHFURI] Tone: Street-smart, gritty, experienced. WAJIB selipkan cerita pribadi ini secara organik: ${story}`
            : `[ROLE: EXPERT TEAM MKS] Tone: Professional, trusted partner, proactive.`;
    },

    getLocalSEO: (p_city?: { name: string; type: string }) => {
        if (!p_city) return "";
        const is_kandang = p_city.type === 'Kandang';
        return `
        [LOCAL SEO STRATEGY: ${p_city.name.toUpperCase()}]
        - Audience: Pebisnis di ${p_city.name}.
        - USP: ${is_kandang ? `Gue bisa mampir langsung ke lokasi lo di ${p_city.name}.` : `Gue kirim paket pake peti kayu biar aman sampe ${p_city.name}.`}
        - Masukkan nama kota '${p_city.name}' minimal 2 kali.
        `;
    },

    getAssetContext: (p_products_json?: string, p_gallery_json?: string) => {
        let text = "";
        try {
            if (p_products_json) {
                const prods = JSON.parse(p_products_json).slice(0, 4);
                if (prods.length) {
                    text += `\n[AVAILABLE WEAPONS (PRODUCTS)]\n` + prods.map((p:any) => 
                        `- "${p.name}" (Rp ${p.price}). Spek Kunci: ${JSON.stringify(p.specs || {})}. \n  Tag Kartu: [PRODUCT: ${p.name} | ${p.price} | ${p.image} | ${p.desc}]`
                    ).join('\n');
                }
            }
            if (p_gallery_json) {
                const projs = JSON.parse(p_gallery_json).slice(0, 4);
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

    getCrossLinking: (p_pillars?: { title: string; slug: string }[]) => {
        if (!p_pillars || !p_pillars.length) return "";
        return `\n[INTERNAL LINKING]\nHubungkan ke topik pilar ini: \n` + 
               p_pillars.map(p => `- "${p.title}" -> [${p.title}](/articles/${p.slug})`).join('\n');
    }
};
