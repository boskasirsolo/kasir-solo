
import { GoogleGenAI } from "@google/genai";

// --- RATE LIMITER CONFIG ---
const RATE_LIMIT_KEY = 'mks_ai_throttle';
const LIMIT_COUNT = 20; 
const LIMIT_WINDOW = 60 * 1000;

const checkClientRateLimit = () => {
  if (typeof window === 'undefined') return;
  const now = Date.now();
  const raw = localStorage.getItem(RATE_LIMIT_KEY);
  let history: number[] = raw ? JSON.parse(raw) : [];
  history = history.filter(t => now - t < LIMIT_WINDOW);
  if (history.length >= LIMIT_COUNT) {
    const oldest = history[0];
    const waitTime = Math.ceil((LIMIT_WINDOW - (now - oldest)) / 1000);
    throw new Error(`🚦 Sabar Bos, AI lagi ngatur napas. Tunggu ${waitTime} detik lagi.`);
  }
  history.push(now);
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(history));
};

// --- API KEY MANAGEMENT ---
export const ensureAPIKey = async () => {
  try {
    // @ts-ignore
    if (window.aistudio) {
      // @ts-ignore
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
         // @ts-ignore
         await window.aistudio.openSelectKey();
      }
      return true;
    }
  } catch (e) {
    console.warn("AIStudio check failed", e);
  }
  return false;
};

/**
 * CORE GENERATOR ENGINE
 * Berbasis instruksi teknis terbaru: Menggunakan process.env.API_KEY secara eksklusif.
 */
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}, retries = 3) => {
  
  checkClientRateLimit();

  // Pastikan API Key tersedia (IDX/Vercel handling)
  if (!process.env.API_KEY) {
      // Trigger dialog jika di IDX dan belum ada key
      await ensureAPIKey();
  }

  // Inisialisasi sesuai Guideline
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

  // EXECUTION WITH RETRY
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Gunakan generateContent secara langsung dari ai.models
      const result = await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });

      return result;

    } catch (error: any) {
      const isLastAttempt = attempt === retries - 1;
      
      // Handle race conditions or temporary network issues
      if (isLastAttempt) {
          console.error("Gemini API Error:", error);
          throw new Error(`Gemini Gagal: ${error.message || 'Unknown error'}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); 
    }
  }
};
