
import { GoogleGenAI } from "@google/genai";
import { getEnv } from '../config/env';

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

// --- CENTRALIZED API CALLER ---
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}) => {
  let selectedKey = '';
  // @ts-ignore
  const isAIStudio = typeof window !== 'undefined' && window.aistudio;

  if (isAIStudio) {
      await ensureAPIKey();
      selectedKey = process.env.API_KEY || '';
  } else {
      const keys: string[] = [];
      for (let i = 1; i <= 10; i++) {
          const k = getEnv(`VITE_GEMINI_API_KEY_${i}`) || getEnv(`VITE_API_KEY_${i}`);
          if (k && k.length > 10) keys.push(k);
      }
      const kSingle = getEnv('VITE_GEMINI_API_KEY') || getEnv('VITE_API_KEY') || getEnv('API_KEY');
      if (kSingle && kSingle.length > 10) keys.push(kSingle);

      const uniqueKeys = [...new Set(keys)];
      if (uniqueKeys.length > 0) {
          selectedKey = uniqueKeys[Math.floor(Math.random() * uniqueKeys.length)];
      }
  }

  if (selectedKey) {
      // @ts-ignore
      if (typeof window !== 'undefined') {
          // @ts-ignore
          window.process = window.process || { env: {} };
          // @ts-ignore
          window.process.env = window.process.env || {};
          // @ts-ignore
          window.process.env.API_KEY = selectedKey;
      }
      try { process.env.API_KEY = selectedKey; } catch(e) {}
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const result = await ai.models.generateContent({
      model: params.model,
      contents: params.contents,
      config: params.config
    });
    return result;
  } catch (error: any) {
    console.error("Gemini API Call Failed:", error);
    throw error;
  }
};
