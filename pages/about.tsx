
import React from 'react';
import { SiteConfig } from '../types';
import { AboutModule } from '../components/about';

export const AboutPage = ({ config }: { config?: SiteConfig }) => {
  return <AboutModule config={config} />;
};
