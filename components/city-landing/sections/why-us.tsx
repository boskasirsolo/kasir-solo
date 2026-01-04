
import React from 'react';
import { UserCog, ShieldCheck, Users } from 'lucide-react';
import { Card } from '../../ui';
import { CityData } from '../types';

export const WhyUsSection = ({ city, isKandang }: { city: CityData, isKandang: boolean }) => {
    return (
        <section className="py-20 bg-brand-dark">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                   <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">Kenapa Pebisnis {city.name} Cari Gue?</h2>
                   <p className="text-gray-400 text-sm max-w-2xl mx-auto">Karena gue Single Fighter yang turun lapangan. Lo dapet akses langsung ke otak di balik sistemnya, bukan cuma sales yang ngejar target.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                   <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 group-hover:scale-110 transition-transform">
                              <UserCog size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-white">Founder Turun Tangan</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         {isKandang 
                            ? `Gue sendiri yang setir mobil, gue yang angkat barang, gue yang colok kabel. 100% Hands-on. Lo terima beres, terima training langsung dari gue.`
                            : `Gue gak percaya sama teknisi magang buat handle bisnis lo. Makanya, sesi setup & training via Video Call bakal gue handle langsung. Privasi & kualitas terjamin.`
                         }
                      </p>
                   </Card>

                   <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-green-500/10 rounded-lg text-green-400 group-hover:scale-110 transition-transform">
                              <ShieldCheck size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-white">Anti Tuyul Digital</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         Sistem gue dirancang dari pengalaman pait gue sendiri. Celah fraud karyawan, selisih stok, nota fiktif—semua udah gue tutup. Gue kasih lo sistem yang gue pake sendiri.
                      </p>
                   </Card>

                   <Card className="p-8 bg-brand-card/50 border border-white/5 hover:border-brand-orange/30 group">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-brand-orange/10 rounded-lg text-brand-orange group-hover:scale-110 transition-transform">
                              <Users size={24} />
                          </div>
                          <h3 className="text-lg font-bold text-white">Support Jalur Khusus</h3>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">
                         Lo gak bakal ngomong sama Bot atau CS yang jawabnya template "Maaf atas ketidaknyamanannya". Lo ngomong sama gue. Masalah lo, prioritas gue. Ini personal.
                      </p>
                   </Card>
                </div>
            </div>
        </section>
    );
};
