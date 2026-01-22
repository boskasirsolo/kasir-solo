
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Image as ImageIcon, Loader2, Database, Trash2 } from 'lucide-react';
import { supabase } from '../../utils';

interface MediaLibraryProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export const MediaLibraryModal = ({ onSelect, onClose }: MediaLibraryProps) => {
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchMedia = async () => {
            if (!supabase) return;
            setLoading(true);
            try {
                // Tarik langsung dari Registry (Optimized O(1) table scan)
                const { data, error } = await supabase
                    .from('media_assets')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setAssets(data || []);
            } catch (e) {
                console.error("Media fetch error", e);
            } finally {
                setLoading(false);
            }
        };
        fetchMedia();
    }, []);

    const filteredAssets = assets.filter(a => 
        (a.file_name?.toLowerCase() || '').includes(search.toLowerCase()) || 
        a.url.toLowerCase().includes(search.toLowerCase())
    );

    const deleteAsset = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (!confirm("Hapus aset ini dari server?")) return;
        setAssets(p => p.filter(a => a.id !== id));
        if (supabase) await supabase.from('media_assets').delete().eq('id', id);
    };

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fade-in">
            <div className="bg-brand-dark border border-white/10 rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
                
                {/* HEADER */}
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-brand-card">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-orange/10 rounded-lg text-brand-orange border border-brand-orange/20">
                            <Database size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-black text-sm uppercase tracking-widest leading-none">Asset Registry</h3>
                            <p className="text-[10px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">Total: {assets.length} Files Linked</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-gray-500 hover:text-red-500 rounded-full transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* SEARCH TOOLBAR */}
                <div className="p-4 bg-brand-dark/50 border-b border-white/5">
                    <div className="relative group">
                        <Search size={16} className="absolute left-4 top-3 text-gray-600 group-focus-within:text-brand-orange transition-colors"/>
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari nama file atau URL asset..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-brand-orange/50 transition-all placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {/* GRID CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-black/10">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center h-full gap-4">
                            <Loader2 size={40} className="animate-spin text-brand-orange opacity-50"/>
                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Scanning Registry...</p>
                        </div>
                    ) : filteredAssets.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full opacity-20">
                            <ImageIcon size={64} className="mb-4" />
                            <p className="font-black uppercase tracking-widest">Registry Kosong, Bos.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {filteredAssets.map((asset) => (
                                <div 
                                    key={asset.id} 
                                    onClick={() => onSelect(asset.url)}
                                    className="group aspect-square bg-black border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-brand-orange transition-all relative shadow-lg"
                                >
                                    <img src={asset.url} alt="media" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110"/>
                                    
                                    {/* Info Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                        <p className="text-[8px] font-bold text-white truncate mb-1">{asset.file_name}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[7px] font-black text-brand-orange bg-black/60 px-1 rounded uppercase">{asset.file_size}</span>
                                            <button onClick={(e) => deleteAsset(e, asset.id)} className="p-1 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded transition-colors">
                                                <Trash2 size={10} />
                                            </button>
                                        </div>
                                    </div>
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
