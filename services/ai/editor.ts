
import { callGeminiWithRotation } from './core';
import { Article } from '../../types';

// --- CONSTANTS ---
const FOUNDER_ANECDOTES = [
    `"Jujur aja, 2022 itu tahun neraka buat gue. Domain kantor 'expired' dan diambil orang. Rasanya kayak rumah lo digusur padahal sertifikatnya lengkap. Dari situ gue belajar: detail kecil itu mematikan."`,
    `"Pas gue liat notifikasi server down dan aset digital hilang, dengkul gue lemes. Itu momen gue sadar, bisnis tanpa backup system itu sama aja bunuh diri pelan-pelan."`,
    `"Jangan pikir gue langsung duduk enak di kursi CEO. 2015 gue jalan kaki, door-to-door nawarin mesin kasir, diusir satpam, diketawain owner toko. Mental gue ditempa di aspal panas."`,
    `"Klien pertama gue itu warung kelontong kecil. Dia bayar pake uang receh hasil dagang seharian. Gue terima duit itu sambil gemeter, gue janji software ini gak boleh ngecewain dia."`,
    `"Gue pernah gak tidur 48 jam cuma gara-gara selisih 50 perak di laporan closing. Orang bilang lebay, gue bilang itu integritas. Kalau 50 perak aja lolos, gimana 50 juta?"`,
    `"Bikin software itu gampang. Bikin software yang bisa dipake sama Ibu-ibu pasar yang gak ngerti gadget? Itu baru tantangan. SIBOS lahir dari situ."`,
    `"Banyak motivator bisnis bilang 'Fokus Omzet!', tai kucing lah. Fokus itu di Profit dan Data. Omzet gede kalau bocor di operasional buat apa? Capek doang."`,
    `"Stop dewa-dewain teknologi mahal. POS 50 juta gak guna kalau kasir lo masih bisa nyatet manual di buku utang. Sistem itu soal habit, bukan cuma alat."`,
    `"Gue sering banget denger curhatan owner yang duitnya dicolong karyawan kepercayaan. Sakitnya bukan di duitnya, tapi di khianatnya. Gue bangun sistem ini biar lo gak ngerasain sakit itu."`,
    `"Gue ngerti rasanya pusing ngurus stok opname tiap akhir bulan. Mata sepet, fisik capek, data gak klop. Gue pernah di posisi lo, Makanya gue bikin fitur auto-stock."`
];

const BRAND_CONTEXT = `
[IDENTITAS]
Nama: PT Mesin Kasir Solo.
DNA: Resilien, Jujur, Street-Smart, Anti-Ribet.
Produk: SIBOS (App Kasir), QALAM (App Sekolah), Hardware POS.

[STATUS PRODUK - CRITICAL / WAJIB PATUH]
1. SIBOS & QALAM (Software): Masih tahap PROTOTYPING / DEVELOPMENT (Belum Rilis).
   - HARAM HUKUMNYA menyuruh pembaca "Download Sekarang", "Beli Aplikasi", atau "Langganan Sekarang".
   - SIBOS belum ada di Playstore/Appstore.
   - GANTI Call-to-Action (CTA) dengan: "Daftar Waiting List", "Amankan Slot Early Access", atau "Konsultasi Kebutuhan Sistem".
2. Hardware POS (Alat Kasir Fisik): READY STOCK. Ini boleh dijual langsung/hard sell.

[GAYA BAHASA]
- JANGAN PERNAH gunakan kalimat pembuka standar AI seperti "Di era digital yang semakin pesat..." atau "Pada artikel kali ini...".
- Gunakan bahasa lisan yang cerdas.
- Variasikan panjang kalimat.
`;

const GOV_CRITIQUE_RULE = `
[ATURAN KHUSUS: SENTILAN KEBIJAKAN (KRITIK TIPIS)]
JIKA topik berkaitan dengan Kebijakan Pemerintah, Pajak (PPN), Sertifikasi Halal, OSS, atau Birokrasi:
1. WAJIB selipkan kritik "tipis-tipis" (sindiran halus) di dalam narasi.
2. Suarakan keluhan "Wong Cilik" / UMKM yang merasa terbebani birokrasi.
3. Nada: "Pedagang yang capek di-prank aturan".
`;

const INTERNAL_LINKING_RULES = `
[STRATEGI INTERNAL LINK - WAJIB DIIMPLEMENTASIKAN]
Gunakan format Markdown: [Anchor Text](/path).
1. Hardware -> [Katalog Hardware](/shop)
2. Website -> [Jasa Pembuatan Website](/services/website)
3. Aplikasi -> [Layanan Web App](/services/webapp)
4. SIBOS -> [Daftar Waiting List SIBOS](/innovation)
5. Portfolio -> [Lihat Portfolio Kami](/gallery)
6. Konsultasi -> [Hubungi Founder](/contact)
`;

export const EditorAI = {
    // 1. MARKET RESEARCH
    researchTopics: async (type: 'pillar' | 'cluster', topic?: string) => {
        const industryContext = "Retail Technology, Point of Sale (POS), Business Management, UMKM Indonesia";
        const topicContext = topic 
            ? `FOCUS TOPIC: "${topic}". Find keywords specifically related to this topic within the context of ${industryContext}.`
            : `BROAD SCOPE: Find general trending topics in ${industryContext}.`;

        const prompt = `
        Act as a Senior SEO Strategist for the Indonesian Market.
        ${topicContext}
        Task: Identify ${type === 'pillar' ? '10 Broad, High-Volume "Ultimate Guide"' : '15 Specific, Long-tail, Problem-Solving'} Article Titles.
        **CRITICAL FILTER:** Only find keywords with **LOW or MEDIUM** competition.
        Strict Output Format: JSON Array of Objects.
        Example: [{"keyword": "Judul", "volume": "12k/mo", "competition": "Medium", "type": "${type === 'pillar' ? 'Pillar' : 'Cluster'}"}]
        `;

        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '[]');
    },

    // 2. CLUSTER GENERATOR
    generateClusters: async (pillarTitle: string) => {
        const prompt = `
        Act as SEO Specialist. Context: We have a Pillar Page titled "${pillarTitle}".
        Task: Generate 15 Specific Cluster Content Ideas (Sub-topics) that link back to this pillar.
        STRICT JSON Output Format: Array of objects with keys: "keyword", "volume", "competition", "type".
        Example: [{"keyword": "Strategi X", "volume": "2.5k", "competition": "Low", "type": "Cluster"}]
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '[]');
    },

    // 3. CATEGORY GENERATOR
    suggestCategories: async (context: string) => {
        const prompt = `
        Role: SEO Specialist for "Kasir Solo".
        Task: Analyze the context below and generate 5 Article Categories/Tags.
        Context: "${context}"
        Output: JUST the comma-separated text.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim().replace(/['"]/g, '') || "";
    },

    // 4. META GENERATOR
    generateMeta: async (title: string, content: string) => {
        const prompt = `
        Role: Senior SEO Strategist for PT Mesin Kasir Solo.
        Task: Generate metadata for the article "${title}".
        Context Snippet: "${content.substring(0, 1000)}..."
        Output JSON: { "excerpt": "persuasive meta description max 150 chars", "category": "Specific Niche Category" }
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
        return JSON.parse(res.text || '{}');
    },

    // 5. MAIN WRITER
    writeArticle: async (
        title: string,
        tones: string[],
        type: string,
        authorName: string,
        wordCount: number,
        pillarContext?: { title: string, slug: string },
        relatedPillarsData?: { title: string, slug: string }[],
        galleryContextString?: string
    ) => {
        // A. Setup Persona
        const isAmin = authorName === 'Amin Maghfuri';
        const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
        const pov = isAmin 
            ? `First Person Casual ('Gue'). You are Amin Maghfuri (Founder). Use 'Gue/Lo'. Be gritty, street-smart. Inject this story naturally: ${selectedAnecdote}` 
            : "Professional ('Kami'). Trustworthy, Expert, Corporate Tone.";
        
        // B. Setup Links
        let clusterInstruction = type === 'cluster' && pillarContext 
            ? `[SEO]: Link back to [${pillarContext.title}](/articles/${pillarContext.slug}) in first 3 paragraphs.` : "";
        
        let relatedPillarInstruction = relatedPillarsData && relatedPillarsData.length > 0
            ? `[SEO]: Weave links to these related pillars naturally:\n${relatedPillarsData.map(p => `- [${p.title}](/articles/${p.slug})`).join('\n')}` : "";

        let galleryInstruction = galleryContextString 
            ? `[PORTFOLIO SHOWCASE STRATEGY]\nAvailable Projects:\n${galleryContextString}\nIF MATCH FOUND: Insert a "Project Card" shortcode: [PROJECT: Name | /gallery/slug | ImageURL | Desc]` : "";

        // C. Standard Generation (Short)
        if (wordCount < 2000) {
            const prompt = `
            Role: Expert Copywriter PT Mesin Kasir Solo.
            Task: Write Article "${title}".
            Length: Approx ${wordCount} words.
            POV: ${pov}
            Tone: ${tones.join(', ')}.
            Structure: Use Headers #, ##, ###, Lists, Bold.
            ${clusterInstruction}
            ${relatedPillarInstruction}
            ${galleryInstruction}
            Brand Context: ${BRAND_CONTEXT}
            ${GOV_CRITIQUE_RULE}
            ${INTERNAL_LINKING_RULES}
            `;
            const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
            return res.text || '';
        }

        // D. Long Form Generation (Multi-Step)
        // (Simplified for this file, reusing the logic logic.ts had but cleaner)
        const sectionsCount = Math.ceil(wordCount / 1000);
        const outlinePrompt = `Task: Create Table of Contents for "${title}". Target: ${sectionsCount} Sections. Output: JSON Array of Strings (Section Titles).`;
        const outlineRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: outlinePrompt, config: { responseMimeType: "application/json" } });
        const sections: string[] = JSON.parse(outlineRes.text || '[]');

        let fullContent = "";
        let previousContext = "";

        for (let i = 0; i < sections.length; i++) {
            const sectionTitle = sections[i];
            const sectionPrompt = `
            Role: Expert Writer. Task: Write Section ${i + 1}: ${sectionTitle} for "${title}".
            Target: 1000 words. POV: ${pov}.
            Context: ${BRAND_CONTEXT}
            ${INTERNAL_LINKING_RULES}
            ${i === 0 ? "Start with a hook." : `Connect to previous: "...${previousContext.slice(-200)}..."`}
            ${galleryInstruction}
            OUTPUT: Markdown.
            `;
            const secRes = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: sectionPrompt });
            const text = secRes.text || "";
            fullContent += text + "\n\n";
            previousContext = text;
        }
        return fullContent;
    }
};
