
import React from 'react';
import { 
  Globe, Zap, Database, Lock, Search, 
  TrendingUp, RefreshCw, ShieldCheck, 
  ArrowRight, CheckCircle2, Store, Clock, ShoppingBag, Award,
  FileSpreadsheet, Cpu, GitMerge, Users, PieChart, Layers, 
  Megaphone, Target, DollarSign, MapPin, Anchor, LineChart,
  ShieldAlert, Activity, LifeBuoy, PenTool, Star, MousePointer,
  Server, Key, Eye, TrendingDown, Skull, Wrench, HardDrive
} from 'lucide-react';
import { ServiceHero, FeatureGrid, WorkflowSection, NarrativeSection } from '../components/service-parts';
import { InvestmentSimulator, CalcData } from '../components/calculator';

// ==========================================
// 1. DATA CONSTANTS & CALCULATOR DATA
// ==========================================

const WEBSITE_DATA = {
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

const WEBSITE_CALC: CalcData = {
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

const WEBAPP_DATA = {
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

const WEBAPP_CALC: CalcData = {
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

const SEO_DATA = {
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

const SEO_CALC: CalcData = {
  title: "Mahar Kuasai Google",
  subtitle: "Iklan itu bakar duit (Cost). SEO itu nanam pohon duit (Investasi). Pilih bibit lo sekarang.",
  baseLabel: "Target Kekuasaan",
  baseOptions: [
    { id: 'local', label: 'Juragan Lokal (Kota)', price: 2500000, desc: 'Dominasi nama kota & Google Maps. Cocok buat toko fisik/jasa servis.' },
    { id: 'niche', label: 'Pemain Niche (Produk)', price: 5000000, desc: 'Target kata kunci spesifik produk. Cocok buat distributor/produsen.' },
    { id: 'high', label: 'Raja Nasional (Industri)', price: 10000000, desc: 'Hajar kompetitor raksasa. Target seluruh Indonesia.' }
  ],
  addonLabel: "Amunisi Tambahan",
  addons: [
    { id: 'gbp_seo', label: 'Poles Google Maps', price: 1500000, desc: 'Audit total, posting rutin, & manajemen reputasi review.' },
    { id: 'audit', label: 'Bedah Website Total', price: 1000000, desc: 'Cari penyakit kenapa web lo sepi.' },
    { id: 'content', label: '10x Artikel Pancingan', price: 1500000, desc: 'Konten pilar SEO 1000+ kata.' },
    { id: 'backlink', label: 'Suntik Power (Backlink)', price: 2000000, desc: 'Media nasional & PBN High DA/PA.' },
    { id: 'speed', label: 'Oprek Speed', price: 1000000, desc: 'Biar loading di bawah 2 detik.' },
    { id: 'ai_writer', label: 'Setup AI Content', price: 3000000, desc: 'Generator artikel otomatis via API.' }
  ]
};

const MAINTENANCE_DATA = {
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

const MAINTENANCE_CALC: CalcData = {
  title: "Biaya Jasa Satpam Digital",
  subtitle: "Lebih murah bayar gue daripada bayar tebusan ke hacker (Ransomware). Pilih level penjagaan lo.",
  baseLabel: "Level Penjagaan",
  baseOptions: [
    { id: 'basic', label: 'Pos Kamling (Basic)', price: 500000, desc: 'Backup Mingguan & Update Plugin standar.' },
    { id: 'pro', label: 'Bodyguard (Business)', price: 1500000, desc: 'Backup Harian, Security Scan, Uptime Monitor, Laporan.' },
    { id: 'vip', label: 'Kopassus (VIP)', price: 3000000, desc: 'Prioritas Support, Audit Manual, Perbaikan Error Code.' }
  ],
  addonLabel: "Layanan Insidental",
  addons: [
    { id: 'clean', label: 'Bersih Virus (Hack Fix)', price: 1500000, desc: 'P3K kalau web lo udah kena hack.' },
    { id: 'migrasi', label: 'Pindahan Server', price: 750000, desc: 'Pindah hosting tanpa downtime.' },
    { id: 'content', label: 'Update Konten/Produk', price: 500000, desc: 'Per batch update.' },
    { id: 'speed', label: 'Speed Booster', price: 1000000, desc: 'Optimasi loading speed via Cloudflare & Cache.' }
  ]
};

// ==========================================
// 2. PAGE COMPONENT IMPLEMENTATIONS
// ==========================================

// --- WEBSITE PAGE ---
export const WebsiteServicePage = () => {
  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Web Itu" 
        highlight="Ruko Digital." 
        subtitle="Jangan cuma sewa lapak (Sosmed) doang. Bangun 'Sertifikat Hak Milik' (SHM) lo sendiri di internet. Gue bantu lo punya aset digital yang gak bisa diban."
        icon={Globe}
      />
      
      <NarrativeSection>
         <div className="relative">
            <div className="absolute inset-0 bg-brand-orange/20 blur-[80px] rounded-full"></div>
            <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center gap-4 text-white">
                  <Store size={40} className="text-gray-500" />
                  <ArrowRight size={24} className="text-brand-orange animate-pulse" />
                  <Globe size={40} className="text-brand-orange" />
                </div>
                <h3 className="text-2xl font-bold text-white">Warning: Slot Terbatas</h3>
                <p className="text-gray-400 leading-relaxed">
                  "Jujur aja, banyak jasa web 500 ribuan di luar sana. Hasilnya? **Sampah Digital.** Gak ada traffic, cuma pajangan. Gue kerjain ini pake strategi dagang, bukan cuma template gratisan. <strong>Gue pegang sendiri, makanya slotnya dikit.</strong>"
                </p>
            </div>
         </div>
         <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Kenapa Harus Sama <span className="text-brand-orange">Tukang Kasir?</span>
            </h2>
            <p className="text-gray-400 mb-6">
                Karena gue ngerti <strong>duit masuk</strong>. Gue gak peduli web lo warna-warni kalau gak ada yang beli. Gue desain web lo layaknya toko fisik yang siap transaksi.
            </p>
            <ul className="space-y-4">
                {[
                  "Struktur Kategori Produk rapi (Standar Gudang).",
                  "Tombol 'Beli' yang nampol dan jelas.",
                  "Loading cepet biar pembeli gak kabur.",
                  "Siap integrasi sama sistem kasir/ERP nanti."
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                      <CheckCircle2 className="text-brand-orange shrink-0" size={20} />
                      <span>{item}</span>
                  </li>
                ))}
            </ul>
         </div>
      </NarrativeSection>

      <FeatureGrid features={WEBSITE_DATA.features} />
      
      {/* CALCULATOR SECTION */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
         <div className="container mx-auto px-4">
            <InvestmentSimulator data={WEBSITE_CALC} serviceName="Jasa Pembuatan Website (Ruko Digital)" />
         </div>
      </section>

      <WorkflowSection steps={WEBSITE_DATA.steps} />
    </div>
  );
};

// --- WEB APP PAGE ---
export const WebAppServicePage = () => {
  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Stop Jadi" 
        highlight="Budak Excel." 
        subtitle="Lupain aplikasi langganan yang fiturnya 'nanggung'. Bangun sistem operasi bisnis yang ngikutin cara kerja lo, bukan lo yang dipaksa ngikutin cara kerja aplikasi."
        icon={Layers}
      />

      <NarrativeSection>
         <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Lo Owner, Bukan <span className="text-red-500">Admin.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Masih jaman rekap nota manual tiap malem? Masih jaman stok opname pake kertas terus selisih mulu? Itu tanda <strong>sistem lo purba</strong>.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
                Gue tawarkan <strong>Custom Web App (ERP)</strong>. Ini bukan aplikasi pasaran yang lo sewa (SaaS). Ini aplikasi yang lo <strong>Miliki Sepenuhnya</strong>. Database di tangan lo, source code di tangan lo. Gak ada cerita data disandera vendor kalau telat bayar langganan.
            </p>
            <div className="bg-brand-dark border-l-4 border-brand-orange p-4 rounded-r-lg">
                <p className="text-white italic text-sm">
                  "Software sewa (SaaS) itu kayak ngontrak rumah. Murah di awal, tapi lo gak bisa renovasi dan bisa diusir kapan aja. Custom App itu kayak bangun rumah sendiri."
                </p>
            </div>
         </div>
         
         <div className="relative">
            <div className="absolute inset-0 bg-brand-orange/10 blur-[80px] rounded-full"></div>
            <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <FileSpreadsheet size={32} />
                  <ArrowRight size={24} className="text-brand-orange animate-pulse" />
                  <Database size={32} className="text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-white">Revolusi Cara Kerja</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-gray-400">
                      <span className="text-red-500">❌</span> 
                      <span>Lupa catat pengeluaran kecil</span>
                  </li>
                  <li className="flex gap-3 text-sm text-gray-400">
                      <span className="text-red-500">❌</span> 
                      <span>Karyawan hapus transaksi (Fraud)</span>
                  </li>
                  <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded">
                      <CheckCircle2 className="text-brand-orange shrink-0" size={16} />
                      <span>Semua tercatat & terlacak (Audit Trail)</span>
                  </li>
                </ul>
            </div>
         </div>
      </NarrativeSection>

      <FeatureGrid features={WEBAPP_DATA.features} />

      {/* CALCULATOR SECTION */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
         <div className="container mx-auto px-4">
            <InvestmentSimulator data={WEBAPP_CALC} serviceName="Jasa Custom Web App (ERP)" />
         </div>
      </section>

      <WorkflowSection steps={WEBAPP_DATA.steps} />
    </div>
  );
};

// --- SEO PAGE ---
export const SeoServicePage = () => {
  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Berhenti Membakar" 
        highlight="Uang Iklan." 
        subtitle="Iklan itu kayak sewa ruko, telat bayar langsung diusir. SEO itu kayak beli tanah, makin lama makin mahal harganya. Gue bantu lo bangun aset digital yang gak perlu setoran harian ke Google."
        icon={LineChart}
      />

      <NarrativeSection>
         <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 bg-brand-orange/10 blur-[80px] rounded-full"></div>
            <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <div className="text-center">
                      <Megaphone size={32} className="text-red-500 mx-auto mb-2" />
                      <p className="text-xs font-bold text-red-500">PAID ADS</p>
                      <p className="text-[10px]">Sewa Traffic (Ngontrak)</p>
                  </div>
                  <div className="h-px w-20 bg-gray-700"></div>
                  <div className="text-center">
                      <Anchor size={32} className="text-brand-orange mx-auto mb-2" />
                      <p className="text-xs font-bold text-brand-orange">SEO ORGANIC</p>
                      <p className="text-[10px]">Aset Sendiri (SHM)</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white">Sewa vs Beli</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-gray-400">
                      <span className="text-red-500"><TrendingDown size={16}/></span> 
                      <span>Ads: Budget abis = Traffic NOL.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-gray-400">
                      <span className="text-red-500"><Skull size={16}/></span> 
                      <span>Ads: Harga klik makin mahal tiap tahun.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded">
                      <CheckCircle2 className="text-brand-orange shrink-0" size={16} />
                      <span>SEO: Investasi sekali, panen berkali-kali.</span>
                  </li>
                </ul>
            </div>
         </div>
         
         <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Sewa Lapak vs <span className="text-brand-orange">Beli Tanah.</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Logikanya simpel. <strong>Paid Ads (Iklan)</strong> itu lo nyewa traffic. Begitu lo stop bayar, lo 'diusir' dari halaman depan Google.
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
                <strong>SEO</strong> itu lo ngebangun jalan raya sendiri menuju toko lo. Lama di awal, berdarah-darah di awal, tapi begitu jadi... traffic ngalir terus gratisan 24 jam. Lo pilih mana? Jadi juragan tanah atau penyewa abadi?
            </p>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-white font-bold bg-brand-orange/10 px-4 py-2 rounded-lg border border-brand-orange/20">
                    <TrendingUp size={18} className="text-brand-orange"/>
                    <span>Jatah Preman Digital</span>
                </div>
            </div>
         </div>
      </NarrativeSection>

      <FeatureGrid features={SEO_DATA.features} />

      {/* CALCULATOR SECTION */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
         <div className="container mx-auto px-4">
            <InvestmentSimulator data={SEO_CALC} serviceName="Jasa SEO & Traffic" />
         </div>
      </section>

      <WorkflowSection steps={SEO_DATA.steps} />
    </div>
  );
};

// --- MAINTENANCE PAGE ---
export const MaintenanceServicePage = () => {
  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Punya Toko," 
        highlight="Gak Ada Satpam?" 
        subtitle="Di dunia nyata lo pasang CCTV dan gembok. Di internet? Jangan biarkan pintu toko lo terbuka lebar buat maling. Gue jagain aset lo 24 jam."
        icon={ShieldCheck}
      />

      <NarrativeSection>
         <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Jangan Nunggu <span className="text-red-500">Kemalingan</span> Baru Teriak.
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Website itu kayak mesin mobil. Kalau gak pernah di-service, oli gak diganti, jangan kaget kalau tiba-tiba mogok di jalan pas lagi ngebut (baca: pas traffic lagi tinggi).
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
                Hacker gak peduli bisnis lo kecil atau gede. Mereka cuma cari celah. Sekali data pelanggan bocor atau website kena ransomware, reputasi yang lo bangun tahunan hancur dalam semalam.
            </p>
            <div className="bg-brand-dark border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-white italic text-sm">
                  "Maintenance itu bukan biaya, tapi <strong>Asuransi Ketenangan</strong>. Lo fokus jualan, teknis biar gue yang jagain."
                </p>
            </div>
         </div>
         
         <div className="relative">
            <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full"></div>
            <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <ShieldAlert size={32} className="text-red-500 animate-pulse" />
                  <ArrowRight size={24} className="text-gray-600" />
                  <ShieldCheck size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Risiko vs Solusi</h3>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400 text-sm">Server Down</span>
                      <span className="text-red-400 text-xs font-bold">Hilang Omzet</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400 text-sm">Kena Hack</span>
                      <span className="text-red-400 text-xs font-bold">Hilang Data & Reputasi</span>
                  </li>
                  <li className="flex items-center justify-between">
                      <span className="text-white font-bold text-sm">Jasa Satpam Digital</span>
                      <span className="text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Tidur Nyenyak</span>
                  </li>
                </ul>
            </div>
         </div>
      </NarrativeSection>

      <FeatureGrid features={MAINTENANCE_DATA.features} />

      {/* CALCULATOR SECTION */}
      <section className="py-16 bg-brand-dark border-t border-white/5">
         <div className="container mx-auto px-4">
            <InvestmentSimulator data={MAINTENANCE_CALC} serviceName="Jasa Maintenance & Keamanan" />
         </div>
      </section>

      <WorkflowSection steps={MAINTENANCE_DATA.steps} />
    </div>
  );
};
