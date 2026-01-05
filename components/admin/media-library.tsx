
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../../utils';

interface MediaLibraryProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export const MediaLibraryModal = ({ onSelect, onClose }: MediaLibraryProps) => {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchMedia = async () => {
            if (!supabase) return;
            setLoading(true);
            try {
                // 1. Fetch from multiple tables to build a "virtual library" of used assets
                const [products, articles, gallery] = await Promise.all([
                    supabase.from('products').select('image_url, gallery_images'),
                    supabase.from('articles').select('image_url'),
                    supabase.from('gallery').select('image_url, gallery_images')
                ]);

                const urls = new Set<string>();

                products.data?.forEach((p: any) => {
                    if (p.image_url) urls.add(p.image_url);
                    if (Array.isArray(p.gallery_images)) p.gallery_images.forEach((img: string) => urls.add(img));
                });

                articles.data?.forEach((a: any) => {
                    if (a.image_url) urls.add(a.image_url);
                });

                gallery.data?.forEach((g: any) => {
                    if (g.image_url) urls.add(g.image_url);
                    if (Array.isArray(g.gallery_images)) g.gallery_images.forEach((img: string) => urls.add(img));
                });

                setImages(Array.from(urls).filter(url => url && !url.includes('placeholder') && url.startsWith('http')));
            } catch (e) {
                console.error("Media fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const filteredImages = images.filter(url => url.toLowerCase().includes(search.toLowerCase()));

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in">
            <div className="bg-brand-dark border border-white/10 rounded-2xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-brand-card">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                        <ImageIcon size={16} className="text-brand-orange"/> Media Library
                    </h3>
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Toolbar */}
                <div className="p-4 bg-brand-dark border-b border-white/5">
                    <div className="relative">
                        <Search size={14} className="absolute left-3 top-3 text-gray-500"/>
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari URL gambar..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-xs text-white focus:border-brand-orange outline-none"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/20">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 size={32} className="animate-spin text-brand-orange"/>
                        </div>
                    ) : filteredImages.length === 0 ? (
                        <div className="text-center text-gray-500 py-20 text-xs">Tidak ada media ditemukan.</div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {filteredImages.map((url, idx) => (
                                <div 
                                    key={idx} 
                                    onClick={() => onSelect(url)}
                                    className="aspect-square bg-black border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-brand-orange group relative"
                                >
                                    <img src={url} alt="media" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};
