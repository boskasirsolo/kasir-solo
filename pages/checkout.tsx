
import React from 'react';
import { CheckoutModule } from '../components/checkout';

export const CheckoutPage = ({ setPage }: { setPage: (p: string) => void }) => {
  return <CheckoutModule setPage={setPage} />;
};
