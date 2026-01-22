
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../ui';
import { LocalBusinessSchema } from '../seo';
import { CityLogicProps } from './types';
import { useCityLogic } from './logic';
import { SimpleMarkdown } from '../admin-articles/markdown';

// Section Imports
import { CityListView } from './sections/city-list-view';
import { HeroSection } from './sections/hero';
import { WhyUsSection } from './sections/why-us';
import { EducationSection } from './sections/education.tsx';
import { FinalCTA } from './sections/final-cta';

export const CityLandingModule = (props: CityLogicProps) => {
    const { citySlug } = useParams();
    const navigate = useNavigate();
    
    const { cityData, citiesList, loading, isKandang, quotaInfo } = useCityLogic({ 
        ...props, 
        citySlug: citySlug 
    });

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size={32} />
            </div>
        );
    }

    if (!cityData) {
        return <CityListView cities={citiesList} />;
    }

    return (
        <div className="animate-fade-in">
            <LocalBusinessSchema city={cityData.name} />
            
            <HeroSection 
                city={cityData}
                isKandang={isKandang}
                quota={quotaInfo}
                onShop={() => navigate('/shop')}
                waNumber={props.config?.whatsapp_number}
            />

            {/* AI GENERATED NARRATIVE SECTION */}
            {(cityData as any).narrative && (
                <section className="py-20 bg-brand-dark/30 border-b border-white/5">
                    <div className="container mx-auto px-4 max-w-4xl">
                        <div className="bg-brand-card/50 p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <span className="text-8xl font-black italic">SOLO</span>
                            </div>
                            <SimpleMarkdown content={(cityData as any).narrative} />
                        </div>
                    </div>
                </section>
            )}

            <WhyUsSection 
                city={cityData}
                isKandang={isKandang}
            />

            <EducationSection 
                city={cityData}
            />

            <FinalCTA 
                city={cityData}
                onContact={() => navigate('/contact')}
            />
        </div>
    );
};
