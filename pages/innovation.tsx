
import React, { useState } from 'react';
import { 
  Cpu, Heart, ShieldCheck, Cloud, Smartphone, TrendingUp, 
  BookOpen, Users, Award, ExternalLink, ArrowRight, AlertTriangle, Calculator,
  Layers, WifiOff, Printer, Scale, Quote, Zap
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, Input, SectionHeader } from '../components/ui';
import { formatRupiah, formatNumberInput, cleanNumberInput } from '../utils';

// --- COMPONENT: LOSS CALCULATOR ---
const LossCalculator = () => {
  const [omzet, setOmzet] = useState('');
  const [loss, setLoss] = useState<number | null>(null);

  const handleOmzetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = formatNumberInput(e.target.value);
    setOmzet(val);
  };

  const calculate = () => {
    const numericValue = cleanNumberInput(omzet);
    if (!numericValue) return;
    // Asumsi kebocoran rata-rata tanpa sistem = 5% (Fraud, salah hitung, stok hilang)
    const estimatedLoss = numericValue * 0.05; 
    setLoss(estimatedLoss);
  };

  return (
    <div className="bg-brand-dark border border-brand-orange/30 rounded-2xl p-6 md:p-8 max-w-lg mx-auto shadow-neon relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Calculator size={100} className="text-brand-orange" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
        <AlertTriangle className="text-red-500" /> Kalkulator Kebocoran
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Tanpa sistem ERP yang terintegrasi, bisnis rata-rata kehilangan <strong>5% omzet harian</strong> karena <em>selisih stok</em>, <em>mark-up harga</em>, atau <em>human error</em>. Cek potensi kerugian Anda:
      </p>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Rata-rata Omzet Harian (IDR)</label>
          <Input 
            value={omzet} 
            onChange={handleOmzetChange} 
            type="text" 
            placeholder="Contoh: 5.000.000" 
          />
        </div>
        <Button onClick={calculate} className="w-full py-4 text-lg shadow-action hover:shadow-action-strong">HITUNG POTENSI RUGI</Button>
      </div>

      {loss !== null && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in text-center">
          <p className="text-gray-300 text-xs mb-1">Setiap hari Anda berpotensi kehilangan:</p>
          <p className="text-3xl font-display font-bold text-red-500">{formatRupiah(loss)}</p>
          <p className="text-gray-400 text-xs mt-2">
            Sebulan: <span className="text-white font-bold">{formatRupiah(loss * 30)}</span> lenyap tanpa jejak.
          </p>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: SMART LINK BUTTON ---
const SmartLinkButton = ({ url, defaultLabel, waLabel }: { url?: string, defaultLabel: string, waLabel: string }) => {
  const isLinkActive = url && url.length > 5;
  const targetUrl = isLinkActive ? url : "https://wa.me/6282325103336?text=Halo, saya ingin bergabung Waiting List SIBOS/QALAM.";

  return (
    <a 
      href={targetUrl} 
      target="_blank" 
      rel="noreferrer"
      className="w-full md:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 bg-brand-gradient text-white hover:bg-brand-gradient-hover shadow-action hover:shadow-action-strong"
    >
      {isLinkActive ? defaultLabel : waLabel} 
      {isLinkActive ? <ExternalLink size={18} /> : <ArrowRight size={18} />}
    </a>
  );
};

// --- MAIN PAGE ---
export const InnovationPage = ({ config }: { config: SiteConfig }) => {
  return (
    <div className="animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative py-20 md:py-32 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 z-0">
          {/* SIBOS SIDE (Left) */}
          <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-brand-orange/5 to-transparent blur-[100px]"></div>
          {/* QALAM SIDE (Right) */}
          <div className="absolute bottom-0 right-0 w-1/2 h-full bg-gradient-to-tl from-teal-500/5 to-transparent blur-[100px]"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">R&D Division • Reborn 2025</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            The Brain <span className="text-brand-orange">&</span> The Heart
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-xl text-gray-400 leading-relaxed mb-10">
            Lahir kembali dari puing kegagalan masa lalu. Kami membangun ekosistem digital <strong>SIBOS</strong> & <strong>QALAM</strong> bukan sekadar untuk profit, tapi sebagai solusi peradaban untuk Bisnis dan Pendidikan.
          </p>
        </div>
      </section>

      {/* NEW SECTION: NARRATIVE BRIDGE (Why We Built This) */}
      <section className="py-16 bg-brand-dark/50 border-b border-white/5 relative">
         <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <Quote className="mx-auto text-brand-orange mb-6 opacity-50" size={40} />
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 leading-relaxed">
               "Kami pernah berada di titik terendah: <span className="text-red-500">Kebangkrutan</span> karena data yang berantakan."
            </h3>
            <div className="prose prose-invert prose-lg mx-auto text-gray-400 leading-relaxed">
               <p>
                  Tahun 2022 mengajarkan kami satu hal fatal: <strong>Tanpa sistem yang kuat, kerja keras saja tidak cukup.</strong> 
                  Kami kehilangan aset, kehilangan domain, tapi kami tidak kehilangan visi.
               </p>
               <p>
                  SIBOS dan QALAM bukan sekadar produk jualan. Ini adalah <em>blueprint</em> kebangkitan yang kami bagikan kepada Anda. 
                  Kami membangun sistem yang kami harap kami miliki saat kami jatuh dulu. Agar Anda tidak perlu mengalami kegagalan yang sama.
               </p>
            </div>
         </div>
      </section>

      {/* SIBOS SECTION (The Brain) */}
      <section className="py-12 md:py-20 relative bg-brand-black">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content SIBOS */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-brand-orange" size={28} />
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">SIBOS</h2>
              </div>
              <p className="text-brand-orange font-bold text-xs md:text-sm tracking-widest uppercase mb-6">Smart Integrated Back Office System</p>
              
              <div className="prose prose-invert prose-sm md:prose-lg text-gray-400 mb-8 leading-relaxed">
                <p>
                  <strong>Bukan Sekadar Kasir.</strong> Ini adalah ekosistem ERP yang dirancang oleh praktisi yang pernah merasakan pahitnya kebangkrutan karena manajemen data yang buruk.
                </p>
                <p>
                  SIBOS hadir dengan filosofi <em>"Dari Komunitas, Untuk Komunitas"</em>. Kami mendobrak batasan dengan fitur <strong>Multi-Business</strong>: Satu akun untuk mengelola Restoran, Minimarket, dan Jasa sekaligus.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
                {[
                  { icon: Layers, title: "Multi-Business Core", desc: "Kelola F&B, Ritel, dan Jasa dalam 1 Akun terpusat." },
                  { icon: WifiOff, title: "Hybrid Mode", desc: "Internet mati? Transaksi tetap jalan (Offline First)." },
                  { icon: Printer, title: "Hardware Ready", desc: "Support Timbangan Digital, Printer Barcode & KDS." },
                  { icon: Scale, title: "Manufacturing", desc: "Hitung HPP bahan baku (resep) & bundling otomatis." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3 md:p-0 rounded-lg md:rounded-none bg-white/5 md:bg-transparent border md:border-none border-white/5">
                    <div className="w-10 h-10 rounded bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-orange/10 border border-brand-orange/30 p-4 rounded-xl mb-8">
                 <p className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-1">Status: Waiting List Open</p>
                 <p className="text-gray-300 text-sm">Bergabunglah dalam antrian prioritas untuk mendapatkan akses Freemium saat rilis resmi.</p>
              </div>

              <SmartLinkButton 
                url={config.sibosUrl} 
                defaultLabel="Akses Website SIBOS" 
                waLabel="Gabung Waiting List SIBOS" 
              />
            </div>

            {/* Visual / Calculator */}
            <div className="mt-4 md:mt-0">
              <LossCalculator />
            </div>

          </div>
        </div>
      </section>

      {/* SEPARATOR */}
      <div className="h-px bg-gradient-to-r from-brand-orange via-gray-800 to-teal-500 opacity-30"></div>

      {/* QALAM SECTION (The Heart) */}
      <section className="py-12 md:py-20 relative bg-[#0a0f0f]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Visual QALAM */}
            <div className="relative group order-first lg:order-none">
               <div className="absolute inset-0 bg-teal-500/10 rounded-3xl blur-[40px] group-hover:bg-teal-500/20 transition-all duration-700"></div>
               <div className="relative bg-brand-card border border-teal-500/20 rounded-3xl p-4 md:p-8 h-[400px] md:h-[500px] flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                  
                  {/* Mockup Illustration */}
                  <div className="w-56 md:w-64 h-full bg-black border-4 border-gray-800 rounded-[2.5rem] md:rounded-[3rem] shadow-2xl relative overflow-hidden transform group-hover:scale-105 transition-transform duration-500">
                     <div className="absolute top-0 w-full h-6 bg-gray-800 flex justify-center items-center">
                        <div className="w-20 h-3 bg-black rounded-b-lg"></div>
                     </div>
                     {/* Screen Content */}
                     <div className="p-4 pt-10 h-full bg-gradient-to-b from-teal-900/40 to-black flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                           <div className="w-8 h-8 rounded-full bg-teal-500"></div>
                           <div className="w-20 h-2 bg-gray-700 rounded"></div>
                        </div>
                        <div className="w-full h-24 md:h-32 bg-teal-500/10 rounded-xl mb-4 border border-teal-500/30 flex items-center justify-center flex-col gap-2">
                           <p className="text-teal-500 text-xs font-bold">Laporan Hafalan AI</p>
                           <p className="text-[10px] text-gray-500">Auto-Generate Progress</p>
                        </div>
                        <div className="space-y-2">
                           <div className="w-full h-10 md:h-12 bg-gray-800/50 rounded-lg flex items-center px-3">
                              <span className="text-[9px] text-gray-500">SPP & Infaq Transparency</span>
                           </div>
                           <div className="w-full h-10 md:h-12 bg-gray-800/50 rounded-lg"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Content QALAM */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-teal-500" size={28} />
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">QALAM</h2>
              </div>
              <p className="text-teal-500 font-bold text-xs md:text-sm tracking-widest uppercase mb-6">Platform Manajemen Pendidikan Islam</p>
              
              <div className="prose prose-invert prose-sm md:prose-lg text-gray-400 mb-8 leading-relaxed">
                <p>
                  <strong>Teknologi sebagai Jalan Dakwah.</strong> QALAM lahir dari keprihatinan kami terhadap manajemen TPA/TPQ yang masih manual.
                </p>
                <p>
                  Kami menerapkan model <strong>Subsidi Silang</strong>. Versi Enterprise (Lembaga Besar) membiayai versi Gratis untuk TPA/TPQ kecil (di bawah 200 santri). Agar Ustadz bisa fokus mendidik, biar QALAM yang urus administrasi.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6 mb-10">
                 {[
                    {icon: BookOpen, title: "AI Reporting", desc: "Laporan perkembangan hafalan santri otomatis & personal."},
                    {icon: Users, title: "Integrasi Wali & Donatur", desc: "Transparansi keuangan SPP/Infaq real-time ke orang tua."},
                    {icon: Award, title: "Gratis Selamanya", desc: "Untuk lembaga pendidikan dengan < 200 santri."}
                 ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 md:p-0 rounded-lg md:rounded-none bg-white/5 md:bg-transparent border md:border-none border-white/5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-500 shrink-0">
                           <item.icon size={20} />
                        </div>
                        <div>
                           <h4 className="text-white font-bold text-sm md:text-lg">{item.title}</h4>
                           <p className="text-gray-500 text-xs md:text-sm leading-snug">{item.desc}</p>
                        </div>
                    </div>
                 ))}
              </div>

              <div className="bg-teal-500/10 border border-teal-500/30 p-4 rounded-xl mb-8">
                 <p className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-1">Status: Waiting List Open</p>
                 <p className="text-gray-300 text-sm">Daftarkan lembaga Anda sekarang untuk mendapatkan kuota akses awal.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <SmartLinkButton 
                  url={config.qalamUrl} 
                  defaultLabel="Akses Website QALAM" 
                  waLabel="Daftar Waiting List QALAM" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW SECTION: CLOSING MANIFESTO (The Invitation) */}
      <section className="py-20 relative overflow-hidden">
         {/* Background Gradient */}
         <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-brand-black z-0"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="max-w-3xl mx-auto">
                <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-6 animate-pulse-slow">
                    <Zap className="text-brand-orange" size={24} />
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
                    Masa Depan Tidak Menunggu.
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    Kami sedang membangun ekosistem ini dengan sangat hati-hati. Akses awal (Waiting List) dibuka terbatas untuk menjaga kualitas server dan support.
                    <br/><br/>
                    Jadilah bagian dari <strong className="text-brand-orange">Generasi Pertama</strong> yang merasakan revolusi manajemen bisnis dan pendidikan ini.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <SmartLinkButton 
                        url={config.sibosUrl} 
                        defaultLabel="Amankan Slot SIBOS" 
                        waLabel="Daftar Antrian SIBOS" 
                    />
                    <SmartLinkButton 
                        url={config.qalamUrl} 
                        defaultLabel="Amankan Slot QALAM" 
                        waLabel="Daftar Antrian QALAM" 
                    />
                </div>
                <p className="mt-8 text-xs text-gray-500 uppercase tracking-widest">
                    Reborn 2025 • PT Mesin Kasir Solo
                </p>
            </div>
         </div>
      </section>

    </div>
  );
};
