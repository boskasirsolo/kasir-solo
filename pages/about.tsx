
import React from 'react';
import { History, Rocket, AlertTriangle, Sunrise, Users, Target, Building, Quote, ShieldCheck, BadgeCheck, FileText, Lock, Skull } from 'lucide-react';
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
          Gue Partner Perang lo. Ini cerita kenapa gue bangun ulang <strong>Mesin Kasir Solo</strong> dari puing-puing kehancuran.
        </p>
      </div>
    </div>

    {/* NARRATIVE SECTION 1: THE HOOK */}
    <section className="py-20 bg-brand-black relative">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                
                {/* Quote Block 1 */}
                <div className="relative border-l-4 border-brand-orange pl-8 py-4 bg-gradient-to-r from-brand-orange/5 to-transparent rounded-r-xl">
                    <Quote className="absolute -top-6 -left-4 text-brand-orange fill-brand-orange w-8 h-8 opacity-20" />
                    <h3 className="text-2xl md:text-4xl font-display font-bold text-white leading-tight mb-4">
                        "Jujur-jujuran aja. Tahun 2022, gue pernah 'mati suri'."
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Aset digital ilang, domain diambil orang, sistem berantakan gara-gara gue terlalu percaya sama 'manusia' tanpa sistem kontrol. Saat itu gue belajar satu hal mahal: <strong>Bisnis tanpa sistem yang kuat cuma nunggu waktu buat meledak.</strong>
                    </p>
                </div>

                {/* Narrative Block */}
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2"><Target className="text-red-500"/> Titik Balik (The Turn)</h4>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Dari kehancuran itu, gue (Amin Maghfuri) bangun ulang semuanya sendirian. Bukan buat bales dendam, tapi buat mastiin <strong>lo gak perlu ngerasain sakit yang gue rasain.</strong>
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            <strong>SIBOS</strong> dan <strong>Mesin Kasir</strong> yang gue rakit sekarang lahir dari trauma itu. Ini bukan sekadar alat jualan, ini adalah <strong>asuransi</strong> buat bisnis lo. Gue desain fitur-fiturnya berdasarkan apa yang <em>nyelametin duit</em>, bukan cuma apa yang <em>keliatan canggih</em>.
                        </p>
                    </div>
                    <div className="bg-brand-dark/50 p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-brand-orange/30 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                           <Users size={80} className="text-white"/>
                        </div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                            <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold shadow-neon">AM</div>
                            <div>
                                <span className="text-white font-bold text-lg block">Amin Maghfuri</span>
                                <span className="text-gray-500 text-xs uppercase tracking-widest">Founder & Survivor</span>
                            </div>
                        </div>
                        <p className="text-sm text-gray-400 italic relative z-10">
                            "Developer lain bikin fitur di ruangan ber-AC sambil ngopi santai. Gue bikin fitur di lapangan panas, sambil ngadepin komplain pelanggan dan selisih stok nyata. Gue tau rasanya boncos."
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
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Markas Besar</h3>
            <p className="text-gray-400">Tempat di mana ide liar dieksekusi jadi solusi nyata.</p>
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
