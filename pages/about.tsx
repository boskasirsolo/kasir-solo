
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
        <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Tentang <span className="text-brand-orange">Perjalanan</span></h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed font-light">
          Sebuah catatan jujur tentang mimpi, kehancuran, dan keberanian untuk memulai lagi dari nol.
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
                        "Gue mau jujur-jujuran aja di sini. Tahun 2022, PT Mesin Kasir Solo itu pernah ada di titik nadir."
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Kita "mati suri", aset digital hilang, dan gue ngerasain sendiri gimana rasanya harus ngerintis semuanya dari nol lagi. Pengalaman pahit itu bikin mata gue kebuka lebar: banyak banget UMKM dan bisnis <em>franchise</em> yang punya website cuma buat gaya-gayaan. Asal punya <em>domain</em>, asal ada foto produk cakep, tapi nggak punya "nyawa" buat bantu operasional atau narik investor.
                    </p>
                </div>

                {/* Narrative Block */}
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4">Kenapa Kita Beda?</h4>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Di dunia bisnis yang bergerak cepat, lo nggak butuh sekadar vendor yang jual alat kasir terus kabur. Lo butuh partner yang ngerti pedihnya selisih stok, pusingnya laporan keuangan yang nggak balance, dan capeknya ngawasin karyawan nakal.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            PT Mesin Kasir Solo lahir dari pengalaman lapangan nyata. DNA kami adalah <strong>empati</strong>. Kami membangun sistem karena kami pernah merasakan sakitnya tidak punya sistem.
                        </p>
                    </div>
                    <div className="bg-brand-dark/50 p-8 rounded-2xl border border-white/5">
                        <div className="flex items-center gap-4 mb-4">
                            <Users className="text-brand-orange w-8 h-8" />
                            <span className="text-white font-bold text-lg">Partner, Bukan Vendor.</span>
                        </div>
                        <p className="text-sm text-gray-500 italic">
                            "Kami tidak akan merekomendasikan alat yang tidak Anda butuhkan hanya demi omzet. Kejujuran adalah mata uang kami."
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </section>

    {/* LEGALITAS & VERIFIKASI (NEW SECTION) */}
    {(config?.companyLegalName || config?.nibNumber) && (
      <section className="py-16 bg-brand-dark border-t border-white/5 relative">
         <div className="container mx-auto px-4 max-w-4xl">
            <div className="bg-brand-card border border-white/10 rounded-2xl p-8 relative overflow-hidden shadow-2xl">
               {/* Background Watermark */}
               <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
                  <ShieldCheck size={200} />
               </div>

               <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                  <div className="flex-1">
                     <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                        <BadgeCheck className="text-blue-400" />
                        Legalitas & Izin Usaha
                     </h3>
                     <p className="text-gray-400 text-sm mb-6">
                        Kami beroperasi di bawah payung hukum yang sah dan terdaftar di kementerian terkait. 
                        Transparansi adalah fondasi kepercayaan B2B kami.
                     </p>
                     
                     <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                           <span className="text-gray-500 text-xs uppercase font-bold">Badan Hukum</span>
                           <span className="text-white font-bold text-sm">{config?.companyLegalName || "PT MESIN KASIR SOLO"}</span>
                        </div>
                        {config?.ahuNumber && (
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                              <span className="text-gray-500 text-xs uppercase font-bold">SK Kemenkumham (AHU)</span>
                              <span className="text-gray-300 font-mono text-xs">{config.ahuNumber}</span>
                           </div>
                        )}
                        {config?.nibNumber && (
                           <div className="flex justify-between items-center border-b border-white/10 pb-2">
                              <span className="text-gray-500 text-xs uppercase font-bold">NIB (Nomor Induk Berusaha)</span>
                              <span className="text-gray-300 font-mono text-xs">{config.nibNumber}</span>
                           </div>
                        )}
                        {config?.npwpNumber && (
                           <div className="flex justify-between items-center">
                              <span className="text-gray-500 text-xs uppercase font-bold">NPWP Perusahaan</span>
                              <span className="text-gray-300 font-mono text-xs">{config.npwpNumber}</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col gap-4 text-center md:text-right">
                     <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                        <Lock className="mx-auto mb-2 text-blue-400" size={24}/>
                        <p className="text-xs text-blue-200 font-bold mb-1">DATA TERVERIFIKASI</p>
                        <a 
                           href="https://oss.go.id" 
                           target="_blank" 
                           rel="noreferrer" 
                           className="text-[10px] text-blue-400 underline hover:text-white"
                        >
                           Cek di OSS RBA & AHU Online
                        </a>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] text-gray-500 max-w-[200px] mx-auto">
                           Butuh scan dokumen asli untuk vendor list / tender?
                        </p>
                        <Button 
                           variant="outline"
                           onClick={() => window.open(`https://wa.me/${config?.whatsappNumber}?text=Halo Admin, saya dari perusahaan [Sebutkan Nama PT], ingin request dokumen legalitas lengkap untuk keperluan verifikasi vendor.`, '_blank')}
                           className="w-full text-xs font-bold border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                        >
                           <FileText size={14}/> Request Dokumen Legalitas
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    )}

    {/* TIMELINE STORY ARC */}
    <div className="container mx-auto px-4 py-20 relative border-t border-white/5 bg-brand-dark/30">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-orange/50 to-transparent hidden md:block"></div>
      
      <div className="space-y-24 relative z-10 max-w-6xl mx-auto">
        
        {/* CHAPTER 1: 2015 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 1</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2015: Sang Single Fighter</h3>
              <p className="text-gray-400 leading-relaxed">
                Diinisiasi oleh <strong className="text-white">Amin Maghfuri</strong>. Tanpa tim, tanpa investor. 
                Memulai langkah berat sebagai <em>single fighter</em>, berjalan <em>door-to-door</em> menawarkan mesin kasir di Solo Raya. Penolakan adalah sarapan pagi, namun visi digitalisasi UMKM menjadi bahan bakar yang tak pernah padam.
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
              <h3 className="text-3xl font-display font-bold text-white mb-4">2019: Ekspansi Nasional</h3>
              <p className="text-gray-400 leading-relaxed">
                Kerja keras terbayar. Lewat strategi <strong>Digital Marketing</strong> yang agresif, jangkauan kami meledak hingga ke <strong>seluruh Indonesia</strong>. 
                Mimpi besar bernama <strong className="text-white">SIBOS</strong> (Smart Integrated Back Office System) mulai dikembangkan. Kami berada di puncak optimisme.
              </p>
           </div>
        </div>

        {/* CHAPTER 3: 2022 (THE FALL) */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 3</span>
              <h3 className="text-3xl font-display font-bold text-red-500 mb-4">2022: Titik Nadir</h3>
              <p className="text-gray-400 leading-relaxed">
                Pandemi menghantam fondasi kami. Cashflow terhenti. Kami sampai pada titik di mana kami 
                <strong> tak sanggup lagi membayar biaya langganan</strong> infrastruktur digital.
                <br/><br/>
                Akibatnya fatal. Domain legendaris <span className="text-red-400 line-through">kasirsolo.com</span> dan <span className="text-red-400 line-through">sibos.id</span> 
                hangus dan langsung <strong>diambil alih orang lain</strong>. Reputasi nasional yang dibangun bertahun-tahun, lenyap dalam sekejap mata.
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
                 <p className="text-gray-300 italic">"Kami kehilangan domain, tapi kami tidak kehilangan visi."</p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Dengan sisa semangat yang ada, PT Mesin Kasir Solo bangkit kembali. Kami meneruskan pengembangan <strong>SIBOS</strong> dan melahirkan inovasi baru: 
                <strong className="text-white"> QALAM</strong> (Aplikasi Manajemen Pendidikan). Kami kembali untuk merebut apa yang pernah menjadi milik kami, dengan pondasi yang jauh lebih kuat.
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
        
        {/* Overlay Text */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent flex flex-col justify-end pb-12 px-4 text-center">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Basecamp Perjuangan</h3>
            <p className="text-gray-400">Tempat dimana ide-ide liar dieksekusi menjadi solusi nyata.</p>
        </div>
    </section>

  </div>
);
