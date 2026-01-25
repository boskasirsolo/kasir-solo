export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination_area_id, items } = req.body;
  const apiKey = process.env.BITESHIP_API_KEY;
  
  if (!destination_area_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Data pengiriman tidak lengkap.' });
  }

  // Origin: Kartasura, Sukoharjo (Solo Raya HQ)
  const origin_area_id = 'IDNP3CL11666';

  try {
    const response = await fetch('https://api.biteship.com/v1/rates', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        origin_area_id,
        destination_area_id,
        // TIPS: Jangan hardcode couriers di sini agar API tidak error 400 jika salah satu kurir tidak cover rute.
        // Kita tarik semua yang tersedia, nanti filter di frontend.
        items: items.map((item: any) => ({
          name: item.name,
          description: item.description || '',
          value: Number(item.value) || 0,
          weight: Number(item.weight) || 1000,
          quantity: Number(item.quantity) || 1,
          length: Number(item.length) || 20,
          width: Number(item.width) || 20,
          height: Number(item.height) || 20
        }))
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        // Balikin error asli dari Biteship buat debugging kalau masih mental
        return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Biteship API Error:", error);
    return res.status(500).json({ error: 'Gagal terhubung ke sistem logistik.' });
  }
}