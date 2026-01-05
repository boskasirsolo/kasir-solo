
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingSpinner } from '../ui';
import { LocalBusinessSchema } from '../seo';
import { CityLogicProps } from './types';
import { useCityLogic } from './logic';

// Section Imports
import { CityListView } from './sections/city-list-view';
import { HeroSection } from './sections/hero';
import { WhyUsSection } from './sections/why-us';
import { EducationSection } from './sections/education.tsx';
import { FinalCTA } from './sections/final-cta';

export const CityLandingModule = (props: CityLogicProps) => {
    const { citySlug } = useParams();
    const navigate = useNavigate();
    
    // Pass slug from router param to logic hook
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

    // LIST VIEW: Jika kota tidak ditemukan atau user akses root path /jual-mesin-kasir-di
    if (!cityData) {
        return <CityListView cities={citiesList} />;
    }

    // DETAIL VIEW: Landing Page Spesifik Kota
    return (
        <div className="animate-fade-in">
            <LocalBusinessSchema city={cityData.name} />
            
            <HeroSection 
                city={cityData}
                isKandang={isKandang}
                quota={quotaInfo}
                onShop={() => navigate('/shop')}
                waNumber={props.config?.whatsappNumber}
            />

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
