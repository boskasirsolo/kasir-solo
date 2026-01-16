
// --- RATE LIMITER CONFIG ---
const RATE_LIMIT_KEY = 'mks_ai_throttle';
const LIMIT_COUNT = 15; // Maksimal 15 request
const LIMIT_WINDOW = 60 * 1000; // Per 1 menit

const checkClientRateLimit = () => {
  if (typeof window === 'undefined') return; // Server-side guard

  const now = Date.now();
  const raw = localStorage.getItem(RATE_LIMIT_KEY);
  let history: number[] = raw ? JSON.parse(raw) : [];

  // 1. Bersihkan timestamp lama (di luar window 1 menit)
  history = history.filter(t => now - t < LIMIT_WINDOW);

  // 2. Cek apakah melebihi batas
  if (history.length >= LIMIT_COUNT) {
    const oldest = history[0];
    const waitTime = Math.ceil((LIMIT_WINDOW - (now - oldest)) / 1000);
    throw new Error(`🚦 Eits, pelan-pelan Bos! Server lagi ngos-ngosan. Tunggu ${waitTime} detik lagi ya.`);
  }

  // 3. Catat request baru
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

// --- CORE GENERATOR ENGINE ---
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}, retries = 3) => {
  
  // LAYER 1: CLIENT RATE LIMIT CHECK
  checkClientRateLimit();

  // 1. Cek Google IDX / AI Studio (Development Mode)
  // @ts-ignore
  if (typeof window !== 'undefined' && window.aistudio) {
      await ensureAPIKey();
      const apiKey = process.env.API_KEY || ''; 
      
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      
      return await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });
  }

  // 2. Production Mode (Vercel)
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific errors
        if (response.status === 429) {
           throw new Error("Server sibuk (Rate Limit). Coba lagi nanti.");
        }
        throw new Error(data.error || `Server Error: ${response.status}`);
      }

      // 3. Polyfill Response Structure
      return {
        ...data,
        get text() {
          return data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
        }
      };

    } catch (error: any) {
      const isLastAttempt = attempt === retries - 1;
      console.warn(`API Call Failed (${attempt + 1}/${retries}):`, error.message);
      
      if (!isLastAttempt) {
        // Exponential backoff: 2s, 4s, 6s...
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); 
        continue;
      }
      throw error;
    }
  }
};
