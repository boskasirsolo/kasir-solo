
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// FORMATTER HELPER
const escapeXml = (unsafe: string) => {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
    return c;
  });
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Init Supabase Client
    // @ts-ignore
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    // @ts-ignore
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // 2. Fetch Config & Products
    // Ambil data produk yang sudah ada harganya & namanya
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .gt('price', 0) // Pastikan harga > 0
      .not('image_url', 'is', null) // Pastikan ada gambar

    if (error) throw error

    // Ambil setting website (untuk base URL dll)
    const { data: settings } = await supabase.from('site_settings').select('*').single()
    
    // Fallback constants
    const SITE_URL = 'https://kasirsolo.com' // Hardcoded domain production
    const SITE_TITLE = settings?.hero_title || 'PT Mesin Kasir Solo'
    const SITE_DESC = settings?.hero_subtitle || 'Pusat Mesin Kasir Terlengkap'

    // 3. Build XML String
    let xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>${escapeXml(SITE_TITLE)}</title>
<link>${SITE_URL}</link>
<description>${escapeXml(SITE_DESC)}</description>
`

    // 4. Loop Products
    products.forEach((product: any) => {
      // Logic URL Gambar
      let imageLink = product.image_url
      if (imageLink && !imageLink.startsWith('http')) {
         // Fix relative URLs if any
         imageLink = `${SITE_URL}${imageLink}` 
      }

      // Logic Slug
      const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const productLink = `${SITE_URL}/shop/${slug}`

      xml += `
<item>
<g:id>MKS-${product.id}</g:id>
<g:title>${escapeXml(product.name)}</g:title>
<g:description>${escapeXml(product.description || product.name)}</g:description>
<g:link>${productLink}</g:link>
<g:image_link>${imageLink}</g:image_link>
<g:condition>new</g:condition>
<g:availability>in_stock</g:availability>
<g:price>${product.price} IDR</g:price>
<g:brand>PT Mesin Kasir Solo</g:brand>
<g:google_product_category>Electronics &gt; Electronics Accessories &gt; Computer Components</g:google_product_category>
</item>`
    })

    xml += `
</channel>
</rss>`

    // 5. Return XML Response
    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache 1 jam
      },
    })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
