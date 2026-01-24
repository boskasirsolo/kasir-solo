
import { GoogleGenAI } from "@google/genai";

const ALLOWED_ORIGINS = [
  'http://localhost:5173', 
  'http://localhost:3000', 
  'https://kasirsolo.my.id', 
  'https://www.kasirsolo.my.id',
  'https://web-kasirsolo.vercel.app'
];

export default async function handler(req: any, res: any) {
  const origin = req.headers.origin;
  
  // Robust CORS Handling
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default fallback to the main production origin
    res.setHeader('Access-Control-Allow-Origin', 'https://www.kasirsolo.my.id');
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
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

    // --- ROTASI 7 KEY (Sesuai Dashboard Vercel Juragan) ---
    const keys: string[] = [];
    for (let i = 1; i <= 7; i++) {
        const k = process.env[`GEMINI_API_KEY_${i}`];
        if (k && k.length > 10) keys.push(k);
    }
    
    // Fallback ke master key jika ada
    if (process.env.API_KEY) keys.push(process.env.API_KEY);

    if (keys.length === 0) {
      throw new Error('Konfigurasi Gawat: Gak nemu API Key 1-7 di Vercel.');
    }

    // Ambil acak dari key yang tersedia
    const selectedKey = keys[Math.floor(Math.random() * keys.length)];
    const ai = new GoogleGenAI({ apiKey: selectedKey });
    
    // Eksekusi langsung sesuai Guideline
    const response = await ai.models.generateContent({
      model: model || 'gemini-3-flash-preview',
      contents: contents,
      config: config
    });

    if (!response || !response.text) {
        throw new Error("Gemini returned an empty response. Check safety settings or quota.");
    }

    return res.status(200).json({
      text: response.text,
      candidates: response.candidates ? JSON.parse(JSON.stringify(response.candidates)) : [],
      usageMetadata: response.usageMetadata
    });

  } catch (error: any) {
    console.error('[Gemini-Bridge-Error]', error.message);
    // Kirim detail error agar Admin tau apa yang salah (quota/auth/limit)
    return res.status(500).json({ 
      error: 'AI Generation Failed', 
      message: error.message,
      code: error.code || 'UNKNOWN'
    });
  }
}
