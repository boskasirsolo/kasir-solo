
import React from 'react';
import { Target, Compass, Zap, ShieldCheck, Users, TrendingUp, Lightbulb, Flag } from 'lucide-react';
import { SectionHeader, Card } from '../components/ui';

const ValueCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <Card className="p-6 bg-brand-dark/50 border border-white/5 hover:border-brand-orange/50 transition-all duration-300 group h-full">
    <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-brand-orange group-hover:border-brand-orange/50 mb-4 transition-colors shadow-lg">
      <Icon size={24} />
    </div>
    <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </Card>
);

export const VisionPage = () => {
  return (
    <div className="animate-fade-in">
      
      {/* HERO SECTION */}
      <section className="relative py-24 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-orange/10 rounded-full blur-[150px] pointer-events-none"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
            <Compass size={14} className="text-brand-orange" />
            <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Arah & Tujuan Kami</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Visi & <span className="text-brand-orange">Misi</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
            Peta jalan PT Mesin Kasir Solo dalam menavigasi era digital dan membawa UMKM Indonesia naik kelas.
          </p>
        </div>
      </section>

      {/* VISION & MISSION SPLIT */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            
            {/* VISION CARD (Highlight) */}
            <div className="relative group">
               <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 to-transparent rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
               <div className="relative bg-brand-card border border-brand-orange/30 rounded-3xl p-8 md:p-12 h-full flex flex-col justify-center overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Target size={200} />
                  </div>
                  
                  <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center text-white mb-8 shadow-neon-strong">
                    <Target size={32} />
                  </div>
                  
                  <h2 className="text-3xl font-display font-bold text-white mb-6">Visi Kami (The Dream)</h2>
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                    "Menjadi <strong className="text-brand-orange">Ekosistem Digital #1</strong> yang paling dipercaya oleh pengusaha UMKM di Indonesia, dengan menyediakan solusi teknologi yang terjangkau, edukatif, dan berdampak nyata."
                  </p>
               </div>
            </div>

            {/* MISSION LIST */}
            <div className="flex flex-col justify-center space-y-6">
               <div className="mb-4">
                  <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                    <Flag className="text-brand-orange"/> Misi Kami (The Roadmap)
                  </h2>
                  <p className="text-gray-400">Langkah konkret yang kami lakukan setiap hari:</p>
               </div>

               {[
                 { title: "Demokratisasi Teknologi", desc: "Menghapus stigma bahwa teknologi canggih itu mahal. Kami menghadirkan mesin kasir & software enterprise dengan harga UMKM." },
                 { title: "Edukasi Berkelanjutan", desc: "Bukan sekadar jual putus. Kami berkomitmen mengedukasi owner & staff agar melek digital lewat training dan pendampingan." },
                 { title: "Inovasi Tanpa Henti", desc: "Terus mengembangkan SIBOS & QALAM agar selalu relevan dengan perubahan zaman dan kebutuhan pasar yang dinamis." },
                 { title: "Layanan Purna Jual Prima", desc: "Memberikan rasa aman kepada klien dengan layanan support teknis yang responsif dan solutif seumur hidup." }
               ].map((m, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                    <div className="text-brand-orange font-display font-bold text-xl opacity-50">0{i+1}</div>
                    <div>
                       <h4 className="text-white font-bold text-lg mb-1">{m.title}</h4>
                       <p className="text-gray-400 text-sm leading-relaxed">{m.desc}</p>
                    </div>
                 </div>
               ))}
            </div>

          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="py-20 bg-brand-dark border-t border-white/5">
        <div className="container mx-auto px-4">
          <SectionHeader title="DNA" highlight="Perusahaan" subtitle="Nilai-nilai inti yang menjadi pondasi karakter tim kami." />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <ValueCard 
                icon={ShieldCheck} 
                title="Integrity First" 
                desc="Kejujuran adalah mata uang kami. Kami tidak akan merekomendasikan produk yang tidak Anda butuhkan hanya demi omzet."
             />
             <ValueCard 
                icon={TrendingUp} 
                title="Resilience (Bangkit)" 
                desc="Lahir dari kegagalan dan kehilangan, kami memiliki mental baja. Kami mengerti perjuangan UMKM karena kami juga pernah di posisi terendah."
             />
             <ValueCard 
                icon={Lightbulb} 
                title="Solution Oriented" 
                desc="Kami tidak fokus pada masalah, tapi pada solusi. Setiap kendala teknis adalah tantangan yang harus dipecahkan dengan cepat."
             />
             <ValueCard 
                icon={Users} 
                title="Customer Obsessed" 
                desc="Klien bukan raja, tapi partner. Kesuksesan bisnis Anda adalah portofolio terbaik bagi kami."
             />
             <ValueCard 
                icon={Zap} 
                title="Speed & Agility" 
                desc="Dunia bisnis bergerak cepat. Kami bekerja dengan speed tinggi dalam pelayanan, pengiriman, dan support."
             />
             <ValueCard 
                icon={Compass} 
                title="Long Term Vision" 
                desc="Kami membangun hubungan jangka panjang. Kami ingin menemani bisnis Anda tumbuh dari rintisan hingga menjadi raksasa."
             />
          </div>
        </div>
      </section>

      {/* MANIFESTO / CULTURE */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-orange/5"></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
               "We Don't Just Sell Tools,<br/>We <span className="text-brand-orange">Upgrade Businesses.</span>"
            </h2>
            <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
               <p className="text-gray-300 text-lg leading-relaxed italic">
                  "Di PT Mesin Kasir Solo, kami percaya bahwa setiap transaksi yang tercatat rapi adalah langkah awal menuju kebebasan finansial. Tugas kami adalah memastikan alat perang Anda (Hardware & Software) selalu siap tempur, agar Anda bisa fokus memenangkan pasar."
               </p>
               <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-brand-orange"></div>
                  <span className="text-brand-orange font-bold uppercase tracking-widest text-xs">Amin Maghfuri, CEO</span>
                  <div className="h-px w-12 bg-brand-orange"></div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};
