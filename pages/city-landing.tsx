
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCityData, TARGET_CITIES } from '../utils';
import { SectionHeader, Button, Card } from '../components/ui';
import { MapPin, ShieldCheck, Truck, Users, ArrowRight, MessageCircle, Star } from 'lucide-react';
import { LocalBusinessSchema } from '../components/seo';

export const CityLandingPage = () => {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const city = getCityData(citySlug || '');

  // If city not found (or user goes to /jual-mesin-kasir-di-), show list
  if (!city) {
      return (
          <div className="container mx-auto px-4 py-24 animate-fade-in">
              <SectionHeader title="Jangkauan" highlight="Area Layanan" subtitle="Kami melayani pengiriman dan instalasi mesin kasir ke seluruh kota di Indonesia." />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {TARGET_CITIES.map(c => (
                      <Link 
                        key={c.slug} 
                        to={`/jual-mesin-kasir-di-${c.slug}`}
                        className="p-4 bg-brand-card border border-white/10 rounded-xl hover:border-brand-orange transition-all text-center group"
                      >
                          <MapPin className="mx-auto mb-2 text-gray-500 group-hover:text-brand-orange" size={24} />
                          <h4 className="font-bold text-white group-hover:text-brand-orange">{c.name}</h4>
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest">{c.type}</span>
                      </Link>
                  ))}
              </div>
          </div>
      );
  }

  const isKandang = city.type === 'Kandang'; // Solo Raya area gets special treatment

  return (
    <div className="animate-fade-in">
      <LocalBusinessSchema city={city.name} />
      
      {/* HERO */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2"></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 mb-6 backdrop-blur-md">
               <MapPin size={14} className="text-brand-orange" />
               <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.2em]">Pusat Mesin Kasir {city.name}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
               Jual Mesin Kasir di <br/> <span className="text-brand-orange">{city.name}</span> & Sekitarnya
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-10">
               {isKandang 
                 ? `Kami adalah vendor lokal asli Solo Raya. Tim teknis kami siap merapat ke ${city.name} kapan saja. Bebas biaya kirim & instalasi untuk area ini.`
                 : `Melayani pengiriman aman ke ${city.name} dengan packing kayu dan asuransi. Full support remote (Video Call) sampai kasir Anda siap tempur.`
               }
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button onClick={() => navigate('/shop')} className="px-8 py-4 shadow-neon hover:shadow-neon-strong">
                  LIHAT KATALOG PRODUK
               </Button>
               <a 
                  href={`https://wa.me/6282325103336?text=Halo Mas Amin, saya dari ${city.name}, mau tanya paket kasir.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-lg font-bold border border-white/10 hover:bg-white/5 text-white transition-all flex items-center gap-2 justify-center"
               >
                  <MessageCircle size={18} /> Chat WhatsApp
               </a>
            </div>
         </div>
      </section>

      {/* WHY US (LOCALIZED) */}
      <section className="py-20 bg-brand-dark">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
               <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                  <Truck size={32} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform"/>
                  <h3 className="text-xl font-bold text-white mb-2">Pengiriman ke {city.name}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     {isKandang 
                        ? "Kurir kami sendiri yang antar. Sampai lokasi langsung disettingin sampai nyala."
                        : "Kerjasama dengan kargo terpercaya (Indah/Dakota). Packing kayu lapis ganda. Garansi rusak ganti baru."
                     }
                  </p>
               </Card>
               <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                  <ShieldCheck size={32} className="text-green-400 mb-4 group-hover:scale-110 transition-transform"/>
                  <h3 className="text-xl font-bold text-white mb-2">Garansi Resmi</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Service center kami di Solo siap bantu. {isKandang ? 'Teknisi bisa dipanggil ke lokasi.' : 'Kirim unit rusak ke kami, kami perbaiki/ganti secepatnya.'}
                  </p>
               </Card>
               <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                  <Users size={32} className="text-brand-orange mb-4 group-hover:scale-110 transition-transform"/>
                  <h3 className="text-xl font-bold text-white mb-2">Komunitas Bisnis</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Bergabung dengan ratusan pengusaha lain yang sudah menggunakan sistem kami. Support system solid.
                  </p>
               </Card>
            </div>
         </div>
      </section>

      {/* SOCIAL PROOF / CTA */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-orange/5"></div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex justify-center mb-6">
               {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-yellow-500 fill-yellow-500" />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
               Siap Upgrade Bisnis di {city.name}?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
               Jangan biarkan kompetitor di {city.name} mendahului Anda. Pakai sistem kasir profesional sekarang.
            </p>
            <Button onClick={() => navigate('/contact')} className="px-10 py-4 text-lg shadow-action hover:shadow-action-strong">
               HUBUNGI KAMI SEKARANG <ArrowRight size={20} />
            </Button>
         </div>
      </section>

    </div>
  );
};
