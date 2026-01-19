
import React from 'react';
import { TrackOrderModule } from '../components/track-order';
import { SiteConfig } from '../types';

export const TrackOrderPage = ({ config }: { config?: SiteConfig }) => {
    return <TrackOrderModule config={config} />;
};
