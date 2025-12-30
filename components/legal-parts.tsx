
import React from 'react';
import { 
  ShieldCheck, AlertOctagon, CheckCircle2, XCircle, 
  Video, Lock, CreditCard, AlertTriangle 
} from 'lucide-react';

// --- ATOMS: REUSABLE UI PARTS ---

export const PolicyHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-8">
    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 text-sm md:text-base">{subtitle}</p>
  </div>
);

export const PolicySection = ({ title, children }: { title: string, children?: React.ReactNode }) => (
  <section className="mb-8 last:mb-0">
    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-brand-orange rounded-full"></div> {title}
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
  <div className="bg-red-900/10 border border-red-500/50 rounded-2xl p-6 relative overflow-hidden group mb-8">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
      <Video size={120} className="text-red-500" />
    </div>
    <div className="relative z-10">
      <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-3">
        <AlertOctagon /> {title}
      </h3>
      <div className="text-gray-300 leading-relaxed mb-4 text-sm">
        {message}
      </div>
      {points && (
        <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-300">
           {points.map((p, i) => (
             <div key={i} className="bg-black/40 p-3 rounded-lg border border-red-500/20">
                <span className="text-red-400 font-bold block mb-1">{i + 1}. {p.title}</span>
                {p.desc}
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
      title="Kebijakan Garansi & Retur" 
      subtitle="Proteksi maksimal untuk investasi hardware dan software Anda." 
    />

    <WarningBlock 
      title="SYARAT MUTLAK: VIDEO UNBOXING"
      message={
        <p>Kami <strong>MENOLAK 100%</strong> komplain barang pecah/kurang jika pembeli tidak dapat menunjukkan bukti Video Unboxing yang sah (No Cut/Edit).</p>
      }
      points={[
        { title: "Rekam Sebelum Buka", desc: "Video dimulai dari paket utuh & perlihatkan resi." },
        { title: "No Cut / Edit", desc: "Video harus bersambung sampai unit dinyalakan." },
        { title: "Max 1x24 Jam", desc: "Komplain maksimal 1x24 jam setelah status 'Diterima'." }
      ]}
    />

    <PolicySection title="Garansi Hardware">
        <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20">
                <h4 className="text-green-400 font-bold text-sm mb-2 flex items-center gap-2"><CheckCircle2 size={16}/> DICOVER</h4>
                <ul className="space-y-1 text-xs text-gray-400 list-disc pl-4">
                    <li>Cacat pabrik (Defect).</li>
                    <li>Layar Ghost Touch / Dead Pixel.</li>
                    <li>Printer macet teknis.</li>
                    <li>Port koneksi error.</li>
                </ul>
            </div>
            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                <h4 className="text-red-400 font-bold text-sm mb-2 flex items-center gap-2"><XCircle size={16}/> VOID (HANGUS)</h4>
                <ul className="space-y-1 text-xs text-gray-400 list-disc pl-4">
                    <li>Jatuh, Pecah, Retak.</li>
                    <li>Terkena cairan / korosi.</li>
                    <li>Segel rusak/hilang.</li>
                    <li>Kelistrikan tidak stabil (Koslet).</li>
                </ul>
            </div>
        </div>
    </PolicySection>

    <PolicySection title="Kebijakan Software (SaaS)">
        <div className="bg-brand-card border border-white/5 p-4 rounded-xl">
            <p className="text-sm text-gray-300 mb-2">
                Lisensi software (SIBOS, QALAM) bersifat <strong>FINAL & NON-REFUNDABLE</strong>.
            </p>
            <ul className="space-y-1 text-xs text-gray-400 list-decimal pl-4">
                <li>Pembatalan tidak dapat dilakukan setelah kode aktivasi dikirim.</li>
                <li>Gunakan <strong>Free Trial</strong> untuk memastikan kecocokan sebelum membeli.</li>
            </ul>
        </div>
    </PolicySection>
  </div>
);

export const PrivacyContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Kebijakan Privasi" 
      subtitle='Komitmen "Data Fortress" untuk keamanan informasi Anda.' 
    />

    <div className="bg-brand-card p-5 rounded-xl border border-white/5 text-sm leading-relaxed mb-8">
         Di era digital, kami berdiri tegak dengan prinsip <strong>Integritas Data</strong>. Kami mengumpulkan data hanya untuk keperluan transaksi dan legalitas, bukan untuk komoditas.
    </div>

    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-3">
            <ShieldCheck size={20} className="text-brand-orange"/>
            <h3 className="text-lg font-bold text-white">Data yang Disimpan</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1 text-sm">Transaksional</strong>
                <p className="text-xs text-gray-400">Nama, Alamat Kirim, No HP (OTP/Kurir), History Belanja.</p>
            </div>
            <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1 text-sm">Konfigurasi Bisnis</strong>
                <p className="text-xs text-gray-400">Nama Toko & Alamat Toko (Untuk setting struk kasir).</p>
            </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
            <Lock size={20} className="text-brand-orange"/>
            <h3 className="text-lg font-bold text-white">Enkripsi & Keamanan</h3>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400 marker:text-brand-orange">
            <li><strong>Supabase RLS:</strong> Row Level Security memastikan data Anda hanya bisa diakses akun Anda.</li>
            <li><strong>Hashing:</strong> Password dienkripsi satu arah (Bahkan kami tidak tahu password Anda).</li>
            <li><strong>SSL:</strong> Transaksi data terenkripsi protokol HTTPS standar perbankan.</li>
        </ul>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3">
            <XCircle size={20} className="text-brand-orange"/>
            <h3 className="text-lg font-bold text-white">Janji "Anti-Jual Data"</h3>
        </div>
        <div className="bg-brand-orange/5 border-l-4 border-brand-orange p-4 rounded-r-lg text-sm">
            Kami menjamin <strong>TIDAK AKAN</strong> menjual database nomor HP Anda ke pihak ketiga (Pinjol, Judi Online, Telemarketing). Privasi Anda adalah aset kami.
        </div>
      </div>
    </div>
  </div>
);

export const TermsContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Syarat & Ketentuan" 
      subtitle="Pahamilah aturan main (TOS) sebelum bertransaksi." 
    />

    <div className="space-y-8">
      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="bg-brand-orange text-white w-6 h-6 rounded flex items-center justify-center text-xs">1</span> Pesanan & Harga
        </h3>
        <ul className="space-y-2 text-sm text-gray-400 pl-2">
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 shrink-0"></div> <span><strong>Price Lock:</strong> Harga mengikat saat checkout. Perubahan harga setelahnya tidak mempengaruhi invoice yang sudah terbit.</span></li>
            <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-1.5 shrink-0"></div> <span><strong>Stok Dinamis:</strong> Jika stok habis pasca transfer, opsi kami: (a) Indent, (b) Tukar tipe, (c) Refund 100%.</span></li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="bg-brand-orange text-white w-6 h-6 rounded flex items-center justify-center text-xs">2</span> Pembayaran Sah
        </h3>
        <div className="bg-brand-card p-4 rounded-lg border border-white/5">
            <div className="flex items-center gap-3 bg-black/40 p-3 rounded border border-brand-orange/30">
                <CreditCard className="text-brand-orange shrink-0" />
                <div>
                    <p className="text-xs text-gray-400">Bank Neo Commerce (BNC)</p>
                    <p className="text-white font-bold font-mono text-sm md:text-base">5859 4594 0674 0414</p>
                    <p className="text-xs text-gray-400">a.n PT MESIN KASIR SOLO</p>
                </div>
            </div>
            <p className="text-xs text-red-400 mt-2 font-bold flex items-center gap-1">
                <AlertTriangle size={12}/> Waspada Penipuan! Jangan transfer ke rekening pribadi.
            </p>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="bg-brand-orange text-white w-6 h-6 rounded flex items-center justify-center text-xs">3</span> Pengiriman & Risiko
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/5 p-3 rounded border border-white/5">
                <strong className="text-white text-xs block mb-1">Wajib Asuransi</strong>
                <p className="text-xs text-gray-400">Barang bernilai &gt; Rp 1 Juta wajib asuransi pengiriman.</p>
            </div>
            <div className="bg-white/5 p-3 rounded border border-white/5">
                <strong className="text-white text-xs block mb-1">Packing Kayu</strong>
                <p className="text-xs text-gray-400">Disarankan untuk PC All-in-One ke luar pulau Jawa.</p>
            </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span className="bg-brand-orange text-white w-6 h-6 rounded flex items-center justify-center text-xs">4</span> HAKI
        </h3>
        <p className="text-sm text-gray-400 bg-red-900/10 p-3 rounded border border-red-900/30">
            Dilarang keras membajak, merekayasa balik (reverse engineer), atau menjual ulang software SIBOS/QALAM tanpa izin resmi. Pelanggaran diproses hukum.
        </p>
      </section>
    </div>
  </div>
);
