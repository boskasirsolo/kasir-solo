
// --- RATE LIMITER CONFIG ---
const RATE_LIMIT_KEY = 'mks_ai_throttle';
const LIMIT_COUNT = 20; // Kasih longgar dikit
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

// --- CORE GENERATOR ENGINE ---
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}, retries = 3) => {
  
  checkClientRateLimit();

  // 1. AI Studio Mode (IDX environment / Local Dev)
  // @ts-ignore
  if (typeof window !== 'undefined' && window.aistudio) {
      await ensureAPIKey();
      const { GoogleGenAI } = await import("@google/genai");
      // Use the injected API_KEY or GEMINI_API_KEY_1 as fallback
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || process.env.GEMINI_API_KEY_1 || '' });
      return await ai.models.generateContent(params);
  }

  // 2. Production Mode (Fetch through Vercel API bridge)
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) throw new Error("Rate Limit Tercapai.");
        throw new Error(data.details || data.error || "Server Error");
      }

      return {
        ...data,
        get text() {
          return data.text || "";
        }
      };

    } catch (error: any) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); 
    }
  }
};
