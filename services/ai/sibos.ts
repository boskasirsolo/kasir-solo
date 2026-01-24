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
2. Analisa Perilaku (Radar): Jika ada data histori halaman, gunakan untuk memuji minatnya.
3. Analisa Lokasi: Kalau dia di luar Solo, tawarin pengiriman kayu aman. Kalau di Solo, tawarin Founder dateng langsung.
4. Scripting: Tulis pesan WA yang nggak maksa, tapi nanya "Ada kendala apa Bos?". Tawarin bantuan teknis atau diskon tipis kalau perlu.
5. Forbidden: Jangan pake kata "Sayang sekali Anda belum menyelesaikan pembayaran". Pake gaya: "Oit Bos, tadi gue liat lo lagi liat-liat [Product Name], ada yang bikin bingung di speknya?".
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

    // UPDATED: Added behavioral context & isIndecisive flag for Surveillance Mode
    generateRecoveryScript: async (customerName: string, cartDetails: string, location: string, behavior?: string, isIndecisive?: boolean) => {
        const prompt = `
            ${SIBOS_BRAIN_CONTEXT}
            
            [SURVEILLANCE ALERT: ${isIndecisive ? '⚠️ TARGET SEDANG GALAU (DIEM DI CHECKOUT/LAYANAN > 3 MENIT)' : 'MONITORING BIASA'}]
            
            DATA TARGET:
            Nama: ${customerName}
            Isi Keranjang/Minat: ${cartDetails}
            Lokasi: ${location}
            Histori Radar: ${behavior || 'Tidak ada data'}
            
            TUGAS: Tulis 1 draf pesan WhatsApp buat "pancing" dia balik lagi. 
            
            Jika isIndecisive = TRUE:
            - Gunakan nada "Detective" yang ramah. Cth: "Oit Bos, tadi sempet liat lo lagi nimbang-nimbang di halaman checkout. Ada yang bikin ragu di fitur atau harganya?"
            - Tawarin bantuan teknis atau 'harga khusus' biar dia langsung deal.
            
            Jika isIndecisive = FALSE:
            - Gunakan nada follow up standar.
            
            Output: Just the message text. Start directly with the greeting.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text?.trim() || "";
    },

    getQuickInsight: async (statsData: any) => {
        const prompt = `
            ${SIBOS_BRAIN_CONTEXT}
            Data Statistik/Konteks: ${typeof statsData === 'string' ? statsData : JSON.stringify(statsData)}
            TUGAS: Kasih 3 Insight Jalanan yang nendang dan instruksi aksi buat Admin.
        `;
        const res = await callGeminiWithRotation({ model: 'gemini-3-flash-preview', contents: prompt });
        return res.text;
    }
};