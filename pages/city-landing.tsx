
import React from 'react';
import { CityLandingModule } from '../components/city-landing';
import { SiteConfig } from '../types';

export const CityLandingPage = ({ config }: { config?: SiteConfig }) => {
  return <CityLandingModule config={config} />;
};
