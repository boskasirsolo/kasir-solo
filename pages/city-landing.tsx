
import React from 'react';
import { useParams } from 'react-router-dom';
import { CityLandingModule } from '../components/city-landing';
import { SiteConfig } from '../types';
import { SEOHelmet, BreadcrumbSchema } from '../components/seo';

export const CityLandingPage = ({ config }: { config?: SiteConfig }) => {
  const { citySlug } = useParams();
  
  const cityName = citySlug 
    ? citySlug.charAt(0).toUpperCase() + citySlug.slice(1).replace(/-/g, ' ') 
    : 'Seluruh Indonesia';

  const pageTitle = citySlug 
    ? `Jual Paket Mesin Kasir di ${cityName} - Murah & Bergaransi`
    : `Area Layanan Mesin Kasir Solo - Jangkauan Nasional`;

  const pageDesc = citySlug
    ? `Distributor mesin kasir (POS) Android & Windows terlengkap di area ${cityName}. Gratis instalasi dan training langsung oleh Founder.`
    : `Kami melayani pengiriman dan instalasi paket mesin kasir lengkap ke seluruh pelosok Indonesia. Cek ketersediaan layanan di kota Anda.`;

  return (
    <>
      <SEOHelmet 
        title={pageTitle}
        description={pageDesc}
        type="business.business"
      />
      <BreadcrumbSchema 
        paths={[
          { name: 'Home', item: '/' },
          { name: 'Area Layanan', item: '/area-layanan' },
          ...(citySlug ? [{ name: cityName, item: `/jual-mesin-kasir-di/${citySlug}` }] : [])
        ]}
      />
      <CityLandingModule config={config} />
    </>
  );
};
