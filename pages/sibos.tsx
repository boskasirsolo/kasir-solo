
import React, { useState } from 'react';
import { 
  ShieldAlert, crosshair, Zap, Target, Users, BarChart3, 
  Store, Globe, Calculator, Megaphone, Monitor, Smartphone, 
  ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Button } from '../components/ui';
import { SEOHelmet } from '../components/seo';

// --- ICONS MAPPING ---
const FeatureIcon = ({ icon: Icon, color }: { icon: any, color: string }) => (
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border bg-opacity-10 ${color}`}>
        <Icon size={24} />
    </div>
);

// --- DATA: FEATURES ---
const FEATURES = [
    {
        title: "Empire Management",
        desc: "Anda punya Restoran, Toko Baju, dan Bengkel sekaligus? Kelola semuanya dalam satu akun (Single Sign-On). Ganti 'topi' bisnis Anda hanya dengan satu klik.",
        icon: Store,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "Multi-Outlet & Cabang",
        desc: "Kontrol stok dan omzet dari 100 cabang berbeda secara real-time. Transfer stok antar cabang, pengaturan harga berbeda per wilayah.",
        icon: Target,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "POS Hybrid Adaptif",
        desc: "Antarmuka kasir berubah otomatis sesuai jenis bisnis. Mode Meja untuk Restoran, Mode Barcode untuk Retail, dan Mode Booking untuk Jasa.",
        icon: Monitor,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "Omnichannel Real-time",
        desc: "Terhubung ke Marketplace, Media Sosial, dan Website Usaha. Stok sinkron otomatis di semua saluran penjualan.",
        icon: Globe,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "AI Business Intelligence",
        desc: "Bukan sekadar grafik. AI kami memberi saran strategi: Kapan harus restock, produk apa yang harus dibundling, dan prediksi omzet.",
        icon: BarChart3,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "CRM & Membership Global",
        desc: "Satu ID Member berlaku di seluruh lini bisnis Anda. Poin dari beli kopi bisa dipakai untuk diskon servis motor di bengkel Anda.",
        icon: Users,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "Accounting Otomatis",
        desc: "Setiap transaksi POS langsung menjurnal Laporan Keuangan (Laba Rugi/Neraca) standar PSAK secara real-time.",
        icon: Calculator,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    },
    {
        title: "Monetisasi Komunitas",
        desc: "Dapatkan penghasilan tambahan dengan mengaktifkan slot iklan komunitas di layar kedua (Customer Display) Anda.",
        icon: Megaphone,
        color: "text-orange-500 border-orange-500/30 bg-orange-500"
    }
];

// --- MAIN PAGE COMPONENT ---
export const SibosPage = ({ config }: { config: SiteConfig }) => {
    const [activeTab, setActiveTab] = useState<'Retail' | 'F&B' | 'Jasa' | 'Pabrik'>('Retail');
    const [selectedScale, setSelectedScale] = useState<'Micro' | 'SME' | 'Enterprise'>('Micro');

    const waLink = `https://wa.me/${config.whatsappNumber}?text=Halo Mas Amin, saya owner bisnis *${activeTab}* dengan skala *${selectedScale}*. Tertarik pakai SIBOS, mohon infonya.`;

    return (
        <div className="bg-[#050505] text-gray-200 font-sans selection:bg-red-600 selection:text-white pt-20">
            <SEOHelmet 
                title="SIBOS - Teknologi Perang Pedagang Jalanan"
                description="Sistem kasir dan manajemen bisnis (ERP) paling agresif untuk UMKM Indonesia. Satu kendali untuk ratusan cabang."
            />

            {/* HERO SECTION */}
            <section className="relative pt-20 pb-32 overflow-hidden">
                <div className="container mx-auto px-4 text-center relative z-10">
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-red-900/50 bg-red-900/10 mb-8 animate-fade-in">
                        <ShieldAlert size={14} className="text-red-500" />
                        <span className="text-xs font-bold text-red-500 tracking-[0.2em] uppercase">PERINGATAN: ZONA PERLAWANAN</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-6 leading-tight tracking-tight">
                        Teknologi Perang<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Buat Pedagang Jalanan.</span>
                    </h1>

                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-400 leading-relaxed mb-12 font-light">
                        Senjata canggih bukan cuma hak konglomerat. Kita ratakan medan perang. <br className="hidden md:block"/>
                        Pakai sistem yang bikin lo bisa <strong className="text-white border-b border-red-500">head-to-head</strong> lawan raksasa ritel.
                    </p>

                    <p className="text-sm text-gray-500 mb-8 max-w-2xl mx-auto">
                        SIBOS adalah <strong>Manifesto Perlawanan</strong>. Kami bangun sistem yang 100% berpihak pada profit lo. Slot Beta terbatas untuk pejuang yang sadar.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                        <button 
                            onClick={() => window.open(waLink, '_blank')}
                            className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all transform hover:-translate-y-1 flex items-center gap-2"
                        >
                            <Zap size={20} fill="white" /> GABUNG BARISAN
                        </button>
                        <button className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white font-bold rounded-lg transition-all flex items-center gap-2">
                            <Target size={20} /> CEK SENJATA KAMI
                        </button>
                    </div>

                    {/* Stats Bar */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 border-t border-white/10 pt-12 max-w-5xl mx-auto">
                        <div>
                            <h4 className="text-3xl font-display font-bold text-white mb-1">JUTAAN</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Korban Biaya Admin</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-display font-bold text-white mb-1">159</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Sisa Slot Beta</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-display font-bold text-white mb-1">UNDERGROUND</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Status</p>
                        </div>
                        <div>
                            <h4 className="text-3xl font-display font-bold text-white mb-1">MERDEKA</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Tujuan</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                            Bangun Konglomerasi. <span className="text-orange-500">Satu Kendali.</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Jangan batasi ambisi Anda dengan software yang kaku. SIBOS dirancang untuk pengusaha visioner yang menjalankan <strong>Coffee Shop</strong> di pagi hari, memantau <strong>Butik Fashion</strong> di siang hari, dan mengecek laporan <strong>Bengkel</strong> di malam hari—semua tanpa perlu <em>log out</em>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map((feat, idx) => (
                            <div key={idx} className="bg-[#0f0f0f] border border-white/5 p-6 rounded-2xl hover:border-orange-500/50 transition-all group hover:-translate-y-1">
                                <FeatureIcon icon={feat.icon} color={feat.color} />
                                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">{feat.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DEVICE MOCKUP SECTION */}
            <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-black border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-display font-bold text-white mb-4">Ringan. Cepat. Di Perangkat Apapun.</h2>
                    <p className="text-gray-400 mb-12">
                        Kami mengoptimalkan kode SIBOS hingga ke level bit. Berjalan mulus di <strong>Smartphone Apapun (Entry-Level Android/iOS)</strong>, Tablet kasir, hingga PC Desktop spek rendah sekalipun. Tidak perlu hardware mahal.
                    </p>
                    
                    {/* Device Visuals - Abstract CSS representation */}
                    <div className="flex justify-center items-end gap-4 md:gap-8 opacity-80 mb-8">
                        {/* Mobile */}
                        <div className="w-16 h-28 border-2 border-gray-700 rounded-lg bg-gray-900/50"></div>
                        {/* Tablet */}
                        <div className="w-32 h-44 border-2 border-gray-600 rounded-xl bg-gray-800/50"></div>
                        {/* Desktop */}
                        <div className="w-64 h-40 border-2 border-gray-500 rounded-xl bg-gray-800 relative">
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 h-4 bg-gray-700 rounded-b-lg"></div>
                        </div>
                    </div>
                    <div className="flex justify-center gap-4 text-[10px] text-gray-600 uppercase font-bold tracking-widest">
                        <span>Android</span> • <span>iOS</span> • <span>Windows</span> • <span>Linux</span> • <span>MacOS</span> • <span>Web Browser</span>
                    </div>
                </div>
            </section>

            {/* TARGET AUDIENCE SECTION (UPDATED) */}
            <section className="py-24 relative overflow-hidden bg-[#050505]">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-green-500/30 bg-green-500/10 text-green-500 text-[10px] font-bold uppercase tracking-widest mb-4 animate-pulse">
                            SECURE CHANNEL ESTABLISHED
                        </div>
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">IDENTIFIKASI TARGET</h2>
                        <p className="text-gray-400">Sebelum Si Boy kasih strategi, kita perlu tau posisi lo sekarang.</p>
                    </div>

                    <div className="max-w-3xl mx-auto bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-white/5 to-transparent rounded-tr-2xl pointer-events-none"></div>

                        {/* 1. JENIS USAHA */}
                        <div className="mb-8">
                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">MEDAN TEMPUR (JENIS USAHA)</label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {['F&B', 'Retail', 'Jasa', 'Pabrik'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`py-3 rounded-lg text-xs font-bold transition-all border ${
                                            activeTab === tab 
                                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                                            : 'bg-transparent text-gray-500 border-white/10 hover:border-white/30 hover:text-gray-300'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. SKALA USAHA */}
                        <div className="mb-10">
                             <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 block">KEKUATAN PASUKAN (SKALA)</label>
                             <div className="space-y-3">
                                {/* Card 1: Micro */}
                                <div 
                                    onClick={() => setSelectedScale('Micro')}
                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedScale === 'Micro' 
                                        ? 'bg-brand-orange/10 border-brand-orange shadow-[inset_0_0_20px_rgba(255,95,31,0.1)]' 
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                        selectedScale === 'Micro' ? 'bg-brand-orange text-white' : 'bg-white/10 text-gray-500'
                                    }`}>
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${selectedScale === 'Micro' ? 'text-white' : 'text-gray-400'}`}>Micro (Solo Fighter)</h4>
                                        <p className="text-xs text-gray-500">Omzet &lt; 50jt/bln. Masih dikerjakan sendiri/keluarga.</p>
                                    </div>
                                </div>

                                {/* Card 2: SME */}
                                <div 
                                    onClick={() => setSelectedScale('SME')}
                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedScale === 'SME' 
                                        ? 'bg-brand-orange/10 border-brand-orange shadow-[inset_0_0_20px_rgba(255,95,31,0.1)]' 
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                        selectedScale === 'SME' ? 'bg-brand-orange text-white' : 'bg-white/10 text-gray-500'
                                    }`}>
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${selectedScale === 'SME' ? 'text-white' : 'text-gray-400'}`}>SME (Juragan)</h4>
                                        <p className="text-xs text-gray-500">Omzet 50jt - 500jt/bln. Sudah punya karyawan & stok gudang.</p>
                                    </div>
                                </div>

                                {/* Card 3: Enterprise */}
                                <div 
                                    onClick={() => setSelectedScale('Enterprise')}
                                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedScale === 'Enterprise' 
                                        ? 'bg-brand-orange/10 border-brand-orange shadow-[inset_0_0_20px_rgba(255,95,31,0.1)]' 
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                        selectedScale === 'Enterprise' ? 'bg-brand-orange text-white' : 'bg-white/10 text-gray-500'
                                    }`}>
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className={`text-sm font-bold ${selectedScale === 'Enterprise' ? 'text-white' : 'text-gray-400'}`}>Enterprise (Konglomerat)</h4>
                                        <p className="text-xs text-gray-500">Omzet &gt; 500jt/bln. Multi-cabang & butuh kontrol pusat.</p>
                                    </div>
                                </div>
                             </div>
                        </div>

                        <div className="mt-8">
                            <Button 
                                onClick={() => window.open(waLink, '_blank')}
                                className="w-full py-4 text-base font-bold bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-neon hover:shadow-neon-strong border-0"
                            >
                                LANJUT <ArrowRight size={18} className="ml-2"/>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
};
