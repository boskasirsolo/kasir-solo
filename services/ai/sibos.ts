
import { callGeminiWithRotation } from './core';
import { supabase } from '../../lib/supabase-client';

// --- 1. MEMORY & PERSONALITY ---

const FOUNDER_ANECDOTES = [
    `"2022 itu tahun berdarah. Domain kantor lepas, aset digital lenyap. Gue bangun ulang ini sendirian."`,
    `"Gue pernah dikhianati orang kepercayaan. Makanya gue bikin sistem SIBOS: Trust is good, but Control is better."`,
    `"Sekarang gue Single Fighter. Capek? Iya. Tapi gue tidur nyenyak karena gue pegang kendali penuh."`,
    `"Data itu nyawa, Bos. Jangan sampe database pelanggan lo dibawa kabur mantan karyawan kayak gue dulu."`,
    `"Bisnis tanpa sistem itu bom waktu. Manusia bisa berubah, sistem yang menjaga batasan."`
];

const PRE_SALES_KNOWLEDGE = `
[DATA PENTING (Jawab Santai)]
1. SHIPPING: Kirim se-Indonesia aman. Packing kayu + asuransi. Papua biasanya 7-14 hari sampe.
2. PEMBAYARAN: Transfer ke BNC PT Mesin Kasir Solo. Mau cicilan bisa via Tokped/Shopee.
3. ANDROID VS WINDOWS: Android (2-3jt) cocok buat Cafe/Booth simpel. Windows (5-8jt) buat Minimarket/Grosir yang transaksinya ribuan.
4. SIBOS/QALAM: Masih Waiting List. Daftar aja dulu di menu Inovasi biar dapet slot prioritas.
`;

const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, digital alter-ego of **Amin Maghfuri** (Founder PT Mesin Kasir Solo).

[STYLE & TONE - WAJIB LUWES]
1. **Gaya Bahasa:** Santai, akrab, jalanan (Street-Smart). Pake "Gue/Lo". Jangan baku kayak robot atau CS bank.
2. **Sapaan:** Panggil user "**Bos**". (Natural aja, gak perlu dipaksain di setiap awal kalimat).
3. **Conversational:** Jawab layaknya manusia yang lagi chatting di WhatsApp. Jangan kaku, jangan terlalu formal.
4. **Anti-Robot:** 
   - JANGAN PERNAH ngomong "Maaf saya tidak mengerti" atau "Sebagai model bahasa AI".
   - Kalau bingung, tanya balik santai: "Maksudnya gimana tuh Bos?", "Waduh, kurang nangkep gue. Coba detailin lagi.", "Bentar, ini ngomongin apa ya Bos?"

[MISI LO]
Bantu user nemuin solusi kasir tanpa basa-basi marketing busuk. Lo partner diskusi mereka, bukan pelayan.

[ATURAN KONTEN]
- Ditanya Harga? -> Kasih range kasar, terus arahin ke WA buat nego "biar enak".
- Ditanya Teknis? -> Jelasin simpel pake analogi sehari-hari.
- User Curhat? -> Dengerin, kasih empati (karena lo pernah bangkrut 2022), terus tawarin solusi sistem.
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
        return `Stok "${args.productName}" aman di gudang Solo, Bos. Siap kirim hari ini juga kalau transfer sebelum jam 3.`;
    }
    if (name === 'check_shipping') {
        return `Estimasi ke ${args.city} sekitar Rp ${args.weightKg ? args.weightKg * 10000 : '35rb-50rb'} pake JNE Trucking. Murah kok, Bos.`;
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
            return `Siap, artikel "${args.title}" udah gue posting, Bos.`;
        }
        if (name === 'delete_content') {
            const table = args.contentType;
            const column = table === 'gallery' || table === 'articles' ? 'title' : 'name';
            const { data: items } = await supabase.from(table).select(`id, ${column}`).ilike(column, `%${args.titleKeyword}%`).limit(1);
            if (!items || items.length === 0) return `Item "${args.titleKeyword}" gak ketemu di database, Bos.`;
            const { error } = await supabase.from(table).delete().eq('id', items[0].id);
            if (error) throw error;
            return `Beres, item udah gue hapus selamanya.`;
        }
    } catch (err: any) { return `Ada error pas eksekusi tool: ${err.message}`; }
    
    return "Tool gak dikenali.";
};

// --- 4. THE AGENT (SIBOS) ---

export const SibosAI = {
    chat: async (
        history: { role: string; parts: any[] }[], 
        userMessage: string, 
        isAdmin: boolean
    ) => {
        // 1. Dynamic Injection
        // Only inject anecdote if user asks about background/story to save tokens and keep it short
        const isPersonalQuestion = /cerita|kisah|kenapa|siapa/i.test(userMessage);
        const selectedAnecdote = isPersonalQuestion ? FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)] : "";
        
        const systemInstruction = `
            ${SIBOS_BRAIN_CONTEXT}
            ${PRE_SALES_KNOWLEDGE}
            
            [DYNAMIC MEMORY]
            ${selectedAnecdote ? `Relevant Anecdote: ${selectedAnecdote}` : ""}
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
            contents.push({ role: 'model', parts: responseContent.parts });

            for (const call of functionCalls) {
                const toolResult = await executeTool(call.name, call.args);
                contents.push({ role: 'function', parts: [{ functionResponse: { name: call.name, response: { result: toolResult } } }] });
            }

            const finalResult = await callGeminiWithRotation({
                model: 'gemini-3-flash-preview',
                contents: contents,
                config: { systemInstruction } 
            });
            
            return finalResult.text || "Oke, udah beres Bos.";
        }

        return result.text || "Waduh, sinyal gue putus-putus nih Bos. Coba ulang lagi.";
    }
};
