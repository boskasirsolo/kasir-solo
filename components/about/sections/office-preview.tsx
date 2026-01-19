
import React from 'react';
import { Building } from 'lucide-react';
import { SiteConfig } from '../../../types';
import { optimizeImage } from '../../../utils';

export const OfficePreview = ({ config }: { config?: SiteConfig }) => (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden group border-t border-white/5">
        <div className="absolute inset-0 bg-brand-dark flex items-center justify-center">
            {config?.about_image ? (
                <img 
                    src={optimizeImage(config.about_image, 1200)} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-80"
                    alt="Kantor PT Mesin Kasir Solo" 
                    loading="lazy"
                />
            ) : (
                <div className="text-gray-600 flex flex-col items-center">
                    <Building size={48} className="mb-2"/>
                    <p>Dapur Rekayasa Kami</p>
                </div>
            )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent flex flex-col justify-end pb-12 px-4 text-center">
            <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Markas Legal Mesin Kasir Solo</h3>
            <p className="text-gray-400">Tempat di mana ide liar dieksekusi jadi solusi nyata. Dari garasi kecil gue sulap jadi markas Mesin Kasir Solo</p>
        </div>
    </section>
);
