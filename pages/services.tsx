
import React from 'react';
import { 
  Monitor, Smartphone, Globe, Zap, Database, Lock, Search, 
  BarChart, TrendingUp, RefreshCw, ShieldCheck, Server, 
  Code, ArrowRight, CheckCircle2, Layout, PenTool, Store, MousePointer2, Clock, ShoppingBag, Award,
  FileSpreadsheet, Cpu, GitMerge, Users, PieChart, Layers, 
  Megaphone, Target, DollarSign, MapPin, Anchor, LineChart
} from 'lucide-react';
import { Button, Card, SectionHeader } from '../components/ui';

// --- SHARED COMPONENTS ---

const ServiceHero = ({ 
  title, 
  highlight, 
  subtitle, 
  icon: Icon 
}: { 
  title: string, 
  highlight: string, 
  subtitle: string, 
  icon: any 
}) => (
  <section className="relative py-20 overflow-hidden border-b border-white/5">
    <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
    <div className="container mx-auto px-4 relative z-10 text-center">
      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-orange mx-auto mb-6 shadow-neon border border-white/10">
        <Icon size={32} />
      </div>
      <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
        {title} <span className="text-brand-orange">{highlight}</span>
      </h1>
      <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-8">
        {subtitle}
      </p>
      <div className="flex justify-center gap-4">
        <a 
          href="https://wa.me/6282325103336?text=Halo, saya ingin konsultasi strategi SEO agar tidak ketergantungan iklan."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-xl font-bold transition-all shadow-action hover:shadow-action-strong"
        >
          Konsultasi Strategi <ArrowRight size={18} />
        </a>
      </div>
    </div>
  </section>
);

const FeatureGrid = ({ features }: { features: { title: string, desc: string, icon: any }[] }) => (
  <section className="py-16 bg-brand-dark">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card key={i} className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group transition-all duration-300">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-brand-orange mb-4 border border-white/10 group-hover:bg-brand-orange group-hover:text-white transition-colors">
              <f.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const WorkflowSection = ({ steps }: { steps: { step: string, title: string, desc: string }[] }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <SectionHeader title="Bagaimana" highlight="Kami Bekerja" subtitle="Proses transparan dan terstruktur untuk hasil terbaik." />
      <div className="grid md:grid-cols-4 gap-6 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-orange/0 via-brand-orange/30 to-brand-orange/0"></div>
        
        {steps.map((s, i) => (
          <div key={i} className="relative pt-8 text-center group">
            <div className="w-8 h-8 rounded-full bg-brand-dark border-2 border-brand-orange text-brand-orange font-bold flex items-center justify-center mx-auto mb-4 relative z-10 shadow-neon group-hover:scale-110 transition-transform">
              {i + 1}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
            <p className="text-sm text-gray-400 max-w-[200px] mx-auto">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- 1. WEBSITE DEVELOPMENT PAGE ---
export const WebsiteServicePage = () => {
  const features = [
    { title: "SEO Domination", desc: "Kami tidak cuma bikin web cantik. Kami merancang struktur agar bisnis Anda mudah ditemukan di Google (Mesin Pencari Pelanggan).", icon: Search },
    { title: "Toko Buka 24 Jam", desc: "Toko fisik Anda tutup jam 9 malam? Website Anda tetap jualan jam 2 pagi. Tangkap order saat Anda tidur.", icon: Clock },
    { title: "Kecepatan Kilat", desc: "Pengunjung kabur jika web loading > 3 detik. Kami optimasi kode & server agar web Anda ngebut maksimal.", icon: Zap },
    { title: "Brand Authority", desc: "Di era digital, bisnis tanpa website dianggap tidak bonafit. Tingkatkan kepercayaan supplier & customer.", icon: Award },
    { title: "Katalog Online", desc: "Showcase ribuan produk tanpa sewa ruko mahal. Biarkan pelanggan melihat koleksi lengkap Anda dari HP mereka.", icon: ShoppingBag },
    { title: "Siap Integrasi POS", desc: "Dibangun dengan mindset integrasi masa depan. Siap hubungkan data website dengan Mesin Kasir SIBOS.", icon: RefreshCw },
  ];

  const steps = [
    { step: "1", title: "Bedah Bisnis", desc: "Kami pelajari model bisnis Anda, bukan sekadar tanya warna favorit." },
    { step: "2", title: "Strategi Konten", desc: "Merancang struktur halaman yang menjual dan SEO-friendly." },
    { step: "3", title: "Development", desc: "Coding & Desain oleh tim yang mengerti UI/UX Retail." },
    { step: "4", title: "Launch & Training", desc: "Web rilis + Pelatihan cara update konten mandiri." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Website Bukan Sekadar Pajangan." 
        highlight="Ini Cabang Digital Anda." 
        subtitle="Integrasikan kekuatan Toko Fisik (Mesin Kasir) dengan jangkauan Toko Online. Satu ekosistem, omzet maksimal. Jangan biarkan kompetitor merebut pasar digital Anda."
        icon={Globe}
      />
      
      {/* NARRATIVE SECTION: THE MISSING LINK */}
      <section className="py-16 bg-brand-black relative border-b border-white/5">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
                        Banyak web developer hanya paham kode, tapi tidak paham <strong>Retail & Stok</strong>. 
                        Kami berbeda. Sebagai perusahaan Mesin Kasir, kami membangun website dengan pola pikir pengusaha: 
                        Bagaimana data online dan offline bisa sinkron? Bagaimana stok tidak selisih?
                     </p>
                  </div>
               </div>
               <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                     Mengapa Anda Butuh Website dari <span className="text-brand-orange">Ahli Kasir?</span>
                  </h2>
                  <ul className="space-y-4">
                     {[
                        "Struktur kategori produk yang rapi sesuai standar stok gudang.",
                        "Optimasi flow checkout yang mirip logika kasir (cepat & ringkas).",
                        "Persiapan teknis untuk integrasi masa depan dengan SIBOS ERP.",
                        "Dukungan teknis yang paham bahasa bisnis (HPP, Margin, Varian)."
                     ].map((item, i) => (
                        <li key={i} className="flex gap-3 text-gray-300">
                           <CheckCircle2 className="text-brand-orange shrink-0" size={20} />
                           <span>{item}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            </div>
         </div>
      </section>

      <FeatureGrid features={features} />
      <WorkflowSection steps={steps} />
    </div>
  );
};

// --- 2. WEB APP DEVELOPMENT PAGE ---
export const WebAppServicePage = () => {
  const features = [
    { title: "Business Automation", desc: "Ubah proses manual (tulis nota, rekap Excel) menjadi sistem otomatis. Hemat waktu admin hingga 70%.", icon: Cpu },
    { title: "Centralized Data", desc: "Satu database pusat untuk semua cabang. Tidak ada lagi drama 'file Excel yang mana yang terbaru?'.", icon: Database },
    { title: "Real-time Dashboard", desc: "Pantau omzet, stok, dan kinerja karyawan detik ini juga dari HP Anda, di mana saja.", icon: PieChart },
    { title: "Role Management", desc: "Batasi akses karyawan. Kasir hanya bisa input penjualan, tidak bisa melihat HPP atau laba bersih.", icon: Users },
    { title: "API Integration", desc: "Hubungkan sistem dengan Payment Gateway, WhatsApp Notif, atau sistem Supplier.", icon: GitMerge },
    { title: "Asset Ownership", desc: "Berbeda dengan langganan SaaS, aplikasi custom adalah ASET ANDA. Database milik Anda sepenuhnya.", icon: ShieldCheck },
  ];

  const steps = [
    { step: "1", title: "Audit Alur", desc: "Kami memetakan 'benang kusut' di operasional Anda saat ini." },
    { step: "2", title: "Blueprint", desc: "Merancang arsitektur database dan flow sistem yang efisien." },
    { step: "3", title: "Agile Dev", desc: "Pengerjaan bertahap dengan feedback rutin agar sesuai ekspektasi." },
    { step: "4", title: "UAT & Live", desc: "User Acceptance Test (Uji Coba) sebelum peluncuran resmi." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Jangan Biarkan Bisnis" 
        highlight="Diatur Spreadsheet." 
        subtitle="Saatnya beralih ke Custom Web App. Sistem operasi digital yang dirancang khusus mengikuti alur unik bisnis Anda, bukan sebaliknya."
        icon={Layers}
      />

      {/* NARRATIVE SECTION: THE EXCEL TRAP */}
      <section className="py-16 bg-brand-black relative border-b border-white/5">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
               <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                     Keluar dari Jebakan <span className="text-red-500">Manual Admin</span>
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                     Bisnis Anda tumbuh, tapi pekerjaan admin makin "menggila"? Data stok selisih, orderan tercecer di chat WhatsApp, dan Anda buta terhadap profit harian?
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                     Aplikasi Siap Pakai (SaaS) seringkali <strong>terlalu kaku</strong>. Fitur yang Anda butuhkan tidak ada, fitur yang tidak butuh malah menumpuk.
                  </p>
                  <div className="bg-brand-dark border-l-4 border-brand-orange p-4 rounded-r-lg">
                     <p className="text-white italic">
                        "Custom Web App adalah baju yang dijahit khusus untuk badan bisnis Anda. Pas, Nyaman, dan Membuat Anda Bergerak Lebih Cepat."
                     </p>
                  </div>
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
                           <span>Laporan Otomatis Real-time (0 detik)</span>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <FeatureGrid features={features} />
      <WorkflowSection steps={steps} />
    </div>
  );
};

// --- 3. SEO OPTIMIZATION PAGE (REVISED NARRATIVE) ---
export const SeoServicePage = () => {
  const features = [
    { title: "Buying Intent Keywords", desc: "Kami tidak menargetkan 'kata kunci sampah' yang hanya mendatangkan traffic tanpa penjualan. Kami riset kata kunci yang diketik orang saat SIAP BELI.", icon: Target },
    { title: "Stop 'Bakar Uang' Iklan", desc: "Iklan (Ads) itu seperti sewa rumah; berhenti bayar, Anda diusir. SEO adalah investasi properti; asetnya milik Anda selamanya.", icon: DollarSign },
    { title: "Dominasi Lokal (GMB)", desc: "Pastikan toko Anda muncul di Google Maps saat orang mencari 'Kasir terdekat' atau produk Anda di kota Anda.", icon: MapPin },
    { title: "Technical Audit", desc: "Google membenci web lambat & error. Kami perbaiki 'jeroan' website agar mudah dibaca robot Google.", icon: Layers },
    { title: "Authority Content", desc: "Artikel yang tidak hanya disukai Google, tapi juga mengedukasi calon pembeli bahwa ANDALAH solusinya.", icon: PenTool },
    { title: "Safe Backlink Strategy", desc: "Membangun reputasi digital dengan cara aman (White Hat), bukan cara curang yang berisiko di-banned Google.", icon: ShieldCheck },
  ];

  const steps = [
    { step: "1", title: "Audit & Riset", desc: "Mencari celah kompetitor dan kata kunci 'uang' yang belum digarap." },
    { step: "2", title: "On-Page Fix", desc: "Memperbaiki struktur website agar ramah Google (Speed, Mobile, Meta)." },
    { step: "3", title: "Content Asset", desc: "Memproduksi konten pilar yang menjawab masalah customer." },
    { step: "4", title: "Off-Page Authority", desc: "Meningkatkan kepercayaan domain di mata Google secara bertahap." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Berhenti Membakar" 
        highlight="Uang Iklan." 
        subtitle="Ubah Website Anda menjadi Aset Digital yang bekerja 24 jam. Datangkan pelanggan potensial secara organik tanpa perlu bayar per klik selamanya."
        icon={LineChart}
      />

      {/* NARRATIVE SECTION: THE TRAFFIC TRAP */}
      <section className="py-16 bg-brand-black relative border-b border-white/5">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
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
                        Saat Anda berhenti beriklan di Google/FB Ads, traffic Anda <strong>NOL</strong> detik itu juga. 
                        Dengan SEO, traffic terus mengalir bahkan saat Anda sedang tidur atau liburan. 
                        Bangun aset, jangan cuma menyewa.
                     </p>
                  </div>
               </div>
               
               <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                     Dominasi <span className="text-brand-orange">Halaman 1</span> Google
                  </h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                     Pelanggan tidak mencari Anda di halaman 2. Jika website Anda tidak ada di halaman 1, bisnis Anda <strong>tidak terlihat</strong>.
                  </p>
                  <p className="text-gray-400 leading-relaxed mb-6">
                     Kami tidak menjanjikan trik sulap instan. SEO adalah maraton, bukan lari sprint. Tapi hasilnya adalah <strong>Monopoli Pasar</strong> jangka panjang yang sulit digoyahkan kompetitor.
                  </p>
                  <div className="flex gap-4">
                      <div className="flex items-center gap-2 text-white font-bold bg-brand-orange/10 px-4 py-2 rounded-lg border border-brand-orange/20">
                          <TrendingUp size={18} className="text-brand-orange"/>
                          <span>Sustainable Growth</span>
                      </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      <FeatureGrid features={features} />
      <WorkflowSection steps={steps} />
    </div>
  );
};

// --- 4. MAINTENANCE PAGE ---
export const MaintenanceServicePage = () => {
  const features = [
    { title: "Daily Backup", desc: "Pencadangan data website setiap hari ke server terpisah untuk keamanan maksimal.", icon: Database },
    { title: "Update System", desc: "Pembaruan rutin core website, plugin, dan patch keamanan terbaru.", icon: RefreshCw },
    { title: "Malware Scan", desc: "Scanning rutin untuk mencegah serangan virus, hack, atau injeksi script berbahaya.", icon: ShieldCheck },
    { title: "Uptime Monitor", desc: "Pemantauan server 24/7. Kami tahu duluan jika website Anda down sebelum Anda tahu.", icon: Monitor },
    { title: "Speed Optimization", desc: "Pembersihan cache dan optimasi database rutin agar website tetap ngebut.", icon: Zap },
    { title: "Minor Edit", desc: "Bantuan edit konten ringan (ganti foto/teks) tanpa biaya tambahan.", icon: PenTool },
  ];

  const steps = [
    { step: "1", title: "Akses", desc: "Serah terima akses Cpanel/Admin untuk kami audit." },
    { step: "2", title: "Cleaning", desc: "Pembersihan awal bug dan optimasi keamanan dasar." },
    { step: "3", title: "Monitoring", desc: "Pemasangan alat pantau uptime dan keamanan." },
    { step: "4", title: "Laporan", desc: "Laporan kesehatan website dikirim setiap bulan." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Website" 
        highlight="Maintenance" 
        subtitle="Fokus urus bisnis, biarkan kami yang menjaga website Anda tetap aman, cepat, dan selalu online 24 jam."
        icon={ShieldCheck}
      />
      <FeatureGrid features={features} />
      <WorkflowSection steps={steps} />
    </div>
  );
};
