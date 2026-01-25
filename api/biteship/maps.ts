
export default async function handler(req: any, res: any) {
  const { input } = req.query;
  
  if (!input) {
    return res.status(400).json({ error: 'Input required' });
  }

  const apiKey = process.env.BITESHIP_API_KEY;

  try {
    const response = await fetch(`https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(input)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch Biteship data' });
  }
}
