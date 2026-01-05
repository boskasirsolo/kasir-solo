
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from '../../ui';
import { CityData, QuotaInfo } from '../types';
import { StrategyChip, QuotaBadge } from '../ui-parts';

interface HeroSectionProps {
    city: CityData;
    isKandang: boolean;
    quota: QuotaInfo;
    onShop: () => void;
    waNumber?: string;
}

export const HeroSection = ({ city, isKandang, quota, onShop, waNumber }: HeroSectionProps) => {
    const targetWa = waNumber || "6282325103336";

    return (
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-white/5">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-orange/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2"></div>
            
            <div className="container mx-auto px-4 relative z-10 text-center">
                <StrategyChip cityName={city.name} />
                
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                   Juragan <span className="text-brand-orange">{city.name}</span>,<br/>
                   Masih Mau Boncos Tiap Hari?
                </h1>
                
                <div className="max-w-3xl mx-auto text-lg text-gray-400 leading-relaxed mb-10">
                   {isKandang ? (
                     <>
                       Gue bukan sekadar vendor, gue tetangga lo. Khusus area ini, <strong className="text-white">Gue Sendiri (Founder)</strong> yang bakal anter & setting mesinnya. Gak pake teknisi, gak pake perantara. Biar lo puas nanya-nanya langsung sama ahlinya.
                     </>
                   ) : (
                     <>
                       Buat lo di {city.name}, jarak bukan penghalang. Gue kirim paket aman (Kayu + Asuransi). Pas barang sampe, <strong className="text-white">Gue Sendiri</strong> yang bakal pandu lo setting via Video Call privat. Gak ada oper-operan ke admin.
                     </>
                   )}
                </div>

                <QuotaBadge isKandang={isKandang} remaining={quota.remaining} max={quota.max} />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <Button onClick={onShop} className="px-8 py-4 shadow-neon hover:shadow-neon-strong text-sm font-bold">
                      LIHAT SENJATA (KATALOG)
                   </Button>
                   <a 
                      href={`https://wa.me/${targetWa}?text=Halo Mas Amin, saya Juragan dari ${city.name}. Mau konsul mesin kasir, katanya langsung sama Founder ya?`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-8 py-4 rounded-lg font-bold border border-white/10 hover:bg-white/5 text-white transition-all flex items-center gap-2 justify-center text-sm"
                   >
                      <MessageCircle size={18} /> Chat Founder Langsung
                   </a>
                </div>
            </div>
        </section>
    );
};
