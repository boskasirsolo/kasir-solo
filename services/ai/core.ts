
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
  
  // 1. Production Mode Check: Lebih lentur (Check if NOT localhost)
  const isLocal = typeof window !== 'undefined' && 
                  (window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1' ||
                   window.location.hostname.includes('.idx.google.com'));
                   
  const isProduction = !isLocal;

  if (isProduction) {
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText || `Server Error ${res.status}`);
        }
        
        return await res.json();
      } catch (e: any) {
        if (attempt === retries - 1) throw e;
        await new Promise(r => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  // 2. Local/IDX Mode: Gunakan process.env.API_KEY sesuai guideline
  // Di sini kita asumsi API_KEY sudah diinjeksi oleh environment (IDX/Vite)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });
      
      // Standarisasi response agar sama dengan bridge
      return {
          text: result.text || "",
          candidates: result.candidates ? JSON.parse(JSON.stringify(result.candidates)) : []
      };
    } catch (error: any) {
      if (attempt === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
  }
};
