
import React from 'react';
import { ServiceHero, FeatureGrid, WorkflowSection, NarrativeSection } from './ui-parts';
import { InvestmentSimulator } from '../shared/calculator/index';
import { CalcData } from '../shared/calculator/types';

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
}

export const ServicePageTemplate = ({
    title, highlight, subtitle, icon,
    narrativeContent,
    features,
    calcData, calcServiceName,
    steps,
    waNumber,
    serviceSlug
}: ServicePageTemplateProps) => {
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
