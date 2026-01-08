
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
  
  // 1. Cek Google IDX / AI Studio (Development Mode)
  // Jika jalan di IDX, kita tetap pake Client-Side SDK karena key-nya injeksi dari browser.
  // @ts-ignore
  if (typeof window !== 'undefined' && window.aistudio) {
      await ensureAPIKey();
      const apiKey = process.env.API_KEY || ''; // IDX injects this automatically
      
      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });
      
      return await ai.models.generateContent({
        model: params.model,
        contents: params.contents,
        config: params.config
      });
  }

  // 2. Production Mode (Vercel)
  // Panggil endpoint /api/gemini yang kita buat.
  // Tidak ada key yang terekspos di sini.
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server Error: ${response.status}`);
      }

      // 3. Polyfill Response Structure
      // Karena JSON tidak bisa bawa getter/method, kita bikin ulang properti 'text'
      // agar kompatibel dengan kode frontend yang pake `response.text`
      return {
        ...data,
        get text() {
          // Fallback logic untuk ekstrak teks dari struktur JSON Gemini
          return data.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join('') || '';
        }
      };

    } catch (error: any) {
      const isLastAttempt = attempt === retries - 1;
      console.warn(`API Call Failed (${attempt + 1}/${retries}):`, error.message);
      
      if (!isLastAttempt) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};
