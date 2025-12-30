
import React from 'react';
import { 
  Globe, Zap, Database, Lock, Search, 
  TrendingUp, RefreshCw, ShieldCheck, 
  ArrowRight, CheckCircle2, Store, Clock, ShoppingBag, Award,
  FileSpreadsheet, Cpu, GitMerge, Users, PieChart, Layers, 
  Megaphone, Target, DollarSign, MapPin, Anchor, LineChart,
  ShieldAlert, Activity, LifeBuoy, PenTool
} from 'lucide-react';
import { ServiceHero, FeatureGrid, WorkflowSection, NarrativeSection } from '../components/service-parts';

// ==========================================
// 1. DATA CONSTANTS
// ==========================================

const WEBSITE_DATA = {
  features: [
    { title: "SEO Domination", desc: "Struktur website dirancang agar mudah ditemukan di Google (Mesin Pencari Pelanggan).", icon: Search },
    { title: "Toko Buka 24 Jam", desc: "Website Anda tetap jualan jam 2 pagi. Tangkap order saat Anda tidur.", icon: Clock },
    { title: "Kecepatan Kilat", desc: "Optimasi kode & server agar loading website < 3 detik. Anti lemot.", icon: Zap },
    { title: "Brand Authority", desc: "Meningkatkan kepercayaan supplier & customer dengan kehadiran digital yang bonafit.", icon: Award },
    { title: "Katalog Online", desc: "Showcase ribuan produk tanpa sewa ruko mahal. Katalog di genggaman pelanggan.", icon: ShoppingBag },
    { title: "Siap Integrasi POS", desc: "Dibangun dengan mindset integrasi masa depan dengan Mesin Kasir SIBOS.", icon: RefreshCw },
  ],
  steps: [
    { step: "1", title: "Bedah Bisnis", desc: "Kami pelajari model bisnis Anda, bukan sekadar tanya warna favorit." },
    { step: "2", title: "Strategi Konten", desc: "Merancang struktur halaman yang menjual dan SEO-friendly." },
    { step: "3", title: "Development", desc: "Coding & Desain oleh tim yang mengerti UI/UX Retail." },
    { step: "4", title: "Launch & Training", desc: "Web rilis + Pelatihan cara update konten mandiri." },
  ]
};

const WEBAPP_DATA = {
  features: [
    { title: "Business Automation", desc: "Ubah proses manual (tulis nota, rekap Excel) menjadi sistem otomatis.", icon: Cpu },
    { title: "Centralized Data", desc: "Satu database pusat untuk semua cabang. Tidak ada lagi drama 'file Excel berbeda'.", icon: Database },
    { title: "Real-time Dashboard", desc: "Pantau omzet, stok, dan kinerja karyawan detik ini juga dari HP Anda.", icon: PieChart },
    { title: "Role Management", desc: "Batasi akses karyawan. Kasir hanya input penjualan, tidak bisa lihat laba bersih.", icon: Users },
    { title: "API Integration", desc: "Hubungkan sistem dengan Payment Gateway, WhatsApp Notif, atau Supplier.", icon: GitMerge },
    { title: "Asset Ownership", desc: "Aplikasi custom adalah ASET ANDA. Database milik Anda sepenuhnya, bukan sewa.", icon: ShieldCheck },
  ],
  steps: [
    { step: "1", title: "Audit Alur", desc: "Kami memetakan 'benang kusut' di operasional Anda saat ini." },
    { step: "2", title: "Blueprint", desc: "Merancang arsitektur database dan flow sistem yang efisien." },
    { step: "3", title: "Agile Dev", desc: "Pengerjaan bertahap dengan feedback rutin." },
    { step: "4", title: "UAT & Live", desc: "User Acceptance Test (Uji Coba) sebelum peluncuran." },
  ]
};

const SEO_DATA = {
  features: [
    { title: "Buying Intent Keywords", desc: "Target kata kunci 'siap beli', bukan sekadar traffic sampah.", icon: Target },
    { title: "Stop 'Bakar Uang' Iklan", desc: "Iklan itu sewa, SEO itu investasi properti. Aset milik Anda selamanya.", icon: DollarSign },
    { title: "Dominasi Lokal (GMB)", desc: "Muncul di Google Maps saat orang mencari produk Anda di kota Anda.", icon: MapPin },
    { title: "Technical Audit", desc: "Perbaiki 'jeroan' website agar mudah dibaca robot Google.", icon: Layers },
    { title: "Authority Content", desc: "Artikel yang mengedukasi dan membangun kepercayaan calon pembeli.", icon: PenTool },
    { title: "Safe Backlink Strategy", desc: "Reputasi digital dengan cara aman (White Hat), anti-banned.", icon: ShieldCheck },
  ],
  steps: [
    { step: "1", title: "Audit & Riset", desc: "Mencari celah kompetitor dan kata kunci 'uang'." },
    { step: "2", title: "On-Page Fix", desc: "Memperbaiki struktur website (Speed, Mobile, Meta)." },
    { step: "3", title: "Content Asset", desc: "Memproduksi konten pilar yang menjawab masalah customer." },
    { step: "4", title: "Off-Page Authority", desc: "Meningkatkan kepercayaan domain secara bertahap." },
  ]
};

const MAINTENANCE_DATA = {
  features: [
    { title: "Digital Insurance", desc: "Backup rutin 'Time Machine' untuk memulihkan website jika terjadi error.", icon: ShieldCheck },
    { title: "Performance Guard", desc: "Membersihkan 'sampah' database dan cache agar loading tetap ngebut.", icon: Zap },
    { title: "Proactive Security", desc: "Memasang firewall dan scanning rutin untuk menangkis serangan.", icon: Lock },
    { title: "Uptime Monitor", desc: "Pemantauan 24/7. Kami tahu website down sebelum Anda tahu.", icon: Activity },
    { title: "Content Update", desc: "Kirim materi, kami yang update. Anda terima beres.", icon: PenTool },
    { title: "Tech Advisory", desc: "Konsultasi fitur baru. CTO (Chief Technology Officer) sewaan Anda.", icon: LifeBuoy },
  ],
  steps: [
    { step: "1", title: "Akses & Audit", desc: "Pengecekan celah keamanan awal." },
    { step: "2", title: "Hardening", desc: "Penguatan sistem pertahanan website." },
    { step: "3", title: "Monitoring", desc: "Pemantauan real-time 24/7." },
    { step: "4", title: "Monthly Report", desc: "Laporan kesehatan website rutin." },
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
        title="Website Bukan Sekadar Pajangan." 
        highlight="Ini Cabang Digital Anda." 
        subtitle="Integrasikan kekuatan Toko Fisik (Mesin Kasir) dengan jangkauan Toko Online. Satu ekosistem, omzet maksimal."
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
                <h3 className="text-2xl font-bold text-white">The Omnichannel Strategy</h3>
                <p className="text-gray-400 leading-relaxed">
                  Kami membangun website dengan pola pikir pengusaha Retail: 
                  Bagaimana data online dan offline bisa sinkron? Bagaimana stok tidak selisih?
                  Kami paham bisnis, bukan sekadar kode.
                </p>
            </div>
         </div>
         <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Mengapa Anda Butuh Website dari <span className="text-brand-orange">Ahli Kasir?</span>
            </h2>
            <ul className="space-y-4">
                {[
                  "Struktur kategori produk rapi sesuai standar gudang.",
                  "Optimasi flow checkout ringkas (seperti kasir).",
                  "Persiapan teknis untuk integrasi SIBOS ERP.",
                  "Dukungan teknis yang paham bahasa bisnis (Margin, Varian)."
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
      <WorkflowSection steps={WEBSITE_DATA.steps} />
    </div>
  );
};

// --- WEB APP PAGE ---
export const WebAppServicePage = () => {
  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Jangan Biarkan Bisnis" 
        highlight="Diatur Spreadsheet." 
        subtitle="Saatnya beralih ke Custom Web App. Sistem operasi digital yang dirancang khusus mengikuti alur unik bisnis Anda."
        icon={Layers}
      />

      <NarrativeSection>
         <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Keluar dari Jebakan <span className="text-red-500">Manual Admin</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Bisnis tumbuh, tapi admin makin pusing? Data stok selisih, orderan tercecer di chat WhatsApp, dan buta profit harian?
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
                Aplikasi Siap Pakai (SaaS) seringkali <strong>terlalu kaku</strong>. Custom Web App adalah baju yang dijahit khusus untuk badan bisnis Anda.
            </p>
         </div>
         
         <div className="relative">
            <div className="absolute inset-0 bg-red-500/10 blur-[80px] rounded-full"></div>
            <div className="relative bg-brand-dark border border-white/10 rounded-2xl p-8 space-y-6">
                <div className="flex items-center justify-between text-gray-500 mb-2">
                  <FileSpreadsheet size={32} />
                  <ArrowRight size={24} className="text-brand-orange animate-pulse" />
                  <Cpu size={32} className="text-brand-orange" />
                </div>
                <h3 className="text-xl font-bold text-white">Transformasi Digital</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-gray-400">
                      <span className="text-red-500">❌</span> 
                      <span>Rekap manual 3 jam/hari</span>
                  </li>
                  <li className="flex gap-3 text-sm text-gray-400">
                      <span className="text-red-500">❌</span> 
                      <span>Data tersebar di 5 file Excel</span>
                  </li>
                  <li className="flex gap-3 text-sm text-white font-bold bg-brand-orange/10 p-2 rounded">
                      <CheckCircle2 className="text-brand-orange shrink-0" size={16} />
                      <span>Laporan Otomatis Real-time</span>
                  </li>
                </ul>
            </div>
         </div>
      </NarrativeSection>

      <FeatureGrid features={WEBAPP_DATA.features} />
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
        subtitle="Ubah Website Anda menjadi Aset Digital yang bekerja 24 jam. Datangkan pelanggan potensial secara organik."
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
                      <p className="text-[10px]">Sewa Traffic</p>
                  </div>
                  <div className="h-px w-20 bg-gray-700"></div>
                  <div className="text-center">
                      <Anchor size={32} className="text-brand-orange mx-auto mb-2" />
                      <p className="text-xs font-bold text-brand-orange">SEO ORGANIC</p>
                      <p className="text-[10px]">Miliki Traffic</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white">Investasi vs Pengeluaran</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Saat berhenti beriklan, traffic NOL. Dengan SEO, traffic terus mengalir bahkan saat Anda tidur. Bangun aset, jangan cuma menyewa.
                </p>
            </div>
         </div>
         
         <div className="order-1 md:order-2">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Dominasi <span className="text-brand-orange">Halaman 1</span> Google
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Pelanggan tidak mencari Anda di halaman 2. Kami bantu bisnis Anda muncul di tempat yang tepat saat orang mengetik kata kunci "Beli".
            </p>
            <div className="flex gap-4">
                <div className="flex items-center gap-2 text-white font-bold bg-brand-orange/10 px-4 py-2 rounded-lg border border-brand-orange/20">
                    <TrendingUp size={18} className="text-brand-orange"/>
                    <span>Sustainable Growth</span>
                </div>
            </div>
         </div>
      </NarrativeSection>

      <FeatureGrid features={SEO_DATA.features} />
      <WorkflowSection steps={SEO_DATA.steps} />
    </div>
  );
};

// --- MAINTENANCE PAGE ---
export const MaintenanceServicePage = () => {
  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Jaga Aset Digital" 
        highlight="Tetap Bernilai." 
        subtitle="Business Continuity & Digital Asset Insurance. Tidur nyenyak sementara kami menjaga 'Toko Online' Anda 24 jam."
        icon={ShieldCheck}
      />

      <NarrativeSection>
         <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                Website Tanpa Maintenance = <span className="text-red-500">Bom Waktu</span>
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6">
                Anda menggembok toko fisik dan membayar satpam. Mengapa toko online Anda dibiarkan <strong>tak terkunci</strong>?
            </p>
            <p className="text-gray-400 leading-relaxed mb-6">
                Serangan cyber tidak pandang bulu. Sekali data pelanggan bocor atau website hilang, reputasi hancur selamanya.
            </p>
            <div className="bg-brand-dark border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-white italic text-sm">
                  "Biaya maintenance jauh lebih murah daripada biaya memulihkan reputasi yang hancur."
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
                      <span className="text-gray-400 text-sm">Website Down</span>
                      <span className="text-red-400 text-xs font-bold">Hilang Omzet</span>
                  </li>
                  <li className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-gray-400 text-sm">Data Hilang</span>
                      <span className="text-red-400 text-xs font-bold">Hilang Kepercayaan</span>
                  </li>
                  <li className="flex items-center justify-between">
                      <span className="text-white font-bold text-sm">Paket Maintenance</span>
                      <span className="text-green-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 size={12}/> Peace of Mind</span>
                  </li>
                </ul>
            </div>
         </div>
      </NarrativeSection>

      <FeatureGrid features={MAINTENANCE_DATA.features} />
      <WorkflowSection steps={MAINTENANCE_DATA.steps} />
    </div>
  );
};
