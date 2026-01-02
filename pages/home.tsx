
import React, { useState } from 'react';
import { ArrowRight, Zap, Monitor, BarChart3, Palette, Code, Search, Settings, Star, Quote, ExternalLink, User, MessageCircle, ShieldCheck } from 'lucide-react';
import { SiteConfig, GalleryItem, Testimonial } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { ProjectDetailModal } from '../components/gallery-modal'; // Import Modal

// Helper to find matching testimonial or return placeholder
const getTestimonialForProject = (projectTitle: string, testimonials: Testimonial[]) => {
  return testimonials.find(t => 
    projectTitle.toLowerCase().includes(t.business_name.toLowerCase()) || 
    t.business_name.toLowerCase().includes(projectTitle.toLowerCase())
  ) || {
    // Placeholder data if no specific testimonial found
    client_name: "Klien Prioritas",
    content: "Pelayanan sangat personal, Mas Amin bantu setup sistem sampai benar-benar jalan lancar di toko kami.",
    rating: 5,
    image_url: "" 
  };
};

// Component for the "Combined Card" (Project + Testimonial)
const CombinedCard = ({ 
  item, 
  testimonials, 
  onClick 
}: { 
  item: GalleryItem, 
  testimonials: Testimonial[], 
  onClick: (item: GalleryItem) => void 
}) => {
  const testimonial = getTestimonialForProject(item.title, testimonials);
  
  return (
    <div 
      onClick={() => onClick(item)}
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
  const [selectedProject, setSelectedProject] = useState<GalleryItem | null>(null);
  
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="container mx-auto px-4 z-10 text-center relative">
          <div className="inline-flex items-center gap-2 px-6 py-2 border border-brand-orange/50 rounded-full bg-brand-orange/10 mb-8 backdrop-blur-md shadow-neon hover:bg-brand-orange/20 transition-colors cursor-default">
            <ShieldCheck size={16} className="text-brand-orange" />
            <span className="text-brand-orange text-xs md:text-sm font-bold tracking-widest uppercase">
              10 Tahun Pengalaman • 500+ Outlet
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight drop-shadow-lg">
            {config.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {config.heroSubtitle}
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Button onClick={() => setPage('shop')} className="px-10 py-4 text-base">
              LIHAT KATALOG <ArrowRight size={22} />
            </Button>
            <Button variant="outline" onClick={() => setPage('about')} className="px-10 py-4 text-base">
              KENAPA KAMI?
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Services Section - REVISED COPYWRITING */}
      <section className="py-24 bg-brand-card border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                  Sistem yang <span className="text-brand-orange">Bekerja Untuk Anda</span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Hemat gaji karyawan admin. Biarkan sistem SIBOS yang membereskan stok dan laporan keuangan Anda secara otomatis.
                </p>
              </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Training Sampai Bisa", 
                desc: "Kami tidak akan meninggalkan Anda setelah pembayaran. Garansi training operator sampai mahir, gratis konsultasi kendala di lapangan." 
              },
              { 
                icon: Monitor, 
                title: "Anti-Fraud System", 
                desc: "Cegah kebocoran kas dan stok. Sistem kami dirancang untuk mendeteksi kecurangan karyawan dengan log aktivitas yang detail." 
              },
              { 
                icon: BarChart3, 
                title: "Support Langsung Ahlinya", 
                desc: "Anda tidak akan dilayani oleh Chatbot. Support teknis ditangani langsung oleh praktisi yang mengerti alur bisnis dan IT." 
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 border border-white/5 rounded-2xl bg-brand-dark/80 hover:border-brand-orange transition-all duration-300 group hover:shadow-neon hover:-translate-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl group-hover:bg-brand-orange/10 transition-colors"></div>
                <feature.icon className="w-14 h-14 text-brand-orange mb-6 group-hover:scale-110 transition-transform duration-300 drop-shadow-neon" />
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- GALLERY & TESTIMONIALS (SLOW MARQUEE) --- */}
      {featuredGallery.length > 0 && (
        <section className="py-24 bg-brand-black border-t border-white/5 relative overflow-hidden">
           <div className="container mx-auto px-4 relative z-10 mb-12 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                  Jejak Langkah <span className="text-brand-orange">Kami</span>
                </h2>
                <p className="text-gray-400 text-base">Bukti nyata instalasi dan inovasi digital di lapangan sejak 2015.</p>
              </div>
           </div>

           <div className="relative w-full overflow-hidden group/marquee mb-12">
             <div className="absolute left-0 top-0 bottom-0 w-12 md:w-40 bg-gradient-to-r from-brand-black to-transparent z-20 pointer-events-none"></div>
             <div className="absolute right-0 top-0 bottom-0 w-12 md:w-40 bg-gradient-to-l from-brand-black to-transparent z-20 pointer-events-none"></div>

             <div className="flex w-full gap-8">
                <div className="flex min-w-full shrink-0 animate-marquee gap-8 justify-around items-stretch py-4 group-hover/marquee:[animation-play-state:paused] group-active/marquee:[animation-play-state:paused]">
                  {featuredGallery.map((item) => (
                    <React.Fragment key={`orig-${item.id}`}>
                      <CombinedCard item={item} testimonials={testimonials} onClick={setSelectedProject} />
                    </React.Fragment>
                  ))}
                </div>
                <div className="flex min-w-full shrink-0 animate-marquee gap-8 justify-around items-stretch py-4 group-hover/marquee:[animation-play-state:paused] group-active/marquee:[animation-play-state:paused]" aria-hidden="true">
                  {featuredGallery.map((item) => (
                    <React.Fragment key={`clone-${item.id}`}>
                      <CombinedCard item={item} testimonials={testimonials} onClick={setSelectedProject} />
                    </React.Fragment>
                  ))}
                </div>
             </div>
           </div>

           <div className="relative z-10 text-center">
             <Button onClick={() => setPage('gallery')} className="px-8 py-4 text-base font-bold shadow-action hover:shadow-action-strong transition-transform hover:-translate-y-1 mx-auto">
                LIHAT SEMUA PORTFOLIO <ArrowRight size={20} />
             </Button>
           </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-20 bg-brand-dark border-t border-white/5 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Layanan <span className="text-brand-orange">Digital</span></h2>
            <p className="text-gray-400">Saya tidak jualan web cantik. Saya jualan web yang menghasilkan uang.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Palette, title: "Web Bisnis & Toko", desc: "Website SEO-friendly yang dirancang untuk konversi penjualan.", link: "services/website" },
              { icon: Code, title: "Custom Web App", desc: "Sistem internal perusahaan (ERP/Gudang) sesuai alur bisnis Anda.", link: "services/webapp" },
              { icon: Search, title: "SEO & Traffic", desc: "Strategi agar bisnis Anda ditemukan calon pembeli di Google.", link: "services/seo" },
              { icon: Settings, title: "Maintenance", desc: "Jasa rawat website & keamanan server agar Anda tidur nyenyak.", link: "services/maintenance" }
            ].map((service, idx) => (
              <div key={idx} onClick={() => setPage(service.link)} className="cursor-pointer h-full">
                <Card className="p-8 flex flex-col items-center text-center h-full hover:bg-brand-card transition-colors">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-neon">
                    <service.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- NEW SECTION: FOUNDER DIRECT ACCESS --- */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-brand-black to-brand-dark border-t border-white/5">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none"></div>
         
         <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-brand-orange p-1 mx-auto mb-6 shadow-neon-strong bg-brand-dark">
                {/* Placeholder for Founder Photo - Replace with actual URL if available */}
                <div className="w-full h-full rounded-full bg-brand-card flex items-center justify-center overflow-hidden">
                    <User size={40} className="text-gray-400" />
                </div>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight">
               Bicara Langsung dengan <br/><span className="text-brand-orange">Arsitek Sistemnya</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed mb-10">
               Anda tidak akan dilayani oleh Chatbot atau Admin magang yang menjawab pakai template. 
               Saya, <strong>Amin Maghfuri</strong>, akan langsung membedah kebutuhan bisnis Anda dan memberikan solusi teknis yang paling efisien.
            </p>
            
            <div className="flex justify-center">
               <a 
                  href={`https://wa.me/${config.whatsappNumber}?text=Halo Mas Amin, saya ingin konsultasi sistem untuk bisnis saya.`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-brand-orange hover:bg-brand-glow text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,95,31,0.4)] hover:shadow-[0_0_30px_rgba(255,95,31,0.6)] transition-all transform hover:-translate-y-1"
               >
                  <MessageCircle size={24} /> WhatsApp Mas Amin (Founder)
               </a>
            </div>
            <p className="mt-6 text-xs text-gray-500 uppercase tracking-widest">
               Konsultasi Gratis • Respon Cepat • Tanpa Perantara
            </p>
         </div>
      </section>

      {/* RENDER MODAL */}
      {selectedProject && (
        <ProjectDetailModal 
          item={selectedProject} 
          testimonials={testimonials} 
          onClose={() => setSelectedProject(null)} 
        />
      )}
    </div>
  );
};
