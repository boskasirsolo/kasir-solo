
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GalleryItem } from '../../types';
import { slugify } from '../../utils';
import { ServiceHero, FeatureGrid, WorkflowSection, NarrativeSection } from './ui-parts';
import { InvestmentSimulator } from '../shared/calculator/index';
import { CalcData } from '../shared/calculator/types';
import { DigitalProjectCard } from '../gallery/ui-parts';
import { SectionHeader } from '../ui';

interface ServicePageTemplateProps {
    title: string;
    highlight: string;
    subtitle: string;
    icon: any;
    narrativeContent: React.ReactNode;
    features: any[];
    calcData: CalcData;
    calcServiceName: string;
    steps: any[];
    waNumber?: string;
    serviceSlug?: string;
    relatedProjects?: GalleryItem[];
}

export const ServicePageTemplate = ({
    title, highlight, subtitle, icon,
    narrativeContent,
    features,
    calcData, calcServiceName,
    steps,
    waNumber,
    serviceSlug,
    relatedProjects
}: ServicePageTemplateProps) => {
    const navigate = useNavigate();

    return (
        <div className="animate-fade-in">
            <ServiceHero 
                title={title} 
                highlight={highlight} 
                subtitle={subtitle} 
                icon={icon} 
                waNumber={waNumber}
            />
            
            <NarrativeSection>
                {narrativeContent}
            </NarrativeSection>

            <FeatureGrid features={features} />
            
            {/* NEW SECTION: RELATED PROJECTS */}
            {relatedProjects && relatedProjects.length > 0 && (
                <section className="py-20 bg-brand-black border-t border-white/5 relative overflow-hidden">
                    {/* Background decor */}
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                    
                    <div className="container mx-auto px-4 relative z-10">
                        <SectionHeader 
                            title="Hasil" 
                            highlight="Karya" 
                            subtitle="Bukan teori doang. Ini bukti nyata sistem yang udah gue bangun dan dipake klien." 
                        />
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedProjects.map(item => (
                                <DigitalProjectCard 
                                    key={item.id} 
                                    item={item} 
                                    // FIX: Changed arrow function to block to ensure void return
                                    onClick={() => { navigate(`/gallery/${slugify(item.title)}`); }} 
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className="py-16 bg-brand-dark border-t border-white/5">
                <div className="container mx-auto px-4">
                    <InvestmentSimulator 
                        data={calcData} 
                        serviceName={calcServiceName} 
                        waNumber={waNumber}
                        serviceSlug={serviceSlug}
                    />
                </div>
            </section>

            <WorkflowSection steps={steps} />
        </div>
    );
};
