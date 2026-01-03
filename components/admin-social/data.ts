
import { SocialContentItem } from './types';

// VIRTUAL DATABASE FOR SERVICES
// Ini data statis yang "pura-pura" jadi database biar bisa dipick
export const SERVICE_CATALOG: SocialContentItem[] = [
    {
        id: 'srv-web',
        type: 'service',
        title: 'Jasa Pembuatan Website',
        description: 'Bikin website toko online atau company profile yang SEO Friendly. Desain premium, loading cepat, dan terintegrasi WhatsApp.',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        url: 'https://kasirsolo.com/services/website'
    },
    {
        id: 'srv-app',
        type: 'service',
        title: 'Custom Web App (ERP)',
        description: 'Sistem manajemen bisnis custom. Kelola stok, keuangan, dan karyawan dalam satu dashboard terpusat. Aset milik Anda selamanya.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        url: 'https://kasirsolo.com/services/webapp'
    },
    {
        id: 'srv-seo',
        type: 'service',
        title: 'Jasa SEO & Traffic',
        description: 'Dominasi halaman 1 Google. Datangkan pelanggan potensial secara organik tanpa bakar uang iklan terus-menerus.',
        image: 'https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?auto=format&fit=crop&q=80&w=800',
        url: 'https://kasirsolo.com/services/seo'
    },
    {
        id: 'srv-maint',
        type: 'service',
        title: 'Maintenance & Security',
        description: 'Asuransi digital untuk website Anda. Backup rutin, update security, dan monitoring 24/7 agar bisnis tidak terganggu hacker.',
        image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800',
        url: 'https://kasirsolo.com/services/maintenance'
    }
];
