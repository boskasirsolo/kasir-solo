
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { SectionHeader } from '../../ui';
import { CityData } from '../types';

export const CityListView = ({ cities }: { cities: CityData[] }) => {
    return (
        <div className="container mx-auto px-4 py-24 animate-fade-in">
            <SectionHeader title="Jangkauan" highlight="Area Layanan" subtitle="Kami melayani pengiriman dan instalasi mesin kasir ke seluruh kota di Indonesia." />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {cities.map(c => (
                    <Link 
                      key={c.slug} 
                      to={`/jual-mesin-kasir-di/${c.slug}`}
                      className="p-4 bg-brand-card border border-white/10 rounded-xl hover:border-brand-orange transition-all text-center group"
                    >
                        <MapPin className="mx-auto mb-2 text-gray-500 group-hover:text-brand-orange" size={24} />
                        <h4 className="font-bold text-white group-hover:text-brand-orange">{c.name}</h4>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{c.type}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};
