
import React from 'react';
import { MapPin, Phone } from 'lucide-react';

export const AboutPage = () => (
  <div className="animate-fade-in">
    <div className="bg-brand-card py-24 border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-8">Tentang <span className="text-brand-orange">PT Mesin Kasir Solo</span></h2>
        <div className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed">
          <p>
            Berdiri di jantung Solo Raya, kami adalah perusahaan teknologi yang berfokus pada <strong>Digitalisasi UMKM & Korporasi</strong>. 
            Kami memadukan perangkat keras kasir (Hardware POS) terbaik dengan layanan pengembangan web & aplikasi.
          </p>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-4 py-20">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="bg-brand-dark p-10 rounded-3xl border border-white/10 hover:border-brand-orange/30 transition-all hover:shadow-neon group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-110 transition-transform">
                <MapPin />
              </div> 
              Kantor Pusat
            </h3>
            <p className="text-gray-300 mb-6 text-lg leading-relaxed">
              <strong>Perum Graha Tiara 2 No. B1.</strong><br/>
              Gumpang 07/01, Kartasura<br/>
              Sukoharjo, Jawa Tengah
            </p>
          </div>

          <div className="bg-brand-dark p-10 rounded-3xl border border-white/10 hover:border-brand-orange/30 transition-all hover:shadow-neon group">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-4">
               <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center text-brand-orange group-hover:scale-100 transition-transform">
                <Phone />
              </div> 
              Layanan Pelanggan
            </h3>
            <a href="https://wa.me/6282325103336" className="inline-flex items-center gap-4 text-3xl font-bold text-brand-orange hover:text-white transition-colors drop-shadow-neon">
              0823 2510 3336
            </a>
          </div>
        </div>

        <div className="h-[500px] bg-gray-800 rounded-3xl overflow-hidden relative border border-brand-orange/30 shadow-neon-strong group">
          <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000" alt="Map" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="bg-brand-black/90 p-8 rounded-2xl border border-brand-orange text-center backdrop-blur-md shadow-neon">
               <MapPin className="text-brand-orange w-12 h-12 mx-auto mb-4 animate-bounce" />
               <p className="font-bold text-white text-xl">Gumpang, Kartasura</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
