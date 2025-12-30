import React from 'react';
import { 
  Monitor, Smartphone, Globe, Zap, Database, Lock, Search, 
  BarChart, TrendingUp, RefreshCw, ShieldCheck, Server, 
  Code, ArrowRight, CheckCircle2, Layout, PenTool, Store, MousePointer2, Clock, ShoppingBag, Award
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
          href="https://wa.me/6282325103336?text=Halo, saya ingin konsultasi strategi website untuk bisnis saya."
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-xl font-bold transition-all shadow-action hover:shadow-action-strong"
        >
          Konsultasi Gratis <ArrowRight size={18} />
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

// --- 1. WEBSITE DEVELOPMENT PAGE (REVISED NARRATIVE) ---
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
    { title: "Custom Logic", desc: "Sistem dibangun dari nol sesuai alur bisnis unik perusahaan Anda, bukan template.", icon: Code },
    { title: "Scalable Database", desc: "Menggunakan database modern (Supabase/PostgreSQL) yang siap menampung jutaan data.", icon: Database },
    { title: "Real-time Update", desc: "Data terupdate otomatis tanpa refresh halaman (cocok untuk dashboard monitoring).", icon: RefreshCw },
    { title: "High Security", desc: "Proteksi data berlapis dengan enkripsi standar industri dan manajemen hak akses user.", icon: ShieldCheck },
    { title: "API Integration", desc: "Bisa terhubung dengan layanan lain (Payment Gateway, WA Gateway, ERP, dll).", icon: Server },
    { title: "Multi-Platform", desc: "Aplikasi berbasis web yang bisa diakses dari perangkat apapun via browser.", icon: Monitor },
  ];

  const steps = [
    { step: "1", title: "Analisis Sistem", desc: "Membedah alur bisnis dan masalah yang ingin diselesaikan." },
    { step: "2", title: "Prototyping", desc: "Pembuatan mockup desain interaktif sebelum coding dimulai." },
    { step: "3", title: "Coding & Test", desc: "Pengerjaan backend & frontend serta uji coba bug ketat." },
    { step: "4", title: "Deployment", desc: "Instalasi di server cloud dan pelatihan penggunaan." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Web App" 
        highlight="Development" 
        subtitle="Transformasi operasional bisnis manual menjadi sistem digital otomatis. SaaS, ERP, CRM, atau Internal Tools custom sesuai kebutuhan."
        icon={Code}
      />
      <FeatureGrid features={features} />
      <WorkflowSection steps={steps} />
    </div>
  );
};

// --- 3. SEO OPTIMIZATION PAGE ---
export const SeoServicePage = () => {
  const features = [
    { title: "Keyword Research", desc: "Riset mendalam untuk menemukan kata kunci yang sering dicari calon pembeli potensial.", icon: Search },
    { title: "On-Page SEO", desc: "Optimasi struktur konten, meta tags, heading, dan internal linking di website Anda.", icon: Layout },
    { title: "Technical SEO", desc: "Perbaikan teknis website (Sitemap, Robots.txt, Speed) agar mudah dirayapi Google.", icon: Zap },
    { title: "Content Strategy", desc: "Pembuatan artikel pilar dan cluster konten untuk mendominasi topik bisnis Anda.", icon: PenTool },
    { title: "Backlink Audit", desc: "Analisis dan pembersihan link spam serta strategi link building yang aman.", icon: ShieldCheck },
    { title: "Monthly Report", desc: "Laporan perkembangan ranking dan traffic organik setiap bulan.", icon: BarChart },
  ];

  const steps = [
    { step: "1", title: "Audit Website", desc: "Mengecek kesehatan website saat ini dan posisi ranking." },
    { step: "2", title: "Strategi", desc: "Menentukan keyword target dan rencana konten." },
    { step: "3", title: "Optimasi", desc: "Eksekusi perbaikan teknis dan produksi konten." },
    { step: "4", title: "Monitoring", desc: "Evaluasi hasil dan penyesuaian strategi rutin." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Jasa Optimasi" 
        highlight="SEO Google" 
        subtitle="Tingkatkan ranking website Anda ke Halaman 1 Google. Datangkan traffic organik berkualitas tanpa biaya iklan terus-menerus."
        icon={TrendingUp}
      />
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