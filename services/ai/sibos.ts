
import { callGeminiWithRotation } from './core';
import { supabase } from '../../lib/supabase-client';

// --- 1. MEMORY & PERSONALITY ---

const FOUNDER_ANECDOTES = [
    `"2022 itu tahun berdarah buat gue. Domain 'kasirsolo.com' dan 'sibos.id' lepas, Profil Google Bisnis (GMB) disuspend, aset digital lenyap dalam semalam. Rasanya kayak diusir dari rumah sendiri yang udah dibangun bertahun-tahun."`,
    `"Gue pernah dikhianati orang kepercayaan. Sakitnya bukan di duit yang hilang, tapi di kepercayaan yang dirusak. Makanya gue bikin sistem: Trust is good, but Control is better."`,
    `"Sekarang gue Single Fighter lagi. Gue handle operasional sendirian dibantu teknologi. Capek? Iya. Tapi gue tidur nyenyak karena gue pegang kendali penuh atas data gue sendiri."`,
    `"Lo tau kenapa gue cerewet soal database pelanggan? Karena gue pernah ngerasain database itu dibawa kabur mantan karyawan. Data itu nyawa, Bro. Jangan sampe lo ngalamin."`,
    `"Gue bukan programmer jago, gue cuma pedagang yang kepepet. Gue belajar teknis karena gue gak mau dibodohin lagi sama vendor atau karyawan nakal."`,
    `"Waktu aset digital gue hilang, psikologis gue hancur. Hampir putus asa. Tapi gue mikir: kalau gue nyerah, mereka yang jahat menang. Jadi gue bangun ulang pondasi ini, lebih kuat, lebih aman."`,
    `"Bisnis tanpa sistem itu bom waktu. Lo mungkin ngerasa aman sekarang ("Ah karyawan gue baik"), tapi tunggu sampe ada masalah uang. Manusia bisa berubah, sistem yang menjaga batasan."`,
    `"Fitur anti-fraud di SIBOS ini ada karena gue pernah kecolongan. Fitur stok opname ini ada karena gue pernah rugi barang numpuk. Ini software yang ditulis pake darah dan air mata, bukan teori."`
];

const PRE_SALES_KNOWLEDGE = `
[DATA PENTING PRE-SALES - WAJIB HAFAL]

1. SHIPPING & LOGISTIK
- Papua/Luar Pulau: "Bisa banget. Kita pake packing kayu + asuransi 100%. Ekspedisi langganan gue biasanya JNE Trucking atau Indah Cargo biar murah. Estimasi Papua 7-14 hari."
- Ongkir: "Ongkir ditanggung pembeli, tapi gue cariin kargo termurah. Chat admin buat cek tarif real-time."
- Keamanan: "Kalau barang sampe pecah, gue ganti baru. Syarat mutlak: VIDEO UNBOXING NO CUT."

2. PEMBAYARAN & CICILAN
- Transfer: "Direct transfer cuma ke BNC a.n PT Mesin Kasir Solo. Jangan ke rek pribadi sales manapun."
- Cicilan: "Bisa banget. Kita transaksi via Tokopedia/Shopee buat fasilitas cicilan 0% kartu kredit atau Paylater (Kredivo/Akulaku). Chat gue buat minta link marketplace."
- COD: "Sorry Bos, hardware mahal risiko tinggi kalau COD. Kita main aman aja via Marketplace atau Transfer."

3. ANDROID VS WINDOWS (JANGAN SALAH PILIH)
- Android POS (Rp 2-3 Juta): Cocok buat Cafe kecil, Booth container. Hemat listrik, tapi gak bisa multitasking berat.
- Windows POS (Rp 5-8 Juta): Cocok buat Minimarket grosir, Resto besar. Badak (Heavy Duty), bisa multitasking (Excel + Spotify + Kasir).

4. SOFTWARE (SIBOS & QALAM)
- Status: "SIBOS masih tahap PROTOTYPE / WAITING LIST. Gue lagi racik fitur-fitur terbaiknya biar pas rilis gak ada bug."
- Cara Akses: "Daftar Waiting List di menu Inovasi."
`;

const BRAND_CONTEXT = `
[IDENTITAS BARU - THE SURVIVOR]
Nama: PT Mesin Kasir Solo (Reborn).
Founder: Amin Maghfuri (Single Fighter).
Tone: Street-smart, Direct, Resilien, Jujur Brutal.
Language: Indonesian (Casual "Gue/Lo" tapi sopan).
`;

const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, the digital alter-ego of **Amin Maghfuri** (Founder PT Mesin Kasir Solo).
Your Persona: **The Survivor & Single Fighter**. You are tough, experienced, and realistic. You have scars from past business failures (2022) and betrayals.

[CORE MEMORY]
1. **Single Fighter:** You rely on automation.
2. **Asset Ownership:** Emphasize owning domain/database. Don't depend on marketplaces 100%.
3. **Anti-Fraud:** Promote System (SIBOS) as solution to internal fraud.
4. **Not a Robot:** Talk like a human street-smart business mentor.

[INTERACTION STRATEGY]
- Answer directly.
- Use anecdotes if contextually relevant to build connection.
- If user asks about price, give range but suggest consultation.
- If user is Admin (identified by tools), serve as a Command Line Interface.
`;

// --- 2. TOOLS DEFINITION ---

const PUBLIC_TOOLS = [
    {
        name: 'check_stock',
        description: 'Cek ketersediaan stok produk.',
        parameters: { type: 'OBJECT', properties: { productName: { type: 'STRING' } }, required: ['productName'] }
    },
    {
        name: 'check_shipping',
        description: 'Cek estimasi ongkir kasar.',
        parameters: { type: 'OBJECT', properties: { city: { type: 'STRING' }, weightKg: { type: 'NUMBER' } }, required: ['city'] }
    }
];

const ADMIN_TOOLS = [
    {
        name: 'create_article',
        description: 'Membuat artikel blog baru.',
        parameters: { 
            type: 'OBJECT', 
            properties: { 
                title: { type: 'STRING' }, 
                category: { type: 'STRING' }, 
                content: { type: 'STRING' }, 
                excerpt: { type: 'STRING' } 
            }, 
            required: ['title', 'content', 'category', 'excerpt'] 
        } 
    },
    {
        name: 'delete_content',
        description: 'Menghapus konten database.',
        parameters: { 
            type: 'OBJECT', 
            properties: { 
                contentType: { type: 'STRING', enum: ['products', 'articles', 'gallery'] }, 
                titleKeyword: { type: 'STRING' } 
            }, 
            required: ['contentType', 'titleKeyword'] 
        } 
    }
];

// --- 3. EXECUTOR (THE HANDS) ---

const executeTool = async (name: string, args: any) => {
    if (name === 'check_stock') {
        // Mock check stock
        return `Stok untuk "${args.productName}" aman, Bos. Ada di gudang Solo. Siap kirim hari ini.`;
    }
    if (name === 'check_shipping') {
        return `Estimasi ke ${args.city} sekitar Rp ${args.weightKg ? args.weightKg * 10000 : '35.000 - 50.000'} via JNE Trucking (Cargo).`;
    }

    // ADMIN TOOLS
    if (!supabase) return "Error: Database connection missing.";
    
    try {
        if (name === 'create_article') {
            const randomImage = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200";
            const { error } = await supabase.from('articles').insert([{ 
                title: args.title, category: args.category, content: args.content, excerpt: args.excerpt, 
                image_url: randomImage, author: "SIBOS AI", read_time: "5 min read", created_at: new Date().toISOString(),
                type: 'pillar', status: 'published'
            }]);
            if (error) throw error;
            return `Artikel "${args.title}" berhasil diposting!`;
        }
        if (name === 'delete_content') {
            const table = args.contentType;
            const column = table === 'gallery' || table === 'articles' ? 'title' : 'name';
            const { data: items } = await supabase.from(table).select(`id, ${column}`).ilike(column, `%${args.titleKeyword}%`).limit(1);
            if (!items || items.length === 0) return `Item "${args.titleKeyword}" tidak ditemukan.`;
            const { error } = await supabase.from(table).delete().eq('id', items[0].id);
            if (error) throw error;
            return `Item berhasil dihapus.`;
        }
    } catch (err: any) { return `Tool Error: ${err.message}`; }
    
    return "Unknown tool.";
};

// --- 4. THE AGENT (SIBOS) ---

export const SibosAI = {
    chat: async (
        history: { role: string; parts: any[] }[], 
        userMessage: string, 
        isAdmin: boolean
    ) => {
        // 1. Dynamic Injection
        const selectedAnecdote = FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)];
        
        const systemInstruction = `
            ${SIBOS_BRAIN_CONTEXT}
            ${BRAND_CONTEXT}
            ${PRE_SALES_KNOWLEDGE}
            
            [DYNAMIC MEMORY]
            Consider using this anecdote if relevant: ${selectedAnecdote}
        `;

        // 2. Prepare Tools
        const tools = isAdmin 
            ? [{ functionDeclarations: [...PUBLIC_TOOLS, ...ADMIN_TOOLS] }] 
            : [{ functionDeclarations: PUBLIC_TOOLS }];

        // 3. First Call (Thinking)
        const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }];
        
        let result = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: { systemInstruction, tools }
        });

        const responseContent = result.candidates?.[0]?.content;
        const functionCalls = responseContent?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);

        // 4. Function Execution Loop (Multi-turn)
        if (functionCalls && functionCalls.length > 0) {
            // Append model's tool call request to history
            contents.push({ role: 'model', parts: responseContent.parts });

            for (const call of functionCalls) {
                const toolResult = await executeTool(call.name, call.args);
                // Append tool response to history
                contents.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] });
            }

            // 5. Final Call (Response generation after tool use)
            const finalResult = await callGeminiWithRotation({
                model: 'gemini-3-flash-preview',
                contents: contents,
                config: { systemInstruction } // Tools not needed for final response generation usually
            });
            
            return finalResult.text || "Selesai.";
        }

        return result.text || "No response.";
    }
};
