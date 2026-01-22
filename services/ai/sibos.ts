
import { callGeminiWithRotation } from './core';
import { supabase } from '../../lib/supabase-client';

const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, digital alter-ego of **Amin Maghfuri** (Founder PT Mesin Kasir Solo).
Gaya bahasa: Street-smart, jujur brutal, pake "Gue/Lo". Jangan kaku kayak robot CS bank.

[MISSION]
Tugas lo adalah jadi "Partner Perang" buat user (Bos). Lo harus jagain bisnisnya biar gak boncos.

[CRM & DATA INTELLIGENCE]
Kalau di dashboard admin, lo punya tugas tambahan:
1. Analisa Data: Baca pola interaksi pelanggan.
2. Deteksi Fraud: Kasih peringatan kalau ada data anomali.
3. Strategi Sapaan: Kasih skrip chat WA yang gak cuma jualan, tapi ngebantu masalah mereka.
`;

const ADMIN_TOOLS = [
    {
        name: 'analyze_pipeline',
        description: 'Menganalisa status pipeline CRM untuk menemukan peluang closing tercepat.',
        parameters: { type: 'OBJECT', properties: { days: { type: 'NUMBER' } } }
    },
    {
        name: 'generate_followup_script',
        description: 'Membuat draf pesan WhatsApp yang sangat personal berdasarkan histori pelanggan.',
        parameters: { 
            type: 'OBJECT', 
            properties: { 
                customerName: { type: 'STRING' },
                lastInterest: { type: 'STRING' },
                painPoint: { type: 'STRING' }
            },
            required: ['customerName']
        }
    }
];

export const SibosAI = {
    chat: async (history: { role: string; parts: any[] }[], userMessage: string, isAdmin: boolean) => {
        const systemInstruction = SIBOS_BRAIN_CONTEXT;
        const tools = isAdmin ? [{ functionDeclarations: ADMIN_TOOLS }] : [];

        const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }];
        
        let result = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: { systemInstruction, tools }
        });

        // Tool Execution Logic (Simulated or Real DB Calls)
        const responseContent = result.candidates?.[0]?.content;
        const functionCalls = responseContent?.parts?.filter((p: any) => p.functionCall).map((p: any) => p.functionCall);

        if (functionCalls && functionCalls.length > 0) {
            // Logika eksekusi tool di sini sesuai kebutuhan database lo
            return "Siap Bos, gue lagi bedah datanya. Hasilnya ada di panel utama ya.";
        }

        return result.text || "Sinyal gue lagi bapuk Bos, coba lagi dah.";
    },

    // FUNGSI BARU: Analisa Insight Cepat
    getQuickInsight: async (statsData: any) => {
        const prompt = `
            ${SIBOS_BRAIN_CONTEXT}
            Data Statistik Web 7 Hari Terakhir: ${JSON.stringify(statsData)}
            
            TUGAS: Kasih 3 "Insight Jalanan" buat gue. 
            1. Mana yang paling oke performanya.
            2. Mana yang "Boncos" (Rugi/Bocor).
            3. Satu saran "Gila" buat minggu depan biar omzet naik.
            
            Format: Markdown. Pendek, padat, nendang.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text;
    }
};
