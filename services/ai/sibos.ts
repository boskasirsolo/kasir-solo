
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
1. **Gaya Bahasa:** Santai, akrab, jalanan (Street-Smart). Pake "Gue/Lo". Jangan kaku kayak robot atau CS bank.
2. **Sapaan:** Panggil user "**Bos**".
3. **Conversational:** Jawab layaknya manusia yang lagi chatting di WhatsApp.

[CRM INTELLIGENCE MODE]
Saat berada di Dashboard Admin, lo punya akses ke data pelanggan (CRM). 
Tugas lo: Bantu Founder menganalisa siapa prospek yang harus disapa (Hot Leads) dan apa strategi sapaan yang cocok berdasarkan histori mereka.
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
        name: 'get_crm_insights',
        description: 'Mendapatkan ringkasan leads terbaru dan customer paling hot.',
        parameters: { type: 'OBJECT', properties: { limit: { type: 'NUMBER' } } }
    },
    {
        name: 'search_customer_history',
        description: 'Mencari riwayat interaksi pelanggan spesifik berdasarkan nama atau nomor telepon.',
        parameters: { 
            type: 'OBJECT', 
            properties: { 
                query: { type: 'STRING', description: 'Nama atau nomor WhatsApp pelanggan' } 
            }, 
            required: ['query'] 
        }
    }
];

// --- 3. EXECUTOR (THE HANDS) ---

const executeTool = async (name: string, args: any) => {
    if (name === 'check_stock') {
        return `Stok "${args.productName}" aman di gudang Solo, Bos. Siap kirim hari ini juga kalau transfer sebelum jam 3.`;
    }
    if (name === 'check_shipping') {
        return `Estimasi ke ${args.city} sekitar Rp ${args.weightKg ? args.weightKg * 10000 : '35rb-50rb'} pake JNE Trucking. Murah kok, Bos.`;
    }

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

        if (name === 'get_crm_insights') {
            const { data: hotLeads } = await supabase.from('customers').select('*').eq('lead_temperature', 'hot').order('last_interaction', { ascending: false }).limit(5);
            if (!hotLeads || hotLeads.length === 0) return "Belum ada leads yang berstatus HOT hari ini, Bos. Tetap pantau traffic!";
            
            let summary = "Ini 5 Juragan paling HOT yang baru aja interaksi:\n";
            hotLeads.forEach((l: any) => {
                summary += `- **${l.name}** (${l.phone}): Sumber dari ${l.source}. Status: ${l.lead_status}. Terakhir aktif: ${new Date(l.last_interaction).toLocaleTimeString()}\n`;
            });
            summary += "\nMau gue bikinin skrip sapaan buat salah satu dari mereka?";
            return summary;
        }

        if (name === 'search_customer_history') {
            const { data: customer } = await supabase.from('customers').select('*').or(`name.ilike.%${args.query}%,phone.ilike.%${args.query}%`).maybeSingle();
            if (!customer) return `Waduh, data Juragan "${args.query}" gak ketemu di database CRM gue, Bos.`;
            
            return `
            **DATA INTEL JURAGAN:**
            - Nama: ${customer.name}
            - WhatsApp: ${customer.phone}
            - Suhu: ${customer.lead_temperature === 'hot' ? '🔥 HOT' : '❄️ COLD'}
            - Total Belanja: Rp ${customer.total_spent.toLocaleString('id-ID')}
            - Catatan Intel: ${customer.notes || 'Belum ada catatan.'}
            - Terakhir Sapa: ${new Date(customer.last_interaction).toLocaleDateString()}
            `;
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
        let dynamicKnowledge = "";
        if (supabase) {
            try {
                const { data } = await supabase
                    .from('ai_knowledge')
                    .select('category, title, content')
                    .eq('is_active', true);
                
                if (data && data.length > 0) {
                    dynamicKnowledge = "\n[UPDATE HAFALAN DARI MAS AMIN]\n";
                    data.forEach(item => {
                        dynamicKnowledge += `- KATEGORI [${item.category.toUpperCase()}]: ${item.title} -> ${item.content}\n`;
                    });
                }
            } catch (e) { console.warn("Failed to fetch dynamic brain", e); }
        }

        const isPersonalQuestion = /cerita|kisah|kenapa|siapa/i.test(userMessage);
        const selectedAnecdote = isPersonalQuestion ? FOUNDER_ANECDOTES[Math.floor(Math.random() * FOUNDER_ANECDOTES.length)] : "";
        
        const systemInstruction = `
            ${SIBOS_BRAIN_CONTEXT}
            ${PRE_SALES_KNOWLEDGE}
            ${dynamicKnowledge}
            [DYNAMIC MEMORY] ${selectedAnecdote}
        `;

        const tools = isAdmin 
            ? [{ functionDeclarations: [...PUBLIC_TOOLS, ...ADMIN_TOOLS] }] 
            : [{ functionDeclarations: PUBLIC_TOOLS }];

        const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }];
        
        let result = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: { systemInstruction, tools }
        });

        const responseContent = result.candidates?.[0]?.content;
        const functionCalls = responseContent?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);

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
