
import React from 'react';
import { History, Rocket, AlertTriangle, Sunrise, Users, Target, Building } from 'lucide-react';
import { SiteConfig } from '../types';

export const AboutPage = ({ config }: { config?: SiteConfig }) => (
  <div className="animate-fade-in">
    {/* Hero Section */}
    <div className="bg-brand-card py-24 border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">Tentang <span className="text-brand-orange">Kami</span></h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed">
          Lebih dari sekadar perusahaan teknologi. Ini adalah kisah tentang ketahanan, inovasi, dan tekad untuk bangkit kembali dari titik nol.
        </p>
      </div>
    </div>

    {/* NEW NARRATIVE SECTION: The Philosophy */}
    <section className="py-20 bg-brand-black relative">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-8">
                <div className="inline-flex items-center justify-center p-3 bg-white/5 rounded-full mb-4">
                    <Users className="text-brand-orange w-6 h-6" />
                </div>
                <h3 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                    "Kami Bukan Sekadar Vendor,<br/>Kami Adalah <span className="text-brand-orange">Partner Strategis</span> Anda."
                </h3>
                <div className="prose prose-invert prose-lg mx-auto text-gray-400 leading-relaxed">
                    <p>
                        Di dunia bisnis yang bergerak cepat, Anda tidak butuh sekadar penjual alat kasir yang jual putus. 
                        Anda butuh partner yang mengerti pedihnya selisih stok, pusingnya laporan keuangan yang tidak balance, 
                        dan lelahnya mengawasi karyawan nakal.
                    </p>
                    <p>
                        PT Mesin Kasir Solo lahir dari pengalaman lapangan nyata. Kami memulai dari toko kecil, merasakan semua kendala itu, 
                        dan membangun solusi untuk menyelesaikannya. DNA kami adalah <strong>empati</strong> terhadap sesama pengusaha.
                    </p>
                </div>
                <div className="h-1 w-24 bg-brand-orange mx-auto rounded-full mt-12"></div>
            </div>
        </div>
    </section>

    {/* Narrative Timeline Section */}
    <div className="container mx-auto px-4 py-20 relative border-t border-white/5 bg-brand-dark/50">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-white/10 hidden md:block"></div>
      
      <div className="space-y-16 relative z-10">
        
        {/* 2015: The Beginning */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <h3 className="text-3xl font-display font-bold text-white mb-2">2015: Sang Single Fighter</h3>
              <p className="text-gray-400 leading-relaxed">
                Diinisiasi oleh <strong className="text-brand-orange">Amin Maghfuri</strong>. Tanpa tim, tanpa investor. 
                Memulai langkah berat sebagai <em>single fighter</em>, berjalan dari pintu ke pintu (door-to-door), menawarkan mesin kasir modern. Penolakan adalah sarapan pagi, namun visi digitalisasi UMKM menjadi bahan bakar yang tak pernah padam.
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-12 h-12 bg-brand-dark border border-brand-orange rounded-full flex items-center justify-center text-brand-orange shadow-neon z-20">
                <History size={20} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-3"></div>
        </div>

        {/* 2019-2020: The Rise (National Scale) */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 order-3 md:order-1"></div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-12 h-12 bg-brand-dark border border-white/20 group-hover:border-brand-orange rounded-full flex items-center justify-center text-white group-hover:text-brand-orange transition-colors z-20">
                <Rocket size={20} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2 md:order-3">
              <h3 className="text-3xl font-display font-bold text-white mb-2">2019 - 2020: Ekspansi Nasional</h3>
              <p className="text-gray-400 leading-relaxed">
                Kerja keras terbayar. Lewat strategi <strong>Digital Marketing</strong> yang agresif, jangkauan kami meledak. 
                Klien kami tak lagi hanya di Solo Raya, tapi merambah ke <strong>seluruh Indonesia</strong>. Tim manajemen terbentuk solid. 
                Mimpi besar bernama <strong className="text-white">SIBOS</strong> (Smart Integrated Back Office System) mulai dikembangkan. Kami berada di puncak optimisme.
              </p>
           </div>
        </div>

        {/* 2022: The Fall (Domain Loss) */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <h3 className="text-3xl font-display font-bold text-red-500 mb-2">2022: Kehilangan Segalanya</h3>
              <p className="text-gray-400 leading-relaxed">
                Pandemi menghantam fondasi kami. Cashflow terhenti. Kami sampai pada titik di mana kami 
                <strong> tak sanggup lagi membayar biaya langganan</strong> infrastruktur digital.
                <br/><br/>
                Akibatnya fatal. Domain legendaris <span className="text-red-400 line-through">kasirsolo.com</span> dan <span className="text-red-400 line-through">sibos.id</span> 
                hangus dan langsung <strong>diambil alih (dibeli) oleh orang lain</strong>. Profil Google Bisnis kami disuspend. 
                Reputasi nasional yang dibangun bertahun-tahun, lenyap dalam sekejap.
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-12 h-12 bg-brand-dark border border-red-500/50 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] z-20">
                <AlertTriangle size={20} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-3"></div>
        </div>

        {/* 2025: The Comeback */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 order-3 md:order-1"></div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white shadow-neon-strong animate-pulse-slow z-20">
                <Sunrise size={24} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2 md:order-3">
              <h3 className="text-3xl font-display font-bold text-brand-orange mb-2">2025: The Rebirth</h3>
              <p className="text-gray-300 leading-relaxed border-l-2 border-brand-orange pl-4">
                "Kami kehilangan domain, tapi tidak kehilangan visi."
              </p>
              <p className="text-gray-400 leading-relaxed mt-3">
                Dengan sisa semangat yang ada, PT Mesin Kasir Solo bangkit kembali. Kami meneruskan pengembangan <strong>SIBOS</strong> dan melahirkan inovasi baru: 
                <strong className="text-white"> QALAM</strong> (Aplikasi Manajemen TPA). Kami kembali untuk merebut apa yang pernah menjadi milik kami, dengan pondasi yang lebih kuat.
              </p>
           </div>
        </div>

      </div>
    </div>

    {/* OFFICE PHOTO SECTION */}
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden group border-t border-white/5">
        <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
            {config?.aboutImage ? (
                <img 
                    src={config.aboutImage} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                    alt="Kantor PT Mesin Kasir Solo" 
                />
            ) : (
                <div className="text-gray-600 flex flex-col items-center">
                    <Building size={48} className="mb-2"/>
                    <p>Office Photo Placeholder</p>
                </div>
            )}
        </div>
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/20 to-transparent"></div>
        
        {/* Floating Badge */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center z-10">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-black/60 backdrop-blur-xl shadow-2xl">
                <Building size={16} className="text-brand-orange" />
                <span className="text-xs md:text-sm font-bold text-white uppercase tracking-[0.2em]">Markas Besar Kami</span>
            </div>
        </div>
    </section>

  </div>
);
