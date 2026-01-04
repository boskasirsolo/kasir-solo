
import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { CityData } from '../types';
import { PainPointRow, SolutionRow } from '../ui-parts';

export const EducationSection = ({ city }: { city: CityData }) => {
    return (
        <section className="py-20 bg-brand-black border-t border-white/5">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                            <AlertTriangle size={12} /> Fakta Lapangan
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-6">
                            "Ah, pake kalkulator aja cukup..." <br/>
                            <span className="text-gray-500">Kata siapa?</span>
                        </h2>
                        <div className="space-y-6">
                            <PainPointRow 
                                number={1} 
                                title="Stok Gak Pernah Klop" 
                                desc="Lo beli barang 100, kejual 50, sisa di rak cuma 40. Ilang 10 kemana? Tanpa sistem, lo cuma bisa nebak-nebak buah manggis." 
                            />
                            <PainPointRow 
                                number={2} 
                                title="Laporan Keuangan Ghaib" 
                                desc={`Omzet gede tapi pas mau belanja stok duitnya gak ada? Itu penyakit umum UMKM di ${city.name}. Sistem gue bakal kasih tau lo kemana duit lo pergi.`}
                            />
                            <PainPointRow 
                                number={3} 
                                title="Pelanggan Kabur" 
                                desc="Antrian panjang, nota tulis tangan lama, salah hitung harga. Hari gini pelayanan lambat? Pelanggan pindah ke toko sebelah yang pake mesin kasir." 
                            />
                        </div>
                    </div>
                    
                    <div className="relative">
                        <div className="absolute inset-0 bg-brand-orange/20 rounded-full blur-[100px]"></div>
                        <div className="relative bg-brand-card border border-white/10 rounded-2xl p-8 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <TrendingUp className="text-green-500"/> Solusi Gue Buat {city.name}
                            </h3>
                            <div className="space-y-4">
                                <SolutionRow title="Mesin Kasir Android (Simpel)" />
                                <SolutionRow title="PC Kasir Windows (Heavy Duty)" />
                                <SolutionRow title="Software Toko & Resto" />
                                
                                <div className="p-4 bg-brand-orange/10 rounded-xl border border-brand-orange/30 mt-4">
                                    <p className="text-brand-orange text-xs font-bold leading-relaxed text-center">
                                        "Gue rakitin sesuai budget & kebutuhan lo. Gak maksa beli yang mahal kalau yang murah udah cukup."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
