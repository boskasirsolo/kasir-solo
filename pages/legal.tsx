
import React, { useEffect } from 'react';
import { ShieldCheck, RefreshCw, FileText, AlertTriangle, Video, Lock, Truck, CreditCard, ChevronRight, CheckCircle2, XCircle, HelpCircle, AlertOctagon } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

const RefundContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="border-b border-white/10 pb-6">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Kebijakan Garansi & Retur</h1>
      <p className="text-gray-400">Proteksi maksimal untuk investasi hardware dan software Anda.</p>
    </div>

    {/* WARNING BLOCK */}
    <div className="bg-red-900/10 border border-red-500/50 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Video size={120} className="text-red-500" />
      </div>
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-red-500 flex items-center gap-2 mb-4">
          <AlertOctagon /> SYARAT MUTLAK KLAIM: VIDEO UNBOXING
        </h3>
        <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
          Sebagai toko elektronik, kami sangat ketat terhadap kerusakan fisik. Kami <strong>MENOLAK 100%</strong> komplain barang pecah/kurang jika pembeli tidak dapat menunjukkan bukti Video Unboxing yang sah.
        </p>
        <div className="grid md:grid-cols-3 gap-4 text-xs md:text-sm text-gray-300">
           <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
              <span className="text-red-400 font-bold block mb-1">1. Rekam Sebelum Buka</span>
              Video dimulai dari paket utuh (lakban belum disayat) & perlihatkan resi.
           </div>
           <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
              <span className="text-red-400 font-bold block mb-1">2. No Cut / Edit</span>
              Video harus bersambung (one-take) sampai unit dinyalakan (test nyala).
           </div>
           <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
              <span className="text-red-400 font-bold block mb-1">3. Batas Waktu 1x24 Jam</span>
              Komplain diajukan maksimal 1x24 jam setelah status resi "Diterima".
           </div>
        </div>
      </div>
    </div>

    <div className="space-y-8 text-gray-300 leading-relaxed">
      
      {/* HARDWARE SECTION */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-brand-orange rounded-full"></div> 1. Garansi Hardware (Mesin Kasir)
        </h3>
        <p className="mb-4 text-sm">Setiap pembelian Hardware (Printer, Android POS, PC) dilindungi garansi distributor/toko selama <strong>12 Bulan</strong> (kecuali Sparepart/Adaptor/Baterai 3-6 bulan).</p>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/5 p-4 rounded-xl border border-green-500/20">
                <h4 className="text-green-400 font-bold text-sm mb-3 flex items-center gap-2"><CheckCircle2 size={16}/> DICOVER GARANSI</h4>
                <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
                    <li>Mati total karena cacat pabrik (Defect).</li>
                    <li>Layar Ghost Touch / Dead Pixel (sesuai toleransi pabrik).</li>
                    <li>Printer macet bukan karena kertas/kotoran.</li>
                    <li>Port koneksi tidak berfungsi tiba-tiba.</li>
                </ul>
            </div>
            <div className="bg-red-500/5 p-4 rounded-xl border border-red-500/20">
                <h4 className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2"><XCircle size={16}/> TIDAK DICOVER (VOID)</h4>
                <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
                    <li>Kerusakan fisik (Jatuh, Pecah, Retak, Penyok).</li>
                    <li>Terkena cairan (Air, Kopi, Banjir) & korosi.</li>
                    <li>Segel garansi rusak/robek/hilang.</li>
                    <li>Kerusakan akibat kelistrikan tidak stabil (Koslet).</li>
                    <li>Update firmware ilegal / Rooting.</li>
                </ul>
            </div>
        </div>
      </section>

      {/* SOFTWARE SECTION */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-brand-orange rounded-full"></div> 2. Kebijakan Software (SaaS)
        </h3>
        <div className="bg-brand-card border border-white/5 p-5 rounded-xl">
            <p className="text-sm text-gray-300 mb-3">
                Lisensi software (SIBOS, QALAM, atau Aplikasi Kasir lainnya) bersifat <strong>FINAL & NON-REFUNDABLE</strong>.
            </p>
            <ul className="space-y-2 text-sm text-gray-400 list-decimal pl-4">
                <li>Setelah kode aktivasi/lisensi dikirimkan atau akun dibuat, pembatalan tidak dapat dilakukan dengan alasan apapun.</li>
                <li>Kami menyediakan <strong>Free Trial / Demo</strong> sebelum pembelian. Pastikan fitur software sudah sesuai kebutuhan Anda sebelum membayar.</li>
                <li>Garansi software berupa "Lifetime Support" untuk perbaikan bug sistem dan panduan penggunaan, bukan pengembalian dana.</li>
            </ul>
        </div>
      </section>

      {/* REFUND DANA */}
      <section>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-brand-orange rounded-full"></div> 3. Pengembalian Dana (Refund)
        </h3>
        <p className="text-sm text-gray-300 mb-2">
            Kami memprioritaskan solusi <strong>Tukar Unit Baru (Replacement)</strong> atau <strong>Service</strong>. Refund dana tunai hanya dilakukan jika:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
            <li>Stok unit pengganti kosong (Discontinue).</li>
            <li>Terjadi kesalahan harga sistem yang fatal (Bug Price).</li>
            <li>Pengiriman dibatalkan sepihak oleh ekspedisi (Barang Hilang).</li>
        </ul>
        <p className="text-xs text-gray-500 mt-2 italic">*Dana akan dikembalikan dipotong biaya admin bank (jika ada) dalam waktu 3-7 hari kerja.</p>
      </section>

    </div>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="border-b border-white/10 pb-6">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Kebijakan Privasi</h1>
      <p className="text-gray-400">Komitmen "Data Fortress" untuk keamanan informasi Anda.</p>
    </div>

    <div className="space-y-8 text-gray-300 leading-relaxed">
      
      {/* INTRO */}
      <div className="bg-brand-card p-6 rounded-xl border border-white/5">
         <p className="text-sm md:text-base leading-relaxed">
            Di era digital di mana data sering disalahgunakan, PT Mesin Kasir Solo berdiri tegak dengan prinsip <strong>Integritas Data</strong>. Kami mengumpulkan data hanya untuk keperluan transaksi dan legalitas, bukan untuk komoditas.
         </p>
      </div>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><ShieldCheck size={24}/></div>
            <h3 className="text-xl font-bold text-white">1. Data yang Kami Simpan</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1 text-sm">Data Wajib (Transactional)</strong>
                <p className="text-xs text-gray-400">Nama Lengkap, Alamat Pengiriman, Nomor HP/WA (untuk OTP & Kurir), dan History Belanja.</p>
            </div>
            <div className="bg-brand-dark p-4 rounded-xl border border-white/5">
                <strong className="text-white block mb-1 text-sm">Data Bisnis (Konfigurasi)</strong>
                <p className="text-xs text-gray-400">Nama Toko, Alamat Toko, dan Logo Struk (Hanya jika Anda membeli paket setting awal).</p>
            </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><Lock size={24}/></div>
            <h3 className="text-xl font-bold text-white">2. Keamanan & Enkripsi</h3>
        </div>
        <ul className="list-disc pl-5 mt-2 space-y-2 text-sm text-gray-400 marker:text-brand-orange">
            <li><strong>Supabase RLS:</strong> Kami menggunakan Row Level Security. Data Anda hanya bisa diakses oleh akun Anda sendiri dan Admin yang berwenang.</li>
            <li><strong>No Plain Text Password:</strong> Password Anda dienkripsi (hashing). Bahkan tim IT kami tidak bisa melihat password Anda.</li>
            <li><strong>SSL Secured:</strong> Seluruh lalu lintas data di website ini terenkripsi protokol HTTPS standar perbankan.</li>
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><XCircle size={24}/></div>
            <h3 className="text-xl font-bold text-white">3. Janji "Anti-Jual Data"</h3>
        </div>
        <p className="text-sm">Kami menjamin <strong>TIDAK AKAN</strong>:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-gray-400">
            <li>Menjual database nomor HP Anda ke pihak ketiga (Pinjol, Judi Online, Telemarketing).</li>
            <li>Mengirimkan spam email/WA yang tidak relevan dengan produk kami.</li>
            <li>Membagikan omzet/data transaksi bisnis Anda (jika menggunakan SIBOS) ke publik/kompetitor.</li>
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange"><HelpCircle size={24}/></div>
            <h3 className="text-xl font-bold text-white">4. Hak Pengguna</h3>
        </div>
        <p className="text-sm text-gray-400">
            Anda berhak meminta penghapusan data akun (Right to be Forgotten) kapan saja dengan menghubungi Admin Support, kecuali data transaksi yang wajib disimpan untuk keperluan audit perpajakan (minimal 5 tahun sesuai UU).
        </p>
      </section>
    </div>
  </div>
);

const TermsContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div className="border-b border-white/10 pb-6">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-2">Syarat & Ketentuan</h1>
      <p className="text-gray-400">Pahamilah aturan main (TOS) sebelum bertransaksi.</p>
    </div>

    <div className="space-y-8 text-gray-300 leading-relaxed">
      
      {/* PEMBELIAN */}
      <section>
        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-brand-orange pl-3">1. Pesanan & Harga</h3>
        <ul className="list-decimal pl-5 space-y-2 text-sm text-gray-400 marker:font-bold marker:text-white">
            <li><strong>Price Lock:</strong> Harga yang Anda bayar adalah harga saat Checkout. Perubahan harga (naik/turun) setelah checkout tidak mempengaruhi pesanan yang sudah dibayar.</li>
            <li><strong>Human Error:</strong> Jika terjadi kesalahan harga yang sangat tidak wajar (misal: Laptop Rp 1.000) akibat bug sistem, kami berhak membatalkan pesanan sepihak dan mengembalikan dana 100%.</li>
            <li><strong>Ketersediaan Stok:</strong> Stok produk dinamis (berjalan offline & online). Jika stok habis setelah Anda transfer, kami akan menawarkan: (a) Indent/Pre-order, (b) Tukar tipe lain, atau (c) Refund full.</li>
        </ul>
      </section>

      {/* PEMBAYARAN */}
      <section>
        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-brand-orange pl-3">2. Pembayaran Sah</h3>
        <div className="bg-brand-card p-4 rounded-lg border border-white/5">
            <p className="text-sm mb-2">Pembayaran hanya dianggap SAH jika ditransfer ke rekening perusahaan resmi:</p>
            <div className="flex items-center gap-3 bg-black/40 p-3 rounded border border-brand-orange/30">
                <CreditCard className="text-brand-orange" />
                <div>
                    <p className="text-xs text-gray-400">Bank Neo Commerce (BNC)</p>
                    <p className="text-white font-bold font-mono">5859 4594 0674 0414</p>
                    <p className="text-xs text-gray-400">a.n PT MESIN KASIR SOLO</p>
                </div>
            </div>
            <p className="text-xs text-red-400 mt-2 font-bold flex items-center gap-1">
                <AlertTriangle size={12}/> Hati-hati penipuan! Kami tidak bertanggung jawab atas transfer ke rekening pribadi (atas nama perorangan).
            </p>
        </div>
      </section>

      {/* PENGIRIMAN */}
      <section>
        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-brand-orange pl-3">3. Pengiriman & Risiko</h3>
        <ul className="list-decimal pl-5 space-y-2 text-sm text-gray-400 marker:font-bold marker:text-white">
            <li><strong>Wajib Asuransi:</strong> Untuk produk bernilai > Rp 1.000.000, wajib menggunakan asuransi pengiriman.</li>
            <li><strong>Risiko Perjalanan:</strong> Kehilangan atau kerusakan barang saat di tangan kurir (JNE/J&T/dll) adalah tanggung jawab ekspedisi. Kami akan membantu proses klaim asuransi (bukan mengganti dana pribadi) hingga selesai.</li>
            <li><strong>Packing Kayu:</strong> Sangat disarankan untuk pengiriman PC All in One / Layar Sentuh ke luar pulau Jawa.</li>
        </ul>
      </section>

      {/* HAK KEKAYAAN INTELEKTUAL */}
      <section>
        <h3 className="text-xl font-bold text-white mb-3 border-l-4 border-brand-orange pl-3">4. Hak Kekayaan Intelektual (HAKI)</h3>
        <p className="text-sm text-gray-400">
            Dilarang keras menduplikasi, membajak, atau merekayasa balik (reverse engineer) software buatan kami (SIBOS, QALAM). Pelanggaran terhadap lisensi software akan diproses sesuai UU Hak Cipta yang berlaku di Indonesia.
        </p>
      </section>

    </div>
  </div>
);

export const LegalPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const tabs = [
    { id: 'refund', label: 'Refund & Garansi', icon: RefreshCw },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-12 gap-8">
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card border border-white/5 rounded-xl p-4 sticky top-28 shadow-lg">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Legalitas</h4>
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/legal/${tab.id}`)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all group ${
                      type === tab.id 
                        ? 'bg-brand-orange text-white shadow-neon' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <tab.icon size={18} className={type === tab.id ? 'text-white' : 'text-gray-500 group-hover:text-brand-orange'} />
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
                    className="flex items-center justify-center w-full py-2 bg-white/5 hover:bg-white/10 border border-brand-orange rounded text-xs font-bold text-white transition-colors"
                >
                    Hubungi Admin
                </a>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-10 min-h-[600px] shadow-2xl relative overflow-hidden">
               {/* Background Decorative */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-brand-orange/5 rounded-full blur-[80px] pointer-events-none"></div>
               
               <div className="relative z-10">
                   {type === 'refund' && <RefundContent />}
                   {type === 'privacy' && <PrivacyContent />}
                   {type === 'terms' && <TermsContent />}
                   
                   {!['refund', 'privacy', 'terms'].includes(type || '') && (
                       <div className="text-center py-20">
                           <ShieldCheck size={48} className="mx-auto text-gray-600 mb-4"/>
                           <p className="text-gray-500">Pilih menu kebijakan di sebelah kiri.</p>
                           <Button onClick={() => navigate('/legal/refund')} className="mt-4">Lihat Kebijakan Refund</Button>
                       </div>
                   )}
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
