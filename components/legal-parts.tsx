
import React from 'react';
import { 
  ShieldCheck, AlertOctagon, CheckCircle2, XCircle, 
  Video, Lock, CreditCard, AlertTriangle, FileSignature, 
  Gavel, Server, Fingerprint, RefreshCcw, Truck, HelpCircle, BadgeCheck, EyeOff, Database
} from 'lucide-react';

// --- ATOMS: REUSABLE UI PARTS ---

export const PolicyHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-10 border-b border-white/10 pb-8">
    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">{title}</h2>
    <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-3xl">{subtitle}</p>
  </div>
);

export const PolicySection = ({ title, children, icon: Icon }: { title: string, children?: React.ReactNode, icon?: any }) => (
  <section className="mb-10 last:mb-0 bg-brand-card/30 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        {Icon ? <Icon size={24} className="text-brand-orange"/> : <div className="w-1 h-6 bg-brand-orange rounded-full"></div>} 
        {title}
    </h3>
    {children}
  </section>
);

export const WarningBlock = ({ 
  title, 
  message, 
  points 
}: { 
  title: string, 
  message: React.ReactNode, 
  points?: { title: string, desc: string }[] 
}) => (
  <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden group mb-10">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
      <Video size={150} className="text-red-500" />
    </div>
    <div className="relative z-10">
      <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-4 uppercase tracking-wider">
        <AlertOctagon /> {title}
      </h3>
      <div className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base border-l-2 border-red-500/50 pl-4">
        {message}
      </div>
      {points && (
        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
           {points.map((p, i) => (
             <div key={i} className="bg-black/40 p-4 rounded-xl border border-red-500/20 hover:bg-black/60 transition-colors">
                <span className="text-red-400 font-bold block mb-2 text-xs uppercase tracking-widest">{i + 1}. {p.title}</span>
                <p className="text-xs leading-relaxed opacity-80">{p.desc}</p>
             </div>
           ))}
        </div>
      )}
    </div>
  </div>
);

// --- ORGANISMS: SPECIFIC CONTENT VIEWS ---

export const RefundContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Garansi & Retur: Jangan Ada Dusta." 
      subtitle="Gue pedagang, lo pedagang. Kita main fair. Kalau barang gue jelek, gue ganti. Tapi kalau lo yang teledor, jangan salahin gue." 
    />

    <WarningBlock 
      title="VIDEO UNBOXING: HARGA MATI"
      message={
        <p>
          Banyak "oknum" ngaku barang kurang atau rusak padahal dia yang ngerusakin. Sorry Bos, gue udah kenyang ginian. 
          <strong>GAK ADA VIDEO UNBOXING = KOMPLAIN DITOLAK AUTO.</strong> Gak pake debat.
        </p>
      }
      points={[
        { title: "Rekam Dari Awal", desc: "Mulai rekam pas paket masih utuh tersegel lakban gue. Tunjukin resi ke kamera." },
        { title: "Gak Boleh Putus", desc: "Video harus nyambung (No Cut/Edit). Jangan curang pause video terus ngakalin barang." },
        { title: "Maksimal 1x24 Jam", desc: "Barang sampe, langsung cek. Lewat sehari gue anggap barang aman dan transaksi selesai." }
      ]}
    />

    <PolicySection title="Mana Yang Gue Ganti?" icon={ShieldCheck}>
        <p className="mb-6 text-sm">
            Gue jamin barang gue nyala. Kalau pas sampe ternyata zonk karena cacat pabrik, gue tanggung jawab penuh.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/5 p-5 rounded-xl border border-green-500/20">
                <h4 className="text-green-400 font-bold text-sm mb-4 flex items-center gap-2 border-b border-green-500/20 pb-2">
                    <CheckCircle2 size={18}/> DICOVER (Aman, Gue Ganti)
                </h4>
                <ul className="space-y-3 text-sm text-gray-400 list-disc pl-4 marker:text-green-500">
                    <li>Pas dibuka, layar mati atau ada garis (Dead Pixel parah).</li>
                    <li>Printer macet total pas tes print pertama.</li>
                    <li>Adaptor/Kabel gak nyala (Mati total).</li>
                    <li>Salah kirim barang (Pesen Scanner dikirim Mouse).</li>
                </ul>
            </div>
            <div className="bg-red-500/5 p-5 rounded-xl border border-red-500/20">
                <h4 className="text-red-400 font-bold text-sm mb-4 flex items-center gap-2 border-b border-red-500/20 pb-2">
                    <XCircle size={18}/> VOID (Resiko Lo Sendiri)
                </h4>
                <ul className="space-y-3 text-sm text-gray-400 list-disc pl-4 marker:text-red-500">
                    <li>Jatuh, keinjek, kebanting, atau dilempar staf lo.</li>
                    <li>Kesiram kopi, teh, atau air banjir (Water Damage).</li>
                    <li>Segel gue lo sobek/bongkar sendiri (Sok tau ngoprek).</li>
                    <li>Salah colok listrik (Tegangan naik bikin korslet).</li>
                </ul>
            </div>
        </div>
    </PolicySection>
  </div>
);

export const PrivacyContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Data Lo, Hak Lo." 
      subtitle='Gue pernah ngerasain sakitnya pas data gue dimaling orang tahun 2022. Gue gak bakal biarin itu kejadian di lo. Data lo aman di "brankas" gue.' 
    />

    <div className="bg-gradient-to-r from-brand-card to-brand-dark p-6 rounded-2xl border border-white/5 text-sm leading-relaxed mb-10 shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-4 opacity-5"><Database size={100} /></div>
         <p className="mb-4 relative z-10">
             Denger baik-baik: <strong>Gue gak jualan data.</strong> Omzet lo, daftar pelanggan lo, itu rahasia dapur lo. 
         </p>
         <p className="font-bold text-white relative z-10">
             Gue cuma penyedia "gembok" dan "brankas"-nya. Kuncinya ada di tangan lo. Gue pun gak bisa intip isinya kalau lo gak kasih akses.
         </p>
    </div>

    <div className="space-y-8">
      <PolicySection title="Transparansi Total" icon={EyeOff}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-sm text-gray-300 space-y-4">
                <p>
                    Gue berdiri di atas PT resmi. Legalitas gue jelas. Kalau gue macem-macem sama data lo, lo bisa laporin gue.
                </p>
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-xl">
                    <p className="text-blue-200 text-xs font-bold mb-1 uppercase tracking-widest">Cek Sendiri Kalau Gak Percaya</p>
                    <p className="text-xs text-gray-400">Silakan cek NIB PT Mesin Kasir Solo di <strong>OSS Kementerian Investasi</strong> (oss.go.id). Gue gak main sembunyi-sembunyi.</p>
                </div>
            </div>
        </div>
      </PolicySection>

      <PolicySection title="Benteng Pertahanan (Tech Specs)" icon={Lock}>
        <ul className="grid gap-4 md:grid-cols-3">
            {[
                { t: "Database Terisolasi", d: "Data lo dipisah pake teknologi RLS (Row Level Security). User lain gak bakal bisa 'nyasar' ke data lo." },
                { t: "Enkripsi Bank-Grade", d: "Jalur data dari HP lo ke server gue dienkripsi SSL/TLS. Hacker cuma bakal liat kode acak." },
                { t: "Password Lo, Rahasia Lo", d: "Password lo di-hash (diacak). Bahkan tim IT gue pun gak tau password lo apa." }
            ].map((item, i) => (
                <li key={i} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-brand-orange/30 transition-colors">
                    <strong className="text-brand-orange text-xs block mb-2 uppercase tracking-wider">{item.t}</strong>
                    <p className="text-xs text-gray-400">{item.d}</p>
                </li>
            ))}
        </ul>
      </PolicySection>
    </div>
  </div>
);

export const TermsContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Aturan Main Biar Sama-Sama Enak" 
      subtitle="Bisnis itu soal kesepakatan. Baca aturan main gue sebelum transfer, biar gak ada drama di belakang." 
    />

    <div className="space-y-8">
      <PolicySection title="Soal Duit & Pesanan" icon={FileSignature}>
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-orange text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <div>
                    <strong className="text-white text-sm block mb-1">Harga Mengikat (Price Lock)</strong>
                    <p className="text-sm text-gray-400">
                        Begitu Invoice keluar, harga itu yang lo bayar. Kalau besok harga naik, lo untung. Kalau harga turun, jangan minta cashback. Deal is Deal.
                    </p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-orange text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <div>
                    <strong className="text-white text-sm block mb-1">Gak Ada 'Keep' Barang</strong>
                    <p className="text-sm text-gray-400">
                        Siapa cepat dia dapat. Stok gue rebutan. Jangan marah kalau lo baru transfer lusa, barangnya udah disamber orang lain.
                    </p>
                </div>
            </div>
        </div>
      </PolicySection>

      <PolicySection title="Awas Penipuan (Fraud)" icon={AlertTriangle}>
        <div className="bg-brand-card p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="relative z-10 flex flex-col gap-6">
                {/* Bank Details Card */}
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-black/40 p-6 rounded-xl border border-brand-orange/30 w-full shadow-lg">
                    <div className="p-4 bg-brand-orange/10 rounded-full text-brand-orange border border-brand-orange/20">
                        <CreditCard size={32} />
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Rekening Sah (BNC)</p>
                        <p className="text-white font-bold font-mono text-2xl md:text-3xl tracking-widest text-brand-orange drop-shadow-sm">5859 4594 0674 0414</p>
                        <p className="text-xs text-gray-300 font-bold mt-1 bg-white/10 inline-block px-2 py-0.5 rounded">a.n PT MESIN KASIR SOLO</p>
                    </div>
                </div>
                
                {/* Warning Text */}
                <div className="text-sm text-gray-400 w-full border-l-4 border-red-500 pl-4 bg-red-500/5 py-2 pr-2 rounded-r-lg">
                    <p className="font-bold text-red-400 flex items-center gap-2 mb-2 uppercase tracking-wide"><XCircle size={18}/> JANGAN TRANSFER KE PERORANGAN!</p>
                    <p className="leading-relaxed">
                        Kalau ada sales gue atau orang ngaku-ngaku minta transfer ke rekening pribadi (BCA/BRI/dll atas nama orang), <strong>ITU MALING</strong>. Gue gak tanggung jawab kalau duit lo ilang.
                    </p>
                </div>
            </div>
        </div>
      </PolicySection>
    </div>
  </div>
);
