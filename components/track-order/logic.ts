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
        const cleanId = orderId.trim().replace('#', '');
        
        if (!cleanId) return;
        
        setLoading(true);
        setError('');
        setResult(null);

        try {
            if (!supabase) throw new Error("Database not connected");

            // 1. Fetch Order Head
            const { data: order, error: orderErr } = await supabase
                .from('orders')
                .select('*')
                .eq('id', cleanId)
                .maybeSingle();

            if (orderErr) throw orderErr;

            if (!order) {
                setError("Pesanan ga ketemu, Bos. Coba cek lagi Order ID di WhatsApp lo.");
            } else {
                // 2. Fetch Order Items
                const { data: items, error: itemsErr } = await supabase
                    .from('order_items')
                    .select('*')
                    .eq('order_id', order.id);
                
                if (itemsErr) console.error("Items Error:", itemsErr);

                setResult({ order, items: items || [] });
            }
        } catch (err: any) {
            console.error("Catch Error:", err);
            if (err.message && err.message.includes('invalid input syntax')) {
                setError("Format ID salah. ID harusnya angka doang.");
            } else {
                setError("Gagal loading data. Sinyal lo jelek atau server gue yang lagi bengong.");
            }
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