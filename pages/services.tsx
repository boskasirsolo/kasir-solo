
import React from 'react';
import { 
  Monitor, Smartphone, Globe, Zap, Database, Lock, Search, 
  BarChart, TrendingUp, RefreshCw, ShieldCheck, Server, 
  Code, ArrowRight, CheckCircle2, Layout, PenTool
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
      <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-8">
        {subtitle}
      </p>
      <div className="flex justify-center gap-4">
        <a 
          href="https://wa.me/6282325103336?text=Halo, saya ingin konsultasi layanan ini."
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
          <Card key={i} className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-brand-orange mb-4 border border-white/10">
              <f.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
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
            <div className="w-8 h-8 rounded-full bg-brand-dark border-2 border-brand-orange text-brand-orange font-bold flex items-center justify-center mx-auto mb-4 relative z-10 shadow-neon">
              {i + 1}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
            <p className="text-sm text-gray-400">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- 1. WEBSITE DEVELOPMENT PAGE ---
export const WebsiteServicePage = () => {
  const features = [
    { title: "SEO Friendly", desc: "Struktur kode yang disukai Google agar website mudah naik ranking di halaman pencarian.", icon: Search },
    { title: "Mobile Responsive", desc: "Tampilan otomatis menyesuaikan layar HP, Tablet, dan Desktop dengan sempurna.", icon: Smartphone },
    { title: "Fast Loading", desc: "Optimasi kecepatan server dan gambar agar pengunjung tidak kabur karena loading lama.", icon: Zap },
    { title: "Premium Design", desc: "Desain UI/UX modern yang mencerminkan kredibilitas dan profesionalitas bisnis Anda.", icon: Layout },
    { title: "CMS Mudah", desc: "Dashboard admin yang user-friendly untuk Anda mengupdate konten sendiri.", icon: PenTool },
    { title: "Free Domain & SSL", desc: "Sudah termasuk gratis domain .com/.id dan sertifikat keamanan SSL (HTTPS).", icon: Lock },
  ];

  const steps = [
    { step: "1", title: "Konsultasi", desc: "Diskusi kebutuhan, referensi desain, dan tujuan bisnis Anda." },
    { step: "2", title: "Development", desc: "Proses coding dan desain oleh tim ahli kami." },
    { step: "3", title: "Review", desc: "Anda mengecek hasil dan memberikan revisi jika diperlukan." },
    { step: "4", title: "Launch", desc: "Website online dan siap diakses seluruh dunia." },
  ];

  return (
    <div className="animate-fade-in">
      <ServiceHero 
        title="Jasa Pembuatan" 
        highlight="Website Profesional" 
        subtitle="Bangun kredibilitas bisnis Anda dengan website Company Profile atau Toko Online yang modern, cepat, dan teroptimasi untuk penjualan."
        icon={Globe}
      />
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
