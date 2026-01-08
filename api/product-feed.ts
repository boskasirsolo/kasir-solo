
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: any, res: any) {
  try {
    // 1. Init Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ error: 'Missing Supabase credentials.' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. Fetch Products
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .gt('price', 0); // Hanya ambil harga > 0

    if (error) throw new Error(error.message);

    // 3. Site Config
    const { data: settings } = await supabase.from('site_settings').select('*').single();
    const SITE_URL = 'https://kasirsolo.my.id';
    const SITE_TITLE = settings?.hero_title || 'PT Mesin Kasir Solo';
    const SITE_DESC = settings?.hero_subtitle || 'Pusat Mesin Kasir Terlengkap';

    const escapeXml = (unsafe: string) => {
      if (!unsafe) return '';
      return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    };

    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>${escapeXml(SITE_TITLE)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_DESC)}</description>
`;

    if (products && products.length > 0) {
      products.forEach((product: any) => {
        // --- STRICT IMAGE FILTERING ---
        let imageLink = product.image_url || product.image;

        // 1. Cek Null/Undefined/Empty
        if (!imageLink || typeof imageLink !== 'string' || imageLink.trim() === '') {
            return; // SKIP PRODUK INI (Gak masuk XML)
        }

        imageLink = imageLink.trim();

        // 2. Cek apakah ini URL placeholder bawaan template (optional, tapi aman biar gak kena reject 'Generic Image')
        if (imageLink.includes('placeholder') || imageLink.includes('via.placeholder.com')) {
            return; // SKIP PRODUK INI
        }

        // 3. Fix Relative URL
        if (!imageLink.startsWith('http')) {
            // Hapus slash di awal jika ada biar gak double
            const cleanPath = imageLink.startsWith('/') ? imageLink.substring(1) : imageLink;
            imageLink = `${SITE_URL}/${cleanPath}`;
        }

        // 4. Validasi Akhir URL (Pastikan bukan root domain doang)
        if (imageLink === SITE_URL || imageLink === `${SITE_URL}/`) {
            return; 
        }

        // --- DATA LAINNYA ---
        const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const productLink = `${SITE_URL}/shop/${slug}`;
        
        // Bersihkan deskripsi dari karakter aneh
        const description = product.description ? product.description.replace(/\n/g, ' ').substring(0, 5000) : product.name;

        xml += `
<item>
<g:id>MKS-${product.id}</g:id>
<g:title>${escapeXml(product.name)}</g:title>
<g:description>${escapeXml(description)}</g:description>
<g:link>${productLink}</g:link>
<g:image_link>${imageLink}</g:image_link>
<g:condition>new</g:condition>
<g:availability>in_stock</g:availability>
<g:price>${product.price} IDR</g:price>
<g:brand>PT Mesin Kasir Solo</g:brand>
<g:google_product_category>Electronics &gt; Electronics Accessories &gt; Computer Components</g:google_product_category>
</item>`;
      });
    }

    xml += `
</channel>
</rss>`;

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).send(xml);

  } catch (error: any) {
    console.error('Feed Error:', error);
    res.status(500).json({ error: error.message });
  }
}
