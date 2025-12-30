
import React, { useEffect, useMemo } from 'react';
import { ShieldCheck, RefreshCw, FileText, AlertTriangle, Video, Lock, Truck, CreditCard, ChevronRight, CheckCircle2, XCircle, HelpCircle, AlertOctagon, Scale } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui';

// --- CONTENT COMPONENTS ---

const RefundContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Kebijakan Garansi & Retur</h2>
      <p className="text-gray-400 text-sm md:text-base">Proteksi maksimal untuk investasi hardware dan software Anda.</p>
    </div>

    {/* WARNING BLOCK */}
    <div className="bg-red-900/10 border border-red-500/50 rounded-2xl p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Video size={120} className="text-red-500" />
      </div>
      <div className="relative z-10">
        <h3 className="text-lg font-bold text-red-500 flex items-center gap-2 mb-3">
          <AlertOctagon /> SYARAT MUTLAK: VIDEO UNBOXING
        </h3>
        <p className="text-gray-300 leading-relaxed mb-4 text-sm">
          Kami <strong>MENOLAK 100%</strong> komplain barang pecah/kurang jika pembeli tidak dapat menunjukkan bukti Video Unboxing yang sah (No Cut/Edit).
        </p>
        <div className="grid md:grid-cols-3 gap-3 text-xs text-gray-300">
           <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
              <span className="text-red-400 font-bold block mb-1">1. Rekam Sebelum Buka</span>
              Video dimulai dari paket utuh & perlihatkan resi.
           </div>
           <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
              <span className="text-red-400 font-bold block mb-1">2. No Cut / Edit</span>
              Video harus bersambung sampai unit dinyalakan.
           </div>
           <div className="bg-black/40 p-3 rounded-lg border border-red-500/20">
              <span className="text-red-400 font-bold block mb-1">3. Max 1x24 Jam</span>
              Komplain maksimal 1x24 jam setelah status "Diterima".
           </div>
        </div>
      </div>
    </div>

    <div className="space-y-8 text-gray-300 leading-relaxed">
      <section>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-orange rounded-full"></div> Garansi Hardware
        </h3>
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
      </section>

      <section>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-1 h-6 bg-brand-orange rounded-full"></div> Kebijakan Software (SaaS)
        </h3>
        <div className="bg-brand-card border border-white/5 p-4 rounded-xl">
            <p className="text-sm text-gray-300 mb-2">
                Lisensi software (SIBOS, QALAM) bersifat <strong>FINAL & NON-REFUNDABLE</strong>.
            </p>
            <ul className="space-y-1 text-xs text-gray-400 list-decimal pl-4">
                <li>Pembatalan tidak dapat dilakukan setelah kode aktivasi dikirim.</li>
                <li>Gunakan <strong>Free Trial</strong> untuk memastikan kecocokan sebelum membeli.</li>
            </ul>
        </div>
      </section>
    </div>
  </div>
);

const PrivacyContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Kebijakan Privasi</h2>
      <p className="text-gray-400 text-sm md:text-base">Komitmen "Data Fortress" untuk keamanan informasi Anda.</p>
    </div>

    <div className="bg-brand-card p-5 rounded-xl border border-white/5 text-sm leading-relaxed text-gray-300">
         Di era digital, kami berdiri tegak dengan prinsip <strong>Integritas Data</strong>. Kami mengumpulkan data hanya untuk keperluan transaksi dan legalitas, bukan untuk komoditas.
    </div>

    <div className="space-y-6 text-gray-300">
      <section>
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
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
            <Lock size={20} className="text-brand-orange"/>
            <h3 className="text-lg font-bold text-white">Enkripsi & Keamanan</h3>
        </div>
        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-400 marker:text-brand-orange">
            <li><strong>Supabase RLS:</strong> Row Level Security memastikan data Anda hanya bisa diakses akun Anda.</li>
            <li><strong>Hashing:</strong> Password dienkripsi satu arah (Bahkan kami tidak tahu password Anda).</li>
            <li><strong>SSL:</strong> Transaksi data terenkripsi protokol HTTPS standar perbankan.</li>
        </ul>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
            <XCircle size={20} className="text-brand-orange"/>
            <h3 className="text-lg font-bold text-white">Janji "Anti-Jual Data"</h3>
        </div>
        <div className="bg-brand-orange/5 border-l-4 border-brand-orange p-4 rounded-r-lg text-sm">
            Kami menjamin <strong>TIDAK AKAN</strong> menjual database nomor HP Anda ke pihak ketiga (Pinjol, Judi Online, Telemarketing). Privasi Anda adalah aset kami.
        </div>
      </section>
    </div>
  </div>
);

const TermsContent = () => (
  <div className="space-y-8 animate-fade-in">
    <div>
      <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Syarat & Ketentuan</h2>
      <p className="text-gray-400 text-sm md:text-base">Pahamilah aturan main (TOS) sebelum bertransaksi.</p>
    </div>

    <div className="space-y-8 text-gray-300 leading-relaxed">
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
                <p className="text-xs text-gray-400">Barang bernilai > Rp 1 Juta wajib asuransi pengiriman.</p>
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

// --- MAIN PAGE ---

export const LegalPage = () => {
  const { type } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const LEGAL_TABS = useMemo(() => [
    { id: 'refund', label: 'Refund & Garansi', icon: RefreshCw, component: <RefundContent /> },
    { id: 'privacy', label: 'Kebijakan Privasi', icon: ShieldCheck, component: <PrivacyContent /> },
    { id: 'terms', label: 'Syarat & Ketentuan', icon: FileText, component: <TermsContent /> },
  ], []);

  const activeTab = LEGAL_TABS.find(t => t.id === type);

  return (
    <div className="min-h-screen bg-brand-black pt-28 pb-20 animate-fade-in">
      <div className="container mx-auto px-4">
        
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="lg:col-span-3">
            <div className="bg-brand-card border border-white/5 rounded-xl p-4 sticky top-28 shadow-lg">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2 flex items-center gap-2">
                <Scale size={14}/> Legalitas
              </h4>
              <nav className="space-y-1">
                {LEGAL_TABS.map((tab) => (
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
                <p className="text-xs text-gray-400 mb-3 font-bold">Butuh bantuan khusus?</p>
                <a 
                    href="https://wa.me/6282325103336" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center w-full py-2 bg-white/5 hover:bg-white/10 border border-brand-orange rounded text-xs font-bold text-white transition-colors gap-2"
                >
                    <HelpCircle size={14}/> Hubungi Admin
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
                   {activeTab ? (
                       activeTab.component
                   ) : (
                       <div className="text-center py-20 flex flex-col items-center">
                           <div className="w-20 h-20 bg-brand-dark rounded-full flex items-center justify-center mb-6 border border-white/10">
                                <Scale size={40} className="text-brand-orange opacity-50"/>
                           </div>
                           <h3 className="text-xl font-bold text-white mb-2">Pusat Kebijakan</h3>
                           <p className="text-gray-500 max-w-md mx-auto mb-8">
                               Transparansi adalah kunci kepercayaan. Silakan pilih menu kebijakan di sebelah kiri untuk membaca detail aturan main kami.
                           </p>
                           <Button onClick={() => navigate('/legal/refund')} className="px-8">
                               Lihat Kebijakan Refund
                           </Button>
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
