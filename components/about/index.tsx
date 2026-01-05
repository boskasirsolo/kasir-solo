
import React from 'react';
import { SiteConfig } from '../../types';
import { AboutHero } from './sections/hero';
import { AboutStory } from './sections/story';
import { AboutTimeline } from './sections/timeline';
import { OfficePreview } from './sections/office-preview';
import { AboutLegality } from './sections/legality';

export const AboutModule = ({ config }: { config?: SiteConfig }) => {
  return (
    <div className="animate-fade-in">
      <AboutHero />
      <AboutStory config={config} />
      <AboutTimeline />
      <OfficePreview config={config} />
      <AboutLegality config={config} />
    </div>
  );
};
