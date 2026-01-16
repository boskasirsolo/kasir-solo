
import { GoogleGenAI } from "@google/genai";

// Whitelist domain yang boleh akses API ini
const ALLOWED_ORIGINS = [
  'http://localhost:5173', // Vite Dev
  'http://localhost:3000', // Alt Dev
  'https://kasirsolo.my.id', // Production
  'https://www.kasirsolo.my.id'
];

export default async function handler(req: any, res: any) {
  // 1. Setup CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Kita handle strict check di bawah
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // LAYER 2: ORIGIN SECURITY CHECK (Firewall Lite)
  // Mencegah request dari Postman/CURL atau website lain
  const origin = req.headers.origin || req.headers.referer;
  // Jika origin ada (browser request), cek whitelist. Jika server-to-server (kadang null), kita loloskan (atau bisa diperketat).
  if (origin && !ALLOWED_ORIGINS.some(o => origin.startsWith(o))) {
     console.warn(`[Blocked] Unauthorized origin: ${origin}`);
     return res.status(403).json({ error: 'Akses Ditolak: Invalid Origin.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { model, contents, config } = req.body;

    // 2. Key Rotation Logic (Server Side)
    let selectedKey = process.env.GEMINI_API_KEY;
    
    if (!selectedKey) {
        const keys: string[] = [];
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
    return res.status(200).json(result);

  } catch (error: any) {
    console.error('[Gemini API Error]', error.message);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
