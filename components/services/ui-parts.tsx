
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card, SectionHeader } from '../ui';

// --- ATOMS ---

export const ServiceHero = ({ 
  title, 
  highlight, 
  subtitle, 
  icon: Icon,
  waNumber
}: { 
  title: string, 
  highlight: string, 
  subtitle: string, 
  icon: any,
  waNumber?: string
}) => {
  const targetWa = waNumber || "6282325103336";
  
  return (
    <section className="relative py-20 overflow-hidden border-b border-white/5">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="container mx-auto px-4 relative z-10 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-brand-orange mx-auto mb-6 shadow-neon border border-white/10">
          <Icon size={32} />
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
          {title} <span className="text-brand-orange">{highlight}</span>
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-8">
          {subtitle}
        </p>
        <div className="flex justify-center gap-4">
          <a 
            href={`https://wa.me/${targetWa}?text=Halo, saya ingin konsultasi layanan digital.`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3 bg-brand-action hover:bg-brand-actionGlow text-white rounded-xl font-bold transition-all shadow-action hover:shadow-action-strong"
          >
            Konsultasi Gratis <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
};

export const FeatureGrid = ({ features }: { features: { title: string, desc: string, icon: any }[] }) => (
  <section className="py-12 md:py-16 bg-brand-dark overflow-hidden">
    <div className="container mx-auto px-4">
      {/* MOBILE: Horizontal Scroll Snap | DESKTOP: Grid */}
      <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 custom-scrollbar-hide">
        {features.map((f, i) => (
          <Card key={i} className="min-w-[85vw] md:min-w-0 snap-center p-6 md:p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group transition-all duration-300 h-full">
            <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-brand-orange mb-4 border border-white/10 group-hover:bg-brand-orange group-hover:text-white transition-colors">
              <f.icon size={24} />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-brand-orange transition-colors">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </Card>
        ))}
      </div>
      {/* Mobile Indicator Hint */}
      <p className="md:hidden text-center text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-widest animate-pulse">
        &larr; Geser Untuk Info Lebih &rarr;
      </p>
    </div>
  </section>
);

export const WorkflowSection = ({ steps }: { steps: { step: string, title: string, desc: string }[] }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <SectionHeader 
        title="Cara Main" 
        highlight="Gue" 
        subtitle="Lupain birokrasi ribet ala korporat. Kita kerja sat-set: Analisa, Eksekusi, Serah Terima. Transparan dari awal, gak ada biaya siluman." 
      />
      <div className="grid md:grid-cols-4 gap-6 relative">
        {/* Connector Line (Desktop) */}
        <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-orange/0 via-brand-orange/30 to-brand-orange/0"></div>
        
        {steps.map((s, i) => (
          <div key={i} className="relative pt-8 text-center group">
            <div className="w-8 h-8 rounded-full bg-brand-dark border-2 border-brand-orange text-brand-orange font-bold flex items-center justify-center mx-auto mb-4 relative z-10 shadow-neon group-hover:scale-110 transition-transform">
              {i + 1}
            </div>
            <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
            <p className="text-sm text-gray-400 max-w-[200px] mx-auto">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- LAYOUTS ---

export const NarrativeSection = ({ 
  children, 
  reverse = false 
}: { 
  children?: React.ReactNode, 
  reverse?: boolean 
}) => (
  <section className="py-16 bg-brand-black relative border-b border-white/5">
     <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
            {children}
        </div>
     </div>
  </section>
);
