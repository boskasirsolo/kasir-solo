
import React from 'react';
import { Flame, Target, HeartHandshake, AlertTriangle } from 'lucide-react';

export const CultureManifesto = () => (
    <>
        <section className="py-20 bg-brand-dark relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">DNA <span className="text-brand-orange">GUE</span></h2>
                    <p className="text-gray-400 text-sm max-w-2xl mx-auto">Gue pernah jatuh sejatuh-jatuhnya di 2022. Kehilangan domain, kehilangan aset. Gue bangkit lagi sendirian. Kalau mental lo tempe, lo gak bakal bertahan di sini.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { icon: Flame, title: "Tahan Banting", desc: "Masalah teknis, komplain klien, deadline mepet itu makanan sehari-hari gue. Gue butuh Problem Solver yang tenang pas badai dateng." },
                        { icon: Target, title: "Impact Over Output", desc: "Jangan bangga cuma karena lo 'lembur'. Gue cuma nilai hasil akhir. Kode lo bikin transaksi makin cepet? Itu yang gue itung." },
                        { icon: HeartHandshake, title: "Empati ke User", desc: "Klien gue itu pedagang pasar & ustadz TPA. Sistem lo harus membumi. Jangan bikin UI/UX rumit yang cuma dimengerti anak startup Jaksel." }
                    ].map((item, i) => (
                        <div key={i} className="p-8 bg-brand-card/30 border border-white/5 rounded-2xl hover:border-brand-orange/30 transition-all group">
                            <div className="w-14 h-14 bg-brand-dark border border-brand-orange/20 rounded-xl flex items-center justify-center text-brand-orange mb-6 group-hover:scale-110 transition-transform shadow-neon-text">
                                <item.icon size={28} />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
        <section className="py-16 bg-red-950/20 border-y border-red-500/10">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-8 flex items-center justify-center gap-2">
                    <AlertTriangle className="text-red-500" /> JANGAN COBA-COBA MASUK KALAU:
                </h3>
                <div className="flex flex-wrap justify-center gap-4">
                    {["Mental PNS (Cari Aman)", "Baperan (Anti Kritik)", "Males Belajar", "Kerja Kayak Robot"].map((item, i) => (
                        <div key={i} className="bg-brand-black px-6 py-3 rounded-full border border-red-500/30 text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span> {item}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    </>
);
