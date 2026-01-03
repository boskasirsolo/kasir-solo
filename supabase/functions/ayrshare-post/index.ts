
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // 1. Handle CORS Preflight (Biar browser gak error blocked by CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Parse Data dari Admin Dashboard
    const { caption, image_url, platforms, title } = await req.json()

    // 3. Validasi Input (Cegah request kosong)
    if (!caption) throw new Error('Caption wajib diisi')
    if (!image_url) throw new Error('Image URL wajib ada (harus public URL)')
    if (!platforms || platforms.length === 0) throw new Error('Pilih minimal satu platform (IG/FB/GMB)')

    // 4. Ambil API Key dari Supabase Vault (Aman!)
    // Pastikan lo udah set secret ini via CLI: supabase secrets set AYRSHARE_API_KEY=xxx
    // @ts-ignore
    const AYRSHARE_API_KEY = Deno.env.get('AYRSHARE_API_KEY')
    if (!AYRSHARE_API_KEY) {
      console.error('CRITICAL: AYRSHARE_API_KEY belum diset di Supabase Secrets')
      throw new Error('Server Config Error: API Key missing')
    }

    console.log(`[Broadcaster] Sending to: ${platforms.join(', ')}`)

    // 5. Susun Payload buat Ayrshare
    const payload: any = {
      post: caption,
      platforms: platforms,
      mediaUrls: [image_url],
      shortenLinks: true // Otomatis pendekin link kalau ada
    };

    // Khusus GMB (Google Business), kadang butuh Call to Action
    // Kita default-kan ke standard post dulu biar aman.

    // 6. Tembak ke Ayrshare API
    const response = await fetch('https://app.ayrshare.com/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AYRSHARE_API_KEY}`
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    // 7. Cek Response dari Ayrshare
    if (data.status === 'error') {
        console.error('Ayrshare API Error:', data)
        throw new Error(data.message || 'Gagal posting ke sosmed via Ayrshare')
    }

    // 8. Sukses! Balikin info ke Frontend
    return new Response(
      JSON.stringify({ 
        success: true, 
        id: data.id, 
        postIds: data.postIds,
        refId: data.refId,
        message: "Broadcast Berhasil!"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    console.error('Edge Function Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
