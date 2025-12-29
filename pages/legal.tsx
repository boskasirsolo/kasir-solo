
import React, { useEffect } from 'react';
import { ShieldCheck, RefreshCw, FileText, AlertTriangle, Video, Lock, Truck, CreditCard, ChevronRight } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

// --- CONTENT COMPONENTS ---

const RefundContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="border-b border-white/10 pb-6">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Kebijakan Pengembalian & Garansi</h1>
      <p className="text-gray-400">Terakhir diperbarui: 25 Maret 2024</p>
    </div>

    {/* CRITICAL WARNING BOX */}
    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Video size={120} className="text-red-500" />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-4">
          <AlertTriangle /> SYARAT MUTLAK KLAIM: VIDEO UNBOXING
        </h3>
        <p className="text-gray-300 leading-relaxed mb-4">
          Kami <strong>TIDAK MENERIMA</strong> komplain barang rusak fisik (pecah, retak, penyok) atau kekurangan kelengkapan jika pembeli tidak menyertakan video unboxing.
        </p>
        <ul className="space-y-2 text-sm text-gray-300 bg-black/20 p-4 rounded-lg border border-red-500/10">
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">1.</span>
            Video harus direkam mulai dari paket utuh (lakban belum dibuka) sampai unit dinyalakan.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">2.</span>
            Video tidak boleh terpotong (no cut) atau diedit.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-red-500 font-bold">3.</span>
            Komplain maksimal diajukan <strong>2x24 jam</strong> setelah status resi "Diterima".
          </li>
        </ul>
      </div>
    </div>

    {/* SECTIONS */}
    <div className="space-y-6 text-gray-300 leading-relaxed">
      <section>
        <h3 className="text-xl font-bold text-white mb-3">1. Cakupan Garansi Hardware</h3>
        <p className="mb-2">Semua mesin kasir (Android POS, Windows POS, Printer) yang kami jual bergaransi resmi distributor atau toko selama <strong>1 Tahun</strong> (kecuali disebutkan lain).</p>
        <ul className="list-disc pl-5 space-y-1 marker:text-brand-orange">
          <li><strong>Dicover:</strong> Kerusakan fungsi alami (mati total mendadak, layar ghost touch, printer macet bukan karena kertas).</li>
          <li><strong>TIDAK Dicover (Void):</strong> Kerusakan akibat kelalaian pengguna (jatuh, terkena air/kopi, layar pecah tertekan, segel rusak, tegangan listrik tidak stabil).</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-3">2. Kebijakan Retur & Refund Dana</h3>
        <p className="mb-2">Kami menjual produk teknologi bernilai tinggi. Oleh karena itu:</p>
        <ul className="list-disc pl-5 space-y-1 marker:text-brand-orange">
          <li><strong>No Change of Mind:</strong> Barang yang sudah dibeli tidak dapat dikembalikan dengan alasan "berubah pikiran", "gasuka warnanya", atau "salah pilih tipe" (kecuali kesalahan sales kami).</li>
          <li><strong>Refund Dana:</strong> Hanya diberikan jika unit pengganti stoknya kosong (discontinue). Jika stok ada, solusi wajib berupa tukar unit baru.</li>
          <li>Biaya kirim retur ke kantor kami ditanggung pembeli, biaya kirim balik unit baru ditanggung kami.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-3">3. Software & Lisensi</h3>
        <p>Lisensi software (SIBOS/QALAM/Program Kasir) bersifat <strong>Final Sale</strong>. Tidak ada refund untuk pembelian software yang kode aktivasinya sudah dikirimkan atau diinput ke sistem.</p>
      </section>
    </div>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="border-b border-white/10 pb-6">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Kebijakan Privasi</h1>
      <p className="text-gray-400">Komitmen kami menjaga data sensitif Anda.</p>
    </div>

    <div className="space-y-8 text-gray-300 leading-relaxed">
      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><Lock size={24}/></div>
            <h3 className="text-xl font-bold text-white">1. Data yang Kami Kumpulkan</h3>
        </div>
        <p className="mb-4">Saat Anda melakukan pembelian atau mendaftar demo, kami menyimpan data berikut di database terenkripsi kami (Supabase):</p>
        <ul className="grid md:grid-cols-2 gap-4">
            <li className="bg-brand-card p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Identitas Personal</strong>
                Nama Lengkap & Nomor WhatsApp (untuk konfirmasi pesanan & garansi).
            </li>
            <li className="bg-brand-card p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Alamat Pengiriman</strong>
                Detail alamat lengkap & titik koordinat maps (untuk kurir).
            </li>
            <li className="bg-brand-card p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Data Transaksi</strong>
                Riwayat pembelian, invoice, dan bukti transfer.
            </li>
            <li className="bg-brand-card p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1">Data Bisnis (Opsional)</strong>
                Nama toko/usaha Anda untuk konfigurasi awal struk kasir.
            </li>
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><Truck size={24}/></div>
            <h3 className="text-xl font-bold text-white">2. Penggunaan & Pembagian Data</h3>
        </div>
        <p>Kami menjamin <strong>TIDAK AKAN MENJUAL</strong> data Anda ke pihak ketiga manapun (seperti pinjol, telemarketing, dll). Data Anda hanya dibagikan kepada:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 marker:text-brand-orange">
            <li><strong>Mitra Logistik:</strong> JNE, J&T, Deliveree (hanya Nama, Alamat, No HP untuk keperluan pengiriman).</li>
            <li><strong>Penyedia Layanan Pembayaran:</strong> Bank atau Payment Gateway untuk verifikasi fraud.</li>
            <li><strong>Otoritas Hukum:</strong> Jika diwajibkan oleh undang-undang yang berlaku di Indonesia.</li>
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><Lock size={24}/></div>
            <h3 className="text-xl font-bold text-white">3. Keamanan Data</h3>
        </div>
        <p>Website ini menggunakan protokol HTTPS/SSL. Database kami dilindungi dengan Row Level Security (RLS) dimana data sensitif hanya bisa diakses oleh Admin berwenang dan sistem otomatis.</p>
      </section>
    </div>
  </div>
);

const TermsContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="border-b border-white/10 pb-6">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Syarat & Ketentuan</h1>
      <p className="text-gray-400">Aturan main bertransaksi di PT Mesin Kasir Solo.</p>
    </div>

    <div className="space-y-6 text-gray-300 leading-relaxed">
      <section>
        <h3 className="text-xl font-bold text-white mb-3">1. Persetujuan</h3>
        <p>Dengan mengakses website dan melakukan pembelian, Anda dianggap telah membaca, memahami, dan menyetujui semua syarat & ketentuan ini. Jika tidak setuju, mohon untuk tidak melanjutkan transaksi.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-3">2. Produk & Harga</h3>
        <ul className="list-disc pl-5 space-y-2 marker:text-brand-orange">
            <li>Kami berusaha menampilkan foto dan deskripsi produk seakurat mungkin. Namun, perbedaan warna minor akibat layar gadget atau update kemasan dari pabrik mungkin terjadi.</li>
            <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Harga yang mengikat adalah harga yang tertera saat Anda melakukan checkout (Lock Price).</li>
            <li>Kami berhak membatalkan pesanan jika terjadi kesalahan sistem (bug harga Rp 0 atau harga tidak wajar).</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-3">3. Pembayaran</h3>
        <p>Pembayaran resmi hanya ditujukan ke rekening perusahaan atas nama <strong>PT MESIN KASIR SOLO</strong>. Kami tidak bertanggung jawab atas transfer ke rekening pribadi oknum yang mengatasnamakan karyawan kami.</p>
      </section>

      <section>
        <h3 className="text-xl font-bold text-white mb-3">4. Pengiriman</h3>
        <p>Risiko pengiriman (barang hilang/rusak di jalan) ditanggung oleh ekspedisi. Kami mewajibkan asuransi pengiriman untuk barang bernilai di atas Rp 1.000.000. Kami akan membantu proses klaim ke ekspedisi, namun penggantian dana tunduk pada kebijakan ekspedisi.</p>
      </section>
    </div>
  </div>
);

// --- MAIN LAYOUT COMPONENT ---

export const LegalPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  // Scroll to top on change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const tabs = [
    { id: 'refund', label: 'Refund & Garansi', icon: RefreshCw },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-20">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-12 gap-8">
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card border border-white/5 rounded-xl p-4 sticky top-28">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Legalitas</h4>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/legal/${tab.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${
                      type === tab.id 
                        ? 'bg-brand-orange text-white shadow-neon' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                    {type === tab.id && <ChevronRight size={16} className="ml-auto" />}
                  </button>
                ))}
              </nav>

              <div className="mt-8 p-4 bg-brand-dark rounded-lg border border-white/5">
                <p className="text-xs text-gray-400 mb-3">Butuh bantuan lebih lanjut?</p>
                <a 
                    href="https://wa.me/6282325103336" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-xs font-bold text-white transition-colors"
                >
                    Hubungi Admin
                </a>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-10 min-h-[600px]">
               {type === 'refund' && <RefundContent />}
               {type === 'privacy' && <PrivacyContent />}
               {type === 'terms' && <TermsContent />}
               
               {/* Default Redirect if no match */}
               {!['refund', 'privacy', 'terms'].includes(type || '') && (
                   <div className="text-center py-20">
                       <p className="text-gray-500">Memuat kebijakan...</p>
                       {/* Auto redirect effect could be added here, but button is safer */}
                       <Button onClick={() => navigate('/legal/refund')} className="mt-4">Lihat Kebijakan Refund</Button>
                   </div>
               )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
