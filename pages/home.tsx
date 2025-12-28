
import React from 'react';
import { ArrowRight, Zap, Monitor, BarChart3, Palette, Code, Search, Settings, Star, Quote, ExternalLink, User } from 'lucide-react';
import { SiteConfig, GalleryItem, Testimonial } from '../types';
import { Button, Card, Badge } from '../components/ui';

// Helper to find matching testimonial or return placeholder
const getTestimonialForProject = (projectTitle: string, testimonials: Testimonial[]) => {
  return testimonials.find(t => 
    projectTitle.toLowerCase().includes(t.business_name.toLowerCase()) || 
    t.business_name.toLowerCase().includes(projectTitle.toLowerCase())
  ) || {
    // Placeholder data if no specific testimonial found
    client_name: "Klien Prioritas",
    content: "Pelayanan sangat memuaskan, tim teknis responsif dan sistem berjalan lancar sesuai kebutuhan bisnis kami.",
    rating: 5,
    image_url: "" 
  };
};

// Component for the "Combined Card" (Project + Testimonial)
const CombinedCard = ({ item, testimonials, setPage }: { item: GalleryItem, testimonials: Testimonial[], setPage: (p: string) => void }) => {
  const testimonial = getTestimonialForProject(item.title, testimonials);
  
  return (
    <div 
      onClick={() => setPage('gallery')}
      className="w-[350px] md:w-[450px] shrink-0 flex flex-col gap-4 group/container cursor-pointer"
    >
      {/* TOP: Project Card */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 group-hover/container:border-brand-orange transition-all shadow-lg group-hover/container:shadow-neon">
          <img 
            src={item.image_url} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover/container:scale-105" 
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
          
          {/* Content Overlay */}
          <div className="absolute bottom-5 left-5 right-5">
              <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase mb-3 border ${item.category_type === 'physical' ? 'bg-brand-orange text-white border-brand-orange' : 'bg-blue-600 text-white border-blue-500'}`}>
                {item.category_type === 'physical' ? 'Hardware' : 'Software'}
              </span>
              <h3 className="text-xl font-bold text-white leading-tight mb-1 truncate drop-shadow-md">
                {item.title}
              </h3>
              <p className="text-gray-300 text-xs truncate opacity-80">
                {item.client_url || "Project Installation"}
              </p>
          </div>
      </div>

      {/* BOTTOM: Testimonial Card */}
      <div className="bg-brand-card/80 backdrop-blur-sm border border-white/5 rounded-xl p-5 relative mt-auto hover:bg-brand-card transition-colors">
          {/* Quote Icon */}
          <div className="absolute -top-3 left-6 bg-brand-dark p-1 rounded-full border border-white/10 text-brand-orange">
             <Quote size={16} fill="currentColor" />
          </div>
          
          <p className="text-gray-400 text-sm italic mb-4 leading-relaxed line-clamp-2">
             "{testimonial.content}"
          </p>
          
          <div className="flex items-center gap-3 pt-3 border-t border-white/5">
              <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-orange/30 overflow-hidden flex items-center justify-center shrink-0">
                 {testimonial.image_url ? (
                   <img src={testimonial.image_url} className="w-full h-full object-cover" />
                 ) : (
                   <User size={14} className="text-gray-500"/>
                 )}
              </div>
              <div>
                 <p className="text-white text-xs font-bold">{testimonial.client_name}</p>
                 <div className="flex gap-0.5 mt-0.5">
                    {[...Array(5)].map((_,i) => (
                      <Star key={i} size={8} className={`${i < testimonial.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                    ))}
                 </div>
              </div>
          </div>
      </div>
    </div>
  );
};

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
  
  // Logic: Get 6 Latest Gallery Items for Marquee
  const featuredGallery = gallery.slice(0, 6);
  
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

      {/* --- REVISED SECTION: GALLERY & TESTIMONIALS (SLOW MARQUEE) --- */}
      {featuredGallery.length > 0 && (
        <section className="py-24 bg-brand-black border-t border-white/5 relative overflow-hidden">
           {/* Header Layout */}
           <div className="container mx-auto px-4 relative z-10 mb-12">
              <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                  <div className="max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                      Karya & Instalasi <span className="text-brand-orange">Terbaru</span>
                    </h2>
                    <p className="text-gray-400 text-base">Bukti nyata dedikasi kami dalam mendigitalisasi UMKM Indonesia dengan standar kualitas terbaik.</p>
                  </div>
                  {/* Styled Orange Button (MATCHING HERO BUTTON STYLE) */}
                  <Button 
                    onClick={() => setPage('gallery')}
                    className="px-8 py-4 text-base font-bold shadow-action hover:shadow-action-strong transition-transform hover:-translate-y-1"
                  >
                    LIHAT SEMUA PORTFOLIO <ArrowRight size={20} />
                  </Button>
              </div>
           </div>

           {/* Infinite Scroll Marquee */}
           <div className="relative w-full overflow-hidden group">
             {/* Gradient Fade Edges */}
             <div className="absolute left-0 top-0 bottom-0 w-12 md:w-40 bg-gradient-to-r from-brand-black to-transparent z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-12 md:w-40 bg-gradient-to-l from-brand-black to-transparent z-20 pointer-events-none"></div>

             <div className="flex w-full gap-8">
                {/* Loop 1 */}
                <div className="flex min-w-full shrink-0 animate-marquee gap-8 justify-around items-stretch py-4">
                  {featuredGallery.map((item) => (
                    <CombinedCard key={`orig-${item.id}`} item={item} testimonials={testimonials} setPage={setPage} />
                  ))}
                </div>
                
                {/* Loop 2 (Clone for Seamless Effect) */}
                <div className="flex min-w-full shrink-0 animate-marquee gap-8 justify-around items-stretch py-4" aria-hidden="true">
                  {featuredGallery.map((item) => (
                    <CombinedCard key={`clone-${item.id}`} item={item} testimonials={testimonials} setPage={setPage} />
                  ))}
                </div>
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
