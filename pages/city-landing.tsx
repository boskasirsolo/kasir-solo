import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCityData, TARGET_CITIES, supabase } from '../utils';
import { SectionHeader, Button, Card, LoadingSpinner } from '../components/ui';
import { MapPin, ShieldCheck, Truck, Users, ArrowRight, MessageCircle, Star, AlertTriangle, TrendingUp, PackageCheck, CheckCircle2, UserCog } from 'lucide-react';
import { LocalBusinessSchema } from '../components/seo';
import { SiteConfig } from '../types';

export const CityLandingPage = ({ config }: { config?: SiteConfig }) => {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  
  const [cityData, setCityData] = useState<{name: string, slug: string, type: 'Kandang' | 'Ekspansi'} | null>(null);
  const [loading, setLoading] = useState(true);
  const [citiesList, setCitiesList] = useState(TARGET_CITIES);

  // Quota Calc
  const onsiteMax = config?.quotaOnsiteMax || 4;
  const onsiteUsed = config?.quotaOnsiteUsed || 0;
  const onsiteRemaining = Math.max(0, onsiteMax - onsiteUsed);

  // FETCH DYNAMIC CITY
  useEffect(() => {
    const loadCity = async () => {
        // 1. Cek di Hardcoded dulu (Biar cepet)
        const staticCity = getCityData(citySlug || '');
        if (staticCity) {
            setCityData(staticCity as any);
            setLoading(false);
            return;
        }

        // 2. Cek di Database (Kalau di hardcoded ga ada)
        if (supabase && citySlug) {
            const { data } = await supabase.from('target_cities').select('*').eq('slug', citySlug).maybeSingle(); 
            if (data) {
                setCityData(data);
                setLoading(false);
                return;
            }
        }

        // 3. Kalau ga ada di mana-mana
        setLoading(false);
    };

    const loadList = async () => {
        if (supabase) {
            const { data } = await supabase.from('target_cities').select('*').order('created_at', { ascending: false });
            if (data && data.length > 0) {
                setCitiesList(data);
            }
        }
    };

    loadCity();
    loadList();
  }, [citySlug]);

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size={32} />
          </div>
      );
  }

  // If city not found (or user goes to /jual-mesin-kasir-di/...), show list
  if (!cityData) {
      return (
          <div className="container mx-auto px-4 py-24 animate-fade-in">
              <SectionHeader title="Jangkauan" highlight="Area Layanan" subtitle="Kami melayani pengiriman dan instalasi mesin kasir ke seluruh kota di Indonesia." />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {citiesList.map(c => (
                      <Link 
                        key={c.slug} 
                        to={`/jual-mesin-kasir-di/${c.slug}`}
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

  const isKandang = cityData.type === 'Kandang'; // Solo Raya area gets special treatment

  return (
    <div className="animate-fade-in">
      <LocalBusinessSchema city={cityData.name} />
      
      {/* HERO SECTION */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-orange/30 bg-brand-orange/10 mb-6 backdrop-blur-md">
               <MapPin size={14} className="text-brand-orange" />
               <span className="text-xs font-bold text-brand-orange uppercase tracking-[0.2em]">Invasi Mesin Kasir {cityData.name}</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
               Juragan <span className="text-brand-orange">{cityData.name}</span>,<br/>
               Masih Mau Boncos Tiap Hari?
            </h1>
            
            <div className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-10">
               {isKandang ? (
                 <>
                   Gue bukan sekadar vendor, gue tetangga lo. Khusus area ini, <strong className="text-white">Gue Sendiri (Founder)</strong> yang bakal anter & setting mesinnya. Gak pake teknisi, gak pake perantara. Biar lo puas nanya-nanya langsung sama ahlinya.
                 </>
               ) : (
                 <>
                   Buat lo di {cityData.name}, jarak bukan penghalang. Gue kirim paket aman (Kayu + Asuransi). Pas barang sampe, <strong className="text-white">Gue Sendiri</strong> yang bakal pandu lo setting via Video Call privat. Gak ada oper-operan ke admin.
                 </>
               )}
            </div>

            {/* LIMITED SLOT BADGE DYNAMIC */}
            <div className="mb-8 flex justify-center">
                <div className="bg-red-500/10 border border-red-500/30 px-6 py-2 rounded-full flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-wider animate-pulse">
                    <AlertTriangle size={14} /> 
                    {isKandang 
                        ? `KUOTA SETUP ON-SITE: SISA ${onsiteRemaining} DARI ${onsiteMax} SLOT BULAN INI` 
                        : "KUOTA VIDEO CALL SETUP: TERBATAS BULAN INI"}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button onClick={() => navigate('/shop')} className="px-8 py-4 shadow-neon hover:shadow-neon-strong text-sm font-bold">
                  LIHAT SENJATA (KATALOG)
               </Button>
               <a 
                  href={`https://wa.me/6282325103336?text=Halo Mas Amin, saya Juragan dari ${cityData.name}. Mau konsul mesin kasir, katanya langsung sama Founder ya?`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-8 py-4 rounded-lg font-bold border border-white/10 hover:bg-white/5 text-white transition-all flex items-center gap-2 justify-center text-sm"
               >
                  <MessageCircle size={18} /> Chat Founder Langsung
               </a>
            </div>
         </div>
      </section>

      {/* PROBLEM & SOLUTION (Replacing Why Us) */}
      <section className="py-20 bg-brand-dark">
         <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">Kenapa Pebisnis {cityData.name} Cari Gue?</h2>
               <p className="text-gray-400 text-sm max-w-2xl mx-auto">Karena gue Single Fighter yang turun lapangan. Lo dapet akses langsung ke otak di balik sistemnya, bukan cuma sales yang ngejar target.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {/* Card 1 */}
               <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                          <UserCog size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Founder Turun Tangan</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     {isKandang 
                        ? `Gue sendiri yang setir mobil, gue yang angkat barang, gue yang colok kabel. 100% Hands-on. Lo terima beres, terima training langsung dari gue.`
                        : `Gue gak percaya sama teknisi magang buat handle bisnis lo. Makanya, sesi setup & training via Video Call bakal gue handle langsung. Privasi & kualitas terjamin.`
                     }
                  </p>
               </Card>

               {/* Card 2 */}
               <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:scale-110 transition-transform">
                          <ShieldCheck size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Anti Tuyul Digital</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Sistem gue dirancang dari pengalaman pait gue sendiri. Celah fraud karyawan, selisih stok, nota fiktif—semua udah gue tutup. Gue kasih lo sistem yang gue pake sendiri.
                  </p>
               </Card>

               {/* Card 3 */}
               <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-brand-orange/10 rounded-lg text-brand-orange group-hover:scale-110 transition-transform">
                          <Users size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-white">Support Jalur Khusus</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                     Lo gak bakal ngomong sama Bot atau CS yang jawabnya template "Maaf atas ketidaknyamanannya". Lo ngomong sama gue. Masalah lo, prioritas gue. Ini personal.
                  </p>
               </Card>
            </div>
         </div>
      </section>

      {/* EDUCATIONAL SECTION (NEW) */}
      <section className="py-20 bg-brand-black border-t border-white/5">
         <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                        <AlertTriangle size={12} /> Fakta Lapangan
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-6">
                        "Ah, pake kalkulator aja cukup..." <br/>
                        <span className="text-gray-500">Kata siapa?</span>
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center font-bold text-white border border-white/10 shrink-0">1</div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Stok Gak Pernah Klop</h4>
                                <p className="text-gray-400 text-sm">Lo beli barang 100, kejual 50, sisa di rak cuma 40. Ilang 10 kemana? Tanpa sistem, lo cuma bisa nebak-nebak buah manggis.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center font-bold text-white border border-white/10 shrink-0">2</div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Laporan Keuangan Ghaib</h4>
                                <p className="text-gray-400 text-sm">Omzet gede tapi pas mau belanja stok duitnya gak ada? Itu penyakit umum UMKM di {cityData.name}. Sistem gue bakal kasih tau lo kemana duit lo pergi.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center font-bold text-white border border-white/10 shrink-0">3</div>
                            <div>
                                <h4 className="text-white font-bold mb-1">Pelanggan Kabur</h4>
                                <p className="text-gray-400 text-sm">Antrian panjang, nota tulis tangan lama, salah hitung harga. Hari gini pelayanan lambat? Pelanggan pindah ke toko sebelah yang pake mesin kasir.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="relative">
                    <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-[100px]"></div>
                    <div className="relative bg-brand-card border border-white/10 rounded-2xl p-8 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="text-green-500"/> Solusi Gue Buat {cityData.name}
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="text-gray-300 text-sm font-bold">Mesin Kasir Android (Simpel)</span>
                                <CheckCircle2 size={18} className="text-brand-orange"/>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="text-gray-300 text-sm font-bold">PC Kasir Windows (Heavy Duty)</span>
                                <CheckCircle2 size={18} className="text-brand-orange"/>
                            </div>
                            <div className="p-4 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between">
                                <span className="text-gray-300 text-sm font-bold">Software Toko & Resto</span>
                                <CheckCircle2 size={18} className="text-brand-orange"/>
                            </div>
                            <div className="p-4 bg-brand-orange/10 rounded-xl border border-brand-orange/30 mt-4">
                                <p className="text-brand-orange text-xs font-bold leading-relaxed text-center">
                                    "Gue rakitin sesuai budget & kebutuhan lo. Gak maksa beli yang mahal kalau yang murah udah cukup."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-orange/5"></div>
         <div className="container mx-auto px-4 text-center relative z-10">
            <div className="flex justify-center mb-6">
               {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-yellow-500 fill-yellow-500" />)}
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
               Siap Jadi Raja Lokal di {cityData.name}?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
               Kompetitor lo di {cityData.name} mungkin udah pake sistem gue diem-diem. Jangan sampe lo ketinggalan kereta. Upgrade toko lo sekarang.
            </p>
            <Button onClick={() => navigate('/contact')} className="px-10 py-4 text-lg shadow-action hover:shadow-action-strong uppercase font-bold mx-auto">
               Amankan Stok Sekarang <ArrowRight size={20} />
            </Button>
         </div>
      </section>

    </div>
  );
};