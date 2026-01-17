
export interface DocItem {
    id: string;
    title: string;
    category: string;
    content: string;
}

export const DOCUMENTATION_CONTENT: DocItem[] = [
    {
        id: 'arsenal-products',
        category: 'Arsenal Penjualan',
        title: 'Manajemen Produk (Inventory)',
        content: `
# Panduan Kelola Senjata (Produk)

Halaman ini adalah tempat lo ngatur semua barang dagangan fisik lo. Lokasinya ada di **Tab Toko > Produk**.

### 1. Riset Judul & Konteks (AI Brain)
Jangan asal kasih nama produk. Gunakan kolom **"Keywords (Konteks AI)"**:
- Masukkan spek kunci (misal: "i5, 8gb, printer 80mm").
- Klik **"Auto-Gen"** di sebelah Nama Produk.
- AI bakal ngeracik judul yang SEO friendly dan enak dibaca calon pembeli.

### 2. Manajemen Visual (Cover & Gallery)
- **Watermark Otomatis:** Setiap lo upload gambar baru, pastiin centang "Watermark" aktif. Sistem bakal nempel logo MKS biar foto lo gak dicomot kompetitor.
- **AI Image Generator:** Gak punya foto produk bagus? Klik **"AI Generate"** di area cover. Sistem bakal bikin ilustrasi produk 3D profesional sesuai judul lo.
- **Gallery:** Lo bisa nambahin banyak foto detail. Tips: Masukin foto asli unit biar buyer makin yakin.

### 3. Detail Spek (The Technicals)
Pake format khusus di kolom spek biar rapi di website:
\`\`\`text
Processor: Core i5 10th Gen
RAM: 8GB DDR4
Printer: 80mm Auto-Cutter
\`\`\`
Sistem bakal otomatis ngerubah teks itu jadi tabel spesifikasi yang cantik di halaman detail produk.

### 4. Strategi Psikologi (Why Buy & Includes)
Jangan cuma jualan fitur, jualan **SOLUSI**:
- **Kenapa Harus Beli:** Isi poin-poin keuntungan (misal: "Garansi Ganti Baru", "Training Sampai Bisa").
- **Isi Paket:** Jelasin apa aja yang didapet biar gak ditanyain terus di WA.

### 5. Affiliate & Marketplace
Kalau lo jualan di Shopee/Tokopedia juga:
- Masukin link-nya di kolom **"Link Eksternal"**.
- Atur **"Label Tombol"** (misal: "Beli di Tokopedia").
- Kalau link diisi, sistem bakal prioritasin tombol marketplace dibanding checkout langsung di web (aman buat lo yang gak mau repot ngurus transferan manual).

### 6. Simpan & Background Migration
Pas lo klik **"SIMPAN"**, prosesnya ada dua:
1. Data langsung masuk ke Supabase (Website lo langsung update).
2. Di background, gambar lo dipindahin ke **Cloudinary** buat di-optimasi biar loading web makin ngebut. Lo tinggal tutup dashboard aja, sistem bakal beresin sendiri.
        `
    },
    {
        id: 'infra-supabase',
        category: 'The Core Infrastructure',
        title: 'Supabase Engine & Database',
        content: `
# Supabase: Jantung Data MKS

Semua data di website ini disimpan di Supabase. Berikut adalah tabel-tabel krusial yang wajib lo pahami:

1. **products**: Katalog alat kasir. Field \`image_url\` di sini akan bermigrasi otomatis ke Cloudinary setelah simpan.
2. **services**: Konten kalkulator layanan. Data disimpan dalam format JSON di kolom \`calc_data\`.
3. **orders**: Rekaman transaksi dari checkout.
4. **leads**: Data tangkapan dari form kontak dan Shadow Lead (orang yang batal checkout).
5. **analytics_logs**: Rekaman jejak user buat laporan di Dashboard Analytics.

> **Tips:** Jangan hapus data langsung di Supabase Dashboard kecuali lo tau apa yang lo lakuin. Pake UI Admin ini aja biar aman.
        `
    },
    {
        id: 'infra-storage',
        category: 'The Core Infrastructure',
        title: 'Hybrid Storage Strategy',
        content: `
# Hybrid Storage (Supabase + Cloudinary)

Gue pake strategi dua lapis buat simpen gambar biar web lo tetep kenceng tapi storage tetep gratis:

- **Layer 1 (Supabase Storage):** Tempat mendarat pertama pas lo upload. Cepat tapi kuotanya dikit.
- **Layer 2 (Cloudinary):** Setelah lo klik "Simpan", sistem bakal mindahin file itu ke Cloudinary di background. Cloudinary bakal optimasi gambar lo (WebP/AVIF) otomatis.

**Kenapa begini?**
Biar lo dapet URL yang super kenceng dari CDN Cloudinary tanpa perlu mikirin cara optimasi manual.
        `
    },
    {
        id: 'arsenal-broadcast',
        category: 'Arsenal Penjualan',
        title: 'The Broadcast System',
        content: `
# Sistem Broadcast Layanan

Di Tab **Toko > Layanan**, lo bisa bikin satu item (misal: "Install Ulang") terus disebar ke semua layanan sekaligus.

**Cara Main:**
1. Masuk ke Editor Layanan.
2. Isi label, harga, dan narasi.
3. Di bagian bawah, pilih target layanan (Website, WebApp, SEO, dll).
4. Klik **Simpan & Broadcast**.

Sistem bakal otomatis update database layanan yang lo pilih. Gak perlu input satu-satu lagi.
        `
    },
    {
        id: 'arsenal-city',
        category: 'Arsenal Penjualan',
        title: 'City Invasion (Local SEO)',
        content: `
# Strategi Dominasi Kota

Modul ini ada di Tab **SEO**. Tujuannya buat bikin ribuan Landing Page otomatis buat tiap kota di Indonesia.

- **Kandang (Solo Raya):** Narasi AI bakal fokus ke "Founder Datang Langsung".
- **Ekspansi (Luar Solo):** Narasi AI fokus ke "Packing Kayu Aman + Video Call Setup".

**Mantra SEO:**
Setiap halaman kota udah dipasang **Local Business Schema**. Ini sinyal kuat ke Google kalau PT Mesin Kasir Solo itu relevan buat orang di kota tersebut.
        `
    },
    {
        id: 'brain-persona',
        category: 'The Brain (SIBOS AI)',
        title: 'AI Persona & Training',
        content: `
# SIBOS AI: Digital Alter-Ego Amin

Otak AI di sini pake Gemini 1.5 Pro/Flash. Gue set biar dia punya kepribadian "Street-Smart".

- **Persona:** Amin Maghfuri (Gue/Lo style).
- **Hafalan Baru:** Pake Tab **SIBOY AI** buat nyuntik info baru (misal: "Bulan ini ada promo free ongkir").
- **Tools:** SIBOS bisa cek stok produk beneran dan itung ongkir kalau lo tanya di chat.

**Pantangan:** JANGAN biarkan dia ngomong kayak robot CS bank. Kalau dia mulai kaku, update hafalan di Sandbox.
        `
    },
    {
        id: 'intel-surveillance',
        category: 'Intelligence & Analytics',
        title: 'Surveillance & Shadow Leads',
        content: `
# Mata-Mata Digital

Gue gak cuma pasang Analytics biasa. Ada dua fitur "jahat" di sini:

1. **Ghost Mode:** Pas lo login admin, sistem otomatis aktifin Ghost Mode. Klik lo di web sendiri GAK AKAN kerekam di analytics. Biar datanya murni user asli.
2. **Shadow Leads:** Sistem bakal nangkep data (Nama & WA) orang yang baru ngisi form tapi belum klik "Kirim". Ini kesempatan lo buat sapa duluan lewat WA.

> **Cara Cek:** Masuk ke Tab **Toko > Shadow Leads** buat liat siapa aja yang lagi "ngintip" ruko lo.
        `
    }
];
