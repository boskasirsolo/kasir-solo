
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
        <AlertTriangle className="text-red-500" /> Cek Duit "Ghaib" Lo
      </h3>
      <p className="text-gray-400 text-sm mb-6">
        Tanpa sistem, rata-rata <strong>5% omzet lo ilang</strong> tiap hari (kembalian salah, stok dicomot, nota ilang). Coba itung berapa duit lo yang kebakar percuma:
      </p>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Omzet Harian Rata-rata (IDR)</label>
          <Input 
            value={omzet} 
            onChange={handleOmzetChange} 
            type="text" 
            placeholder="Contoh: 5.000.000" 
          />
        </div>
        <Button onClick={calculate} className="w-full py-4 text-lg shadow-action hover:shadow-action-strong">
            HITUNG BONCOS GUE
        </Button>
      </div>

      {loss !== null && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in text-center">
          <p className="text-gray-300 text-xs mb-1">Setiap hari lo "sedekah paksa" sebesar:</p>
          <p className="text-3xl font-display font-bold text-red-500">{formatRupiah(loss)}</p>
          <p className="text-gray-400 text-xs mt-2">
            Sebulan: <span className="text-white font-bold">{formatRupiah(loss * 30)}</span> lenyap tanpa jejak.
          </p>
          <p className="text-[10px] text-gray-500 italic mt-1">Sayang banget, padahal bisa buat beli stok baru.</p>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: SMART LINK BUTTON ---
const SmartLinkButton = ({ url, defaultLabel, waLabel, waNumber }: { url?: string, defaultLabel: string, waLabel: string, waNumber?: string }) => {
  const isLinkActive = url && url.length > 5;
  const targetWa = waNumber || "6282325103336";
  const targetUrl = isLinkActive ? url : `https://wa.me/${targetWa}?text=Halo Mas Amin, gue mau masuk Waiting List SIBOS/QALAM.`;

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
            Otak <span className="text-brand-orange">&</span> Hati.
          </h1>
          <p className="max-w-3xl mx-auto text-base md:text-xl text-gray-400 leading-relaxed mb-10">
            Lahir dari puing-puing kegagalan gue tahun 2022. <strong>SIBOS</strong> (Otak Bisnis) & <strong>QALAM</strong> (Hati Umat). 
            Gue bangun ulang sistem ini biar lo gak perlu ngerasain bangkrut kayak gue dulu.
          </p>
        </div>
      </section>

      {/* NEW SECTION: NARRATIVE BRIDGE (Why We Built This) */}
      <section className="py-16 bg-brand-dark/50 border-b border-white/5 relative">
         <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
            <Quote className="mx-auto text-brand-orange mb-6 opacity-50" size={40} />
            <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-6 leading-relaxed">
               "Tahun 2022 gue ancur lebur. Aset digital ilang, domain disikat orang."
            </h3>
            <div className="prose prose-invert prose-lg mx-auto text-gray-400 leading-relaxed">
               <p>
                  Sakit banget, Bro. Kerja keras tahunan lenyap semalam cuma gara-gara manajemen data gue berantakan. 
                  Saat itu gue sadar: <strong>Kerja keras doang gak cukup kalau sistem lo rapuh.</strong>
               </p>
               <p>
                  Makanya gue balik lagi. Gue rakit <strong>SIBOS</strong> dan <strong>QALAM</strong> bukan cuma buat jualan, tapi sebagai <em>blueprint</em> pertahanan. 
                  Ini sistem yang gue harap gue punya pas gue jatuh dulu. Gue kasih ke lo biar lo aman.
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
                  <strong>Bukan Sekadar Kasir.</strong> Ini "Satpam Digital" buat bisnis lo. Gue desain khusus buat nangkep tuyul-tuyul (fraud) internal yang sering bikin owner pusing.
                </p>
                <p>
                  Filosofinya simpel: <em>"Trust but Verify"</em>. Lo boleh percaya karyawan, tapi sistem harus tetep jalan buat verifikasi. Satu akun SIBOS bisa handle Resto, Toko Kelontong, dan Jasa sekaligus. Gak usah langganan banyak software.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
                {[
                  { icon: Layers, title: "Satu Akun, Banyak Cuan", desc: "Kelola F&B, Ritel, dan Jasa dalam 1 Dashboard." },
                  { icon: WifiOff, title: "Internet Mati? Gas Terus", desc: "Mode Hybrid. Transaksi tetep jalan walau offline." },
                  { icon: Printer, title: "Hardware Ready", desc: "Colok Timbangan, Scanner, Printer Dapur langsung connect." },
                  { icon: Scale, title: "Resep Anti-Boncos", desc: "Hitung HPP bahan baku (resep) otomatis. Stok akurat." },
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
                 <p className="text-brand-orange text-xs font-bold uppercase tracking-widest mb-1">Status: Waiting List Dibuka</p>
                 <p className="text-gray-300 text-sm">Amankan posisi lo sekarang buat dapet akses Freemium pas rilis.</p>
              </div>

              <SmartLinkButton 
                url={config.sibosUrl} 
                defaultLabel="Akses SIBOS" 
                waLabel="Antri SIBOS Sekarang" 
                waNumber={config.whatsappNumber}
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
                              <span className="text-[9px] text-gray-500">SPP & Infaq Transparan</span>
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
                  <strong>Teknologi Jalur Langit.</strong> QALAM lahir karena gue prihatin liat manajemen TPA/TPQ yang masih manual banget. Ustadz jadi sibuk ngurus admin, bukan ngurus santri.
                </p>
                <p>
                  Gue pake sistem <strong>Subsidi Silang</strong>. Sekolah Gede (Enterprise) bayar buat subsidi TPA/TPQ kecil (di bawah 200 santri) biar mereka bisa pake <strong>GRATIS</strong>. Biar berkah bareng-bareng.
                </p>
              </div>

              <div className="space-y-4 md:space-y-6 mb-10">
                 {[
                    {icon: BookOpen, title: "Laporan Hafalan AI", desc: "Gak perlu nulis manual di buku penghubung. Sekali klik, laporan jadi."},
                    {icon: Users, title: "Transparansi SPP", desc: "Wali santri bisa cek tagihan & riwayat infaq real-time. Bebas prasangka."},
                    {icon: Award, title: "Gratis Selamanya", desc: "Khusus lembaga kecil (< 200 santri). Komitmen gue buat umat."}
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
                 <p className="text-teal-500 text-xs font-bold uppercase tracking-widest mb-1">Status: Waiting List Dibuka</p>
                 <p className="text-gray-300 text-sm">Daftarin lembaga lo sekarang. Slot terbatas biar server gak meledak.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <SmartLinkButton 
                  url={config.qalamUrl} 
                  defaultLabel="Akses QALAM" 
                  waLabel="Daftar Antrian QALAM" 
                  waNumber={config.whatsappNumber}
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
                    Masa Depan Gak Nunggu Lo.
                </h2>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    Sistem ini gue bangun pelan-pelan tapi pasti. Waiting List gue buka terbatas buat jaga kualitas.
                    <br/><br/>
                    Lo mau jadi penonton doang atau jadi <strong className="text-brand-orange">Generasi Pertama</strong> yang ngerasain revolusi ini?
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <SmartLinkButton 
                        url={config.sibosUrl} 
                        defaultLabel="Amankan Slot SIBOS" 
                        waLabel="Antri SIBOS" 
                        waNumber={config.whatsappNumber}
                    />
                    <SmartLinkButton 
                        url={config.qalamUrl} 
                        defaultLabel="Amankan Slot QALAM" 
                        waLabel="Antri QALAM" 
                        waNumber={config.whatsappNumber}
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
