
import React from 'react';
import { Target, Compass, Zap, ShieldCheck, Users, TrendingUp, Lightbulb, Flag, Anchor } from 'lucide-react';
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
            <Anchor size={14} className="text-brand-orange" />
            <span className="text-xs font-bold text-gray-300 tracking-[0.2em] uppercase">Peta Perang Kita</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
            Mimpi Gede, <br/><span className="text-brand-orange">Kerja Keras.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed">
            Gue gak bangun PT Mesin Kasir Solo cuma buat cari untung receh. Gue punya misi buat nyelametin ribuan UMKM dari kebangkrutan karena buta data.
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
                  
                  <h2 className="text-3xl font-display font-bold text-white mb-6">Visi Gue (The Dream)</h2>
                  <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-light">
                    "Menjadi <strong className="text-brand-orange">Benteng Pertahanan Digital #1</strong> buat UMKM Indonesia. Gue mau liat warung kecil punya sistem secanggih minimarket modern, tanpa harus bayar mahal."
                  </p>
               </div>
            </div>

            {/* MISSION LIST */}
            <div className="flex flex-col justify-center space-y-6">
               <div className="mb-4">
                  <h2 className="text-3xl font-display font-bold text-white mb-2 flex items-center gap-3">
                    <Flag className="text-brand-orange"/> Misi Harian (The Grind)
                  </h2>
                  <p className="text-gray-400">Ini yang tim gue kerjain tiap hari buat lo:</p>
               </div>

               {[
                 { title: "Hancurin Mitos Mahal", desc: "Teknologi canggih gak harus bikin kantong bolong. Gue hadirkan mesin kasir & software enterprise dengan harga rakyat." },
                 { title: "Edukasi Sampai Pinter", desc: "Gue haram hukumnya jual putus. Lo dan staf lo bakal gue training sampai bener-bener ngerti cara baca data bisnis." },
                 { title: "Inovasi Gak Ada Matinya", desc: "SIBOS & QALAM bakal terus gue update. Lo gak perlu pusing mikirin coding, biar itu urusan gue." },
                 { title: "Support Tanpa Drama", desc: "Kalau alat rusak, gue yang pusing, bukan lo. Tim teknis gue siap backup biar jualan lo gak keganggu." }
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
          <SectionHeader title="DNA" highlight="Gue" subtitle="Prinsip jalanan yang gue tanam ke semua anak buah gue." />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <ValueCard 
                icon={ShieldCheck} 
                title="Jujur Harga Mati" 
                desc="Gue gak bakal jual barang yang gak lo butuhin cuma demi omzet. Kalau barang jelek, gue bilang jelek. Transparansi nomor satu."
             />
             <ValueCard 
                icon={TrendingUp} 
                title="Mental Baja" 
                desc="Lahir dari kegagalan 2022, gue punya mental survivor. Gue ngerti susahnya bangun bisnis dari nol karena gue juga ngalamin."
             />
             <ValueCard 
                icon={Lightbulb} 
                title="Anti Sambat" 
                desc="Disini gak ada tempat buat ngeluh. Ada masalah? Cari solusi. Error? Perbaiki. Deadline? Sikat."
             />
             <ValueCard 
                icon={Users} 
                title="Lo Bosnya" 
                desc="Gue idup dari profit lo. Kalau bisnis lo mati, bisnis gue juga mati. Jadi gue bakal mati-matian bikin lo sukses."
             />
             <ValueCard 
                icon={Zap} 
                title="Sat Set Wat Wet" 
                desc="Bisnis itu balapan. Gue kerja cepet. Chat dibales kilat, pengiriman gak pake lama, support sat-set."
             />
             <ValueCard 
                icon={Compass} 
                title="Jangka Panjang" 
                desc="Gue gak cari 'hit and run'. Gue mau nemenin lo dari jualan di garasi sampai punya cabang di mana-mana."
             />
          </div>
        </div>
      </section>

      {/* MANIFESTO / CULTURE */}
      <section className="py-24 relative overflow-hidden">
         <div className="absolute inset-0 bg-brand-orange/5"></div>
         <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
               "Gue Gak Jual Alat Sulap,<br/>Gue Jual <span className="text-brand-orange">Senjata Perang.</span>"
            </h2>
            <div className="max-w-3xl mx-auto bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl">
               <p className="text-gray-300 text-lg leading-relaxed italic">
                  "Di PT Mesin Kasir Solo, gue percaya satu hal: Bisnis tanpa data itu judi. Tugas gue adalah mastiin lo pegang kartu As (Sistem & Data) biar lo selalu menang di pasar."
               </p>
               <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="h-px w-12 bg-brand-orange"></div>
                  <span className="text-brand-orange font-bold uppercase tracking-widest text-xs">Amin Maghfuri, Founder</span>
                  <div className="h-px w-12 bg-brand-orange"></div>
               </div>
            </div>
         </div>
      </section>

    </div>
  );
};
