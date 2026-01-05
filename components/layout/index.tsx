
import React, { Suspense, lazy } from 'react';
import { SiteConfig } from '../../types';
import { INITIAL_PRODUCTS } from '../../utils';
import { useAnalytics } from '../../hooks/use-analytics';
import { Header } from './header';
import { Footer } from './footer';
import { ScrollToTop } from './ui/scroll-top';

// LAZY LOAD SIBOS WIDGET
// This ensures the chat logic (and its heavy dependencies) aren't loaded 
// until the browser is idle or interaction happens.
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
  // ACTIVATE TRACKER HERE
  useAnalytics();

  // Hide Header/Footer on Admin Page
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
        <main className="flex-grow">
          {children}
        </main>
        {/* SIBOS AI WIDGET (ADMIN MODE) - Wrapped in Suspense */}
        <Suspense fallback={null}>
            <SibosWidget products={INITIAL_PRODUCTS} isAdmin={true} currentPage={currentPage} setConfig={setConfig} session={session} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-brand-black text-gray-200">
      <Header currentPage={currentPage} setPage={setPage} />
      
      <main className="flex-grow pt-[76px]">
        {children}
      </main>

      <Footer setPage={setPage} config={config} />
      
      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTop />

      {/* SIBOS AI WIDGET (PUBLIC MODE) - Wrapped in Suspense */}
      <Suspense fallback={null}>
        <SibosWidget products={INITIAL_PRODUCTS} isAdmin={false} currentPage={currentPage} setConfig={setConfig} session={session} />
      </Suspense>
    </div>
  );
};
