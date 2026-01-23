
import React from 'react';
import { 
  Brain, Wallet, LayoutDashboard, ShieldCheck, Database, Printer, 
  Smartphone, BookOpen, GraduationCap, Users, FileText, 
  ArrowRight, CheckCircle2, Lock, Quote, Sparkles, Send,
  LineChart, Activity, Clock
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, SectionHeader } from '../components/ui';
import { SEOHelmet, BreadcrumbSchema } from '../components/seo';

// --- ATOMIC VISUAL VARIANTS ---

const AcademicVisual = () => (
    <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Live Sync: Setoran Hafalan</span>
            </div>
            <span className="text-[9px] text-gray-500">Baru saja</span>
        </div>
        <div className="p-3 bg-white/5 rounded-lg border border-green-500/20">
            <p className="text-[11px] text-gray-400 leading-relaxed mb-2">
                Guru: <span className="text-white font-bold">Ustadz Hanif</span> menandai <span className="text-brand-orange font-bold">An-Naba (1-10)</span> sebagai Lulus.
            </p>
            <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[75%] transition-all duration-1000"></div>
                </div>
                <span className="text-[9px] font-bold text-green-400">+15% Target</span>
            </div>
        </div>
        <div className="flex justify-center pt-2">
             <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[8px] font-bold text-blue-400 uppercase">Otomatis Update ke Dashboard Wali</div>
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
    <div className="space-y-4">
        <div className="flex items-center justify-between p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <div className="flex items-center gap-2">
                <LayoutDashboard size={14} className="text-indigo-400"/>
                <span className="text-[9px] font-black text-white uppercase tracking-widest">Portal Wali Santri</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
        
        {/* Real-time Activity Feed */}
        <div className="space-y-3">
            <div className="relative pl-4 border-l-2 border-indigo-500/30 space-y-4">
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-brand-card"></div>
                    <p className="text-[9px] text-gray-500 font-mono mb-1">07:15 WIB</p>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <p className="text-[10px] text-white font-bold">Absensi: Masuk Sekolah</p>
                        <p className="text-[9px] text-gray-400">Ananda Zaid terdeteksi di area sekolah.</p>
                    </div>
                </div>
                <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-brand-card"></div>
                    <p className="text-[9px] text-gray-500 font-mono mb-1">10:30 WIB</p>
                    <div className="bg-green-500/5 p-2 rounded-lg border border-green-500/20">
                        <p className="text-[10px] text-green-400 font-bold">Capaian: Setoran Hafalan</p>
                        <p className="text-[9px] text-gray-300">Surah An-Naziat selesai (Predikat: Mumtaz).</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Small Analytics Graph */}
        <div className="pt-2 border-t border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-black mb-2 tracking-widest">Grafik Mingguan Ananda</p>
            <div className="h-12 flex items-end gap-1 px-1">
                {[40, 70, 55, 90, 85, 60, 95].map((h, i) => (
                    <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-sm relative group overflow-hidden">
                        <div className="absolute bottom-0 w-full bg-indigo-500 transition-all duration-1000" style={{ height: `${h}%` }}></div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-1 text-[7px] text-gray-600 font-mono">
                <span>SEN</span><span>SEL</span><span>RAB</span><span>KAM</span><span>JUM</span><span>SAB</span><span>MIG</span>
            </div>
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
                description="Sistem pendidikan terintegrasi: Akademik AI, Keuangan Transparan, dan Portal Wali Santri Real-time."
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
                        DIRECT SYNC PLATFORM
                    </div>
                    
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight max-w-5xl mx-auto">
                        Bukan Sekadar Pesan,<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600">Tapi Portal Kepercayaan.</span>
                    </h1>
                    
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Guru absen di kelas, data mendarat di HP Wali detik itu juga. Anak selesai setoran, grafik di dashboard Wali langsung naik. Transparansi total tanpa <em>noise</em> chat WhatsApp.
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
                        title="Hafalan Terukur,"
                        highlight="Grafik Naik Terus."
                        desc="Lupakan catatan manual di buku penghubung yang sering hilang. Ustadz input capaian hafalan di kelas, dashboard Wali Santri otomatis mengupdate grafik progress secara visual. Memotivasi santri untuk lebih giat."
                        tags={['Tracking Hafalan Live', 'Rapor Otomatis AI', 'Dashboard Progres', 'Absensi QR Code']}
                    />

                    {/* 2. KEUANGAN (TEAL) */}
                    <FeaturePillar 
                        icon={Wallet}
                        type="finance"
                        color="text-teal-400"
                        align="right"
                        title="Keuangan Transparan,"
                        highlight="Cegah Kebocoran Dana."
                        desc="Sistem pencatatan SPP dan donasi yang real-time. Wali santri bisa melihat tagihan dan riwayat pembayaran di dashboard pribadi mereka. Laporan arus kas otomatis terbit setiap bulan untuk menjaga amanah umat."
                        tags={['Tagihan SPP Digital', 'E-Invoice', 'Laporan Arus Kas', 'Riwayat Infaq']}
                    />

                    {/* 3. KOMUNIKASI (INDIGO) */}
                    <FeaturePillar 
                        icon={LayoutDashboard}
                        type="communication"
                        color="text-indigo-400"
                        title="Portal Wali Santri,"
                        highlight="Data di Genggaman."
                        desc="Semua informasi sekolah dalam satu aplikasi. Cek absensi, capaian akademik, hingga tagihan tanpa perlu scroll chat WhatsApp yang menumpuk. Real-time notification langsung dari dashboard guru ke portal wali."
                        tags={['Personal Dashboard', 'Activity Feed Live', 'Grafik Perkembangan', 'Notif In-App']}
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
                            icon={Activity}
                            title="Real-time Analytics"
                            desc="Sistem memproses ribuan data per detik untuk menyajikan statistik akurat di dashboard wali."
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
