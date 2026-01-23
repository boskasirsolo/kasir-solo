
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
    const finalTitle = title ? `${title} | ${siteTitle}` : `${siteTitle} | Pusat Kasir & Jasa Website Terpercaya`;
    const finalDesc = description || "PT Mesin Kasir Solo (MKS) adalah distributor resmi paket mesin kasir Android & Windows terlengkap di Solo. Kami juga melayani jasa pembuatan website SEO dan custom ERP.";
    const finalImage = image || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200&h=630";
    
    const currentPath = window.location.pathname;
    const cleanPath = currentPath !== '/' && currentPath.endsWith('/') 
        ? currentPath.slice(0, -1) 
        : currentPath;

    const finalUrl = url || `https://kasirsolo.my.id${cleanPath}`;

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
            
            {/* SEO TAGS BUAT GOOGLE BOT */}
            <meta name="keywords" content="mesin kasir solo, jual pos solo, paket kasir murah, pt mesin kasir solo, jasa website solo, aplikasi kasir android" />
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
    "description": product.description?.substring(0, 200) || `Jual ${product.name} termurah dan bergaransi resmi di PT Mesin Kasir Solo.`,
    "sku": `MKS-${product.id}`,
    "brand": { "@type": "Brand", "name": "PT Mesin Kasir Solo" },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    },
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
        "name": `PT Mesin Kasir Solo - Area ${city}`,
        "image": "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
        "@id": `https://kasirsolo.my.id/area/${city.toLowerCase()}`,
        "url": window.location.href,
        "telephone": "+628816566935",
        "priceRange": "IDR 2.000.000 - IDR 25.000.000",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Perum Graha Tiara 2 B1, Kartasura",
            "addressLocality": "Solo Raya",
            "addressRegion": "Jawa Tengah",
            "postalCode": "57169",
            "addressCountry": "ID"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -7.5515,
            "longitude": 110.7534
        }
    };
    return (
        <Helmet>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Helmet>
    );
};
