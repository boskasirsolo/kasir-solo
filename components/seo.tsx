
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types';

export const SEOHelmet = ({
    title,
    description,
    image,
    url,
    type = 'website'
}: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
}) => {
    const siteTitle = "PT MESIN KASIR SOLO";
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDesc = description || "Pusat penjualan mesin kasir modern (POS), jasa pembuatan website SEO, dan aplikasi kasir online/offline terlengkap.";
    const finalImage = image || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200&h=630";
    
    const currentPath = window.location.pathname;
    const finalUrl = url || `https://kasirsolo.my.id${currentPath}`;

    return (
        <Helmet>
            <title>{finalTitle}</title>
            <meta name="description" content={finalDesc} />
            <link rel="canonical" href={finalUrl} />

            <meta property="og:type" content={type} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:site_name" content="Mesin Kasir Solo" />

            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDesc} />
            <meta name="twitter:image" content={finalImage} />
        </Helmet>
    );
};

export const BreadcrumbSchema = ({ paths }: { paths: { name: string, item: string }[] }) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": paths.map((p, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": p.name,
            "item": `https://kasirsolo.my.id${p.item}`
        }))
    };
    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
};

export const ProductSchema = ({ product }: { product: Product }) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [product.image],
    "description": product.description?.substring(0, 200) || `Jual ${product.name} termurah dan bergaransi.`,
    "sku": `MKS-${product.id}`,
    "brand": { "@type": "Brand", "name": "Mesin Kasir Solo" },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "IDR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": "PT Mesin Kasir Solo" }
    }
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
};

export const LocalBusinessSchema = ({ city }: { city: string }) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": `PT Mesin Kasir Solo - Cabang ${city}`,
        "image": "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
        "@id": `https://kasirsolo.my.id/jual-mesin-kasir-di/${city.toLowerCase()}`,
        "url": window.location.href,
        "telephone": "+6282325103336",
        "priceRange": "IDR 2.000.000 - IDR 15.000.000",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Perum Graha Tiara 2 B1",
            "addressLocality": "Kartasura",
            "addressRegion": "Jawa Tengah",
            "postalCode": "57169",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -7.5515,
            "longitude": 110.7534
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "08:00",
            "closes": "17:00"
        },
        "sameAs": [
            "https://www.facebook.com/mesinkasirsolo",
            "https://www.instagram.com/mesinkasirsolo"
        ]
    };
    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
};
