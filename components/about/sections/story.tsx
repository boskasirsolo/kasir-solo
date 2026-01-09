
import React, { useState, useEffect } from 'react';
import { Users, Quote } from 'lucide-react';
import { SiteConfig } from '../../../types';
import { optimizeImage } from '../../../utils';

export const AboutStory = ({ config }: { config?: SiteConfig }) => {
    // Default fallback image
    const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800";
    
    const [imgSrc, setImgSrc] = useState(DEFAULT_IMAGE);

    useEffect(() => {
        // If config has a founder portrait, try to use it.
        // If it's empty/null, use default.
        if (config?.founderPortrait && config.founderPortrait.length > 5) {
            setImgSrc(config.founderPortrait);
        } else {
            setImgSrc(DEFAULT_IMAGE);
        }
    }, [config?.founderPortrait]);

    const handleImgError = () => {
        // If the current image fails (broken link from DB), revert to default
        if (imgSrc !== DEFAULT_IMAGE) {
            setImgSrc(DEFAULT_IMAGE);
        }
    };

    return (
        <section className="py-20 bg-brand-black relative">
            <div className="container mx-auto px-4">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-8 items-start">
                        
                        {/* 1. PHOTO FOUNDER */}
                        <div className="md:col-span-4 relative group">
                            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/10 bg-brand-dark relative grayscale group-hover:grayscale-0 transition-all duration-700 shadow-2xl">
                                <img 
                                    src={optimizeImage(imgSrc, 600)} 
                                    alt="Amin Maghfuri - Founder" 
                                    className="w-full h-full object-cover"
                                    loading="eager"
                                    onError={handleImgError}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            </div>
                        </div>

                        {/* 2. THE HOOK */}
                        <div className="md:col-span-8 flex flex-col justify-center h-full">
                            <div className="p-8 md:p-10 bg-brand-card border border-white/5 rounded-3xl relative overflow-hidden group hover:border-brand-orange/20 transition-all">
                                <Quote className="absolute top-8 right-8 text-white/5 w-24 h-24 rotate-180" />
                                <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 relative z-10 leading-tight">
                                    "Jujur-jujuran aja..."
                                </h3>
                                <div className="prose prose-invert prose-lg text-gray-400 leading-relaxed relative z-10">
                                    <p className="mb-4">
                                        Tahun 2022, gue pernah 'mati suri'. Aset digital ilang, domain diambil orang, profil google bisnis disuspend. Pernah juga dikadalin sama karyawan.
                                    </p>
                                    <p>
                                        Sistem berantakan gara-gara gue terlalu percaya sama 'manusia' tanpa sistem kontrol. Saat itu gue belajar satu hal mahal: <strong className="text-white">Bisnis tanpa sistem yang kuat cuma nunggu waktu buat meledak.</strong>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. TITIK BALIK */}
                        <div className="hidden md:block md:col-span-12 h-4"></div> 

                        <div className="md:col-span-7 pt-4">
                            <h4 className="text-2xl font-bold text-white mb-6 flex items-center gap-3 border-l-4 border-red-500 pl-4">
                                Titik Balik (The Turn)
                            </h4>
                            <div className="space-y-6 text-gray-400 text-lg leading-relaxed pr-0 md:pr-6">
                                <p>
                                    Dari kehancuran itu, gue bangun ulang semuanya sendirian. Bukan buat bales dendam, tapi buat mastiin <strong>lo gak perlu ngerasain sakit yang gue rasain.</strong>
                                </p>
                                <p>
                                    <strong>SIBOS</strong> dan <strong>Mesin Kasir</strong> yang gue rakit sekarang lahir dari trauma itu. Ini bukan sekadar alat jualan, ini adalah <strong>asuransi</strong> buat bisnis lo. Gue desain fitur-fiturnya berdasarkan apa yang <em>nyelametin duit</em>, bukan cuma apa yang <em>keliatan canggih</em>.
                                </p>
                            </div>
                        </div>

                        {/* 4. FOUNDER SIGNATURE */}
                        <div className="md:col-span-5 flex items-center h-full">
                            <div className="w-full bg-brand-orange/10 backdrop-blur-xl border border-brand-orange/30 p-8 rounded-3xl relative overflow-hidden group hover:bg-brand-orange/20 transition-all shadow-[0_0_30px_rgba(255,95,31,0.1)]">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-orange/40 rounded-full blur-[60px]"></div>
                                <div className="relative z-10">
                                    <div className="mb-6 border-b border-brand-orange/20 pb-6">
                                        <p className="text-white font-display font-bold text-2xl">Amin Maghfuri</p>
                                        <p className="text-brand-orange/80 text-xs uppercase tracking-widest font-bold mt-1">Founder & Survivor</p>
                                    </div>
                                    <p className="text-white/90 italic font-medium text-base leading-relaxed">
                                        "Developer lain bikin fitur di ruangan ber-AC. Gue bikin fitur di lapangan panas, sambil ngadepin komplain pelanggan dan selisih stok nyata. Gue tau rasanya boncos."
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
