
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

// --- CENTRALIZED API CALLER WITH RETRY ---
export const callGeminiWithRotation = async (params: {
  model: string,
  contents: any,
  config?: any
}, retries = 3) => {
  let selectedKey = '';
  // @ts-ignore
  const isAIStudio = typeof window !== 'undefined' && window.aistudio;

  if (isAIStudio) {
      await ensureAPIKey();
      selectedKey = process.env.API_KEY || '';
  } 

  if (!selectedKey) {
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

  if (!selectedKey) {
      throw new Error("API Key not found. Please connect AI Studio or set VITE_GEMINI_API_KEY.");
  }

  // DYNAMIC IMPORT: Load GenAI library ONLY when this function is called
  // This removes ~46KB from the initial page load bundle
  const { GoogleGenAI } = await import("@google/genai");

  const ai = new GoogleGenAI({ apiKey: selectedKey });

  // RETRY LOOP
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const result = await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });
      return result;
    } catch (error: any) {
      const isLastAttempt = attempt === retries - 1;
      // Check for fetch/network errors
      const isNetworkError = error.message?.toLowerCase().includes('fetch') || 
                             error.message?.toLowerCase().includes('network') ||
                             error.message?.toLowerCase().includes('failed');
      
      if (isNetworkError && !isLastAttempt) {
        console.warn(`Gemini API Call Failed (Attempt ${attempt + 1}/${retries}). Retrying in 2s...`, error);
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); // Exponential wait
        continue;
      }
      
      console.error("Gemini API Fatal Error:", error);
      throw new Error(`Gemini Error: ${error.message || 'Unknown error'}`);
    }
  }
};
