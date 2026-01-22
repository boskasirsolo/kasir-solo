
import React, { Suspense, lazy, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SiteConfig } from '../../types';
import { INITIAL_PRODUCTS } from '../../utils';
import { useAnalytics } from '../../hooks/use-analytics';
import { useSocialPulse } from '../../hooks/use-social-pulse';
import { Header } from './header';
import { Footer } from './footer';
import { ScrollToTop } from './ui/scroll-top';
import { SocialPulseWidget } from '../shared/social-pulse-widget';
import { CartDrawer } from '../shared/cart-drawer';

const SibosWidget = lazy(() => import('../sibos-core/index').then(module => ({ default: module.SibosWidget })));

export const Layout = ({ 
  children, 
  setPage, 
  currentPage,
  config,
  setConfig,
  session
}: { 
  children?: React.ReactNode, 
  setPage: (p: string) => void, 
  currentPage: string,
  config: SiteConfig,
  setConfig?: (c: SiteConfig) => void,
  session?: any
}) => {
  useAnalytics();
  const { pathname } = useLocation();
  const { currentEvent, allEvents } = useSocialPulse();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200 selection:bg-brand-orange selection:text-white">
        <main className="flex-grow">
          {children}
        </main>
        <Suspense fallback={null}>
            <SibosWidget products={INITIAL_PRODUCTS} isAdmin={true} currentPage={currentPage} setConfig={setConfig} session={session} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200 selection:bg-brand-orange selection:text-white">
      <Helmet>
        {config.is_noindex && <meta name="robots" content="noindex, nofollow" />}
        <body className="overflow-x-hidden" />
      </Helmet>
      
      <Header currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow pt-[76px] relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        {children}
      </main>

      <Footer setPage={setPage} config={config} />
      
      <ScrollToTop />
      
      <SocialPulseWidget event={currentEvent} />
      <CartDrawer />

      <Suspense fallback={null}>
        <SibosWidget products={INITIAL_PRODUCTS} isAdmin={false} currentPage={currentPage} setConfig={setConfig} session={session} />
      </Suspense>
    </div>
  );
};
