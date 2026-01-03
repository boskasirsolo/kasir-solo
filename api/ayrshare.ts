
export default async function handler(req: any, res: any) {
  // 1. Setup CORS (Biar browser gak rewel)
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle Preflight Request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { caption, image_url, platforms } = req.body;

    // 2. Validasi
    if (!caption) throw new Error('Caption wajib diisi');
    if (!image_url) throw new Error('Image URL wajib ada');
    if (!platforms || platforms.length === 0) throw new Error('Pilih minimal satu platform');

    // 3. Ambil API Key dari Vercel Environment Variables
    // PENTING: Masukkan 'AYRSHARE_API_KEY' di Dashboard Vercel > Settings > Environment Variables
    const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;

    if (!AYRSHARE_API_KEY) {
      console.error("API Key Missing");
      throw new Error('Server Config Error: AYRSHARE_API_KEY belum disetting di Vercel.');
    }

    console.log(`[Vercel API] Posting to ${platforms.join(', ')}`);

    // 4. Kirim ke Ayrshare
    const response = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      },
      body: JSON.stringify({
        post: caption,
        platforms: platforms,
        mediaUrls: [image_url],
        shortenLinks: true
      })
    });

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'Gagal posting ke Ayrshare');
    }

    // 5. Sukses
    return res.status(200).json({ success: true, data });

  } catch (error: any) {
    console.error('[Vercel API Error]', error.message);
    return res.status(500).json({ error: error.message });
  }
}
