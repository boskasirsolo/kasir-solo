
import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteConfig } from '../../types';
import { INITIAL_PRODUCTS } from '../../utils';
import { useAnalytics } from '../../hooks/use-analytics';
import { Header } from './header';
import { Footer } from './footer';
import { ScrollToTop } from './ui/scroll-top';

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

  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
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
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
      <Helmet>
        {config.is_noindex && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      
      <Header currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow pt-[76px]">
        {children}
      </main>

      <Footer setPage={setPage} config={config} />
      
      <ScrollToTop />

      <Suspense fallback={null}>
        <SibosWidget products={INITIAL_PRODUCTS} isAdmin={false} currentPage={currentPage} setConfig={setConfig} session={session} />
      </Suspense>
    </div>
  );
};
