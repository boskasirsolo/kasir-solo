
import React from 'react';
import { History, Rocket, AlertTriangle, Sunrise, Users, Target, Building, Quote, ShieldCheck, BadgeCheck, FileText, Lock } from 'lucide-react';
import { SiteConfig } from '../types';
import { Button } from '../components/ui';

export const AboutPage = ({ config }: { config?: SiteConfig }) => (
  <div className="animate-fade-in">
    {/* Hero Section */}
    <div className="bg-brand-card py-24 border-b border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-20 left-10 text-[200px] font-bold text-white/5 pointer-events-none select-none">
        STORY
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Sebuah Catatan <span className="text-brand-orange">Kaki</span></h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed font-light">
          Kenapa Kami Memulai Lagi? Sebuah cerita jujur tentang kehancuran dan fondasi baru.
        </p>
      </div>
    </div>

    {/* NARRATIVE SECTION 1: THE HOOK */}
    <section className="py-20 bg-brand-black relative">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Quote Block 1 */}
                <div className="relative border-l-4 border-brand-orange pl-8 py-4">
                    <Quote className="absolute -top-6 -left-4 text-brand-orange fill-brand-orange w-8 h-8 opacity-20" />
                    <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight mb-4">
                        "Jujur-jujuran aja. Tahun 2022, PT Mesin Kasir Solo pernah 'mati suri'."
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Aset digital hilang, domain diambil orang, sistem berantakan. Saat itu saya belajar satu hal mahal: <strong>Bisnis tanpa sistem yang kuat adalah bom waktu.</strong>
                    </p>
                </div>

                {/* Narrative Block */}
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">The Turn (Titik Balik)</h4>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Dari kehancuran itu, saya (Amin Maghfuri) membangun ulang semuanya. Bukan untuk balas dendam, tapi untuk memastikan <strong>Anda tidak perlu mengalami kegagalan yang sama.</strong>
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            SIBOS dan QALAM lahir dari rasa sakit itu. Ini bukan sekadar software jualan, ini adalah <strong>asuransi kegagalan</strong> Anda. Kami membangun fitur berdasarkan apa yang <em>menyelamatkan uang</em>, bukan cuma apa yang <em>keren</em>.
                        </p>
                    </div>
                    <div className="bg-brand-dark/50 p-8 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <Users className="text-brand-orange w-8 h-8" />
                            <span className="text-white font-bold text-lg">Praktisi, Bukan Teoretisi.</span>
                        </div>
                        <p className="text-sm text-gray-500 italic">
                            "Developer lain membuat fitur di ruangan ber-AC. Saya membuat fitur di lapangan panas, menghadapi komplain pelanggan, dan selisih stok nyata."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    {/* TIMELINE STORY ARC */}
    <div className="container mx-auto px-4 py-20 relative border-t border-white/5 bg-brand-dark/30">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-orange/50 to-transparent hidden md:block"></div>
      
      <div className="space-y-24 relative z-10 max-w-6xl mx-auto">
        
        {/* CHAPTER 1: 2015 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 1</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2015: Single Fighter</h3>
              <p className="text-gray-400 leading-relaxed">
                Tanpa tim, tanpa investor. Saya berjalan <em>door-to-door</em> menawarkan mesin kasir di Solo Raya. Penolakan adalah sarapan pagi. Di fase ini saya belajar memahami kebutuhan pedagang kecil secara mendalam.
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-brand-dark border-2 border-brand-orange rounded-full flex items-center justify-center text-brand-orange shadow-neon z-20 group-hover:scale-110 transition-transform duration-500">
                <History size={28} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-3 hidden md:block"></div>
        </div>

        {/* CHAPTER 2: 2019 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 order-3 md:order-1 hidden md:block"></div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-brand-dark border-2 border-white/10 group-hover:border-blue-500 rounded-full flex items-center justify-center text-white group-hover:text-blue-500 transition-colors z-20 shadow-lg">
                <Rocket size={28} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2 md:order-3">
              <span className="text-blue-500 font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 2</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2019: Puncak Ekspansi</h3>
              <p className="text-gray-400 leading-relaxed">
                Kerja keras terbayar. Kami melayani 500+ outlet di seluruh Indonesia. Optimisme tinggi, namun kami lengah pada fondasi manajemen internal.
              </p>
           </div>
        </div>

        {/* CHAPTER 3: 2022 (THE FALL) */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 3</span>
              <h3 className="text-3xl font-display font-bold text-red-500 mb-4">2022: Titik Nadir</h3>
              <p className="text-gray-400 leading-relaxed">
                Cashflow macet, infrastruktur digital runtuh. Domain legendaris hangus dan diambil orang. Reputasi nasional lenyap sekejap. Ini adalah pelajaran termahal tentang pentingnya sistem.
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-red-900/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] z-20 animate-pulse">
                <AlertTriangle size={28} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-3 hidden md:block"></div>
        </div>

        {/* CHAPTER 4: 2025 (THE REBIRTH) */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 order-3 md:order-1 hidden md:block"></div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center text-white shadow-neon-strong z-20">
                <Sunrise size={32} />
              </div>
           </div>
           <div className="w-full md:w-1/2 order-2 md:order-3">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 4</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2025: The Rebirth</h3>
              <div className="bg-brand-orange/10 border-l-4 border-brand-orange p-4 rounded-r-lg mb-4">
                 <p className="text-gray-300 italic">"Kami kembali untuk merebut apa yang pernah menjadi milik kami."</p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Dengan pondasi SIBOS & QALAM yang jauh lebih kuat. Kami kembali bukan sebagai vendor, tapi sebagai partner yang melindungi bisnis Anda dari kehancuran.
              </p>
           </div>
        </div>

      </div>
    </div>

    {/* OFFICE PHOTO SECTION */}
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden group border-t border-white/5">
        <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
            {config?.aboutImage ? (
                <img 
                    src={config.aboutImage} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                    alt="Kantor PT Mesin Kasir Solo" 
                />
            ) : (
                <div className="text-gray-600 flex flex-col items-center">
                    <Building size={48} className="mb-2"/>
                    <p>Office Photo Placeholder</p>
                </div>
            )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent flex flex-col justify-end pb-12 px-4 text-center">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Basecamp Perjuangan</h3>
            <p className="text-gray-400">Tempat dimana ide-ide liar dieksekusi menjadi solusi nyata.</p>
        </div>
    </section>

    {/* LEGALITY SECTION (RE-USED) */}
    <section className="py-20 bg-brand-black border-t border-white/5">
       <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
             <ShieldCheck size={40} className="mx-auto text-blue-500 mb-4" />
             <h2 className="text-3xl font-display font-bold text-white mb-2">Validitas Hukum</h2>
             <p className="text-gray-400">Kami beroperasi secara transparan dan legal di bawah hukum Republik Indonesia.</p>
          </div>
          
          <div className="bg-brand-card/50 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 shadow-lg">
             <div className="flex-1 space-y-4 w-full">
                {config?.companyLegalName && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">Badan Hukum</span>
                      <span className="text-white font-bold text-sm flex items-center gap-2"><BadgeCheck size={14} className="text-blue-400"/> {config.companyLegalName}</span>
                   </div>
                )}
                {config?.nibNumber && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">NIB (Nomor Induk Berusaha)</span>
                      <span className="text-white font-mono text-sm">{config.nibNumber}</span>
                   </div>
                )}
                {config?.ahuNumber && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">SK Kemenkumham (AHU)</span>
                      <span className="text-white font-mono text-sm">{config.ahuNumber}</span>
                   </div>
                )}
                <div className="pt-2">
                   <p className="text-xs text-gray-500 leading-relaxed italic">
                      *Dokumen asli (Scan SK, NIB, NPWP) tersedia untuk kebutuhan administrasi vendor (Vendor List) atau tender perusahaan. Silakan hubungi admin kami.
                   </p>
                </div>
             </div>
             
             <div className="w-full md:w-auto flex justify-center">
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl text-center max-w-xs">
                    <p className="text-blue-200 text-xs font-bold mb-2 uppercase tracking-wider">Cek Validitas</p>
                    <p className="text-xs text-gray-400 mb-4">Anda dapat memverifikasi legalitas kami secara mandiri melalui laman resmi pemerintah.</p>
                    <a href="https://oss.go.id" target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition-colors">
                       Buka OSS.GO.ID
                    </a>
                </div>
             </div>
          </div>
       </div>
    </section>

  </div>
);
