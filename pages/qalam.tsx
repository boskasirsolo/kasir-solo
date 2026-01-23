
import React from 'react';
import { 
  Brain, Wallet, MessageCircle, ShieldCheck, Database, Printer, 
  Smartphone, BookOpen, GraduationCap, Users, FileText, 
  ArrowRight, CheckCircle2, Lock, Quote, Sparkles, Send
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, SectionHeader } from '../components/ui';
import { SEOHelmet, BreadcrumbSchema } from '../components/seo';

// --- ATOMIC VISUAL VARIANTS ---

const AcademicVisual = () => (
    <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-amber-500 animate-pulse" />
            <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter">AI Narration Engine</span>
        </div>
        <div className="p-3 bg-white/5 rounded-lg border border-white/5 italic text-[11px] text-gray-400 leading-relaxed">
            "Alhamdulillah, ananda <span className="text-white font-bold">Zaid</span> menunjukkan kemajuan pesat dalam tajwid, khususnya hukum Nun Sukun. Karakter kepemimpinannya..."
        </div>
        <div className="flex justify-between items-center pt-2">
            <div className="h-1.5 w-20 bg-amber-500/20 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[90%]"></div>
            </div>
            <span className="text-[9px] font-bold text-gray-500">90% Progress</span>
        </div>
    </div>
);

const FinanceVisual = () => (
    <div className="space-y-4">
        <div className="p-3 bg-teal-500/10 border border-teal-500/20 rounded-xl">
            <p className="text-[9px] text-teal-400 font-black uppercase mb-1">Invoice #Q-882</p>
            <div className="flex justify-between items-end">
                <h4 className="text-white font-bold text-base">SPP Februari 2025</h4>
                <span className="text-green-400 text-[10px] font-bold">LUNAS</span>
            </div>
        </div>
        <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-gray-500">
                <span>History Pembayaran</span>
                <span className="text-white font-mono">IDR 250.000</span>
            </div>
            <div className="h-px bg-white/5"></div>
            <div className="flex justify-between text-[10px] text-gray-500">
                <span>Saldo Infaq</span>
                <span className="text-teal-400 font-bold">IDR 1.250.000</span>
            </div>
        </div>
    </div>
);

const CommunicationVisual = () => (
    <div className="space-y-3">
        <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20 w-fit">
            <MessageCircle size={12} className="text-green-500"/>
            <span className="text-[9px] font-black text-green-500 uppercase">WhatsApp Gateway</span>
        </div>
        <div className="relative">
            <div className="bg-brand-dark p-3 rounded-2xl rounded-tl-none border border-white/10 text-[11px] text-gray-300">
                Halo Pak Budi, ananda Zaid sudah sampai di sekolah pukul 07:15 WIB. Selamat beraktivitas!
            </div>
            <div className="flex justify-end mt-1">
                <div className="flex gap-0.5 text-blue-400">
                    <CheckCircle2 size={10} /><CheckCircle2 size={10} />
                </div>
            </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <Send size={10} /> Terkirim otomatis via Qalam
        </div>
    </div>
);

// --- CORE COMPONENT ---

const FeaturePillar = ({ 
    icon: Icon, 
    title, 
    highlight,
    desc, 
    tags, 
    align = 'left',
    color = 'text-amber-500',
    type = 'academic'
}: { 
    icon: any, 
    title: string, 
    highlight: string,
    desc: string, 
    tags: string[], 
    align?: 'left' | 'right',
    color?: string,
    type?: 'academic' | 'finance' | 'communication'
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
                    <span key={idx} className={`text-xs font-bold px-3 py-1.5 rounded-full border bg-white/5 ${color.replace('text-', 'border-').replace('400', '400/30').replace('500', '500/30')} text-gray-300`}>
                        {tag}
                    </span>
                ))}
            </div>
        </div>

        {/* Visual Mockup (Context Specific) */}
        <div className="flex-1 w-full">
            <div className={`relative aspect-video rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-gray-900 to-black p-8 flex items-center justify-center group shadow-2xl`}>
                <div className={`absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]`}></div>
                
                <div className="relative z-10 w-full max-w-sm bg-brand-card/90 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                    <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 ${color}`}>
                            <Icon size={20} />
                        </div>
                        <div>
                            <div className="h-2 w-24 bg-white/10 rounded-full mb-1.5"></div>
                            <div className="h-1.5 w-16 bg-white/5 rounded-full"></div>
                        </div>
                    </div>
                    
                    {/* SPECIFIC VISUALS PER TYPE */}
                    <div className="animate-fade-in">
                        {type === 'academic' && <AcademicVisual />}
                        {type === 'finance' && <FinanceVisual />}
                        {type === 'communication' && <CommunicationVisual />}
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
                        type="academic"
                        color="text-amber-500"
                        title="Guru Fokus Mengajar,"
                        highlight="AI yang Bikin Laporan."
                        desc="Tidak ada lagi lembur mengisi rapor manual. Cukup input poin perilaku dan hafalan, AI (Gemini) kami akan merangkai narasi yang personal, menyentuh hati, dan profesional untuk setiap santri."
                        tags={['Rapor Otomatis', 'Tracking Hafalan', 'Absensi Digital', 'Cetak Kartu Ujian']}
                    />

                    {/* 2. KEUANGAN (TEAL) */}
                    <FeaturePillar 
                        icon={Wallet}
                        type="finance"
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
                        type="communication"
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

            {/* UNTOLD STORY SECTION */}
            <section className="py-24 relative overflow-hidden bg-brand-black border-t border-white/5">
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
