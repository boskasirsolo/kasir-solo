
import React from 'react';
import { History, Rocket, Sunrise, Users, Target, Building, Quote, ShieldCheck, BadgeCheck, Skull } from 'lucide-react';
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
        <h2 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">Gue Bukan <span className="text-brand-orange">Vendor.</span></h2>
        <p className="max-w-3xl mx-auto text-xl text-gray-400 leading-relaxed font-light">
          Vendor biasa cuma peduli barang laku terus kabur. Gue peduli bisnis lo bertahan hidup. Di medan perang ritel yang kejam ini, lo butuh lebih dari sekadar penjual alat. <br/><span className="text-white font-bold">Gue Partner Perang lo.</span>
        </p>
      </div>
    </div>

    {/* ASYMMETRICAL STORY GRID (CENTERED & NARROWER) */}
    <section className="py-20 bg-brand-black relative">
        <div className="container mx-auto px-4">
            {/* WRAPPER: Max width restricted to create 'indented' look vs Timeline */}
            <div className="max-w-5xl mx-auto">
                <div className="grid md:grid-cols-12 gap-8 items-start">
                    
                    {/* 1. PHOTO FOUNDER (Top Left - Portrait) */}
                    <div className="md:col-span-4 relative group">
                        <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-brand-dark relative grayscale group-hover:grayscale-0 transition-all duration-700">
                            {config?.founderPortrait ? (
                                <img 
                                    src={config.founderPortrait} 
                                    alt="Amin Maghfuri" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                                    <Users size={48} strokeWidth={1} />
                                    <span className="text-xs mt-2">No Portrait</span>
                                </div>
                            )}
                            {/* Text overlay removed as requested */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </div>
                    </div>

                    {/* 2. THE HOOK "Jujur-jujuran" (Top Right - Wide) */}
                    <div className="md:col-span-8 flex flex-col justify-center h-full">
                        <div className="p-8 md:p-10 bg-brand-card border border-white/5 rounded-3xl relative overflow-hidden group hover:border-brand-orange/20 transition-all">
                            <Quote className="absolute top-8 right-8 text-white/5 w-24 h-24 rotate-180" />
                            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 relative z-10 leading-tight">
                                "Jujur-jujuran aja..."
                            </h3>
                            <div className="prose prose-invert prose-lg text-gray-400 leading-relaxed relative z-10">
                                <p className="mb-4">
                                    Tahun 2022, gue pernah 'mati suri'. Aset digital ilang, domain diambil orang, profil google bisnis disuspend.
                                </p>
                                <p>
                                    Sistem berantakan gara-gara gue terlalu percaya sama 'manusia' tanpa sistem kontrol. Saat itu gue belajar satu hal mahal: <strong className="text-white">Bisnis tanpa sistem yang kuat cuma nunggu waktu buat meledak.</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. TITIK BALIK (Middle Left - Text Block) */}
                    {/* Spacer to push logic to next visual row */}
                    <div className="hidden md:block md:col-span-12 h-4"></div> 

                    <div className="md:col-span-7 pt-4">
                        <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-l-4 border-red-500 pl-4">
                            Titik Balik (The Turn)
                        </h4>
                        <div className="space-y-6 text-gray-400 text-lg leading-relaxed pr-0 md:pr-6">
                            <p>
                                Dari kehancuran itu, gue bangun ulang semuanya sendirian. Bukan buat bales dendam, tapi buat mastiin <strong>lo gak perlu ngerasain sakit yang gue rasain.</strong>
                            </p>
                            <p>
                                <strong>SIBOS</strong> dan <strong>Mesin Kasir</strong> yang gue rakit sekarang lahir dari trauma itu. Ini bukan sekadar alat jualan, ini adalah <strong>asuransi</strong> buat bisnis lo. Gue desain fitur-fiturnya berdasarkan apa yang <em>nyelametin duit</em>, bukan cuma apa yang <em>keliatan canggih</em>.
                            </p>
                        </div>
                    </div>

                    {/* 4. FOUNDER SIGNATURE CARD (Middle Right - Orange Transparent) */}
                    <div className="md:col-span-5 flex items-center h-full">
                        <div className="w-full bg-brand-orange/10 backdrop-blur-xl border border-brand-orange/30 p-8 rounded-3xl relative overflow-hidden group hover:bg-brand-orange/20 transition-all shadow-[0_0_30px_rgba(255,95,31,0.1)]">
                            {/* Decorative glow inside card */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/40 rounded-full blur-[60px]"></div>
                            
                            <div className="relative z-10">
                                <div className="mb-6 border-b border-brand-orange/20 pb-6">
                                    <p className="text-white font-display font-bold text-2xl">Amin Maghfuri</p>
                                    <p className="text-brand-orange/80 text-xs uppercase tracking-widest font-bold mt-1">Founder & Survivor</p>
                                </div>
                                <p className="text-white/90 italic font-medium text-base leading-relaxed">
                                    "Developer lain bikin fitur di ruangan ber-AC. Gue bikin fitur di lapangan panas, sambil ngadepin komplain pelanggan dan selisih stok nyata. Gue tau rasanya boncos."
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>

    {/* 5. TIMELINE (Bottom - Full Width / Wider Foundation) */}
    <div className="container mx-auto px-4 py-20 relative border-t border-white/5 bg-brand-dark/30 mt-10">
      {/* Central Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand-orange/50 to-transparent hidden md:block"></div>
      
      <div className="space-y-24 relative z-10 max-w-6xl mx-auto">
        
        {/* CHAPTER 1: 2015 */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-brand-orange font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 1</span>
              <h3 className="text-3xl font-display font-bold text-white mb-4">2015: Sales Jalanan</h3>
              <p className="text-gray-400 leading-relaxed">
                Tanpa tim, tanpa investor. Gue jalan kaki <em>door-to-door</em> nawarin mesin kasir di Solo Raya. Diusir satpam, diketawain owner toko, itu sarapan pagi gue. Di fase ini gue belajar satu hal: <strong>Pedagang butuh solusi praktis, bukan teori teknis ribet.</strong>
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
              <h3 className="text-3xl font-display font-bold text-white mb-4">2019: Raja Kecil</h3>
              <p className="text-gray-400 leading-relaxed">
                Kerja keras gue kebayar. 500+ outlet pake alat gue. Gue ngerasa di atas angin. Tim makin gede, omzet naik. Tapi gue lengah. Gue lupa kalau <strong>Sistem Kontrol Internal</strong> itu lebih penting daripada omzet.
              </p>
           </div>
        </div>

        {/* CHAPTER 3: 2022 (THE FALL) */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 group">
           <div className="w-full md:w-1/2 md:text-right order-2 md:order-1">
              <span className="text-red-500 font-bold tracking-widest text-xs uppercase mb-2 block">Chapter 3</span>
              <h3 className="text-3xl font-display font-bold text-red-500 mb-4">2022: Kiamat Kecil</h3>
              <p className="text-gray-400 leading-relaxed">
                Cashflow macet, infrastruktur digital runtuh. Domain legendaris hangus dan diambil orang karena keteledoran manajemen aset. Reputasi nasional lenyap sekejap. Gue balik ke titik nol. Sendirian lagi.
              </p>
           </div>
           <div className="relative order-1 md:order-2 flex justify-center items-center">
              <div className="w-16 h-16 bg-red-900/20 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] z-20 animate-pulse">
                <Skull size={28} />
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
              <h3 className="text-3xl font-display font-bold text-white mb-4">2025: Mode Perang</h3>
              <div className="bg-brand-orange/10 border-l-4 border-brand-orange p-4 rounded-r-lg mb-4">
                 <p className="text-gray-300 italic">"Gue balik bukan buat main-main. Gue balik buat ngasih lo senjata biar bisnis lo gak ancur kayak gue dulu."</p>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Dengan pondasi <strong>SIBOS</strong> & <strong>QALAM</strong> yang jauh lebih kuat. Gue bukan lagi sekadar vendor mesin kasir. Gue partner yang jagain benteng pertahanan bisnis lo.
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
                    <p>Dapur Rekayasa Kami</p>
                </div>
            )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent flex flex-col justify-end pb-12 px-4 text-center">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Markas Legal Mesin Kasir Solo</h3>
            <p className="text-gray-400">Tempat di mana ide liar dieksekusi jadi solusi nyata. Dari garasi kecil gue sulap jadi markas Mesin Kasir Solo</p>
        </div>
    </section>

    {/* LEGALITY SECTION (RE-USED) */}
    <section className="py-20 bg-brand-black border-t border-white/5">
       <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
             <ShieldCheck size={40} className="mx-auto text-blue-500 mb-4" />
             <h2 className="text-3xl font-display font-bold text-white mb-2">Gue Main Bersih</h2>
             <p className="text-gray-400">Bisnis itu soal kepercayaan. Gue gak mau ngerusak nama yang udah gue bangun lagi dari nol. Ini buktinya gue legal.</p>
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
                      <span className="text-gray-400 text-sm">NIB (Izin Usaha)</span>
                      <span className="text-white font-mono text-sm">{config.nibNumber}</span>
                   </div>
                )}
                {config?.ahuNumber && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">SK Kemenkumham</span>
                      <span className="text-white font-mono text-sm">{config.ahuNumber}</span>
                   </div>
                )}
                {config?.npwpNumber && (
                   <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <span className="text-gray-400 text-sm">NPWP Perusahaan</span>
                      <span className="text-white font-mono text-sm">{config.npwpNumber}</span>
                   </div>
                )}
                <div className="pt-2">
                   <p className="text-xs text-gray-500 leading-relaxed italic">
                      *Buat lo yang butuh dokumen asli buat vendor list atau tender, chat admin gue. Kita transparan.
                   </p>
                </div>
             </div>
             
             <div className="w-full md:w-auto flex justify-center">
                <div className="bg-blue-500/10 border border-blue-500/30 p-6 rounded-xl text-center max-w-xs">
                    <p className="text-blue-200 text-xs font-bold mb-2 uppercase tracking-wider">Cek Validitas</p>
                    <p className="text-xs text-gray-400 mb-4">Lo bisa cek sendiri data perusahaan gue di web pemerintah biar yakin.</p>
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
