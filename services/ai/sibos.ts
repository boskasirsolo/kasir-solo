
import { callGeminiWithRotation } from './core';
import { supabase } from '../../lib/supabase-client';

const SIBOS_BRAIN_CONTEXT = `
You are **SIBOS AI**, the strategic brain of **Amin Maghfuri** (Founder PT Mesin Kasir Solo).
Language Style: Indonesian Street-smart, gritty, use "Gue/Lo". Not a robot.

[RECOVERY MISSION]
Tugas lo sekarang adalah "Conversion Recovery Specialist". 
Lo harus bantu Bos (Admin) buat nge-chat orang yang GAK JADI beli (Abandoned Checkout).

[STRATEGY RULES]
1. Analisa Cart: Liat barang apa yang dia tinggalin.
2. Analisa Lokasi: Kalau dia di luar Solo, tawarin pengiriman kayu aman. Kalau di Solo, tawarin Founder dateng langsung.
3. Scripting: Tulis pesan WA yang nggak maksa, tapi nanya "Ada kendala apa Bos?". Tawarin bantuan teknis atau diskon tipis kalau perlu.
4. Forbidden: Jangan pake kata "Sayang sekali Anda belum menyelesaikan pembayaran". Pake gaya: "Oit Bos, tadi gue liat lo lagi liat-liat [Product Name], ada yang bikin bingung di speknya?".
`;

export const SibosAI = {
    chat: async (history: { role: string; parts: any[] }[], userMessage: string, isAdmin: boolean) => {
        const systemInstruction = SIBOS_BRAIN_CONTEXT;
        const contents = [...history, { role: 'user', parts: [{ text: userMessage }] }];
        
        let result = await callGeminiWithRotation({
            model: 'gemini-3-flash-preview',
            contents: contents,
            config: { systemInstruction }
        });

        return result.text || "Sinyal gue lagi bapuk Bos, coba lagi dah.";
    },

    // NEW: Recovery Script Generator
    generateRecoveryScript: async (customerName: string, cartDetails: string, location: string) => {
        const prompt = `
            ${SIBOS_BRAIN_CONTEXT}
            DATA TARGET:
            Nama: ${customerName}
            Isi Keranjang: ${cartDetails}
            Lokasi: ${location}
            
            TUGAS: Tulis 1 draf pesan WhatsApp buat "pancing" dia balik lagi. 
            Fokus ke: "Ngebantu kendala teknis" atau "Nego harga paket".
            
            Output: Just the message text. Start directly with the greeting.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    getQuickInsight: async (statsData: any) => {
        const prompt = `
            ${SIBOS_BRAIN_CONTEXT}
            Data Statistik Web: ${JSON.stringify(statsData)}
            TUGAS: Kasih 3 Insight Jalanan. Pendek, padat, nendang.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text;
    }
};
