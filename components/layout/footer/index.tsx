
import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Youtube, Linkedin, Video } from 'lucide-react';
import { SiteConfig } from '../../types';
import { BrandColumn, FooterBottom } from './organisms';
import { FooterColumn, ContactItem } from './molecules';
import { SectionTitle } from './atoms';

export const FooterContainer: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <footer className="bg-brand-dark border-t border-white/5 py-12 md:py-16 mt-20 relative overflow-hidden">
    {/* Decorative Top Line */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-brand-orange to-transparent shadow-neon opacity-70"></div>
    
    <div className="container mx-auto px-4">
        {children}
    </div>
  </footer>
);

export const Footer = ({ setPage, config }: { setPage: (p: string) => void, config: SiteConfig }) => {
  
  const solutionsLinks = [
    { label: 'Hardware Kasir', action: () => setPage('shop') },
    { label: 'Inovasi Aplikasi', action: () => setPage('innovation') },
    { label: 'Jasa Website', action: () => setPage('services/website') },
    { label: 'Jasa SEO', action: () => setPage('services/seo') },
    { label: 'Maintenance', action: () => setPage('services/maintenance') },
  ];

  const companyLinks = [
    { label: 'Cek Resi Pesanan', action: () => setPage('track-order') },
    { label: 'Download Center', action: () => setPage('support') },
    { label: 'Klien & Portfolio', action: () => setPage('gallery') },
    { label: 'Profil Perusahaan', action: () => setPage('about') },
    { label: 'Hubungi', action: () => setPage('contact') },
  ];

  const socialLinks = [
    { icon: Instagram, url: config.instagramUrl, label: "Instagram" },
    { icon: Facebook, url: config.facebookUrl, label: "Facebook" },
    { icon: Youtube, url: config.youtubeUrl, label: "YouTube" },
    { icon: Linkedin, url: config.linkedinUrl, label: "LinkedIn" },
    { icon: Video, url: config.tiktokUrl, label: "TikTok" },
  ];

  return (
    <FooterContainer>
      {/* Outer Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-x-8 md:gap-y-16 lg:gap-8">
        
        {/* 1. Brand Section */}
        <BrandColumn 
          description="Mitra teknologi terpercaya untuk digitalisasi bisnis di Indonesia. Menyediakan solusi Hardware POS, Software SaaS, dan Jasa Pengembangan Website sejak 2015."
          socials={socialLinks}
          config={config} 
        />
        
        {/* 2. Solusi Bisnis Section */}
        <FooterColumn title="Solusi Digital" links={solutionsLinks} />

        {/* 3. Perusahaan Section */}
        <FooterColumn title="Perusahaan & Support" links={companyLinks} />

        {/* 4. Contact Section - Set to full width (col-span-2) on tablet (md) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <SectionTitle>Hubungi Kami</SectionTitle>
          <ul className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-8 md:gap-4 lg:gap-5">
            <ContactItem 
              icon={MapPin}
              label="KANTOR LEGAL"
              value={config.addressSolo || "Perum Graha Tiara 2 B1, Kartasura"}
              onClick={() => window.open(config.mapSoloLink, '_blank')}
            />
            <ContactItem 
              icon={MapPin}
              label="KANTOR OPERASIONAL"
              value={config.addressBlora || "Gumiring 04/04, Banjarejo"}
              onClick={() => window.open(config.mapBloraLink, '_blank')}
            />
            <ContactItem 
              icon={Phone}
              label="HOTLINE (24/7)"
              value={config.whatsappNumber ? (config.whatsappNumber.startsWith('62') ? `+${config.whatsappNumber}` : config.whatsappNumber) : "0823 2510 3336"}
              onClick={() => window.open(`https://wa.me/${config.whatsappNumber}`, '_blank')}
            />
          </ul>
        </div>
      </div>

      {/* 5. Bottom Bar */}
      <FooterBottom 
        year={new Date().getFullYear()} 
        onLegalClick={setPage}
      />
    </FooterContainer>
  );
};
