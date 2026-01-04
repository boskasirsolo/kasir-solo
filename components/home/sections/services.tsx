
import React from 'react';
import { Palette, Code, Search, Settings, ArrowRight, Calculator } from 'lucide-react';
import { Card } from '../../ui';

export const ServicesGrid = ({ setPage }: { setPage: (p: string) => void }) => (
  <section className="py-24 bg-brand-dark border-t border-white/5 relative overflow-hidden">
    {/* Background elements for depth */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Bukan Sekadar <span className="text-brand-orange">Mesin Kasir.</span>
        </h2>
        <p className="text-gray-400 text-lg leading-relaxed">
          Banyak vendor IT cuma bisa jual alat tapi gak ngerti bisnis. Gue peduli <strong>ROI (Balik Modal)</strong> lo. 
          Setiap <strong>mesin kasir</strong> dan sistem yang gue rakit punya satu tujuan: <span className="text-white font-bold">Bikin Bisnis Lo Gede.</span>
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            icon: Palette, 
            title: "Web Konversi Tinggi", 
            subtitle: "Landing Page / Compro",
            desc: "Website bukan pajangan. Gue racik UI/UX dan Copywriting biar pengunjung gak cuma liat-liat, tapi klik tombol beli.", 
            link: "services/website",
            color: "text-brand-orange"
          },
          { 
            icon: Code, 
            title: "Sistem ERP Custom", 
            subtitle: "Web App / Internal System",
            desc: "Lupain Excel yang berantakan. Satu sistem terpusat buat stok, kasir, dan laporan keuangan real-time milik lo sendiri.", 
            link: "services/webapp",
            color: "text-blue-400"
          },
          { 
            icon: Search, 
            title: "Jajah Google (SEO)", 
            subtitle: "SEO & Local Search",
            desc: "Jangan biarkan kompetitor nyuri pelanggan lo. Gue optimasi biar toko lo muncul paling atas pas orang nyari di Google.", 
            link: "services/seo",
            color: "text-green-400"
          },
          { 
            icon: Settings, 
            title: "Satpam Digital", 
            subtitle: "Maintenance & Security",
            desc: "Tidur nyenyak tanpa takut website di-hack, error, atau lemot. Backup rutin dan gue pantau keamanannya 24/7.", 
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

              <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-widest group-hover:gap-3 transition-all">
                    Detail <ArrowRight size={14} className={service.color} />
                </span>
                
                {/* Simulasi Button */}
                <button 
                    onClick={(e) => { e.stopPropagation(); setPage(service.link); }}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-brand-orange text-white hover:bg-brand-action hover:shadow-neon text-xs md:text-sm font-bold transition-all transform hover:-translate-y-0.5"
                >
                    <Calculator size={16} /> Simulasi
                </button>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  </section>
);
