
import { Target, MapPin, Zap, Award, ShoppingBag, GitMerge, Eye, Lock, ShieldAlert, Cpu, Server, Anchor, Layers, PenTool, ShieldCheck, HardDrive, Activity, RefreshCw, LifeBuoy } from 'lucide-react';
import { CalcData } from '../calculator';

export const WEBSITE_DATA = {
  features: [
    { title: "Jatah Preman (SEO)", desc: "Web lo gue setting biar 'akrab' sama Google. Pas orang cari produk lo, web lo nongol duluan.", icon: Target },
    { title: "Tancap Bendera (G-Maps)", desc: "Gratis setup titik Google Maps biar toko fisik lo valid dan gampang dicari kurir.", icon: MapPin },
    { title: "Anti Lemot", desc: "Loading web < 3 detik. Karena pembeli sekarang itu nggak sabaran. Lemot dikit, kabur ke kompetitor.", icon: Zap },
    { title: "Biar Gak Dikira Tipu-Tipu", desc: "Web resmi pake domain .com/.id bikin level trust naik 1000%. Supplier & Customer lebih segan.", icon: Award },
    { title: "Katalog 24 Jam", desc: "Showcase ribuan produk tanpa sewa ruko mahal. Toko lo buka terus pas lo lagi tidur.", icon: ShoppingBag },
    { title: "Siap Integrasi SIBOS", desc: "Dibangun dengan pondasi yang siap dikawinkan sama sistem kasir SIBOS gue nanti.", icon: GitMerge },
  ],
  steps: [
    { step: "1", title: "Interogasi Bisnis", desc: "Gue gak cuma tanya warna favorit. Gue tanya: Siapa pembeli lo? Apa produk unggulan lo?" },
    { step: "2", title: "Racik Strategi", desc: "Gue susun struktur menu dan copywriting yang memancing orang buat klik tombol beli." },
    { step: "3", title: "Bangun Pondasi", desc: "Coding & Desain oleh tim gue. Bukan pake template pasaran yang berat." },
    { step: "4", title: "Serah Terima Kunci", desc: "Web rilis. Gue ajarin cara ganti foto & harga sendiri. Lo pegang kendali penuh." },
  ]
};

export const WEBSITE_CALC: CalcData = {
  title: "Cek Mahar Ruko Digital",
  subtitle: "Jangan kaget kalau harga gue beda sama jasa 500 ribuan. Gue jual ASET, bukan sampah digital.",
  baseLabel: "Pilih Ukuran Ruko",
  baseOptions: [
    { id: 'lp', label: 'Landing Page (Kios)', price: 1500000, desc: 'Satu halaman panjang. Fokus hajar 1 produk biar closing.' },
    { id: 'compro', label: 'Company Profile (Kantor)', price: 3500000, desc: 'Branding perusahaan lengkap. Buat yang mau main tender/B2B.' },
    { id: 'toko', label: 'Toko Online (Minimarket)', price: 6500000, desc: 'Ada keranjang belanja, katalog banyak, itung ongkir otomatis.' }
  ],
  addonLabel: "Senjata Tambahan (Opsional)",
  addons: [
    { id: 'domain', label: 'Domain .COM / .ID (Sertifikat)', price: 300000 },
    { id: 'gbp_web', label: 'Verifikasi Google Bisnis', price: 750000, desc: 'Biar muncul di Peta.' },
    { id: 'copy', label: 'Copywriting (Sales Letter)', price: 750000, desc: 'Kata-kata yang nge-hipnotis pembeli.' },
    { id: 'seo_basic', label: 'SEO Setup Basic', price: 500000 },
    { id: 'wa_rotator', label: 'Rotator WhatsApp', price: 1200000, desc: 'Kalau CS lo banyak, chat dibagi rata.' },
    { id: 'ai_chat', label: 'Chatbot AI Sederhana', price: 3000000, desc: 'Jawab pertanyaan umum otomatis.' }
  ]
};

export const WEBAPP_DATA = {
  features: [
    { title: "Mata Tuhan (Dashboard)", desc: "Pantau omzet, stok, dan kinerja karyawan detik ini juga dari HP lo. Gak perlu nunggu laporan sore.", icon: Eye },
    { title: "Tembok Api (Role)", desc: "Lo Bos, lo lihat semua. Kasir cuma bisa input, gak bisa lihat modal/laba. Privasi dapur aman.", icon: Lock },
    { title: "Anti-Tuyul (Audit Log)", desc: "Setiap klik, edit, dan hapus data tercatat. Karyawan mau main curang? Ketahuan jam berapa dan siapa pelakunya.", icon: ShieldAlert },
    { title: "Kerja Rodi Otomatis", desc: "Hitung gaji, komisi, stok opname, laba rugi biarin sistem yang ngerjain. Lo fokus cari duit.", icon: Cpu },
    { title: "Jembatan Penghubung", desc: "Bisa disambungin ke Payment Gateway (QRIS), WhatsApp Notif, atau sistem Supplier.", icon: GitMerge },
    { title: "Sertifikat Hak Milik", desc: "Source code & Database gue serahin ke lo. Gak ada biaya langganan bulanan yang nyekik.", icon: Server },
  ],
  steps: [
    { step: "1", title: "Bedah Masalah", desc: "Kita duduk bareng. Lo curhat semua proses manual yang bikin pusing." },
    { step: "2", title: "Blueprint Arsitek", desc: "Gue gambar alur sistemnya. Database-nya kayak apa, flow-nya gimana." },
    { step: "3", title: "Ngoding (Proses)", desc: "Gue bangun sistemnya. Lo bisa cek progress berkala." },
    { step: "4", title: "Serah Terima", desc: "Deployment ke server lo. Training staff sampai bisa. Source code diserahin." },
  ]
};

export const WEBAPP_CALC: CalcData = {
  title: "Rakitan Sistem Sultan (ERP)",
  subtitle: "Sistem custom itu investasi sekali seumur hidup. Mahal di depan, tapi lo BEBAS biaya langganan selamanya.",
  baseLabel: "Kompleksitas Sistem",
  baseOptions: [
    { id: 'simple', label: 'MVP (Rintisan)', price: 5000000, desc: 'Pencatatan sederhana. Input -> Output -> Laporan PDF.' },
    { id: 'mid', label: 'Scale Up (Cabang)', price: 15000000, desc: 'Multi-user, Stok Gudang, Kasir, Laporan Keuangan.' },
    { id: 'high', label: 'Empire (Pabrik)', price: 35000000, desc: 'Manufaktur, HR Payroll, API Bank, Custom Logic Rumit.' }
  ],
  addonLabel: "Modul Canggih",
  addons: [
    { id: 'server', label: 'Cloud Server Setup (VPS)', price: 1500000, desc: 'Rumah buat sistem lo.' },
    { id: 'wa_notif', label: 'Bot WhatsApp Notif', price: 1500000, desc: 'Laporan omzet masuk ke WA lo tiap tutup toko.' },
    { id: 'payment', label: 'Payment Gateway', price: 2000000, desc: 'Terima QRIS/Virtual Account otomatis lunas.' },
    { id: 'mobile', label: 'Android App Wrapper', price: 2500000, desc: 'Biar staff bisa install di HP kayak aplikasi biasa.' },
    { id: 'ai_insight', label: 'AI Analisa Data', price: 5000000, desc: 'Prediksi stok habis & tren penjualan.' }
  ]
};

export const SEO_DATA = {
  features: [
    { title: "Kata Kunci 'Uang'", desc: "Gue target kata kunci yang dipake orang pas udah siap transfer (Buying Intent). Bukan cuma yang tanya-tanya doang.", icon: Target },
    { title: "Google Maps Hantu", desc: "Kita bikin toko fisik lo gentayangan di hasil pencarian lokal. Kompetitor lo bakal ngerasa dihantui.", icon: MapPin },
    { title: "Raja Kandang", desc: "Dominasi pencarian satu kota. Orang satu kota wajib tau toko lo kalau cari barang.", icon: Anchor },
    { title: "Beresin Jeroan", desc: "Teknis website lo gue oprek biar disayang robot Google. Loading ngebut, struktur rapi, mobile friendly.", icon: Layers },
    { title: "Konten Menghasut", desc: "Artikel bukan buat menuhin halaman doang, tapi buat edukasi pasar biar mereka ngebet beli produk lo.", icon: PenTool },
    { title: "Backlink Putih (Aman)", desc: "Reputasi digital dibangun pelan tapi pasti. Anti-banned, aman jangka panjang. Bukan spam.", icon: ShieldCheck },
  ],
  steps: [
    { step: "1", title: "Mata-Mata", desc: "Gue intip dapur kompetitor lo. Mereka pake kata kunci apa, backlink dari mana." },
    { step: "2", title: "Oprek Mesin", desc: "Perbaiki struktur website (On-Page) biar Google gampang bacanya." },
    { step: "3", title: "Sebar Jaring", desc: "Bikin konten pilar dan cluster buat nangkep traffic dari berbagai sudut." },
    { step: "4", title: "Suntik Power", desc: "Kasih backlink berkualitas biar domain lo makin dipercaya Google." },
  ]
};

export const SEO_CALC: CalcData = {
  title: "Simulasi Budget Dominasi Google",
  subtitle: "SEO itu maraton, bukan lari sprint. Pilih paket yang sesuai napas budget lo.",
  baseLabel: "Paket Optimasi",
  baseOptions: [
    { id: 'basic', label: 'Starter (Lokal)', price: 2500000, desc: 'Fokus kuasai kata kunci lokal (nama kota).' },
    { id: 'pro', label: 'Pro (Nasional)', price: 5500000, desc: 'Target kata kunci persaingan menengah se-Indonesia.' },
    { id: 'corp', label: 'Enterprise (Dominasi)', price: 12000000, desc: 'Hajar kata kunci "uang" persaingan tinggi.' }
  ],
  addonLabel: "Booster Power",
  addons: [
    { id: 'backlink', label: 'Backlink Media Nasional', price: 1500000, desc: 'Suntik power dari portal berita besar.' },
    { id: 'content', label: 'Paket Artikel Bulanan (10x)', price: 750000, desc: 'Konten pilar & cluster rutin.' },
    { id: 'gmb', label: 'Optimasi Google Maps Ekstrem', price: 1000000, desc: 'Review & sitasi lokal masif.' }
  ]
};

export const MAINTENANCE_DATA = {
  features: [
    { title: "Asuransi Nyawa (Backup)", desc: "Database lo gue backup rutin. Kalau server meledak atau di-hack, gue bisa balikin nyawa bisnis lo dalam hitungan menit.", icon: HardDrive },
    { title: "Satpam Galak (Firewall)", desc: "Gue pasang tembok api. Bot spam, hacker iseng, atau serangan DDoS bakal mental sebelum nyentuh pintu toko lo.", icon: ShieldCheck },
    { title: "Obat Kuat (Performance)", desc: "Website lemot itu penyakit. Gue bersihin sampah database dan cache biar loading tetep ngebut kayak baru.", icon: Zap },
    { title: "CCTV 24 Jam (Uptime)", desc: "Gue tau duluan kalau website lo down sebelum customer lo komplain. Gue pantau detak jantung server 24/7.", icon: Activity },
    { title: "Tukang Renov (Update)", desc: "Plugin dan tema usang itu celah keamanan. Gue update rutin biar dapur pacu lo tetep modern dan aman.", icon: RefreshCw },
    { title: "Konsultan Pribadi", desc: "Bingung mau nambah fitur? Tanya gue dulu. Gue kasih saran teknis biar lo gak salah langkah atau dibohongi vendor lain.", icon: LifeBuoy },
  ],
  steps: [
    { step: "1", title: "Audit Lubang Tikus", desc: "Gue cek semua celah keamanan yang mungkin dimasuki maling digital." },
    { step: "2", title: "Pasang Gembok", desc: "Update patch keamanan, pasang firewall, dan ganti password lemah." },
    { step: "3", title: "Ronda Tiap Malam", desc: "Monitoring otomatis. Ada anomali dikit, alarm gue bunyi." },
    { step: "4", title: "Laporan Bulanan", desc: "Gue kasih rekap: berapa serangan ditangkis, performa server, dan status backup." },
  ]
};

export const MAINTENANCE_CALC: CalcData = {
  title: "Biaya Jaga Lilin (Maintenance)",
  subtitle: "Lebih murah bayar satpam daripada bayar tebusan ke hacker ransomware.",
  baseLabel: "Paket Penjagaan",
  baseOptions: [
    { id: 'basic', label: 'Pos Ronda (Basic)', price: 500000, desc: 'Update plugin & backup bulanan.' },
    { id: 'pro', label: 'Satpam Komplek (Pro)', price: 1500000, desc: 'Uptime monitor 24/7, daily backup, firewall.' },
    { id: 'vip', label: 'Bodyguard (VIP)', price: 3500000, desc: 'Prioritas support, perbaikan error coding, speed optimization.' }
  ],
  addonLabel: "Extra Shield",
  addons: [
    { id: 'cdn', label: 'CDN Enterprise', price: 500000, desc: 'Biar web ngebut diakses dari luar negeri.' },
    { id: 'audit', label: 'Audit Keamanan Tahunan', price: 2500000, desc: 'Penetration testing simulasi hack.' },
    { id: 'content_upload', label: 'Jasa Upload Konten', price: 500000, desc: 'Lo kirim materi, kita yang posting.' }
  ]
};
