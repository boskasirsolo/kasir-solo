
import React from 'react';
import { ServiceHero, FeatureGrid, WorkflowSection, NarrativeSection } from './ui-parts';
import { InvestmentSimulator, CalcData } from '../calculator';

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
}

export const ServicePageTemplate = ({
    title, highlight, subtitle, icon,
    narrativeContent,
    features,
    calcData, calcServiceName,
    steps
}: ServicePageTemplateProps) => {
    return (
        <div className="animate-fade-in">
            <ServiceHero 
                title={title} 
                highlight={highlight} 
                subtitle={subtitle} 
                icon={icon} 
            />
            
            <NarrativeSection>
                {narrativeContent}
            </NarrativeSection>

            <FeatureGrid features={features} />
            
            <section className="py-16 bg-brand-dark border-t border-white/5">
                <div className="container mx-auto px-4">
                    <InvestmentSimulator data={calcData} serviceName={calcServiceName} />
                </div>
            </section>

            <WorkflowSection steps={steps} />
        </div>
    );
};
