
import React, { useState } from 'react';
import { 
  Cpu, Heart, ShieldCheck, Cloud, Smartphone, TrendingUp, 
  BookOpen, Users, Award, ExternalLink, ArrowRight, AlertTriangle, Calculator
} from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, Input, SectionHeader } from '../components/ui';
import { formatRupiah } from '../utils';

// --- COMPONENT: LOSS CALCULATOR ---
const LossCalculator = () => {
  const [omzet, setOmzet] = useState('');
  const [loss, setLoss] = useState<number | null>(null);

  const calculate = () => {
    const value = parseFloat(omzet);
    if (!value) return;
    // Asumsi kebocoran rata-rata tanpa sistem = 5% (Fraud, salah hitung, stok hilang)
    const estimatedLoss = value * 0.05; 
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
        Tanpa sistem POS yang tepat, rata-rata bisnis kehilangan 5% omzet harian karena <em>human error</em> atau <em>fraud</em>. Cek potensi kerugian Anda:
      </p>

      <div className="space-y-4 relative z-10">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Rata-rata Omzet Harian (IDR)</label>
          <Input 
            value={omzet} 
            onChange={(e) => setOmzet(e.target.value)} 
            type="number" 
            placeholder="Contoh: 2000000" 
          />
        </div>
        <Button onClick={calculate} className="w-full">HITUNG POTENSI RUGI</Button>
      </div>

      {loss !== null && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in text-center">
          <p className="text-gray-300 text-xs mb-1">Setiap hari Anda berpotensi kehilangan:</p>
          <p className="text-3xl font-display font-bold text-red-500">{formatRupiah(loss)}</p>
          <p className="text-gray-400 text-xs mt-2">
            Sebulan: <span className="text-white font-bold">{formatRupiah(loss * 30)}</span> lenyap begitu saja.
          </p>
        </div>
      )}
    </div>
  );
};

// --- COMPONENT: SMART LINK BUTTON ---
const SmartLinkButton = ({ url, defaultLabel, waLabel }: { url?: string, defaultLabel: string, waLabel: string }) => {
  const isLinkActive = url && url.length > 5;
  const targetUrl = isLinkActive ? url : "https://wa.me/6282325103336?text=Halo, saya tertarik bergabung waiting list/demo software.";

  return (
    <a 
      href={targetUrl} 
      target="_blank" 
      rel="noreferrer"
      className={`w-full md:w-auto inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all transform hover:-translate-y-1 ${
        isLinkActive 
          ? 'bg-brand-orange text-white hover:bg-brand-glow shadow-neon' 
          : 'bg-white text-black hover:bg-gray-200 shadow-lg'
      }`}
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
            <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Software Division</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            The Brain <span className="text-brand-orange">&</span> The Heart
          </h1>
          <p className="max-w-2xl mx-auto text-base md:text-xl text-gray-400 leading-relaxed mb-10">
            Dari kegagalan masa lalu, lahir inovasi masa depan. Kami membangun ekosistem digital bukan hanya untuk profit, tapi untuk peradaban.
          </p>
        </div>
      </section>

      {/* SIBOS SECTION (The Brain) */}
      <section className="py-12 md:py-20 relative bg-brand-black">
        <div className="container mx-auto px-4">
          {/* Updated Grid: Changed order so Text comes first on mobile */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content (Now First on Mobile) */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="text-brand-orange" size={28} /> {/* Responsive Icon Size */}
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">SIBOS</h2>
              </div>
              <p className="text-brand-orange font-bold text-xs md:text-sm tracking-widest uppercase mb-6">Smart Integrated Back Office System</p>
              
              <div className="prose prose-invert prose-sm md:prose-lg text-gray-400 mb-8 leading-relaxed">
                <p>
                  <strong className="text-white">The Phoenix Project.</strong> Sempat mati suri di 2020. Hilang total di 2022. Kini lahir kembali sebagai sistem saraf pusat bisnis Anda.
                </p>
                <p>
                  Dibuat oleh praktisi yang pernah kehilangan segalanya, SIBOS dirancang dengan satu filosofi: 
                  <span className="text-white italic"> "Menutup celah kebocoran sekecil apapun."</span>
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-10">
                {[
                  { icon: ShieldCheck, title: "Anti-Fraud", desc: "Deteksi manipulasi stok & kasir." },
                  { icon: Cloud, title: "Hybrid Cloud", desc: "Internet mati? Jualan jalan terus." },
                  { icon: Smartphone, title: "Owner Eye", desc: "Pantau omzet real-time dari HP." },
                  { icon: TrendingUp, title: "Smart Analytic", desc: "Prediksi tren penjualan otomatis." },
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

              <SmartLinkButton 
                url={config.sibosUrl} 
                defaultLabel="Coba Demo SIBOS" 
                waLabel="Waiting List SIBOS" 
              />
            </div>

            {/* Visual / Calculator (Now Second on Mobile) */}
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
            
            {/* Visual Placeholder (First on Desktop, Top on Mobile for standard flow - or swap for consistency?) 
                Let's keep standard: Visual Top on Mobile usually looks nice for Apps, 
                but here let's stick to Text First for consistency with SIBOS if we want a uniform reading experience.
                However, for "The Heart", maybe visual first is fine. 
                Let's adjust font sizes and padding only. 
            */}
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
                        <div className="w-full h-24 md:h-32 bg-teal-500/10 rounded-xl mb-4 border border-teal-500/30 flex items-center justify-center">
                           <p className="text-teal-500 text-xs font-bold">Grafik Hafalan Santri</p>
                        </div>
                        <div className="space-y-2">
                           <div className="w-full h-10 md:h-12 bg-gray-800/50 rounded-lg"></div>
                           <div className="w-full h-10 md:h-12 bg-gray-800/50 rounded-lg"></div>
                           <div className="w-full h-10 md:h-12 bg-gray-800/50 rounded-lg"></div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Content */}
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="text-teal-500" size={28} />
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">QALAM</h2>
              </div>
              <p className="text-teal-500 font-bold text-xs md:text-sm tracking-widest uppercase mb-6">Aplikasi Manajemen TPA & Pendidikan</p>
              
              <div className="prose prose-invert prose-sm md:prose-lg text-gray-400 mb-8 leading-relaxed">
                <p>
                  <strong className="text-white">Digitalisasi Generasi Qur'ani.</strong> Teknologi bukan hanya untuk mengejar profit duniawi. QALAM adalah wujud bakti kami.
                </p>
                <p>
                  Membantu Ustadz/Ustadzah mengelola administrasi, agar mereka bisa fokus pada hal yang lebih mulia: <span className="text-white italic">Mendidik Santri.</span>
                </p>
              </div>

              <div className="space-y-4 md:space-y-6 mb-10">
                 {[
                    {icon: BookOpen, title: "Digital Raport", desc: "Orang tua memantau progres hafalan anak real-time."},
                    {icon: Users, title: "SPP & Infaq Management", desc: "Transparansi keuangan lembaga yang akuntabel."},
                    {icon: Award, title: "Gamification Santri", desc: "Sistem poin dan reward untuk semangat belajar."}
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

              <div className="flex flex-col sm:flex-row gap-4">
                <SmartLinkButton 
                  url={config.qalamUrl} 
                  defaultLabel="Buka App QALAM" 
                  waLabel="Daftarkan TPA" 
                />
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
