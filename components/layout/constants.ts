
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Beranda' },
  { 
    id: 'company', 
    label: 'Tentang',
    children: [
      { id: 'about', label: 'Profil Perusahaan' },
      { id: 'about/vision', label: 'Visi & Misi' }, 
      { id: 'career', label: 'Rekrutmen' },
      { id: 'gallery', label: 'Klien & Portfolio' },
      { id: 'contact', label: 'Hubungi Gue' },
    ]
  },
  { 
    id: 'solutions', 
    label: 'Solusi Bisnis',
    children: [
      { id: 'shop', label: 'Hardware Kasir (POS)' },
      { id: 'services/website', label: 'Jasa Pembuatan Website' },
      { id: 'services/webapp', label: 'Custom Web App (Jasa)' },
      { id: 'services/seo', label: 'Optimasi SEO & Traffic' },
    ]
  },
  {
    id: 'inovasi',
    label: 'Inovasi',
    children: [
        { id: 'inovasi/sibos', label: 'SIBOS (Smart Kasir)' },
        { id: 'inovasi/qalam', label: 'QALAM (Sekolah)' },
        { id: 'inovasi/dapur-sppg-mbg', label: 'DAPUR SPPG (MBG) 🆕' },
    ]
  },
  { 
    id: 'support', 
    label: 'Pusat Bantuan',
    children: [
      { id: 'support', label: 'Download & Support Center' }, 
      { id: 'track-order', label: 'Lacak Status Pesanan' },
      { id: 'legal/refund', label: 'Klaim Garansi & Retur' },
      { id: 'legal/privacy', label: 'Kebijakan Privasi' },
      { id: 'legal/terms', label: 'Syarat & Ketentuan' },
    ]
  },
  { id: 'articles', label: 'Wawasan' },
];
