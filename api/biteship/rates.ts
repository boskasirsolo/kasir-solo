export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination_area_id, items } = req.body;
  const apiKey = process.env.BITESHIP_API_KEY;
  
  if (!destination_area_id || !items || items.length === 0) {
    return res.status(400).json({ error: 'Data pengiriman tidak lengkap.' });
  }

  // Origin: Kartasura, Sukoharjo (IDNP3CL11666)
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
        // Dikosongkan agar Biteship mengembalikan SEMUA yang tersedia tanpa proteksi berlebih
        couriers: '', 
        items: items.map((item: any) => ({
          name: item.name.substring(0, 45), // Biteship sensitif sama panjang karakter
          description: item.description || '',
          value: Math.max(1000, Number(item.value) || 0),
          weight: Math.max(100, Number(item.weight) || 1000),
          quantity: Number(item.quantity) || 1,
          length: Math.max(10, Number(item.length) || 20),
          width: Math.max(10, Number(item.width) || 20),
          height: Math.max(10, Number(item.height) || 20)
        }))
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
        return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Biteship API Critical Error:", error);
    return res.status(500).json({ error: 'Sistem logistik pusat sedang sibuk.' });
  }
}