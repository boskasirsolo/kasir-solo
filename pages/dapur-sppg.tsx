
import React from 'react';
import { ShieldAlert, Lock, Activity, Truck, Search, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button, Card, SectionHeader } from '../components/ui';
import { SEOHelmet, BreadcrumbSchema } from '../components/seo';
import { SiteConfig } from '../types';

// --- ATOMS FOR THIS PAGE ---
const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
    <div className="bg-[#051a10] border border-green-500/20 p-6 rounded-xl hover:border-green-500/50 transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Icon size={80} className="text-green-500"/>
        </div>
        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center text-green-400 mb-4 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
            <Icon size={24} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed relative z-10">{desc}</p>
    </div>
);

const RegulationBadge = ({ text }: { text: string }) => (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-full text-[10px] font-bold text-green-400 uppercase tracking-wider mb-4">
        <ShieldAlert size={12} /> {text}
    </div>
);

export const DapurSppgPage = ({ config }: { config: SiteConfig }) => {
    const waLink = `https://wa.me/${config.whatsappNumber}?text=Halo, saya tertarik dengan Sistem Dapur SPPG untuk manajemen MBG. Mohon info lebih lanjut.`;

    return (
        <div className="bg-black text-gray-200 animate-fade-in font-sans selection:bg-green-500 selection:text-black">
            <SEOHelmet 
                title="Aplikasi Dapur SPPG - Manajemen Makan Bergizi Gratis (MBG)"
                description="Sistem manajemen dapur umum & katering MBG. Fitur audit stok, distribusi QR Code, dan laporan kepatuhan Juknis BGN."
                image="https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200"
            />
            <BreadcrumbSchema 
                paths={[
                    { name: 'Inovasi', item: '/inovasi' },
                    { name: 'Dapur SPPG (MBG)', item: '/inovasi/dapur-sppg-mbg' }
                ]}
            />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 overflow-hidden border-b border-white/10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-900/20 via-black to-black opacity-50"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <RegulationBadge text="Peringatan Keras: Standar Audit BPK & Juknis BGN" />
                    
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight max-w-4xl mx-auto">
                        Dapur SPPG Bukan Warteg.<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Satu Rupiah Selisih, Pidana Menanti.</span>
                    </h1>
                    
                    <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Mengelola 3.000 porsi uang negara adalah 'jebakan batman' jika administrasi Anda masih manual. 
                        Risiko keracunan massal, mark-up harga, hingga audit investigatif menghantui setiap sendok nasi yang Anda sajikan.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button 
                            onClick={() => window.open(waLink, '_blank')}
                            className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 shadow-[0_0_20px_rgba(22,163,74,0.4)] border-none font-bold"
                        >
                            LINDUNGI SPPG SAYA <ArrowRight size={18} className="ml-2"/>
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => document.getElementById('risiko')?.scrollIntoView({ behavior: 'smooth' })}
                            className="border-green-500/30 text-green-400 hover:bg-green-500/10 px-8 py-4"
                        >
                            PELAJARI VONIS RISIKO
                        </Button>
                    </div>
                </div>
            </section>

            {/* FEAR SECTION (Scenario) */}
            <section id="risiko" className="py-20 border-b border-white/10 bg-[#020a05] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-red-500 mb-2 flex items-center justify-center gap-2">
                            <AlertTriangle /> REALITA LAPANGAN: DETIK PENENTUAN NASIB
                        </h2>
                        <p className="text-white text-xl">Skenario: 50 Siswa Muntah & Pingsan (Wabah KLB)</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* MANUAL */}
                        <div className="bg-red-950/10 border border-red-900/30 p-8 rounded-2xl relative">
                            <h3 className="text-red-500 font-bold mb-6 text-sm uppercase tracking-widest border-b border-red-900/30 pb-4">Cara Manual (Resiko Tinggi)</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="text-red-500 font-mono text-sm">08:00</span>
                                    <p className="text-gray-400 text-sm">Ambulans datang. Ortu mengamuk. Anda panik mencari nota belanja: "Bahan dari vendor mana yang dipakai tadi pagi?" Tidak ada catatan.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-red-500 font-mono text-sm">10:00</span>
                                    <p className="text-gray-400 text-sm">Polisi minta 'Sampel Saksi'. Anda menyodorkan sisa makanan kotor dari tong sampah. Tamat riwayat Anda.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-red-500 font-mono text-sm">Besok</span>
                                    <p className="text-gray-400 text-sm">Tidak ada bukti suhu masak. Anda dianggap lalai. Media memberitakan 'Dapur Jorok'. Anda jadi Tersangka Utama.</p>
                                </li>
                            </ul>
                        </div>

                        {/* SYSTEM */}
                        <div className="bg-green-950/10 border border-green-500/30 p-8 rounded-2xl relative shadow-[0_0_30px_rgba(22,163,74,0.05)]">
                             <div className="absolute top-0 right-0 bg-green-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">TERPROTEKSI</div>
                            <h3 className="text-green-400 font-bold mb-6 text-sm uppercase tracking-widest border-b border-green-500/20 pb-4">Cara Dapur SPPG</h3>
                            <ul className="space-y-6">
                                <li className="flex gap-4">
                                    <span className="text-green-500 font-mono text-sm">08:00</span>
                                    <p className="text-gray-300 text-sm">Sistem melacak 'Batch ID' produksi. Dalam 1 menit, ketahuan: Ayam dari Vendor A, Sayur dari Vendor B. Data Vendor langsung tersedia untuk Polisi.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-green-500 font-mono text-sm">10:00</span>
                                    <p className="text-gray-300 text-sm">Anda tenang menyerahkan 'Food Bank' steril ber-QR Code yang wajib disisihkan di kulkas sebelum distribusi. Rantai bukti terjaga.</p>
                                </li>
                                <li className="flex gap-4">
                                    <span className="text-green-500 font-mono text-sm">Besok</span>
                                    <p className="text-gray-300 text-sm">Log digital membuktikan suhu masak tembus 100°C (Kuman mati). Kesimpulan Forensik: Kontaminasi terjadi eksternal. Anda Bebas.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-20 relative">
                <div className="container mx-auto px-4">
                    <SectionHeader title="Fitur Spesifik" highlight="Regulasi" subtitle="Menutup celah kelalaian Gizi, Keuangan, dan Higiene untuk kesiapan inspeksi." />
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                        <FeatureCard 
                            icon={Search}
                            title="Intelijen Menu & Gizi"
                            desc="Mencegah 'Unsur Kesengajaan' dalam pengurangan nilai gizi. Blokir otomatis jika menu defisit protein."
                        />
                        <FeatureCard 
                            icon={Truck}
                            title="Radar Rantai Pasok"
                            desc="Memastikan uang negara mengalir ke Petani/BUMDes, bukan ke mafia pangan. Validasi vendor wajib."
                        />
                        <FeatureCard 
                            icon={Lock}
                            title="Kotak Hitam Distribusi"
                            desc="Merekam jejak perjalanan makanan layaknya Black Box pesawat. Tracking kurir & suhu perjalanan."
                        />
                        <FeatureCard 
                            icon={Activity}
                            title="Benteng Higiene (HACCP)"
                            desc="Satu kasus keracunan bisa menutup dapur Anda selamanya. Bukti foto sampel wajib (Geo-tagged)."
                        />
                        <FeatureCard 
                            icon={FileText}
                            title="Mesin Pencetak SPJ"
                            desc="Musuh terbesar bendahara adalah selisih hitung. Biarkan robot yang mengerjakan SPJ & Pajak otomatis."
                        />
                        <FeatureCard 
                            icon={CheckCircle2}
                            title="Detektor Kesiapan Personil"
                            desc="Koki yang sakit adalah sumber wabah. Sistem memvalidasi cek kesehatan harian (Fit-to-Work)."
                        />
                    </div>
                </div>
            </section>

            {/* COMPLIANCE / CLOSING */}
            <section className="py-24 bg-gradient-to-b from-green-900/20 to-black border-t border-white/10 text-center">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                            Audit Bukanlah Lotre Keberuntungan.
                        </h2>
                        <p className="text-xl text-green-400 font-mono mb-8">
                            Itu adalah ujian matematika pasti. 1 + 1 harus sama dengan 2.
                        </p>
                        <p className="text-gray-400 mb-10 leading-relaxed">
                            Jika catatan manual Anda mengatakan 2, tapi stok fisik mengatakan 1.5, Anda tidak sedang apes. 
                            Anda sedang dalam masalah hukum. Jangan pertaruhkan integritas Yayasan/Perusahaan Anda pada kertas yang bisa hilang.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Button 
                                onClick={() => window.open(waLink, '_blank')}
                                className="bg-white text-black hover:bg-gray-200 px-10 py-4 font-bold shadow-lg"
                            >
                                SAYA PILIH TIDUR NYENYAK
                            </Button>
                        </div>
                        <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
                            PT Mesin Kasir Solo • Partner Digitalisasi Pemerintah
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};
