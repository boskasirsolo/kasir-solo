
export default async function handler(req: any, res: any) {
  const ALLOWED_ORIGINS = [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://kasirsolo.my.id', 
    'https://www.kasirsolo.my.id'
  ];

  const origin = req.headers.origin;
  
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
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
    const { caption, image_url, platforms } = req.body;

    if (!caption || !image_url || !platforms || platforms.length === 0) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const AYRSHARE_API_KEY = process.env.AYRSHARE_API_KEY;

    if (!AYRSHARE_API_KEY) {
      console.error("Critical: AYRSHARE_API_KEY is missing.");
      throw new Error('Server Config Error.');
    }

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
      throw new Error(data.message || 'Gagal posting.');
    }

    return res.status(200).json({ success: true, data });

  } catch (error: any) {
    console.error('[Broadcaster Error]', error.message);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
