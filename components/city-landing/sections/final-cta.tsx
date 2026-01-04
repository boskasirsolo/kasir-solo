
import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '../../ui';
import { CityData } from '../types';

export const FinalCTA = ({ city, onContact }: { city: CityData, onContact: () => void }) => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-brand-orange/5"></div>
            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="flex justify-center mb-6">
                   {[1,2,3,4,5].map(i => <Star key={i} size={24} className="text-yellow-500 fill-yellow-500" />)}
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-8">
                   Siap Jadi Raja Lokal di {city.name}?
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                   Kompetitor lo di {city.name} mungkin udah pake sistem gue diem-diem. Jangan sampe lo ketinggalan kereta. Upgrade toko lo sekarang.
                </p>
                <Button onClick={onContact} className="px-10 py-4 text-lg shadow-action hover:shadow-action-strong uppercase font-bold mx-auto">
                   Amankan Stok Sekarang <ArrowRight size={20} />
                </Button>
            </div>
        </section>
    );
};
