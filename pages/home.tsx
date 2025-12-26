
import React from 'react';
import { ArrowRight, Zap, Monitor, BarChart3, Palette, Code, Search, Settings } from 'lucide-react';
import { SiteConfig } from '../types';
import { Button, Card } from '../components/ui';

export const HomePage = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => (
  <div className="animate-fade-in">
    {/* Hero Section */}
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-orange/15 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="container mx-auto px-4 z-10 text-center relative">
        <div className="inline-block px-6 py-2 border border-brand-orange rounded-full bg-brand-orange/10 mb-8 backdrop-blur-md shadow-neon">
          <span className="text-brand-orange text-xs md:text-sm font-bold tracking-[0.2em] uppercase">Pusat Digitalisasi Bisnis Solo Raya</span>
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
            <Card key={idx} className="p-8 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-orange mb-6 group-hover:bg-brand-orange group-hover:text-white transition-all duration-300 shadow-neon">
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{service.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  </div>
);
