
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { destination_area_id, items } = req.body;
  const apiKey = process.env.BITESHIP_API_KEY;
  
  // Default Origin: Solo (IDNP3CL11666)
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
        couriers: 'jne,jnt,sicepat',
        items
      })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to calculate rates' });
  }
}
