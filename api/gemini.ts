
import { GoogleGenAI } from "@google/genai";

// Whitelist domain yang boleh akses API ini
const ALLOWED_ORIGINS = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://kasirsolo.my.id', 
  'https://www.kasirsolo.my.id',
  'https://web-kasirsolo.vercel.app'
];

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin;
  
  // 1. Setup CORS dynamically based on whitelist
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // For browsers, this will block the request. 
    // For server-to-server, we still perform origin check below.
    res.setHeader('Access-Control-Allow-Origin', 'https://kasirsolo.my.id');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // LAYER 2: STRICT ORIGIN SECURITY CHECK
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
     console.warn(`[Blocked] Unauthorized origin attempt: ${origin}`);
     return res.status(403).json({ error: 'Forbidden: Unauthorized API access.' });
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
        throw new Error("Server Error: API Key not configured.");
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
    return res.status(500).json({ error: 'Internal Server Error during AI generation.' });
  }
}
