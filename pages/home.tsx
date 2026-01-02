
import React, { useState } from 'react';
import { ArrowRight, Zap, Monitor, BarChart3, Palette, Code, Search, Settings, Star, Quote, ExternalLink, User, MessageCircle, ShieldCheck, MapPin, Clock, Activity, XCircle, CheckCircle2, TrendingUp, Layers, Heart } from 'lucide-react';
import { SiteConfig, GalleryItem, Testimonial } from '../types';
import { Button, Card, Badge } from '../components/ui';
import { ProjectDetailModal } from '../components/gallery-modal'; // Import Modal

// Helper to find matching testimonial or return placeholder
const getTestimonialForProject = (projectTitle: string, testimonials: Testimonial[]) => {
  return testimonials.find(t => 
    projectTitle.toLowerCase().includes(t.business_name.toLowerCase()) || 
    t.business_name.toLowerCase().includes(projectTitle.toLowerCase())
  ) || {
    // UPDATED PLACEHOLDER: Narasi Personal Touch
    client_name: "Owner Business",
    content: "Awalnya ragu karena saya gaptek, tapi Mas Amin sabar banget ngajarin staf saya sampai bisa. Tanya jam 11 malam pun masih dibalas.",
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

      {/* --- TRUST STRIP (VALIDATION BAR) --- */}
      <div className="border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-20 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-[2s]"></div>
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
             <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-brand-orange shadow-neon-text">
                   <User size={24} />
                </div>
                <div>
                   <h4 className="text-2xl md:text-3xl font-display font-bold text-white">500+</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Mitra UMKM</p>
                </div>
             </div>
             <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-blue-400">
                   <MapPin size={24} />
                </div>
                <div>
                   <h4 className="text-2xl md:text-3xl font-display font-bold text-white">34</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Provinsi</p>
                </div>
             </div>
             <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-green-400">
                   <Activity size={24} />
                </div>
                <div>
                   <h4 className="text-2xl md:text-3xl font-display font-bold text-white">99%</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Uptime Server</p>
                </div>
             </div>
             <div className="p-6 md:p-8 flex items-center justify-center gap-4 hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-brand-dark border border-white/10 flex items-center justify-center text-purple-400">
                   <Clock size={24} />
                </div>
                <div>
                   <h4 className="text-2xl md:text-3xl font-display font-bold text-white">24/7</h4>
                   <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Support Teknis</p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* --- PROBLEM vs SOLUTION SECTION (THE REALITY CHECK) --- */}
      <section className="py-24 bg-brand-black border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Bisnis Tanpa Sistem = <span className="text-red-500">Bom Waktu</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Sadarkah Anda? Tanpa sistem yang benar, Anda tidak sedang berbisnis. Anda sedang "diperbudak" oleh toko Anda sendiri.
              </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
             
             {/* LEFT: THE PAIN (Problem) */}
             <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group hover:border-red-500/40 transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <XCircle size={100} className="text-red-500" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
                      <XCircle size={24}/> CARA LAMA (MANUAL)
                   </h3>
                   <ul className="space-y-6">
                      <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 font-bold">1</div>
                         <div>
                            <h4 className="text-white font-bold mb-1">Uang Bocor Halus</h4>
                            <p className="text-gray-400 text-sm">Kembalian salah, nota hilang, atau mark-up harga oleh karyawan. Sedikit tapi tiap hari.</p>
                         </div>
                      </li>
                      <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 font-bold">2</div>
                         <div>
                            <h4 className="text-white font-bold mb-1">Stok Selisih Terus</h4>
                            <p className="text-gray-400 text-sm">Barang di rak habis, tapi di catatan masih ada. Akhirnya mengecewakan pelanggan.</p>
                         </div>
                      </li>
                      <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 font-bold">3</div>
                         <div>
                            <h4 className="text-white font-bold mb-1">Owner Jadi Tahanan Kota</h4>
                            <p className="text-gray-400 text-sm">Gak berani ninggalin toko karena takut dikadalin. Bisnis jalan, tapi hidup tidak tenang.</p>
                         </div>
                      </li>
                   </ul>
                </div>
             </div>

             {/* RIGHT: THE SOLUTION (Gain) */}
             <div className="bg-brand-dark border border-brand-orange/30 rounded-3xl p-8 relative overflow-hidden shadow-neon group hover:border-brand-orange transition-colors">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <CheckCircle2 size={100} className="text-brand-orange" />
                </div>
                <div className="relative z-10">
                   <h3 className="text-xl font-bold text-brand-orange mb-6 flex items-center gap-2">
                      <CheckCircle2 size={24}/> SOLUSI MESIN KASIR SOLO
                   </h3>
                   <ul className="space-y-6">
                      <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0 font-bold">1</div>
                         <div>
                            <h4 className="text-white font-bold mb-1">Anti-Fraud System</h4>
                            <p className="text-gray-400 text-sm">Setiap sen tercatat. Void/Pembatalan transaksi butuh password owner. Karyawan kerja jujur.</p>
                         </div>
                      </li>
                      <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0 font-bold">2</div>
                         <div>
                            <h4 className="text-white font-bold mb-1">Stok Opname Otomatis</h4>
                            <p className="text-gray-400 text-sm">Peringatan otomatis saat stok menipis. Belanja barang jadi terukur dan efisien.</p>
                         </div>
                      </li>
                      <li className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0 font-bold">3</div>
                         <div>
                            <h4 className="text-white font-bold mb-1">Karyawan Digital 24 Jam</h4>
                            <p className="text-gray-400 text-sm">Sistem kami bekerja seperti manajer yang tidak pernah sakit, cuti, atau resign. Hemat gaji admin.</p>
                         </div>
                      </li>
                   </ul>
                </div>
             </div>

          </div>
        </div>
      </section>

      {/* --- INNOVATION TEASER (TECH COMPANY POSITIONING) --- */}
      <section className="py-24 relative overflow-hidden bg-[#050505]">
         {/* Background Elements */}
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
         <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-brand-orange/50 to-transparent"></div>
         
         <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
               
               {/* Content */}
               <div className="lg:w-1/2 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
                     <Monitor size={14} className="text-blue-400" />
                     <span className="text-xs font-bold text-blue-200 tracking-[0.2em] uppercase">R&D Division 2025</span>
                  </div>
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                     Lebih Dari Sekadar <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Mesin Kasir.</span>
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-8">
                     Kami bukan cuma toko elektronik. Kami adalah <strong>Perusahaan Teknologi</strong>. 
                     Memperkenalkan <strong>SIBOS</strong> (ERP System) dan <strong>QALAM</strong> (Education App). 
                     Ekosistem digital yang dirancang untuk skala Enterprise, kini tersedia untuk UMKM.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                     <Button onClick={() => setPage('innovation')} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)] border-none">
                        LIHAT INOVASI <ArrowRight size={18} />
                     </Button>
                  </div>
               </div>

               {/* Visuals */}
               <div className="lg:w-1/2 relative group">
                  {/* Decorative Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-[100px] pointer-events-none"></div>
                  
                  {/* Cards Composition */}
                  <div className="relative z-10 transform md:rotate-y-12 md:rotate-x-6 transition-transform duration-700 group-hover:rotate-0">
                     {/* Back Card (SIBOS) */}
                     <div className="absolute top-[-20px] right-[-20px] w-full h-full bg-brand-dark border border-brand-orange/30 rounded-2xl p-6 opacity-60 scale-95 transform translate-x-4 -translate-y-4">
                        <div className="flex items-center gap-2 mb-4">
                           <div className="w-3 h-3 rounded-full bg-red-500"></div>
                           <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                           <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                        <div className="space-y-3">
                           <div className="h-20 bg-brand-orange/10 rounded-lg w-full"></div>
                           <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                           <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                        </div>
                     </div>

                     {/* Front Card (QALAM/DASHBOARD) */}
                     <div className="bg-[#0f172a] border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative">
                        <div className="flex justify-between items-center mb-6">
                           <div className="flex items-center gap-2">
                              <Layers className="text-blue-400" size={24} />
                              <span className="text-white font-bold tracking-widest">DASHBOARD</span>
                           </div>
                           <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-1 rounded">LIVE DATA</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-6">
                           <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                              <p className="text-gray-400 text-xs mb-1">Total Omzet</p>
                              <p className="text-white font-bold text-xl">Rp 45.2M</p>
                              <div className="mt-2 text-[10px] text-green-400 flex items-center gap-1"><TrendingUp size={10}/> +12%</div>
                           </div>
                           <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                              <p className="text-gray-400 text-xs mb-1">Active User</p>
                              <p className="text-white font-bold text-xl">1,240</p>
                              <div className="mt-2 text-[10px] text-blue-400">Real-time</div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <div className="h-2 bg-gray-700 rounded-full w-full overflow-hidden">
                              <div className="h-full bg-blue-500 w-[70%]"></div>
                           </div>
                           <div className="flex justify-between text-[10px] text-gray-500">
                              <span>System Load</span>
                              <span>70%</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

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

      {/* Services Grid - REVISED NARRATIVE */}
      <section className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden">
        {/* Background elements for depth */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              Bukan Sekadar Website, <br/> Ini <span className="text-brand-orange">Aset Digital.</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Kebanyakan vendor IT hanya peduli kodingan selesai. Saya peduli <strong>ROI (Return on Investment)</strong> Anda. 
              Setiap baris kode yang kami tulis punya satu tujuan: <span className="text-white font-bold">Mengembangkan Bisnis Anda.</span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: Palette, 
                title: "Web Konversi Tinggi", 
                subtitle: "Landing Page / Compro",
                desc: "Website bukan pajangan. Kami racik UI/UX dan Copywriting agar pengunjung tidak cuma lihat-lihat, tapi klik tombol beli.", 
                link: "services/website",
                color: "text-brand-orange"
              },
              { 
                icon: Code, 
                title: "Sistem ERP Custom", 
                subtitle: "Web App / Internal System",
                desc: "Lupakan Excel yang berantakan. Satu sistem terpusat untuk stok, kasir, dan laporan keuangan real-time milik Anda sendiri.", 
                link: "services/webapp",
                color: "text-blue-400"
              },
              { 
                icon: Search, 
                title: "Dominasi Google", 
                subtitle: "SEO & Local Search",
                desc: "Jangan biarkan kompetitor mencuri pelanggan Anda. Kami optimasi agar toko Anda muncul paling atas saat dicari.", 
                link: "services/seo",
                color: "text-green-400"
              },
              { 
                icon: Settings, 
                title: "Asuransi Digital", 
                subtitle: "Maintenance & Security",
                desc: "Tidur nyenyak tanpa takut website di-hack, error, atau lambat. Backup rutin dan monitoring keamanan 24/7.", 
                link: "services/maintenance",
                color: "text-purple-400"
              }
            ].map((service, idx) => (
              <div key={idx} onClick={() => setPage(service.link)} className="cursor-pointer h-full group">
                <Card className="p-8 flex flex-col h-full hover:bg-brand-card transition-all duration-300 border-white/5 hover:border-brand-orange/30 hover:-translate-y-2 relative overflow-hidden">
                  <div className={`w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-neon-text ${service.color}`}>
                    <service.icon size={28} />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{service.subtitle}</p>
                    <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">{service.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 border-t border-white/5 pt-4">
                    {service.desc}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest group-hover:gap-3 transition-all">
                    Lihat Detail <ArrowRight size={14} className={service.color} />
                  </div>
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
