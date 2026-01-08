
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // 1. Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, contents, config } = req.body;

    // 2. Key Rotation Logic (Server Side)
    // Mencari key dari GEMINI_API_KEY, GEMINI_API_KEY_1, dst.
    let selectedKey = process.env.GEMINI_API_KEY;
    
    if (!selectedKey) {
        const keys: string[] = [];
        // Cek rotasi sampai 5 key cadangan
        for (let i = 1; i <= 5; i++) {
            const k = process.env[`GEMINI_API_KEY_${i}`];
            if (k) keys.push(k);
        }
        if (keys.length > 0) {
            selectedKey = keys[Math.floor(Math.random() * keys.length)];
        }
    }

    if (!selectedKey) {
        throw new Error("Server Error: API Key not configured in Vercel.");
    }

    // 3. Call Google GenAI
    const ai = new GoogleGenAI({ apiKey: selectedKey });
    
    const result = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: config
    });

    // 4. Return Response
    // Kita kirim balik JSON responnya. 
    // Frontend akan handle getter .text
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[Gemini API Error]', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
