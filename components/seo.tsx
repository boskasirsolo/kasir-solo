
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '../types';

// --- MAIN HELMET COMPONENT ---
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
    // Fallbacks
    const siteTitle = "PT MESIN KASIR SOLO";
    const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const finalDesc = description || "Pusat penjualan mesin kasir modern (POS), jasa pembuatan website SEO, dan aplikasi kasir online/offline terlengkap.";
    const finalImage = image || "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=1200&h=630";
    const finalUrl = url || window.location.href;

    return (
        <Helmet>
            {/* Standard */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDesc} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={finalUrl} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDesc} />
            <meta property="og:image" content={finalImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="Mesin Kasir Solo" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={finalUrl} />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDesc} />
            <meta name="twitter:image" content={finalImage} />
            
            {/* Schema Itemprops (Google+) */}
            <meta itemprop="name" content={finalTitle} />
            <meta itemprop="description" content={finalDesc} />
            <meta itemprop="image" content={finalImage} />
        </Helmet>
    );
};

// --- PRODUCT SCHEMA (Rich Snippets) ---
export const ProductSchema = ({ product }: { product: Product }) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [
        product.image
    ],
    "description": product.description || `Jual ${product.name} termurah dan bergaransi.`,
    "sku": `MKS-${product.id}`,
    "brand": {
      "@type": "Brand",
      "name": "Mesin Kasir Solo"
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "IDR",
      "price": product.price,
      "priceValidUntil": "2025-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

// --- LOCAL BUSINESS SCHEMA (For Landing Pages) ---
export const LocalBusinessSchema = ({ city }: { city: string }) => {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ComputerStore",
        "name": `Mesin Kasir Solo - Area ${city}`,
        "image": "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800",
        "url": window.location.href,
        "telephone": "+6282325103336",
        "priceRange": "$$",
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
            "latitude": -7.55,
            "longitude": 110.75
        },
        "areaServed": {
            "@type": "City",
            "name": city
        },
        "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            "opens": "08:00",
            "closes": "17:00"
        }
    };

    return (
        <Helmet>
            <script type="application/ld+json">
                {JSON.stringify(schema)}
            </script>
        </Helmet>
    );
};
