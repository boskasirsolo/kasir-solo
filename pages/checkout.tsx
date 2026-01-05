
import React from 'react';
import { CheckoutModule } from '../components/checkout';
import { SiteConfig } from '../types';

export const CheckoutPage = ({ setPage, config }: { setPage: (p: string) => void, config?: SiteConfig }) => {
  return <CheckoutModule setPage={setPage} config={config} />;
};
