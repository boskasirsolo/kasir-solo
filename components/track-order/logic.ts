
import React, { useState } from 'react';
import { supabase } from '../../utils';
import { OrderResult } from './types';

export const useTrackOrder = () => {
    const [orderId, setOrderId] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<OrderResult | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        const inputVal = orderId.trim().toUpperCase();
        
        if (!inputVal) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        try {
            if (!supabase) throw new Error("Database not connected");

            // SEARCH STRATEGY:
            // Karena ID kita sekarang "Virtual" (Kategori-Tanggal-Scramble),
            // kita cari di 'orders' yang ID-nya (atau metadata-nya) cocok.
            // Di sini kita coba bersihin non-digit dan ambil 4 digit terakhir sebagai fallback.
            const cleanDigits = inputVal.replace(/\D/g, '');
            const potentialId = parseInt(cleanDigits.slice(-4));

            const { data: order, error: orderErr } = await supabase
                .from('orders')
                .select('*')
                .eq('id', potentialId) // Fallback ke ID database
                .maybeSingle();

            if (orderErr) throw orderErr;

            if (!order) {
                setError("Pesanan ga ketemu, Bos. Cek lagi kodenya di WA.");
            } else {
                const { data: items, error: itemsErr } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);
                
                if (itemsErr) console.error("Items Error:", itemsErr);
                setResult({ order, items: items || [] });
            }
        } catch (err: any) {
            console.error("Tracking Error:", err);
            setError("Gagal narik data. Server lagi overload, coba 1 menit lagi.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text: string, label: string = "Teks") => {
        navigator.clipboard.writeText(text);
        alert(`${label} berhasil disalin!`);
    };

    return {
        orderId, setOrderId,
        loading,
        result,
        error,
        handleSearch,
        copyToClipboard
    };
};
