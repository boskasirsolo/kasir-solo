
import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export const ProblemSolution = () => (
  <section className="py-24 bg-brand-black border-t border-white/5 relative overflow-hidden">
    <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>
    <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-brand-orange/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none"></div>

    <div className="container mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            Hari Gini Masih Catat Manual? <br/> <span className="text-red-500">Kelar Hidup Lo.</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Sadar gak lo? Selama ini lo gak lagi berbisnis. Lo cuma lagi diperbudak sama rutinitas toko yang gak ada abisnya karena gak pake <strong>Mesin Kasir</strong> yang bener.
          </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
         
         {/* LEFT: THE PAIN (Problem) */}
         <div className="bg-red-950/20 border border-red-500/20 rounded-3xl p-8 relative overflow-hidden group hover:border-red-500/40 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <XCircle size={100} className="text-red-500" />
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-red-500 mb-6 flex items-center gap-2">
                  <XCircle size={24}/> CARA LAMA (MANUAL)
               </h3>
               <ul className="space-y-6">
                  <li className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 font-bold">1</div>
                     <div>
                        <h4 className="text-white font-bold mb-1">Duit Bocor Alus</h4>
                        <p className="text-gray-400 text-sm">Kembalian salah, nota ilang, atau 'mark-up' harga sama karyawan nakal. Dikit sih, tapi tiap hari. Boncos, Bos!</p>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 font-bold">2</div>
                     <div>
                        <h4 className="text-white font-bold mb-1">Stok Barang Ghaib</h4>
                        <p className="text-gray-400 text-sm">Di catetan ada, di rak kosong. Lo bingung duitnya lari kemana, padahal barang abis. Capek hati.</p>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 shrink-0 font-bold">3</div>
                     <div>
                        <h4 className="text-white font-bold mb-1">Lo Jadi Tahanan Toko</h4>
                        <p className="text-gray-400 text-sm">Gak berani ninggalin toko karena takut dikadalin. Bisnis jalan, tapi hidup lo gak tenang.</p>
                     </div>
                  </li>
               </ul>
            </div>
         </div>

         {/* RIGHT: THE SOLUTION (Gain) */}
         <div className="bg-brand-dark border border-brand-orange/30 rounded-3xl p-8 relative overflow-hidden shadow-neon group hover:border-brand-orange transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <CheckCircle2 size={100} className="text-brand-orange" />
            </div>
            <div className="relative z-10">
               <h3 className="text-xl font-bold text-brand-orange mb-6 flex items-center gap-2">
                  <CheckCircle2 size={24}/> CARA GUE (MESIN KASIR)
               </h3>
               <ul className="space-y-6">
                  <li className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0 font-bold">1</div>
                     <div>
                        <h4 className="text-white font-bold mb-1">Sistem Anti-Tuyul (Fraud)</h4>
                        <p className="text-gray-400 text-sm">Setiap sen kecatet di <strong>Mesin Kasir</strong>. Void/Batal transaksi butuh password lo. Karyawan gak bisa macem-macem.</p>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0 font-bold">2</div>
                     <div>
                        <h4 className="text-white font-bold mb-1">Stok Opname Otomatis</h4>
                        <p className="text-gray-400 text-sm">Sistem bakal teriak kalau stok tipis. Belanja barang jadi terukur, gak pake feeling doang.</p>
                     </div>
                  </li>
                  <li className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-brand-orange/20 flex items-center justify-center text-brand-orange shrink-0 font-bold">3</div>
                     <div>
                        <h4 className="text-white font-bold mb-1">Asisten Digital 24 Jam</h4>
                        <p className="text-gray-400 text-sm">Mesin ini gak pernah sakit, gak pernah cuti, dan gak bakal resign. Hemat gaji admin, profit naik.</p>
                     </div>
                  </li>
               </ul>
            </div>
         </div>

      </div>
    </div>
  </section>
);
