import { ShoppingBag, ImageIcon, FileText, Zap, Layout } from 'lucide-react';

/**
 * Mendeteksi tipe halaman berdasarkan path URL untuk keperluan UI Analytics
 */
export const getPageContext = (path: string) => {
    const lowerPath = path.toLowerCase();
    
    if (lowerPath.includes('/shop/')) {
        return { icon: ShoppingBag, label: 'PRODUK', color: 'text-green-400 border-green-500/20 bg-green-500/10' };
    }
    if (lowerPath.includes('/gallery/')) {
        return { icon: ImageIcon, label: 'PROYEK', color: 'text-purple-400 border-purple-500/20 bg-purple-500/10' };
    }
    if (lowerPath.includes('/articles/')) {
        return { icon: FileText, label: 'ARTIKEL', color: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' };
    }
    if (lowerPath.includes('/services/')) {
        return { icon: Zap, label: 'JASA', color: 'text-blue-400 border-blue-500/20 bg-blue-500/10' };
    }
    
    return { icon: Layout, label: 'PAGE', color: 'text-gray-400 border-gray-500/20 bg-gray-500/10' };
};