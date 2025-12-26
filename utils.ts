
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { Product, Article, GalleryItem } from './types';

// --- Environment Helpers ---
export const getEnv = (key: string) => {
  // 1. Try Vite / Modern ESM (Preferred)
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      const val = (import.meta as any).env[key];
      if (val) return val;
    }
  } catch (e) {}

  // 2. Safe Global Fallback (avoiding direct 'process' reference which crashes browsers)
  try {
    // @ts-ignore
    if (typeof window !== 'undefined' && (window as any).process && (window as any).process.env) {
      // @ts-ignore
      return (window as any).process.env[key] || '';
    }
  } catch (e) {}

  return '';
};

// --- Configuration ---
export const CONFIG = {
  SUPABASE_URL: getEnv('VITE_SUPABASE_URL'),
  SUPABASE_KEY: getEnv('VITE_SUPABASE_ANON_KEY'),
  GEMINI_API_KEY: getEnv('VITE_GEMINI_API_KEY'),
  CLOUDINARY_CLOUD_NAME: getEnv('VITE_CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_PRESET: getEnv('VITE_CLOUDINARY_UPLOAD_PRESET'),
};

// --- Clients ---
export const supabase = (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_KEY) 
  ? createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY) 
  : null;

export const ai = CONFIG.GEMINI_API_KEY 
  ? new GoogleGenAI({ apiKey: CONFIG.GEMINI_API_KEY }) 
  : null;

// --- Formatters ---
export const formatRupiah = (number: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
};

// --- Mock Data ---
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Paket Kasir Android Lite",
    price: 2500000,
    category: "Android POS",
    description: "Solusi hemat untuk UMKM, Warkop, dan Coffee Shop. Tablet 8 inch + Printer Thermal High Speed + Stand Kokoh. Siap pakai.",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Paket Resto Pro Windows",
    price: 7500000,
    category: "Windows POS",
    description: "Sistem kasir restoran lengkap. PC All-in-One Touchscreen, Printer Dapur & Kasir, Cash Drawer. Support manajemen meja & inventory.",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Kiosk Self-Service Touchscreen",
    price: 15000000,
    category: "Smart Kiosk",
    description: "Mesin pemesanan mandiri 24 inch untuk efisiensi antrian. Terintegrasi pembayaran QRIS & E-Wallet. Modern & Futuristik.",
    image: "https://images.unsplash.com/photo-1585646397275-84e625a4d46c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Paket Retail Minimarket Full",
    price: 5500000,
    category: "Retail POS",
    description: "Paket komputer kasir spek tinggi, Scanner Barcode Omnidirectional, Printer Struk. Mampu menangani 10.000+ SKU barang.",
    image: "https://images.unsplash.com/photo-1580569766020-21a48c66060c?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Printer Thermal Bluetooth Portable",
    price: 350000,
    category: "Hardware",
    description: "Printer struk mini ukuran 58mm. Koneksi bluetooth ke HP Android/iOS. Cocok untuk kasir keliling atau food truck.",
    image: "https://images.unsplash.com/photo-1622675235450-482a59a72175?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Scanner Barcode Wireless 2D",
    price: 850000,
    category: "Hardware",
    description: "Scanner barcode tanpa kabel, jangkauan hingga 50 meter. Bisa scan QR Code (e-wallet) dan Barcode batang biasa.",
    image: "https://images.unsplash.com/photo-1579707248386-7a85df71665a?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 7,
    name: "Cash Drawer Besi RJ11",
    price: 450000,
    category: "Hardware",
    description: "Laci uang bahan metal kokoh. Terbuka otomatis saat struk keluar. Kompatibel dengan semua jenis printer kasir.",
    image: "https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 8,
    name: "Paket Tablet Kasir Ekonomis",
    price: 1800000,
    category: "Android POS",
    description: "Paket starter kit untuk usaha kecil. Tablet 7 inch + Aplikasi Kasir Gratis + Printer Bluetooth. Mudah digunakan.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800"
  }
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 1,
    title: "Battle Royale: Android POS vs Windows POS, Mana Raja Sebenarnya?",
    excerpt: "Analisis mendalam 5000 kata membedah kelebihan, kekurangan, dan biaya tersembunyi antara Kasir Android vs Windows PC untuk bisnis 2024.",
    content: `
# Pendahuluan: Dilema Klasik Pengusaha

Salah satu pertanyaan yang paling sering mampir ke WhatsApp PT Mesin Kasir Solo adalah: *"Mas, mending pakai tablet Android atau komputer Windows ya buat kasirnya?"*

Jawabannya tidak sesederhana "Windows lebih kuat" atau "Android lebih murah". Di tahun 2025 ini, gap antara kedua platform ini semakin menipis, namun karakteristik dasarnya tetap berbeda bagaikan bumi dan langit.

Artikel ini akan mengupas tuntas secara brutal, jujur, dan teknis mengenai perbandingan kedua sistem ini. Siapkan kopi Anda, ini akan menjadi bacaan panjang.

---

# Bab 1: Sejarah dan Evolusi

## Era Windows: Sang Penguasa Lama
Sebelum tahun 2012, jika Anda masuk ke Indomaret, Hypermart, atau restoran fast food besar, 99% Anda akan melihat layar monitor tebal (CRT) atau LCD kotak yang menjalankan Windows XP atau Windows 7. 

**Karakteristik Windows POS Jaman Dulu:**
1. **Mahal:** Satu set bisa 15-20 juta.
2. **Rumit:** Butuh orang IT khusus untuk maintenance virus.
3. **Powerful:** Bisa handle database jutaan barang tanpa lag.

## Era Android: Sang Penantang Lincah
Munculnya Gojek dan Grab membawa revolusi. Tablet menjadi murah. Aplikasi kasir berbasis Cloud (SaaS) mulai bermunculan.

**Karakteristik Android POS:**
1. **Terjangkau:** Modal 2 juta sudah bisa jualan.
2. **User Friendly:** Semua orang bisa pakai HP, jadi training karyawan cuma 5 menit.
3. **Ringkas:** Tidak makan tempat di meja kasir yang sempit.

---

# Bab 2: Bedah Hardware (The Iron & The Glass)

Mari kita bicara soal "besi" dan "kaca". Hardware adalah investasi jangka panjang. Salah beli hardware, Anda akan menangis di tahun kedua.

## 1. Durabilitas (Ketahanan Banting)
*   **Windows (Industrial Grade):** Mesin kasir Windows *bukan* PC rakitan biasa. Mesin POS Windows (seperti merek Sunmi T2 Windows Version atau NCR) dirancang untuk menyala 24/7. Komponennya *heavy duty*. Kipas pendinginnya industrial.
*   **Android (Consumer Grade):** Kebanyakan pengusaha memulai dengan Tablet Samsung atau iPad biasa. Ingat, tablet consumer tidak dirancang untuk dicolok listrik terus menerus (charging) sambil layarnya menyala 12 jam sehari. Akibatnya? **Baterai Kembung** dalam 6-12 bulan.

**Solusi Kami:** Di PT Mesin Kasir Solo, untuk paket Android, kami SELALU menyarankan menggunakan Android All-in-One (seperti Sunmi D2 atau iMin) yang *tanpa baterai* (langsung colok listrik), atau tablet high-end dengan fitur *battery protection*.

## 2. Konektivitas (Colok-colokan)
Ini sering dilupakan. Sebuah meja kasir itu ruwet. Ada Printer Struk, Scanner Barcode, Laci Uang (Cash Drawer), Printer Dapur, Label Printer, EDC Bank, dan mungkin Timbangan Digital.
*   **Windows:** Menang telak. USB port bisa ada 6-8 biji. Ada Port Serial (COM/RS232) untuk timbangan digital. Ada Port LAN.
*   **Android:** Terbatas. Tablet biasa cuma punya 1 lubang charger (Type-C). Mau colok printer kabel? Harus pakai OTG. Mau ngecas sambil ngeprint? Ribet. Koneksi printer biasanya via Bluetooth yang kadang *delay* atau putus nyambung kalau ada gangguan sinyal microwave.

---

# Bab 3: Bedah Software & Ekosistem

## Windows: The Multitasking Beast
Pakai Windows, mesin kasir Anda adalah Komputer. 
*   Bisa buka Excel buat rekap gaji.
*   Bisa buka Browser buat putar YouTube/Spotify untuk musik toko.
*   Bisa install software desain buat bikin promo.
*   **Kelemahan:** Rawan virus, update Windows yang suka maksa (tiba-tiba restart pas lagi antri panjang), dan butuh lisensi OS yang mahal.

## Android: The Focus Master
Android POS itu *Single Purpose*. 
*   Dinyalakan langsung masuk aplikasi kasir.
*   Karyawan GABISA main game atau nonton Youtube (bisa dikunci pakai *Kiosk Mode*).
*   Aman dari virus .exe.
*   **Kelemahan:** Tidak bisa dipakai buat kerja berat lain.

---

# Bab 4: Analisis Biaya (The Real Cost)

Mari kita hitung duit. Ini simulasi kasar untuk Setup 1 Titik Kasir Lengkap (Hardware + Software 1 Tahun).

### Skenario A: Android Hemat
*   Tablet 10 Inch: Rp 2.500.000
*   Stand Tablet: Rp 150.000
*   Printer Bluetooth: Rp 350.000
*   Laci Uang: Rp 450.000
*   Software Cloud (200rb/bulan x 12): Rp 2.400.000
*   **TOTAL TAHUN PERTAMA: Rp 5.850.000**

### Skenario B: Windows Pro
*   PC All-in-One POS (Touchscreen): Rp 7.500.000
*   Printer Thermal USB Auto-Cutter: Rp 1.200.000
*   Scanner Barcode Stand: Rp 800.000
*   Laci Uang: Rp 450.000
*   Software POS Lifetime (Sekali beli): Rp 2.500.000
*   **TOTAL TAHUN PERTAMA: Rp 12.450.000**

**Analisis:**
Di awal, Android terlihat setengah harga. TAPI, perhatikan biaya software. Software Android biasanya berlangganan (SaaS). Dalam 5 tahun, biaya software Android = 2.4jt x 5 = 12 Juta! 
Sedangkan Windows seringkali ada opsi software *One-Time Purchase* (Beli putus).

---

# Kesimpulan: Mana yang Harus Anda Pilih?

**Pilih ANDROID Jika:**
1.  **Bisnis F&B (Cafe/Resto):** Butuh tampilan cantik, mobile (waiters bisa bawa tablet ke meja), dan fitur dapur cloud.
2.  **Tempat Terbatas:** Booth mall, Food truck.
3.  **Budget Awal Tipis:** Ingin mulai dulu, upgrade nanti.
4.  **Karyawan Gen-Z:** Mereka lebih cepat belajar layar sentuh HP daripada mouse/keyboard.

**Pilih WINDOWS Jika:**
1.  **Retail/Minimarket:** Butuh scan barcode super cepat (ribuan item). Android sering lag kalau database barang sudah di atas 5.000 SKU.
2.  **Grosir:** Transaksi cepat, antrian panjang, butuh ketahanan mesin nyala 24 jam.
3.  **Butuh Peripheral Khusus:** Timbangan digital, Customer Display pole, dll.
4.  **Anti Biaya Bulanan:** Lebih suka beli mahal di depan tapi tenang selamanya.

Di PT Mesin Kasir Solo, kami menyediakan keduanya. Konsultasikan kebutuhan spesifik Anda, karena setiap bisnis punya "jodoh" mesinnya masing-masing.

---
*Ditulis oleh Tim Teknis PT Mesin Kasir Solo - Expert since 2015*
`,
    date: "14 Feb 2024",
    image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?auto=format&fit=crop&q=80&w=1200",
    category: "Hardware Review",
    author: "Amin Maghfuri",
    readTime: "15 min read",
    tags: ["Perbandingan", "Investasi", "Teknologi"]
  },
  {
    id: 2,
    title: "Investigasi: 7 Lubang 'Ghaib' Penyebab Kebocoran Uang di Kasir",
    excerpt: "Bukan tuyul, bukan babi ngepet. Uang Anda hilang karena sistem yang lemah. Bongkar modus operandi fraud karyawan dan cara menutupnya dengan sistem yang tepat.",
    content: `
# Pendahuluan: Musuh Dalam Selimut

Pernahkah Anda mengalami kejadian ini? Toko ramai, antrian panjang, karyawan sibuk luar biasa. Hati Anda senang melihat omzet. Tapi saat tutup toko (closing), dihitung-hitung... kok uangnya cuma segini?

Stok barang habis, tapi uangnya tidak masuk. Apakah ada tuyul?

Berdasarkan data kami menangani 500+ klien di seluruh Indonesia, 80% kehilangan uang di kasir BUKAN karena pencurian eksternal (maling masuk toko), melainkan **Internal Fraud** (kecurangan karyawan).

Mari kita bedah 7 modus operandi paling populer dan cara sistem kasir modern menutup celah tersebut.

---

## Modus 1: The Phantom Void (Void Palsu)

**Cara Kerja:**
1. Pelanggan beli 2 Kopi Susu (Total 30rb).
2. Kasir input ke sistem, struk keluar.
3. Pelanggan bayar tunai 30rb, lalu pulang.
4. Setelah pelanggan pergi, kasir melakukan **VOID** (pembatalan transaksi) di sistem dengan alasan "Salah Input".
5. Di sistem, transaksi dianggap batal (Omzet = 0).
6. Uang 30rb masuk ke kantong kasir.
7. Stok kopi berkurang, tapi biasanya baru ketahuan pas Stok Opname akhir bulan (itu pun dianggap barang rusak/hilang).

**Solusi Sistem:**
Software kasir yang kami rekomendasikan memiliki fitur "Secure Void".
*   **Level 1:** Kasir tidak bisa Void tanpa Password Supervisor/Owner.
*   **Level 2:** Jika Void dilakukan, notifikasi langsung masuk ke WA Owner detik itu juga. *"Alert: Kasir A melakukan Void Transaksi #123 senilai 30rb."*
*   **Level 3:** Laporan "Audit Trail" mencatat semua aktivitas pembatalan yang mencurigakan.

## Modus 2: The Sweethearting (Diskon Teman)

**Cara Kerja:**
Teman atau pacar kasir datang belanja. Total belanja 500rb. Kasir menggunakan hak aksesnya untuk memberikan **Diskon Manual 90%** atau mengubah harga barang menjadi Rp 1.
Temannya cuma bayar receh, barang 500rb melayang.

**Solusi Sistem:**
*   Batasi hak akses diskon. Kasir hanya boleh memilih diskon yang sudah diprogram (misal: Promo Merdeka 10%).
*   Kasir TIDAK BOLEH mengubah harga jual secara manual.
*   Laporan "Diskon Abnormal" akan muncul di Dashboard Owner.

## Modus 3: The Fake Return (Retur Fiktif)

**Cara Kerja:**
Mirip Void, tapi dilakukan sore hari. Kasir mengambil struk belanja yang dibuang pelanggan di tempat sampah. Dia melakukan proses "Retur Barang" di sistem seolah-olah pelanggan komplain dan minta uang kembali. Uang diambil dari laci kasir.

**Solusi Sistem:**
*   Retur wajib menyertakan alasan dan input data pelanggan (No HP).
*   Sistem bisa di-setting agar Retur H+0 (hari yang sama) membutuhkan otorisasi kartu supervisor.

## Modus 4: Penjualan Tanpa Struk (No Ring)

**Cara Kerja:**
Ini cara paling primitif. Pelanggan beli air mineral. Kasir terima uang, kasih kembalian, tapi **TIDAK MENGINPUT** ke komputer.
Biasanya kasir akan membiarkan laci terbuka sedikit atau menaruh uang di saku.

**Solusi:**
1. **CCTV Integrasi:** Pasang CCTV tepat di atas mesin kasir.
2. **Mystery Shopper:** Suruh orang lain pura-pura belanja.
3. **Printer Dapur:** Untuk bisnis F&B, sistem kami bisa mewajibkan input pesanan agar printer bar/dapur mencetak. Kalau tidak diinput, barista/koki tidak akan membuatkan pesanan. Ini memaksa kasir untuk input.

---

# Strategi Pencegahan: SOP + Teknologi

Mencegah fraud tidak bisa hanya mengandalkan "Kepercayaan" dan "Kekeluargaan". Bisnis adalah sistem.

### 1. Blind Cash Count (Hitung Buta)
Saat closing shift, jangan biarkan sistem memberitahu kasir berapa uang yang SEHARUSNYA ada.
*   **Cara Salah:** Sistem bilang "Total Hari Ini: 1.500.000". Kasir menghitung uang, ternyata ada 1.600.000 (lebih 100rb). Kasir akan mengambil kelebihannya.
*   **Cara Benar (Blind Count):** Sistem hanya menampilkan layar kosong "Masukkan Jumlah Uang Cash". Kasir menghitung fisik, lalu input "1.600.000". Baru sistem mencocokkan di backend. Jika selisih, sistem mencatat sebagai "Overage/Shortage".

### 2. Stok Opname Acak (Random Spot Check)
Jangan tunggu akhir bulan. Lakukan cek stok mendadak untuk 5-10 barang *High Value* (misal: Rokok, Susu Formula, Daging Premium).
Jika fisik < sistem, berarti ada penjualan "No Ring" atau barang dimakan karyawan.

### 3. Hak Akses Bertingkat
Jangan berikan password "Admin" ke semua orang.
*   **Kasir:** Cuma bisa jualan.
*   **Head Store:** Bisa Void, Retur, Stok Opname.
*   **Owner:** Bisa lihat Laporan Laba Rugi, Hapus Data.

---

# Penutup: Investasi Keamanan

Banyak pengusaha enggan membeli software kasir premium seharga 5-7 juta karena merasa mahal. Padahal, kebocoran 50.000 per hari x 30 hari = 1.500.000 per bulan.
Dalam setahun, Anda kehilangan **18 Juta Rupiah** (seharga motor baru!) hanya karena fraud kecil-kecilan.

Investasi sistem POS profesional bukan pengeluaran. Itu adalah gembok brankas Anda.

---
*Departemen Keamanan & Audit Sistem - PT Mesin Kasir Solo*
`,
    date: "20 Jan 2024",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1200",
    category: "Case Study",
    author: "Tim Security",
    readTime: "12 min read",
    tags: ["Keamanan", "Fraud", "SOP"]
  },
  {
    id: 3,
    title: "Kisah Nyata: Dari Catatan Buku Lecek Menjadi 5 Cabang 'Kopi Senja'",
    excerpt: "Sebuah feature story tentang perjalanan Pak Budi. Bagaimana digitalisasi menyelamatkan pernikahannya dan bisnisnya dari kehancuran total.",
    content: `
# Bab 1: Titik Nadir

Jumat sore, pertengahan 2019. Pak Budi (45) duduk termenung di sudut kedai kopi kecilnya di daerah Jebres, Solo. Di depannya ada tumpukan nota bon yang lusuh, kalkulator casio tua, dan secangkir kopi yang sudah dingin.

*"Bud, uang belanja pasar besok mana?"* tanya istrinya, Bu Rini.
Pak Budi diam. Laci kasir hanya berisi recehan. Padahal, seminggu ini kedai ramai. Mahasiswa silih berganti nongkrong. Tapi kemana uangnya?

*"Aku capek, Mas. Tiap hari rame, tapi tiap akhir bulan kita nombok. Karyawanmu itu lho, si Andi, tadi aku lihat dia ngasih kopi gratis ke temennya, kamu diam saja,"* omel Bu Rini.

Malam itu, mereka bertengkar hebat. Masalahnya klise: **Manajemen Berantakan**.
1. Stok biji kopi sering habis mendadak saat ramai.
2. Tidak tahu mana menu yang laris, mana yang rugi.
3. Karyawan sering salah hitung kembalian.
4. Pak Budi harus standby di kasir 12 jam sehari, tidak punya waktu untuk keluarga.

*"Kalau bulan depan masih begini, mending tutup saja,"* ancam istrinya.

---

# Bab 2: Pertemuan yang Mengubah Segalanya

Sabtu pagi, Pak Budi iseng membuka Facebook. Algoritma mempertemukannya dengan iklan PT Mesin Kasir Solo: *"Capek Nombok Terus? Pantau Bisnis dari HP, Bebaskan Waktumu!"*

Siangnya, dengan motor Supra getar, Pak Budi nekat ke kantor kami di Kartasura. Wajahnya kusut.
*"Mas, tolong saya. Saya gaptek. Tapi saya butuh sistem. Uang saya bocor terus,"* katanya kepada Mas Amin (CEO kami).

Kami tidak langsung menawarinya alat mahal. Kami melakukan **Audit Diagnosa** dulu.
Masalah Pak Budi bukan cuma di kasir, tapi di **Dapur**. Resep tidak baku. Kadang 1 cup pakai 15gram kopi, kadang 20gram. HPP (Harga Pokok Penjualan) tidak jelas.

**Solusi yang Kami Tawarkan:**
*   **Hardware:** Paket Android Tablet + Printer Bluetooth (Budget 3 Jutaan, karena Pak Budi lagi seret).
*   **Software:** Aplikasi Kasir Cloud Hybrid (Bisa Online & Offline).
*   **SOP:** Kami bantu buatkan resep baku (Recipe Management).

---

# Bab 3: Masa Transisi yang Menyakitkan

Minggu pertama implementasi adalah neraka.
Si Andi (karyawan lama) protes. *"Ribet Pak, harus pencet-pencet tablet. Biasanya tinggal teriak ke dapur."*
Pak Budi hampir menyerah. *"Mas, apa balik manual aja ya?"*

Kami kirim teknisi untuk pendampingan full 2 hari. Kami ajarkan:
1. Cara input pesanan (ternyata lebih cepat dari nulis tangan).
2. Cara closing shift (setor uang sesuai angka di tablet).
3. Cara input stok datang.

**Kejutan di Hari Ketiga:**
Saat closing, sistem mencatat penjualan 1.500.000. Tapi uang di laci cuma 1.200.000. Kurang 300rb.
Si Andi pucat. Ternyata selama ini dia sering "lupa" masukin uang es teh ke laci.
Hari itu juga, Pak Budi tegas. Andi diberi SP1 dan ganti rugi potong gaji. Sejak hari itu, tidak ada lagi uang hilang. Karyawan jadi disiplin karena tahu "Sistem Mengawasi".

---

# Bab 4: Buah Manis Digitalisasi

Tiga bulan berlalu.
Pak Budi tidak lagi nongkrong di kasir. Dia bisa jemput anak sekolah. Dia bisa ngopi santai sama Bu Rini di meja pelanggan, bukan di balik meja kasir.

Kenapa? Karena di HP-nya ada aplikasi **Owner Dashboard**.
*"Ting.. Ting.."* notifikasi masuk tiap ada transaksi.
Dia tahu detik ini juga omzetnya berapa.
Dia tahu stok susu tinggal 2 kotak, jadi dia bisa belanja ke pasar sebelum habis.

**Data yang Mengejutkan:**
Dari laporan "Top Product", Pak Budi baru sadar kalau menu andalannya "Kopi Tubruk" justru *sedikit* profitnya. Yang paling untung besar ternyata "Lychee Tea".
Strategi berubah. Banner depan diganti promo Lychee Tea. Profit naik 40% bulan itu.

---

# Bab 5: Ekspansi (2020 - Sekarang)

Dengan cashflow yang sehat dan tercatat rapi, Pak Budi memberanikan diri mengajukan KUR (Kredit Usaha Rakyat) ke Bank BRI.
Syarat utama KUR adalah **Laporan Keuangan**.
Dulu, Pak Budi bingung bikin laporan. Sekarang? Tinggal klik "Export Laba Rugi" di aplikasi kasirnya, print, serahkan ke Mantri BRI.
Cair 50 Juta dalam 3 hari.

Tahun 2024 ini, 'Kopi Senja' sudah punya 5 cabang di Solo Raya.
Apakah Pak Budi pusing ngurus 5 cabang? Tidak.
Sistem manajemennya sudah **Multi-Outlet**. Dia bisa pantau 5 cabang sekaligus dari 1 layar HP sambil rebahan di rumah.

---

# Pesan Pak Budi untuk Anda

Dalam sesi interview terakhir, Pak Budi menitipkan pesan untuk UMKM lain:

> *"Jangan pelit untuk sistem. Dulu saya pikir 3 juta itu mahal. Ternyata, kerugian saya karena cara manual jauh lebih besar dari itu. Mesin kasir itu bukan biaya, itu asisten jujur yang nggak minta gaji."*

Apakah Anda masih mau bertahan dengan buku catatan lecek seperti Pak Budi di tahun 2019?
Pilihan di tangan Anda.

---
*Ditulis berdasarkan kisah nyata klien PT Mesin Kasir Solo. Nama disamarkan untuk privasi, namun data keberhasilan adalah riil.*
`,
    date: "10 Jan 2024",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=1200",
    category: "Inspirasi UMKM",
    author: "Redaksi MKS",
    readTime: "20 min read",
    tags: ["Kisah Sukses", "Manajemen", "Scale Up"]
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  { 
    id: 1, 
    title: "Instalasi Cafe Solo Baru", 
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800",
    description: "Proses instalasi sistem POS full-set di salah satu klien kami, 'Kopi Senja', yang berlokasi di kawasan bisnis Solo Baru. Tantangan utama dalam proyek ini adalah integrasi sistem pesanan dapur (Kitchen Display System) dengan kasir depan agar meminimalisir kesalahan pesanan saat jam sibuk. Kami menggunakan topologi jaringan LAN hybrid untuk memastikan koneksi tetap stabil meskipun wifi pengunjung sedang penuh. Pengerjaan selesai dalam waktu 4 jam termasuk training karyawan."
  },
  { 
    id: 2, 
    title: "Training Staff Minimarket", 
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=800",
    description: "Sesi pelatihan intensif bagi staff kasir 'Mart Jaya' di Kartasura. Kami percaya bahwa teknologi canggih harus didukung oleh SDM yang kompeten. Materi training mencakup cara input barang, penanganan retur, pembayaran via QRIS, dan troubleshooting dasar jika printer macet. Antusiasme peserta sangat tinggi, dan mereka bisa langsung mengoperasikan mesin kasir mandiri dalam waktu kurang dari 30 menit."
  },
  { 
    id: 3, 
    title: "Demo Mesin Kiosk Mandiri", 
    type: 'video', 
    image_url: "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d1f?auto=format&fit=crop&q=80&w=800", 
    video_url: "https://www.youtube.com/embed/lxT1B-XhF7k?si=123", 
    description: "Video demonstrasi penggunaan Mesin Kiosk Self-Service terbaru kami. Fitur ini memungkinkan pelanggan untuk memilih menu, melakukan kustomisasi pesanan (misal: less sugar, extra shot), dan melakukan pembayaran non-tunai secara mandiri tanpa perlu antri di kasir. Cocok untuk restoran cepat saji yang mengutamakan kecepatan pelayanan."
  },
  { 
    id: 4, 
    title: "Pameran UMKM 2023", 
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800",
    description: "Partisipasi PT Mesin Kasir Solo dalam ajang Solo Great Sale & Expo UMKM. Booth kami dikunjungi oleh lebih dari 500 pelaku usaha yang berkonsultasi mengenai digitalisasi bisnis. Kami mendemokan bagaimana sebuah warung kelontong kecil bisa memiliki manajemen stok setara minimarket modern hanya dengan menggunakan aplikasi kasir Android kami."
  },
  {
    id: 5,
    title: "Setup Toko Baju Distro",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800",
    description: "Implementasi sistem kasir barcode untuk distro clothing di area Manahan. Sistem ini membantu owner memantau stok size dan warna baju secara real-time. Dilengkapi dengan scanner barcode 2D untuk mempercepat proses checkout saat event diskon besar-besaran."
  },
  {
    id: 6,
    title: "Pemasangan Resto Seafood",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
    description: "Instalasi 3 titik kasir dan 2 printer dapur untuk restoran seafood keluarga yang luas. Sistem mendukung split bill, open bill, dan manajemen reservasi meja. Hardware menggunakan PC All-in-One yang tahan cipratan air dan minyak."
  },
  {
    id: 7,
    title: "Training Staff Apotek",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800",
    description: "Pelatihan khusus untuk staff apotek dalam mengelola masa kadaluarsa (expired date) obat dan stok opname obat-obatan keras. Sistem kami memiliki fitur notifikasi otomatis jika ada obat yang hampir kadaluarsa, sangat membantu manajemen inventory apotek."
  },
  {
    id: 8,
    title: "Maintenance Rutin Klien",
    type: 'image',
    image_url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
    description: "Tim teknis kami melakukan kunjungan rutin untuk pengecekan hardware dan update software di salah satu klien korporat. Layanan after-sales adalah prioritas utama kami untuk memastikan bisnis klien berjalan tanpa hambatan teknis."
  }
];
