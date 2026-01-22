
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../../utils';

export interface MediaAsset {
    id: string;
    created_at: string;
    url: string;
    storage_path: string;
    file_name: string;
    file_size: string;
    mime_type: string;
    usage_count?: number;
}

export const useMediaVault = () => {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'image' | 'pdf' | 'other'>('all');
    const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        if (!supabase) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('media_assets')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setAssets(data || []);
        } catch (e) {
            console.error("DAM Fetch Error", e);
        } finally {
            setLoading(false);
        }
    };

    const deleteAsset = async (id: string) => {
        if (!confirm("Hapus aset ini dari registry?")) return;
        try {
            const { error } = await supabase!.from('media_assets').delete().eq('id', id);
            if (error) throw error;
            setAssets(prev => prev.filter(a => a.id !== id));
            if (selectedAsset?.id === id) setSelectedAsset(null);
        } catch (e) {
            alert("Gagal hapus aset.");
        }
    };

    const filteredAssets = useMemo(() => {
        return assets.filter(a => {
            const matchesSearch = (a.file_name || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'all' || 
                                (filterType === 'image' && a.mime_type?.startsWith('image/')) ||
                                (filterType === 'pdf' && a.mime_type === 'application/pdf') ||
                                (filterType === 'other' && !a.mime_type?.startsWith('image/') && a.mime_type !== 'application/pdf');
            return matchesSearch && matchesType;
        });
    }, [assets, searchTerm, filterType]);

    const stats = useMemo(() => {
        const totalSize = assets.reduce((acc, a) => {
            const size = parseFloat(a.file_size || '0');
            return acc + size;
        }, 0);
        return {
            totalCount: assets.length,
            totalSize: `${totalSize.toFixed(1)} MB`,
            imageCount: assets.filter(a => a.mime_type?.startsWith('image/')).length
        };
    }, [assets]);

    return {
        state: { assets, loading, searchTerm, filterType, selectedAsset, filteredAssets, stats },
        actions: { setSearchTerm, setFilterType, setSelectedAsset, deleteAsset, refresh: fetchAssets }
    };
};
