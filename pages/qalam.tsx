
import React from 'react';
import { 
  Brain, Wallet, MessageCircle, ShieldCheck, Database, Printer, 
  Smartphone, BookOpen, GraduationCap, Users, FileText, 
  ArrowRight, CheckCircle2, Lock, Quote
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, SectionHeader } from '../components/ui';
import { SEOHelmet, BreadcrumbSchema } from '../components/seo';

// --- COMPONENTS ---

const FeaturePillar = ({ 
    icon: Icon, 
    title, 
    highlight,
    desc, 
    tags, 
    align = 'left',
    color = 'text-amber-500'
}: { 
    icon: any, 
    title: string, 
    highlight: string,
    desc: string, 
    tags: string[], 
    align?: 'left' | 'right',
    color?: string
}) => (
    <div className={`flex flex-col md:flex-row items-center gap-12 py-16 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Content */}
        <div className="flex-1 space-y-6">
            <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${color}`}>
                <Icon size={32} />
            </div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                {title} <br/><span className={color}>{highlight}</span>
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
                {desc}
            </p>
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, idx) => (
                    <span key={idx} className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-white/5 ${color.replace('text-', 'border-').replace('500', '500/30')} text-gray-300`}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Visual Mockup (Abstract) */}
        <div className="flex-1 w-full">
            <div className={`relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center group ${color.replace('text-', 'shadow-[0_0_50px_rgba(var(--color-rgb),0.1)]')}`}>
                <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]`}></div>
                
                {/* Mockup Content Based on Icon */}
                <div className="relative z-10 w-full max-w-sm bg-gray-800/80 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/10 ${color}`}>
                            <Icon size={16} />
                        </div>
                        <div className="h-2 w-24 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        <div className="h-2 w-full bg-white/5 rounded-full"></div>
                        <div className="h-2 w-3/4 bg-white/5 rounded-full"></div>
                        <div className="h-2 w-1/2 bg-white/5 rounded-full"></div>
                    </div>
                    <div className={`mt-4 text-xs font-bold ${color} flex items-center gap-2`}>
                        <CheckCircle2 size={12} /> System Active
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const InfraCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="bg-brand-card border border-white/5 p-6 rounded-2xl hover:border-amber-500/30 transition-all group">
        <Icon size={32} className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" />
        <h4 className="text-white font-bold text-lg mb-2">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </div>
);

export const QalamPage = ({ config }: { config: SiteConfig }) => {
    // Gunakan URL dari config (Dashboard Admin -> Sosial & Link -> Link QALAM)
    const targetUrl = config.qalam_url || `https://wa.me/${config.whatsapp_number}`;

    return (
        <div className="bg-[#050505] text-gray-200 font-sans selection:bg-amber-500 selection:text-black">
             <SEOHelmet 
                title="QALAM - Aplikasi Manajemen Sekolah & Pesantren"
                description="Sistem pendidikan terintegrasi: Akademik AI, Keuangan Transparan, dan WhatsApp Gateway. Gratis untuk lembaga kecil."
                image="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1200"
            />
            <BreadcrumbSchema 
                paths={[
                    { name: 'Inovasi', item: '/inovasi' },
                    { name: 'QALAM (Pendidikan)', item: '/inovasi/qalam' }
                ]}
            />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                        ALL-IN-ONE PLATFORM
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight max-w-5xl mx-auto">
                        Teknologi Pendidikan Elit,<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Kini Milik Semua.</span>
                    </h1>
                    
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Qalam menyatukan 3 pilar utama manajemen pendidikan: 
                        <span className="text-white font-bold"> Akademik</span>, 
                        <span className="text-white font-bold"> Keuangan</span>, dan 
                        <span className="text-white font-bold"> Komunikasi</span> dalam satu dashboard terintegrasi.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button 
                            onClick={() => window.open(targetUrl, '_blank')}
                            className="bg-amber-600 hover:bg-amber-500 text-black px-8 py-4 shadow-[0_0_20px_rgba(245,158,11,0.3)] border-none font-bold uppercase tracking-wide"
                        >
                            <Smartphone size={18} className="mr-2"/> GABUNG PROGRAM INKUBASI
                        </Button>
                    </div>
                </div>
            </section>

            {/* PILLARS SECTION */}
            <section className="py-10 border-b border-white/5">
                <div className="container mx-auto px-4">
                    
                    {/* 1. AKADEMIK & AI */}
                    <FeaturePillar 
                        icon={Brain}
                        color="text-amber-500"
                        title="Guru Fokus Mengajar,"
                        highlight="AI yang Bikin Laporan."
                        desc="Tidak ada lagi lembur mengisi rapor manual. Cukup input poin perilaku dan hafalan, AI (Gemini) kami akan merangkai narasi yang personal, menyentuh hati, dan profesional untuk setiap santri."
                        tags={['Rapor Otomatis', 'Tracking Hafalan', 'Absensi Digital', 'Cetak Kartu Ujian']}
                    />

                    {/* 2. KEUANGAN (TEAL) */}
                    <FeaturePillar 
                        icon={Wallet}
                        color="text-teal-400"
                        align="right"
                        title="Keuangan Transparan,"
                        highlight="Cegah Kebocoran Dana."
                        desc="Sistem pencatatan SPP dan donasi yang real-time. Wali santri bisa melihat tagihan dan riwayat pembayaran di HP mereka. Laporan arus kas otomatis terbit setiap bulan."
                        tags={['Tagihan SPP', 'Laporan Arus Kas', 'Donasi In-App', 'Slip Gaji Guru']}
                    />

                    {/* 3. KOMUNIKASI (BLUE) */}
                    <FeaturePillar 
                        icon={MessageCircle}
                        color="text-blue-400"
                        title="WhatsApp Gateway,"
                        highlight="Tanpa Biaya Langganan."
                        desc="Kirim notifikasi kehadiran, tagihan SPP, dan pengumuman libur langsung ke WhatsApp orang tua secara otomatis. Membangun kedekatan emosional antara lembaga dan keluarga."
                        tags={['Auto-Notifikasi WA', 'Broadcast Pengumuman', 'Jadwal Kegiatan', 'Konsultasi Ortu']}
                    />

                </div>
            </section>

            {/* INFRASTRUCTURE GRID */}
            <section className="py-24 bg-[#0a0a0a]">
                <div className="container mx-auto px-4">
                    <SectionHeader title="Infrastruktur" highlight="Kelas Enterprise" subtitle="Kami tidak main-main soal keamanan data santri dan stabilitas sistem." />
                    
                    <div className="grid md:grid-cols-3 gap-6 mt-12">
                        <InfraCard 
                            icon={ShieldCheck}
                            title="Bank-Grade Security"
                            desc="Enkripsi SSL/TLS 256-bit untuk setiap transaksi data. Database terisolasi dan aman."
                        />
                        <InfraCard 
                            icon={Database}
                            title="Auto-Backup Harian"
                            desc="Data Anda dicadangkan otomatis ke Google Cloud Storage setiap malam. Anti-hilang."
                        />
                        <InfraCard 
                            icon={Printer}
                            title="Cetak Dokumen Massal"
                            desc="Cetak 500 Rapor atau Kartu Ujian dalam sekali klik. Format PDF siap cetak."
                        />
                    </div>
                </div>
            </section>

            {/* UNTOLD STORY SECTION (REPLACEMENT) */}
            <section className="py-24 relative overflow-hidden bg-brand-black border-t border-white/5">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/20 via-black to-black opacity-60"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                        <span className="text-xs font-bold text-gray-400 tracking-[0.2em] uppercase">THE UNTOLD STORY</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 leading-tight">
                        Kehilangan Segalanya,<br/>
                        Untuk Menemukan <span className="text-amber-500">Makna Sebenarnya.</span>
                    </h2>

                    <div className="max-w-3xl mx-auto mb-12 relative">
                        <Quote className="absolute -top-6 -left-6 text-white/5 w-16 h-16 transform -scale-x-100" />
                        <p className="text-xl md:text-2xl text-gray-300 italic font-light leading-relaxed relative z-10">
                            "Kadang Tuhan harus meruntuhkan gedung tinggi yang kita banggakan, agar kita mau melihat pondasi rapuh di bawahnya."
                        </p>
                        <div className="mt-8 flex items-center justify-center gap-3">
                             <div className="h-px w-12 bg-amber-500/50"></div>
                             <p className="text-sm font-bold text-amber-500 uppercase tracking-widest">Amin Maghfuri, Founder PT Mesin Kasir Solo</p>
                             <div className="h-px w-12 bg-amber-500/50"></div>
                        </div>
                    </div>

                    <Button 
                        onClick={() => window.open(targetUrl, '_blank')} 
                        className="mx-auto bg-amber-600 hover:bg-amber-500 text-black px-10 py-5 font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)] border-none text-lg transition-transform hover:-translate-y-1"
                    >
                        GABUNG PROGRAM INKUBASI
                    </Button>
                </div>
            </section>
        </div>
    );
};
