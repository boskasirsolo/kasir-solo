
import React from 'react';
import { MapPin, Phone, History, Rocket, TrendingUp, AlertTriangle, Sunrise } from 'lucide-react';
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

    {/* Narrative Timeline Section */}
    <div className="container mx-auto px-4 py-20 relative">
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

    {/* Location & Contact Section (Existing Layout) */}
    <div className="container mx-auto px-4 py-20 border-t border-white/5">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          
          {/* Alamat Section */}
          <div className="bg-brand-dark p-10 rounded-3xl border border-white/10 hover:border-brand-orange/30 transition-all hover:shadow-neon group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <MapPin />
              </div> 
              Lokasi Kantor
            </h3>
            
            <div className="space-y-6">
                <div>
                    <h4 className="text-brand-orange font-bold text-sm uppercase tracking-wider mb-2 border-l-2 border-brand-orange pl-2">Kantor Legal (Solo Raya)</h4>
                    <p className="text-gray-300 leading-relaxed">
                        {config?.addressSolo || "Perum Graha Tiara 2 No. B1, Gumpang 07/01, Kartasura, Sukoharjo, Jawa Tengah"}
                    </p>
                </div>

                <div className="pt-6 border-t border-white/5">
                    <h4 className="text-brand-orange font-bold text-sm uppercase tracking-wider mb-2 border-l-2 border-brand-orange pl-2">Kantor Operasional (Blora)</h4>
                    <p className="text-gray-300 leading-relaxed">
                        {config?.addressBlora || "Gumiring 04/04, Sidomulyo, Banjarejo, Blora, Jawa Tengah"}
                    </p>
                </div>
            </div>
          </div>

          <div className="bg-brand-dark p-10 rounded-3xl border border-white/10 hover:border-brand-orange/30 transition-all hover:shadow-neon group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
               <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-100 transition-transform">
                <Phone />
              </div> 
              Layanan Pelanggan
            </h3>
            <a href={`https://wa.me/${config?.whatsappNumber}`} className="inline-flex items-center gap-4 text-3xl font-bold text-brand-orange hover:text-white transition-colors drop-shadow-neon">
              {config?.whatsappNumber || "0823 2510 3336"}
            </a>
          </div>
        </div>

        <div className="h-[600px] bg-gray-800 rounded-3xl overflow-hidden relative border border-brand-orange/30 group">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" alt="Map" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-4">
             {/* Pin Solo - Clickable & No Shadow */}
             <a 
               href={config?.mapSoloLink || '#'} 
               target="_blank" 
               rel="noreferrer"
               className="block bg-brand-black/90 p-6 rounded-2xl border border-brand-orange text-center backdrop-blur-md w-64 transform transition-transform hover:scale-105 cursor-pointer hover:bg-brand-black"
             >
               <MapPin className="text-brand-orange w-8 h-8 mx-auto mb-2 animate-bounce" />
               <p className="font-bold text-white text-lg">SOLO RAYA</p>
               <p className="text-gray-400 text-xs">Sukoharjo & Kartasura</p>
             </a>

             {/* Pin Blora - Clickable & No Shadow */}
             <a 
               href={config?.mapBloraLink || '#'}
               target="_blank"
               rel="noreferrer"
               className="block bg-brand-black/90 p-6 rounded-2xl border border-brand-orange text-center backdrop-blur-md w-64 transform transition-transform hover:scale-105 cursor-pointer hover:bg-brand-black"
             >
               <MapPin className="text-brand-orange w-8 h-8 mx-auto mb-2 animate-bounce" style={{ animationDelay: '0.5s' }} />
               <p className="font-bold text-white text-lg">BLORA</p>
               <p className="text-gray-400 text-xs">Banjarejo & Sekitarnya</p>
             </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);
