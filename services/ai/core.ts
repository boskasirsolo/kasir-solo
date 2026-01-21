
// --- RATE LIMITER CONFIG ---
const RATE_LIMIT_KEY = 'mks_ai_throttle';
const LIMIT_COUNT = 15; 
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
    throw new Error(`🚦 Eits, pelan-pelan Bos! Server lagi ngos-ngosan. Tunggu ${waitTime} detik lagi ya.`);
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

  // 1. AI Studio Mode
  // @ts-ignore
  if (typeof window !== 'undefined' && window.aistudio) {
      await ensureAPIKey();
      const apiKey = process.env.API_KEY || ''; 
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      return await ai.models.generateContent(params);
  }

  // 2. Production Mode
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) throw new Error("Rate Limit.");
        throw new Error(data.error || "Server Error");
      }

      // Sempurnakan pengambilan text dari response
      return {
        ...data,
        get text() {
          const parts = data.candidates?.[0]?.content?.parts || [];
          return parts
            .map((p: any) => p.text || '')
            .filter(Boolean)
            .join('');
        }
      };

    } catch (error: any) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); 
    }
  }
};
