
import { GoogleGenAI } from "@google/genai";

// --- API KEY MANAGEMENT (IDX/Local Only) ---
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
 * Cerdas: Pakai bridge di production, pakai direct key di development/IDX.
 */
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}, retries = 2) => {
  
  // 1. Production Mode: Gunakan Bridge Vercel (Tempat rotasi 7 key lo berada)
  const isProduction = typeof window !== 'undefined' && 
                       (window.location.hostname === 'kasirsolo.my.id' || 
                        window.location.hostname.includes('vercel.app'));

  if (isProduction) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
      } catch (e) {
        if (attempt === retries - 1) throw e;
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }

  // 2. Local/IDX Mode: Gunakan process.env.API_KEY sesuai guideline
  if (!process.env.API_KEY) {
      await ensureAPIKey();
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });
      return result;
    } catch (error: any) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
  }
};
