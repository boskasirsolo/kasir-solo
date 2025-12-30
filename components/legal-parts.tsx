
import React from 'react';
import { 
  ShieldCheck, AlertOctagon, CheckCircle2, XCircle, 
  Video, Lock, CreditCard, AlertTriangle, FileSignature, 
  Gavel, Server, Fingerprint, RefreshCcw, Truck, HelpCircle
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
      title="Kebijakan Garansi & Retur" 
      subtitle="Komitmen kami untuk memberikan ketenangan pikiran (Peace of Mind) dalam setiap investasi teknologi Anda. Berikut adalah SOP standar klaim dan perlindungan purna jual." 
    />

    <WarningBlock 
      title="PROTOKOL WAJIB: VIDEO UNBOXING"
      message={
        <p>
          Demi keadilan bersama dan menghindari klaim fiktif, PT Mesin Kasir Solo menerapkan kebijakan <strong>Zero Tolerance</strong>. 
          Kami <strong>MENOLAK 100%</strong> segala bentuk komplain (barang pecah, kurang, atau tidak sesuai) jika pembeli gagal menunjukkan bukti Video Unboxing yang valid.
        </p>
      }
      points={[
        { title: "Rekam Sebelum Buka", desc: "Video wajib dimulai dari paket utuh tersegel (perlihatkan label resi jelas) sebelum dibuka." },
        { title: "No Cut / Edit", desc: "Video harus satu take (bersambung) tanpa pause, edit, atau pemotongan durasi hingga unit dinyalakan." },
        { title: "Batas Waktu 1x24 Jam", desc: "Komplain kerusakan fisik maksimal diajukan 1x24 jam setelah status resi 'Diterima' oleh kurir." }
      ]}
    />

    <PolicySection title="Cakupan Garansi Hardware" icon={ShieldCheck}>
        <p className="mb-6 text-sm">
            Setiap perangkat keras (Hardware) yang kami jual dilindungi oleh garansi terbatas terhadap cacat produksi (Factory Defect). Garansi tidak mencakup kerusakan akibat kelalaian penggunaan (Human Error).
        </p>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/5 p-5 rounded-xl border border-green-500/20">
                <h4 className="text-green-400 font-bold text-sm mb-4 flex items-center gap-2 border-b border-green-500/20 pb-2">
                    <CheckCircle2 size={18}/> DICOVER (Garansi Berlaku)
                </h4>
                <ul className="space-y-3 text-sm text-gray-400 list-disc pl-4 marker:text-green-500">
                    <li>Kegagalan fungsi komponen internal tanpa sebab eksternal.</li>
                    <li>Layar Ghost Touch / Dead Pixel (minimal 5 titik) saat diterima.</li>
                    <li>Printer macet teknis (gear/motor) bukan karena kotoran/serangga.</li>
                    <li>Port koneksi (USB/LAN) tidak berfungsi dari pabrik.</li>
                    <li>Adaptor mati mendadak dalam masa garansi (selain karena lonjakan listrik).</li>
                </ul>
            </div>
            <div className="bg-red-500/5 p-5 rounded-xl border border-red-500/20">
                <h4 className="text-red-400 font-bold text-sm mb-4 flex items-center gap-2 border-b border-red-500/20 pb-2">
                    <XCircle size={18}/> VOID (Garansi Hangus)
                </h4>
                <ul className="space-y-3 text-sm text-gray-400 list-disc pl-4 marker:text-red-500">
                    <li>Kerusakan fisik: Jatuh, Pecah, Retak, Penyok, Tergores dalam.</li>
                    <li>Terkena cairan (Water Damage) atau korosi akibat kelembaban.</li>
                    <li>Segel garansi rusak, sobek, atau hilang.</li>
                    <li>Kerusakan akibat arus listrik tidak stabil (Koslet) atau petir.</li>
                    <li>Modifikasi software/hardware yang tidak diizinkan (Root/Jailbreak).</li>
                </ul>
            </div>
        </div>
    </PolicySection>

    <PolicySection title="Kebijakan Lisensi Software (SaaS)" icon={Server}>
        <div className="bg-brand-card border border-white/5 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    Produk perangkat lunak (SIBOS, QALAM, Website Custom) bersifat <strong>FINAL & NON-REFUNDABLE</strong>. 
                    Biaya yang dibayarkan dialokasikan langsung untuk sewa server (Cloud), biaya setup, dan lisensi pihak ketiga.
                </p>
                <div className="bg-brand-orange/10 border-l-4 border-brand-orange p-4 rounded-r-lg">
                    <h5 className="text-brand-orange font-bold text-xs uppercase mb-1">Penting:</h5>
                    <p className="text-xs text-gray-400">
                        Kami menyediakan <strong>Free Trial</strong> atau Demo Account untuk memastikan kecocokan fitur sebelum Anda memutuskan membeli. 
                        Membeli berarti Anda telah mencoba dan menyetujui fitur yang ada "AS IS" (sebagaimana adanya).
                    </p>
                </div>
            </div>
            <div className="w-full md:w-1/3 bg-black/40 p-4 rounded-lg border border-white/10 text-xs space-y-2">
                <strong className="text-white block border-b border-white/10 pb-2 mb-2">Prosedur Refund Dana:</strong>
                <p>1. Hanya berlaku jika stok hardware kosong pasca transfer.</p>
                <p>2. Proses refund memakan waktu 3-7 hari kerja.</p>
                <p>3. Wajib melampirkan foto buku tabungan halaman depan.</p>
            </div>
        </div>
    </PolicySection>
  </div>
);

export const PrivacyContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Kebijakan Privasi & Data" 
      subtitle='Komitmen "Data Fortress" untuk kedaulatan informasi bisnis Anda. Kami mengelola data bukan sebagai komoditas, tapi sebagai amanah.' 
    />

    <div className="bg-gradient-to-r from-brand-card to-brand-dark p-6 rounded-2xl border border-white/5 text-sm leading-relaxed mb-10 shadow-lg">
         <p className="mb-4">
             Di era digital, <strong>Kepercayaan (Trust)</strong> adalah mata uang paling berharga. PT Mesin Kasir Solo berdiri tegak dengan prinsip <strong>Integritas Data</strong>. 
             Kami mengumpulkan data semata-mata untuk keperluan transaksi, legalitas, dan peningkatan layanan sistem (System Improvement).
         </p>
         <p className="font-bold text-white">
             Kami bukan perusahaan pialang data. Data transaksi, omzet, dan pelanggan Anda adalah MILIK ANDA SEPENUHNYA.
         </p>
    </div>

    <div className="space-y-8">
      <PolicySection title="Klasifikasi Data yang Disimpan" icon={Fingerprint}>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-brand-dark p-5 rounded-xl border border-white/5 hover:border-brand-orange/30 transition-colors">
                <strong className="text-white block mb-2 text-sm flex items-center gap-2"><CreditCard size={14} className="text-brand-orange"/> Data Transaksional</strong>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Informasi yang diperlukan untuk memproses pesanan: Nama Lengkap, Alamat Pengiriman, Nomor Telepon (untuk OTP/Kurir), dan Riwayat Pembelian Hardware.
                </p>
            </div>
            <div className="bg-brand-dark p-5 rounded-xl border border-white/5 hover:border-brand-orange/30 transition-colors">
                <strong className="text-white block mb-2 text-sm flex items-center gap-2"><Server size={14} className="text-brand-orange"/> Data Bisnis (SaaS)</strong>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Untuk pengguna SIBOS/QALAM: Database produk, data penjualan, dan laporan keuangan tersimpan di server cloud terenkripsi. Kami tidak mengakses data ini tanpa izin tertulis (untuk keperluan support).
                </p>
            </div>
        </div>
      </PolicySection>

      <PolicySection title="Standar Keamanan (Security Measures)" icon={Lock}>
        <ul className="grid gap-4 md:grid-cols-3">
            {[
                { t: "Supabase RLS", d: "Row Level Security memastikan data Anda hanya bisa diakses oleh akun Anda sendiri, terisolasi dari pengguna lain." },
                { t: "Enkripsi SSL/TLS", d: "Seluruh jalur komunikasi data dari perangkat Anda ke server kami terenkripsi standar perbankan (HTTPS)." },
                { t: "Password Hashing", d: "Password Anda di-hash satu arah (Bcrypt). Bahkan tim IT kami tidak bisa melihat password asli Anda." }
            ].map((item, i) => (
                <li key={i} className="bg-white/5 p-4 rounded-lg border border-white/5">
                    <strong className="text-brand-orange text-xs block mb-2 uppercase tracking-wider">{item.t}</strong>
                    <p className="text-xs text-gray-400">{item.d}</p>
                </li>
            ))}
        </ul>
      </PolicySection>

      <PolicySection title='Janji "Anti-Jual Data"' icon={XCircle}>
        <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-1 text-sm text-gray-300 space-y-4">
                <p>
                    Kami menyadari maraknya praktik jual-beli database nomor HP untuk keperluan telemarketing, pinjol, atau judi online.
                </p>
                <p>
                    PT Mesin Kasir Solo menjamin secara hukum bahwa kami <strong>TIDAK AKAN PERNAH</strong> menjual, menyewakan, atau membagikan database kontak Anda kepada pihak ketiga manapun untuk tujuan komersial.
                </p>
            </div>
            <div className="shrink-0 bg-red-900/20 border border-red-500/30 p-4 rounded-xl max-w-xs text-center">
                <ShieldCheck size={40} className="text-red-500 mx-auto mb-2"/>
                <p className="text-xs font-bold text-red-400 uppercase">Strict Confidentiality</p>
                <p className="text-[10px] text-red-300/70 mt-1">Data Anda aman bersama kami.</p>
            </div>
        </div>
      </PolicySection>
    </div>
  </div>
);

export const TermsContent = () => (
  <div className="animate-fade-in text-gray-300 leading-relaxed">
    <PolicyHeader 
      title="Syarat & Ketentuan Layanan" 
      subtitle="Harap membaca aturan main (Terms of Service) ini dengan seksama. Bertransaksi dengan PT Mesin Kasir Solo berarti Anda menyetujui poin-poin berikut." 
    />

    <div className="space-y-8">
      
      <PolicySection title="Mekanisme Pesanan & Harga" icon={FileSignature}>
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-orange text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">1</div>
                <div>
                    <strong className="text-white text-sm block mb-1">Price Lock Policy</strong>
                    <p className="text-sm text-gray-400">
                        Harga mengikat saat checkout (Invoice Terbit). Perubahan harga naik/turun setelah invoice terbit tidak mempengaruhi tagihan Anda. Kami berhak membatalkan pesanan jika terjadi kesalahan sistem harga (glitch) yang tidak wajar (cth: Rp 0).
                    </p>
                </div>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-dark border border-brand-orange text-brand-orange flex items-center justify-center font-bold text-xs shrink-0">2</div>
                <div>
                    <strong className="text-white text-sm block mb-1">Ketersediaan Stok Dinamis</strong>
                    <p className="text-sm text-gray-400">
                        Karena perputaran barang yang cepat (Online & Offline), jika stok habis pasca transfer, opsi kami adalah: (a) Indent/Pre-order, (b) Tukar tipe setara, atau (c) Refund dana 100%.
                    </p>
                </div>
            </div>
        </div>
      </PolicySection>

      <PolicySection title="Pembayaran & Keamanan Transaksi" icon={CreditCard}>
        <div className="bg-brand-card p-6 rounded-xl border border-white/5 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-brand-orange/30 w-full md:w-auto">
                    <CreditCard className="text-brand-orange shrink-0" size={32} />
                    <div>
                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Bank Official (BNC)</p>
                        <p className="text-white font-bold font-mono text-lg md:text-xl tracking-widest">5859 4594 0674 0414</p>
                        <p className="text-xs text-brand-orange font-bold mt-1">a.n PT MESIN KASIR SOLO</p>
                    </div>
                </div>
                <div className="text-sm text-gray-400 max-w-md border-l-2 border-red-500 pl-4">
                    <p className="font-bold text-red-400 flex items-center gap-2 mb-1"><AlertTriangle size={14}/> Fraud Warning:</p>
                    Kami <strong>TIDAK BERTANGGUNG JAWAB</strong> atas transfer ke rekening pribadi (perorangan). Segala transaksi sah hanya melalui rekening perusahaan resmi.
                </div>
            </div>
        </div>
      </PolicySection>

      <PolicySection title="Pengiriman, Asuransi & Risiko" icon={Truck}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white text-sm block mb-2 flex items-center gap-2"><ShieldCheck size={14} className="text-green-400"/> Wajib Asuransi</strong>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Setiap barang bernilai di atas Rp 1.000.000,- <strong>WAJIB</strong> menggunakan asuransi pengiriman. Risiko kehilangan/kerusakan oleh ekspedisi tanpa asuransi ditanggung sepenuhnya oleh pembeli.
                </p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <strong className="text-white text-sm block mb-2 flex items-center gap-2"><Truck size={14} className="text-blue-400"/> Packing Kayu</strong>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Untuk pengiriman PC All-in-One, Monitor Touchscreen, dan Kiosk ke luar pulau Jawa, kami sangat menyarankan penambahan Packing Kayu untuk keamanan ekstra.
                </p>
            </div>
        </div>
      </PolicySection>

      <PolicySection title="Hak Kekayaan Intelektual (HAKI)" icon={Gavel}>
        <div className="bg-brand-dark/50 p-6 rounded-xl border border-white/5 text-sm leading-relaxed text-gray-300">
            <p className="mb-3">
                Seluruh source code, desain antarmuka, logo, dan aset digital pada software <strong>SIBOS</strong> dan <strong>QALAM</strong> adalah hak cipta milik PT Mesin Kasir Solo.
            </p>
            <p className="bg-red-900/10 border border-red-900/30 p-3 rounded text-red-200 text-xs">
                <strong className="text-red-400">LARANGAN KERAS:</strong> Dilarang melakukan <em>Reverse Engineering</em>, membajak, memodifikasi, atau menjual ulang (Resell) lisensi software tanpa perjanjian kemitraan resmi (White Label Agreement). Pelanggaran akan diproses sesuai UU ITE dan Hak Cipta yang berlaku di Indonesia.
            </p>
        </div>
      </PolicySection>

      <PolicySection title="Batasan Layanan Support" icon={HelpCircle}>
        <ul className="space-y-2 text-sm text-gray-400 list-disc pl-5">
            <li>Support Teknis Gratis meliputi: Panduan penggunaan, perbaikan bug sistem, dan kendala koneksi server.</li>
            <li>Support Teknis Gratis <strong>TIDAK</strong> meliputi: Kendala akibat virus komputer klien, kerusakan jaringan internet lokal (WiFi/LAN) klien, atau permintaan fitur custom di luar paket.</li>
            <li>Layanan kunjungan teknisi ke lokasi (On-site Visit) di luar area Solo Raya akan dikenakan biaya transportasi dan akomodasi.</li>
        </ul>
      </PolicySection>

    </div>
  </div>
);
