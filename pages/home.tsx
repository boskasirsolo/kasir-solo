
import React from 'react';
import { ArrowRight, Zap, Monitor, BarChart3, Palette, Code, Search, Settings, Star, Quote, ExternalLink } from 'lucide-react';
import { SiteConfig, GalleryItem, Testimonial } from '../types';
import { Button, Card, Badge } from '../components/ui';

export const HomePage = ({ 
  setPage, 
  config,
  gallery,
  testimonials 
}: { 
  setPage: (p: string) => void, 
  config: SiteConfig,
  gallery: GalleryItem[],
  testimonials: Testimonial[]
}) => {
  
  // Logic: Get 4 Latest Gallery Items
  const featuredGallery = gallery.slice(0, 4);
  
  // Logic: Get Featured Testimonials (Limit 3)
  const featuredTestimonials = testimonials.filter(t => t.is_featured).slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center relative">
          <div className="inline-block px-6 py-2 border border-brand-orange rounded-full bg-brand-orange/10 mb-8 backdrop-blur-md shadow-neon">
            <span className="text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase">Melayani Bisnis di Seluruh Indonesia</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">
            {config.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button onClick={() => setPage('shop')} className="px-10 py-4">
              KATALOG KASIR <ArrowRight size={22} />
            </Button>
            <Button variant="outline" onClick={() => setPage('about')} className="px-10 py-4">
              KONSULTASI GRATIS
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-brand-card border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Mengapa Memilih <span className="text-brand-orange">Sistem Kami?</span></h2>
              <p className="text-gray-400 max-w-2xl mx-auto">Infrastruktur teknologi stabil, aman, dan mudah digunakan.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "High Performance POS", desc: "Hardware dan software yang dioptimalkan untuk transaksi super cepat." },
              { icon: Monitor, title: "Hybrid Cloud System", desc: "Data aman di cloud, tetap beroperasi saat internet offline." },
              { icon: BarChart3, title: "Real-time Analytics", desc: "Akses laporan omzet dan stok dari smartphone kapan saja." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 border border-white/5 rounded-2xl bg-brand-dark/80 hover:border-brand-orange transition-all duration-300 group hover:shadow-neon hover:-translate-y-2">
                <feature.icon className="w-14 h-14 text-brand-orange mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-neon" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: GALLERY HIGHLIGHTS --- */}
      {featuredGallery.length > 0 && (
        <section className="py-20 bg-brand-dark border-t border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
           
           <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">
                      Karya & Instalasi <span className="text-brand-orange">Terbaru</span>
                    </h2>
                    <p className="text-gray-400">Bukti nyata dedikasi kami dalam mendigitalisasi UMKM.</p>
                  </div>
                  <Button variant="outline" onClick={() => setPage('gallery')} className="hidden md:flex">
                    Lihat Semua Portfolio <ArrowRight size={16} />
                  </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 {featuredGallery.map((item) => (
                   <React.Fragment key={item.id}>
                     <div 
                        onClick={() => setPage('gallery')}
                        className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-brand-orange transition-all hover:shadow-neon"
                     >
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                        
                        <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                           <Badge className="mb-3 bg-brand-orange/20 text-brand-orange border-brand-orange/40 backdrop-blur-md">
                              {item.category_type === 'physical' ? 'Hardware' : 'Software'}
                           </Badge>
                           <h3 className="text-lg font-bold text-white leading-tight mb-1 group-hover:text-brand-orange transition-colors">
                              {item.title}
                           </h3>
                           <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                              <p className="text-gray-400 text-xs mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                                {item.description || "Klik untuk melihat detail project ini."}
                              </p>
                           </div>
                        </div>
                     </div>
                   </React.Fragment>
                 ))}
              </div>

              <div className="md:hidden text-center">
                 <Button variant="outline" onClick={() => setPage('gallery')} className="w-full">
                    Lihat Semua Portfolio <ArrowRight size={16} />
                  </Button>
              </div>
           </div>
        </section>
      )}

      {/* --- NEW SECTION: TESTIMONIALS (Wall of Love) --- */}
      {featuredTestimonials.length > 0 && (
        <section className="py-20 bg-brand-card border-t border-white/5 relative">
           <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-brand-orange text-xs font-bold uppercase tracking-widest mb-4">
                    <Star size={12} fill="currentColor" /> Terpercaya
                 </div>
                 <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
                    Kata Mitra <span className="text-brand-orange">Bisnis Kami</span>
                 </h2>
                 <p className="text-gray-400 max-w-2xl mx-auto">
                    Kepuasan pelanggan adalah parameter keberhasilan utama kami.
                 </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 {featuredTestimonials.map((testi) => (
                    <React.Fragment key={testi.id}>
                       <div className="bg-brand-dark p-8 rounded-3xl border border-white/5 relative group hover:-translate-y-2 transition-transform duration-300 hover:border-brand-orange/30 hover:shadow-neon">
                          <Quote className="absolute top-8 right-8 text-white/5 group-hover:text-brand-orange/10 transition-colors w-16 h-16 transform rotate-12" />
                          
                          <div className="flex items-center gap-4 mb-6 relative z-10">
                             <div className="w-14 h-14 rounded-full border-2 border-brand-orange/20 p-1 group-hover:border-brand-orange transition-colors">
                                <img 
                                  src={testi.image_url || "https://via.placeholder.com/150"} 
                                  alt={testi.client_name} 
                                  className="w-full h-full rounded-full object-cover" 
                                />
                             </div>
                             <div>
                                <h4 className="text-white font-bold text-lg">{testi.client_name}</h4>
                                <p className="text-brand-orange text-xs font-bold uppercase tracking-wider">{testi.business_name}</p>
                             </div>
                          </div>

                          <div className="flex gap-1 mb-4">
                             {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} className={`${i < testi.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                             ))}
                          </div>

                          <p className="text-gray-300 italic leading-relaxed relative z-10">
                             "{testi.content}"
                          </p>
                       </div>
                    </React.Fragment>
                 ))}
              </div>
           </div>
        </section>
      )}

      {/* Services */}
      <section className="py-20 bg-brand-dark border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Layanan Pengembangan <span className="text-brand-orange">Digital</span></h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Palette, title: "Pembuatan Website", desc: "Website Company Profile & Toko Online SEO-Friendly." },
              { icon: Code, title: "Web App Development", desc: "Aplikasi custom (SaaS/Internal Tools) sesuai kebutuhan." },
              { icon: Search, title: "Optimasi SEO", desc: "Strategi SEO untuk ranking 1 Google." },
              { icon: Settings, title: "Maintenance", desc: "Pengelolaan konten & keamanan server." }
            ].map((service, idx) => (
              <React.Fragment key={idx}>
                <Card className="p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-neon">
                    <service.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                </Card>
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
